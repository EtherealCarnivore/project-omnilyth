// Omnilyth Drop — password-gated, client-side-encrypted, 10-minute file relay.
//
// The browser encrypts before upload (see public/crypto.js); this Worker only
// ever sees ciphertext. Uploads go through R2 multipart in equal-size parts so
// a flaky mobile connection retries one part, not the whole file.

const COOKIE = 'drop_session';
const SESSION_DAYS = 30;
const MAX_PART_BYTES = 64 * 1024 * 1024;
const HEAD_BYTES = 4096;
const UPLOAD_RECORD_TTL = 2 * 3600;   // KV lifetime of an in-progress upload record
const UPLOAD_ABANDON_MS = 3600 * 1000; // multipart uploads older than this are aborted by the sweeper

// Link-preview crawlers get an empty 204 on download links so chat apps don't unfurl them.
const PREVIEW_BOT = /discordbot|slackbot|twitterbot|facebookexternalhit|whatsapp|telegrambot|linkedinbot|skypeuripreview|googlebot|bingbot|embedly|iframely/i;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path.startsWith('/api/')) return await api(request, env, url);

      // Download page: /d/<id> -> d.html. Gated like the upload page; the login
      // page is served in place (no redirect) so the key in the URL fragment survives.
      if (path.startsWith('/d/')) {
        if (PREVIEW_BOT.test(request.headers.get('User-Agent') || '')) return new Response(null, { status: 204, headers: NOINDEX });
        if (!(await isAuthed(request, env))) return serveAsset(env, url, '/login.html', request, NOINDEX);
        return serveAsset(env, url, '/d.html', request, NOINDEX);
      }

      // Share-target POST reaching the server means the service worker
      // didn't intercept it; just land on the upload page.
      if (path === '/share') return Response.redirect(url.origin + '/', 303);

      // Upload page is gated.
      if (path === '/' || path === '/index.html') {
        if (!(await isAuthed(request, env))) return serveAsset(env, url, '/login.html', request);
        return serveAsset(env, url, '/index.html', request);
      }
      if (path === '/login') return serveAsset(env, url, '/login.html', request);

      return env.ASSETS.fetch(request);
    } catch (err) {
      return json({ error: err.message || 'internal error' }, 500);
    }
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(sweep(env));
  },
};

const NOINDEX = { 'X-Robots-Tag': 'noindex, nofollow' };

async function serveAsset(env, url, assetPath, request, extraHeaders) {
  const assetUrl = new URL(assetPath, url.origin);
  const res = await env.ASSETS.fetch(new Request(assetUrl, { headers: request.headers }));
  if (!extraHeaders) return res;
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(extraHeaders)) out.headers.set(k, v);
  return out;
}

// ---------------------------------------------------------------- API

async function api(request, env, url) {
  const seg = url.pathname.slice('/api/'.length).split('/').filter(Boolean);
  const m = request.method;

  if (seg[0] === 'login' && m === 'POST') return login(request, env, url);
  if (seg[0] === 'logout' && m === 'POST') return withCookie(json({ ok: true }), '', 0, url);
  if (seg[0] === 'me' && m === 'GET') return json({ ok: await isAuthed(request, env) }, 200);

  // Everything below requires the session cookie — uploads and downloads alike.
  if (!(await isAuthed(request, env))) return json({ error: 'unauthorized' }, 401);

  if (seg[0] === 'file' && seg[1]) {
    if (m !== 'GET') return json({ error: 'method' }, 405);
    if (seg[2] === 'meta') return fileMeta(env, seg[1]);
    if (seg[2] === 'head') return fileHead(env, seg[1]);
    if (!seg[2]) return fileGet(env, seg[1]);
  }

  if (seg[0] === 'upload') {
    if (seg[1] === 'create' && m === 'POST') return uploadCreate(request, env);
    if (seg[1] && seg[2] === 'part' && seg[3] && m === 'PUT') return uploadPart(request, env, seg[1], Number(seg[3]));
    if (seg[1] && seg[2] === 'complete' && m === 'POST') return uploadComplete(request, env, seg[1]);
    if (seg[1] && seg[2] === 'abort' && m === 'POST') return uploadAbort(env, seg[1]);
  }
  return json({ error: 'not found' }, 404);
}

// ---------------------------------------------------------------- auth

async function login(request, env, url) {
  if (env.LOGIN_LIMIT) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.LOGIN_LIMIT.limit({ key: ip });
    if (!success) return json({ error: 'too many attempts, try again in a minute' }, 429);
  }
  const body = await request.json().catch(() => ({}));
  const supplied = String(body.password || '');
  const expected = String(env.DROP_PASSWORD || '');
  if (!expected) return json({ error: 'DROP_PASSWORD is not configured' }, 500);
  if (!timingSafeEqual(supplied, expected)) {
    await new Promise((r) => setTimeout(r, 400)); // blunt brute-force damper
    return json({ error: 'wrong password' }, 401);
  }
  const exp = Date.now() + SESSION_DAYS * 86400 * 1000;
  const token = exp + '.' + (await sign(String(exp), env));
  return withCookie(json({ ok: true }), token, SESSION_DAYS * 86400, url);
}

async function isAuthed(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
  if (!match) return false;
  const [exp, sig] = match[1].split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return timingSafeEqual(sig, await sign(exp, env));
}

async function sign(msg, env) {
  const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('drop-session:' + (env.DROP_PASSWORD || '')));
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return b64url(new Uint8Array(sig));
}

function withCookie(res, value, maxAge, url) {
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  res.headers.append('Set-Cookie', COOKIE + '=' + value + '; Path=/; Max-Age=' + maxAge + '; HttpOnly; SameSite=Lax' + secure);
  return res;
}

