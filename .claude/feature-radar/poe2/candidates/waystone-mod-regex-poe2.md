---
title: Waystone Mod Regex (PoE 2)
status: speculative-pre-announcement
demand: M-H
fit: H
build_cost: L
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://poe2db.tw/us/Waystone
    note: Canonical PoE 2 waystone mod database. Direct fork target for the data layer.
    fetched: 2026-05-06
  - url: https://www.mmopixel.com/news/new-endgame-in-poe-2-0-5-update
    note: 0.5 announcement signals waystone overhaul; mod pool will change.
    fetched: 2026-05-06
related_registry: map-mods (PoE 1 sibling — fork pattern target)
related_competitor: none (no PoE 2 waystone regex tool found in 2026-05-06 sweep)
---

## Claim

PoE 2 uses **Waystones** instead of PoE 1's maps. The mod pool is different but the mechanic is conceptually identical: roll affixes, scan with regex to keep/reject. Omnilyth's PoE 1 `map-mods` calculator already implements the algorithm (filter mod fragments, generate 250-char-bounded regex, multi-pattern split when needed). The fork is the data file. Players who use `map-mods` for PoE 1 will look for a `waystone-mods` equivalent the moment they start mapping in PoE 2.

## Evidence

- `poe2db.tw/us/Waystone` exposes the waystone mod pool. (2026-05-06)
- 0.5 patch news mentions waystone overhaul as a major mechanic shift; mod pool in flux.
- No interactive waystone regex generator surfaced in the maiden PoE 2 sweep.
- The `map-mods` PoE 1 tool is one of Omnilyth's higher-traffic surfaces (player-curated regex strategies for "no reflect, no cannot leech, +X% pack size" filtering). Direct demand transfer.

## Competitor coverage

- **`poe2db.tw`** — exposes mod data but no regex UI.
- **`poe.re`** — PoE 1-side regex hub; no PoE 2 surface yet.
- **Maxroll PoE2** — does not ship a waystone regex generator.
- **Awakened-PoE-Trade / Exiled-Exchange-2** — out of scope (price check, not stash filter).

Clean white space.

## Why this might matter for Omnilyth

Same structural argument as Item Mod Regex PoE 2 — Omnilyth owns the regex-tool surface in players' minds, and adding waystones extends that brand into PoE 2's endgame mapping flow. Build cost is low: data scrape + reuse the existing `mapModRegex.js` algorithm with the new mod pool.

**Smallest version that proves it:** select-checkbox UI over a list of waystone mods, generates regex with `+`, `-`, `~` operators (matching the PoE 1 sibling's UX), 250-char split. No tier-range filter, no scarab-equivalent layer (PoE 2 may have something analogous; defer).

**Risk:** **0.5 waystone mod pool will change.** Don't ship the data scrape until 0.5 lands or you're shipping a tool that's wrong by week 1. **Phase 4 candidate**, not Phase 3.

**Verification needed:** does PoE 2 stash search support regex with the same 250-char limit? Same question as item mod regex — answer covers both tools at once. (See `.claude/feature-radar/poe2/candidates/item-mod-regex-poe2.md`.)

**Adjacent extensions:** atlas-tree-aware waystone filter ("show me waystone mods that synergize with my current atlas allocation"). Distant; not v1.
