---
title: Mirage Wish Picker (current league decision aid)
status: candidate
demand: H
fit: H
build_cost: M
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://www.u4n.com/news/list-of-poe-mirage-wishes-sigil-328.html
    note: Confirms 60 distinct Mirage wishes, 3 sigils (Ruzhan/Kelari/Navira), 3 djinn coin types (Power/Skill/Knowledge). Long-form list, not interactive.
    fetched: 2026-05-06
  - url: https://maxroll.gg/poe/leagues/mirage-guide
    note: MaxRoll Mirage guide ranks wishes narratively by farming goal (currency vs gear vs jewels). Read-only, no picker.
    fetched: 2026-05-06
  - url: https://games.gg/path-of-exile/guides/path-of-exile-mirage-league-wishes-juicing/
    note: Article-style "best wishes" rankings. Confirms decision pressure ("100% more Currency", "Wish for Uncertainty", "avoid Wish for Phantoms").
    fetched: 2026-05-06
  - url: https://www.poe-vault.com/guides/mirage-mechanic-guide
    note: PoE Vault confirms 3-of-N selection mechanic per Mirage entry; player must pick before entering.
    fetched: 2026-05-06
  - url: https://poe.ninja/poe1/economy/mirage/omens
    note: poe.ninja tracks Omen + Djinn Coin prices in Mirage. Live data exists for an EV layer if desired.
    fetched: 2026-05-06
  - url: https://www.craftofexile.com/?ct=calculator
    note: Craft of Exile flags "Path of Exile 1: Mirage League" but only as scope label for crafting math; no Wish picker.
    fetched: 2026-05-06
related_registry: none
related_competitor: none (no interactive Wish picker found)
---

## Claim

Mirage league (PoE 3.28, currently active) presents the player with **3 random Wishes drawn from a pool of ~60** before each Mirage encounter, and the choice is non-trivial — wishes range from "100% more Currency" to "12 additional monster packs" to "claim a Fishing Rod." Players are currently making this decision either by memorizing the long-form MaxRoll/u4n/sportskeeda wish lists or by gut feel mid-map. Multiple guides explicitly recommend wishes by farming goal (currency, gear, jewels), but no tool lets a player paste in their goal + their build's pack-clear capacity and get a ranked recommendation back. This is a maiden league mechanic with active player attention right now.

## Evidence

- "Before entering a Mirage, you get to choose from three random Wishes from over 60 options" — PoE Vault Mirage Mechanic Guide.
- "Wish for Wealth: 100% more Currency found in the Mirage Area" — u4n list (2026-05-06).
- "For currency farming, strong picks include Wish for Wealth or Wish for Glyphs … For endgame gear, Wish for Ancient Armaments or Wish for Ancient Protection guarantee Unique drops on chain-break" — search snippet citing MaxRoll/GAMES.GG ranking, demonstrating that goal-based ranking is the natural shape.
- "Avoid Wish for Phantoms unless you specifically want a cleaner run, as those packs cannot drop Equipment at all" — anti-pick guidance, classic decision-aid territory.
- Craft of Exile already labels the league but doesn't ship a Wish tool — incumbent calculator site explicitly hasn't built this.
- Three Sigils → three Djinn coin types, each enchants gems by attribute (STR/DEX/INT). A second decision axis layered on top of the wish itself.

## Competitor coverage

- **Long-form guides**: MaxRoll, sportskeeda, GAMES.GG, u4n, mmopixel, vhpg — all read-only ranked lists.
- **Price browser**: poe.ninja tracks Omen + Djinn Coin prices in the Mirage league economy.
- **Crafting math**: Craft of Exile is updated for Mirage but the Wish system is not in scope for them.
- **Build planner**: PoB doesn't model Mirage juice.
- **Overlays**: awakened-poe-trade and Lailloken UI don't surface anything Mirage-specific.

**No interactive Wish picker found in this sweep.** Current state-of-the-art is "ctrl+F a 60-row blog post."

## Why this might matter for Omnilyth

This is the cleanest "tool/calculator companion site" shaped opportunity surfaced by the sweep — alt-tab-friendly, ≤10-second scan, ≤3 decisions to value (goal → build cap → see ranked wish triplet). Mirage is the current league, so demand is at peak for the next 2–3 months. The build cost is moderate: ~60 static wish records, a small ranking weight per goal axis (currency / gear / jewels / xp / pack density / boss), and optionally a poe.ninja-fed EV column for currency-flavored wishes. No backend, no auth.

**Smallest version that proves it**: 60 wishes seeded as JSON; player picks "what am I farming" (currency / gear / jewels / xp); player marks "can my build clear +12 packs" (yes/no); for any 3-wish input, we rank them and tell the player which to take. That's it. Layer EV from the existing prices hook later.

**Risk**: league-bound. When Mirage cycles out (3–4 months), this tool's demand drops to ~zero unless GGG re-enables Mirage as core. Score `Build:M` on those grounds — code is small but lifetime is short. Mitigant: data-curator can swap the wish corpus for the next league's mechanic if the picker scaffold is generic.
