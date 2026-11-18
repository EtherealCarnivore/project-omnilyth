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
 *     with the URL and status (5xx / 429 / network errors are retried first,
 *     honouring Retry-After up to 120 s). Only https URLs are accepted.
 *   - A 200 / 403 / 503 whose body looks like a bot-check / challenge page
 *     (Cloudflare, Anubis, captcha on a short body) throws reason 'challenge'
 *     — never returned as data, never cached, never retried.
 *   - `expect` (string or RegExp) must match the body, or it throws. Use it:
 *     it is the only defence against a page that changed shape silently.
 *   - At least 500 ms between network requests per reader (delayMs is
 *     clamped to >= 500; concurrent calls queue). Cache hits do not wait.
 *   - A failed cache write only warns; the validated page is still returned.
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

import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_CACHE_DIR = resolve(HERE, '..', '.cache', 'poedb');
export const DEFAULT_USER_AGENT =
  'Omnilyth-Bot/1.0 (data scraper; +https://github.com/EtherealCarnivore/project-omnilyth)';
export const MIN_DELAY_MS = 500;
export const ALLOWED_HOSTS = ['poedb.tw', 'poe2db.tw'];

/**
 * Markers that identify a bot-check / challenge interstitial. Each is specific
 * to a challenge page; generic strings that also appear on normal pages (e.g.
 * Cloudflare's `/cdn-cgi/challenge-platform/scripts/jsd/` detection loader, a
 * bare "anubis") are deliberately not listed.
 */
