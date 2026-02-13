import { fact } from './mathUtils.js';

/**
 * Tainted Chromatic Orb: each socket is independently 1/3 chance per color.
 * Returns { chance, avgAttempts, stdDev }
 */
export function calculateTainted(sockets, desiredR, desiredG, desiredB) {
  const free = sockets - desiredR - desiredG - desiredB;
  let totalChance = 0;

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
