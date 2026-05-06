---
topic: Current league snapshot (PoE 1)
sources:
  - https://www.pathofexile.com
  - https://poe.ninja
fetched: 2026-05-06
local_data_refs:
  - src/contexts/LeagueContext.jsx
  - src/data/leagues
patch: 3.27 / Mirage
---

# Current league — PoE 1

The active default league for Omnilyth and the patch context for all calculators. **This file should be re-run through `/league-refresh` whenever GGG launches a new league.**

## Answer

```
League name      : Mirage
Patch number     : 3.27 (approximate — verify against patch notes)
Status           : Active default
Default in app   : YES (set in src/contexts/LeagueContext.jsx; was previously
                   "Standard" fallback, removed in commit b260cfa)
Re-read by date  : Whenever GGG announces the next league launch
```

## Details

### Where the league name lives in the codebase

The default league is hard-set in `src/contexts/LeagueContext.jsx`. The user can override at runtime via the Topbar league selector, but the default is what loads cold.

To change the default:

1. Update the context default value.
2. Update `src/data/leagues` (or wherever the league enum lives — see registry/data layer).
3. Re-run `/league-refresh <new-league>` to refresh data and stage the changelog.

### League cycle cadence

PoE 1 leagues run roughly every 13–17 weeks. The cycle:

```
Week  0     : League launch
Week  0–2   : "Week 1" — high traffic, prices volatile, ladder forms
Week  2–6   : Mid-league — economy stabilizes, meta solidifies
Week  6–13+ : Late league — prices flatten, niche strategies dominate
Week  13–17 : League ends, gear/stash migrates to Standard, next league announced ~1–2 weeks before launch
```

Omnilyth tools assume the **active league** for prices and the **current patch** for mechanics. When GGG announces a new league:

1. Run `/league-refresh <new-league>`.
2. The Oracle caches the patch notes summary.
3. The data-curator refreshes affected `src/data/` files.
4. The build-strategist gives a meta read.
5. The economy-analyst gives a Week-1 baseline.
6. The release-manager drafts the player-facing announcement.

### What a new league usually breaks

The categories of breakage that need attention every league:

| Breakage | Likely fix path |
|---|---|
| Item mods changed (added / removed / re-tiered) | `data-curator` refreshes `src/data/itemMods.js` |
| Gems added / removed / repositioned in quest reward windows | `data-curator` re-runs `npm run leveling-data:live` |
| Cluster jewel notables added / changed | `data-curator` updates `src/data/clusterJewelData.json` |
| Vendor recipes changed | `data-curator` updates `src/data/vendorLevelingStats.js` |
| Skill gem balance changes | `poe-expert` validates calculators that depend; `calculator-engineer` patches |
| New league mechanic introduces tooling demand | `feature-explorer` checks for community demand; if real → `/plan-feature` |

## Source excerpts

> *(re-fill on next /league-refresh — this file is a stub and should be deepened with the actual current-league mechanic, key changes, and player-facing notes)*

## Related Omnilyth files

- `src/contexts/LeagueContext.jsx` — runtime default league.
- `src/components/LeagueCountdown.jsx` — UI element showing time until current league ends.
- `src/data/leagues` (folder) — league metadata.
- `workers/poe-ninja-proxy.js` — Cloudflare Worker that fetches per-league prices from poe.ninja.

When you re-run `/league-refresh` for the next league:

1. Replace the "Answer" block above with the new league's name, patch, and status.
2. Note the previous-league-end date and the new-league-launch date in the "Details" block.
3. Move this snapshot to `cached/league-mirage-final.md` so the historical snapshot is preserved for reference.
