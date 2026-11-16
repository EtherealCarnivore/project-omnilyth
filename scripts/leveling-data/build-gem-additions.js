/**
 * build-gem-additions.js
 * Finds gems that exist in the current game data but are missing from the
 * gemAvailability roster (src/data/gemData.js), and classifies each one by
 * how well its leveling availability can be evidenced.
 *
 * Output: scripts/leveling-data/raw/gem-additions.json
 *   confirmed[]  read by transform-gem-data.js and shipped in gemAvailability.js
 *   probable[]   NOT shipped; listed for review (the evidence is single-source)
 *   excluded[]   legacy / Ruthless-only / renamed gems, with reason
 *
 * Sources (pinned commits, fetched from GitHub; poewiki and poedb are not used):
 *   A. Path of Building Community, src/Data/Gems.lua (dev branch, 3.30 data).
 *      GGPK export: gem roster, display names, support flag.
 *   B. RePoE export, data/gems.json (game version 3.30.0.2).
 *      GGPK export: roster, release_state, and quest_reward taken from
 *      QuestRewards.dat64. That field is keyed by base item, so a transfigured
 *      gem inherits its base gem's reward.
 *   C. HeartofPhos/exile-leveling, common/data/json/quests.json.
 *      Quest reward offers from QuestRewardOffers.dat. Vendor and Siosa/Lilly
 *      rows from the poewiki cargo tables. The 3.30 Arcane Link rows were
 *      added by hand.
 *
 * A gem lands in confirmed[] only when:
 *   1. A and B agree on its name and support flag, and B says release_state
 *      "released";
 *   2. B and C both have no quest reward for it, checking C under every id the
 *      gem has (PoB key, gameId, RePoE base item id). A transfigured gem counts
 *      only if its base gem has no quest or vendor row in B or C;
 *   3. C has no vendor, Siosa or Lilly row for it.
 * Confirmed gems ship with availability: [], meaning no quest reward and no
 * vendor source on record. Any gem with a quest or vendor record goes to
 * probable[]: no datamined vendor table has existed since QuestVendorRewards.dat
 * was removed, so vendor rows can only ever come from one source (poewiki).
 *
 * Usage:
 *   node scripts/leveling-data/build-gem-additions.js           # fetch (cached) + build
 *   node scripts/leveling-data/build-gem-additions.js --refresh # ignore cache
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const CACHE_DIR = path.join(__dirname, 'raw', '.cache');
const OUT_PATH = path.join(__dirname, 'raw', 'gem-additions.json');
const PATCH = '3.30.0b';

const SOURCES = {
  pob: {
    name: 'Path of Building Community, src/Data/Gems.lua (dev)',
    commit: '17f493353192edfc53fd0d76e2f553d36e264698',
    url: 'https://raw.githubusercontent.com/PathOfBuildingCommunity/PathOfBuilding/17f493353192edfc53fd0d76e2f553d36e264698/src/Data/Gems.lua',
    file: 'pob-Gems.lua',
  },
  repoe: {
    name: 'RePoE export data/gems.json (game 3.30.0.2)',
    commit: '0071545fba8d079f65cc9c6a415d8f525f3af07a',
    url: 'https://raw.githubusercontent.com/repoe-fork/repoe-fork.github.io/0071545fba8d079f65cc9c6a415d8f525f3af07a/data/gems.json',
    file: 'repoe-gems.json',
  },
  exileLeveling: {
    name: 'HeartofPhos/exile-leveling common/data/json/quests.json',
    commit: 'd6951db0ca9463e42074e1e05e9ffde3d42d1604',
    url: 'https://raw.githubusercontent.com/HeartofPhos/exile-leveling/d6951db0ca9463e42074e1e05e9ffde3d42d1604/common/data/json/quests.json',
    file: 'exile-leveling-quests.json',
  },
};

// Gems excluded by rule, with the reason recorded in the output.
const EXCLUDE_RULES = [
  { test: (g) => g.repoeReleaseState && g.repoeReleaseState !== 'released', reason: (g) => `RePoE release_state "${g.repoeReleaseState}"` },
  { test: (g) => /HardMode$/.test(g.key), reason: () => 'Ruthless-only variant (HardMode)' },
  { test: (g) => /Royale$/.test(g.key), reason: () => 'PoE Royale variant' },
];

async function getSource(src, refresh) {
  const cached = path.join(CACHE_DIR, src.file);
  if (!refresh && fs.existsSync(cached)) return fs.readFileSync(cached, 'utf8');
  console.log(`📡 Fetching ${src.url}`);
  const res = await fetch(src.url);
  if (!res.ok) throw new Error(`${src.name}: HTTP ${res.status}`);
  const text = await res.text();
  if (/^\s*<(!doctype|html)/i.test(text)) throw new Error(`${src.name}: got HTML (bot check?) instead of data`);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cached, text);
  return text;
}

/** Parse PoB Gems.lua into [{ key, name, gameId, variantId, support }] */
function parsePobGems(lua) {
  const parts = lua.split(/\n\t\["(Metadata\/Items\/Gems\/[^"]+)"\] = \{/);
  const gems = [];
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i];
    const body = parts[i + 1];
    const field = (f) => (body.match(new RegExp(`\\n\\t\\t${f} = "([^"]*)"`)) || [])[1] ?? null;
    const support = /\n\t\t\tsupport = true/.test(body);
    let name = field('baseTypeName') ?? field('name');
    // PoB stores support names without the " Support" suffix the game uses.
    if (support && name && !/ Support$/.test(name)) name = `${name} Support`;
    gems.push({ key, name, gameId: field('gameId'), variantId: field('variantId'), support });
  }
  if (gems.length < 500) throw new Error(`PoB Gems.lua parse looks wrong: ${gems.length} gems`);
  return gems;
}

