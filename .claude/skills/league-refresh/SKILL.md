---
name: league-refresh
description: Sequential pipeline for handling a new PoE league — poe-wiki-oracle (summarize patch + cache) → data-curator (refresh affected data files) → build-strategist (meta read for new league) → economy-analyst (week-1 economy baseline) → release-manager (drafts player-facing post). Argument: the league name (e.g., "league-refresh Necropolis"). Use whenever GGG announces or launches a new league/expansion.
---

# /league-refresh — new-league handling pipeline

You are orchestrating the league-launch pipeline. The user has invoked: `/league-refresh $ARGUMENTS`.

`$ARGUMENTS` is the league name (`Necropolis`, `Settlers`, etc.). If missing, ask once.

---

## Step 1 — patch-note summary + cache (oracle)

Spawn `poe-wiki-oracle` to fetch the patch notes for the league, summarize, and cache:

```
Agent(
  description: "Patch summary: <league>",
  subagent_type: "poe-wiki-oracle",
  prompt: """
    A new league has launched: <league name>.

    1. Fetch the official patch notes (patchforum + announcement post).
    2. Summarize what changed: new mechanic, balance changes, item changes,
       gem changes, ascendancy changes, atlas changes, removed mechanics.
    3. Cache the summary at .claude/knowledge/mechanics/league-<league-slug>.md
       and reference it from .claude/knowledge/INDEX.md.
    4. Update .claude/knowledge/quick_reference/current_league.md
       (create if missing) with: league name, start date, key mechanic, key changes.
    5. Return the summary for downstream agents to read.
  """
)
```

The oracle's output becomes context for steps 2–5. Don't proceed until cached.

---

## Step 2 — data refresh (data-curator)

Spawn `data-curator` with the patch summary:

```
Agent(
  description: "Data refresh for <league>",
  subagent_type: "data-curator",
  prompt: """
    A new league has launched: <league>.

    Patch summary (from poe-wiki-oracle):
    <paste oracle's summary>

    1. Identify which src/data/ files need updating based on the summary:
       - itemMods.js if mods changed
       - clusterJewelData.json if cluster notables changed
       - gemAvailability.js if gems were added/removed/repositioned
       - vendorLevelingStats.js if socket / vendor rules changed
       - timeless/ if timeless tables changed
    2. Run the matching scripts/leveling-data/ pipeline:
       npm run leveling-data:live   (full pipeline)
       — or —
       targeted scripts based on what changed
    3. Diff the output. Spot-check 5 random entries against the wiki.
    4. Report what changed in src/data/ and what's still pending.

    Don't commit. Just refresh + diff + report.
  """
)
```

After the curator returns, the data is staged. The user reviews the diff before committing.

---

## Step 3 — meta read (build-strategist) — parallel with §4

Spawn `build-strategist`:

```
Agent(
  description: "Meta read for <league>",
  subagent_type: "build-strategist",
  prompt: """
    New league launched: <league>.

    Patch summary (from poe-wiki-oracle):
    <paste oracle's summary>

    1. Identify which archetypes were buffed / nerfed / introduced / removed.
    2. Recommend 3–5 league-start picks for the new patch.
    3. Flag any popular pre-league archetypes that are now Dead / Fragile.
    4. State the meta health of the top-3 archetypes from last league
       (Healthy / Fragile / Overrated / Dead).
    5. Output the standard build-strategist report.

    Use poe.ninja/builds/<league> if it has data; otherwise reason from
    patch notes + last-league baseline.
  """
)
```

---

## Step 4 — economy baseline (economy-analyst) — parallel with §3

Spawn `economy-analyst`:

```
Agent(
  description: "Economy baseline for <league>",
  subagent_type: "economy-analyst",
  prompt: """
    New league launched: <league>.

    Patch summary (from poe-wiki-oracle):
    <paste oracle's summary>

    1. Read poe.ninja/<league>/currency for the first available data point.
       (Day-1 data is noisy; tag your answer accordingly.)
    2. Identify any economy-relevant patch changes:
       - Vendor recipe changes
       - Drop rate changes
       - New currency types
       - Removed currency types
       - Scarab / fragment changes
    3. Recommend Week-1 farming strategies given the new patch.
    4. Output the standard economy-analyst report.

    Tag every claim with the date and the league phase (Week 1).
  """
)
```

Steps 3 and 4 are independent — fire in one message.

---

## Step 5 — player-facing post (release-manager)

Once §1–§4 complete, spawn `release-manager`:

```
Agent(
  description: "League launch post: <league>",
  subagent_type: "release-manager",
  prompt: """
    New league launched: <league>.

    Inputs:
    - Oracle's patch summary: <paste>
    - Data-curator's refresh report: <paste>
    - Build-strategist's meta read: <paste>
    - Economy-analyst's baseline: <paste>

    Draft a "What's New" post for the Omnilyth release that ships with this
    league refresh. Player-facing voice. Cover:
    - New tools / features (if any landed in this release)
    - Data refreshes (gem availability, mod changes, cluster jewel changes)
    - Default league flip (Mirage → <new league>)
    - Quick build/economy notes IF relevant to a tool user.

    Also stage the CHANGELOG.md [Unreleased] entries for this release.

    No AI / Claude attribution. Author voice = EtherealCarnivore.
  """
)
```

---

## Step 6 — handoff package

Aggregate into one summary the user can act on:

```markdown
# League refresh: <league> — <date>

## Patch summary
<oracle's summary, compressed>

## Data refresh status
<curator's report — what was refreshed, what's pending>

## Meta read
<build-strategist's top-line recommendation + ladder data freshness>

## Economy baseline
<economy-analyst's Week-1 read + when to re-read>

## Release notes draft
<release-manager's "What's New" post>

## CHANGELOG diff
<diff for [Unreleased] block>

## Next steps
1. Review the data-curator's diff in `git diff src/data/`.
2. Spot-check 5 random gems / mods / cluster notables in-game.
3. Bump CLAUDE.md "default league" reference if applicable.
4. Run /audit-all to confirm the data refresh didn't bloat the bundle.
5. Cut the release: bump package.json, finalize CHANGELOG, tag, deploy.
```

---

## Hard rules

- **Sequential where there are dependencies.** Step 1 → 2 → (3 || 4) → 5 → handoff. Don't parallelize §1 and §2 — §2 depends on §1's summary.
- **Cache aggressively.** Every fetch in §1 caches to `.claude/knowledge/`. Re-runs of this skill in the same league should re-read cache, not re-fetch.
- **Don't commit data refreshes.** Stage and report; the user runs the actual commit after spot-checking.
- **Don't deploy.** The user pushes when ready. This pipeline gets the repo *to* the deploy line, not across it.
- **Tag league phase.** Every economy / meta read explicitly says "Week 1" or "Day 0–7." Otherwise the advice gets misapplied at week 4.
