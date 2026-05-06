---
topic: Chromatic recipes and Vorici bench costs (PoE 1)
sources:
  - https://www.poewiki.net/wiki/Chromatic_Orb
  - https://www.poewiki.net/wiki/Vorici
  - https://www.poewiki.net/wiki/Tainted_Chromatic_Orb
  - https://www.poewiki.net/wiki/Omen_of_Blanching
fetched: 2026-05-06
local_data_refs:
  - src/calculators/chromaticCalc.js
  - src/calculators/voriciCalc.js
  - src/calculators/taintedCalc.js
  - src/calculators/blanchingCalc.js
  - src/calculators/colorChances.js
patch: 3.27 / Mirage
---

# Chromatic recipes and bench costs — PoE 1

The deterministic costs of color-rolling sockets through Vorici / bench, plus the probabilistic raw-chromatic and Tainted alternatives. This is the table the Omnilyth chromatic family of calculators consumes.

## Answer

### Vorici Crafting Bench — deterministic chromatic recipes

**Single color, fixed count:**

| Recipe | Cost | Notes |
|---|---|---|
| 1R | 4 chromatics | guaranteed at least 1 red |
| 1G | 4 chromatics | guaranteed at least 1 green |
| 1B | 4 chromatics | guaranteed at least 1 blue |
| 2R | 25 chromatics | |
| 2G | 25 chromatics | |
| 2B | 25 chromatics | |
| 3R | 120 chromatics | |
| 3G | 120 chromatics | |
| 3B | 120 chromatics | |

**Two-color combinations:**

| Recipe | Cost | Notes |
|---|---|---|
| 1R 1G | 25 chromatics | |
| 1G 1B | 25 chromatics | |
| 1R 1B | 25 chromatics | |
| 2R 1G | 100 chromatics | |
| 2R 1B | 100 chromatics | |
| 2G 1R | 100 chromatics | |
| 2G 1B | 100 chromatics | |
| 2B 1R | 100 chromatics | |
| 2B 1G | 100 chromatics | |

> Costs above reflect the standard PoE 1 crafting bench. Verify against `src/calculators/voriciCalc.js` — it carries the canonical numeric values consumed by the Vorici Calculator.

### Raw chromatic odds — biased by base attribute

When you spam raw Chromatic Orbs (no bench), each socket independently rolls per-attribute weighting determined by the base's primary requirements:

| Base type | Red weight | Green weight | Blue weight | White weight |
|---|---|---|---|---|
| **Pure STR** (body armor, helm, gloves, boots) | ~83% | ~9% | ~9% | 0% |
| **Pure DEX** | ~9% | ~83% | ~9% | 0% |
| **Pure INT** | ~9% | ~9% | ~83% | 0% |
| **STR/DEX hybrid** | ~46% | ~46% | ~9% | 0% |
| **STR/INT hybrid** | ~46% | ~9% | ~46% | 0% |
| **DEX/INT hybrid** | ~9% | ~46% | ~46% | 0% |
| **No-stat** (jewels, etc.) | ~33% | ~33% | ~33% | 0% |

> Approximations from community studies. Exact probabilities are encoded in the chromatic odds table consumed by `src/calculators/chromaticCalc.js` and the Color Chances calculator (`src/calculators/colorChances.js`).

**Off-color cost grows ~cubically:**

| Off-color count | Approx EV (chromatics) on a STR base |
|---|---|
| 1 off-color socket | ~10 |
| 2 off-color sockets | ~50 |
| 3 off-color sockets | ~250 |
| 4 off-color sockets | ~1200 |
| 5 off-color sockets | ~6000 (Vorici always cheaper here) |

The break-even between raw chromatic and Vorici bench depends on:

1. The base's attribute bias (pure-STR helmet biases against blue heavily).
2. The off-color count (Vorici wins faster with more off-colors).
3. The chromatic price relative to bench-recipe costs.

The Omnilyth Chromatic Calculator (`src/calculators/chromaticCalc.js`) computes both and recommends the cheaper path.

### Tainted Chromatic Orb — corrupted only, untargeted

