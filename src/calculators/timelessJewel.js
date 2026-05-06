/*
 * timelessJewel.js — Pure calculation engine for Timeless Jewel seed effects.
 *
 * Ported from Vilsol/timeless-jewels Go source (GPL-3.0).
 * Algorithm: TinyMT32 PRNG seeded with (PassiveSkillGraphID, jewel_seed)
 * determines how each passive in radius is transformed.
 *
 * LINK: this file ships the *deterministic* version of the algorithm; the
 * forward-search worker at src/workers/timelessSearch.js runs the same math
 * over a seed range. PASSIVE_TYPE, JEWEL_TYPES, and TREE_VERSIONS are
 * imported by the worker — keep their shapes in lockstep. A change here
 * that doesn't propagate to the worker yields silently-wrong search results.
 *
 * EXTERNAL: the upstream Go source last synced for the values in JEWEL_TYPES
 * + TREE_VERSIONS + the TinyMT32 constants. PoE patches that add a new
 * Conqueror or jewel type require a re-port; there's no schema validation.
 */

import { calculateNodePosition } from './passiveTree';

// ─── Constants ──────────────────────────────────────────────────────────────

export const PASSIVE_TYPE = {
  NONE: 0,
  SMALL_ATTRIBUTE: 1,
  SMALL_NORMAL: 2,
  NOTABLE: 3,
  KEYSTONE: 4,
  JEWEL_SOCKET: 5,
};

const SMALL_ATTRIBUTE_STATS = [
  '+10 to Strength',
  '+10 to Dexterity',
  '+10 to Intelligence',
];

export const JEWEL_TYPES = [
  {
    id: 1, name: 'Glorious Vanity', tag: 'vaal',
    minSeed: 100, maxSeed: 8000,
    conquerors: [
      { name: 'Xibaqua', index: 1, version: 0 },
      { name: 'Zerphi',  index: 2, version: 0 },
      { name: 'Ahuana',  index: 2, version: 1 },
      { name: 'Doryani', index: 3, version: 0 },
    ],
  },
  {
    id: 2, name: 'Lethal Pride', tag: 'karui',
    minSeed: 10000, maxSeed: 18000,
    conquerors: [
      { name: 'Kaom',    index: 1, version: 0 },
      { name: 'Rakiata', index: 2, version: 0 },
      { name: 'Kiloava', index: 3, version: 0 },
      { name: 'Akoya',   index: 3, version: 1 },
    ],
  },
  {
    id: 3, name: 'Brutal Restraint', tag: 'maraketh',
    minSeed: 500, maxSeed: 8000,
    conquerors: [
      { name: 'Deshret', index: 1, version: 0 },
      { name: 'Balbala', index: 1, version: 1 },
      { name: 'Asenath', index: 2, version: 0 },
      { name: 'Nasima',  index: 3, version: 0 },
    ],
  },
  {
    id: 4, name: 'Militant Faith', tag: 'templar',
    minSeed: 2000, maxSeed: 10000,
    conquerors: [
      { name: 'Venarius', index: 1, version: 0 },
      { name: 'Maxarius', index: 1, version: 1 },
      { name: 'Dominus',  index: 2, version: 0 },
      { name: 'Avarius',  index: 3, version: 0 },
    ],
  },
  {
    // QUIRK: Elegant Hubris is the only jewel type with seedStep > 1. Its
    // seeds advance in increments of 20 (so seed 2020, 2040, … not 2001,
    // 2002). calculateSeed() divides incoming seed by seedStep before
    // feeding the RNG; the worker uses the same step for iteration and
    // gets a 20× speedup over brute-forcing 2000..160000 one-by-one.
    id: 5, name: 'Elegant Hubris', tag: 'eternal',
    minSeed: 2000, maxSeed: 160000, seedStep: 20,
    conquerors: [
      { name: 'Cadiro',   index: 1, version: 0 },
      { name: 'Victario', index: 2, version: 0 },
      { name: 'Chitus',   index: 3, version: 0 },
      { name: 'Caspiro',  index: 3, version: 1 },
    ],
  },
  {
    id: 6, name: 'Heroic Tragedy', tag: 'kalguur',
    minSeed: 100, maxSeed: 8000,
    conquerors: [
      { name: 'Vorana', index: 1, version: 0 },
      { name: 'Medved', index: 2, version: 0 },
      { name: 'Olroth', index: 3, version: 0 },
    ],
  },
];

