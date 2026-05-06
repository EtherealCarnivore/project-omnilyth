/**
 * Compute per-socket color probabilities from item stat requirements.
 * Returns { r, g, b } where r + g + b ≈ 1.
 *
 * QUIRK: this is PoE's actual socket-coloring formula, derived from the C++
 * weights GGG ships in the client. The three constants below are part of the
 * weighting; they're not arbitrary tunables.
 *
 *   - X = 5: a "background" weight every color carries even with zero stat req
 *     (this is what stops a 1-stat item from being 100% one color).
 *   - C = 5: a "bonus" weight applied only to colors that match a non-zero req.
 *   - maxOnColorChance = 0.9: hard cap on the sum of on-color probability;
 *     the remaining 10% is split among off-colors. Without it the formula
 *     would converge to 1.0 on huge stat reqs and the player would never
 *     see off-colors at all (which empirically is wrong).
 *
 * EXTERNAL: cross-reference https://www.poewiki.net/wiki/Item_socket — the
 * "Socket coloring" section. If the wiki updates these constants, this file
 * must too; nothing else in the codebase parameterises them.
 */
export function getColorChances(str, dex, int) {
  const X = 5;
  const C = 5;
  const maxOnColorChance = 0.9;
  const reqs = [str, dex, int];
  const totalReqs = str + dex + int;
  const numReqs = reqs.filter(r => r > 0).length;

  if (numReqs === 0) {
    // No requirements (e.g. a Tabula): pure random, no weighting.
    return { r: 1 / 3, g: 1 / 3, b: 1 / 3 };
  }

  let chances;
  if (numReqs === 1) {
    // Single-stat item (e.g. Astral Plate, str-only). The on-color gets the
    // X + C + req numerator; off-colors get only the X background weight.
    // The off-color formula also adds a flat (1 - maxOnColorChance) / 2 floor
    // so the cap on on-color chance is enforced even at extreme req values.
    chances = reqs.map(req => {
      if (req > 0) {
        return maxOnColorChance * (X + C + req) / (totalReqs + 3 * X + C);
      }
      return (1 - maxOnColorChance) / 2 + maxOnColorChance * (X / (totalReqs + 3 * X + C));
    });
  } else if (numReqs === 2) {
    // Two-stat item (e.g. Vaal Regalia, str+int). Two on-colors share the
    // maxOnColorChance budget proportionally to their req values; the third
    // color takes a flat (1 - maxOnColorChance) regardless of stat values.
    chances = reqs.map(req => {
      if (req > 0) {
        return maxOnColorChance * req / totalReqs;
      }
      return 1 - maxOnColorChance;
    });
  } else {
    // Three-stat hybrid (rare — pure str/dex/int gear like a Hubris Circlet
    // typically has only one or two reqs). Pure proportional weighting; no
    // X/C correction because no off-color exists.
    chances = reqs.map(req => req / totalReqs);
  }

  return { r: chances[0], g: chances[1], b: chances[2] };
}