/**
 * Names that already carry availability rows from the 2026-02-23 run: the
 * gemData.js entries that the pre-2026-11 transform matched with its fixed
 * name/regex/icon/isSupport pattern (704). Entries with any other shape (the
 * 37 Awakened supports carry an extra regexShort field) were silently dropped
 * then; they get evaluated here like any other missing gem.
 */
function loadExistingRoster() {
  const content = fs.readFileSync(path.join(ROOT, 'src', 'data', 'gemData.js'), 'utf8');
  const names = new Set();
  const legacy = /"([^"]+)":\s*{\s*name:\s*"([^"]+)",\s*regex:\s*"([^"]+)",\s*icon:\s*"([^"]+)",\s*isSupport:\s*(true|false)\s*}/g;
  for (const m of content.matchAll(legacy)) names.add(m[2]);
  return names;
}

/** Index exile-leveling quest/vendor rows by gem id */
function indexExileLeveling(quests) {
  const idx = {};
  for (const [questId, quest] of Object.entries(quests)) {
    for (const offer of Object.values(quest.reward_offers || {})) {
      for (const kind of ['quest', 'vendor']) {
        for (const [gemId, row] of Object.entries(offer[kind] || {})) {
          (idx[gemId] ||= []).push({
            questId, quest: quest.name, act: Number(quest.act), kind,
            npc: row.npc || null, classes: row.classes || [],
          });
        }
      }
    }
  }
  return idx;
}

function category(g) {
  if (/^Awakened /.test(g.name)) return 'awakened';
  if (/^Vaal /.test(g.name)) return 'vaal';
  if (/Alt[XYZ]$/.test(g.variantId || '')) return 'transfigured';
  return g.support ? 'support' : 'active';
}

