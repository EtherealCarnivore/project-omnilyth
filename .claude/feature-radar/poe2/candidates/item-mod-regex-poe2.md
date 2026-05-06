---
title: Item Mod Regex (PoE 2)
status: speculative-pre-announcement
demand: H
fit: H
build_cost: L
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://poe2db.tw/us/Modifiers
    note: Canonical PoE 2 mod database (HTML-only, no API). Direct fork target for the data layer.
    fetched: 2026-05-06
  - url: https://maxroll.gg/poe2/tools
    note: Maxroll PoE 2 tools hub does not currently ship a mod regex generator.
    fetched: 2026-05-06
  - url: https://poe.re/
    note: Primary PoE 1 regex hub; covers Gwennen, scarab, etc. No public PoE 2 surface yet.
    fetched: 2026-05-06
related_registry: item-regex (PoE 1 sibling tool — fork target)
related_competitor: none (no interactive PoE 2 mod regex generator found in 2026-05-06 sweep)
---

## Claim

Every PoE 1 player who installs PoE 2 looks for an item mod regex generator within their first week and finds nothing. The PoE 1-side tool family — `poe.re`, `xanthics`, Omnilyth's own `item-regex` — has no PoE 2 equivalent in the community tool landscape today. The mechanic transfers cleanly: PoE 2 stash search supports text matching (verify regex specifically), the mod pool is well-documented at `poe2db.tw/us/Modifiers`, and the algorithm Omnilyth already runs for PoE 1 (filter mod text fragments → join with alternation → split at 250-char boundaries) is data-agnostic. **The fork is the data file, not the calculator.**

## Evidence

- `poe2db.tw/us/Modifiers` exposes the full PoE 2 mod pool, scrapable. (2026-05-06)
- Maxroll PoE 2's tools hub at `maxroll.gg/poe2/tools` does not list a mod regex generator. (2026-05-06)
- Awakened-PoE-Trade and Exiled-Exchange-2 (the PoE 2 trade overlay fork) provide *price check* but not *stash filter regex generation*. (2026-05-06)
- Omnilyth ships `item-regex` for PoE 1 today. The user inventory naturally extends here — Omnilyth becomes the place players know to look for "regex for X."

## Competitor coverage

- **Static lists**: `poe2db.tw` exposes the data but no UI for building a stash filter regex.
- **Trade overlays**: `awakened-poe-trade`, `Exiled-Exchange-2` — neither generates regex; they do live trade checks against full mod text.
- **Build planners**: PoB-PoE2, Maxroll PoE2Planner — out of scope for them.
- **Crafting**: Craft of Exile (PoE 2 mode) covers crafting probability but not stash search regex.

The competitive moat is shallow — a regex generator over a data table, not a deep math tool. Omnilyth's existing PoE 1 implementation (`src/calculators/itemRegex.js` + the 250-char split logic from `src/calculators/scarabRegex.js`) is the canonical pattern.

## Why this might matter for Omnilyth

This is the **easiest valuable fork** in the entire PoE 2 plan. The build cost is genuinely low: data-curator scrapes poe2db.tw → `src/data/poe2/itemMods.js`; the existing `itemRegex.js` algorithm runs against the new data with zero code-side changes (modulo a `gameAware` parameter). The UI lives at `/poe2/crafting/item-regex` (or wherever the architect chooses) and reuses every component from the PoE 1 sibling.

**Smallest version that proves it:** scrape the top-tier mod families from poe2db.tw, ship a calculator that takes user-selected mod fragments and outputs the 250-char regex (multi-pattern split when needed). No simulator, no EV math, just the regex.

**Risk:** verify PoE 2's stash search supports regex like PoE 1's, with the same 250-char limit. If GGG silently changed those specifics for PoE 2, the tool's output format may need adjustment. **Action:** check via `poe-wiki-oracle` or via in-game testing before Phase 3 day 1 (May 29).

**Adjacent extensions** (do NOT scope into v1): Waystone Mod Regex (separate candidate), PoE 2 vendor regex (if PoE 2 has a vendor system worth filtering).
