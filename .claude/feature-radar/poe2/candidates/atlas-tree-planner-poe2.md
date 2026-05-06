---
title: Atlas Tree Planner (PoE 2)
status: speculative-pre-announcement
demand: H
fit: H
build_cost: M-H
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://www.mmopixel.com/news/new-endgame-in-poe-2-0-5-update
    note: Confirms atlas tree expansion in 0.5 ("8 → 40+ meaningful nodes"); GGG framing it as "second layer of build crafting."
    fetched: 2026-05-06
  - url: https://vocal.media/gamers/rsvsr-the-atlas-reborn-how-path-of-exile-2-is-fixing-its-endgame-problem-in-patch-0-5-0
    note: "The Atlas Reborn" — endgame-overhaul framing for 0.5; confirms atlas planning becomes meaningful.
    fetched: 2026-05-06
  - url: https://github.com/marcoaaguiar/poe2-tree
    note: Community-maintained PoE 2 tree data (513 commits, manual transcription); the only canonical PoE 2 tree JSON outside GGG client files.
    fetched: 2026-05-06
  - url: https://maxroll.gg/poe2
    note: Maxroll already ships an Atlas Tree planner for PoE 2 — the build-planner-with-tree niche is partly filled.
    fetched: 2026-05-06
related_registry: atlas-tree (PoE 1 sibling — fork pattern target)
related_competitor: maxroll.gg/poe2 (atlas tree); marcoaaguiar/poe2-tree (data only)
---

## Claim

PoE 2's atlas tree pre-0.5 has roughly 8 meaningful nodes — too small to bother planning. Patch 0.5 expands it to 40+ nodes; GGG explicitly frames it as "the second layer of build crafting." That's the threshold at which atlas planning becomes a real activity, mirroring PoE 1's atlas tree (which Omnilyth already ships a planner for at `/atlas/tree` + diff at `/atlas/diff`). The fork is non-trivial because the geometry, node taxonomy, and effect text differ — but the React component subsystem under `src/components/atlas/` is reusable as a rendering pattern, and the calculator (`src/calculators/atlasTree.js`) provides the pathing/diff math template.

## Evidence

- "Atlas tree expansion: ~8 → 40+ meaningful nodes" — multiple patch-news outlets (mmopixel, vocal, aoeah) covering 0.5 announcements (2026-05-06).
- GGG calls it "second layer of build crafting" — same language they used in PoE 1 to justify atlas tree planners as serious tools.
- The pre-0.5 PoE 2 atlas was widely panned in r/pathofexile2 (signal: indirect — couldn't WebFetch reddit but news outlets quote complaints).
- Maxroll has shipped a PoE 2 atlas tree planner already, indicating a competitor sees real demand.
- Path of Building PoE 2 fork does not have a dedicated atlas tree planner UI (build planner only).

## Competitor coverage

- **Maxroll PoE2 Atlas Tree** — `maxroll.gg/poe2` — likely the dominant tool; depth and UX TBD on pre-0.5 visit.
- **PoB-PoE2** — build planner only; no atlas tree planner UI.
- **`marcoaaguiar/poe2-tree`** — *data only*, no planner UI; useful as a data source for downstream tools (including Omnilyth).

The build planner + atlas tree combo is taken by Maxroll. **Omnilyth's differentiation lane** is the diff feature (`atlas-diff` for PoE 1) — comparing two atlas trees side by side. If Maxroll doesn't ship a diff for PoE 2, that's an entry point.

## Why this might matter for Omnilyth

Two sub-tools here, with different scope:

1. **Atlas Tree Planner PoE 2** — fork of `atlas-tree`. Build cost: medium-high. Core: rendering subsystem for the new tree geometry, importing from a community tree data source (poe2-tree repo), pathing math. UI work substantial but reusable from the PoE 1 atlas planner. Risk: external repo dependency for tree data.

2. **Atlas Tree Diff PoE 2** — fork of `atlas-diff`. Build cost: low if (1) ships first. Differentiator if Maxroll doesn't ship diff. Pure pattern reuse from PoE 1 implementation.

**Smallest version that proves it:** ship (1) first, with clear "data WIP" labels for any nodes that aren't in the community data source yet. Let players save and share atlas tree URLs (Omnilyth's existing pattern). (2) follows in a subsequent release.

**Risk profile:**
- External repo dependency: `marcoaaguiar/poe2-tree` could go unmaintained. **Mitigation:** when 0.5 launches, watch for an alternative canonical source (GGG might publish; PoB-PoE2 might extract from client files). Switch sources if the original maintainer drops.
- 0.5 atlas tree structure unknown until launch. **Mitigation:** Phase 4 (June 12+), not Phase 3 — wait for the data to stabilize 1-2 weeks post-launch.

**Adjacent extensions:** Atlas tree node search/filter ("which node grants ailment damage?"); Atlas tree node usage counter (poe.ninja-style "X% of builds take this node").
