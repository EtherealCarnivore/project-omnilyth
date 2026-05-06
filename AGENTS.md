# AGENTS.md — Project Omnilyth Agent Routing

**This is the dispatch table.** When you start a task in this repo, route it through here before reaching for the generic `general-purpose` agent or writing a long inline prompt. The agents below encode taste the user has already validated.

Pair with [`CLAUDE.md`](./CLAUDE.md) (project context) and [`.claude/agents/`](./.claude/agents/) (agent definitions).

**Dual-game note (2026-05-06):** Omnilyth is now a PoE 1 + PoE 2 toolkit. The 4 most game-sensitive agents (`poe-expert`, `poe-wiki-oracle`, `data-curator`, `calculator-engineer`) carry game-scope sections in their prompts. **Always specify which game** a task targets. Default-assume PoE 1 only when context is unambiguously PoE 1. See `CLAUDE.md` §0.5 for the dual-game architecture summary.

---

## TL;DR — pick by trigger phrase

| User says... | Use agent |
|--------------|-----------|
| "what should we build next / what are players asking for / scout the community / what does <competitor> have" | **feature-explorer** |
| "where should this live / how do we organize / IA audit / one page or two / user journey" | **ui-architect** |
| "review the visual / fix the layout / on-brand / make this look right" | **ui-designer** |
| "make this feel responsive / loading state / empty state / motion / hover feedback / polish the interaction" | **interaction-designer** |
| "is this accessible / WCAG / keyboard nav / screen reader / contrast" | **accessibility-auditor** |
| "what build should I play / league-start picks / meta read / tier list / boss-killer vs mapper" | **build-strategist** |
| "what's worth farming / currency strategy / week-1 economy / is X about to crash" | **economy-analyst** |
| "QA this / smoke test / manual test plan / validate the output / browser check / regression playbook" | **qa-tester** |
| "find dead code / what can we delete / find drift / over-engineered / unused exports / make this simpler" | **code-archaeologist** |
| "draft release notes / what's new / update the changelog / version bump / patch notes" | **release-manager** |
| "security audit / check for XSS / dep audit / is this safe / CSP review / proxy review" | **security-auditor** |
| "implement / port / write the calculator" | **calculator-engineer** |
| "is the math right / validate the math / PoE-correct" | **poe-expert** |
| "explain the mechanic / how does X work in PoE" | **poe-expert** |
| "look it up / fetch from wiki / what's the current tier / find the data on…" | **poe-wiki-oracle** |
| "is this ready to ship / ship-check / gate this" | **feature-reviewer** |
| "update / refresh / scrape data / new league data" | **data-curator** |
| "audit performance / bundle / why is this slow" | **performance-auditor** |
| "where is X / find every usage of Y" (3+ rounds) | **Explore** (built-in) |
| "plan how to do X" (multi-step, risky) | **Plan** (built-in) |

**poe-expert vs poe-wiki-oracle — pick one (or both):**

| | poe-expert | poe-wiki-oracle |
|---|---|---|
| Source | Training-data reasoning | Local data + KB + wiki/poedb fetches |
| Output | Mechanics explanations, formulas, build advice | Citation-backed numbers, tier ranges, stat lines |
| Writes files? | No | Yes — caches answers under `.claude/knowledge/` |
| Use when | "How does poison scale?" | "What's the current poison-on-hit chance from Caustic Cloud?" |

**The four-agent UI/UX team — pick by altitude:**

| | ui-architect | ui-designer | interaction-designer | accessibility-auditor |
|---|---|---|---|---|
| Altitude | Strategy | Visual | Motion + states | A11y |
| Owns | IA, taxonomy, page-vs-panel, journeys | Tokens, hierarchy, spacing, typography | Loading/empty/error/stale, animation, feedback | WCAG, keyboard, screen reader, contrast |
| Output shape | Brief (no code) | Tailwind diff | State matrix + transition classes | A11y report with file:line + diff |
| Use when | "Where does this live?" | "Polish the visuals" | "Make it feel responsive" | "Audit a11y" |

**`feature-explorer` is upstream of the entire UI/UX team** — it surfaces *demand evidence* (with citations) for what to build; the four-agent team takes that evidence and turns it into a shipped feature.

---

## The roster (17 specialists + built-ins)

### Project agents (under `.claude/agents/`)

