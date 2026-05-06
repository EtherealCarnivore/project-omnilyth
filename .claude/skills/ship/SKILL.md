---
name: ship
description: Final-mile shipping pipeline — feature-reviewer (SHIP/REVISE/REJECT gate) → qa-tester (manual playbook + smoke run) → release-manager (changelog entry + version bump). Use when a feature is implemented and the user wants the closing checks before merge. Argument: the feature ID or branch name (or "current" for whatever's staged).
---

# /ship — final-mile feature shipping pipeline

You are orchestrating the closing checks before a feature ships. The user has invoked: `/ship $ARGUMENTS`.

`$ARGUMENTS` is one of:

- A **feature ID** matching a `src/modules/registry.js` entry — e.g., `cluster-jewel`.
- A **branch name** with implementation work — e.g., `feature/atlas-tree-diff`.
- `current` (or empty) — whatever's currently staged or on the active branch.

If unclear, ask once and stop.

---

## Step 1 — locate the work

Determine what's actually being shipped:

1. If a feature ID, read the registry entry. Read its calculator + page + component.
2. If a branch, run `git log master..<branch> --oneline` to see what changed.
3. If `current`, run `git status` + `git diff --stat`.

Surface to the user: "Shipping: <files / commits / feature>". If they want to abort or scope differently, they say so now.

---

## Step 2 — feature-reviewer (the gate)

Spawn `feature-reviewer` with the implementation in hand:

```
Agent(
  description: "Ship gate: <feature>",
  subagent_type: "feature-reviewer",
  prompt: """
    Feature: <feature name>
    Code paths: <list of file paths>
    Description (from registry or PR description): <one-paragraph>

    Run the standard feature-reviewer rubric — Verdict / User Fit / Risks / Simplification / Fixes / Placement / Final call.

    The verdict gates everything downstream. SHIP proceeds; REVISE stops here with the fix list; REJECT stops here with the call.
  """
)
```

If verdict is `REJECT`, stop. Surface the call to the user; the feature doesn't ship.

If verdict is `REVISE`, stop and surface the fix list. The user fixes, then re-invokes `/ship`.

If verdict is `SHIP`, proceed.

---

## Step 3 — qa-tester (smoke playbook)

Spawn `qa-tester`:

```
Agent(
  description: "QA playbook: <feature>",
  subagent_type: "qa-tester",
  prompt: """
    Feature: <feature name>
    Code paths: <list of file paths>
    Reviewer verdict: SHIP (with notes: <any caveats>)

    Design a 5–10 minute manual smoke checklist for this feature.
    Include calculator validation rows if applicable, edge case coverage,
    and the regression matrix for adjacent tools.

    If you can run npm run dev / npm run build, run the smoke yourself
    and mark each step pass / fail. If the env doesn't permit, write the
    playbook and explicitly mark steps as [⊘ run-by-user].

    Output the standard qa-tester report.
    Save the playbook to docs/qa/<feature-id>.md.
  """
)
```

If qa-tester returns bugs filed, **stop the pipeline**. Surface the bugs; the user fixes; re-invoke `/ship`.

If qa-tester returns `READY`, proceed.

---

## Step 4 — release-manager (changelog + version bump)

Spawn `release-manager`:

```
Agent(
  description: "Release notes: <feature>",
  subagent_type: "release-manager",
  prompt: """
    Feature shipping: <feature name>
    Code paths: <list of file paths>
    Reviewer verdict: SHIP
    QA verdict: READY (playbook at docs/qa/<feature-id>.md)

    1. Read git log <last-tag>..HEAD for context.
    2. Stage the changelog entry under [Unreleased] in CHANGELOG.md.
       Use Added / Changed / Fixed groupings as appropriate.
       Player-facing voice. Bold the thing, lead with the verb.
    3. Recommend a version bump (patch / minor / major) with one-line justification.
    4. Draft the "What's New" post for Reddit/Discord (the user can post or skip).
    5. Output the standard release-manager report.

    Do NOT commit, tag, or push. Show the diffs and stop.
  """
)
```

---

## Step 5 — handoff package

Aggregate into one summary:

```markdown
# /ship summary — <feature> — <date>

## Reviewer verdict
SHIP — <one-line>
Caveats: <list, if any>

## QA verdict
READY — playbook at docs/qa/<feature-id>.md
Smoke run: <pass / partial — list of any [⊘ run-by-user] steps>

## Release-manager output
- CHANGELOG.md diff: <inline>
- package.json bump: <current → proposed, justification>
- "What's New" post draft: <inline>

## Final commands (DO NOT RUN until user authorizes)

git add <staged files>
git commit -m "<concise message — no AI attribution>"
git tag v<new-version>
git push origin master
git push origin v<new-version>
```

---

## Step 6 — wait for user

End the turn. The user reviews and runs the commands. Don't auto-commit, don't auto-tag, don't auto-push.

---

## Hard rules

- **Stop on REJECT.** No QA, no release notes, no further work.
- **Stop on REVISE.** The fix list is the deliverable. User fixes, re-invokes.
- **Stop on QA bugs.** Same — user fixes the bugs first.
- **Don't auto-commit.** The user runs the final commands. Always show; never run.
- **No AI attribution in any commit / PR / tag.** Per `~/.claude/CLAUDE.md`. The release-manager already enforces this; double-check the proposed commit message.
- **Tag responsibly.** Tags are public state; the user authorizes the push.
