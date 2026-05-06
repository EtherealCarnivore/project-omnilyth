---
title: Gwennen Gamble Regex Generator
status: candidate
demand: M
fit: H
build_cost: L
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://xanthics.github.io/poe_gen_gwennen/
    note: Original Gwennen regex generator — page now reads "This tool is no longer supported by xanthics. Click for veiset's replacement." Active deprecation, redirects to poe.re.
    fetched: 2026-05-06
  - url: https://poe.re/
    note: poe.re is now the primary regex hub players are pointed to for Gwennen + others. Page body content didn't render in fetch but search snippets confirm it covers "regex token resource."
    fetched: 2026-05-06
  - url: https://www.vhpg.com/gwennen/
    note: vhpg ships a "Gwennen Cheat Sheet Filter Paste" (manually maintained chunked regex), confirming demand for paste-ready strings.
    fetched: 2026-05-06
  - url: https://www.poewiki.net/wiki/Guide:Gwennen_gambling
    note: PoE Wiki guide framing — "one of the better strategies to target farm Unique items, especially extremely rare ones." Strategy with active player interest each league.
    fetched: 2026-05-06
  - url: https://maxroll.gg/poe/currency/expedition-farming-guide
    note: MaxRoll Expedition farming guide treats Gwennen-by-base-type as a core endgame currency strategy.
    fetched: 2026-05-06
related_registry: none (we have map-regex, item-regex, scarab-regex, gem-regex, vendor-leveling — but no expedition/gwennen)
related_competitor: poe.re (post-xanthics-handoff)
---

## Claim

Gwennen, the Expedition gambler, sells unique items based on visible base-type. Players generate a regex string that highlights only the bases they want (Headhunter, Mageblood, etc.) when they refresh her inventory. The dominant tool in this niche — `xanthics.github.io/poe_gen_gwennen` — is now deprecated and redirects to `poe.re`. Players still want this, the strategy is core to expedition currency farming, and Omnilyth already owns the regex-generator surface (we ship 5 of them) but not this one.

## Evidence

- xanthics tool page literal text (2026-05-06): "This tool is no longer supported by xanthics. Click here for veiset's replacement." A handoff is happening; Omnilyth could be a third destination.
- "Gwennen gambling is … one of the better strategies to target farm Unique items, especially those that are extremely rare" — PoE Wiki guide framing (2026-05-06).
- "You can use a regex code to search for certain bases so that they are highlighted as you refresh the inventory" — vhpg Gwennen page (2026-05-06).
- "Resources like vhpg.com and xanthics.github.io/poe_gen_gwennen provide regex generators" — Google search snippet citing multiple regex generators specifically for Gwennen.
- The existing tool surface for Gwennen consolidated to `poe.re` and `vhpg.com`. Two destinations is not market saturation; players will use whichever is fastest and cleanest.

## Competitor coverage

- **poe.re** — current dominant Gwennen regex hub (post-xanthics handoff). Hosts multiple regex categories, not Gwennen-only. UX is utilitarian.
- **vhpg.com/gwennen** — manually maintained paste-ready string per league; static, not generated from user input.
- **awakened-poe-trade / overlays** — don't ship a Gwennen-specific generator.
- **Craft of Exile** — out of scope for them (gambling, not crafting math).

The competitive moat is shallow — this is a regex generator over a base-type list and a price feed, not a deep math tool.

## Why this might matter for Omnilyth

We already own the regex-tool surface in the eyes of the player: map-regex, item-regex, scarab-regex, gem-regex, vendor-leveling. Adding Gwennen extends that brand into the expedition farming strategy without inventing a new lane. It's a textbook ≤3-decision tool: pick league, check unique bases you want, copy the 250-char-capped output. Build cost is **L** — base-type list is static, the price layer can reuse our existing `usePrices` hook to surface "highlight all bases worth ≥ X chaos" defaults.

**Smallest version that proves it**: list of all unique-eligible bases × current league prices, multi-select, output regex (with the 250-char split logic our scarab-regex already implements). No simulator, no EV math, no inventory parsing.

**Risk**: lower demand ceiling than league-mechanic tools — Gwennen is one of many farming strategies, not "the" league focus. But the carrying cost is also lower: this tool ages well across leagues.

**Adjacent extensions** (do NOT scope into v1): Heist contract regex (highlight high-value contracts on the gambling vendor), Beast regex (live high-value beast highlighting against poe.ninja), Expedition logbook reroll regex.