async function buildGemAdditions({ refresh = false } = {}) {
  const pob = parsePobGems(await getSource(SOURCES.pob, refresh));
  const repoe = JSON.parse(await getSource(SOURCES.repoe, refresh));
  const el = indexExileLeveling(JSON.parse(await getSource(SOURCES.exileLeveling, refresh)));
  const existing = loadExistingRoster();

  // RePoE is keyed by granted effect id; PoB carries it as variantId. A few
  // differ (PoB "VaalLightningWarp" vs RePoE "VaalLightningWarpInstant"), so
  // fall back to base item id + display name.
  const repoeByVariant = repoe;
  const findRepoe = (g) => repoe[g.variantId]
    ?? Object.values(repoe).find((r) => r.base_item?.id === g.gameId && r.display_name === g.name);
  const pobNames = new Set(pob.map((g) => g.name));
  const renamedOrRemoved = [...existing].filter((n) => !pobNames.has(n));

  const confirmed = [];
  const probable = [];
  const excluded = [];

  for (const g of pob) {
    if (existing.has(g.name)) continue;
    const r = findRepoe(g);
    const entry = {
      name: g.name,
      metadataId: g.key,
      category: category(g),
      type: g.support ? 'support' : 'active',
      repoeReleaseState: r?.base_item?.release_state ?? null,
      checks: {},
    };

    const rule = EXCLUDE_RULES.find((x) => x.test({ ...entry, key: g.key }));
    if (rule) { excluded.push({ ...entry, reason: rule.reason({ ...entry, key: g.key }) }); continue; }

    // 1. Existence / name / type: PoB and RePoE agree
    const nameAgrees = !!r && r.display_name === g.name;
    const typeAgrees = !!r && !!r.is_support === g.support;
    entry.checks.roster = nameAgrees && typeAgrees
      ? 'PoB + RePoE agree'
      : `disagree (RePoE: ${r ? `${r.display_name}, support=${!!r.is_support}` : 'missing'})`;

    // 2. Quest reward: RePoE QuestRewards.dat64 + exile-leveling QuestRewardOffers
    const repoeQuest = r?.quest_reward ?? null;
    // exile-leveling keys rows by the game's base item id (e.g. SupportGemHallow),
    // not PoB's table key (SkillGemSupportHallow), so look up every id the gem
    // has. A transfigured gem shares its base item id with its base gem, so its
    // own lookup uses only the PoB key; the base item's rows are checked below.
    const isTransfigured = entry.category === 'transfigured';
    const ids = isTransfigured
      ? [g.key]
      : [...new Set([g.key, g.gameId, r?.base_item?.id].filter(Boolean))];
    const elRows = ids.flatMap((id) => el[id] || []);
    const elQuest = elRows.filter((x) => x.kind === 'quest');
    const elVendor = elRows.filter((x) => x.kind === 'vendor');
    entry.checks.exileLevelingIds = ids;

    // Transfigured: vendors and quest rewards hand out base items, so if the
    // base gem has any quest or vendor row in either source, the variant's
    // vendor/quest status is not settled by datamined data.
    let baseRows = [];
    let baseRepoeQuest = null;
    if (isTransfigured) {
      const base = pob.find((p) => p.key === g.gameId);
      const rb = base && findRepoe(base);
      baseRepoeQuest = rb?.quest_reward ?? null;
      const baseIds = [...new Set([g.gameId, base?.key, rb?.base_item?.id].filter(Boolean))];
      baseRows = baseIds.flatMap((id) => el[id] || []);
      entry.checks.base = { ids: baseIds, repoeQuest: baseRepoeQuest, exileLeveling: baseRows };
    }
    const baseAvailable = !!baseRepoeQuest || baseRows.length > 0;
    entry.checks.questReward = { repoe: repoeQuest, exileLeveling: elQuest };
    entry.checks.vendor = elVendor;

    const noQuest = !repoeQuest && elQuest.length === 0;
    const noVendor = elVendor.length === 0;
    const rosterOk = nameAgrees && typeAgrees;

    if (rosterOk && noQuest && noVendor && !baseAvailable) {
      entry.availability = [];
      entry.level = 'confirmed';
      confirmed.push(entry);
    } else {
      entry.level = rosterOk && (repoeQuest || elQuest.length || elVendor.length) ? 'probable' : 'unconfirmed';
      entry.why = [
        !rosterOk && 'PoB/RePoE roster disagreement',
        repoeQuest && `RePoE quest_reward: act ${repoeQuest.act} "${repoeQuest.quest}" [${repoeQuest.classes.join(', ')}]`,
        elQuest.length && `exile-leveling quest offers: ${elQuest.map((x) => `${x.questId} [${x.classes.join(', ')}]`).join('; ')}`,
        elVendor.length && `exile-leveling vendor rows (poewiki-derived): ${elVendor.map((x) => `${x.questId} ${x.npc} [${x.classes.join(', ') || 'all'}]`).join('; ')}`,
        baseAvailable && `transfigured: base gem has quest/vendor rows (${[
          baseRepoeQuest && `RePoE quest act ${baseRepoeQuest.act} "${baseRepoeQuest.quest}"`,
          ...baseRows.map((x) => `${x.questId} ${x.kind}${x.npc ? ` ${x.npc}` : ''}`),
        ].filter(Boolean).join('; ')}); no datamined source says whether the variant is offered`,
      ].filter(Boolean);
      probable.push(entry);
    }
  }

  const out = {
    _meta: {
      generated: new Date().toISOString(),
      patch: PATCH,
      sources: Object.fromEntries(Object.entries(SOURCES).map(([k, s]) => [k, { name: s.name, commit: s.commit, url: s.url }])),
      rule: 'confirmed = (1) PoB and RePoE agree on display name and support flag, RePoE release_state "released"; (2) RePoE quest_reward (QuestRewards.dat64) is null; (3) exile-leveling quests.json has no quest-offer and no vendor/Siosa/Lilly row under any of the gem ids (PoB table key, PoB gameId, RePoE base_item.id); (4) transfigured gems additionally require their base gem to have no RePoE quest_reward and no exile-leveling quest or vendor row (base and variant share a base item, so a base on offer leaves the variant unsettled). Ships with availability [] = no quest reward on record in two datamined sources, no vendor row in the poewiki-derived exile-leveling table; vendor absence itself is single-source.',
      existingRosterCount: existing.size,
      pobRosterCount: pob.length,
      renamedOrRemovedInRoster: renamedOrRemoved,
      counts: { confirmed: confirmed.length, probable: probable.length, excluded: excluded.length },
    },
    confirmed,
    probable,
    excluded,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n');
  console.log(`✅ Wrote ${path.relative(ROOT, OUT_PATH)}`);
  console.log(`   PoB roster: ${pob.length} | existing roster: ${existing.size}`);
  console.log(`   confirmed: ${confirmed.length} | probable: ${probable.length} | excluded: ${excluded.length}`);
  console.log(`   existing names not in PoB 3.30 (renamed/removed): ${renamedOrRemoved.join(', ') || 'none'}`);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildGemAdditions({ refresh: process.argv.includes('--refresh') }).catch((e) => {
    console.error('❌', e.message);
    process.exit(1);
  });
}

export { buildGemAdditions, parsePobGems };
