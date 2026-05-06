/*
 * timelessSearch.js — Web Worker for brute-force timeless jewel reverse search.
 *
 * Receives jewel config + desired stat IDs, iterates all seeds,
 * reports progress and matching results back to the main thread.
 *
 * Imports the calculation engine directly (Vite handles module workers).
 *
 * LINK: this is the brute-force counterpart to src/calculators/timelessJewel.js.
 * Both files import the same TinyMT32 + TREE_VERSIONS + PASSIVE_TYPE so the
 * RNG state evolution stays bit-identical with the deterministic forward
 * calculation. If the calc engine drifts, the search results lie silently —
 * they'll match the worker's understanding of PoE, not the in-game one.
 *
 * CONTRACT: message protocol with src/components/TimelessJewelCalculator.jsx:
 *   IN  → { type: 'search', jewelType, conqueror, nodes, desiredStatIds,
 *           statWeights, minMatches, altSkills, altAdditions }
 *   IN  → { type: 'abort' }
 *   OUT → { type: 'progress', processed, totalSeeds, seed }
 *   OUT → { type: 'done', results: [{seed, score, uniqueCount,
 *                                    weightedScore, matches}] }
 * Worker errors are NOT propagated to the UI — if anything throws inside
 * runSearch, the user just sees no progress events. Wrap in try/catch
 * before adding new code paths.
 */

import {
  TinyMT32,
  TREE_VERSIONS,
  PASSIVE_TYPE,
  initTimelessData,
  getPassiveSkillType,
} from '../calculators/timelessJewel';

// ─── Message handler ────────────────────────────────────────────────────────

self.onmessage = function (e) {
  const { type } = e.data;
  if (type === 'search') runSearch(e.data);
  if (type === 'abort') self.close();
};

// ─── Core search loop ───────────────────────────────────────────────────────

function runSearch({ jewelType, conqueror, nodes, desiredStatIds, statWeights, minMatches, altSkills, altAdditions }) {
  const lookups = initTimelessData(altSkills, altAdditions);
  const version = TREE_VERSIONS[jewelType.id];
  const desiredSet = new Set(desiredStatIds);
  const weights = statWeights || {};
  const minRequired = minMatches || 1;

  const seedStep = jewelType.seedStep || 1;
  const seedMin = jewelType.minSeed;
  const seedMax = jewelType.maxSeed;
  const totalSeeds = Math.floor((seedMax - seedMin) / seedStep) + 1;

  const rng = new TinyMT32();
  const results = [];
  let processed = 0;
  // PERF: post a progress message ~200 times per search regardless of seed
  // count. Posting per-seed would saturate the structured-clone channel and
  // jank the main thread; 200 is dense enough to feel smooth in the UI.
  const PROGRESS_INTERVAL = Math.max(1, Math.floor(totalSeeds / 200));

  for (let seed = seedMin; seed <= seedMax; seed += seedStep) {
    const adjustedSeed = jewelType.seedStep ? Math.floor(seed / jewelType.seedStep) : seed;
    const matches = [];

    for (const n of nodes) {
      const nodeType = n.type;
      const replaced = isReplaced(rng, nodeType, version, n.skill, adjustedSeed);

      let statHits;
      if (replaced) {
        statHits = calcReplaceStats(rng, n, nodeType, jewelType.id, version, conqueror, lookups, adjustedSeed, desiredSet);
      } else {
        statHits = calcAugmentStats(rng, n, nodeType, jewelType.id, version, lookups, adjustedSeed, desiredSet);
      }

      for (const hit of statHits) {
        matches.push({ nodeId: n.nodeId, nodeName: n.name, ...hit });
      }
    }

    if (matches.length > 0) {
      // Count distinct nodes that got at least one desired stat
      const nodesHit = new Set(matches.map(m => m.nodeId)).size;
      if (nodesHit >= minRequired) {
        const uniqueStats = new Set(matches.map(m => m.statId));
        let weightedScore = 0;
        for (const m of matches) weightedScore += (weights[m.statId] || 1) * m.value;
        results.push({ seed, score: nodesHit, uniqueCount: uniqueStats.size, weightedScore, matches });
      }
    }

    processed++;
    if (processed % PROGRESS_INTERVAL === 0) {
      self.postMessage({ type: 'progress', processed, totalSeeds, seed });
    }
  }

  // Sort: most total hits first, then weighted score
  // CONTRACT: UI assumes results are pre-sorted desc by score (primary) and
  // weightedScore (tiebreak). Top-200 cap is also baked in here, not in the
  // UI — changing the slice without telling TimelessJewelCalculator.jsx
  // would silently change the user-visible result count.
  results.sort((a, b) => b.score - a.score || b.weightedScore - a.weightedScore);

  self.postMessage({ type: 'done', results: results.slice(0, 200) });
}

function sumValues(matches) {
  let sum = 0;
  for (const m of matches) sum += m.value;
  return sum;
}

