/**
 * Fusing Calculator — 6-link probability math (geometric distribution)
 *
 * Base chance at 0% quality: 1/1500
 * Quality bonus: chance = (1/1500) * (1 + quality/100)
 */

// Base chance at 0% quality per target link count (index = link count)
// 6-link: 1/1500, 5-link: 1/150, 4-link: ~1/5, 3-link: ~1/3, 2-link: ~1/1
const BASE_CHANCE_BY_LINKS = [0, 0, 1, 1/3, 1/5, 1/150, 1/1500];

// Milestones scaled per target link count
const MILESTONES_BY_LINKS = {
  2: [1, 2, 3],
  3: [1, 2, 3, 5, 8, 10],
  4: [1, 2, 3, 5, 8, 10, 15, 20],
  5: [10, 25, 50, 75, 100, 150, 200, 300, 500],
  6: [100, 250, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000],
};

// Bench crafting costs in fusings (index = link count)
// Corrupted items also cost the same number of Vaal Orbs
const BENCH_LINK_COST = [0, 0, 1, 3, 5, 150, 1500];

/**
 * Calculate fusing statistics for a given quality and socket count.
 */
export function calculateFusing(quality, sockets = 6) {
  const q = Math.max(0, Math.min(30, quality));
  const target = Math.max(1, Math.min(6, sockets));

  // 1 socket: no links possible
  if (target <= 1) {
    return { quality: q, sockets: target, noLinksPossible: true, benchCost: 0 };
  }

  // 2-4 sockets: bench is very cheap, manual isn't meaningful
  if (target <= 4) {
    const baseP = BASE_CHANCE_BY_LINKS[target];
    const p = Math.min(1, baseP * (1 + q / 100));
    const avgFusings = 1 / p;
    const stdDev = Math.sqrt((1 - p) / (p * p));
    const milestones = MILESTONES_BY_LINKS[target];
    const cumulativeTable = milestones.map(n => ({
      fusings: n,
      probability: 1 - Math.pow(1 - p, n),
    }));

    return {
      quality: q,
      sockets: target,
      benchOnly: true,
      successChance: p,
      avgFusings,
      stdDev,
      benchCost: BENCH_LINK_COST[target],
      cumulativeTable,
    };
  }

  // 5-6 sockets: full calculation
  const baseP = BASE_CHANCE_BY_LINKS[target];
  const p = Math.min(1, baseP * (1 + q / 100));
  const avgFusings = 1 / p;
  const stdDev = Math.sqrt((1 - p) / (p * p));

  const milestones = MILESTONES_BY_LINKS[target];
  const cumulativeTable = milestones.map(n => ({
    fusings: n,
    probability: 1 - Math.pow(1 - p, n),
  }));

  // For 6-socket, also calculate 5-link milestone info
  const fiveLink = target === 6 ? (() => {
    const p5 = BASE_CHANCE_BY_LINKS[5] * (1 + q / 100);
    return { chance: p5, avgFusings: 1 / p5 };
  })() : null;

  return {
    quality: q,
    sockets: target,
    successChance: p,
    avgFusings,
    stdDev,
    benchCost: BENCH_LINK_COST[target],
    cumulativeTable,
    fiveLink,
  };
}

/**
 * Tainted Orb of Fusing strategy with bench resets.
 *
 * Mechanic: each tainted fusing has 50% to add a link, 50% to remove a link
 * from the largest group.
 *
 * For 5-6 sockets: bench to 4-link, slam tainted fusings, reset at 3L → 4L.
 * For 2-4 sockets: bench directly to max links (cheap enough, no tainted needed).
 * For 1 socket: no links possible.
 *
 * Markov chain on states {4, 5, ..., target-1}:
 *   6-socket: E[4L]=6 fusings, 2 resets | E[5L]=4 fusings, 1 reset
 *   5-socket: E[4L]=2 fusings, 1 reset
 */
export function calculateTaintedStrategy(sockets, currentLinks) {
  const target = sockets;

  // 1 socket: no links possible
  if (sockets <= 1) {
    return { noLinksPossible: true };
  }

  // Already at target
  if (currentLinks >= target) {
    return { alreadyDone: true };
  }

  // For 2-4 sockets: bench is cheap, just use it directly
  if (sockets <= 4) {
    return {
      benchOnly: true,
      target,
      benchCost: BENCH_LINK_COST[target],
    };
  }

  // 5-6 sockets: tainted strategy with bench resets at 4L
  const resetTo = 4;
  const needsInitialBench = currentLinks < resetTo;
  const startState = needsInitialBench ? resetTo : currentLinks;
  const initialBenchCost = needsInitialBench ? BENCH_LINK_COST[resetTo] : 0;

  const expectations = target === 6
    ? { 4: { fusings: 6, resets: 2 }, 5: { fusings: 4, resets: 1 } }
    : { 4: { fusings: 2, resets: 1 } }; // target === 5

  const e = expectations[startState] || expectations[resetTo];
  const cumulativeTable = computeTaintedCumulative(startState, target);

  return {
    alreadyDone: false,
    startState,
    target,
    needsInitialBench,
    initialBenchFusings: initialBenchCost,
    avgTaintedFusings: e.fusings,
    avgBenchResets: e.resets,
    benchResetCost: BENCH_LINK_COST[resetTo],
    cumulativeTable,
  };
}

