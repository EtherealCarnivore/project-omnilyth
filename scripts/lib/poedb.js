/**
 * poedb.js — shared, polite reader for poedb.tw (PoE 1) and poe2db.tw (PoE 2).
 *
 * Every scraper that reads poedb / poe2db should go through this module so
 * that caching, rate limiting, retry and bot-check handling behave the same
 * everywhere, and so writers can stamp `_meta` from the returned provenance.
 *
 * Usage:
 *   import { createPoedbReader } from '../lib/poedb.js';
 *   const poedb = createPoedbReader();               // honours --no-cache in argv
 *   const page = await poedb.fetchPage('https://poedb.tw/us/Scarab', {
 *     expect: /Scarab/,                                // must appear, or it throws
 *   });
 *   // page = { url, fetchedAt, status, fromCache, html }
 *
 * Guarantees:
 *   - Only status 200 is ever returned. Anything else throws `PoedbError`
 *     with the URL and status (5xx / 429 / network errors are retried first).
 *   - A 200 whose body looks like a bot-check / challenge page (Cloudflare,
 *     Anubis, captcha) throws — it is never returned as data, never cached.
 *   - `expect` (string or RegExp) must match the body, or it throws. Use it:
 *     it is the only defence against a page that changed shape silently.
 *   - At least 500 ms between network requests per reader (delayMs is
 *     clamped to >= 500). Cache hits do not wait.
 *   - Identifying User-Agent naming the project; no personal details.
 *
 * Cache: one JSON file per URL (sha256 of the URL) under `cacheDir`
 * (default `scripts/.cache/poedb/`, gitignored). Entries older than `ttlMs`
 * are refetched. Bypass with the `--no-cache` CLI flag, `noCache: true` on
 * the reader, or `{ noCache: true }` per call (a bypassed fetch still
 * refreshes the cache entry).
 *
 * Tests (offline, stubbed fetch): node --test 'scripts/lib/*.test.js'
 *   (Node >= 21 no longer expands a bare directory argument)
 * No dependencies beyond Node >= 18 built-ins.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_CACHE_DIR = resolve(HERE, '..', '.cache', 'poedb');
export const DEFAULT_USER_AGENT =
  'Omnilyth-Bot/1.0 (data scraper; +https://github.com/EtherealCarnivore/project-omnilyth)';
export const MIN_DELAY_MS = 500;
export const ALLOWED_HOSTS = ['poedb.tw', 'poe2db.tw'];

/** Markers that identify a bot-check / challenge interstitial served with 200. */
export const CHALLENGE_MARKERS = [
  /<title>\s*Just a moment\.{0,3}\s*<\/title>/i,
  /Attention Required!\s*\|\s*Cloudflare/i,
  /cf-browser-verification|cf_chl_|\/cdn-cgi\/challenge-platform\//i,
  /Checking (?:if the site connection is secure|your browser before accessing)/i,
  /\banubis\b|Making sure you(?:'|&#39;|’)re not a bot/i,
  /g-recaptcha|h-captcha|hcaptcha\.com|cf-turnstile|captcha-delivery/i,
  /Enable JavaScript and cookies to continue/i,
];

export class PoedbError extends Error {
  constructor(message, { url, status = null, reason, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'PoedbError';
    this.url = url;
    this.status = status;
    this.reason = reason; // 'http' | 'network' | 'challenge' | 'expect' | 'empty' | 'host'
  }
}

/** Returns the matched challenge marker source, or null. */
export function detectChallenge(html) {
  for (const re of CHALLENGE_MARKERS) {
    if (re.test(html)) return re.source;
  }
  return null;
}

function matchesExpect(html, expect) {
  if (expect == null) return true;
  return expect instanceof RegExp ? expect.test(html) : html.includes(String(expect));
}

/** Throws unless `html` is real page content. */
export function validatePage(url, html, expect) {
  if (!html || !html.trim()) {
    throw new PoedbError(`poedb: empty body for ${url}`, { url, status: 200, reason: 'empty' });
  }
  const marker = detectChallenge(html);
  if (marker) {
    throw new PoedbError(`poedb: bot-check/challenge page for ${url} (marker: ${marker})`, {
      url, status: 200, reason: 'challenge',
    });
  }
  if (!matchesExpect(html, expect)) {
    throw new PoedbError(`poedb: expected marker ${String(expect)} not found in ${url}`, {
      url, status: 200, reason: 'expect',
    });
  }
}

export function cacheKey(url) {
  return createHash('sha256').update(url).digest('hex');
}

const defaultSleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {object} [options]
 * @param {string}  [options.cacheDir]   cache directory (default scripts/.cache/poedb)
 * @param {number}  [options.ttlMs]      cache TTL (default 24 h)
 * @param {boolean} [options.noCache]    bypass cache reads (default: `--no-cache` in argv)
 * @param {number}  [options.delayMs]    gap between network requests (min 500)
 * @param {number}  [options.retries]    extra attempts on 5xx/429/network (default 2)
 * @param {number}  [options.retryBaseMs] backoff base, doubled per attempt (default 2000)
 * @param {number}  [options.timeoutMs]  per-request timeout (default 30 s)
 * @param {string}  [options.userAgent]
 * @param {Function}[options.fetch]      fetch implementation (default globalThis.fetch at call time)
 * @param {Function}[options.sleep]      injectable for tests
 * @param {Function}[options.now]        injectable clock (ms), for tests
 * @param {Function}[options.log]        progress logger (default console.log; pass null to silence)
 */
export function createPoedbReader(options = {}) {
  const {
    cacheDir = DEFAULT_CACHE_DIR,
    ttlMs = 24 * 60 * 60 * 1000,
    noCache = process.argv.includes('--no-cache'),
    delayMs = MIN_DELAY_MS,
    retries = 2,
    retryBaseMs = 2000,
    timeoutMs = 30000,
    userAgent = DEFAULT_USER_AGENT,
    sleep = defaultSleep,
    now = Date.now,
    log = console.log,
  } = options;
  const gap = Math.max(MIN_DELAY_MS, delayMs);
  const fetchImpl = () => options.fetch ?? globalThis.fetch;
  let lastRequestAt = -Infinity;

  async function pace() {
    const wait = lastRequestAt + gap - now();
    if (wait > 0) await sleep(wait);
    lastRequestAt = now();
  }

  async function readCache(url, expect) {
    let entry;
    try {
      entry = JSON.parse(await readFile(join(cacheDir, `${cacheKey(url)}.json`), 'utf8'));
    } catch {
      return null; // missing or unreadable → miss
    }
    if (entry?.url !== url || typeof entry.html !== 'string') return null;
    const age = now() - Date.parse(entry.fetchedAt);
    if (!(age >= 0 && age < ttlMs)) return null;
    try {
      validatePage(url, entry.html, expect);
    } catch {
      return null; // stale shape or new expect → refetch
    }
    return { url, fetchedAt: entry.fetchedAt, status: entry.status, fromCache: true, html: entry.html };
  }

  async function writeCache(page) {
    await mkdir(cacheDir, { recursive: true });
    const file = join(cacheDir, `${cacheKey(page.url)}.json`);
    const tmp = `${file}.${process.pid}.tmp`;
    const { url, fetchedAt, status, html } = page;
    await writeFile(tmp, JSON.stringify({ url, fetchedAt, status, html }));
    await rename(tmp, file);
  }

  async function fetchOnce(url) {
    await pace();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetchImpl()(url, {
        headers: { 'User-Agent': userAgent, Accept: 'text/html' },
        signal: ctrl.signal,
      });
      return { status: res.status, html: res.status === 200 ? await res.text() : null };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Fetch a poedb / poe2db page.
   * @param {string} url
   * @param {{ expect?: string|RegExp, noCache?: boolean }} [opts]
   * @returns {Promise<{url:string, fetchedAt:string, status:number, fromCache:boolean, html:string}>}
   */
  async function fetchPage(url, opts = {}) {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (!ALLOWED_HOSTS.includes(host)) {
      throw new PoedbError(`poedb: refusing non-poedb host ${host} (${url})`, { url, reason: 'host' });
    }
    const { expect, noCache: callNoCache = false } = opts;

    if (!noCache && !callNoCache) {
      const hit = await readCache(url, expect);
      if (hit) return hit;
    }

    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await sleep(retryBaseMs * 2 ** (attempt - 1));
      let result;
      try {
        log?.(`  poedb GET ${url}${attempt ? ` (retry ${attempt})` : ''}`);
        result = await fetchOnce(url);
      } catch (cause) {
        lastErr = new PoedbError(`poedb: network error for ${url}: ${cause.message}`, {
          url, reason: 'network', cause,
        });
        continue; // retry network errors
      }
      if (result.status === 200) {
        validatePage(url, result.html, expect); // throws; never retried, never cached
        const page = {
          url, fetchedAt: new Date(now()).toISOString(), status: 200, fromCache: false, html: result.html,
        };
        await writeCache(page);
        return page;
      }
      lastErr = new PoedbError(`poedb: HTTP ${result.status} for ${url}`, {
        url, status: result.status, reason: 'http',
      });
      if (!(result.status >= 500 || result.status === 429)) throw lastErr; // 4xx etc.: hard fail
    }
    throw lastErr;
  }

  return { fetchPage };
}