// Militant Faith "per 10 Devotion" explicit modifiers (jewel-level, not node-level).
// These are independent of the seed — they're a separate explicit mod on the jewel item.
// tradeStatId values sourced from the PoE trade API (/api/trade/data/stats).
export const MILITANT_FAITH_DEVOTION_MODS = [
  { id: 'aura',            label: '#% increased effect of Non-Curse Auras per 10 Devotion',                tradeStatId: 'explicit.stat_2585926696' },
  { id: 'mana_cost',       label: '#% reduced Mana Cost of Skills per 10 Devotion',                       tradeStatId: 'explicit.stat_3293275880' },
  { id: 'ele_dmg',         label: '#% increased Elemental Damage per 10 Devotion',                        tradeStatId: 'explicit.stat_3103189267' },
  { id: 'area_dmg',        label: '#% increased Area Damage per 10 Devotion',                             tradeStatId: 'explicit.stat_1724614884' },
  { id: 'ele_res',         label: '+#% to all Elemental Resistances per 10 Devotion',                     tradeStatId: 'explicit.stat_1910205563' },
  { id: 'ailment_dur',     label: '#% reduced Elemental Ailment Duration on you per 10 Devotion',         tradeStatId: 'explicit.stat_730530528' },
  { id: 'channel_dmg',     label: 'Channelling Skills deal #% increased Damage per 10 Devotion',          tradeStatId: 'explicit.stat_970844066' },
  { id: 'totem_dmg',       label: '#% increased Totem Damage per 10 Devotion',                            tradeStatId: 'explicit.stat_2566390555' },
  { id: 'brand_dmg',       label: '#% increased Brand Damage per 10 Devotion',                            tradeStatId: 'explicit.stat_2697019412' },
  { id: 'curse_dur',       label: '#% increased Duration of Curses on you per 10 Devotion',               tradeStatId: 'explicit.stat_4235333770' },
  { id: 'mana_regen',      label: 'Regenerate # Mana per Second per 10 Devotion',                         tradeStatId: 'explicit.stat_2042813020' },
  { id: 'shield_def',      label: '#% increased Defences from Equipped Shield per 10 Devotion',           tradeStatId: 'explicit.stat_2803981661' },
  { id: 'minion_speed',    label: '#% increased Minion Attack and Cast Speed per 10 Devotion',            tradeStatId: 'explicit.stat_3808469650' },
  { id: 'minion_acc',      label: 'Minions have +# to Accuracy Rating per 10 Devotion',                  tradeStatId: 'explicit.stat_2830135449' },
  { id: 'ailment_effect',  label: '#% increased Effect of non-Damaging Ailments on Enemies per 10 Devotion', tradeStatId: 'explicit.stat_1810368194' },
];

export const DEVOTION_STAT_ID = 9739;

/**
 * Calculate total Devotion from a seed's calculated results.
 * Devotion comes from replaced small-attribute nodes (+10) and augmentation additions (+5).
 */
export function calculateTotalDevotion(results) {
  let total = 0;
  for (const { result } of results) {
    // Replaced skill stats
    if (result.replaced && result.skill) {
      for (let i = 0; i < result.skill.StatsKeys.length; i++) {
        if (result.skill.StatsKeys[i] === DEVOTION_STAT_ID) {
          total += result.statRolls[i] ?? 0;
        }
      }
    }
    // Augmentation additions
    for (const add of result.additions) {
      for (let i = 0; i < add.addition.StatsKeys.length; i++) {
        if (add.addition.StatsKeys[i] === DEVOTION_STAT_ID) {
          total += add.statRolls[i] ?? 0;
        }
      }
    }
  }
  return total;
}

