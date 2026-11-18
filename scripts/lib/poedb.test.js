/**
 * Offline tests for scripts/lib/poedb.js — stubs globalThis.fetch, no network.
 * Run: node --test 'scripts/lib/*.test.js'
 */

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPoedbReader, PoedbError, MIN_DELAY_MS } from './poedb.js';

const URL1 = 'https://poedb.tw/us/Cluster_Jewel';
const PAGE = '<html><head><title>Cluster Jewel - PoEDB</title></head><body>Cluster Jewel mods</body></html>';
const CF = '<html><head><title>Just a moment...</title></head><body><script src="/cdn-cgi/challenge-platform/h/b/orchestrate/chl_page/v1"></script></body></html>';
const ANUBIS = '<html><body><h1>Making sure you&#39;re not a bot!</h1><script id="anubis_challenge"></script></body></html>';

const realFetch = globalThis.fetch;
let dir;
let calls;
let clock;
let sleeps;

function respond(status, body = '') {
  return { status, text: async () => body };
}
function stubFetch(...responses) {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    const r = responses.length > 1 ? responses.shift() : responses[0];
    if (r instanceof Error) throw r;
    return r;
  };
}
function reader(extra = {}) {
  return createPoedbReader({
    cacheDir: dir,
    noCache: false,
    now: () => clock,
    sleep: async (ms) => { sleeps.push(ms); clock += ms; },
    log: null,
    retryBaseMs: 10,
    ...extra,
  });
}

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'poedb-test-'));
  clock = Date.parse('2026-11-18T12:00:00Z');
  sleeps = [];
});
afterEach(async () => {
  globalThis.fetch = realFetch;
  await rm(dir, { recursive: true, force: true });
});

test('cache miss fetches, stamps provenance and writes cache; second call is a hit', async () => {
  stubFetch(respond(200, PAGE));
  const r = reader();
  const a = await r.fetchPage(URL1, { expect: 'Cluster Jewel' });
  assert.equal(a.fromCache, false);
  assert.equal(a.status, 200);
  assert.equal(a.url, URL1);
  assert.equal(a.fetchedAt, '2026-11-18T12:00:00.000Z');
  assert.equal(a.html, PAGE);
  assert.match(calls[0].init.headers['User-Agent'], /Omnilyth/);
  assert.equal((await readdir(dir)).filter((f) => f.endsWith('.json')).length, 1);

  const b = await r.fetchPage(URL1, { expect: 'Cluster Jewel' });
  assert.equal(b.fromCache, true);
  assert.equal(b.fetchedAt, a.fetchedAt);
  assert.equal(b.html, PAGE);
  assert.equal(calls.length, 1);
});

test('noCache (reader or per call) bypasses a fresh cache entry', async () => {
  stubFetch(respond(200, PAGE));
  await reader().fetchPage(URL1);
  await reader({ noCache: true }).fetchPage(URL1);
  await reader().fetchPage(URL1, { noCache: true });
  assert.equal(calls.length, 3);
});

test('TTL expiry refetches', async () => {
  stubFetch(respond(200, PAGE));
  const r = reader({ ttlMs: 60_000 });
  await r.fetchPage(URL1);
  clock += 59_000;
  assert.equal((await r.fetchPage(URL1)).fromCache, true);
  clock += 2_000;
  const c = await r.fetchPage(URL1);
  assert.equal(c.fromCache, false);
  assert.equal(calls.length, 2);
});

test('Cloudflare challenge served with 200 throws and is not cached', async () => {
  stubFetch(respond(200, CF));
  await assert.rejects(reader().fetchPage(URL1), (e) => e instanceof PoedbError && e.reason === 'challenge' && e.url === URL1);
  assert.equal(calls.length, 1, 'challenge is not retried');
  assert.deepEqual((await readdir(dir)).filter((f) => f.endsWith('.json')), []);
});

test('Anubis challenge throws', async () => {
  stubFetch(respond(200, ANUBIS));
  await assert.rejects(reader().fetchPage(URL1), { reason: 'challenge' });
});

test('expect miss throws (string and RegExp) and is not cached', async () => {
  stubFetch(respond(200, PAGE));
  await assert.rejects(reader().fetchPage(URL1, { expect: 'Scarab' }), { reason: 'expect' });
  await assert.rejects(reader().fetchPage(URL1, { expect: /Thread of Hope/ }), { reason: 'expect' });
  assert.deepEqual((await readdir(dir)).filter((f) => f.endsWith('.json')), []);
});

test('a cached page that no longer satisfies a new expect is refetched', async () => {
  stubFetch(respond(200, PAGE), respond(200, PAGE + 'Scarab'));
  await reader().fetchPage(URL1);
  const p = await reader().fetchPage(URL1, { expect: 'Scarab' });
  assert.equal(p.fromCache, false);
  assert.equal(calls.length, 2);
});

test('non-200 (404) hard-fails immediately with URL + status', async () => {
  stubFetch(respond(404, 'nope'));
  await assert.rejects(reader().fetchPage(URL1), (e) => {
    assert.equal(e.status, 404);
    assert.equal(e.url, URL1);
    assert.match(e.message, /HTTP 404 .*Cluster_Jewel/);
    return true;
  });
  assert.equal(calls.length, 1);
});

test('5xx and network errors are retried, then succeed', async () => {
  stubFetch(respond(503), new TypeError('fetch failed'), respond(200, PAGE));
  const p = await reader({ retries: 2 }).fetchPage(URL1);
  assert.equal(p.html, PAGE);
  assert.equal(calls.length, 3);
});

test('retries are limited: persistent 502 throws with the last status', async () => {
  stubFetch(respond(502));
  await assert.rejects(reader({ retries: 2 }).fetchPage(URL1), { status: 502, reason: 'http' });
  assert.equal(calls.length, 3);
});

test('requests are spaced at least 500 ms apart, even if delayMs is lower', async () => {
  stubFetch(respond(200, PAGE));
  const r = reader({ delayMs: 50 });
  await r.fetchPage(URL1, { noCache: true });
  await r.fetchPage(URL1, { noCache: true });
  assert.ok(sleeps.some((ms) => ms >= MIN_DELAY_MS), `sleeps: ${sleeps}`);
});

test('refuses non-poedb hosts', async () => {
  stubFetch(respond(200, PAGE));
  await assert.rejects(reader().fetchPage('https://example.com/x'), { reason: 'host' });
  assert.equal(calls.length, 0);
});