| Agent | Role | Model | Writes code? | Color |
|-------|------|-------|--------------|-------|
| **feature-explorer** | Outside-in market intel — Reddit, ninja, GGG forums, competitor tools. Produces ranked feature backlog under `.claude/feature-radar/`. | inherit | Yes (radar files only) | magenta |
| **ui-architect** | Strategic UI/UX — IA, taxonomy, page-vs-panel, navigation, user journeys. Outputs a brief, not a diff. | inherit | No (briefs only) | indigo |
| **ui-designer** | Visual designer — tokens, hierarchy, spacing, typography, component reuse, dev-ready Tailwind diffs | inherit | Yes (CSS only) | cyan |
| **interaction-designer** | Motion + state coverage — loading/empty/error/stale, animations, feedback, choreography | inherit | Yes (CSS + small JSX) | pink |
| **accessibility-auditor** | WCAG 2.2 AA — keyboard, focus, screen reader, contrast, target size, reduced motion | inherit | Yes (a11y fixes) | emerald |
| **poe-expert** | Game mechanics, math validation, build/atlas/crafting strategy | inherit | No (advisory) | orange |
| **poe-wiki-oracle** | Research librarian — looks up PoE data in local files, KB, wiki, poedb. Caches answers under `.claude/knowledge/`. | inherit | Yes (KB only) | yellow |
| **calculator-engineer** | Implements PoE math in JS; owns the calc → page → registry pattern | inherit | Yes | purple |
| **feature-reviewer** | Lean ship/revise/reject gate for new features | haiku | No (review only) | amber |
| **data-curator** | Maintains `src/data/` files and `scripts/leveling-data/` pipelines | inherit | Yes (data + scripts) | green |
| **performance-auditor** | Bundle-size & render-cost auditor; identifies lazy-import / useMemo / Web Worker fixes | inherit | Yes (perf fixes) | red |
| **build-strategist** | League-start picks, archetype trade-offs, meta reads, ladder-aware build advice | inherit | No (advisory) | sky |
| **economy-analyst** | Currency strategy, profit/hour, league-phase economy reads, currency divergence | inherit | No (advisory) | lime |
| **qa-tester** | Manual test playbooks, calculator validation, smoke checklists (no test framework) | inherit | Yes (docs/qa/ files only) | slate |
| **code-archaeologist** | Dead code, duplicated patterns, sibling drift, schema drift, over-abstraction | inherit | Yes (cleanup edits) | stone |
| **release-manager** | CHANGELOG.md, "What's New" posts, version bumps, player-facing release voice | inherit | Yes (changelog + package.json) | violet |
| **security-auditor** | XSS, localStorage crypto, CSP, Worker proxy abuse vectors, dep vulns, Web Crypto | inherit | Yes (security fixes) | rose |

### Built-in agents (always available, no config needed)

| Agent | When to use |
|-------|-------------|
| **Explore** | Open-ended "where is X / which files reference Y" questions, when 3+ Glob/Grep rounds are needed. Read-only, fast. |
| **Plan** | Designing multi-step implementation plans before doing risky / multi-file work. |
| **general-purpose** | Multi-step tasks that span domains and don't fit a specialist. Use sparingly — if a specialist exists, prefer it. |

---

## How to invoke

Use the `Agent` tool. The frontmatter `name` is what you pass to `subagent_type`:

```
Agent(
  description: "Validate fusing math",
  subagent_type: "poe-expert",
  prompt: "<self-contained brief — the agent has zero context from this conversation>"
)
```

Each agent has tools restricted in its frontmatter. You don't need to specify tools at the call site; the frontmatter governs.

---

## Pipelines — common multi-agent flows

### Discovering what to build next (cold start)

```
1. feature-explorer      → sweeps Reddit / ninja / competitor tools / GGG forums
                           → writes ranked candidates to .claude/feature-radar/
2. (user)                → picks 1–3 candidates worth pursuing
3. ui-architect          → for each pick, decides IA: page or panel? where? user journey?
4. (resume "new calculator" pipeline below for each green-lit candidate)
```

### Adding a new calculator (full flow)

```
0. /calc-new <name>      → scaffolds the 4 files + registry entry (skill, not agent)
1. ui-architect          → confirms IA placement: category, route, sidebar, journey, reuse plan
2. poe-expert            → "How does mechanic X work? What's the formula? Edge cases?"
3. poe-wiki-oracle       → "Pull the current values, tier ranges, edge-case tables I'll need."
                           (Caches the lookup so future calc work doesn't refetch.)
4. calculator-engineer   → fills in the calculator body with the actual math
5. poe-expert            → validates outputs against real PoE values for 3-5 test cases
6. ui-designer           → reviews the page visually against design tokens
7. interaction-designer  → designs loading/empty/error/stale states + motion + feedback
8. accessibility-auditor → WCAG 2.2 AA pass: keyboard, focus, screen reader, contrast
9. performance-auditor   → confirms the new tool didn't add eager data imports / oversized chunks
10. feature-reviewer     → final SHIP/REVISE/REJECT gate
11. (user)               → merges
```