// AlternateTreeVersion config per jewel type index.
//
// QUIRK: each jewel type behaves differently — Glorious Vanity (1) and
// Elegant Hubris (5) REPLACE small passives entirely; Lethal Pride (2) and
// Brutal Restraint (3) only AUGMENT (add lines, no replacement). Militant
// Faith (4) is hybrid: replaces small attribute nodes, augments small normal.
// Heroic Tragedy (6) augments only.
//
// notableSpawnWeight: probability the notable gets replaced (0..100).
// 100 = always replaced (Vanity/Hubris/Tragedy notables fully transmute).
// 0 = never replaced (Pride/Restraint never change notables, only add lines).
// 20 = Militant Faith's 20% notable replacement rate — the partial rate is
// what makes Faith jewels variance-y for the player.
export const TREE_VERSIONS = {
  1: { smallAttrReplaced: true,  smallNormalReplaced: true,  minAdd: 0, maxAdd: 0, notableSpawnWeight: 100 },
  2: { smallAttrReplaced: false, smallNormalReplaced: false, minAdd: 1, maxAdd: 1, notableSpawnWeight: 0 },
  3: { smallAttrReplaced: false, smallNormalReplaced: false, minAdd: 1, maxAdd: 1, notableSpawnWeight: 0 },
  4: { smallAttrReplaced: true,  smallNormalReplaced: false, minAdd: 1, maxAdd: 1, notableSpawnWeight: 20 },
  5: { smallAttrReplaced: true,  smallNormalReplaced: true,  minAdd: 0, maxAdd: 0, notableSpawnWeight: 100 },
  6: { smallAttrReplaced: false, smallNormalReplaced: false, minAdd: 0, maxAdd: 0, notableSpawnWeight: 100 },
};

// ─── TinyMT32 PRNG ─────────────────────────────────────────────────────────
// Ported from timeless_jewel_calculator/timeless-jewels/random/main.go
//
// QUIRK: TinyMT32 is a Tiny Mersenne Twister variant. PoE uses a specific
// 4-phase initialisation sequence (see initialize() below): seed-injection
// → 5 alpha rounds → 4 bravo rounds → 8 warmup generations. The phase
// counts and the alpha/bravo constants are NOT general TinyMT — they're
// what GGG's binary actually does. Changing any of (INIT_CONST, ALPHA,
// BRAVO, the round counts) makes our seed→outcome predictions diverge
// from in-game results.
//
// CONTRACT: u32() / Math.imul() carefully reproduce Go's uint32 arithmetic
// semantics. JS bitwise ops are signed-32-bit by default, hence the >>> 0
// dance and the explicit u32 wrapper. Don't replace with `>>>` or `*` —
// the integer overflow behaviour matters and is easy to get subtly wrong.

const INIT_CONST = new Uint32Array([0x40336050, 0xCFA3723C, 0x3CAC5F6F, 0x3793FDFF]);
const TINYMT_SH0 = 1;
const TINYMT_SH1 = 10;
const TINYMT_MASK = 0x7FFFFFFF;
const ALPHA = 0x19660D;
const BRAVO = 0x5D588B65;

function u32(n) { return n >>> 0; }

function manipulateAlpha(value) {
  const v = value >>> 0;
  return Math.imul((v ^ (v >>> 27)) >>> 0, ALPHA) >>> 0;
}

function manipulateBravo(value) {
  const v = value >>> 0;
  return Math.imul((v ^ (v >>> 27)) >>> 0, BRAVO) >>> 0;
}

export class TinyMT32 {
  constructor() {
    this.state = new Uint32Array(4);
  }

  reset(graphId, seed) {
    this.state[0] = INIT_CONST[0];
    this.state[1] = INIT_CONST[1];
    this.state[2] = INIT_CONST[2];
    this.state[3] = INIT_CONST[3];
    this.initialize([graphId >>> 0, seed >>> 0]);
  }

  initialize(seeds) {
    let index = 1;

    // Phase 1: Process each seed with alpha manipulation
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      let roundState = manipulateAlpha(
        u32(this.state[index % 4] ^ this.state[(index + 1) % 4] ^ this.state[(index + 3) % 4])
      );
      this.state[(index + 1) % 4] = u32(this.state[(index + 1) % 4] + roundState);
      roundState = u32(roundState + seed + index);
      this.state[(index + 2) % 4] = u32(this.state[(index + 2) % 4] + roundState);
      this.state[index % 4] = roundState;
      index = (index + 1) % 4;
    }

