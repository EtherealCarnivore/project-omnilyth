# Feature Radar — Project Omnilyth (PoE 2)

The outside-in feature backlog for **Path of Exile 2**, owned by the `feature-explorer` agent.

This is the PoE 2 sibling of `.claude/feature-radar/INDEX.md` (which now scopes to PoE 1). The two radars stay separate: PoE 2 demand signals, PoE 2 competitor coverage, PoE 2 candidates.

The radar is **append-only**. Killed ideas → `rejected/`. Shipped → `shipped/`. Active → `candidates/`. Competitor-gaps → `delta/`. Per-sweep raw harvest → `runs/`.

---

## Active candidates

Sorted by `Demand × Fit` desc.

- [Item Mod Regex (PoE 2)](candidates/item-mod-regex-poe2.md) — Demand H, Fit H, Build L — every PoE 1 player coming to PoE 2 looks for this and finds nothing; cleanest fork of an existing Omnilyth tool.
- [Atlas Tree Planner (PoE 2)](candidates/atlas-tree-planner-poe2.md) — Demand H (post-0.5), Fit H, Build M-H — atlas tree expanding from ~8 to 40+ nodes in 0.5; first time it's worth planning.
- [Waystone Mod Regex (PoE 2)](candidates/waystone-mod-regex-poe2.md) — Demand M-H, Fit H, Build L — PoE 2's equivalent of Map Mod Regex; mod pool different and changing in 0.5.
- [Leveling Playbook (PoE 2)](candidates/leveling-playbook-poe2.md) — Demand M, Fit H, Build M — PoE 2 has 6 acts; static guides exist but no interactive playbook.
- [Currency Divergence Tracker (PoE 2)](candidates/currency-divergence-tracker-poe2.md) — Demand M, Fit M, Build M — week-over-week divergence detection; works for both games.

---

## Delta — competitor has it, we have a weaker / partial version

*(empty for PoE 2 — Omnilyth has zero PoE 2 surface today, so every comparison is "we don't have it" rather than "we have a worse version")*

---

## Shipped

*(empty — release-manager moves entries here when the feature lands)*

---

## Rejected

*(empty)*

Each rejected entry retains the original evidence + a `rejection_note` explaining the decision.

---

## Sweep history

*(empty — `runs/YYYY-MM-DD-<scope>.md` files land per sweep)*

---

## Status conventions for PoE 2

PoE 2 candidates use an extended status enum to track patch-relevance:

- `speculative-pre-announcement` — written before May 7 0.5 announcement; demand inferred from competitor gaps and PoE 1-side player behavior.
- `confirmed-by-announcement` — demand or mechanic confirmed by the May 7 announcement.
- `rejected-by-announcement` — mechanic doesn't exist in 0.5, so the tool isn't relevant.
- `speculative-still` — announcement didn't move the needle; awaits more data (community signal, post-launch state).
- `candidate` — generic active status (when patch-relevance is settled).

---

## Source watchlist (PoE 2-specific)

- **Tier 1** — `r/PathOfExile2`, `r/pathofexile2builds`, GGG forum PoE 2 sections, official PoE 2 patch announcements.
- **Tier 2** — `poe2db.tw`, `poe.ninja/poe2`, `maxroll.gg/poe2`, `poe2.dev`, `Exiled-Exchange-2` GitHub, PoB-PoE2 fork.
- **Tier 3** — Twitch / YouTube PoE 2 creator tool sightings, GitHub `topic:poe2` trending.
- **Cross-reference** — sister PoE 1 radar at `.claude/feature-radar/INDEX.md` for ideas that span both games.

---

**Last updated:** 2026-05-06 — initial seed; 5 speculative-pre-announcement candidates from research. Re-run after 2026-05-07 announcement to re-tag against confirmed mechanics.