function computeTaintedCumulative(startState, target) {
  const milestones = [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30, 35];
  const maxN = milestones[milestones.length - 1];

  if (target === 6) {
    // States: 4 (index 0), 5 (index 1). Absorb at 6, reset at 3→4.
    // F4(n) = 0.5 * F5(n-1) + 0.5 * F4(n-1)
    // F5(n) = 0.5 + 0.5 * F4(n-1)
    let F4 = 0, F5 = 0;
    const table = [];
    let mi = 0;
    for (let n = 1; n <= maxN; n++) {
      const newF4 = 0.5 * F5 + 0.5 * F4;
      const newF5 = 0.5 + 0.5 * F4;
      F4 = newF4;
      F5 = newF5;
      if (mi < milestones.length && n === milestones[mi]) {
        table.push({ fusings: n, probability: startState === 5 ? F5 : F4 });
        mi++;
      }
    }
    return table;
  } else {
    // 5-socket. State: 4. Absorb at 5, reset at 3→4.
    // F4(n) = 0.5 + 0.5 * F4(n-1)
    let F4 = 0;
    const table = [];
    let mi = 0;
    for (let n = 1; n <= maxN; n++) {
      F4 = 0.5 + 0.5 * F4;
      if (mi < milestones.length && n === milestones[mi]) {
        table.push({ fusings: n, probability: F4 });
        mi++;
      }
    }
    return table;
  }
}

/**
 * Compare strategies for linking an item.
 * Non-corrupted: Manual vs Bench
 * Corrupted: Corrupted Bench vs Tainted Strategy (with bench resets)
 */
export function calculateCostComparison(stats, fusingPrice, taintedFusingPrice, vaalPrice, corrupted, taintedStrategy, omenPrice) {
  const strategies = [];

  if (!corrupted) {
    // Manual fusing — use 75th percentile for "best" comparison
    // For geometric distribution, percentile N = ln(1 - N) / ln(1 - p)
    const manualOrbs = stats.avgFusings;
    const p75Orbs = stats.successChance > 0
      ? Math.ceil(Math.log(1 - 0.75) / Math.log(1 - stats.successChance))
      : Infinity;
    strategies.push({
      method: 'Manual Fusing',
      description: `Average ${Math.round(manualOrbs).toLocaleString()} fusings at ${stats.quality}% quality`,
      avgOrbs: manualOrbs,
      p75Orbs,
      chaosCost: fusingPrice ? manualOrbs * fusingPrice : null,
      // Risk-adjusted cost: compare at 75th percentile
      riskAdjustedCost: fusingPrice ? p75Orbs * fusingPrice : null,
    });

    // Bench craft
    strategies.push({
      method: 'Crafting Bench',
      description: `Guaranteed for ${stats.benchCost.toLocaleString()} fusings`,
      avgOrbs: stats.benchCost,
      chaosCost: fusingPrice ? stats.benchCost * fusingPrice : null,
      riskAdjustedCost: fusingPrice ? stats.benchCost * fusingPrice : null,
    });

    // Omen of Connections — only valid for 6-link target
    if (omenPrice != null && stats.sockets === 6) {
      const omenCost = omenPrice + (fusingPrice || 0); // 1 omen + 1 fusing
      strategies.push({
        method: 'Omen of Connections',
        description: 'Guaranteed 6-link (1 Omen + 1 Fusing)',
        avgOrbs: 1,
        extraOrbs: '+ 1 omen',
        chaosCost: omenCost,
        riskAdjustedCost: omenCost,
        isOmen: true,
      });
    }
  } else {
    // Corrupted bench: fusings + equal vaals
    const benchFusings = stats.benchCost;
    const benchChaosCost = fusingPrice
      ? benchFusings * fusingPrice + (vaalPrice ? benchFusings * vaalPrice : 0)
      : null;
    strategies.push({
      method: 'Corrupted Bench',
      description: `${benchFusings.toLocaleString()} fusings + ${benchFusings.toLocaleString()} vaal orbs`,
      avgOrbs: benchFusings,
      extraOrbs: `+ ${benchFusings.toLocaleString()} vaals`,
      chaosCost: benchChaosCost,
    });

    // Tainted strategy with bench resets
    if (taintedStrategy && !taintedStrategy.alreadyDone && taintedFusingPrice != null) {
      const t = taintedStrategy;
      const resetCostChaos = t.benchResetCost * (fusingPrice || 0) + t.benchResetCost * (vaalPrice || 0);
      const initialCostChaos = t.initialBenchFusings * (fusingPrice || 0) + t.initialBenchFusings * (vaalPrice || 0);

      const totalChaos =
        initialCostChaos +
        t.avgTaintedFusings * taintedFusingPrice +
        t.avgBenchResets * resetCostChaos;

      strategies.push({
        method: 'Tainted Strategy',
        description: `~${t.avgTaintedFusings} tainted fusings + ~${t.avgBenchResets} bench resets`,
        avgOrbs: t.avgTaintedFusings,
        extraOrbs: `tainted fusings`,
        chaosCost: totalChaos,
        isTainted: true,
      });
    }
  }

  // Mark best — use risk-adjusted cost (75th percentile) when available, else chaos cost
  const withCosts = strategies.filter(s => s.chaosCost != null);
  if (withCosts.length > 0) {
    const costKey = withCosts.some(s => s.riskAdjustedCost != null) ? 'riskAdjustedCost' : 'chaosCost';
    const comparable = withCosts.filter(s => s[costKey] != null);
    if (comparable.length > 0) {
      const minCost = Math.min(...comparable.map(s => s[costKey]));
      for (const s of strategies) {
        s.isBest = s[costKey] === minCost;
      }
    }
  }

  return strategies;
}
