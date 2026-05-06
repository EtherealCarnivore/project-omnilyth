---
name: audit-all
description: Parallel fan-out — fires performance-auditor, accessibility-auditor, code-archaeologist, and security-auditor against the current state of the repo, then aggregates the four reports into one cross-cutting health summary. Use before a release, after a big merge, or when the user asks "are we healthy". Optional argument scopes the audit to a path or feature ("audit-all src/components/atlas" or "audit-all leveling").
---

# /audit-all — parallel multi-axis health audit

You are orchestrating four auditors in parallel. The user has invoked: `/audit-all $ARGUMENTS`.

`$ARGUMENTS` is optional. If empty, the audit is **whole-repo**; if a path or feature name, the audit is scoped.

---

## Step 1 — establish the scope

Three scope shapes:

| Argument | Scope |
|---|---|
| empty | Whole repo. |
| path (`src/components/atlas/`, `src/data/`) | Path-scoped audit. |
| feature / tool name (`leveling`, `fusing`, `cluster-jewel`) | Feature-scoped — find the relevant files via `src/modules/registry.js` and pass that path to each auditor. |

If the scope is unclear, ask once. Then proceed.

---

## Step 2 — fire the four auditors in parallel

**One message, four `Agent` tool calls.** They are independent; the only shared input is the scope.

```
Agent(
  description: "Performance audit",
  subagent_type: "performance-auditor",
  prompt: "Run a full performance audit scoped to: <scope>. Output the standard report — verdict / bundle snapshot / findings / quick wins / deferred / baseline."
)

Agent(
  description: "Accessibility audit",
  subagent_type: "accessibility-auditor",
  prompt: "Run a WCAG 2.2 AA pass scoped to: <scope>. Output the standard report — verdict / score table / findings / cross-cutting patterns / hand-offs / test playbook / baseline."
)

Agent(
  description: "Code-health audit",
  subagent_type: "code-archaeologist",
  prompt: "Run a code-health audit scoped to: <scope>. Output the standard report — verdict / findings ranked by impact-per-effort / sibling-pair drift / quick wins / deferred."
)

Agent(
  description: "Security audit",
  subagent_type: "security-auditor",
  prompt: "Run the standing security pass scoped to: <scope>. Output the standard report — verdict / surface scorecard / findings / dep-audit summary / standing-posture statement."
)
```

All four return concurrently. Read each report.

---

## Step 3 — aggregate the four reports

Produce one cross-cutting summary. Don't paste all four reports verbatim — the user will scroll past. Synthesize.

### Aggregated output format

```markdown
# /audit-all summary — <date> — scope: <scope>

## Top-line health

|                       | Verdict          |
|-----------------------|------------------|
| Performance           | PASS / WATCH / ACTION |
| Accessibility         | PASS / FIX-MAJOR / FIX-CRITICAL |
| Code health           | CLEAN / SIMPLIFY / DRIFT |
| Security              | PASS / HARDEN / CRITICAL |

**Overall:** <one sentence — is the repo healthy, watch-list, or action-required.>

## Critical / blocking (if any)

For each Critical-severity finding from any auditor:

- [SECURITY-CRITICAL] <one-line>
- [A11Y-CRITICAL] <one-line>
- ...

These block ship. The full report is in §3.

## Cross-cutting patterns

If two or more auditors flagged the same surface (e.g., performance + a11y both flagged a render-storm component), call it out:

```
PATTERN  : <component / file>
FLAGGED  : <auditors>
ROOT     : <suspected shared root cause>
FIX      : <one fix that resolves all flagged surfaces>
```

This is the most valuable section — single-fix, multi-auditor wins.

## Quick wins (≤ 30 min each)

A merged list across the four auditors, ranked by impact-per-effort:

```
1. [PERF] Lazy-load itemMods in ItemModRegexPage           (file:line, ~15 min)
2. [A11Y] Add aria-label to QuickSearchModal close button (file:line, ~5 min)
3. [CODE] Delete BlanchingCalculator dead-export branch    (file:line, ~5 min)
4. [SEC]  Tighten Worker connect-src to api.omnilyth.app   (file:line, ~10 min)
```

The user can land these in one PR.

## Deferred (needs design conversation)

Findings that need a Plan-agent pass before fixing:

```
- Sibling regex tools (Map / Scarab / Vendor) reimplement 250-char split → consider shared helper [code]
- WebSocket trade-watcher endpoint exposed publicly → rate-limit design [sec + perf]
```

## Per-auditor reports

For users who want the full detail:

```
- Performance:    <link or expandable section — full report from performance-auditor>
- Accessibility:  <full report from accessibility-auditor>
- Code health:    <full report from code-archaeologist>
- Security:       <full report from security-auditor>
```

You can output the full reports inline (in a collapsed section if your renderer supports it) or summarize and offer to expand on request.
```

---

## Step 4 — recommend next steps

End with a one-paragraph recommendation:

```
Recommendation:
- 4 quick wins listed — single PR, ~35 min total. Worth landing today.
- 1 Critical security finding (CSP unsafe-inline) — must address before next deploy.
- 1 sibling-pair drift in regex tools — flag for /plan-feature on a shared helper, not now.

Next step: ship the quick-win PR. After it lands, re-run /audit-all to confirm the green.
```

---

## Hard rules

- **Always parallel.** The four auditors are independent. One message, four `Agent` calls. Sequential is wasteful.
- **Don't double-flag.** If two auditors find the same root cause (a render storm that's also an a11y issue because the missing skeleton breaks the loading aria), surface it as one cross-cutting pattern, not two findings.
- **Surface Criticals first.** Anything ship-blocking goes to the top of the aggregated output; quick wins are below.
- **Don't fix during the audit.** This skill audits and aggregates. Fixes happen in follow-up work — `Edit` calls from the user, or a separate `/audit-all` invocation followed by a fix request.
- **Re-run on demand only.** Don't auto-schedule the next audit. The user invokes when they want it.
