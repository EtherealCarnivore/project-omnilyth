---
topic: PoE 2 community tool landscape (competitor inventory)
sources:
  - https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2
  - https://poe.ninja/poe2
  - https://maxroll.gg/poe2
  - https://www.craftofexile.com/?game=poe2
  - https://github.com/SnosMe/awakened-poe-trade
  - https://github.com/Kvan7/Exiled-Exchange-2
  - https://www.poe2.dev
  - https://poe2db.tw/us/
  - https://poe2scout.com
fetched: 2026-05-06
---

# Competitor PoE 2 tool landscape

What exists in PoE 2 tooling today, organized by category. Reference for `feature-explorer` agent and for any new Omnilyth PoE 2 tool — to avoid duplicating well-served lanes.

The dominant rule for Omnilyth: **don't compete head-on with established tools in their core lane.** Maxroll owns build planning and atlas planning; PoB-PoE2 owns build math; Craft of Exile owns deep crafting; awakened-poe-trade owns trade overlay. Omnilyth's lane is narrow calculators, regex generators, planners, and lookups.

---

## Build planning

### Path of Building Community PoE2 fork

- **URL:** `github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2`
- **Status:** active. Latest tagged release `v0.15.0` (2026-01-13). Supports PoE 2 0.4 fully. No 0.5 support yet (expected within days of 0.5 launch).
- **Surface:** desktop build planner; full character math; gem-and-tree modeling; PoB build code import/export.
- **Activity:** 9,696 commits, 19 releases, ~146 open issues. The de-facto canonical PoE 2 build planner.
- **Implication for Omnilyth:** **Do not build a PoE 2 build planner.** Build *around* PoB-PoE2 — accept its build codes, link to it, don't replicate. Same posture Omnilyth takes for PoE 1 vs PoB-CE.

### Maxroll PoE2 (web-based planner + tools hub)

- **URL:** `maxroll.gg/poe2`
- **Status:** active.
- **Surface:** PoE2Planner (web build planner), Passive Tree, Atlas Tree, PoB-PoE2 import/export, **Instilling Calculator** (Distilled Emotions → amulet outcomes — direct Omnilyth-style calculator).
- **Implication for Omnilyth:** Maxroll has filled the build-planner-with-passive-tree niche on the web side. Their Instilling Calculator covers a niche calc Omnilyth could have wanted. **Don't duplicate**; differentiate on alt-tab UX, narrow tools, regex.

### PoEPlanner (poeplanner.com)

- **Status:** PoE 1 historically; verify if it has PoE 2 support yet.

---

## Trade & price-check (overlays)

### Awakened PoE Trade

- **URL:** `github.com/SnosMe/awakened-poe-trade`
- **Status:** active. Latest release supports both games (3.28.101+).
- **Surface:** Ctrl+D price check, OCR, Alt+W wiki, Shift+Space widgets, Ctrl+MouseWheel stash navigation.
- **Implication:** desktop overlay, not Omnilyth's lane (Omnilyth is web companion + the Watcher desktop binary which has different scope).

### Exiled Exchange 2

- **URL:** `github.com/Kvan7/Exiled-Exchange-2`
- **Status:** active. PoE 2-focused fork of Awakened PoE Trade. 61 releases, latest `0.14.0` (2026-03-28), 1,586 commits.
- **Surface:** trade overlay specifically for PoE 2.
- **Implication:** confirms there's a thriving PoE 2 overlay scene. Stay out of the overlay lane.

### Sidekick / POE Lurker / XileHUD / Scalpel

- Older PoE 1-era overlays. Sidekick (467 stars), POE Lurker (612 stars), XileHUD ("regex creator, modifiers, bases, uniques, crafting currencies, gems, keystones, quest passives, merchant history") — XileHUD is the closest desktop competitor to Omnilyth's lookup surface, but as an in-game overlay not a web companion.

---

## Pricing / economy

### poe.ninja /poe2

