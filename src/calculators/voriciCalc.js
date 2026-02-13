import { getColorChances } from './colorChances.js';
import { multinomialRecursive, calcChromaticBonus } from './mathUtils.js';

/**
 * Vorici craft recipes: { red, green, blue, cost, description }
 * cost is in chromatic orbs per attempt.
 */
const RECIPES = [
  { red: 0, green: 0, blue: 0, cost: 1, description: 'Drop Rate', isDropRate: true },
  { red: 0, green: 0, blue: 0, cost: 1, description: 'Chromatic', isChromatic: true },
  { red: 1, green: 0, blue: 0, cost: 4, description: 'Vorici 1R' },
  { red: 0, green: 1, blue: 0, cost: 4, description: 'Vorici 1G' },
  { red: 0, green: 0, blue: 1, cost: 4, description: 'Vorici 1B' },
  { red: 2, green: 0, blue: 0, cost: 25, description: 'Vorici 2R' },
  { red: 0, green: 2, blue: 0, cost: 25, description: 'Vorici 2G' },
  { red: 0, green: 0, blue: 2, cost: 25, description: 'Vorici 2B' },
  { red: 0, green: 1, blue: 1, cost: 15, description: 'Vorici 1G1B' },
  { red: 1, green: 0, blue: 1, cost: 15, description: 'Vorici 1R1B' },
  { red: 1, green: 1, blue: 0, cost: 15, description: 'Vorici 1R1G' },
  { red: 3, green: 0, blue: 0, cost: 120, description: 'Vorici 3R' },
  { red: 0, green: 3, blue: 0, cost: 120, description: 'Vorici 3G' },
  { red: 0, green: 0, blue: 3, cost: 120, description: 'Vorici 3B' },
  { red: 2, green: 1, blue: 0, cost: 100, description: 'Vorici 2R1G' },
  { red: 2, green: 0, blue: 1, cost: 100, description: 'Vorici 2R1B' },
  { red: 1, green: 2, blue: 0, cost: 100, description: 'Vorici 1R2G' },
  { red: 0, green: 2, blue: 1, cost: 100, description: 'Vorici 2G1B' },
  { red: 1, green: 0, blue: 2, cost: 100, description: 'Vorici 1R2B' },
  { red: 0, green: 1, blue: 2, cost: 100, description: 'Vorici 1G2B' },
];

function floatToPrecision(f, precision = 5, commas = true) {
  if (f === 0) return '0.' + '0'.repeat(precision);
  let prefix = '';
  if (f < 0) {
    f *= -1;
    prefix = '-';
  }
  const scaled = Math.round(f * Math.pow(10, precision));
  if (scaled === 0 && f > 0) {
    prefix = prefix === '-' ? '>-' : '<';
  }
  let s = String(scaled || 1);
  while (s.length <= precision) s = '0' + s;

  const intPart = s.slice(0, s.length - precision);
  const decPart = s.slice(s.length - precision);

  if (commas) {
    let result = '';
    for (let i = 0; i < intPart.length; i++) {
      if (i > 0 && (intPart.length - i) % 3 === 0) result += ',';
      result += intPart[i];
    }
    return prefix + result + '.' + decPart;
  }
  return prefix + intPart + '.' + decPart;
}

/**
 * Calculate all Vorici recipe probabilities for given inputs.
 * Returns array of { description, avgCost, chance, avgAttempts, costPerTry, stdDev, isBest }
 */
export function calculateVorici(sockets, str, dex, int, desiredR, desiredG, desiredB) {
  const colorChances = getColorChances(str, dex, int);
  const free = sockets - desiredR - desiredG - desiredB;
  const results = [];

  for (const recipe of RECIPES) {
    // Recipe colors must fit within desired colors
    if (recipe.red > desiredR || recipe.green > desiredG || recipe.blue > desiredB) continue;

    const unvorR = desiredR - recipe.red;
    const unvorG = desiredG - recipe.green;
    const unvorB = desiredB - recipe.blue;

    let chance = multinomialRecursive(colorChances, unvorR, unvorG, unvorB, free);

    if (recipe.isChromatic) {
      const collisionBonus = calcChromaticBonus(colorChances, desiredR, desiredG, desiredB, sockets);
      chance /= (1 - collisionBonus);
    }

    const avgAttempts = 1 / chance;
    const avgCost = recipe.cost * avgAttempts;
    const stdDev = Math.sqrt(Math.max(1 - chance, 0) / (chance * chance));

    results.push({
      description: recipe.description,
      avgCost: recipe.isDropRate ? '-' : floatToPrecision(avgCost, 1),
      chance: floatToPrecision(chance * 100, 5, false) + '%',
      avgAttempts: floatToPrecision(avgAttempts, 1),
      costPerTry: recipe.isDropRate ? '-' : String(recipe.cost),
      stdDev: floatToPrecision(stdDev, 2),
      rawAvgCost: recipe.isDropRate ? Infinity : avgCost,
    });
  }

  // Mark best (lowest avg cost, excluding drop rate)
  let bestIdx = -1;
  let bestCost = Infinity;
  results.forEach((r, i) => {
    if (r.rawAvgCost > 0 && r.rawAvgCost < bestCost) {
      bestCost = r.rawAvgCost;
      bestIdx = i;
    }
  });
  if (bestIdx >= 0) results[bestIdx].isBest = true;

  return results;
}
