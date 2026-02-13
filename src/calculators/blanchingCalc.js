import { getColorChances } from './colorChances.js';
import { multinomialProb } from './mathUtils.js';

const WHITE_PROBS = { 1: 0.50, 2: 0.25, 3: 0.25 };

/**
 * Omen of Blanching: uses a chromatic (stat-weighted colors) then turns 1-3
 * random sockets white (50%/25%/25%).
 * Returns { chance, avgAttempts, stdDev }
 */
export function calculateBlanching(sockets, str, dex, int, desiredR, desiredG, desiredB, desiredW) {
  const chances = getColorChances(str, dex, int);
  let totalProb = 0;

  for (let wRoll = 1; wRoll <= 3; wRoll++) {
    if (wRoll > sockets) continue;
    if (wRoll < desiredW) continue;

    const colored = sockets - wRoll;
    if (colored < desiredR + desiredG + desiredB) continue;

    const colorProb = multinomialProb(colored, desiredR, desiredG, desiredB, chances.r, chances.g, chances.b);
    totalProb += WHITE_PROBS[wRoll] * colorProb;
  }

  const avg = totalProb > 0 ? 1 / totalProb : Infinity;
  const stdDev = totalProb > 0 ? Math.sqrt((1 - totalProb) / (totalProb * totalProb)) : Infinity;

  return { chance: totalProb, avgAttempts: avg, stdDev };
}
