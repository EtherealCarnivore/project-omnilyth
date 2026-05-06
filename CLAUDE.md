# CLAUDE.md — Project Omnilyth

**Operating manual for AI assistants working in this repo.** Read this fully before any non-trivial task. Pair with [`AGENTS.md`](./AGENTS.md) (agent routing) and [`.claude/agents/`](./.claude/agents/) (agent definitions).

---

## 0. What is Omnilyth?

A **Path of Exile** companion toolkit — crafting calculators, regex generators, atlas/leveling planners, build-planning utilities, and a desktop trade watcher. **Supports both Path of Exile 1 and Path of Exile 2** (dual-game in a single deployment; see §0.5 below).

- **Stack:** React 19 + Vite 7 + Tailwind CSS 4, Context API for state, Fuse.js for search, no Redux / no component library / no TypeScript.
- **Deploy:** GitHub Pages (primary public site) + Cloudflare Worker for poe.ninja proxy. *(Netlify functions still in-tree as fallback but no longer the active path.)*
- **Live URLs:**
  - GitHub Pages: https://etherealcarnivore.github.io/omnilyth-core-public/
  - CF Worker proxy: https://k-genov.workers.dev/

---

## 0.5. PoE 1 vs PoE 2

Omnilyth ships as a single SPA that serves **both** Path of Exile 1 and Path of Exile 2. The two games share branding but diverge mechanically; many tools have analogs in only one game.

**Architecture summary:**
- `GameContext` (outermost provider) owns `{ game: 'poe1' | 'poe2', setGame }`. localStorage key: `omnilyth_game_v1`. Default: `'poe1'`.
- Every entry in `src/modules/registry.js` carries a `games: ['poe1' | 'poe2']` array. `regex-library` is the only entry with `['poe1', 'poe2']` on day one — saved patterns are user-owned text.
- URL strategy is **asymmetric**: PoE 1 keeps unprefixed routes (`/atlas/tree`, `/crafting/fusing`) to preserve every existing inbound link; PoE 2 routes get a `/poe2/` prefix (`/poe2/`, `/poe2/leveling/playbook`).
- Topbar shows a two-tab game switcher (PoE 1 orange, PoE 2 cyan) on the far-left as the persistent indicator.
- Cross-game bookmark behavior: if a PoE 2-active user lands on a PoE 1-only tool, the tool renders WITH a sticky amber switch-back banner — no 404, no forced redirect.
- Cloudflare Worker proxy `NINJA_ALLOWED` allowlist covers both games (`/poe1/api/economy/...` + `/poe2/api/economy/...`).

**Per-game data:**
- PoE 1 data: `src/data/`. Sources: `poedb.tw/us/`, `poewiki.net`, official patch notes.
- PoE 2 data: `src/data/poe2/` (post-Phase 3). Sources: **`poe2db.tw/us/`** (canonical, HTML scrape), `marcoaaguiar/poe2-tree` (community tree data, risky long-term), PoB-PoE2 fork (Lua data for cross-validation), official PoE 2 patch announcements.
- **Critical:** GGG does NOT publish PoE 2 data the way they publish PoE 1's. No `grindinggear/skilltree-export-poe2` exists.

