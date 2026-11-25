/**
 * build-catalog.mjs — Mercenary Warrant catalog for the Mercenary Trade Search tool (PoE 1).
 *
 * Sources:
 *   1. GGG trade API  /api/trade/data/stats, group "mercenary": every skill and
 *      support-tier filter the trade site accepts, with its stat id.
 *   2. poedb.tw/us/Mercenaries: each archetype's primary / secondary / utility
 *      skill pool (Regular and Infamous variants).
 *
 * Output: src/data/mercenaries/mercenaryData.json
 *
 *   node scripts/mercenary-data/build-catalog.mjs            # uses the poedb cache
 *   node scripts/mercenary-data/build-catalog.mjs --no-cache # refetch poedb
 *
 * Fails loudly when a poedb skill name has no trade stat, so a renamed skill
 * never silently drops out of an archetype.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPoedbReader, DEFAULT_USER_AGENT } from '../lib/poedb.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(HERE, '..', '..', 'src', 'data', 'mercenaries', 'mercenaryData.json');

const TRADE_STATS_URL = 'https://www.pathofexile.com/api/trade/data/stats';
const POEDB_URL = 'https://poedb.tw/us/Mercenaries';

// poedb placeholders that are not real skills.
const IGNORED_SKILLS = new Set(['[DNT] Unused', 'Do Nothing']);

const decodeEntities = (s) =>
  s
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();

async function fetchTradeStats() {
  const res = await fetch(TRADE_STATS_URL, { headers: { 'User-Agent': DEFAULT_USER_AGENT } });
  if (!res.ok) throw new Error(`${TRADE_STATS_URL} -> HTTP ${res.status}`);
  const body = await res.json();
  const group = body.result.find((g) => g.id === 'mercenary');
  if (!group) throw new Error('trade stats: no "mercenary" group (did GGG rename it?)');
  return { fetchedAt: new Date().toISOString(), entries: group.entries };
}

/** Parse the archetype cards on poedb's Mercenaries page. */
export function parseArchetypes(html) {
  const cards = html.split('<div class="d-flex border-top rounded">').slice(1);
  const out = [];
  for (const card of cards) {
    const head = card.match(/<strong><a href="[^"]+">([^<]+)<\/a><\/strong>\s*<small>([^<]*)<\/small>/);
    if (!head) continue;
    const pools = { primary: [], secondary: [], utility: [] };
    const re = /<div class="col MercenarySkill(Primary|Secondary|Utility)">[\s\S]*?<span data-hover="[^"]*">([^<]+)<\/span><\/div>/g;
    let m;
    while ((m = re.exec(card))) {
      const name = decodeEntities(m[2]);
      if (!IGNORED_SKILLS.has(name)) pools[m[1].toLowerCase()].push(name);
    }
    out.push({ name: decodeEntities(head[1]), attribute: decodeEntities(head[2]), ...pools });
  }
  return out;
}

/** "Greater Pierce (Tier 3)" -> { family: 'Pierce', tier: 3 } */
export function parseSupportText(text) {
  const m = text.match(/^(?:(?:Lesser|Greater) )?(.+?) \(Tier (\d)\)$/);
  return m ? { family: m[1], tier: Number(m[2]) } : { family: text, tier: null };
}

async function main() {
  const poedb = createPoedbReader();
  const [trade, page] = await Promise.all([
    fetchTradeStats(),
    poedb.fetchPage(POEDB_URL, { expect: /MercenarySkillPrimary/ }),
  ]);

  const skillEntries = trade.entries.filter((e) => e.id.startsWith('mercenary.skill_'));
  const supportEntries = trade.entries.filter((e) => e.id.startsWith('mercenary.support_'));
  const skillIdByName = new Map(skillEntries.map((e) => [e.text, e.id]));

  const cards = parseArchetypes(page.html);
  if (cards.length < 30) throw new Error(`poedb: only ${cards.length} archetype cards parsed — page shape changed?`);

  const missing = new Set();
  const toIds = (names) =>
    names.map((n) => {
      const id = skillIdByName.get(n);
      if (!id) missing.add(n);
      return id;
    });

  // Merge Regular + Infamous variants by base name.
  const byBase = new Map();
  for (const c of cards) {
    const infamous = c.name.startsWith('Infamous ');
    const base = infamous ? c.name.slice('Infamous '.length) : c.name;
    const entry = byBase.get(base) ?? {
      name: base,
      attribute: c.attribute,
      variants: [],
      primary: new Set(),
      secondary: new Set(),
      utility: new Set(),
    };
    entry.variants.push(infamous ? 'infamous' : 'regular');
    for (const k of ['primary', 'secondary', 'utility']) toIds(c[k]).forEach((id) => id && entry[k].add(id));
    byBase.set(base, entry);
  }
  if (missing.size) throw new Error(`poedb skills with no trade stat: ${[...missing].join(', ')}`);

  const archetypes = [...byBase.values()]
    .map((a) => ({ ...a, primary: [...a.primary], secondary: [...a.secondary], utility: [...a.utility] }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const skills = skillEntries
    .map((e) => ({ id: e.id, name: e.text }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const supports = supportEntries
    .map((e) => ({ id: e.id, label: e.text, ...parseSupportText(e.text) }))
    .sort((a, b) => a.family.localeCompare(b.family) || (a.tier ?? 0) - (b.tier ?? 0));

  const data = {
    _meta: {
      game: 'poe1',
      generatedBy: 'scripts/mercenary-data/build-catalog.mjs',
      sources: [
        { url: TRADE_STATS_URL, fetchedAt: trade.fetchedAt },
        { url: POEDB_URL, fetchedAt: page.fetchedAt },
      ],
      counts: { archetypes: archetypes.length, skills: skills.length, supports: supports.length },
    },
    archetypes,
    skills,
    supports,
  };

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(data, null, 1) + '\n');
  console.log(`wrote ${OUT_FILE}`, data._meta.counts);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