    // Phase 2: 5 more alpha rounds (no seed, just index)
    for (let i = 0; i < 5; i++) {
      let roundState = manipulateAlpha(
        u32(this.state[index % 4] ^ this.state[(index + 1) % 4] ^ this.state[(index + 3) % 4])
      );
      this.state[(index + 1) % 4] = u32(this.state[(index + 1) % 4] + roundState);
      roundState = u32(roundState + index);
      this.state[(index + 2) % 4] = u32(this.state[(index + 2) % 4] + roundState);
      this.state[index % 4] = roundState;
      index = (index + 1) % 4;
    }

    // Phase 3: 4 bravo rounds (XOR instead of ADD, subtract index)
    for (let i = 0; i < 4; i++) {
      let roundState = manipulateBravo(
        u32(this.state[index % 4] + this.state[(index + 1) % 4] + this.state[(index + 3) % 4])
      );
      this.state[(index + 1) % 4] = u32(this.state[(index + 1) % 4] ^ roundState);
      roundState = u32(roundState - index);
      this.state[(index + 2) % 4] = u32(this.state[(index + 2) % 4] ^ roundState);
      this.state[index % 4] = roundState;
      index = (index + 1) % 4;
    }

    // Phase 4: 8 warmup generations
    for (let i = 0; i < 8; i++) {
      this.generateNextState();
    }
  }

  generateNextState() {
    const s = this.state;
    let a = s[3];
    let b = u32((s[0] & TINYMT_MASK) ^ s[1] ^ s[2]);
    a = u32(a ^ (a << TINYMT_SH0));
    b = u32(b ^ ((b >>> TINYMT_SH0) ^ a));
    s[0] = s[1];
    s[1] = s[2];
    s[2] = u32(a ^ (b << TINYMT_SH1));
    s[3] = b;
    // Conditional mask: if b is odd, XOR with constants
    const mask = u32(-(b & 1)); // 0xFFFFFFFF if odd, 0x00000000 if even
    s[1] = u32(s[1] ^ (mask & 0x8F7011EE));
    s[2] = u32(s[2] ^ (mask & 0xFC78FF1F));
  }

  temper() {
    const s = this.state;
    const b = u32(s[0] + (s[2] >>> 8));
    let a = u32(s[3] ^ b);
    if (b & 1) a = u32(a ^ 0x3793FDFF);
    return a;
  }

  generateUInt() {
    this.generateNextState();
    return this.temper();
  }

  generateSingle(exclusiveMax) {
    return (this.generateUInt() % exclusiveMax) >>> 0;
  }

  generate(minValue, maxValue) {
    // Signed-to-unsigned conversion dance (matches Go uint32 arithmetic)
    const a = u32(minValue + 0x80000000);
    const b = u32(maxValue + 0x80000000);
    const roll = this.generateSingle(u32(b - a) + 1);
    return u32(u32(roll + a) + 0x80000000);
  }
}

// ─── Node Classification ────────────────────────────────────────────────────

export function getPassiveSkillType(node) {
  if (node.isJewelSocket) return PASSIVE_TYPE.JEWEL_SOCKET;
  if (node.isKeystone) return PASSIVE_TYPE.KEYSTONE;
  if (node.isNotable) return PASSIVE_TYPE.NOTABLE;
  if (node.stats?.length === 1 && SMALL_ATTRIBUTE_STATS.includes(node.stats[0])) {
    return PASSIVE_TYPE.SMALL_ATTRIBUTE;
  }
  return PASSIVE_TYPE.SMALL_NORMAL;
}

function isValidForAlteration(node) {
  const t = getPassiveSkillType(node);
  return t !== PASSIVE_TYPE.NONE && t !== PASSIVE_TYPE.JEWEL_SOCKET;
}

// ─── Data Preprocessing ────────────────────────────────────────────────────

