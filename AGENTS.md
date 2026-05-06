# AGENTS.md — Project Omnilyth Agent Routing

**This is the dispatch table.** When you start a task in this repo, route it through here before reaching for the generic `general-purpose` agent or writing a long inline prompt. The agents below encode taste the user has already validated.

Pair with [`CLAUDE.md`](./CLAUDE.md) (project context) and [`.claude/agents/`](./.claude/agents/) (agent definitions).

---

## TL;DR — pick by trigger phrase

| User says... | Use agent |
|--------------|-----------|
| "implement / port / write the calculator" | **calculator-engineer** |
| "is the math right / validate the math / PoE-correct" | **poe-expert** |
| "explain the mechanic / how does X work in PoE" | **poe-expert** |
| "look it up / fetch from wiki / what's the current tier / find the data on…" | **poe-wiki-oracle** |
| "review / audit the UI / make this look right" | **ui-designer** |
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

---

## The roster (7 specialists + built-ins)

### Project agents (under `.claude/agents/`)

| Agent | Role | Model | Writes code? | Color |
|-------|------|-------|--------------|-------|
| **poe-expert** | Game mechanics, math validation, build/atlas/crafting strategy | inherit | No (advisory) | orange |
| **poe-wiki-oracle** | Research librarian — looks up PoE data in local files, KB, wiki, poedb. Caches answers under `.claude/knowledge/`. | inherit | Yes (KB only) | yellow |
| **calculator-engineer** | Implements PoE math in JS; owns the calc → page → registry pattern | inherit | Yes | purple |
| **ui-designer** | Design-token enforcement, UX heuristic audits, dev-ready Tailwind fixes | inherit | Yes (CSS only) | cyan |
| **feature-reviewer** | Lean ship/revise/reject gate for new features | haiku | No (review only) | amber |
| **data-curator** | Maintains `src/data/` files and `scripts/leveling-data/` pipelines | inherit | Yes (data + scripts) | green |
| **performance-auditor** | Bundle-size & render-cost auditor; identifies lazy-import / useMemo / Web Worker fixes | inherit | Yes (perf fixes) | red |

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

### Adding a new calculator (full flow)

```
0. /calc-new <name>      → scaffolds the 4 files + registry entry (skill, not agent)
1. poe-expert            → "How does mechanic X work? What's the formula? Edge cases?"
2. poe-wiki-oracle       → "Pull the current values, tier ranges, edge-case tables I'll need."
                           (Caches the lookup so future calc work doesn't refetch.)
3. calculator-engineer   → fills in the calculator body with the actual math
4. poe-expert            → validates outputs against real PoE values for 3-5 test cases
5. ui-designer           → reviews the page against design tokens
6. performance-auditor   → confirms the new tool didn't add eager data imports / oversized chunks
7. feature-reviewer      → final SHIP/REVISE/REJECT gate
8. (user)                → merges
```

The user runs the orchestration. You as the assistant shouldn't auto-fire all 5 — call them as warranted.

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

❌ **Sequential:** "fix the bug then review it" — the second depends on the first.

✅ **Parallel:** when reviewing 3 different new pages with `feature-reviewer`, spawn 3 agents at once.

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

Skills load only when the user types `/<skill-name>`. They're for repetitive scaffolding the user invokes on demand — distinct from agents (which are spawned via the `Agent` tool for delegated reasoning).

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

**Last updated:** 2026-05-06