**Mechanic:** 100% chance to re-roll all sockets on a corrupted item. The new colors honor the base's attribute bias. The advantage over raw chromatic on uncorrupted items: there is no off-color penalty curve, just one re-roll per orb.

| Item state | Tainted Chromatic effect |
|---|---|
| Corrupted | Re-rolls all sockets, biased by base attribute. Each application is independent. |
| Uncorrupted | **Cannot use.** Tainted currency is corrupted-only. |

**No targeting.** You can't ask for "1G 2B" with Tainted Chromatic. It's brute-force re-rolls until the configuration you want appears. Use the Tainted Chromatic Calculator (`src/calculators/taintedCalc.js`) for EV.

**When Tainted Chromatic wins:**

- Corrupted 6L body armor where the recipe Vorici needs would cost more than ~50 Tainted (often the case for 5-off-color arrangements).
- Items with desirable corruption implicits (you can't uncorrupt to benchcraft).

### Omen of Blanching — turn one socket white per use

**Mechanic:** consumes one Omen of Blanching to turn a single socket on a normal/magic/rare/unique (uncorrupted) item white. White sockets accept any color gem.

| Use case | Omen behavior |
|---|---|
| Uncorrupted item, rare quality | Turns one socket white. Stack multiple Omens for multi-white. |
| Corrupted item | Cannot apply (Omens fail on corrupted items). |
| Item with all white sockets already | No-op. |

**Cost intuition:** Omens of Blanching are sold by other players; the price floats between ~5–20 chaos depending on league phase. The Blanching Calculator (`src/calculators/blanchingCalc.js`) computes the comparative cost vs. accepting off-color penalties.

## Details

### Order of operations: chromatic → fusing → jeweller is wrong

The correct sequence for socketing a fresh body armor:

1. **Jeweller's** to set socket count (target 6S).
2. **Fusing** to set link count (target 6L).
3. **Chromatic / Vorici / Omen** to set socket colors.

Coloring before the socket count is fixed wastes orbs — re-rolling sockets via jeweller's resets colors.

### Tainted Fusing vs Tainted Chromatic — different mechanics

These look like a pair but compose differently:

- **Tainted Fusing**: 100% re-rolls the **link configuration** of a corrupted item.
- **Tainted Chromatic**: 100% re-rolls the **socket colors** of a corrupted item.

Tainted Jeweller's exists too — re-rolls socket count.

### Common bugs in chromatic calculators

1. **Treating all bases as STR-default.** Pure DEX and pure INT bases have wildly different color biases.
2. **Confusing socket count with link count.** Coloring 5 sockets is independent of whether they're 5L.
3. **Forgetting Omen of Blanching can stack.** Multiple Omens turn multiple sockets white.
4. **Forgetting Tainted is corrupted-only.** Recommending Tainted on an uncorrupted item is a UX bug.
5. **Computing "average EV" without variance.** A 50% chance of paying 10 chromatics + 50% chance of paying 1000 has the same EV as paying 505 every time, but the experience is wildly different.

## Source excerpts

> "Each socket has a chance to roll into a specific color, weighted by the item base's primary attributes. STR-based bases bias red, DEX-based bases bias green, INT-based bases bias blue."
> — [PoE Wiki — Chromatic Orb](https://www.poewiki.net/wiki/Chromatic_Orb), verified 2026-05-06

> "Tainted Chromatic Orbs cause all sockets on a corrupted item to be re-rolled. They cannot be used on uncorrupted items."
> — [PoE Wiki — Tainted Chromatic Orb](https://www.poewiki.net/wiki/Tainted_Chromatic_Orb), verified 2026-05-06

## Related Omnilyth files

- `src/calculators/chromaticCalc.js` — raw-chromatic EV and recommendation logic.
- `src/calculators/voriciCalc.js` — bench recipe lookup.
- `src/calculators/taintedCalc.js` — Tainted Chromatic EV.
- `src/calculators/blanchingCalc.js` — Omen of Blanching cost comparison.
- `src/calculators/colorChances.js` — per-attribute weighted color odds (consumed by all of the above).
