// SPDX-License-Identifier: MIT
// Copyright (c) 2024-2026 EtherealCarnivore
//
// Licensed under MIT (see workers/LICENSE), independently of the GPL-3.0
// license covering the rest of the Omnilyth repository.

/**
 * auth.js — minimal username/password auth for Omnilyth's hidden menus.
 *
 * Scope: ~5 trusted users gating a couple of hidden menus. NOT a hardened
 * identity system — no email, no refresh tokens, no account-lockout table.
 * Defense-in-depth only: PBKDF2 hashing, per-user salt, timing-safe compare,
 * stateless HMAC session tokens, and the caller's in-memory login rate limit.
 *
 * Storage: Cloudflare D1 (`env.DB`). Table `users`:
 *   username   TEXT PRIMARY KEY
 *   password   TEXT  "pbkdf2$<iter>$<saltB64url>$<hashB64url>"
 *   is_admin   INTEGER 0|1
 *   must_reset INTEGER 0|1   (1 = force a password change on next login)
 *
 * Secret: `env.AUTH_SECRET` (HMAC signing key) — `wrangler secret put AUTH_SECRET`.
 *
 * Endpoints (all POST, JSON):
 *   /auth/login              { username, password } -> { token, mustReset, isAdmin }
 *   /auth/me                 Authorization: Bearer  -> { username, isAdmin, mustReset }
 *   /auth/change-password    Authorization: Bearer + { newPassword } -> { token }
 *   /auth/admin/set-password Authorization: Bearer(admin) + { username, newPassword }
 *                            -> { ok } ; sets target password + must_reset = 1
 */

const PBKDF2_ITER = 150000;
const TOKEN_TTL_SEC = 7 * 24 * 3600;   // 7 days (normal users)
const ADMIN_TOKEN_TTL_SEC = 12 * 3600; // 12 hours (admin — smaller blast radius if a token leaks)
const MIN_PASSWORD_LEN = 12;
const MAX_PASSWORD_LEN = 1024;         // cap PBKDF2 input work on unauthenticated endpoints
const MAX_USERNAME_LEN = 64;
const enc = new TextEncoder();

// ─── encoding ────────────────────────────────────────────────────────────

function b64urlFromBytes(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function bytesFromB64url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlFromString(str) { return b64urlFromBytes(enc.encode(str)); }
function stringFromB64url(str) { return new TextDecoder().decode(bytesFromB64url(str)); }

// Constant-time comparison of two equal-length byte arrays.
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ─── password hashing (PBKDF2-SHA-256) ─────────────────────────────────────

async function pbkdf2(password, salt, iter) {
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  return new Uint8Array(bits);
}

async function makePasswordRecord(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITER);
  return `pbkdf2$${PBKDF2_ITER}$${b64urlFromBytes(salt)}$${b64urlFromBytes(hash)}`;
}

// Real-cost record verified on unknown-user logins so a failed login takes the
// same time (same iteration count + hash length) whether or not the username
// exists — defeats timing-based username enumeration.
const DUMMY_RECORD = `pbkdf2$${PBKDF2_ITER}$${b64urlFromBytes(new Uint8Array(16))}$${b64urlFromBytes(new Uint8Array(32))}`;

async function verifyPassword(password, record) {
  const parts = String(record || '').split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iter = parseInt(parts[1], 10);
  if (!Number.isFinite(iter) || iter < 1) return false;
  const salt = bytesFromB64url(parts[2]);
  const expected = bytesFromB64url(parts[3]);
  const actual = await pbkdf2(password, salt, iter);
  return timingSafeEqual(actual, expected);
}

// ─── session token (HMAC-SHA-256) ───────────────────────────────────────────

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function signToken(payload, secret) {
  const body = b64urlFromString(JSON.stringify(payload));
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(body)));
  return `${body}.${b64urlFromBytes(sig)}`;
}

async function verifyToken(token, secret, expectedVer) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const key = await hmacKey(secret);
  const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(body)));
  let given;
  try { given = bytesFromB64url(sig); } catch { return null; }
  if (!timingSafeEqual(expected, given)) return null;
  let payload;
  try { payload = JSON.parse(stringFromB64url(body)); } catch { return null; }
  if (!payload || typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
  // Global kill-switch: bump env.AUTH_TOKEN_VERSION + redeploy to invalidate
  // every outstanding token at once (no session table needed).
  if (expectedVer != null && String(payload.ver ?? '1') !== String(expectedVer)) return null;
  return payload;
}

function bearer(request) {
  const h = request.headers.get('Authorization') || '';
  return h.startsWith('Bearer ') ? h.slice(7).trim() : null;
}

// ─── D1 ──────────────────────────────────────────────────────────────────

