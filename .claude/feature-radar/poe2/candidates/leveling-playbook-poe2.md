---
title: Leveling Playbook (PoE 2)
status: speculative-pre-announcement
demand: M
fit: H
build_cost: M
created: 2026-05-06
last_signal: 2026-05-06
sources:
  - url: https://maxroll.gg/poe2/build-guides
    note: Maxroll has long-form leveling guides per build but no per-act interactive playbook with checklists / decisions / power spikes.
    fetched: 2026-05-06
  - url: https://poe2db.tw/us/Quests
    note: Canonical PoE 2 quest list (HTML scrape; no API).
    fetched: 2026-05-06
  - url: https://www.poe-vault.com/
    note: PoE Vault has PoE 2 mechanic guides but minimal interactive content; static pages.
    fetched: 2026-05-06
related_registry: playbook (PoE 1 sibling — fork pattern target); leveling-mode (PoE 1 sibling)
related_competitor: maxroll.gg/poe2 (long-form text guides); no interactive equivalent
---

## Claim

PoE 2 has a 6-act campaign (vs PoE 1's 10). Players need an interactive per-act playbook — what gem to take from each quest reward, when to swap support gems, when to enter Trial of Sekhemas, where the boss spike is, what gear to vendor. PoE 1-side, Omnilyth ships `playbook` (speedrunner strategies with checklists) and `leveling-mode` (full guide with quest tracking). The PoE 2 fork has clear demand from the cohort coming over from PoE 1 and discovering nothing equivalent — competitors ship long-form text rather than interactive playbooks.

## Evidence

- Maxroll PoE 2 has build guides with leveling sections, but they're prose-shaped — not the interactive checklist Omnilyth's `playbook` ships.
- PoE 2 community articles ("Zero to Maps Before the Meta Settles" style) exist, all static text.
- Omnilyth's PoE 1 `playbook` is a high-engagement tool; the same audience cohort plays both games.
- The 6-act structure is stable across 0.4 / 0.5 launch (no act count change announced).
- `poe2db.tw/us/Quests` provides canonical quest data for the scrape.

## Competitor coverage

- **Maxroll PoE 2 build guides** — long-form text per build. Not interactive. Not check-as-you-go.
- **PoE Vault** — static guides for beginners. Not playbook-shaped.
- **Reddit / community guides** — scattered, ephemeral.
- **Omnilyth's `playbook`** — exists for PoE 1; pattern reusable.

The interactive-checklist niche is open in PoE 2.

## Why this might matter for Omnilyth

The PoE 1 `playbook` tool encodes hours of speedrun knowledge in a digestible per-act format. PoE 2's player base (especially returners from PoE 1) wants the same shape: "what do I do in act 2?" not "read this 4000-word guide." Build cost is **medium**: data is hand-curated (PoE 1 playbook took the user weeks of work; PoE 2 with 6 acts takes maybe 60% of that effort).

**Smallest version that proves it:** ship a single PoE 2 playbook (one canonical build — likely an Arcane Archer or Wildspeaker once 0.5 introduces them). Per-act zone list, gem rewards, boss notes, decision points. Mirror the existing `playbook` UX exactly. Don't try to ship multiple playbooks in v1.

**Risk:**
- Manual curation effort. The PoE 1 playbook was a labor of love. Solo dev bandwidth. **Mitigation:** scope to one build, ship lite version, expand later if engaged.
- 0.5 introduces new ascendancies (likely 2 new) and probably new gems. Pre-0.5 playbook content has to be re-validated post-launch.
- Community guides may become better than Omnilyth's offering and dominate the lane.

**Phase positioning:** Phase 3 maybe (May 29 launch); more likely Phase 4. Depends on bandwidth and whether players engage with the simpler PoE 2 tools (Item Mod Regex, Gem Browser) first.

**Adjacent extensions:** Leveling Mode PoE 2 (broader, less opinionated tracker); Trial of Sekhemas / Trial of Chaos planner (sub-tool inside playbook for the ascendancy unlock paths).
