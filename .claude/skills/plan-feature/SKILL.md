---
name: plan-feature
description: Run the full pre-build feature-planning pipeline — feature-explorer (validates demand) → ui-architect (IA brief) → poe-expert + poe-wiki-oracle (math feasibility + canonical values) → /calc-new scaffold (if green-lit). Stops before implementation; hands off to calculator-engineer + the UI/UX team. Use when the user wants to take a feature idea from concept to "ready-to-build" without skipping the feasibility checks. Argument: the feature name or radar candidate ID.
---

# /plan-feature — full pre-build feature-planning pipeline

You are orchestrating a multi-agent sequence that takes a feature *idea* and produces a *ready-to-build plan*. The user has invoked: `/plan-feature $ARGUMENTS`.

`$ARGUMENTS` is the feature name (kebab-case or quoted human title), or a radar candidate ID like `live-currency-divergence-detector`.

---

## Step 1 — locate the idea

Look for the feature in this order:

1. **`.claude/feature-radar/candidates/<slug>.md`** — already in the radar with evidence.
2. **`.claude/feature-radar/delta/<slug>.md`** — competitor-coverage gap.
3. **Free-form text** — user typed a concept that's not in the radar.

If found in the radar, **read it whole** — frontmatter, evidence, competitor coverage. That context shapes every downstream agent's brief.

If not in the radar, run a quick demand check via `feature-explorer`:

```
Agent(
  description: "Feature demand check: <name>",
  subagent_type: "feature-explorer",
  prompt: "Quick demand validation for: <description>. Don't sweep broadly — check if this is in the radar already, then validate demand against r/pathofexile + ninja in 1–2 fetches. If demand is weak, say so and stop. If reasonable, write a candidate file and proceed."
)
```

If the demand check returns weak signal, **stop the pipeline** and surface to the user: "Demand for this is thin (X mentions, Y upvotes). Want to proceed anyway, or refine the idea?"

---

## Step 2 — IA brief (architecture)

Spawn `ui-architect` with the radar candidate as context:

```
Agent(
  description: "IA brief for <feature name>",
  subagent_type: "ui-architect",
  prompt: """
    Decide IA placement for this feature: <description>.

    Radar evidence (if available):
    <paste candidate file contents>

    Registry context:
    <paste src/modules/registry.js compressed>

    Output the standard IA brief — Decision / IA placement / Journey / Reuse plan / Cross-tool relationships / Open questions / Risks / Verdict.
  """
)
```

If the architect's verdict is `BLOCK`, **stop the pipeline** and surface the blocker to the user.

If `PROCEED-WITH-CAVEATS`, surface the caveats and ask the user before continuing.

---

## Step 3 — math feasibility

In parallel, spawn `poe-expert` and `poe-wiki-oracle` with the architect's brief:

```
Agent(
  description: "Math feasibility for <feature>",
  subagent_type: "poe-expert",
  prompt: """
    Architect proposes building: <feature>.
    IA brief:
    <paste architect output>

    Answer:
    1. Is the math tractable? Closed-form, Monte Carlo, or empirical-table?
    2. What are the formulas the calculator must implement?
    3. What edge cases must it handle? (corrupted, 0/max boundaries, base-type-specific behavior, etc.)
    4. What test cases (3–5) should the calculator pass to be considered correct?
    5. Any noob-traps or bugs other PoE tools commonly get wrong here?

    Don't write code. Output the math contract.
  """
)
```

```
Agent(
  description: "Canonical values for <feature>",
  subagent_type: "poe-wiki-oracle",
  prompt: """
    Architect proposes building: <feature>.
    IA brief:
    <paste architect output>

    Pull and cache the canonical PoE values this calculator will need to hardcode or display:
    - Tier ranges, mod text, unique stat lines as relevant.
    - Save the lookup to .claude/knowledge/cached/ so future calc work doesn't refetch.

    Return: the values + their citation paths (cached file, src/data/ path, or wiki URL + date).
  """
)
```

Both agents return; collect the math contract + the canonical-values cache reference.

---

## Step 4 — scaffold (only if green-lit)

If steps 2 and 3 pass cleanly, **ask the user** before scaffolding:

> "All checks passed. Architect's brief, math contract, and canonical values are ready. Scaffold the calculator now via `/calc-new <kebab-name>`?"

If yes, run `/calc-new` with the kebab-case name.

If no, stop. The plan is in the user's hands.

---

## Step 5 — handoff package

End the turn with a single artifact: a markdown handoff package the user (or the next session) can paste into a TODO:

```markdown
# Plan: <Feature Name>

## Demand
<one paragraph from feature-explorer or "user-typed, not yet validated">

## IA brief (ui-architect)
<paste architect's verdict + IA placement + journey>

## Math contract (poe-expert)
<paste math + edge cases + test cases>

## Canonical values (poe-wiki-oracle)
- Cached at: <.claude/knowledge/cached/<file>.md>
- Source: <wiki URL + date>

## Next steps
1. /calc-new <kebab-name>   — scaffold (4 files + registry entry)
2. calculator-engineer       — implement the math against the contract above
3. poe-expert                — validate output against the test cases
4. ui-designer + interaction-designer + accessibility-auditor — UI pass (parallel)
5. performance-auditor       — bundle-size sanity check
6. feature-reviewer          — ship gate
7. qa-tester                 — manual playbook
8. release-manager           — changelog entry on merge
```

---

## Hard rules

- **Stop on `BLOCK`.** If the architect blocks, surface and stop. Don't push past architectural objections.
- **Stop on weak demand.** If feature-explorer can't find demand, surface and stop. Don't build into a vacuum.
- **Don't auto-scaffold.** Always ask before `/calc-new`. The plan is the deliverable; building is a separate decision.
- **Run parallel where possible.** Step 3's two agents are independent — fire them in one message.
- **Cite everything.** The handoff package must reference radar candidate file, architect verdict, oracle cache path, and patch / wiki dates.