/**
 * Build reverse-lookup maps from raw alternate passive data.
 * Returns { skillsByTypeVersion, additionsByTypeVersion, allSkills, allAdditions }
 */
export function initTimelessData(altSkills, altAdditions) {
  // skillsByTypeVersion[passiveType][versionIndex] = [skill, ...]
  const skillsByTypeVersion = {};
  for (const skill of altSkills) {
    for (const pType of skill.PassiveType) {
      if (!skillsByTypeVersion[pType]) skillsByTypeVersion[pType] = {};
      const vk = skill.AlternateTreeVersionsKey;
      if (!skillsByTypeVersion[pType][vk]) skillsByTypeVersion[pType][vk] = [];
      skillsByTypeVersion[pType][vk].push(skill);
    }
  }

  // additionsByTypeVersion[passiveType][versionIndex] = [addition, ...]
  const additionsByTypeVersion = {};
  for (const add of altAdditions) {
    for (const pType of add.PassiveType) {
      if (!additionsByTypeVersion[pType]) additionsByTypeVersion[pType] = {};
      const vk = add.AlternateTreeVersionsKey;
      if (!additionsByTypeVersion[pType][vk]) additionsByTypeVersion[pType][vk] = [];
      additionsByTypeVersion[pType][vk].push(add);
    }
  }

  return { skillsByTypeVersion, additionsByTypeVersion, allSkills: altSkills, allAdditions: altAdditions };
}

// ─── Radius Calculation ─────────────────────────────────────────────────────

const JEWEL_RADIUS = 1800;

/**
 * Find all passives within timeless jewel radius of a socket.
 * Uses pre-calculated positions from usePassiveTreeData hook.
 */
export function getNodesInRadius(socketNodeId, treeData) {
  const { nodes, groups, positions } = treeData;
  const socketNode = nodes[socketNodeId];
  if (!socketNode) return [];

  const socketPos = positions?.[socketNodeId] || calculateNodePosition(socketNode, groups);

  const result = [];
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (nodeId === 'root') continue;
    if (node.ascendancyName) continue;
    if (node.isProxy) continue;
    if (node.isMastery) continue;
    if (node.isJewelSocket) continue;
    if (node.expansionJewel) continue;
    if (!node.skill) continue;
    if (!node.name) continue;

    const nodeType = getPassiveSkillType(node);
    if (nodeType === PASSIVE_TYPE.NONE || nodeType === PASSIVE_TYPE.JEWEL_SOCKET) continue;

    const pos = positions?.[nodeId] || calculateNodePosition(node, groups);
    const dx = pos.x - socketPos.x;
    const dy = pos.y - socketPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= JEWEL_RADIUS) {
      result.push({ nodeId, node, type: nodeType, distance: dist });
    }
  }

  // Sort: keystones first, then notables, then small passives
  result.sort((a, b) => {
    if (a.type !== b.type) return b.type - a.type; // KEYSTONE=4 > NOTABLE=3 > SMALL=1,2
    return a.distance - b.distance;
  });

  return result;
}

/**
 * Get a human-readable region name for a jewel socket based on nearby notables.
 */
export function getSocketRegionName(socketNodeId, treeData) {
  const nodesInRadius = getNodesInRadius(socketNodeId, treeData);
  const notables = nodesInRadius.filter(n => n.type === PASSIVE_TYPE.NOTABLE);
  if (notables.length === 0) return `Socket ${socketNodeId}`;
  // Use the two closest notables
  const names = notables.slice(0, 2).map(n => n.node.name);
  return names.join(' / ');
}

// ─── Core Calculation ───────────────────────────────────────────────────────

function getApplicableSkills(nodeType, versionIndex, lookups) {
  return lookups.skillsByTypeVersion[nodeType]?.[versionIndex] || [];
}

function getApplicableAdditions(nodeType, versionIndex, lookups) {
  return lookups.additionsByTypeVersion[nodeType]?.[versionIndex] || [];
}

