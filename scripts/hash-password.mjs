#!/usr/bin/env node
// hash-password.mjs — generate a PBKDF2 password record for the Omnilyth auth
// store, matching workers/auth.js exactly. Use it to seed the first admin (or
// any user) directly via `wrangler d1 execute` before the admin endpoint exists.
//
//   node scripts/hash-password.mjs "your-temp-password"
//   -> pbkdf2$150000$<saltB64url>$<hashB64url>
//
// Then:
//   wrangler d1 execute omnilyth-auth --remote --command \
//     "INSERT INTO users (username, password, is_admin, must_reset) VALUES ('admin', '<record>', 1, 1);"

import { webcrypto as crypto } from 'node:crypto';

const PBKDF2_ITER = 150000; // keep in lockstep with workers/auth.js
const enc = new TextEncoder();

function b64url(bytes) {
  return Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function pbkdf2(password, salt, iter) {
  const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, km, 256);
  return new Uint8Array(bits);
}

const password = process.argv[2];
if (!password) {
  console.error('usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}
if (password.length < 12) {
  console.error('warning: password is shorter than the 12-char minimum the API enforces');
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const hash = await pbkdf2(password, salt, PBKDF2_ITER);
console.log(`pbkdf2$${PBKDF2_ITER}$${b64url(salt)}$${b64url(hash)}`);
