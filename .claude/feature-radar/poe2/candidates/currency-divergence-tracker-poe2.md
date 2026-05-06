---
title: Currency Divergence Tracker (PoE 2; cross-game potential)
status: speculative-pre-announcement
demand: M
fit: M
build_cost: M
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://poe.ninja/poe2/economy
    note: poe.ninja exposes PoE 2 currency overview but only point-in-time, not week-over-week divergence visualization.
    fetched: 2026-05-06
  - url: https://lootcalc.com/games/poe/currency-profit-calculator
    note: PoE 1-side currency profit calculator; closest analog. No PoE 2 version yet.
    fetched: 2026-05-06
  - url: https://poe2scout.com/
    note: PoE 2 economy site exists; surface limited to currency exchange data; no divergence tracker.
    fetched: 2026-05-06
related_registry: none (no PoE 1 economy tool currently in registry; would set precedent)
related_competitor: lootcalc.com (PoE 1 only); poe2scout.com (limited)
---

## Claim

Both PoE 1 and PoE 2 leagues exhibit predictable currency divergence patterns: an item or currency trades at X% above its 7-day median, indicating either a demand spike (new meta build) or a supply choke (drop rate change). poe.ninja exposes the raw data but only as point-in-time tables — players need to mentally diff "what was this last week vs this week." A divergence tracker that auto-flags week-over-week ratio shifts would be a small, targeted analytics tool. PoE 2 is the natural launch surface (the economy is younger, the data is cleaner, and 0.5's reset gives a clean baseline) but the tool extends to PoE 1 cleanly.

## Evidence

- `poe.ninja/poe2/economy` shows current prices but no divergence indicator.
- `lootcalc.com` ships a currency profit calculator for PoE 1 — confirms there's a market for economy-flavored tools, just no PoE 2 equivalent.
- `poe2scout.com` surfaces some economy data but focused on exchange rates, not divergence.
- The Omnilyth `economy-analyst` agent (added in Phase 2 of the agent expansion) embodies this analytical lens; this tool would be its UI.
- Multiple PoE 2 community articles emphasize "Currency Matters More Than Ever" for league launches — soft signal.

## Competitor coverage

- **poe.ninja** — has the data, no divergence UI.
- **poe2scout.com** — limited surface, no divergence.
- **lootcalc.com** — PoE 1 only.
- **awakened-poe-trade / Exiled Exchange 2** — point-in-time price check, not historical analysis.
- **Maxroll** — guides, not tools.

The lane is open in both PoE 1 and PoE 2.

## Why this might matter for Omnilyth

This is the **cross-game candidate** — designed once, runs for both PoE 1 and PoE 2. The data shape is identical; the URL prefix differs. Build cost is medium: poe.ninja history pull, week-over-week diff, threshold-based alerts ("X% above 7-day median = highlight"), simple line-chart visualization (need to choose a chart approach without adding a charting library; Tailwind + SVG handcrafted is feasible for a single-purpose use).

**Smallest version that proves it:**
1. Pull current league's top-50 currency items from poe.ninja.
2. Compute 7-day moving average (poe.ninja exposes historical points).
3. Highlight items >20% above or below their median, with a one-line "likely cause" hint.
4. No alerts, no charts, just a sortable table.

This is the smallest end-to-end answer to "what's diverging this week?" Players can subscribe to higher-fidelity later.

**Risk:**
- Crosses the line from "calculator" to "analytics tool" — different mental model. Could feel un-Omnilyth.
- Data freshness: poe.ninja crawl cadence determines our latency. Day-1 league data is noisy.
- Cross-game scope inflates the design surface (game-aware everywhere).

**Phase positioning:** Phase 4 candidate, not Phase 3. The simpler tools (Item Mod Regex, Gem Browser) prove the dual-game architecture first.

**Adjacent extensions:** Omenpath / scarab / waystone-specific divergence views; player profit-per-hour estimator pegged to current rates; cross-league "compare current to last X league at the same day count" view.