function getKeystoneSkill(versionIndex, conqueror, allSkills) {
  return allSkills.find(s =>
    s.AlternateTreeVersionsKey === versionIndex &&
    s.PassiveType.includes(PASSIVE_TYPE.KEYSTONE) &&
    s.Unknown19 === conqueror.index &&
    s.Unknown25 === conqueror.version
  ) || null;
}

function getStatMinMax(entry, isMin, index) {
  if (isMin) {
    if (index === 0) return entry.Stat1Min;
    if (index === 1) return entry.Stat2Min;
    if (index === 2) return entry.Unknown10 || 0;
    if (index === 3) return entry.Unknown11 || 0;
  } else {
    if (index === 0) return entry.Stat1Max;
    if (index === 1) return entry.Stat2Max;
    if (index === 2) return entry.Unknown12 || 0;
    if (index === 3) return entry.Unknown13 || 0;
  }
  return 0;
}

function isPassiveSkillReplaced(rng, nodeType, version, graphId, seed) {
  if (nodeType === PASSIVE_TYPE.KEYSTONE) return true;

  if (nodeType === PASSIVE_TYPE.NOTABLE) {
    if (version.notableSpawnWeight >= 100) return true;
    if (version.notableSpawnWeight === 0) return false;
    rng.reset(graphId, seed);
    return rng.generate(0, 100) < version.notableSpawnWeight;
  }

  if (nodeType === PASSIVE_TYPE.SMALL_ATTRIBUTE) return version.smallAttrReplaced;
  return version.smallNormalReplaced;
}

function replacePassiveSkill(rng, node, nodeType, jewelTypeId, version, conqueror, lookups, adjustedSeed) {
  // Keystones: predetermined per conqueror
  if (nodeType === PASSIVE_TYPE.KEYSTONE) {
    const ks = getKeystoneSkill(jewelTypeId, conqueror, lookups.allSkills);
    if (!ks) return null;
    return {
      replaced: true,
      skill: ks,
      statRolls: { 0: ks.Stat1Min },
      additions: [],
    };
  }

  const applicableSkills = getApplicableSkills(nodeType, jewelTypeId, lookups);
  if (applicableSkills.length === 0) return null;

  rng.reset(node.skill, adjustedSeed);

  // QUIRK: dummy roll for notables. isPassiveSkillReplaced() already burned
  // one rng.generate(0, 100) deciding whether to replace; we have to burn
  // an equivalent here so the SUBSEQUENT skill/stat rolls land on the same
  // RNG state as Go's reference implementation. Removing this puts every
  // notable result one roll out of phase with what the game produces. (☕)
  if (nodeType === PASSIVE_TYPE.NOTABLE) {
    rng.generate(0, 100);
  }

  // Weighted random selection
  let rolledSkill = null;
  let currentWeight = 0;
  for (const skill of applicableSkills) {
    currentWeight += skill.SpawnWeight;
    if (rng.generateSingle(currentWeight) < skill.SpawnWeight) {
      rolledSkill = skill;
    }
  }

  if (!rolledSkill) return null;

  // Roll stat values
  const statCount = Math.min(rolledSkill.StatsKeys.length, 4);
  const statRolls = {};
  for (let i = 0; i < statCount; i++) {
    const min = getStatMinMax(rolledSkill, true, i);
    const max = getStatMinMax(rolledSkill, false, i);
    statRolls[i] = min;
    if (max > min) {
      statRolls[i] = rng.generate(min, max);
    }
  }

  // Check for additional rolls on replaced skill
  if (rolledSkill.RandomMin === 0 && rolledSkill.RandomMax === 0) {
    return { replaced: true, skill: rolledSkill, statRolls, additions: [] };
  }

  const minAdd = version.minAdd + rolledSkill.RandomMin;
  const maxAdd = version.maxAdd + rolledSkill.RandomMax;
  const additions = rollAdditions(rng, nodeType, jewelTypeId, minAdd, maxAdd, lookups);

  return { replaced: true, skill: rolledSkill, statRolls, additions };
}