**Tool inventory:**
- **PoE 1-only** (no PoE 2 analog): chromatic, tainted, blanching, jeweller, fusing, socketing, scarab-regex, dust-calculator, cluster-jewel, timeless-jewel, map-mods, vendor-leveling, all PoE 1 leveling tools, atlas-tree (PoE 1), atlas-diff, passive-tree (PoE 1).
- **Cross-game** (one entry, both games' patterns): `regex-library` (saved patterns are user-owned text).
- **PoE 2 forks planned** (separate registry entries): Item Mod Regex (PoE 2), Gem Browser/Regex (PoE 2), Leveling Playbook (PoE 2), Waystone Mod Regex (PoE 2), Atlas Tree Planner (PoE 2 post-0.5).
- **Don't build for PoE 2:** anything PoB-PoE2, Maxroll PoE 2, awakened-poe-trade, Craft of Exile already does well in their core lane.

**Phase status (2026-05-06):**
- Phase 1 (scaffold) — IN PROGRESS. Worker allowlist updated; KB seeded; feature radar seeded; agent prompts game-aware. Architecture (GameContext, registry filter, switcher UI) pending.
- Phase 2 (announcement-driven update) — **2026-05-07 20:00 GMT** — wait for GGG 0.5 announcement.
- Phase 3 (0.5 launch import) — **2026-05-29 1 PM PDT** — first real PoE 2 tools.
- Phase 4 (community-tool follow) — June 12+.

**Always ask which game** when an agent / contributor takes on a new task. Default-assume PoE 1 only when the entire surrounding context is unambiguously PoE 1.

**See also:**
- `.claude/knowledge/poe2/0.4-baseline.md` — current PoE 2 mechanics (pre-0.5).
- `.claude/knowledge/poe2/community-tool-landscape.md` — competitor inventory.
- `.claude/knowledge/poe2/data-source-map.md` — per-tool data plan.
- `.claude/feature-radar/poe2/INDEX.md` — PoE 2 feature backlog.
- `C:/Users/Admin/.claude/plans/ok-so-you-can-radiant-aurora.md` — full plan (referenced for the migration decisions).

---

## 1. Decision tree — start here every session

Before reaching for a generic implementation, route your task:

```
What are you doing?
├── "What should we build next? What are players asking for? What does <competitor>
│   ship that we don't?"
│       → Agent: feature-explorer
│       → Outputs ranked candidates to .claude/feature-radar/ (citation-backed)
│       → Hand winners to ui-architect for IA, then the build pipeline
│
├── Designing a new feature / page (strategic)
│       → Agent: ui-architect (decides IA, taxonomy, journey, reuse — outputs a brief)
│       → Then hand to ui-designer / interaction-designer / accessibility-auditor for execution
│
├── Visual review / "make this look right" / Tailwind polish
│       → Agent: ui-designer
│       → Defers state coverage to interaction-designer, a11y to accessibility-auditor
│
├── Loading / empty / error / stale states, motion, hover/click feedback, choreography
│       → Agent: interaction-designer
│
├── WCAG / keyboard nav / screen reader / contrast / target size / reduced motion
│       → Agent: accessibility-auditor
│
├── Implementing PoE math (drop-rates, link probabilities, EHP, etc.)
│       → Agent: calculator-engineer
│       → Validate output against agent: poe-expert
│
├── Generating PoE regex (map mods, vendor items, gems, scarabs)
│       → Calculator code + agent: poe-expert (mod text accuracy)
│       → Honor PoE's 250-char limit; multi-output if needed
│
├── Updating data files (gems, mods, jewels, leveling routes)
│       → Agent: data-curator
│       → Run the matching scripts/leveling-data/ pipeline if applicable
│
├── Game-mechanics question, build advice, calculator validation
│       → Agent: poe-expert (advisory only — doesn't write code)
│
├── "Look it up" — current mod tiers, gem stats, unique behavior, league mechanics,
│   patch history (anything that wants citation-backed numbers)
│       → Agent: poe-wiki-oracle (sweeps src/data/, .claude/knowledge/, sister
│         PoB KB, then poewiki.net / poedb.tw / patch notes; caches answers)
│
├── Bundle / render perf concern, "did we get fatter", new tool size-check
│       → Agent: performance-auditor
│
├── "What build should I play / league-start picks / meta read / tier list"
│       → Agent: build-strategist (advisory; ladder + patch-aware)
│
├── "What's worth farming / currency strategy / week-1 economy / divergence"
│       → Agent: economy-analyst (advisory; phase-tagged)
│
├── "QA this / smoke test / validate output / browser check / regression playbook"
│       → Agent: qa-tester (manual playbooks; no test framework)
│
├── "Find dead code / what can we delete / drift / over-engineered / simplify"
│       → Agent: code-archaeologist (pairs with performance-auditor)
│
├── "Draft release notes / changelog / version bump / patch notes"
│       → Agent: release-manager (player-facing voice; CHANGELOG.md)
│
├── "Security audit / XSS / dep audit / CSP / proxy review / is this safe"
│       → Agent: security-auditor (standing posture; distinct from /security-review)
│
├── Ship gate — "is this ready"
│       → Agent: feature-reviewer (lean SHIP / REVISE / REJECT verdict)
│       → Or skill: /ship (full pipeline: gate → QA → changelog)
│
├── Multi-axis health check before release
│       → Skill: /audit-all (parallel: perf + a11y + code + security)
│
├── New PoE league launched
│       → Skill: /league-refresh <name> (oracle → data → build → economy → release)
│
├── Adding a new calculator from scratch
│       → Skill: /calc-new <kebab-name>  (scaffolds 4 files + registry entry)
│       → then poe-expert → calculator-engineer for the math
│       → then ui-designer + interaction-designer + accessibility-auditor in parallel
│
├── Full UI/UX deep pass on a single existing page
│       → Sequential: ui-architect (if IA might change)
│       → Then PARALLEL: ui-designer + interaction-designer + accessibility-auditor
│
├── Cross-cutting bug, multi-file refactor, "where is X?"
│       → Agent: Explore (very thorough) for research
│       → Agent: Plan for design before implementation
│
└── A single small known edit
        → Just do it. No agent needed.
```

See [`AGENTS.md`](./AGENTS.md) for full routing logic, including parallelism and pipelines.

---

## 2. Architecture at a glance

### Project structure

```
src/
├── calculators/      # Pure logic, no React (chromaticCalc, fusingCalc, etc.)
├── components/       # Reusable React components, organized by domain
├── contexts/         # 9 context providers (League, Prices, Pinned, Design,
│                     #   LevelingProgress, LevelingMode, PatchNotes, …)
├── data/             # Static game data — large JS/JSON files
├── hooks/            # Custom hooks (usePrices, useGemSearch, …)
├── layout/           # Sidebar, Topbar — app shell
├── modules/          # registry.js — single source of truth for routes/tools
├── pages/            # Route components, lazy-loaded
├── utils/            # Helpers (secureStorage, inputValidation, …)
└── workers/          # Web Workers (timeless seed search, …)

api/                  # Vercel serverless (legacy)
netlify/functions/    # Netlify functions (legacy fallback)
workers/              # Cloudflare Worker (current proxy)
scripts/              # Data pipelines, hash gen, parsers
```

### Patterns

- **Lazy loading:** every page in `modules/registry.js` uses `React.lazy()`.
- **Module registry:** *the* source of truth for the sidebar, routes, and tools list. Never hard-code routes elsewhere.
- **Context-only state:** no Redux, no Zustand. State lives in 9 nested providers in `App.jsx`.
- **Serverless proxy:** poe.ninja calls go through the Cloudflare Worker; `VITE_PROXY_URL` overrides at build time.

### Module registry (current tools)

```
Crafting / Coloring        : Chromatic, Tainted Chromatic, Omen of Blanching, Jeweller's Method
Crafting / Links & Sockets : Fusing, Socket
Crafting / Item Search     : Item Mod Regex
Atlas / Maps               : Map Mod Regex
Atlas / Scarabs            : Scarab Regex
Atlas / Kingsmarch         : Dust Calculator
Atlas / Atlas Tree         : Atlas Tree Planner, Atlas Tree Diff
Jewels / Cluster           : Cluster Jewel Calc
Jewels / Timeless          : Timeless Jewel Calc (with reverse seed search via Web Worker)
Build Planning             : Passive Tree Planner
Leveling / Guide           : Leveling Mode, Leveling Playbook
Leveling / Gems            : Gem Browser, Gem Regex, Gem Planner
Leveling / Vendors         : Vendor Leveling Regex
Leveling / Campaign        : Gem Lookup
Tools / Desktop            : Omnilyth Watcher (live trade WebSocket)
Regex Library              : Saved Patterns
```

---

## 3. PoE-specific hard constraints

These are non-negotiable — code that violates them is wrong, not stylistic.

### Math & data

- **Damage:** `Base × (1 + Increased) × More × Crit × Penetration`
- **EHP:** `Pool × Armor × (1 − Evade) × (1 − Block) × (1 − Suppress)`
- **Conversion order:** Physical → Lightning → Cold → Fire → Chaos
- **Ailments:** Poison/Bleed scale from base hit; Ignite from base + added.
- **Socket / link physics:** body armor, 2H weapons, bows, staves → 6S/6L max. Most other gear → 4S/4L. Rings, amulets, belts, quivers → 0 sockets. Enforced in `src/data/vendorLevelingStats.js`.
- **Regex:** PoE's stash search caps at **250 characters per pattern**. Calculators that can exceed this MUST split into multiple outputs (see Scarab Calculator).

### Visual design tokens (Tailwind)

```
CARDS    : bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4
ACTIVE   : bg-{accent}-500/20 border-2 border-{accent}-500/50 text-{accent}-400
INACTIVE : bg-zinc-800/40 border border-white/[0.04] text-zinc-400
TEXT     : text-white (primary) | text-zinc-400 (secondary) | text-zinc-500 (muted)
ACCENTS  : teal (leveling) | amber (active/selected) | green/red/yellow (status)
```

### PoE color system (non-negotiable)

- **Gem types:** Red (Strength), Green (Dexterity), Blue (Intelligence), White (any).
- **Item rarity:** Normal (white), Magic (blue), Rare (yellow), Unique (brown/orange).
- **Icons:** Always source from `web.poecdn.com` CDN. Never bundle gem/item sprites.

### UX principles

- **10-second scan rule:** every feature must be understandable in 10 seconds with no tutorial.
- **Max 2–3 decisions** to get value from any tool.
- **Alt-tab friendly:** users are mid-PoE-session, not in a focused work context.
- **Anti-patterns:** poe.trade's 40-filter sidebar, PoB's tab maze, modal-in-modal nesting, horizontal scroll at 1366px.

---

## 4. Available agents

All defined in [`.claude/agents/`](./.claude/agents/). Spawn them with the `Agent` tool — don't recreate their prompts inline.

| Agent | Role | Model |
|-------|------|-------|
| **feature-explorer** | Outside-in market intel — Reddit, ninja, GGG forums, competitor tools (awakened-poe-trade, exilence-next, MaxRoll, PoEDB, etc.). Produces a citation-backed feature backlog under `.claude/feature-radar/`. | inherit |
| **ui-architect** | Strategic UI/UX — IA, taxonomy, navigation, page-vs-panel decisions, user journeys, component reuse plans. Outputs a brief, not code. | inherit |
| **ui-designer** | Visual designer — design tokens, hierarchy, spacing, typography, component reuse, dev-ready Tailwind diffs. | inherit |
| **interaction-designer** | Motion + state coverage — loading/empty/error/stale states, animations, choreography, copy-paste feedback, alt-tab survivability. | inherit |
| **accessibility-auditor** | WCAG 2.2 AA — keyboard nav, focus management, screen reader semantics, color contrast, target size, reduced motion compliance. | inherit |
| **poe-expert** | Game mechanics, build theory, calculator validation. Advisory — doesn't write code. | inherit |
| **poe-wiki-oracle** | Research librarian — looks up PoE data (mod tiers, gem stats, uniques, league mechanics, patches) across local data, the KB at `.claude/knowledge/`, and curated wikis. Caches answers. | inherit |
| **calculator-engineer** | Implements PoE math in `src/calculators/`. Combines domain knowledge + JS. | inherit |
| **feature-reviewer** | Ship / Revise / Reject gate for new features. Lean rubric. | haiku |
| **data-curator** | Maintains `src/data/` files (gems, mods, jewels) and `scripts/leveling-data/` pipelines. | inherit |
| **performance-auditor** | Bundle-size + render-cost auditor; flags lazy-import / `useMemo` / Web Worker opportunities. | inherit |
| **build-strategist** | League-start picks, archetype trade-offs, ladder-aware meta reads, budget-tier transitions. Advisory. | inherit |
| **economy-analyst** | Currency strategy, profit/hour, league-phase economy reads, currency divergence detection. Advisory. | inherit |
| **qa-tester** | Manual test playbooks, calculator validation, smoke checklists (no test framework — manual discipline). | inherit |
| **code-archaeologist** | Dead code, duplicated patterns, sibling drift, schema drift, simplification finds. | inherit |
| **release-manager** | CHANGELOG.md, "What's New" posts, version bumps, player-facing voice. | inherit |
| **security-auditor** | XSS, localStorage crypto, CSP, Worker proxy abuse, dep vulns. Standing posture (distinct from `/security-review`). | inherit |

> **poe-expert vs poe-wiki-oracle:** poe-expert reasons from training data ("how does X work"); poe-wiki-oracle fetches and files canonical numbers ("what is X currently"). Use both together when you need both the explanation and the verified value.

> **The four-agent UI/UX team:** `ui-architect` (strategy/IA) → `ui-designer` (visual) + `interaction-designer` (motion/states) + `accessibility-auditor` (a11y). Each owns one altitude. Architect's brief lands first; the other three can audit a route in parallel.

> **`feature-explorer` is upstream of everything UI/UX.** It surfaces *what* to build with citations; `ui-architect` decides *where and how* to build it; the rest of the team executes.

### Skills

| Skill | Use |
|-------|-----|
| **`/calc-new <kebab-name>`** | Scaffolds the canonical 4-file calculator pattern (calc + component + page + registry). Asks for category/route/icon/description if not supplied. Use this *before* writing math — the skill leaves empty signatures and hands off to `poe-expert` + `calculator-engineer` for the actual implementation. |
| **`/explore-features [scope?]`** | Runs a `feature-explorer` sweep across Reddit / ninja / GGG / competitors. Writes ranked candidates to `.claude/feature-radar/`. |
| **`/plan-feature <idea>`** | Full pre-build pipeline: demand validation → IA brief → math feasibility → canonical values → optional scaffold. Stops before implementation. |
| **`/audit-all [scope?]`** | Parallel fan-out: performance + accessibility + code-health + security. Aggregated report. |
| **`/league-refresh <league>`** | New-league pipeline: patch cache → data refresh → meta read → economy baseline → release notes. |
| **`/ship [feature\|current]`** | Final-mile: ship-gate → QA playbook → changelog + version bump. Stops before commit/tag. |
| **`/ui-pass <route\|component>`** | UI/UX deep pass: architect → parallel(visual + motion + a11y). Aggregated fix list. |

See [`AGENTS.md`](./AGENTS.md) for invocation patterns, when to parallelize, and pipeline examples.

---

## 5. Common workflows

### Add a new calculator

1. **Pure logic** in `src/calculators/{name}Calc.js` — no React imports, exportable functions.
2. **Page component** in `src/pages/{Name}Page.jsx` — uses the calculator.
3. **Register** in `src/modules/registry.js`:
   ```js
   {
     id: 'my-calc',
     title: 'My Calculator',
     description: '<10-word value prop>',
     category: 'Crafting' | 'Atlas' | 'Jewels' | 'Leveling' | 'Build Planning' | 'Tools' | 'Regex Library',
     subcategory: '<group>',
     route: '/crafting/my-calc',
     icon: '<icon-key>',
     component: lazy(() => import('../pages/MyPage')),
   }
   ```
4. The route is auto-wired by the registry. No router edits needed.
5. Validate math with `poe-expert`. Run `feature-reviewer` before merging.

### Run locally

```pwsh
npm install         # one-time; postinstall sets up git hooks
npm run dev         # http://localhost:5173 (no auth gate; gate was removed)
npm run build       # production build → dist/
npm run preview     # http://localhost:4173 — preview the prod bundle
```

### Update price data

Prices auto-fetch from poe.ninja with a 24h client cache. Force refresh:

```js
const { refresh } = usePrices(league);
refresh();   // clears cache + re-fetches
```

The active proxy is the Cloudflare Worker (`https://k-genov.workers.dev/`). To switch:

```bash
VITE_PROXY_URL=/api/poe-ninja-proxy            # Vercel
VITE_PROXY_URL=/.netlify/functions/poe-ninja-proxy   # Netlify (legacy)
VITE_PROXY_URL=https://k-genov.workers.dev     # Cloudflare (default)
```

### Use a context

```js
import { useLeague }       from '../contexts/LeagueContext';
import { usePrices }       from '../hooks/usePrices';
import { usePinned }       from '../contexts/PinnedContext';
import { useLevelingMode } from '../contexts/LevelingModeContext';
```

### Update game data

Use the `data-curator` agent. It knows the pipelines under `scripts/leveling-data/`:

- `npm run leveling-data:scrape-wiki` — pull from PoE Wiki
- `npm run leveling-data:scrape-poe` — pull from official PoE
- `npm run leveling-data:merge` — merge multi-source data
- `npm run leveling-data:live` — full live pipeline
- `npm run leveling-data:mock` — uses cached fixtures (no network)

---

## 6. Git & deploy

### Identity (enforced globally; do not change here)

```
Name : EtherealCarnivore
Email: 42915554+EtherealCarnivore@users.noreply.github.com
```

### Workflow

```bash
git push origin master
# → triggers GitHub Actions → builds → publishes to
#   EtherealCarnivore/omnilyth-core-public (gh-pages branch)
```

### Attribution

**Hard rule (from global `~/.claude/CLAUDE.md`):** no `Co-Authored-By: Claude`, no `🤖 Generated with…`. Pass commit messages and PR bodies via HEREDOCs containing only the human content.

---

## 7. Known issues & limitations

- **Bundle size:** `src/data/itemMods.js` is 2.9 MB; `clusterJewelData.json` is 239 KB. Code-split by route is in place but the data files still load on first visit to their pages.
- **Initial load:** ~3s on slow connections. PWA / preloading not yet wired.
- **Browser support:** Chrome 90+, Firefox 88+, Safari 14+. Web Crypto + LocalStorage required.
- **PoE League cycles:** every 3–4 months prices, mods, and league mechanics change. Data needs refresh per league. The default league is hard-set to **Mirage** at the moment (was Standard fallback, removed in `b260cfa`).
- **Watcher (desktop)** is a separate Tauri-style desktop binary; the route in this repo is a marketing/landing surface only.

---

## 8. Quick reference

| Need | Where |
|------|-------|
| Module registry | `src/modules/registry.js` |
| Item mods | `src/data/itemMods.js` (2.9 MB) |
| Cluster jewel notables | `src/data/clusterJewelData.json` |
| Vendor leveling stats | `src/data/vendorLevelingStats.js` |
| Gem availability | `src/data/leveling/gemAvailability.js` |
| poe.ninja proxy | `workers/poe-ninja-proxy.js` |
| Feedback proxy (legacy) | `netlify/functions/github-feedback.js` |
| Encrypted localStorage | `src/utils/secureStorage.js` |
| Input validation | `src/utils/inputValidation.js` |
| GH Actions | `.github/workflows/` |
| Agent definitions | `.claude/agents/` |
| Agent routing logic | `AGENTS.md` |
| Oracle knowledge base | `.claude/knowledge/` |
| Feature radar (outside-in backlog) | `.claude/feature-radar/` |
| Sister PoB knowledge base (cross-project, read-only) | `C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/` |
| Long-form docs | `*_README.md`, `*_SUMMARY.md` files in repo root |

### External

- poe.ninja API: https://poe.ninja/api
- PoE Wiki: https://www.poewiki.net/
- Source repo: https://github.com/EtherealCarnivore/project-omnilyth
- Public deploy repo: https://github.com/EtherealCarnivore/omnilyth-core-public

---

**Last updated:** 2026-05-06 — **Dual-game framing added.** Omnilyth now scopes to both PoE 1 and PoE 2 (Phase 1 of dual-game expansion in progress; targeting May 7 8 PM GMT for shell completion ahead of PoE 2 0.5 announcement). Worker allowlist updated, PoE 2 KB + feature radar seeded, agent prompts game-aware. Phase 2 expansion (same date): added `build-strategist`, `economy-analyst`, `qa-tester`, `code-archaeologist`, `release-manager`, `security-auditor` (17 specialists total) plus 6 orchestration skills. KB seeded with 4 quick-reference + 3 mechanics deep-dives. Phase 1 of agent expansion (same date): `feature-explorer`, `ui-architect`, `interaction-designer`, `accessibility-auditor`; `ui-designer` trimmed to the visual lane.
