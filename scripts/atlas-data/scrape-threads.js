#!/usr/bin/env node
/*
 * scrape-threads.js: build src/data/threadData.js from poedb + poe.ninja.
 *
 * 3.30 (Covens of Umbra) removed Scarabs and added Threads in their place
 * (patch notes thread 4013680). This regenerates the whole roster: the ten
 * per-mechanic Threads plus the Frayed Thread currency.
 *
 * Sources:
 *   https://poedb.tw/us/<Name_With_Underscores>       item popup + base table
 *   https://poedb.tw/us/Random_<Mechanic>_Thread_Modifiers   og:description lists
 *     the in-game keyword-popup text of every random effect for that mechanic
 *   https://poe.ninja/poe1/api/economy/exchange/current/overview?league=<L>&type=Thread
 *     icon URLs (web.poecdn.com gen/image, hash not derivable) and ninja ids
 *
 * poedb pages go through the shared reader (scripts/lib/poedb.js): cache under
 * scripts/.cache/poedb/ (24 h; bypass with --no-cache), 600 ms between
 * requests, retry on 5xx/429, hard-fail on any other status or a bot-check
 * page. poe.ninja is not a poedb host, so it is fetched directly.
 *
 * Hard-fails on any selector miss or empty list: an empty scrape is a failure,
 * never "no changes". Never hand-edit the output; re-run this instead.
 *
 * Usage: node scripts/atlas-data/scrape-threads.js [--league Covens] [--dry] [--no-cache]
 * Tests (offline): node --test scripts/atlas-data/scrape-threads.test.js
 */

import { writeFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { createPoedbReader } from '../lib/poedb.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../../src/data/threadData.js');
const NINJA_UA = 'Mozilla/5.0 (compatible; data-refresh client)';
const DELAY_MS = 600;
export const PATCH = '3.30.0b';
export const THREAD_USAGE = 'Can be used in a personal Map Device to add content to a Map.';
const MODS_HEADER = 'Modifiers which can be applied by Threads:';

export const MECHANICS = [
  'Abyss', 'Bestiary', 'Betrayal', 'Blight', 'Breach',
  'Expedition', 'Incursion', 'Legion', 'Ritual', 'Ultimatum',
];

export const itemUrl = (name) => `https://poedb.tw/us/${name.replace(/ /g, '_')}`;
export const randomModsUrl = (mechanic) => `https://poedb.tw/us/Random_${mechanic}_Thread_Modifiers`;
export const ninjaUrl = (league) =>
  `https://poe.ninja/poe1/api/economy/exchange/current/overview?league=${encodeURIComponent(league)}&type=Thread`;

function fail(msg) {
  throw new Error(`selector miss: ${msg} (a stale cached page? re-run with --no-cache)`);
}

const clean = (s) => s.replace(/\s+/g, ' ').trim();

/** Read the name/value cards (DropLevel, Type, Tags, ...) under the item popup. */
function readCards(doc) {
  const out = {};
  for (const card of doc.querySelectorAll('.card.name-value')) {
    const name = card.querySelector('.name')?.childNodes[0]?.textContent?.trim();
    const value = card.querySelector('.value')?.textContent?.trim();
    if (name && value !== undefined && !(name in out)) out[name] = value;
  }
  return out;
}

/** Parse a poedb item page (popup + name/value cards). Pure: no I/O. */
export function parseItemPage(html, url, name) {
  const doc = new JSDOM(html).window.document;
  const popup = doc.querySelector('.newItemPopup');
  if (!popup) fail(`${url} .newItemPopup`);
  const popupName = clean(popup.querySelector('.itemName')?.textContent || '');
  if (popupName !== name) fail(`${url} item name "${popupName}" != "${name}"`);

  const props = [...popup.querySelectorAll('.Stats .property')].map((p) => clean(p.textContent));
  const stack = props.map((p) => p.match(/^Stack Size: 1 \/ (\d+)$/)).find(Boolean);
  if (!stack) fail(`${url} Stack Size property`);
  const explicit = [...popup.querySelectorAll('.Stats .explicitMod')].map((e) => clean(e.textContent));
  const usage = clean(popup.querySelector('.default.fst-italic')?.textContent || '');
  const statLines = [...popup.querySelectorAll('.Stats')]
    .flatMap((st) => [...st.childNodes].map((c) => clean(c.textContent || '')))
    .filter(Boolean);
  if (!usage) fail(`${url} usage text`);

  const cards = readCards(doc);
  for (const k of ['DropLevel', 'Type', 'Class', 'Tags', 'NoteCode']) {
    if (!cards[k]) fail(`${url} card ${k}`);
  }
  return {
    url,
    itemClass: cards.Class,
    stackSize: Number(stack[1]),
    explicit,
    usage,
    dropLevel: Number(cards.DropLevel),
    metadataId: cards.Type,
    tags: cards.Tags.split(',').map((t) => t.trim()),
    ninjaId: cards.NoteCode,
    statLines,
  };
}

