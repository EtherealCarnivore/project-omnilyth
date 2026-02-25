# Agents & Custom Prompts Registry

All reusable agents and analysis prompts for Project Omnilyth.

---

## Project-Specific Agents

| Agent | Model | Size | Purpose |
|-------|-------|------|---------|
| **PoE Expert** | sonnet | ~1.5K | Game mechanics, build theory, crafting, calculator validation |
| **UX/UI Designer** | sonnet | ~2.5K | Design system enforcement, UX audits, implementation-ready fixes |
| **Feature Reviewer** | haiku | ~1.8K | Ship/revise/reject gate for new features |

### PoE Expert

**File:** `.claude/agents/poe-expert.yaml`
**Model:** sonnet (game knowledge is in training data, doesn't need opus)
**Invocation:** "Using poe-expert:" or "Ask poe-expert:"

Covers: damage calculations, crafting strategy, build planning, tool usage (PoB, poe.ninja, regex), economy, atlas optimization, gem setups, vendor recipes.

### UX/UI Designer

**File:** `.claude/agents/ux-ui-designer.md`
**Model:** sonnet (needs design judgment but compressed prompt is sufficient)
**Usage:** Provide `UI_EVIDENCE` and `REQUEST`. Project context loads from CLAUDE.md.

Covers: design system enforcement (zinc-900/60 glass-cards, teal/amber accents), PoE visual constraints, component inventory awareness, heuristic audit, mobile/responsive, implementation notes.

### Feature Reviewer

**File:** `.claude/agents/feature-reviewer.md`
**Model:** haiku (structured evaluation with clear rubric — smaller model handles well)
**Usage:** Provide `FEATURE_DESCRIPTION` and `UI_EVIDENCE`. Gets ship/revise/reject verdict.

Covers: gate decision, 10-second scan test, minimum shippable version, implementation fixes, nav placement. Intentionally lean — delegates deep audits to UX/UI Designer.

---

## Custom Analysis Prompts

| Prompt | Purpose | File |
|--------|---------|------|
| **Transcript Analyzer** | Extract speedrunning intelligence from PoE stream transcripts | [`transcripts/analysis-prompt.md`](transcripts/analysis-prompt.md) |

### Transcript Analyzer

**File:** `transcripts/analysis-prompt.md`
**Usage:** Feed as system/user prompt alongside an SRT transcript file.

Extracts: route decisions, XP manipulation, gear acquisition, gem timing, boss strategies, currency management. Outputs act-by-act breakdown with IF/THEN/BECAUSE heuristics.

**Produced:** [`transcripts/lightning-arrow-ranger-analysis.md`](transcripts/lightning-arrow-ranger-analysis.md)

---

## Model Selection Guide

| Task Type | Model | Why |
|-----------|-------|-----|
| Game mechanics / domain knowledge | sonnet | Knowledge is in training data, just needs persona |
| Design review / UX judgment | sonnet | Needs aesthetic judgment but prompt is compressed |
| Gate review / structured rubric | haiku | Clear criteria, structured output, fast + cheap |
| Deep architectural decisions | opus | Only when complex trade-offs need exploration |
| Code implementation | opus/sonnet | Depends on complexity |

---

## How to Add a New Agent

1. Create `.yaml` or `.md` in `.claude/agents/`
2. Add model recommendation comment at top
3. Keep prompt under 2K tokens — compress, don't enumerate
4. Update this file with the new entry
