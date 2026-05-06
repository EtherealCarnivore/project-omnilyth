import { fact } from './mathUtils.js';

/**
 * Tainted Chromatic Orb: each socket is independently 1/3 chance per color.
 *
 * QUIRK: unlike a regular Chromatic, Tainted ignores str/dex/int requirements
 * entirely — every socket rolls a flat 1/3/1/3/1/3 regardless of the off-color
 * weighting that `getColorChances()` would otherwise apply. That's why this
 * calc takes no stat parameters.
 *
 * Returns { chance, avgAttempts, stdDev }
 */
export function calculateTainted(sockets, desiredR, desiredG, desiredB) {
  const free = sockets - desiredR - desiredG - desiredB;
  let totalChance = 0;

  // Multinomial expansion of (1/3 + 1/3 + 1/3)^sockets, summed over every
  // (r,g,b) triple that satisfies the desired-minimums. coeff is the count
  // of distinct socket arrangements producing that exact (r,g,b).
  for (let fr = 0; fr <= free; fr++) {
    for (let fg = 0; fg <= free - fr; fg++) {
      const fb = free - fr - fg;
      const r = desiredR + fr;
      const g = desiredG + fg;
      const b = desiredB + fb;
      const coeff = fact(sockets) / (fact(r) * fact(g) * fact(b));
      totalChance += coeff / Math.pow(3, sockets);
    }
  }

  const avg = 1 / totalChance;
  const stdDev = Math.sqrt((1 - totalChance) / (totalChance * totalChance));

  return { chance: totalChance, avgAttempts: avg, stdDev };
}
