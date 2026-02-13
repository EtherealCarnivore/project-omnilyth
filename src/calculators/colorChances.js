/**
 * Compute per-socket color probabilities from item stat requirements.
 * Returns { r, g, b } where r + g + b ≈ 1.
 */
export function getColorChances(str, dex, int) {
  const X = 5;
  const C = 5;
  const maxOnColorChance = 0.9;
  const reqs = [str, dex, int];
  const totalReqs = str + dex + int;
  const numReqs = reqs.filter(r => r > 0).length;

  if (numReqs === 0) {
    return { r: 1 / 3, g: 1 / 3, b: 1 / 3 };
  }

  let chances;
  if (numReqs === 1) {
    chances = reqs.map(req => {
      if (req > 0) {
        return maxOnColorChance * (X + C + req) / (totalReqs + 3 * X + C);
      }
      return (1 - maxOnColorChance) / 2 + maxOnColorChance * (X / (totalReqs + 3 * X + C));
    });
  } else if (numReqs === 2) {
    chances = reqs.map(req => {
      if (req > 0) {
        return maxOnColorChance * req / totalReqs;
      }
      return 1 - maxOnColorChance;
    });
  } else {
    chances = reqs.map(req => req / totalReqs);
  }

  return { r: chances[0], g: chances[1], b: chances[2] };
}
