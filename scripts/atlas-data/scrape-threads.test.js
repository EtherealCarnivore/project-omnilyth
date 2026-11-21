/**
 * Offline tests for scrape-threads.js: fixture pages served through the shared
 * poedb reader with a stubbed fetch; no network.
 * Run: node --test scripts/atlas-data/scrape-threads.test.js
 */

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPoedbReader, PoedbError } from '../lib/poedb.js';
import { scrapeThreads, renderThreadData, fetchNinjaJson, parseItemPage, parseRandomModsPage } from './scrape-threads.js';
import {
  buildPoedbPages, fixtureFetch, FIXTURE_GENERATED_DATE, FIXTURE_LEAGUE,
} from './scrape-threads.fixtures.js';

const COMMITTED = resolve(dirname(fileURLToPath(import.meta.url)), '../../src/data/threadData.js');

let dir;
beforeEach(async () => { dir = await mkdtemp(join(tmpdir(), 'threads-test-')); });
afterEach(async () => { await rm(dir, { recursive: true, force: true }); });

function run(fetchImpl) {
  const poedb = createPoedbReader({
    cacheDir: dir, noCache: false, fetch: fetchImpl, sleep: async () => {}, log: null, warn: null,
  });
  return scrapeThreads({
    poedb, fetchNinja: (url) => fetchNinjaJson(url, { fetchImpl }), league: FIXTURE_LEAGUE, log: null,
  });
}

test('fixture scrape reproduces the committed threadData.js byte for byte', async () => {
  const calls = [];
  const data = await run(fixtureFetch({ calls }));
  const body = renderThreadData({ ...data, league: FIXTURE_LEAGUE, today: FIXTURE_GENERATED_DATE });
  assert.equal(body, readFileSync(COMMITTED, 'utf8'));
  assert.equal(calls.length, 1 + 10 * 2 + 1, 'ninja + 10 items + 10 mod pages + Frayed');
});

test('a second run is served from the reader cache', async () => {
  await run(fixtureFetch());
  const calls = [];
  await run(fixtureFetch({ calls }));
  assert.deepEqual(calls.filter((u) => u.includes('poedb.tw')), []);
});

test('a bot-check page hard-fails through the reader', async () => {
  const pages = buildPoedbPages();
  pages.set('https://poedb.tw/us/Abyss_Thread', '<html><head><title>Just a moment...</title></head><body></body></html>');
  await assert.rejects(run(fixtureFetch({ pages })), (e) => e instanceof PoedbError && e.reason === 'challenge');
});

test('a missing page (404) hard-fails with the URL', async () => {
  const pages = buildPoedbPages();
  pages.delete('https://poedb.tw/us/Random_Legion_Thread_Modifiers');
  await assert.rejects(run(fixtureFetch({ pages })), { status: 404, url: 'https://poedb.tw/us/Random_Legion_Thread_Modifiers' });
});

test('selector misses hard-fail', () => {
  assert.throws(() => parseItemPage('<html><body>newItemPopup</body></html>', 'u', 'Abyss Thread'), /selector miss: u \.newItemPopup/);
  const html = buildPoedbPages().get('https://poedb.tw/us/Abyss_Thread');
  assert.throws(() => parseItemPage(html, 'u', 'Breach Thread'), /item name "Abyss Thread" != "Breach Thread"/);
  assert.throws(() => parseItemPage(html.replace(/NoteCode/, 'Other'), 'u', 'Abyss Thread'), /card NoteCode/);
  const empty = '<html><head><meta property="og:description" content="Rule.\nX Modifiers which can be applied by Threads:"></head></html>';
  assert.throws(() => parseRandomModsPage(empty, 'u'), /zero effects/);
});
