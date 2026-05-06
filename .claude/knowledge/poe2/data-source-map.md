---
topic: PoE 2 data sources for Omnilyth tools
sources:
  - https://poe2db.tw/us/
  - https://github.com/marcoaaguiar/poe2-tree
  - https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2
  - https://poe.ninja/poe2
  - https://github.com/grindinggear (verified empty for PoE 2)
fetched: 2026-05-06
---

# PoE 2 data source map

For each tool Omnilyth might fork to PoE 2, where the data comes from, what shape it has, how often it refreshes, and which tools are blocked vs ready.

**Critical context:** GGG does **not** publish PoE 2 data the way they publish PoE 1's. There is no `github.com/grindinggear/skilltree-export` for PoE 2; no `atlastree-export`. Community sources (poe2db.tw, marcoaaguiar/poe2-tree) are the realistic path. This is the single biggest constraint on PoE 2 data ingestion in 2026.

---

## Tool-by-tool plan

### Item Mod Regex (PoE 2)

```
DATA SOURCE     : poe2db.tw/us/Modifiers (HTML scrape, no API)
                  Backup: PoB-PoE2 internal Lua data at /src/Data/poe2/ for cross-validation
SHAPE           : { id, modText, tierRange, itemTypes, generationType: prefix|suffix|corrupted|desecrated }
REFRESH CADENCE : per-patch (every 3-4 months for major; faster for hotfix)
PIPELINE        : `npm run poe2-data:scrape-modifiers` → src/data/poe2/itemMods.js
                  (analogous to existing scripts/leveling-data/ pipeline pattern)
PHASE READY     : Phase 3 (May 29 launch — easiest fork)
RISK            : poe2db.tw HTML structure may change; scraper needs maintenance
```

### Gem Browser / Gem Regex / Gem Planner (PoE 2)

```
DATA SOURCE     : poe2db.tw/us/Gem (HTML)
                  GGG forum gem reveals from 0.5 announcement (May 7+)
                  Optional: PoB-PoE2 /src/Data/poe2/ Lua gem data for cross-validation
SHAPE           : { id, name, type: uncut|skill|support|spirit|meta, levelReqs, statReqs: {str,dex,int}, tags, baseDamage, scaling, vendors }
REFRESH CADENCE : per-patch (new gems each major patch — especially 0.5 with new ascendancies)
PIPELINE        : `npm run poe2-data:scrape-gems` → src/data/poe2/gemData.js
PHASE READY     : Phase 3 (May 29 — but new 0.5 gems require day-0 / day-1 refresh after launch)
RISK            : Different gem system means UI fork is non-trivial (uncut/skill/support/spirit/meta categorization)
```

### Leveling Mode / Playbook (PoE 2)

```
DATA SOURCE     : Manual curation. PoE 2 has 6 acts (vs PoE 1's 10) so the
                  zone/quest/skill-reward map needs hand-building.
                  Reference: poe2db.tw/us/Quests, community guides (Maxroll PoE2,
                  PoE Vault PoE2), GGG's own druids-style act pages
SHAPE           : Per-act → zones[] → quests[] with rewards + monster types +
                  boss notes + recommended gem swaps. Plus campaign-wide
                  vendor leveling stats.
REFRESH CADENCE : Per-major-patch (acts rarely change; gem rewards change with new gems)
PIPELINE        : Manual editing of src/data/poe2/leveling/*.js initially.
                  Long-term: scripts/poe2-leveling/ pipeline (mirrors PoE 1 pipeline)
PHASE READY     : Phase 3 maybe (depends on bandwidth) or Phase 4
RISK            : Most labor-intensive of all forks; scope creep risk
```

### Waystone Mod Regex (PoE 2)

```
DATA SOURCE     : poe2db.tw/us/Waystone + 0.5 patch notes for new waystone mods
SHAPE           : { id, modText, tierRange, applicability: waystone|map-device, impact: positive|negative }
REFRESH CADENCE : Per-patch — and 0.5 has waystone overhaul, so day-0 scrape required
PIPELINE        : New `npm run poe2-data:scrape-waystones`
PHASE READY     : Phase 4 (blocked on 0.5 — existing 0.4 waystone mods will be wrong post-launch)
RISK            : Mod pool is the most volatile data surface across PoE 2 patches
```

### Atlas Tree Planner (PoE 2)

