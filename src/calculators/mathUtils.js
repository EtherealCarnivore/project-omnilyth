export function fact(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/**
 * Probability of getting at least (dr, dg, db) in N sockets
 * with per-socket color probabilities (pr, pg, pb).
 * Enumerates all ways to distribute free sockets among R, G, B.
 */
export function multinomialProb(N, dr, dg, db, pr, pg, pb) {
  const free = N - dr - dg - db;
  if (free < 0) return 0;

  let totalChance = 0;
  for (let fr = 0; fr <= free; fr++) {
    for (let fg = 0; fg <= free - fr; fg++) {
      const fb = free - fr - fg;
      const tr = dr + fr;
      const tg = dg + fg;
      const tb = db + fb;
      const coeff = fact(N) / (fact(tr) * fact(tg) * fact(tb));
      totalChance += coeff * Math.pow(pr, tr) * Math.pow(pg, tg) * Math.pow(pb, tb);
    }
  }
  return totalChance;
}

/**
 * Recursive multinomial used by the original Vorici calculator.
 * Uses `pos` parameter to avoid double-counting multisets of free sockets.
 *
 * QUIRK: `pos` is a "monotonic stage" counter (1 = R, 2 = G, 3 = B). The
 * recursion only descends into stages ≥ pos, so each unique multiset
 * {R,G,B} of free sockets is counted exactly once instead of `n!` times.
 * Mathematically equivalent to the iterative form in multinomialProb()
 * above, but expressed recursively to mirror the original Vorici source.
 * Don't "simplify" by removing pos — the result becomes wrong without it.
 *
 * LINK: src/calculators/voriciCalc.js — sole caller. If voriciCalc moves
 * to a non-recursive form, this can be deleted.
 */
export function multinomialRecursive(colorChances, desiredR, desiredG, desiredB, free, pos = 1) {
  if (free > 0) {
    return (
      (pos <= 1 ? multinomialRecursive(colorChances, desiredR + 1, desiredG, desiredB, free - 1, 1) : 0) +
      (pos <= 2 ? multinomialRecursive(colorChances, desiredR, desiredG + 1, desiredB, free - 1, 2) : 0) +
      multinomialRecursive(colorChances, desiredR, desiredG, desiredB + 1, free - 1, 3)
    );
  }
  const total = desiredR + desiredG + desiredB;
  return (
    (fact(total) / (fact(desiredR) * fact(desiredG) * fact(desiredB))) *
    Math.pow(colorChances.r, desiredR) *
    Math.pow(colorChances.g, desiredG) *
    Math.pow(colorChances.b, desiredB)
  );
}

/**
 * Chromatic collision bonus: probability that two independent chromatic rolls
 * produce the same NON-matching color permutation. The `pos` parameter prevents
 * double-counting multisets. Uses Math.pow(chance, count*2) because both rolls
 * must match.
 */
export function calcChromaticBonus(colorChances, desiredR, desiredG, desiredB, free, rolledR = 0, rolledG = 0, rolledB = 0, pos = 1) {
  // If the rolled combination already satisfies the desired colors, skip it
  // (it's a success, not a collision)
  if (rolledR >= desiredR && rolledG >= desiredG && rolledB >= desiredB) {
    return 0;
  }

  if (free > 0) {
    return (
      (pos <= 1 ? calcChromaticBonus(colorChances, desiredR, desiredG, desiredB, free - 1, rolledR + 1, rolledG, rolledB, 1) : 0) +
      (pos <= 2 ? calcChromaticBonus(colorChances, desiredR, desiredG, desiredB, free - 1, rolledR, rolledG + 1, rolledB, 2) : 0) +
      calcChromaticBonus(colorChances, desiredR, desiredG, desiredB, free - 1, rolledR, rolledG, rolledB + 1, 3)
    );
  }

  const total = rolledR + rolledG + rolledB;
  return (
    (fact(total) / (fact(rolledR) * fact(rolledG) * fact(rolledB))) *
    Math.pow(colorChances.r, rolledR * 2) *
    Math.pow(colorChances.g, rolledG * 2) *
    Math.pow(colorChances.b, rolledB * 2)
  );
}
