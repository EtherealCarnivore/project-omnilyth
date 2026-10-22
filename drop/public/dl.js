import {
  TAG, importKey, parseHeader, decryptRecord, unb64url, fmtBytes, fmtCountdown,
} from '/crypto.js';
import { addRecent, getRecent, renderRecent, stopRecent } from '/recent.js';

const $ = (id) => document.getElementById(id);
const screens = ['s-load', 's-file', 's-dl', 's-ok', 's-gone', 's-recent'];
let current = 's-load';
let before = 's-load';
function show(id) {
  if (id !== 's-recent') stopRecent();
  current = id;
  for (const s of screens) $(s).classList.toggle('active', s === id);
  refreshRecentCount();
}
function refreshRecentCount() { $('recent-n').textContent = getRecent().length; }
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

$('recent-btn').addEventListener('click', () => {
  if (current === 's-dl') return;
  if (current === 's-recent') { show(before); return; }
  before = current;
  show('s-recent');
  renderRecent($('recent-list'), { toast });
});
$('recent-back').addEventListener('click', () => show(before));
refreshRecentCount();
setInterval(refreshRecentCount, 5000);

const id = location.pathname.split('/')[2] || '';
const fragment = location.hash.slice(1);
const canStream = typeof window.showSaveFilePicker === 'function';

let meta = null;
let header = null;
let key = null;
let fileName = 'file';

boot().catch((err) => gone(err.message));

async function boot() {
  if (!id || !fragment) return gone('This link is incomplete. Make sure you copied the whole thing, including the part after #.');
  key = await importKey(unb64url(fragment), 'decrypt');

  const mres = await fetch('/api/file/' + id + '/meta');
  if (!mres.ok) return gone();
  meta = await mres.json();

  const hres = await fetch('/api/file/' + id + '/head');
  if (!hres.ok) return gone();
  header = parseHeader(new Uint8Array(await hres.arrayBuffer()));
  if (!header) return gone('Corrupt file header.');
  try {
    fileName = new TextDecoder().decode(await decryptRecord(key, header.nonce, 0, header.encName));
  } catch {
    return gone('Wrong key. The link was altered or truncated.');
  }

  $('name').textContent = fileName;
  $('size').textContent = '~' + fmtBytes(plainSize(meta.size, header));
  $('hint').textContent = canStream
    ? 'Decrypted in your browser and written straight to disk.'
    : 'Decrypted in your browser. Chrome or Edge can stream larger files to disk directly.';
  addRecent({ id, kind: 'received', name: fileName, size: plainSize(meta.size, header), link: location.href, expiresAt: meta.expiresAt });
  startCountdown(meta.expiresAt);
  show('s-file');
}

$('save').addEventListener('click', async () => {
  // Must call showSaveFilePicker inside the click handler to keep user activation.
  let writable = null;
  if (canStream) {
    try {
      const handle = await window.showSaveFilePicker({ suggestedName: fileName });
      writable = await handle.createWritable();
    } catch (err) {
      if (err.name === 'AbortError') return; // user cancelled the picker
      writable = null; // fall through to the blob path
    }
  }
  $('dl-name').textContent = fileName;
  setProgress(0);
  show('s-dl');
  try {
    await download(writable);
    $('ok-name').textContent = fileName;
    show('s-ok');
  } catch (err) {
    if (writable) await writable.abort().catch(() => {});
    gone(err.message || String(err));
  }
});

async function download(writable) {
  const res = await fetch('/api/file/' + id);
  if (!res.ok) throw new Error('File is no longer available.');
  const total = Number(res.headers.get('Content-Length') || meta.size);
  const recordLen = header.chunkSize + TAG;

  const chunks = [];
  let buf = new Uint8Array(0);
  let received = 0;
  let index = 1;
  let headerDone = false;

  const emit = async (plain) => (writable ? writable.write(plain) : chunks.push(plain));

  const reader = res.body.getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf = concat(buf, value);
    received += value.length;

    if (!headerDone) {
      const h = parseHeader(buf);
      if (!h) continue;
      buf = buf.subarray(h.headerLen);
      headerDone = true;
    }
    while (buf.length >= recordLen) {
      await emit(await decryptRecord(key, header.nonce, index++, buf.subarray(0, recordLen)));
      buf = buf.subarray(recordLen);
    }
    setProgress(received / total);
  }
  if (buf.length) {
    if (buf.length < TAG + 1) throw new Error('Truncated file.');
    await emit(await decryptRecord(key, header.nonce, index++, buf));
  }
  setProgress(1);

  if (writable) {
    await writable.close();
  } else {
    const url = URL.createObjectURL(new Blob(chunks));
    const a = Object.assign(document.createElement('a'), { href: url, download: fileName });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

function concat(a, b) {
  if (a.length === 0) return b;
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

function plainSize(cipherSize, h) {
  const body = cipherSize - h.headerLen;
  const records = Math.ceil(body / (h.chunkSize + TAG));
  return Math.max(0, body - records * TAG);
}

function setProgress(frac) {
  $('bar').style.width = (frac * 100).toFixed(1) + '%';
  $('pct').textContent = Math.round(frac * 100) + '%';
  $('stage').textContent = frac >= 1 ? 'Done' : 'Downloading…';
}

function gone(msg) {
  if (msg) $('gone-msg').textContent = msg;
  show('s-gone');
}

function startCountdown(expiresAt) {
  const tick = () => {
    const left = expiresAt - Date.now();
    $('cd').textContent = fmtCountdown(left);
    if (left <= 0) { clearInterval(t); if ($('s-file').classList.contains('active')) gone(); }
  };
  tick();
  const t = setInterval(tick, 500);
}
