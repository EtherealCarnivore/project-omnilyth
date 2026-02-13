import { getColorChances } from './colorChances.js';
import { multinomialProb } from './mathUtils.js';

const BENCH_COST = [0, 1, 1, 3, 10, 70, 350]; // index = socket count

/**
 * Jeweller's Method: compare chroming at various base socket counts
 * then jewellering up to target, locking in desired colors cheaply.
 * Returns array of { base, label, chromeCost, jewellerCost, totalCost, isBest }
 */
export function calculateJeweller(sockets, str, dex, int, desiredR, desiredG, desiredB) {
  const chances = getColorChances(str, dex, int);
  const strategies = [];
  let bestIdx = -1;
  let bestTotal = Infinity;

  for (let base = 1; base <= sockets; base++) {
    let bestForBase = null;
    let bestCostForBase = Infinity;

    for (let br = 0; br <= Math.min(desiredR, base); br++) {
      for (let bg = 0; bg <= Math.min(desiredG, base - br); bg++) {
        for (let bb = 0; bb <= Math.min(desiredB, base - br - bg); bb++) {
          const addR = desiredR - br;
          const addG = desiredG - bg;
          const addB = desiredB - bb;
          const addTotal = addR + addG + addB;
          const addFree = sockets - base - addTotal;

          if (addFree < 0) continue;

          const chromeProb = multinomialProb(base, br, bg, bb, chances.r, chances.g, chances.b);
          if (base > 0 && chromeProb <= 0) continue;

          const chromeCost = base === 0 ? 0 : 1 / chromeProb;

          // Build list of per-socket hit probabilities for added sockets
          const addedProbs = [];
          for (let i = 0; i < addR; i++) addedProbs.push(chances.r);
          for (let i = 0; i < addG; i++) addedProbs.push(chances.g);
          for (let i = 0; i < addB; i++) addedProbs.push(chances.b);
          addedProbs.sort((a, b) => a - b); // hardest first at cheapest positions
          for (let i = 0; i < addFree; i++) addedProbs.push(1);

          let jewellerCost = BENCH_COST[base];
          for (let i = 0; i < addedProbs.length; i++) {
            const socketIdx = base + 1 + i;
            const p = addedProbs[i];
            jewellerCost += (BENCH_COST[socketIdx] + (1 - p) * BENCH_COST[socketIdx - 1]) / p;
          }

          const totalCost = chromeCost + jewellerCost;
          if (totalCost < bestCostForBase) {
            bestCostForBase = totalCost;
            bestForBase = { base, chromeCost, jewellerCost, totalCost };
          }
        }
      }
    }

    if (bestForBase) {
      const label = bestForBase.base === sockets
        ? `Pure Chromatic (${sockets}S)`
        : `Chrome ${bestForBase.base}S \u2192 Jeweller to ${sockets}S`;
      strategies.push({ ...bestForBase, label });

      if (bestForBase.totalCost < bestTotal) {
        bestTotal = bestForBase.totalCost;
        bestIdx = strategies.length - 1;
      }
    }
  }

  if (bestIdx >= 0) strategies[bestIdx].isBest = true;
  return strategies;
}