function getUser(env, username) {
  return env.DB.prepare('SELECT username, password, is_admin, must_reset FROM users WHERE username = ?')
    .bind(username).first();
}

// ─── handlers ──────────────────────────────────────────────────────────────

export async function handleAuth(request, env, origin, corsHeaders) {
  const cors = corsHeaders(origin, 'POST');
  const json = (status, obj) =>
    new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors } });

  if (!env.DB) return json(500, { error: 'Auth not configured (no D1 binding)' });
  if (!env.AUTH_SECRET) return json(500, { error: 'Auth not configured (no AUTH_SECRET)' });

  const ver = String(env.AUTH_TOKEN_VERSION || '1');
  const expFor = (isAdmin) => Math.floor(Date.now() / 1000) + (isAdmin ? ADMIN_TOKEN_TTL_SEC : TOKEN_TTL_SEC);
  const badPwLen = (pw) => pw.length < MIN_PASSWORD_LEN || pw.length > MAX_PASSWORD_LEN;

  const path = new URL(request.url).pathname;
  let body = {};
  try { body = await request.json(); } catch { /* some routes need no body */ }

  // POST /auth/login
  if (path === '/auth/login') {
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    if (!username || !password) return json(400, { error: 'Missing credentials' });
    // Bound inputs before any PBKDF2 work (avoid unbounded hashing on an
    // unauthenticated endpoint).
    if (username.length > MAX_USERNAME_LEN || password.length > MAX_PASSWORD_LEN) {
      return json(401, { error: 'Invalid username or password' });
    }
    const user = await getUser(env, username);
    // Verify against a real-cost dummy on unknown users so login timing doesn't
    // reveal whether the username exists (same iterations + hash length).
    const ok = await verifyPassword(password, user ? user.password : DUMMY_RECORD);
    if (!user || !ok) return json(401, { error: 'Invalid username or password' });
    const isAdmin = !!user.is_admin;
    const mustReset = !!user.must_reset;
    const token = await signToken(
      { sub: username, adm: isAdmin, rst: mustReset, ver, exp: expFor(isAdmin) },
      env.AUTH_SECRET,
    );
    return json(200, { token, mustReset, isAdmin });
  }

  // POST /auth/me
  if (path === '/auth/me') {
    const payload = await verifyToken(bearer(request), env.AUTH_SECRET, ver);
    if (!payload) return json(401, { error: 'Invalid or expired token' });
    return json(200, { username: payload.sub, isAdmin: !!payload.adm, mustReset: !!payload.rst });
  }

  // POST /auth/change-password — token proves identity (incl. forced-reset flow).
  // Note: previously-issued tokens for this user remain valid until their exp
  // (stateless tokens, no session table) — acceptable for the threat model.
  // Bump env.AUTH_TOKEN_VERSION to globally invalidate if a token is known leaked.
  if (path === '/auth/change-password') {
    const payload = await verifyToken(bearer(request), env.AUTH_SECRET, ver);
    if (!payload) return json(401, { error: 'Invalid or expired token' });
    const newPassword = String(body.newPassword || '');
    if (badPwLen(newPassword)) {
      return json(400, { error: `Password must be ${MIN_PASSWORD_LEN}-${MAX_PASSWORD_LEN} characters` });
    }
    const record = await makePasswordRecord(newPassword);
    await env.DB.prepare('UPDATE users SET password = ?, must_reset = 0 WHERE username = ?')
      .bind(record, payload.sub).run();
    const token = await signToken(
      { sub: payload.sub, adm: !!payload.adm, rst: false, ver, exp: expFor(!!payload.adm) },
      env.AUTH_SECRET,
    );
    return json(200, { token, mustReset: false });
  }

  // POST /auth/admin/set-password — admin sets a target's password + forces reset
  if (path === '/auth/admin/set-password') {
    const payload = await verifyToken(bearer(request), env.AUTH_SECRET, ver);
    if (!payload || !payload.adm) return json(403, { error: 'Admin only' });
    const target = String(body.username || '').trim();
    const newPassword = String(body.newPassword || '');
    if (!target || target.length > MAX_USERNAME_LEN) return json(400, { error: 'Invalid username' });
    if (badPwLen(newPassword)) {
      return json(400, { error: `Password must be ${MIN_PASSWORD_LEN}-${MAX_PASSWORD_LEN} characters` });
    }
    const existing = await getUser(env, target);
    if (!existing) return json(404, { error: 'No such user' });
    const record = await makePasswordRecord(newPassword);
    await env.DB.prepare('UPDATE users SET password = ?, must_reset = 1 WHERE username = ?')
      .bind(record, target).run();
    return json(200, { ok: true, username: target });
  }

  return null; // not an auth route — caller falls through (e.g. to feedback)
}