function timingSafeEqual(a, b) {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

// ---------------------------------------------------------------- upload

async function uploadCreate(request, env) {
  const body = await request.json().catch(() => ({}));
  const size = Number(body.size || 0);
  const max = Number(env.MAX_BYTES || 0) || 1073741824;
  if (!Number.isFinite(size) || size <= 0) return json({ error: 'bad size' }, 400);
  if (size > max) return json({ error: 'file exceeds ' + max + ' bytes' }, 413);

  const id = b64url(crypto.getRandomValues(new Uint8Array(16)));
  const mpu = await env.BUCKET.createMultipartUpload(id);
  await env.KV.put('up:' + id, JSON.stringify({ uploadId: mpu.uploadId, size, createdAt: Date.now() }), { expirationTtl: UPLOAD_RECORD_TTL });
  return json({ id });
}

async function uploadPart(request, env, id, partNumber) {
  if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) return json({ error: 'bad part number' }, 400);
  const meta = await env.KV.get('up:' + id, 'json');
  if (!meta) return json({ error: 'unknown upload' }, 404);
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_PART_BYTES) return json({ error: 'part too large' }, 413);
  const bytes = await request.arrayBuffer();
  const mpu = env.BUCKET.resumeMultipartUpload(id, meta.uploadId);
  const part = await mpu.uploadPart(partNumber, bytes);
  return json({ partNumber: part.partNumber, etag: part.etag });
}

async function uploadComplete(request, env, id) {
  const meta = await env.KV.get('up:' + id, 'json');
  if (!meta) return json({ error: 'unknown upload' }, 404);
  const body = await request.json().catch(() => ({}));
  const parts = Array.isArray(body.parts) ? body.parts : [];
  if (!parts.length) return json({ error: 'no parts' }, 400);

  const mpu = env.BUCKET.resumeMultipartUpload(id, meta.uploadId);
  const obj = await mpu.complete(parts.map((p) => ({ partNumber: Number(p.partNumber), etag: String(p.etag) })));

  const ttl = Number(env.TTL_SECONDS || 600);
  const expiresAt = Date.now() + ttl * 1000;
  await env.KV.put('file:' + id, JSON.stringify({ size: obj.size, expiresAt, createdAt: Date.now() }), { expirationTtl: Math.max(60, ttl) });
  await env.KV.delete('up:' + id);
  return json({ id, size: obj.size, expiresAt });
}

async function uploadAbort(env, id) {
  const meta = await env.KV.get('up:' + id, 'json');
  if (meta) {
    await env.BUCKET.resumeMultipartUpload(id, meta.uploadId).abort().catch(() => {});
    await env.KV.delete('up:' + id);
  }
  return json({ ok: true });
}

// ---------------------------------------------------------------- download

async function liveMeta(env, id) {
  const meta = await env.KV.get('file:' + id, 'json');
  if (!meta) return null;
  if (meta.expiresAt <= Date.now()) {
    await env.BUCKET.delete(id).catch(() => {});
    await env.KV.delete('file:' + id);
    return null;
  }
  return meta;
}

async function fileMeta(env, id) {
  const meta = await liveMeta(env, id);
  if (!meta) return json({ error: 'expired or unknown' }, 404);
  return json({ id, size: meta.size, expiresAt: meta.expiresAt });
}

// First few KB so the download page can decrypt the filename before saving.
async function fileHead(env, id) {
  const meta = await liveMeta(env, id);
  if (!meta) return json({ error: 'expired or unknown' }, 404);
  const obj = await env.BUCKET.get(id, { range: { offset: 0, length: Math.min(HEAD_BYTES, meta.size) } });
  if (!obj) return json({ error: 'expired or unknown' }, 404);
  return new Response(obj.body, { headers: { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store' } });
}

async function fileGet(env, id) {
  const meta = await liveMeta(env, id);
  if (!meta) return json({ error: 'expired or unknown' }, 404);
  const obj = await env.BUCKET.get(id);
  if (!obj) return json({ error: 'expired or unknown' }, 404);
  return new Response(obj.body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(obj.size),
      'Cache-Control': 'no-store',
      'Content-Disposition': 'attachment; filename="' + id + '.odrop"',
    },
  });
}

// ---------------------------------------------------------------- sweeper

async function sweep(env) {
  const ttlMs = Number(env.TTL_SECONDS || 600) * 1000;
  const cutoff = Date.now() - ttlMs;
  let cursor;
  do {
    const page = await env.BUCKET.list({ cursor, limit: 500 });
    const stale = page.objects.filter((o) => new Date(o.uploaded).getTime() < cutoff).map((o) => o.key);
    if (stale.length) {
      await env.BUCKET.delete(stale);
      await Promise.all(stale.map((k) => env.KV.delete('file:' + k)));
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  // Abort multipart uploads the client walked away from (closed tab, retried,
  // lost connection); their parts otherwise sit in R2 until its own 7-day abort.
  const abandonBefore = Date.now() - UPLOAD_ABANDON_MS;
  let kvCursor;
  do {
    const page = await env.KV.list({ prefix: 'up:', cursor: kvCursor });
    for (const { name } of page.keys) {
      const meta = await env.KV.get(name, 'json');
      if (!meta || meta.createdAt > abandonBefore) continue;
      const id = name.slice('up:'.length);
      await env.BUCKET.resumeMultipartUpload(id, meta.uploadId).abort().catch(() => {});
      await env.KV.delete(name);
    }
    kvCursor = page.list_complete ? undefined : page.cursor;
  } while (kvCursor);
}

// ---------------------------------------------------------------- util

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