The user runs the orchestration. You as the assistant shouldn't auto-fire all 10 — call them as warranted.

### Full UI/UX pass on a single route

When the user says "make this page actually great" on an existing route:

```
1. ui-architect          → audit IA: is this in the right place? right shape? journey clean?
2. ui-designer           → visual pass: tokens, hierarchy, component reuse, Tailwind diffs
3. interaction-designer  → state matrix: loading/empty/error/stale + motion budget + feedback gaps
4. accessibility-auditor → WCAG 2.2 AA report with severity-ranked findings + diffs
5. (user)                → merges fixes; re-run feature-reviewer if the changes are non-trivial
```

Steps 2, 3, 4 can run **in parallel** — they audit the same artifact from different lenses. Step 1 should land first because it can change the artifact's shape entirely (e.g., "this should be a panel inside another page").

### Refreshing data for a new league

```
1. poe-wiki-oracle       → confirm what changed in the patch (read patch notes,
                           cache the summary so data-curator + others reuse it)
2. data-curator          → runs scrape, regenerates files, spot-checks
3. calculator-engineer   → if the data shape changed, updates consumers
4. (user)                → smoke-tests in dev, commits
```

### Investigating "is this calculator value correct?"

```
1. poe-wiki-oracle       → fetch the canonical value from poedb / wiki / patch notes
                           with citations + cache it
2. poe-expert            → reason about whether the calc's *interpretation* is correct
                           given the real value
3. calculator-engineer   → implement the fix
```

### Fixing a bug report ("this calculator gives wrong results")

```
1. poe-expert            → confirm what the *correct* answer should be
2. calculator-engineer   → locate the bug, fix, verify
3. (poe-expert again)    → second-pass validation on the fix
```

---

## Parallelism

When tasks are **independent**, fire agents in parallel by sending one message with multiple `Agent` tool calls:

✅ **Parallel:** "audit the design (`ui-designer`) AND validate the math (`poe-expert`)" — separate domains, no shared state.

✅ **Parallel:** UI/UX deep pass on a single route — `ui-designer` + `interaction-designer` + `accessibility-auditor` all audit the same artifact through different lenses. Run after `ui-architect` if the IA might change.

✅ **Parallel:** when reviewing 3 different new pages with `feature-reviewer`, spawn 3 agents at once.

✅ **Parallel:** `feature-explorer` against multiple scopes — fire 3 explorers in parallel for "crafting tools landscape", "leveling tools landscape", "atlas tools landscape" if you want a broad sweep fast.

❌ **Sequential:** "fix the bug then review it" — the second depends on the first.

❌ **Sequential:** `ui-architect` before `ui-designer` — architecture decisions can rewrite the visual scope.

---

## When NOT to use an agent

- **Single small known edit** (e.g., fix a typo in a string): just edit the file. Spawning an agent costs more than the edit.
- **Lookup with a known target** (e.g., "show me `src/calculators/fusingCalc.js`"): just `Read` it.
- **Quick math sanity check** (e.g., "what's 1500 × 1.2"): do it inline, don't burn an agent.

The agent overhead is real (full context init, separate tool budget). Use them when the task genuinely benefits from a specialist's framing or when the work is large enough to amortize the overhead.

---

## Project skills (slash commands under `.claude/skills/`)

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **`/calc-new <kebab-name>`** | `/calc-new fusing-redux` | Scaffolds the canonical 4-file calculator pattern (calc + component + page + registry entry). Asks for category/subcategory/route/icon/description if not supplied, generates empty signatures, hands off to `poe-expert` → `calculator-engineer` for the math. |
| **`/explore-features [scope?]`** | `/explore-features crafting tools` | Runs a `feature-explorer` sweep against PoE community + competitor tools; writes ranked candidates to `.claude/feature-radar/`. |
| **`/plan-feature <idea>`** | `/plan-feature live-currency-divergence-detector` | Full pre-build pipeline: feature-explorer (validate demand) → ui-architect (IA brief) → poe-expert + poe-wiki-oracle (math + canonical values, parallel) → optional `/calc-new` scaffold. Stops before implementation. |
| **`/audit-all [scope?]`** | `/audit-all` or `/audit-all leveling` | Parallel fan-out: performance-auditor + accessibility-auditor + code-archaeologist + security-auditor; aggregated cross-cutting health summary. |
| **`/league-refresh <league>`** | `/league-refresh Necropolis` | Sequential league-launch pipeline: oracle (cache patch summary) → data-curator (refresh data) → parallel(build-strategist meta + economy-analyst baseline) → release-manager (player-facing post). |
| **`/ship [feature \| current]`** | `/ship cluster-jewel-enchant-filter` | Final-mile: feature-reviewer (gate) → qa-tester (smoke playbook) → release-manager (changelog + version bump). Stops before commit/tag. |
| **`/ui-pass <route\|component>`** | `/ui-pass /crafting/fusing` | UI/UX deep pass: ui-architect (sequential) → parallel(ui-designer + interaction-designer + accessibility-auditor); aggregated prioritized fix list. |

