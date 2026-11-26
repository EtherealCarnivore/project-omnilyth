/**
 * poeSession.js — dev-server-only PoE session for the trade proxy.
 *
 * Mirrors omnilyth-watcher's cookie import (src-tauri/src/cookie_import.rs):
 * reads POESESSID / POETOKEN from the browser cookie database the user already
 * has on this machine. Never opens a browser or a login page.
 *
 *   Firefox        cookies.sqlite, plaintext values.
 *   Chrome / Edge  Cookies sqlite, AES-256-GCM ("v10") with the key from
 *                  Local State, unwrapped by Windows DPAPI (via PowerShell).
 *                  Chrome's newer app-bound "v20" cookies cannot be read
 *                  outside the browser; that case reports an error.
 *
 * The session lives in the dev server's memory only (seeded from .env.local
 * POESESSID / POETOKEN). It is attached to /api/poe-trade requests by
 * vite.config.js and is never sent to the browser; the status endpoint returns
 * only a masked preview. Windows only, like the watcher.
 */

import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createDecipheriv } from 'node:crypto';

const session = { poesessid: '', poetoken: '', source: '' };

export function seedSession(env) {
  if (env.POESESSID) Object.assign(session, { poesessid: env.POESESSID, poetoken: env.POETOKEN || '', source: '.env.local' });
}

export function sessionCookie() {
  return [
    session.poesessid && `POESESSID=${session.poesessid}`,
    session.poetoken && `POETOKEN=${session.poetoken}`,
  ].filter(Boolean).join('; ');
}

function status() {
  return {
    connected: Boolean(session.poesessid),
    source: session.source,
    preview: session.poesessid ? `${session.poesessid.slice(0, 6)}…` : '',
    hasToken: Boolean(session.poetoken),
  };
}

async function openSqliteCopy(dbPath, tag) {
  const { DatabaseSync } = await import('node:sqlite');
  const tmp = join(tmpdir(), `omnilyth_${tag}_cookies_${process.pid}.sqlite`);
  try {
    copyFileSync(dbPath, tmp); // the browser may hold a lock on the live file
  } catch (err) {
    if (err.code === 'EBUSY') throw new Error(`the ${tag} cookie database is locked while ${tag} is running — close it and retry, or use Firefox`);
    throw err;
  }
  const db = new DatabaseSync(tmp, { readOnly: true });
  return {
    db,
    close() {
      db.close();
      rmSync(tmp, { force: true });
    },
  };
}

async function importFirefox() {
  const root = join(process.env.APPDATA ?? '', 'Mozilla', 'Firefox', 'Profiles');
  if (!existsSync(root)) throw new Error('Firefox is not installed (no Profiles directory found)');
  const profiles = readdirSync(root);
  const pick = (pred) => profiles.filter(pred).map((p) => join(root, p, 'cookies.sqlite')).find(existsSync);
  const dbPath = pick((p) => p.endsWith('default-release')) ?? pick((p) => p.endsWith('default')) ?? pick(() => true);
  if (!dbPath) throw new Error('No Firefox profile with a cookies database was found');

  const { db, close } = await openSqliteCopy(dbPath, 'firefox');
  try {
    const q = db.prepare(
      "SELECT value FROM moz_cookies WHERE host LIKE '%pathofexile.com' AND name = ? ORDER BY lastAccessed DESC LIMIT 1",
    );
    const poesessid = q.get('POESESSID')?.value ?? '';
    if (!poesessid) throw new Error('POESESSID not found in Firefox cookies — log in to pathofexile.com in Firefox');
    return { poesessid, poetoken: q.get('POETOKEN')?.value ?? '' };
  } finally {
    close();
  }
}

function dpapiUnprotect(blob) {
  const script =
    'Add-Type -AssemblyName System.Security;' +
    '$b=[Convert]::FromBase64String($env:OMNI_DPAPI_IN);' +
    '[Convert]::ToBase64String([Security.Cryptography.ProtectedData]::Unprotect($b,$null,"CurrentUser"))';
  const out = execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', script], {
    env: { ...process.env, OMNI_DPAPI_IN: blob.toString('base64') },
    encoding: 'utf8',
    windowsHide: true,
  });
  return Buffer.from(out.trim(), 'base64');
}

function decryptChromium(value, key) {
  const buf = Buffer.from(value);
  const version = buf.subarray(0, 3).toString('latin1');
  if (version === 'v20') throw new Error('this browser uses app-bound cookie encryption (v20), which cannot be read outside it — use Firefox or paste POESESSID into .env.local');
  if (version !== 'v10' || buf.length < 3 + 12 + 16) throw new Error(`unknown cookie encryption (${version})`);
  const nonce = buf.subarray(3, 15);
  const tag = buf.subarray(buf.length - 16);
  const decipher = createDecipheriv('aes-256-gcm', key, nonce);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(buf.subarray(15, buf.length - 16)), decipher.final()]).toString('utf8');
}

