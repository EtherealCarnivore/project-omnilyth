import {
  CHUNK_SIZE, randomKey, randomNonce, importKey, buildHeader, encryptRecord,
  b64url, fmtBytes, fmtCountdown,
} from '/crypto.js';
import { addRecent, getRecent, renderRecent, stopRecent } from '/recent.js';

const PART_BYTES = 8 * 1024 * 1024; // every R2 part except the last must be the same size
const PART_RETRIES = 4;

const $ = (id) => document.getElementById(id);
const screens = ['s-pick', 's-up', 's-done', 's-err', 's-recent'];
let abort = null;
let cdTimer = null;
let current = 's-pick';
let before = 's-pick';

function show(id) {
  if (id !== 's-recent') stopRecent();
  current = id;
  for (const s of screens) $(s).classList.toggle('active', s === id);
  refreshRecentCount();
}

function refreshRecentCount() {
  $('recent-n').textContent = getRecent().length;
}

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

// ---------------------------------------------------------------- boot

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

$('pick').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', () => {
  const f = $('file').files[0];
  if (f) start(f);
  $('file').value = '';
});
$('cancel').addEventListener('click', () => abort?.abort());
$('again').addEventListener('click', () => { clearInterval(cdTimer); show('s-pick'); });
$('retry').addEventListener('click', () => show('s-pick'));
$('logout').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  location.replace('/login');
});
$('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('link').textContent); toast('Copied'); }
  catch { toast('Copy failed, long-press the link'); }
});
$('share').addEventListener('click', async () => {
  try { await navigator.share({ title: 'Omnilyth Drop', url: $('link').textContent }); } catch {}
});
if (navigator.share) $('share').hidden = false;

$('recent-btn').addEventListener('click', () => {
  if (current === 's-up') return; // don't leave an upload in progress
  if (current === 's-recent') { show(before); return; }
  before = current;
  show('s-recent');
  renderRecent($('recent-list'), { toast });
});
$('recent-back').addEventListener('click', () => show(before));
refreshRecentCount();
setInterval(refreshRecentCount, 5000);

// File arriving via the Android share sheet (see sw.js).
if (new URLSearchParams(location.search).get('share') === '1') {
  history.replaceState(null, '', '/');
  caches.open('drop-share').then(async (c) => {
    const res = await c.match('/shared-file');
    if (!res) return;
    await c.delete('/shared-file');
    const blob = await res.blob();
    const name = decodeURIComponent(res.headers.get('x-name') || 'shared-file');
    start(new File([blob], name, { type: res.headers.get('content-type') || '' }));
  }).catch(() => {});
}

// ---------------------------------------------------------------- upload

async function start(file) {
  abort = new AbortController();
  const { signal } = abort;
  $('up-name').textContent = file.name;
  $('up-size').textContent = fmtBytes(file.size);
  setProgress(0, 'Starting…');
  show('s-up');

  let wake = null;
  try { wake = await navigator.wakeLock?.request('screen'); } catch {}

  let id = null;
  try {
    const rawKey = randomKey();
    const key = await importKey(rawKey, 'encrypt');
    const nonce = randomNonce();

    const res = await api('/api/upload/create', { method: 'POST', body: JSON.stringify({ size: file.size }), signal });
    id = res.id;

    const parts = [];
    let partBuf = new Uint8Array(PART_BYTES);
    let partLen = 0;
    let partNo = 1;
    let read = 0;

    async function flush(final) {
      if (partLen === 0) return;
      const body = final ? partBuf.subarray(0, partLen) : partBuf;
      const r = await putPart(id, partNo, body, signal);
      parts.push({ partNumber: partNo, etag: r.etag });
      partNo++;
      partLen = 0;
      if (!final) partBuf = new Uint8Array(PART_BYTES); // fresh buffer; the old one may still be in flight
    }

    async function write(bytes) {
      let off = 0;
      while (off < bytes.length) {
        const n = Math.min(bytes.length - off, PART_BYTES - partLen);
        partBuf.set(bytes.subarray(off, off + n), partLen);
        partLen += n;
        off += n;
        if (partLen === PART_BYTES) await flush(false);
      }
    }

    await write(await buildHeader(key, nonce, file.name, Math.ceil(file.size / CHUNK_SIZE)));

    let index = 1;
    for (let off = 0; off < file.size; off += CHUNK_SIZE, index++) {
      if (signal.aborted) throw new DOMException('aborted', 'AbortError');
      const plain = new Uint8Array(await file.slice(off, off + CHUNK_SIZE).arrayBuffer());
      await write(await encryptRecord(key, nonce, index, plain));
      read += plain.length;
      setProgress(read / file.size, 'Uploading…');
    }
    await flush(true);

    setProgress(1, 'Finishing…');
    const done = await api('/api/upload/' + id + '/complete', { method: 'POST', body: JSON.stringify({ parts }), signal });

    const link = location.origin + '/d/' + id + '#' + b64url(rawKey);
    $('link').textContent = link;
    addRecent({ id, kind: 'sent', name: file.name, size: file.size, link, expiresAt: done.expiresAt });
    startCountdown(done.expiresAt);
    show('s-done');
  } catch (err) {
    if (id) fetch('/api/upload/' + id + '/abort', { method: 'POST' }).catch(() => {});
    if (err.name === 'AbortError') { show('s-pick'); return; }
    if (err.status === 401) { location.replace('/login'); return; }
    $('err-msg').textContent = err.message || String(err);
    show('s-err');
  } finally {
    wake?.release().catch(() => {});
  }
}

function setProgress(frac, stage) {
  $('bar').style.width = (frac * 100).toFixed(1) + '%';
  $('pct').textContent = Math.round(frac * 100) + '%';
  $('stage').textContent = stage;
}

async function putPart(id, n, body, signal) {
  let lastErr;
  for (let attempt = 1; attempt <= PART_RETRIES; attempt++) {
    try {
      return await api('/api/upload/' + id + '/part/' + n, { method: 'PUT', body, signal, raw: true });
    } catch (err) {
      if (err.name === 'AbortError' || err.status === 401 || err.status === 404) throw err;
      lastErr = err;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  throw lastErr;
}

async function api(url, { method = 'GET', body, signal, raw = false } = {}) {
  const headers = raw ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(url, { method, body, headers, signal });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data.error || ('HTTP ' + res.status));
    e.status = res.status;
    throw e;
  }
  return data;
}

function startCountdown(expiresAt) {
  clearInterval(cdTimer);
  const tick = () => {
    const left = expiresAt - Date.now();
    $('cd').textContent = fmtCountdown(left);
    $('cd').classList.toggle('warn', left < 60_000);
    if (left <= 0) { clearInterval(cdTimer); $('cd').textContent = 'Expired'; }
  };
  tick();
  cdTimer = setInterval(tick, 500);
}