Skills load only when the user types `/<skill-name>`. They're for repetitive scaffolding and orchestration the user invokes on demand — distinct from agents (which are spawned via the `Agent` tool for delegated reasoning).

---

## Hooks (under `~/.claude/settings.json`)

| Hook | Event | What it does |
|------|-------|--------------|
| **`block-attribution.js`** | `PreToolUse` (matcher: `Bash`) | Inspects every Bash command before it runs. If the command is `git commit` / `gh pr create` / `gh issue comment` / similar **and** the message contains `Co-Authored-By: Claude`, `🤖 Generated with [Claude Code]`, `noreply@anthropic.com`, etc., the hook blocks the call (exit 2) with stderr explaining why. |

The hook is global (lives in `~/.claude/settings.json`) so it protects every project, not just Omnilyth. To inspect or modify: `~/.claude/hooks/block-attribution.js`. To run its self-tests: `node ~/.claude/hooks/test-fixtures/run-tests.js`.

---

## Custom analysis prompts (not agents)

Some prompts are stored as plain `.md` files for ad-hoc use:

| Prompt | Path | Purpose |
|--------|------|---------|
| Transcript Analyzer | [`transcripts/analysis-prompt.md`](./transcripts/analysis-prompt.md) | Extracts speedrun intelligence from PoE stream `.srt` transcripts. Feed alongside the transcript file as a system/user prompt. |

Outputs from prior runs:
- [`transcripts/lightning-arrow-ranger-analysis.md`](./transcripts/lightning-arrow-ranger-analysis.md) — act-by-act breakdown with IF/THEN/BECAUSE heuristics.

---

## Adding or changing an agent

1. Create / edit a Markdown file in `.claude/agents/{name}.md`.
2. **Frontmatter** must include: `name`, `description`, `model` (`inherit` / `sonnet` / `haiku` / `opus`), `tools` (comma-separated). `color` is optional.
3. The `description` is what Claude uses to decide whether to dispatch — write it as **trigger criteria**, not a job description. Include the phrases the user is likely to say.
4. The body is the system prompt. With Opus 4.7's 1 M context, **don't pre-compress at the cost of clarity** — write enough that the agent's behavior is unambiguous on its own.
5. Update this file (`AGENTS.md`) with the new entry in the roster table.
6. Tools should be the *minimum* set the agent needs. An advisory agent with `Edit` access will eventually edit something it shouldn't.

---

## Model selection guide

| Task type | Model | Why |
|-----------|-------|-----|
| Domain knowledge / math validation | `inherit` | Knowledge is in training data; ride parent (Opus 4.7). |
| Design judgment / aesthetic review | `inherit` | Needs taste; parent already has it. |
| Structured rubric / decision gate | `haiku` | Clear criteria, structured output, fast + cheap. |
| Multi-step implementation | `inherit` | Depends on parent — Opus 4.7 is fine. |
| Heavy reasoning (architecture trade-offs, formal analysis) | `opus` (explicit) | Only when you really need the heavy hitter and the parent is on something smaller. |
| Quick search / locate / grep | `haiku` (or no agent — direct tool) | Don't pay for reasoning that isn't needed. |

Default to `inherit` and override only when there's a clear reason. With Opus 4.7 + 1 M context as the parent, "inherit" is usually the right call.

---

**Last updated:** 2026-05-06 — **Dual-game framing.** 4 game-sensitive agents carry explicit PoE 1 / PoE 2 scope sections; PoE 2 KB seeded at `.claude/knowledge/poe2/`; PoE 2 feature radar seeded at `.claude/feature-radar/poe2/`. Phase 2 expansion (same date): added `build-strategist`, `economy-analyst`, `qa-tester`, `code-archaeologist`, `release-manager`, `security-auditor` (17 specialists total) and 6 orchestration skills. Knowledge base seeded with 4 quick-reference + 3 mechanics deep-dives. Phase 1 (2026-05-06): `feature-explorer`, `ui-architect`, `interaction-designer`, `accessibility-auditor`.