function augmentPassiveSkill(rng, node, nodeType, jewelTypeId, version, lookups, adjustedSeed) {
  rng.reset(node.skill, adjustedSeed);

  // Same dummy-roll dance as in replacePassiveSkill — see comment there.
  if (nodeType === PASSIVE_TYPE.NOTABLE) {
    rng.generate(0, 100);
  }

  const additions = rollAdditions(rng, nodeType, jewelTypeId, version.minAdd, version.maxAdd, lookups);
  return { replaced: false, skill: null, statRolls: {}, additions };
}

function rollAdditions(rng, nodeType, versionIndex, minAdd, maxAdd, lookups) {
  let count = minAdd;
  if (maxAdd > minAdd) {
    count = rng.generate(minAdd, maxAdd);
  }

  const additions = [];
  for (let i = 0; i < count; i++) {
    let addition = null;
    // Keep rolling until we get a valid addition (matches Go's nil-retry loop)
    while (addition === null) {
      addition = rollSingleAddition(rng, nodeType, versionIndex, lookups);
    }

    const statCount = Math.min(addition.StatsKeys.length, 2);
    const statRolls = {};
    for (let j = 0; j < statCount; j++) {
      const min = getStatMinMax(addition, true, j);
      const max = getStatMinMax(addition, false, j);
      statRolls[j] = min;
      if (max > min) {
        statRolls[j] = rng.generate(min, max);
      }
    }

    additions.push({ addition, statRolls });
  }

  return additions;
}

function rollSingleAddition(rng, nodeType, versionIndex, lookups) {
  const applicable = getApplicableAdditions(nodeType, versionIndex, lookups);
  if (applicable.length === 0) return null;

  let totalWeight = 0;
  for (const add of applicable) totalWeight += add.SpawnWeight;
  if (totalWeight === 0) return null;

  let roll = rng.generateSingle(totalWeight);
  for (const add of applicable) {
    if (add.SpawnWeight > roll) return add;
    roll -= add.SpawnWeight;
  }

  return null;
}

/**
 * Calculate all timeless jewel effects for a given seed, socket, and jewel configuration.
 * Returns array of { nodeId, node, type, result } where result has:
 *   { replaced, skill, statRolls, additions }
 */
export function calculateSeed(seed, jewelType, conqueror, nodesInRadius, lookups) {
  const version = TREE_VERSIONS[jewelType.id];
  if (!version) return [];

  const adjustedSeed = jewelType.seedStep
    ? Math.floor(seed / jewelType.seedStep)
    : seed;

  const rng = new TinyMT32();
  const results = [];

  for (const { nodeId, node, type } of nodesInRadius) {
    const replaced = isPassiveSkillReplaced(rng, type, version, node.skill, adjustedSeed);

    let result;
    if (replaced) {
      result = replacePassiveSkill(rng, node, type, jewelType.id, version, conqueror, lookups, adjustedSeed);
    } else {
      result = augmentPassiveSkill(rng, node, type, jewelType.id, version, lookups, adjustedSeed);
    }

    if (result) {
      results.push({ nodeId, node, type, result });
    }
  }

  return results;
}

// ─── Stat Translation ───────────────────────────────────────────────────────

/**
 * Convert a stat ID + rolled value into human-readable text.
 */
export function translateStat(statId, value, translations) {
  const entries = translations[String(statId)];
  if (!entries || entries.length === 0) return `Stat ${statId}: ${value}`;

  // Find matching translation by value range
  for (const entry of entries) {
    const scaledValue = entry.divider ? Math.floor(value / entry.divider) : value;
    const matchesFrom = entry.from === undefined || scaledValue >= entry.from;
    const matchesTo = entry.to === undefined || scaledValue <= entry.to;
    if (matchesFrom && matchesTo) {
      return entry.translation.replace('{0}', scaledValue);
    }
  }

  // Fallback to first entry
  const e = entries[0];
  const scaled = e.divider ? Math.floor(value / e.divider) : value;
  return e.translation.replace('{0}', scaled);
}

// ─── Stat Label (for picker, no rolled value) ──────────────────────────────

function getStatLabel(statId, translations) {
  const entries = translations[String(statId)];
  if (!entries || entries.length === 0) return `Stat ${statId}`;
  // Use the positive/"from" variant, replace {0} with #
  const entry = entries.find(e => e.from !== undefined && e.from >= 0) || entries[0];
  return entry.translation.replace('{0}', '#');
}

