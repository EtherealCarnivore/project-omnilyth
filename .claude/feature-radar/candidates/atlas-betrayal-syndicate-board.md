---
title: Betrayal Syndicate Board Planner / Cheat Sheet
status: candidate
demand: H
fit: M
build_cost: M
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://poetools.github.io/BetrayalCheatSheet/
    note: Existing community syndicate cheat sheet tool — page reached, content blocked from fetch but search snippets describe "interactive Syndicate Cheat Sheet tool that lets you highlight Betrayal/Syndicate rewards for easy reference."
    fetched: 2026-05-06
  - url: https://www.poelab.com/syndicate-cheatsheet/
    note: PoELab also hosts a syndicate cheatsheet. Confirms multi-source community demand.
    fetched: 2026-05-06
  - url: https://www.ssegold.com/poe-3-27-betrayal-cheat-sheet-guide
    note: Content republisher — "PoE Betrayal Cheat Sheet 3.28 – Full Syndicate & Reward Guide", patch-by-patch maintained, indicating evergreen demand each league.
    fetched: 2026-05-06
  - url: https://www.aoeah.com/news/4442--poe-328-betrayal-cheat-sheet-rewards--farming-strategy
    note: 3.28-current cheat sheet republisher. Confirms Betrayal is still relevant in current league.
    fetched: 2026-05-06
  - url: https://www.pathofexile.com/forum/view-thread/2451569
    note: Long-running GGG forum thread "PoE 3.28 Cheat Sheets (QOL Info)" — community-curated reference list players still link.
    fetched: 2026-05-06
  - url: https://www.sportskeeda.com/mmo/path-exile-betrayal-cheat-sheet-3-28
    note: Mainstream gaming site coverage — not just niche, even general gaming media is republishing the Betrayal board strategy.
    fetched: 2026-05-06
related_registry: none
related_competitor: poetools.github.io/BetrayalCheatSheet, PoELab
---

## Claim

Betrayal is a core endgame mechanic with 16 Syndicate members across 4 divisions, where the player **manipulates positions, ranks, and relationships** to unlock targeted safehouse rewards. The community has settled on a "5522 board setup" (Fortification + Research = 5 members each, Intervention + Transportation = 2 each), but executing it requires constant per-encounter decisions: who to interrogate, who to bargain, who to execute. Multiple cheat-sheet tools exist, all are reference-only — pick a member, see their best division and rewards. None are stateful (track current board between encounters and recommend the next move).

## Evidence

- "Betrayal is a core endgame and mapping mechanic tied to Jun, the Betrayal Master, and the Immortal Syndicate—a criminal network of 16 unique NPC members, with 14 active in your syndicate board at any time" — search snippet (2026-05-06).
- "5522 setup, where fortification and research each have five members, and intervention and transportation each have two" — community-canonical strategy, repeated across all cheat-sheet sites.
- Multiple competing cheat sheets: poetools, PoELab, ssegold, aoeah, sportskeeda, mmoexp, u4gm, pvpbank — wide demand surface, fragmented supply.
- GGG forum thread `view-thread/2451569` is titled "PoE 3.28 Cheat Sheets (QOL Info)" — community recognizes "cheat sheets" as a tool category and curates a list.
- All cheat sheets I found are read-only reward lookups. None track board state across encounters or recommend "kill the leader of Catarina's left flank to refill X with Y."

## Competitor coverage

- **poetools.github.io/BetrayalCheatSheet** — interactive in the sense that you can highlight rewards. Not stateful across encounters.
- **PoELab syndicate cheatsheet** — static reference grid (member × division × reward).
- **vhpg / ssegold / aoeah** — static guides republished each league.
- **awakened-poe-trade** — none.
- **Craft of Exile** — none (Aisling-specific scenarios only, in crafting context).

**Gap**: no tool models board state between encounters and recommends moves. That's calculator-shaped — a state machine over the syndicate board.

## Why this might matter for Omnilyth

Two distinct sub-features here, with different scope:

1. **Reference cheat sheet (low cost)** — member × division × reward grid, sortable, with 5522-setup view. Effectively the same shape as the existing syndicate cheat sheets but inside our design system. Build cost ≈ data-curator effort. Fit: M (we don't have a "reference table" surface today — closest analog is `gem-lookup`).

2. **Stateful board planner (medium cost)** — model the 16 members, current ranks, current positions, and recommend per-encounter actions. This is novel. Build cost is higher because the logic is non-trivial (interrogate/bargain/execute affect both target and adjacent members). Fit: H — this is calculator/state-machine shaped, exactly Omnilyth's identity.

**Smallest version that proves it**: ship (1) first. If players engage with the cheat sheet, (2) becomes the natural follow-on; if they don't, we've spent a small data-curation week and learned something.

**Risk of duplication**: high for (1) — community already has 6+ cheat sheets. Differentiator must be the design-system polish (alt-tab-friendly, 10-second scan) and tighter integration with our atlas-tree planner (which atlas passives buff Betrayal). Without that integration angle, (1) alone is undifferentiated.
