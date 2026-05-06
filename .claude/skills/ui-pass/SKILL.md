---
name: ui-pass
description: Full UI/UX deep pass on a single route — sequential ui-architect (if IA might change) → parallel ui-designer + interaction-designer + accessibility-auditor on the same artifact. Aggregated brief with prioritized fix list. Use when the user wants to "make this page actually great" or polish a route end-to-end. Argument: the route or component name ("ui-pass /crafting/fusing" or "ui-pass FilterSidebar").
---

# /ui-pass — full UI/UX deep pass on a route

You are orchestrating the four-agent UI/UX team against a single artifact. The user has invoked: `/ui-pass $ARGUMENTS`.

`$ARGUMENTS` is the route (`/crafting/fusing`) or component name (`FilterSidebar`) under review. If missing, ask once.

---

## Step 1 — locate the artifact

For a route, find it via `src/modules/registry.js`:

```
Grep "route: '<route>'" src/modules/registry.js
```

Then trace to the lazy-imported page, the component(s) it uses, and the calculator(s) under it.

For a component name, `Glob` for the file:

```
Glob "src/components/**/<Name>*.jsx"
```

Read the file(s) so the brief you'll write to each agent is accurate.

---

## Step 2 — ui-architect (sequential — may change scope)

Always run the architect first. Their verdict can rewrite the entire artifact's shape (e.g., "this should be a panel, not a page"), which would invalidate the design / motion / a11y reviews.

```
Agent(
  description: "IA review: <route>",
  subagent_type: "ui-architect",
  prompt: """
    Audit the IA of this existing artifact: <route or component>
    Files:
    <list>

    Decide:
    - Is this in the right place? Right shape (page / panel / modal)?
    - User journey to value — does it pass the ≤3-decision test?
    - Component reuse — could existing components replace any of this?
    - Cross-tool relationships — does it overlap / replace / pair with anything?

    Output the standard architect brief.
  """
)
```

If verdict is `BLOCK` — surface to the user and stop. The IA needs reshaping before the visual pass is worth running.

If verdict is `PROCEED-WITH-CAVEATS` — surface the caveats but proceed. The downstream agents factor them in.

If verdict is `PROCEED` — fire the next step's three agents in parallel.

---

## Step 3 — three auditors in parallel

**One message, three `Agent` tool calls.** They are independent; the only shared input is the artifact + the architect's brief.

```
Agent(
  description: "Visual review: <route>",
  subagent_type: "ui-designer",
  prompt: """
    Visual review of: <route or component>
    Files: <list>
    Architect's brief: <paste — esp. caveats>

    Output the standard ui-designer report — Verdict / What works / Urgent visual issues / Visual issues / UI fixes / Component reuse / Hand-offs / Prioritized action list.
  """
)

Agent(
  description: "Interaction review: <route>",
  subagent_type: "interaction-designer",
  prompt: """
    Interaction + state review of: <route or component>
    Files: <list>
    Architect's brief: <paste>

    Output the standard interaction-designer report — Verdict / State matrix / Motion review / Missing states / Feedback gaps / Choreography / Reduced motion / Hand-offs.
  """
)

Agent(
  description: "Accessibility review: <route>",
  subagent_type: "accessibility-auditor",
  prompt: """
    WCAG 2.2 AA pass on: <route or component>
    Files: <list>
    Architect's brief: <paste>

    Output the standard accessibility-auditor report — Verdict / Score table / Findings / Cross-cutting patterns / Hand-offs / Test playbook / Baseline.
  """
)
```

All three return concurrently. Read each.

---

## Step 4 — aggregate

Synthesize into one cross-cutting brief. Don't paste all three reports verbatim.

```markdown
# /ui-pass summary — <artifact> — <date>

## Architect's call
<verdict + IA placement + journey — one paragraph>

## Top-line health

|                       | Verdict          |
|-----------------------|------------------|
| IA (ui-architect)     | PROCEED / CAVEATS / BLOCK |
| Visual (ui-designer)  | A–F grade |
| Interaction (interaction-designer) | SHIP / POLISH / REWORK |
| Accessibility         | PASS / FIX-MAJOR / FIX-CRITICAL |

**Overall:** <one sentence — is this route ready, polish-needed, or rework-needed.>

## Critical / blocking
- [A11Y-CRITICAL] <one-line>
- [INTERACTION-MISS] <one-line — missing required state>
- ...

## Cross-cutting patterns
If a single root cause was flagged by 2+ agents:

```
PATTERN  : <component / element>
FLAGGED  : <agents>
ROOT     : <suspected shared root>
FIX      : <one fix that resolves all flagged surfaces>
```

These are the highest-leverage changes — single fix, multi-agent value.

## Prioritized action list

| # | Source | Action | Impact | Effort |
|---|--------|--------|--------|--------|
| 1 | a11y | Add aria-label to search button | H | L |
| 2 | interaction | Design loading state for filter results | H | M |
| 3 | visual | Tighten card padding from p-4 to p-6 | M | L |
| ... |

Ranked by impact-per-effort across all three reports.

## Hand-offs

If any auditor flagged work outside the UI/UX team:

```
calculator-engineer : <math / data prop need from a state issue>
performance-auditor : <render-cost issue surfaced by the audit>
data-curator        : <data file issue surfaced>
```

## Per-auditor reports

For full detail — full reports from each of the four agents.
```

---

## Step 5 — recommend the order of fixes

Different fix types have different costs:

```
1. Land Critical a11y fixes first (single-PR, low effort, high blocking).
2. Interaction-designer's missing-state fixes (medium effort, high impact).
3. Visual polish from ui-designer (low effort, medium impact).
4. Architect's caveats (highest scope — last, after the above land).
```

End the turn with this fix sequence. The user picks where to start.

---

## Hard rules

- **Architect first, sequential.** IA can rewrite the artifact; visual / motion / a11y reviews are wasted if the artifact is about to be reshaped.
- **Three-way parallel for the rest.** Visual, motion, a11y are independent lenses on the same artifact.
- **Don't duplicate findings.** If both ui-designer and accessibility-auditor flag the same low-contrast issue, surface as one cross-cutting pattern.
- **Don't fix during the pass.** This skill audits and aggregates. Fixes happen in follow-up edits.
- **Re-run after fixes.** The user lands the fixes; they re-invoke `/ui-pass <route>` to confirm green.