async function importChromium(vendorPath, label) {
  const base = join(process.env.LOCALAPPDATA ?? '', ...vendorPath, 'User Data');
  if (!existsSync(base)) throw new Error(`${label} is not installed`);
  const localState = JSON.parse(readFileSync(join(base, 'Local State'), 'utf8'));
  const wrapped = Buffer.from(localState?.os_crypt?.encrypted_key ?? '', 'base64');
  if (wrapped.length < 6) throw new Error('encrypted_key not found in Local State');
  const key = dpapiUnprotect(wrapped.subarray(5)); // strip the "DPAPI" prefix

  const dbPath = ['Default/Network/Cookies', 'Default/Cookies'].map((p) => join(base, p)).find(existsSync);
  if (!dbPath) throw new Error(`${label} cookies database not found`);

  const { db, close } = await openSqliteCopy(dbPath, label.toLowerCase());
  try {
    const q = db.prepare(
      "SELECT encrypted_value FROM cookies WHERE host_key LIKE '%pathofexile.com' AND name = ? ORDER BY last_access_utc DESC LIMIT 1",
    );
    const sid = q.get('POESESSID')?.encrypted_value;
    if (!sid?.length) throw new Error(`POESESSID not found — log in to pathofexile.com in ${label}`);
    const tok = q.get('POETOKEN')?.encrypted_value;
    let poetoken = '';
    try { poetoken = tok?.length ? decryptChromium(tok, key) : ''; } catch { /* optional */ }
    return { poesessid: decryptChromium(sid, key), poetoken };
  } finally {
    close();
  }
}

const IMPORTERS = {
  firefox: () => importFirefox(),
  chrome: () => importChromium(['Google', 'Chrome'], 'Chrome'),
  edge: () => importChromium(['Microsoft', 'Edge'], 'Edge'),
};

/** Vite plugin: /__dev/poe-session endpoints (serve only). */
export function poeSessionPlugin(env) {
  seedSession(env);
  return {
    name: 'omnilyth-dev-poe-session',
    apply: 'serve',
    configureServer(server) {
      // `npm run dev` listens on all interfaces (--host). The session endpoints
      // and the cookie-carrying trade proxy answer this machine only.
      // A loopback peer is not enough: a page from any other site open in the
      // same browser also connects from 127.0.0.1. So browser requests must
      // also come from the dev server's own origin (Sec-Fetch-Site / Origin),
      // and the trade proxy only forwards the search POST the tool makes.
      const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
      const deny = (res, code, msg) => {
        res.statusCode = code;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: msg }));
      };
      server.middlewares.use((req, res, next) => {
        // connect routes `use('/__dev/poe-session')` case-insensitively and
        // accepts absolute-form request lines, so match on the same view.
        let path;
        try {
          path = new URL(req.url, 'http://localhost').pathname.toLowerCase();
        } catch {
          return deny(res, 400, 'bad request');
        }
        const isSession = path.startsWith('/__dev/poe-session');
        const isTrade = path.startsWith('/api/poe-trade');
        if (!isSession && !isTrade) return next();
        if (!LOOPBACK.has(req.socket.remoteAddress)) return deny(res, 403, 'local only');
        const site = req.headers['sec-fetch-site'];
        // 'none' = typed into the address bar / bookmark; harmless for a GET.
        const sameSite = !site || site === 'same-origin' || (site === 'none' && req.method === 'GET');
        if (!sameSite) return deny(res, 403, 'same-origin only');
        const origin = req.headers.origin;
        if (origin && origin !== `http://${req.headers.host}` && origin !== `https://${req.headers.host}`) {
          return deny(res, 403, 'same-origin only');
        }
        // League names have no dots; refusing `.` and `%2e` keeps the
        // forwarded path from being normalised onto another endpoint.
        if (isTrade && !(req.method === 'POST' && /^\/api\/poe-trade\/search\/(?![^?]*%2e)[^/?#.]+(?:\?|$)/i.test(req.url))) {
          return deny(res, 404, 'only POST /api/poe-trade/search/<league> is proxied');
        }
        next();
      });

      server.middlewares.use('/__dev/poe-session', async (req, res) => {
        const send = (code, body) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        const url = new URL(req.url, 'http://localhost');
        try {
          if (req.method === 'GET') return send(200, status());
          if (req.method === 'POST' && url.pathname === '/clear') {
            Object.assign(session, { poesessid: '', poetoken: '', source: '' });
            return send(200, status());
          }
          if (req.method === 'POST' && url.pathname === '/import') {
            const browser = url.searchParams.get('browser');
            const run = IMPORTERS[browser];
            if (!run) return send(400, { error: `unknown browser "${browser}"` });
            if (process.platform !== 'win32') return send(400, { error: 'browser import is Windows-only; set POESESSID in .env.local' });
            Object.assign(session, await run(), { source: browser });
            return send(200, status());
          }
          return send(404, { error: 'not found' });
        } catch (err) {
          return send(500, { error: err.message });
        }
      });
    },
  };
}