export const CHALLENGE_MARKERS = [
  /<title>\s*Just a moment\.{0,3}\s*<\/title>/i,
  /Attention Required!\s*\|\s*Cloudflare/i,
  /cf-browser-verification|cf_chl_/i,
  /Checking (?:if the site connection is secure|your browser before accessing)/i,
  /Making sure you(?:'|&#39;|&#x27;|’)re not a bot/i,
  /id=["']anubis_challenge["']|\/\.within\.website\/x\/cmd\/anubis\//i,
  /Enable JavaScript and cookies to continue/i,
];

/** Captcha widgets: a challenge only on a short body (a real page can embed one). */
export const CAPTCHA_MARKERS = /g-recaptcha|h-captcha|hcaptcha\.com|cf-turnstile|captcha-delivery/i;
export const SHORT_BODY_BYTES = 8192;
export const MAX_RETRY_AFTER_MS = 120_000;

export class PoedbError extends Error {
  constructor(message, { url, status = null, reason, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'PoedbError';
    this.url = url;
    this.status = status;
    this.reason = reason; // 'http' | 'network' | 'challenge' | 'expect' | 'empty' | 'host' | 'url'
  }
}

/** Returns the matched challenge marker source, or null. */
export function detectChallenge(html) {
  if (!html) return null;
  for (const re of CHALLENGE_MARKERS) {
    if (re.test(html)) return re.source;
  }
  if (html.length < SHORT_BODY_BYTES && CAPTCHA_MARKERS.test(html)) {
    return `${CAPTCHA_MARKERS.source} (short body)`;
  }
  return null;
}

function matchesExpect(html, expect) {
  if (expect == null) return true;
  if (expect instanceof RegExp) {
    expect.lastIndex = 0; // /g and /y regexes are stateful across .test() calls
    return expect.test(html);
  }
  return html.includes(String(expect));
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

/** Parses Retry-After (delta-seconds or HTTP-date) to ms, capped; null if absent/invalid. */
export function parseRetryAfter(value, nowMs = Date.now()) {
  if (value == null || value === '') return null;
  let ms;
  if (/^\s*\d+\s*$/.test(value)) ms = Number(value) * 1000;
  else {
    const at = Date.parse(value);
    if (!Number.isFinite(at)) return null;
    ms = at - nowMs;
  }
  return Math.min(MAX_RETRY_AFTER_MS, Math.max(0, ms));
}

const defaultSleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Finite number >= min, else the default. */
function numOpt(value, fallback, min = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(min, value) : fallback;
}

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
 * @param {Function}[options.warn]       warning logger (default console.warn; pass null to silence)
 *
 * Non-finite numeric options (NaN, strings, Infinity) fall back to their defaults.
 */
export function createPoedbReader(options = {}) {
  const {
    cacheDir = DEFAULT_CACHE_DIR,
    noCache = process.argv.includes('--no-cache'),
    userAgent = DEFAULT_USER_AGENT,
    sleep = defaultSleep,
    now = Date.now,
    log = console.log,
    warn = console.warn,
  } = options;
  const ttlMs = numOpt(options.ttlMs, 24 * 60 * 60 * 1000);
  const gap = numOpt(options.delayMs, MIN_DELAY_MS, MIN_DELAY_MS);
  const retries = Math.floor(numOpt(options.retries, 2));
  const retryBaseMs = numOpt(options.retryBaseMs, 2000);
  const timeoutMs = numOpt(options.timeoutMs, 30000, 1);
  const fetchImpl = () => options.fetch ?? globalThis.fetch;
  let lastRequestAt = -Infinity;
  let tmpSeq = 0;

  // Book the slot synchronously before awaiting, so concurrent callers queue
  // up `gap` apart instead of all reading the same lastRequestAt.
  async function pace() {
    const at = Math.max(now(), lastRequestAt + gap);
    lastRequestAt = at;
    const wait = at - now();
    if (wait > 0) await sleep(wait);
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
    const tmp = `${file}.${process.pid}.${++tmpSeq}.${randomUUID()}.tmp`;
    const { url, fetchedAt, status, html } = page;
    try {
      await writeFile(tmp, JSON.stringify({ url, fetchedAt, status, html }));
      await rename(tmp, file);
    } catch (err) {
      await rm(tmp, { force: true }).catch(() => {});
      throw err;
    }
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
      const { status } = res;
      const retryAfterMs = parseRetryAfter(res.headers?.get?.('retry-after'), now());
      if (status === 200 || status === 403 || status === 503) {
        // 403/503 bodies are read so a challenge page can be reported as such.
        return { status, html: await res.text(), retryAfterMs };
      }
      try { await res.body?.cancel?.(); } catch { /* body already consumed/closed */ }
      return { status, html: null, retryAfterMs };
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
    let parsed;
    try {
      parsed = new URL(url);
    } catch (cause) {
      throw new PoedbError(`poedb: invalid URL ${url}`, { url, reason: 'url', cause });
    }
    if (parsed.protocol !== 'https:') {
      throw new PoedbError(`poedb: refusing non-https URL ${url}`, { url, reason: 'url' });
    }
    const host = parsed.hostname.replace(/^www\./, '');
    if (!ALLOWED_HOSTS.includes(host)) {
      throw new PoedbError(`poedb: refusing non-poedb host ${host} (${url})`, { url, reason: 'host' });
    }
    const { expect, noCache: callNoCache = false } = opts;

    if (!noCache && !callNoCache) {
      const hit = await readCache(url, expect);
      if (hit) return hit;
    }

    let lastErr;
    let retryAfterMs = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await sleep(Math.max(retryBaseMs * 2 ** (attempt - 1), retryAfterMs ?? 0));
      retryAfterMs = null;
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
        try {
          await writeCache(page);
        } catch (err) {
          warn?.(`  poedb: cache write failed for ${url}: ${err.message} (page still returned)`);
        }
        return page;
      }
      const marker = detectChallenge(result.html);
      if (marker) {
        throw new PoedbError(
          `poedb: bot-check/challenge page (HTTP ${result.status}) for ${url} (marker: ${marker})`,
          { url, status: result.status, reason: 'challenge' },
        ); // never retried
      }
      lastErr = new PoedbError(`poedb: HTTP ${result.status} for ${url}`, {
        url, status: result.status, reason: 'http',
      });
      if (!(result.status >= 500 || result.status === 429)) throw lastErr; // 4xx etc.: hard fail
      retryAfterMs = result.retryAfterMs;
    }
    throw lastErr;
  }

  return { fetchPage };
}
