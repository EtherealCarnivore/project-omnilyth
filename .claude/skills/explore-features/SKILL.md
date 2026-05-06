---
name: explore-features
description: Run a feature-explorer sweep against the PoE community and competitor tool landscape. Optional argument scopes the sweep ("crafting tools", "leveling tools", "atlas tools", "<competitor name>"). Without an argument, runs a broad sweep across all Tier 1 + Tier 2 sources. Writes ranked candidates to .claude/feature-radar/ and returns an executive summary. Use when the user wants outside-in feature discovery — "what should we build", "scout the community", "what does <competitor> have", or any product-discovery shaped question.
---

# /explore-features — outside-in feature discovery sweep

You are orchestrating the `feature-explorer` agent. The user has invoked: `/explore-features $ARGUMENTS`.

`$ARGUMENTS` is optional. If empty, the sweep is *broad*; if present, it scopes the sweep.

---

## Step 1 — parse the scope

Three scope shapes, in priority order:

| Argument shape | Sweep type |
|---|---|
| empty | **Broad sweep** — Tier 1 (Reddit, GGG forums, PoB changelog) + Tier 2 (awakened-poe-trade, exilence-next, MaxRoll, PoEDB, ninja). |
| `crafting` / `atlas` / `jewels` / `leveling` / `regex` / `build planning` / `tools` (matching a registry category) | **Topical sweep** — focus to the tools and threads adjacent to that category. |
| `<competitor name>` (e.g., `awakened-poe-trade`, `exilence`, `maxroll`) | **Competitor inventory** — single-tool feature-mapping pass. Whatever they ship → does Omnilyth have it? |
| free-form text | **Custom scope** — pass through to the agent, let it interpret. |

If the argument is ambiguous (e.g., "atlas" — the category, or the atlas-specific tool?), ask the user once for clarification. If still ambiguous, default to the broader interpretation.

---

## Step 2 — pre-flight

Before invoking the agent, do three things in parallel:

1. **Read `.claude/feature-radar/INDEX.md`** — note which candidates already exist. The agent will dedupe, but you can hand it the current state up front.
2. **Read `src/modules/registry.js`** — note current tools so the agent's dedup pass is fast.
3. **Sanity-check WebFetch allowlist** — read `.claude/knowledge/sources.md` for current allowed domains. If the sweep needs a source not on the allowlist, surface that to the user before firing the agent.

---

## Step 3 — invoke the agent

Spawn `feature-explorer` with a self-contained brief:

```
Agent(
  description: "Feature-radar sweep: <scope>",
  subagent_type: "feature-explorer",
  prompt: """
    Run a sweep with scope: <scope>.

    Existing radar entries (dedupe against these — bump, don't duplicate):
    <paste a compressed version of the INDEX.md candidate list>

    Existing registry tools (skip ideas already shipped):
    <paste a compressed version of the registry's tool IDs>

    Hand back the executive summary + the list of new candidate files written.
  """
)
```

The agent will write to `.claude/feature-radar/candidates/`, `delta/`, and `runs/` as it sweeps.

---

## Step 4 — post-flight

After the agent returns:

1. Read the agent's executive summary.
2. Confirm new candidate files actually landed in `.claude/feature-radar/candidates/` (or `delta/`).
3. Read the updated `.claude/feature-radar/INDEX.md` — the agent should have added one-liners for each new candidate.
4. Surface to the user:
   - Top of the radar (highest demand × fit).
   - Net new candidates this run.
   - Bumps to existing candidates.
   - Dedupe hits (claims dropped because we already cover them).

---

## Step 5 — recommend the next step

End with a one-paragraph recommendation: which 1–2 candidates are worth advancing to `/plan-feature`. Don't auto-advance; the user picks.

```
Top of the radar:
  1. <Title> — Demand H, Fit M — <one-line hook>
  2. <Title> — Demand H, Fit M — <one-line hook>

Recommend:
  /plan-feature "<title>"  — to validate IA + math + scaffold

Or run another sweep:
  /explore-features <different-scope>
```

---

## Hard rules

- **Never auto-advance** to `/plan-feature` or `/calc-new` from this skill. The user reviews the radar before any feature is built.
- **Don't write radar entries yourself.** That's the agent's job. You orchestrate; you don't author.
- **Don't dedup the radar manually.** The agent has the dedup logic; trust it. Your job is to surface the result.
- **Tag every output with the sweep date.** The user re-reads the radar weeks later; the date matters.
