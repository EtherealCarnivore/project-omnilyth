---
sweep: maiden-broad
date: 2026-05-06
scope: Tier 1 (r/pathofexile, r/PathOfExileBuilds, GGG forums, PoB releases) + Tier 2 (awakened-poe-trade, exilence-next, MaxRoll, PoE Vault, PoEDB, poe.ninja, poe.re)
note: Reddit (www, old) returned hard 403 from WebFetch end-to-end; reddit signal collected via Google snippets only and tagged accordingly per entry.
---

# Maiden broad sweep — raw harvest

This is the unedited audit trail. Every URL fetched, every search query run, every snippet quoted. Candidate files in `../candidates/` and `../delta/` are the dedup'd, scored output.

---

## Reachability notes

- `www.reddit.com`, `old.reddit.com` — fully blocked by WebFetch ("Claude Code is unable to fetch from www.reddit.com"). Snippet-only via Google search.
- `www.poewiki.net` and `pathofexile.fandom.com` — frequent 403 on direct WebFetch; relied on Google search snippets.
- `lootcalc.com` — 403 on direct WebFetch; signal via Google snippet.
- `xanthics.github.io/poe_gen_gwennen/` — page reached, but content reports tool deprecated, redirects to `poe.re`.
- GGG forum, GitHub, MaxRoll, Craft of Exile, FilterBlade — all reachable.

---

## Search queries run

WebSearch:
- `site:reddit.com/r/pathofexile QoL tool wishlist suggestion 2025`
- `site:reddit.com/r/pathofexile "I made a tool" PoE 1 calculator 2025`
- `site:reddit.com/r/PathOfExileBuilds "PoB doesn't" OR "wish PoB" 2025`
- `awakened-poe-trade features list price check overlay`
- `exilence-next features wealth tracker net worth profit`
- `MaxRoll PoE tools list build planner simulator`
- `reddit pathofexile site:reddit.com flask suffix prefix wishlist QoL`
- `reddit pathofexile site:reddit.com "harvest" reforge calculator wishlist`
- `"path of exile" flask mod regex generator tool`
- `"path of exile" heist contract blueprint reward calculator`
- `"path of exile" beast bestiary recipe lookup tool`
- `"path of exile" betrayal syndicate cheat sheet board tracker`
- `"path of exile" delirium splinter currency calculator profit`
- `"path of exile" expedition gwennen artifact gamble calculator`
- `"path of exile" tool "loot filter" generator customize Neversink`
- `"path of exile" "boss" "tracker" pinnacle unique drop checklist 3.28`
- `"path of exile" reddit "wish there was a tool" OR "someone make" 3.27 OR 3.28`
- `"path of exile" "heist" "rogue" gear loadout calculator markings`
- `"path of exile" "currency exchange" calculator bulk trade ratio 3.28`
- `"path of exile" "labyrinth" enchant calculator chance helmet boots`
- `"path of exile" "essence" calculator deafening monstrous chance odds`
- `"path of exile" "fossil" calculator resonator combination mod weight`
- `"path of exile" "mirage" league wishes calculator omen tool`
- `"path of exile" PoB community ascendancy preview new build planner alternative`
- `"path of exile" exilence-next snapshot history ladder competition guide`
- `"path of exile" "trial of the ancestors" tournament tribe tracker tool`
- `"path of exile" mirage wish sigil reroll cost calculator djinn coin`
- `"path of exile" community tool github 2025 popular star upvote`
- `"path of exile" mirage wishes list spreadsheet best ranking tier`
- `"path of exile" "scarab" tool calculator regex generator coverage`
- `"path of exile" "map mod" warning overlay reflect cannot leech`
- `"path of exile" "atlas" "crafting bench" cost calculator masters`
- `"path of exile" "boss" "uber" splinter fragment cost cheapest scaling`
- `"path of exile" "ritual" tribute calculator omen vessel`
- `"path of exile" "atlas memory" memory line tool tracker recombobulator`
- `"path of exile" "breach" splinter calculator catalyst farming`
- `"path of exile" "expedition" logbook reroll calculator value`

