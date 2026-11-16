#!/usr/bin/env node
/*
 * scrape-threads.js: build src/data/threadData.js from poedb + poe.ninja.
 *
 * 3.30 (Covens of Umbra) removed Scarabs and added Threads in their place
 * (patch notes thread 4013680). This regenerates the whole roster: the ten
 * per-mechanic Threads plus the Frayed Thread currency.
 *
 * Sources (all fetched live, 600 ms between poedb requests):
 *   https://poedb.tw/us/<Name_With_Underscores>       item popup + base table
 *   https://poedb.tw/us/Random_<Mechanic>_Thread_Modifiers   og:description lists
 *     the in-game keyword-popup text of every random effect for that mechanic
 *   https://poe.ninja/poe1/api/economy/exchange/current/overview?league=<L>&type=Thread
 *     icon URLs (web.poecdn.com gen/image, hash not derivable) and ninja ids
 *
 * Hard-fails on any selector miss or empty list: an empty scrape is a failure,
 * never "no changes". Never hand-edit the output; re-run this instead.
 *
 * Usage: node scripts/atlas-data/scrape-threads.js [--league Covens] [--dry]
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../../src/data/threadData.js');
const UA = 'Mozilla/5.0 (compatible; data-refresh client)';
const DELAY_MS = 600;
const PATCH = '3.30.0b';
const THREAD_USAGE = 'Can be used in a personal Map Device to add content to a Map.';

const args = process.argv.slice(2);
const league = args.includes('--league') ? args[args.indexOf('--league') + 1] : 'Covens';
const dry = args.includes('--dry');

const MECHANICS = [
  'Abyss', 'Bestiary', 'Betrayal', 'Blight', 'Breach',
  'Expedition', 'Incursion', 'Legion', 'Ritual', 'Ultimatum',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, { json = false } = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const body = json ? await res.json() : await res.text();
  if (!json && /anubis|making sure you(&#39;|')re not a bot/i.test(body)) {
    throw new Error(`${url} -> bot challenge page, not data`);
  }
  return body;
}

function fail(msg) {
  throw new Error(`selector miss: ${msg}`);
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

async function scrapeItem(name) {
  const url = `https://poedb.tw/us/${name.replace(/ /g, '_')}`;
  const doc = new JSDOM(await get(url)).window.document;
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

async function scrapeRandomMods(mechanic) {
  const url = `https://poedb.tw/us/Random_${mechanic}_Thread_Modifiers`;
  const doc = new JSDOM(await get(url)).window.document;
  const desc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
  if (!desc) fail(`${url} og:description`);
  const lines = desc.split('\n').map((l) => l.trim()).filter(Boolean);
  const header = lines.findIndex((l) => /Modifiers which can be applied by Threads:$/.test(l));
  if (header < 1) fail(`${url} "Modifiers which can be applied by Threads:" header`);
  const effects = lines.slice(header + 1);
  if (effects.length === 0) fail(`${url} zero effects`);
  return { url, rule: lines.slice(0, header).join(' '), effects };
}

function toJsString(v) {
  return JSON.stringify(v);
}

async function main() {
  const ninjaUrl = `https://poe.ninja/poe1/api/economy/exchange/current/overview?league=${encodeURIComponent(league)}&type=Thread`;
  const ninja = await get(ninjaUrl, { json: true });
  const ninjaItems = new Map((ninja.items || []).map((i) => [i.name, i]));
  if (ninjaItems.size !== MECHANICS.length) {
    throw new Error(`ninja type=Thread returned ${ninjaItems.size} items, expected ${MECHANICS.length}`);
  }

  const threads = [];
  let rule = null;
  for (const mechanic of MECHANICS) {
    const name = `${mechanic} Thread`;
    const item = await scrapeItem(name);
    await sleep(DELAY_MS);
    const mods = await scrapeRandomMods(mechanic);
    await sleep(DELAY_MS);
    if (rule && rule !== mods.rule) throw new Error(`random-effect rule text differs for ${mechanic}`);
    rule = mods.rule;
    const n = ninjaItems.get(name);
    if (!n) fail(`ninja item "${name}"`);
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
    console.log(`  ${name}: ${mods.effects.length} random effects, drop level ${item.dropLevel}`);
  }

  const fr = await scrapeItem('Frayed Thread');
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

  const today = new Date().toISOString().slice(0, 10);
  const body = `/*
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
  if (dry) {
    console.log(body);
    return;
  }
  writeFileSync(OUT, body);
  console.log(`wrote ${OUT}: ${threads.length} threads + Frayed Thread`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