/** Parse a poedb Random_<Mechanic>_Thread_Modifiers page. Pure: no I/O. */
export function parseRandomModsPage(html, url) {
  const doc = new JSDOM(html).window.document;
  const desc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
  if (!desc) fail(`${url} og:description`);
  const lines = desc.split('\n').map((l) => l.trim()).filter(Boolean);
  const header = lines.findIndex((l) => /Modifiers which can be applied by Threads:$/.test(l));
  if (header < 1) fail(`${url} "${MODS_HEADER}" header`);
  const effects = lines.slice(header + 1);
  if (effects.length === 0) fail(`${url} zero effects`);
  return { url, rule: lines.slice(0, header).join(' '), effects };
}

async function scrapeItem(poedb, name) {
  const url = itemUrl(name);
  const page = await poedb.fetchPage(url, { expect: 'newItemPopup' });
  return parseItemPage(page.html, url, name);
}

async function scrapeRandomMods(poedb, mechanic) {
  const url = randomModsUrl(mechanic);
  const page = await poedb.fetchPage(url, { expect: MODS_HEADER });
  return parseRandomModsPage(page.html, url);
}

/** poe.ninja exchange overview (JSON). Not a poedb host, so not via the reader. */
export async function fetchNinjaJson(url, { fetchImpl = globalThis.fetch } = {}) {
  const res = await fetchImpl(url, { headers: { 'User-Agent': NINJA_UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

/**
 * Scrape the whole roster.
 * @param {{ poedb: {fetchPage: Function}, fetchNinja: (url: string) => Promise<object>,
 *           league: string, log?: Function }} deps
 */
export async function scrapeThreads({ poedb: reader, fetchNinja, league, log = console.error }) {
  // Record every poedb page so the caller can tell a fully fresh run from one
  // that mixes cached (up to 24 h old) poedb pages with a live poe.ninja fetch.
  const pages = [];
  const poedb = { fetchPage: async (...a) => { const p = await reader.fetchPage(...a); pages.push(p); return p; } };
  const ninja = await fetchNinja(ninjaUrl(league));
  const ninjaItems = new Map((ninja.items || []).map((i) => [i.name, i]));
  if (ninjaItems.size !== MECHANICS.length) {
    throw new Error(`ninja type=Thread returned ${ninjaItems.size} items, expected ${MECHANICS.length}`);
  }

  const threads = [];
  let rule = null;
  for (const mechanic of MECHANICS) {
    const name = `${mechanic} Thread`;
    const item = await scrapeItem(poedb, name);
    const mods = await scrapeRandomMods(poedb, mechanic);
    if (rule && rule !== mods.rule) throw new Error(`random-effect rule text differs for ${mechanic}`);
    rule = mods.rule;
    const n = ninjaItems.get(name);
    if (!n) throw new Error(`ninja type=Thread has no item "${name}"`);
    if (n.id !== item.ninjaId) throw new Error(`${name}: ninja id ${n.id} != poedb NoteCode ${item.ninjaId}`);
    if (item.explicit.length !== 1) fail(`${item.url} expected 1 explicit line, got ${item.explicit.length}`);
    if (!item.usage.startsWith(THREAD_USAGE)) fail(`${item.url} usage text changed: "${item.usage}"`);
    threads.push({
      name,
      mechanic,
      description: item.explicit[0],
      stackSize: item.stackSize,
      dropLevel: item.dropLevel,
      ninjaId: n.id,
      icon: `https://web.poecdn.com${n.image}`,
      randomEffects: mods.effects,
      source: item.url,
    });
    log?.(`  ${name}: ${mods.effects.length} random effects, drop level ${item.dropLevel}`);
  }

  const fr = await scrapeItem(poedb, 'Frayed Thread');
  if (fr.explicit.length > 1) fail(`${fr.url} expected at most 1 explicit line, got ${fr.explicit.length}`);
  const frDesc = fr.explicit[0] || fr.statLines.find((l) => !/^Stack Size|^Stackable Currency$/.test(l));
  if (!frDesc) fail(`${fr.url} description line`);
  const frayed = {
    name: 'Frayed Thread',
    description: frDesc,
    usage: fr.usage.split(/(?<=\.)\s+/)[0],
    stackSize: fr.stackSize,
    dropLevel: fr.dropLevel,
    ninjaId: fr.ninjaId,
    // Not listed under ninja type=Thread; gen/image hash is not derivable, so
    // use the raw CDN art path (same convention as scarabData.js new entries).
    icon: 'https://web.poecdn.com/image/Art/2DItems/Currency/Threads/FrayedThread.png',
    source: fr.url,
  };
  const cached = pages.filter((p) => p.fromCache);
  const cache = {
    cachedPages: cached.length,
    oldestFetchedAt: cached.map((p) => p.fetchedAt).sort((a, b) => Date.parse(a) - Date.parse(b))[0] ?? null,
  };
  return { threads, frayed, rule, cache };
}

/** stderr warning for a run that used cached poedb pages, or null for a fully fresh run. */
export function cacheWarning({ cachedPages, oldestFetchedAt }) {
  if (!cachedPages) return null;
  return `warning: ${cachedPages} poedb page(s) served from cache (oldest fetched ${oldestFetchedAt}) `
    + 'alongside a live poe.ninja fetch; re-run with --no-cache for a fully fresh run';
}

function toJsString(v) {
  return JSON.stringify(v);
}

/** Render src/data/threadData.js. Pure: same input, same bytes. */
export function renderThreadData({ threads, frayed, rule, league, today }) {
  return `/*
 * threadData.js: every PoE 1 Thread (3.30 Covens of Umbra replacement for Scarabs).
 *
 * GENERATED ${today} by scripts/atlas-data/scrape-threads.js for patch ${PATCH}.
 * Do not hand-edit; re-run the script.
 *
 * Sources: poedb.tw/us/<Thread name> (item text, stack size, drop level),
 * poedb.tw/us/Random_<Mechanic>_Thread_Modifiers (random-effect keyword text),
 * poe.ninja type=Thread for league "${league}" (icons, ids).
 * Patch notes: https://www.pathofexile.com/forum/view-thread/4013680
 * "Scarabs have been removed from the game. A new item type, Threads, have
 * been added in their place."
 *
 * ${threads.length} Threads + Frayed Thread. Threads have no tiers. randomEffects are
 * the in-game keyword-popup lines (verbatim); at least one applies per map and
 * more Threads of one type raise the chance of several applying.
 *
 * No regex fields yet: fragments are owned by regex-smith and must be unique
 * across each item's whole searchable text (name + description line).
 */

export const THREAD_PATCH = ${toJsString(PATCH)};

export const THREAD_RANDOM_EFFECT_RULE = ${toJsString(rule)};

export const THREAD_USAGE = ${toJsString(THREAD_USAGE)};

export const threads = ${JSON.stringify(threads, null, 2)};

export const frayedThread = ${JSON.stringify(frayed, null, 2)};
`;
}

async function main() {
  const args = process.argv.slice(2);
  const league = args.includes('--league') ? args[args.indexOf('--league') + 1] : 'Covens';
  const dry = args.includes('--dry');

  // Progress goes to stderr so `--dry > file` captures only the generated module.
  const poedb = createPoedbReader({ delayMs: DELAY_MS, log: console.error }); // honours --no-cache
  const data = await scrapeThreads({ poedb, fetchNinja: (url) => fetchNinjaJson(url), league });
  const body = renderThreadData({ ...data, league, today: new Date().toISOString().slice(0, 10) });
  const warning = cacheWarning(data.cache);
  if (warning) console.error(warning);
  if (dry) {
    process.stdout.write(body);
    return;
  }
  writeFileSync(OUT, body);
  console.error(`wrote ${OUT}: ${data.threads.length} threads + Frayed Thread`);
}

/**
 * True when this file is the process entry point. Compares real paths (so a
 * symlinked path matches) and accepts an argv[1] without the .js extension.
 */
function isEntryPoint() {
  const arg = process.argv[1];
  if (!arg) return false;
  const real = (p) => { try { return realpathSync(p); } catch { return null; } };
  const self = real(fileURLToPath(import.meta.url));
  const abs = path.resolve(arg);
  return [abs, `${abs}.js`].some((p) => real(p) === self);
}

if (isEntryPoint()) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