WebFetch (successful):
- `https://www.pathofexile.com/forum/view-thread/3911867` — 3.28 MTX & stash QoL wishlist (top community thread; G5 regex item is most tool-relevant).
- `https://www.pathofexile.com/forum/view-forum/feedback` — current GGG feedback forum thread list.
- `https://github.com/PathOfBuildingCommunity/PathOfBuilding/releases` — recent PoB-CE release notes (2.61.0–2.65.0).
- `https://github.com/SnosMe/awakened-poe-trade` — awakened-poe-trade README header (light on detail; main signal from web docs).
- `https://snosme.github.io/awakened-poe-trade/` — feature surface (price check, OCR, widgets, wiki integration).
- `https://snosme.github.io/awakened-poe-trade/quick-start` — confirmed price-check + Alt+W wiki + widget panel + `Ctrl+MouseWheel` stash; map check NOT explicitly in quick-start.
- `https://github.com/exilence-ce/exilence-next` — net worth, hourly gain, snapshots, group features.
- `https://maxroll.gg/poe` — confirms PoEPlanner + PoExchange as their core tool surface.
- `https://poedb.tw/us/` — data-browser depth (mods, gems, beasts, scarabs, divs, currency).
- `https://poe.ninja/` — page content limited to footer; section names known from search.
- `https://www.craftofexile.com/` — 4 modes: Calculator, Simulator, Emulator, Affinities. Owns PoE 1 crafting math.
- `https://www.poe-vault.com/guides/path-of-exile-tools` — canonical tool list: Craft of Exile, Vorici, awakened-poe-trade, Trade, PoB, FilterBlade, poe.ninja, PoELab, poe.re Map Regex.
- `https://xanthics.github.io/poe_gen_gwennen/` — deprecated, redirects to `poe.re` (which owns Gwennen regex now).
- `https://www.u4n.com/news/list-of-poe-mirage-wishes-sigil-328.html` — 60 distinct Mirage wishes; 3 sigils (Ruzhan/Kelari/Navira); 3 djinn coin types (Power/Skill/Knowledge).

WebFetch (failed):
- `https://www.reddit.com/...` — blocked.
- `https://old.reddit.com/...` — blocked.
- `https://www.poewiki.net/wiki/Mirage_league` — 403.
- `https://www.poewiki.net/wiki/Wish` — 403.
- `https://lootcalc.com/games/poe/currency-profit-calculator` — 403.
- `https://snosme.github.io/awakened-poe-trade/widgets` — 404.
- `https://github.com/SnosMe/awakened-poe-trade/blob/master/main/CHANGELOG.md` — 404.
- `https://www.pathofexile.com/forum/view-forum/feedback-and-suggestions` — 404 (URL shape changed; replaced with `/feedback`).
- `https://poe.re/` — page reached but body content suppressed by JS render (regex categories known from search snippet).
- `https://poetools.github.io/BetrayalCheatSheet/` — page reached but body content empty in fetch (tool functionality known from search snippet).

---

## Tool-landscape snapshot (PoE 1, May 2026)

This is what already exists, organized by what Omnilyth cares about. Establishes our dedupe baseline.

### Build planning (NOT Omnilyth's lane — PoB owns this)
- **Path of Building Community (PoB-CE)** — 5.1k stars, offline build planner, 3.28 fully supported as of 2.61.0–2.65.0. Recent releases: cluster jewel crash fixes, build comparison tab, Imbued Supports, Watcher's Eye search, holy strike calc fixes.
  https://github.com/PathOfBuildingCommunity/PathOfBuilding (2026-05-06)
- **PoEPlanner / poeplanner.com** — web build planner, less depth than PoB.
- **MaxRoll PoE2Planner / MaxRoll PoEPlanner** — community-build browsing, PoB import/export.

### Trade / price check (NOT Omnilyth's lane)
- **awakened-poe-trade** — Ctrl+D price check, OCR, Alt+W wiki, Shift+Space widgets, Ctrl+MouseWheel stash. Quick-start does NOT mention map mod overlay or build-aware mod warnings; that lives elsewhere (XileHUD, poe.how, scalpel).
  https://snosme.github.io/awakened-poe-trade/quick-start (2026-05-06)
- **Sidekick** (467 stars), **Scalpel** (fourth-party), **POE Lurker** (612 stars), **XileHUD** — overlay/trade landscape; XileHUD explicitly markets "regex creator, modifiers, bases, uniques, crafting currencies, gems, keystones, quest passives, merchant history" — closest competitor to Omnilyth's lookup surface but as a desktop overlay not a web companion.

### Wealth tracking (NOT Omnilyth's lane unless we change posture)
- **exilence-next / exilence-ce** — 2.4k stars, net worth, hourly gain, group, snapshots up to 1 week.
  https://github.com/exilence-ce/exilence-next (2026-05-06)
- **MaxRoll PoExchange** — net worth tracking.
- **Wealthy Exile** — wealthyexile.com — competing wealth tracker.