// ─── Available Stats for Reverse Search ─────────────────────────────────────

/**
 * Collect all unique stats that a jewel type can produce.
 * Returns array of { statId, name } sorted alphabetically by name.
 */
export function getAvailableStats(jewelTypeId, lookups, translations) {
  const seen = new Set();
  const stats = [];

  const collect = (entry) => {
    for (const statId of entry.StatsKeys) {
      if (seen.has(statId)) continue;
      seen.add(statId);
      const name = getStatLabel(statId, translations);
      stats.push({ statId, name });
    }
  };

  // Replacement skills for this jewel version
  for (const skills of Object.values(lookups.skillsByTypeVersion)) {
    const list = skills[jewelTypeId];
    if (list) list.forEach(collect);
  }

  // Augmentation additions for this jewel version
  for (const adds of Object.values(lookups.additionsByTypeVersion)) {
    const list = adds[jewelTypeId];
    if (list) list.forEach(collect);
  }

  stats.sort((a, b) => a.name.localeCompare(b.name));
  return stats;
}

// ─── Trade URL Generation ───────────────────────────────────────────────────

const MAX_SEEDS_PER_GROUP = 45; // PoE trade API limit per stat group

function buildTradeQuery(jewelType, conquerorName, seeds, devotionModIds = []) {
  const statId = `explicit.pseudo_timeless_jewel_${conquerorName.toLowerCase()}`;

  const statGroups = [];

  if (seeds.length === 1) {
    // Single seed: list all conquerors, only selected one enabled
    statGroups.push({
      type: 'count',
      value: { min: 1 },
      filters: jewelType.conquerors.map(cq => ({
        id: `explicit.pseudo_timeless_jewel_${cq.name.toLowerCase()}`,
        value: { min: seeds[0], max: seeds[0] },
        disabled: cq.name !== conquerorName,
      })),
      disabled: false,
    });
  } else {
    // Multiple seeds: one filter per seed for the selected conqueror, min 1 = match ANY
    const filters = seeds.slice(0, MAX_SEEDS_PER_GROUP).map(s => ({
      id: statId,
      value: { min: s, max: s },
    }));
    statGroups.push({
      type: 'count',
      value: { min: 1 },
      filters,
      disabled: false,
    });
  }

  // Add devotion mod filters for Militant Faith
  if (devotionModIds.length > 0) {
    const devotionFilters = MILITANT_FAITH_DEVOTION_MODS.map(mod => ({
      id: mod.tradeStatId,
      value: {},
      disabled: !devotionModIds.includes(mod.id),
    }));
    statGroups.push({
      type: 'count',
      value: { min: devotionModIds.length },
      filters: devotionFilters,
      disabled: false,
    });
  }

  return {
    query: {
      status: { option: 'securable' },
      stats: statGroups,
    },
    sort: { price: 'asc' },
  };
}

function tradeQueryToUrl(league, query) {
  const encoded = encodeURIComponent(JSON.stringify(query));
  return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}?q=${encoded}`;
}

export function buildTradeUrl(league, jewelType, seed, conquerorName, devotionModIds = []) {
  return tradeQueryToUrl(league, buildTradeQuery(jewelType, conquerorName, [seed], devotionModIds));
}

/**
 * Build batch trade URLs for multiple seeds. Splits into chunks of MAX_SEEDS_PER_GROUP.
 * Returns array of { url, seeds, startIdx, endIdx }.
 */
export function buildBatchTradeUrls(league, jewelType, seeds, conquerorName, devotionModIds = []) {
  const urls = [];
  for (let i = 0; i < seeds.length; i += MAX_SEEDS_PER_GROUP) {
    const chunk = seeds.slice(i, i + MAX_SEEDS_PER_GROUP);
    const query = buildTradeQuery(jewelType, conquerorName, chunk, devotionModIds);
    urls.push({
      url: tradeQueryToUrl(league, query),
      seeds: chunk,
      startIdx: i + 1,
      endIdx: i + chunk.length,
    });
  }
  return urls;
}
