/**
 * Socketing Calculator — Jeweller's Orb math for rolling sockets.
 *
 * Formula: Average Jeweller's = BASE / (1 + quality/100)
 * Quality gives a linear 1% improvement per 1%.
 * Quality is NOT consumed when using Jeweller's Orbs.
 */

// Base average Jeweller's Orbs needed at 0% quality (index = target sockets)
const BASE_AVG = [0, 0, 1, 3, 10, 60, 300];

// Crafting bench costs in Jeweller's Orbs (corrupted: same + equal Vaal Orbs)
const BENCH_COST = [0, 1, 1, 3, 10, 70, 350];

// Minimum item level required for each socket count
const MIN_ILVL = [0, 1, 1, 2, 25, 35, 50];

const MILESTONES_BY_TARGET = {
  2: [1, 2, 3, 5],
  3: [1, 2, 3, 5, 8, 10],
  4: [2, 5, 10, 15, 20, 30],
  5: [10, 20, 30, 50, 75, 100, 150],
  6: [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000],
};

/**
 * Calculate socketing statistics.
 * @param {number} quality - Item quality 0-30
 * @param {number} targetSockets - Desired socket count 2-6
 * @returns {object} Stats
 */
export function calculateSocketing(quality, targetSockets) {
  const q = Math.max(0, Math.min(30, quality));
  const target = Math.max(2, Math.min(6, targetSockets));

  const baseAvg = BASE_AVG[target];
  const avgJewellers = baseAvg / (1 + q / 100);
  const p = 1 / avgJewellers;
  const stdDev = Math.sqrt((1 - p) / (p * p));

  const milestones = MILESTONES_BY_TARGET[target] || MILESTONES_BY_TARGET[6];
  const cumulativeTable = milestones.map(n => ({
    jewellers: n,
    probability: 1 - Math.pow(1 - p, n),
  }));

  return {
    quality: q,
    targetSockets: target,
    successChance: p,
    avgJewellers,
    stdDev,
    benchCost: BENCH_COST[target],
    minItemLevel: MIN_ILVL[target],
    cumulativeTable,
  };
}

/**
 * Compare manual jewellering vs bench for socketing.
 * @param {object} stats - From calculateSocketing
 * @param {number|null} jewellerPrice - Chaos per Jeweller's Orb
 * @param {number|null} vaalPrice - Chaos per Vaal Orb
 * @param {boolean} corrupted - Is item corrupted
 * @returns {Array} strategies
 */
export function calculateSocketCostComparison(stats, jewellerPrice, vaalPrice, corrupted) {
  const strategies = [];

  if (!corrupted) {
    // Manual jewellering — use 75th percentile for risk-adjusted comparison
    const p75Orbs = stats.successChance > 0
      ? Math.ceil(Math.log(1 - 0.75) / Math.log(1 - stats.successChance))
      : Infinity;
    strategies.push({
      method: 'Manual (Jeweller\'s)',
      description: `~${Math.round(stats.avgJewellers)} jewellers at ${stats.quality}% quality`,
      avgOrbs: stats.avgJewellers,
      p75Orbs,
      chaosCost: jewellerPrice ? stats.avgJewellers * jewellerPrice : null,
      riskAdjustedCost: jewellerPrice ? p75Orbs * jewellerPrice : null,
    });

    // Bench craft
    strategies.push({
      method: 'Crafting Bench',
      description: `Guaranteed ${stats.targetSockets} sockets`,
      avgOrbs: stats.benchCost,
      chaosCost: jewellerPrice ? stats.benchCost * jewellerPrice : null,
      riskAdjustedCost: jewellerPrice ? stats.benchCost * jewellerPrice : null,
    });
  } else {
    // Corrupted bench: jewellers + equal vaals
    const bench = stats.benchCost;
    const chaosCost = jewellerPrice
      ? bench * jewellerPrice + (vaalPrice ? bench * vaalPrice : 0)
      : null;
    strategies.push({
      method: 'Corrupted Bench',
      description: `${bench} jewellers + ${bench} vaal orbs`,
      avgOrbs: bench,
      extraOrbs: `+ ${bench} vaals`,
      chaosCost,
    });
  }

  // Mark best — use risk-adjusted cost (75th percentile) when available
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