- **URL:** `poe.ninja/poe2/economy/<league>/currency` etc.
- **Status:** active. URL structure mirrors PoE 1's exactly (`/poe1/...` and `/poe2/...` are siblings).
- **Surface:** currency overview, item overview, builds list for PoE 2 leagues.
- **Implication for Omnilyth:** drop-in replacement for the PoE 1 `usePrices` hook once the worker allowlist is updated (done 2026-05-06). Any Omnilyth tool that needs PoE 2 prices just asks via the `apiPathPrefix(game)` helper.

### poe2scout.com

- **URL:** `poe2scout.com`
- **Surface:** currency exchange data; full feature inventory not yet captured. Worth a follow-up scout pass.

---

## Crafting math / simulation

### Craft of Exile (PoE 2 mode)

- **URL:** `craftofexile.com/?game=poe2`
- **Status:** active, called "work in progress" but supports talismans, corrupted mods, socketables. Will track 0.5's "items cannot be fully reset" pivot.
- **Surface:** Calculator, Simulator, Emulator, Affinities — same depth as their PoE 1 mode.
- **Implication:** **deep crafting probability is Craft of Exile's lane.** Don't try to out-CoE Craft of Exile.

---

## Reference databases

### poe2db.tw

- **URL:** `poe2db.tw/us/`
- **Status:** active. Primary PoE 2 reference database (HTML only, no public API).
- **Surface:** Items, Gems, Modifiers, Quests, Endgame, NPCs/Lore, Mechanics. Maps to PoE 1's `poedb.tw/us/` — same shape, different game.
- **Implication for Omnilyth:** **the canonical scrape source for PoE 2 mod / gem / waystone / item data.** `data-curator` writes scrapers against poe2db.tw.

### community-driven JSON repos

- **`github.com/marcoaaguiar/poe2-tree`** — community-maintained PoE 2 passive tree data. 513 commits, manually transcribed from videos/screenshots, no formal license. **Risky long-term dependency** but the only canonical PoE 2 tree data outside GGG client files.

---

## Narrow / specialty calculators

### poe2.dev

- **URL:** `poe2.dev/calculators`
- **Surface:** DPS, Speed, Currency calculators. Thin coverage.
- **Implication:** **room for narrow specialty calculators that poe2.dev hasn't built.** Omnilyth's strength.

### Maxroll Instilling Calculator

- **URL:** `maxroll.gg/poe2/instilling-calculator`
- **Surface:** Distilled Emotions → amulet outcomes.
- **Implication:** taken niche; don't duplicate.

---

## What's NOT covered well in PoE 2 today

(From the gaps in the above inventory; these are Omnilyth opportunity areas.)

| Gap | Demand | Difficulty |
|---|---|---|
| Item / Waystone Mod Regex generator | High (latent — every PoE 1 player coming to PoE 2 looks for this and finds nothing) | Low — fork the PoE 1 algorithm; data swap to poe2db.tw mods |
| Gwennen PoE 2 equivalent (gambling vendor, base-type filter) | Unknown — verify PoE 2 has a Gwennen analog post-0.5 | Low if mechanic exists |
| Currency divergence tracker (week-over-week, cross-strategy) | Medium-High | Medium — needs poe.ninja history |
| Atlas Tree Planner PoE 2 (post-0.5 expansion) | High once 40+ nodes land | High — community data extraction risk |
| Leveling Playbook PoE 2 (6-act version of the existing PoE 1 tool) | Medium | Medium — manual curation effort |
| Trial of Sekhemas / Trial of Chaos planner | Medium | Medium — depends on mechanic stability |

---

## GGG-blessed third-party tools list

For PoE 1, GGG maintains `pathofexile.com/forum/view-thread/1937162` (or current canonical link) as a blessed third-party tools list. **Find the PoE 2 equivalent** — it'll be the gateway for Omnilyth to be officially listed once we ship real PoE 2 tools.

Action item: locate the PoE 2 community-resources thread; cache the URL here when found.

---

**Status:** snapshot 2026-05-06 (pre-0.5 announcement). Re-fetch each tool's status after 0.5 launch; many will release PoE 2 0.5 updates within days.