```
DATA SOURCE     : Community-only (no GGG export expected). Watch:
                  - github.com/marcoaaguiar/poe2-tree (or successor)
                  - PoB-PoE2 /src/TreeData/ directory
                  - Reverse-engineering after 0.5 launch (~1-2 weeks lag)
SHAPE           : Different from PoE 1's. PoE 2 atlas had ~8 nodes pre-0.5;
                  0.5 takes it to 40+. Structure unknown until launch.
REFRESH CADENCE : Per-major-patch
PIPELINE        : Manual data ingest first launch; then scrape from whichever
                  community repo emerges as canonical
PHASE READY     : Phase 4 (blocked on 0.5 launch + community data extraction lag)
RISK            : External repo dependency — if maintainer drops, we inherit upkeep.
                  License unclear on marcoaaguiar/poe2-tree.
```

### Passive Tree Planner (PoE 2)

```
DATA SOURCE     : Community (poe2-tree repo) — manual transcription, quality risk
SHAPE           : Orbit-based JSON similar to PoE 1's, smaller node set, different taxonomy
REFRESH CADENCE : Per-major-patch
PIPELINE        : External repo dependency
PHASE READY     : NOT PLANNED — PoB-PoE2 owns this lane. Omnilyth links to it.
                  Reverse decision only if PoB-PoE2 stagnates or community demand surges
                  for a different surface (e.g., regex over passive nodes).
```

### Pricing surfaces (any PoE 2 tool that consumes prices)

```
DATA SOURCE     : poe.ninja /poe2/api/economy/exchange/current/overview
                  Routed via the Cloudflare Worker (allowlist updated 2026-05-06)
SHAPE           : Same as PoE 1's poe.ninja response
REFRESH CADENCE : 24h client cache (matches PoE 1)
PIPELINE        : usePrices(league) hook automatically picks the right path via
                  apiPathPrefix(game) helper from GameContext (Phase 1 architecture work)
PHASE READY     : Day 0 (the moment GGG announces the new league name on May 7)
RISK            : poe.ninja PoE 2 data lags the league launch by ~12-36 hours
                  while their crawlers populate; expect noisy day-1 data
```

---

## League / patch data

### `pathofexile.com/api/leagues`

- **Endpoint:** `https://www.pathofexile.com/api/leagues`
- **Shape:** array of league objects with `id`, `realm`, `description`, `category`, etc.
- **`realm` field:** distinguishes PoE 1 from PoE 2. **Verify exact value** (`'pc'` vs `'poe2'`?) before relying on it for filtering.
- **Used by:** LeagueContext to populate the league selector. After Phase 1 architecture, will filter response by current `game`.

### Patch notes

- **PoE 1:** `poewiki.net` "Version X.Y.Z" pages. Worker's `VERSION_PREFIXES = ['Version 3.28', 'Version 3.27']` handles discovery.
- **PoE 2:** verify the wiki convention. Likely `poewiki.net` "Version 0.x.x" or a dedicated PoE 2 wiki space. **Action:** confirm naming + add to `VERSION_PREFIXES` (game-aware).

---

## Build code interop (PoB import)

### PoB-PoE2 build code format

- **Verify:** does PoB-PoE2 use the same base64-LZMA format as PoB-CE? The worker's regex extractor `/buildcode[^>]*>([eE][A-Za-z0-9_+/=-]{20,})/` may or may not match.
- **Test:** grab a known PoB-PoE2 build code from `pobb.in` and feed it through the worker. Adjust extractor if mismatched.

---

## Hosting / domain

- **`omnilyth.app`** (current) — serves both games via the asymmetric URL strategy (PoE 1 unprefixed, PoE 2 at `/poe2/...`).
- **`api.omnilyth.app`** — Cloudflare Worker proxy; allowlist now covers both games.
- **No subdomain split planned.**

---

## Known data scraping limitations

- **`poewiki.net`** and **`pathofexile.fandom.com`** frequently 403 to `WebFetch`. Use `WebSearch` snippets when fetches fail; tag findings as snippet-only.
- **`poedb.tw` / `poe2db.tw`** — works with `WebFetch`; uses underscored URLs for special characters. Apostrophes in names (e.g. "Shavronne's") need underscore variants.
- **`reddit.com`** (any subdomain) — fully blocked by `WebFetch`. Snippet-only via search.
- **Discord servers** — public previews only; no API.

---

## Update cadence for this file

Re-run the data-source map exercise:
- After 0.5 launch (May 29) — confirm all sources still work; update any URL that moved.
- When a new community repo emerges as authoritative for PoE 2 tree data.
- When GGG opens an official PoE 2 export (would massively simplify the pipeline).