### Loot filter (NOT Omnilyth's lane)
- **FilterBlade.xyz** — owns NeverSink filter customization end-to-end. Push directly to PoE account.
  https://www.filterblade.xyz/ (2026-05-06)

### Crafting math / simulation (Craft of Exile owns the deep math)
- **Craft of Exile** — Calculator, Simulator, Emulator, Affinities. Fossils, essences, harvest, slams, beasts, syndicate Aisling, meta-crafting. PoE 1 + PoE 2.
  https://www.craftofexile.com/ (2026-05-06)
- **Vorici Calculator** — chromatic socket math. (Omnilyth's Chromatic + Tainted + Blanching + Jeweller calculators are our equivalent.)
  http://siveran.github.io/calc.html (2026-05-06)
- **Fossilizer (gitlab)** — fossil combination calculator.

### Profit / EV calculators
- **LootCalc — PoE Currency & Profit Calculator** — EV per action, GPH, Delirium etc. Closest evolved competitor in the strategy/profit lane.
  https://lootcalc.com/games/poe/currency-profit-calculator (snippet only — 403 on fetch, 2026-05-06)
- **MaxRoll farming guides** — narrative form, not interactive calculator.

### Regex generators
- **poe.re** — claims map, gwennen, beast, vendor, scarab regex (snippet); now hosts the deprecated `xanthics/poe_gen_gwennen` traffic.
  https://poe.re/ (2026-05-06, body content blocked)
- **exile.re** — map regex with Quantity/Pack Size/Scarabs/Currency/Rarity optimization.
  https://exile.re/ (2026-05-06)
- **poetoolbox.com/mapregex** — map regex with scarab value.
- **xanthics.github.io/poe_gen_search_string** — older map regex generator.
  https://xanthics.github.io/poe_gen_search_string/ (2026-05-06)
- **vhpg.com/gwennen** — Gwennen cheat sheet + regex paste, manually maintained.
- **Lailloken / Exile-UI** (1k stars) — overlay with regex creator.
- **Omnilyth has:** map-regex, item-regex, scarab-regex, gem-regex, vendor-leveling regex.
- **Omnilyth missing (notable):** Gwennen regex, Heist contract regex, Flask regex, Beast regex, Expedition logbook reroll regex.

### Cheat sheets / lookup utilities
- **Betrayal Syndicate cheat sheet** — `poetools.github.io/BetrayalCheatSheet/`, `poelab.com/syndicate-cheatsheet`, plus content sites (ssegold, aoeah, sportskeeda) all republishing the 5522 board strategy.
- **PoELab** — daily Labyrinth layouts (Omnilyth doesn't compete).
- **PoEDB** — raw data depth Omnilyth can't match (and shouldn't try).

### Mirage league (current — 3.28)
- **No interactive Wish picker tool found**. Content sites (MaxRoll, GAMES.GG, sportskeeda, u4n, mmopixel, poecurrency, vhpg) ship long-form guides ranking the 60 wishes by farming goal. Read-only.
- **poe.ninja** tracks Omen + Djinn Coin prices.
- **Craft of Exile** flagged "Mirage League" mode but for crafting math, not wishes.

### Other gaps surfaced
- Heist: only **Heistress** (LawTotem GitHub, ~niche) tracks contract/blueprint loot. Reward-room EV is uncovered.
- Trial of the Ancestors: zero tooling found. (Likely PoE 1 only when re-implemented; probably not a current league mechanic anymore — verify before scoring.)
- Atlas Memory: removed in 3.26 → moved to red-tier Kirac. Not a candidate.
- Currency Exchange (Kingsmarch): no calculator surface; just price browsers.

---

## GGG forum signal — 3.28 QoL wishlist thread

Source: https://www.pathofexile.com/forum/view-thread/3911867 (2026-05-06)
"3.28 MTX & stash QoL wishlist - with feedback from hundreds of players"

Tool-relevant entries:
- **G5 — Regex improvements (high community support)**: "prevent applying orbs to regex-highlighted items until string deletion." Use case: alt spam, chaos spam, map rolling.
- **N2 — UI / search**: ctrl+F for shop, alphabetize gems, multiple stash tab rows.
- **I4 — Pilfering Ring tracking**: cross-character + cross-league tracking of Hinekora's Locks, Valdo's Puzzle Boxes, Voidborn Keys.

Rest of feedback forum (live thread list):
- Map mod search ("Search function for mod list when entering a map")
- Currency tab feedback after drop-rate changes
- Aura overhaul, cluster gem notable expansion
- Animated Guardian QoL, Bestiary QoL rework
- Performance complaints (109 replies on one thread — not tool-relevant)
- Foulborn Unique Collection slots

No explicit third-party tool requests in the visible thread titles; the demand is mostly in-game-side. Tool-shaped opportunity is the **regex G5** ask — interpreted broadly, it's "I want better regex" which Omnilyth lives at the center of.

---

## Reddit signal (snippet-only, blocked from direct fetch)

Snippets confirm:
- "I made a tool" posts surface most weeks but Google indexing is sparse for filtered queries.
- Craft of Exile, PoE Planner, PoB-CE, FilterBlade, awakened-poe-trade are the canonical reddit-recommended tool stack.
- One niche flag: `scalpelpoe/scalpel` (overlay-mode regex + filter editor + price check) is rising on GitHub topic searches.
- Strong evidence that Mirage Wish ranking is a hot discussion topic right now (60 wishes, 3-pick mechanic, league active for ~weeks).

Reddit gap is the biggest collection limitation in this sweep. Future sweeps should try the Pushshift mirror or Google Cache.

---

## Decisions log (what stayed, what was cut)

### Cut — already covered by Omnilyth
- Fusing / linking calculator → we have `fusing-calculator`
- Chromatic / socket coloring → we have 4 calculators
- Map mod regex → we have `map-mods` (extend, don't duplicate)
- Scarab regex → we have `scarab-regex`
- Vendor leveling regex → we have `vendor-leveling`
- Atlas tree planner → we have `atlas-tree` + `atlas-diff`
- Cluster jewel notables → we have `cluster-jewel`
- Timeless jewel seed search → we have `timeless-jewel` with worker
- Passive tree planner → we have `passive-tree`
- Gem browser / regex / planner / lookup → we have `leveling-gems`, `gem-regex`, `leveling-planner`, `gem-lookup`

### Cut — owned by competitors with crushing depth, Fit:L for Omnilyth
- Full crafting simulator → Craft of Exile owns. Fit:L.
- Build planner → PoB-CE owns. Fit:L.
- Wealth/profit tracker (per-account, login-gated, snapshots) → exilence + MaxRoll PoExchange. Backend cost makes this Fit:L for our static site.
- NeverSink filter customizer → FilterBlade owns. Fit:L.
- Daily Lab layout → PoELab owns and depends on daily image generation pipeline. Fit:L.
- Live trade overlay (in-game keystroke price check) → awakened-poe-trade. We already have a desktop watcher; doubling down here is the watcher's job, not the web app's.

### Kept (final candidates)
1. Mirage Wish picker / decision aid — **Demand H, Fit H** (active league, 60 options, no interactive tool)
2. Gwennen gamble regex generator — **Demand M-H, Fit H** (clean regex shape, deprecation gap)
3. Betrayal Syndicate cheat sheet / board planner — **Demand H, Fit M** (evergreen, every league)
4. Heist Blueprint reward-room EV picker — **Demand M, Fit H** (calculator-shaped; players currently eyeball it)
5. Currency Exchange ratio helper (bulk trade) — **Demand M, Fit M** (Kingsmarch is current and uncovered)
6. Build-aware Map Mod Danger Highlighter — **Demand H, Fit H** (extends existing map-mods regex; dual-cite as delta)
7. Pinnacle Boss / Uber fragment cost & path planner — **Demand M, Fit M** (uber fragment EV is currently spreadsheet-shaped)

### Kept (deltas — competitor has it, we have a weaker version or none)
- Map check overlay vs awakened-poe-trade's quick-mod-check — we have map regex but no "given current map, here is the danger summary" view. (Cross-listed as candidate #6 + delta.)
- Net-worth snapshot vs exilence — we don't have a wealth view at all. Honest framing of "do we want to play in this lane" — Fit:L by default, but worth surfacing.
- Crafting cost-comparator (across methods) vs Craft of Exile — our individual crafting calcs don't compare-against each other. Smallest version: a single page that takes "I want this outcome" and lists the 3 cheapest paths from our existing calcs. Fit:M.

---

## Open questions for next sweep

- Reddit access. Worth trying RedditAPI / Pushshift / Google Cache. Snippet-only is leaving signal on the table.
- Trial of the Ancestors status — is it currently in PoE 1, a previous league, or shelved? Tribe tracker idea hinges on it.
- Twitch / YouTube tool sightings (Tier 3) — skipped this sweep; may be where streamer-driven wishlist signal lives.
- Discord servers (PoE community, build-specific) — typically high-signal, no fetch path.
- The watcher product. We have a desktop binary. Adjacent ideas (kill counter, league challenge tracker, mapping session timer) might belong inside the watcher rather than the web app — score those separately.
