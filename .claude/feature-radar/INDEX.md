# Feature Radar — Project Omnilyth

The outside-in feature backlog, owned by the `feature-explorer` agent.

Every entry below is a candidate idea sourced from the community (Reddit, ninja, GGG forums, Twitch) or from competitor tool inventories (awakened-poe-trade, exilence-next, MaxRoll, PoEDB, etc.). Every entry is backed by evidence — a URL and a fetch date.

The radar is **append-only**. Killed ideas move to `rejected/`. Shipped ideas move to `shipped/`. Active candidates live in `candidates/`. Competitor-coverage gaps where Omnilyth has a weaker version live in `delta/`. Raw harvest output from each sweep lives in `runs/`.

---

## How to read this file

- Entries are sorted by `Demand × Fit` desc.
- Each line is `Demand <H/M/L>, Fit <H/M/L>, Build <H/M/L> — title — one-line hook`.
- Click through to the candidate file for full evidence + competitor coverage + Omnilyth-fit reasoning.

---

## Active candidates

Sorted by `Demand × Fit` desc.

- [Mirage Wish Picker (current league decision aid)](candidates/leveling-mirage-wish-picker.md) — Demand H, Fit H, Build M — 60 wishes, 3-pick mechanic, no interactive picker exists today; pure Omnilyth-shaped tool with peak demand for the current league.
- [Gwennen Gamble Regex Generator](candidates/leveling-gwennen-gamble-regex.md) — Demand M, Fit H, Build L — xanthics' tool deprecated 2026-05-06 and redirected to poe.re; Omnilyth already owns the regex-tool surface (5 generators) and adding this is a clean extension.
- [Betrayal Syndicate Board Planner / Cheat Sheet](candidates/atlas-betrayal-syndicate-board.md) — Demand H, Fit M, Build M — evergreen mechanic, 6+ static cheat sheets exist, no stateful board planner; sub-feature 2 (state machine) is novel calculator territory.

---

## Delta — competitor has it, we have a weaker / partial version

*(empty — maiden sweep surfaced 3 deltas in `runs/2026-05-06-maiden-broad.md` decisions log but the agent was interrupted before writing the individual delta files. Re-run the sweep to capture them as proper delta entries.)*

```
- [Title](delta/file.md) — Demand H, Fit H, Build L — what competitor X ships that we don't
```

---

## Shipped

*(empty — release-manager moves entries here when the feature lands in production)*

---

## Rejected

*(empty — entries land here when the user explicitly says "no")*

Each rejected entry retains the original evidence + a `rejection_note` explaining the decision. The radar is a memory; deleted ideas come back as "we should build X" six months later.

---

## Sweep history

- [`runs/2026-05-06-maiden-broad.md`](runs/2026-05-06-maiden-broad.md) — Maiden broad sweep. Tier 1 + Tier 2. Reddit blocked (snippet-only). Identified 7 candidates + 3 deltas; **interrupted** after 3 candidate files were written. Remaining 4 candidates (Heist Blueprint EV, Currency Exchange helper, Build-aware Map Mod Danger Highlighter, Pinnacle Boss fragment planner) and 3 deltas are documented in the run log decisions section and ready to be re-flushed on next sweep.

---

## How to add an entry (when running a sweep)

1. Drop a new file into `candidates/` (or `delta/`) with the frontmatter shape from `feature-explorer.md`.
2. Add a one-liner above in this INDEX, sorted by `Demand × Fit`.
3. If the entry is a duplicate of an existing one, **bump the existing entry instead** — add a new evidence line, update `last_signal`, recompute `Demand`. Don't double-list.
4. If the sweep produced raw harvest worth keeping, save it to `runs/YYYY-MM-DD-<scope>.md` for future audit.

---

## Source watchlist

The full standing watchlist lives in `.claude/agents/feature-explorer.md`. Brief recap:

- **Tier 1** — r/pathofexile, r/PathOfExileBuilds, GGG forums, Path of Building changelog.
- **Tier 2** — awakened-poe-trade, exilence-next, MaxRoll, PoE Vault, PoEDB, poe.trade family, poe.ninja's tool surface.
- **Tier 3** — Twitch / YouTube tool sightings, GitHub trending PoE repos.

---

**Last updated:** 2026-05-06 — maiden broad sweep landed 3 candidates (Mirage Wish Picker, Gwennen Regex, Betrayal Board); interrupted before writing the remaining 4 candidates + 3 deltas (see `runs/2026-05-06-maiden-broad.md` for the decisions log).
