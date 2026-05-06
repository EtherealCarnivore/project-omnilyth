import { getColorChances } from './colorChances.js';
import { multinomialProb } from './mathUtils.js';

// QUIRK: bench-craft cost in chromes-equivalent for "set this socket to colour
// X" by socket index. PoE's bench scales superlinearly past 4 sockets — note
// the jump from 10 (4S) to 70 (5S) to 350 (6S). Off-by-one matters: index is
// SOCKET COUNT, not array position; index 0 is unused.
const BENCH_COST = [0, 1, 1, 3, 10, 70, 350];

/**
 * Jeweller's Method: compare chroming at various base socket counts
 * then jewellering up to target, locking in desired colors cheaply.
 *
 * Strategy is a 2-phase hybrid:
 *   1. Chrome at some `base` socket count (1..target), trying to land
 *      `(br, bg, bb)` of your desired colors.
 *   2. Use Jeweller's Orbs to add the remaining sockets, with bench-craft
 *      to lock in colors as you go. Hardest colors (lowest p) get assigned
 *      to the cheapest socket positions to minimise cost — see addedProbs.sort().
 *
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
            // Per-socket cost = E[chromes spent before bench locks the color].
            // The (1-p) * BENCH_COST[socketIdx-1] term accounts for the case
            // where the natural roll missed and we bench down-and-up — bench
            // first removes a socket (cost of lower index), then we re-add.
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