// ─── Slimmed-down calculation (no full result objects, just stat hits) ───────

function isReplaced(rng, nodeType, version, graphId, seed) {
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

function getApplicableSkills(nodeType, versionIndex, lookups) {
  return lookups.skillsByTypeVersion[nodeType]?.[versionIndex] || [];
}

function getApplicableAdditions(nodeType, versionIndex, lookups) {
  return lookups.additionsByTypeVersion[nodeType]?.[versionIndex] || [];
}

function getStatMinMax(entry, isMin, index) {
  if (isMin) return index === 0 ? entry.Stat1Min : (index === 1 ? (entry.Stat2Min ?? 0) : 0);
  return index === 0 ? entry.Stat1Max : (index === 1 ? (entry.Stat2Max ?? 0) : 0);
}

function calcReplaceStats(rng, node, nodeType, jewelTypeId, version, conqueror, lookups, adjustedSeed, desiredSet) {
  const hits = [];

  // Keystones: predetermined per conqueror
  if (nodeType === PASSIVE_TYPE.KEYSTONE) {
    const ks = lookups.allSkills.find(s =>
      s.AlternateTreeVersionsKey === jewelTypeId &&
      s.PassiveType.includes(PASSIVE_TYPE.KEYSTONE) &&
      s.Unknown19 === conqueror.index &&
      s.Unknown25 === conqueror.version
    );
    if (ks) {
      for (const statId of ks.StatsKeys) {
        if (desiredSet.has(statId)) hits.push({ statId, value: ks.Stat1Min, skillName: ks.Name });
      }
    }
    return hits;
  }

  const applicable = getApplicableSkills(nodeType, jewelTypeId, lookups);
  if (applicable.length === 0) return hits;

  rng.reset(node.skill, adjustedSeed);
  if (nodeType === PASSIVE_TYPE.NOTABLE) rng.generate(0, 100);

  // Weighted selection
  let rolledSkill = null;
  let currentWeight = 0;
  for (const skill of applicable) {
    currentWeight += skill.SpawnWeight;
    if (rng.generateSingle(currentWeight) < skill.SpawnWeight) rolledSkill = skill;
  }
  if (!rolledSkill) return hits;

  // Roll stats and check against desired
  const statCount = Math.min(rolledSkill.StatsKeys.length, 4);
  for (let i = 0; i < statCount; i++) {
    const min = getStatMinMax(rolledSkill, true, i);
    const max = getStatMinMax(rolledSkill, false, i);
    const value = max > min ? rng.generate(min, max) : min;
    if (desiredSet.has(rolledSkill.StatsKeys[i])) {
      hits.push({ statId: rolledSkill.StatsKeys[i], value, skillName: rolledSkill.Name });
    }
  }

  // Additional rolls
  if (rolledSkill.RandomMin > 0 || rolledSkill.RandomMax > 0) {
    const minAdd = version.minAdd + rolledSkill.RandomMin;
    const maxAdd = version.maxAdd + rolledSkill.RandomMax;
    const addHits = rollAdditionHits(rng, nodeType, jewelTypeId, minAdd, maxAdd, lookups, desiredSet);
    hits.push(...addHits);
  }

  return hits;
}

function calcAugmentStats(rng, node, nodeType, jewelTypeId, version, lookups, adjustedSeed, desiredSet) {
  rng.reset(node.skill, adjustedSeed);
  if (nodeType === PASSIVE_TYPE.NOTABLE) rng.generate(0, 100);
  return rollAdditionHits(rng, nodeType, jewelTypeId, version.minAdd, version.maxAdd, lookups, desiredSet);
}

function rollAdditionHits(rng, nodeType, versionIndex, minAdd, maxAdd, lookups, desiredSet) {
  const hits = [];
  let count = minAdd;
  if (maxAdd > minAdd) count = rng.generate(minAdd, maxAdd);

  for (let i = 0; i < count; i++) {
    const applicable = getApplicableAdditions(nodeType, versionIndex, lookups);
    if (applicable.length === 0) continue;

    let totalWeight = 0;
    for (const add of applicable) totalWeight += add.SpawnWeight;
    if (totalWeight === 0) continue;

    let roll = rng.generateSingle(totalWeight);
    let picked = null;
    for (const add of applicable) {
      if (add.SpawnWeight > roll) { picked = add; break; }
      roll -= add.SpawnWeight;
    }
    if (!picked) continue;

    const statCount = Math.min(picked.StatsKeys.length, 2);
    for (let j = 0; j < statCount; j++) {
      const min = getStatMinMax(picked, true, j);
      const max = getStatMinMax(picked, false, j);
      const value = max > min ? rng.generate(min, max) : min;
      if (desiredSet.has(picked.StatsKeys[j])) {
        hits.push({ statId: picked.StatsKeys[j], value });
      }
    }
  }

  return hits;
}
