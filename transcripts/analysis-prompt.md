# PoE 1 Leveling Transcript Analysis Prompt

## Context

You are analyzing an SRT transcript from a Path of Exile 1 speedrunning stream. The transcript contains a mix of gameplay commentary, chat interaction, and strategic decision-making from an experienced racer.

**Build/Class Context:** Ranger — Lightning Arrow (LA) build, league-start SSF conditions (no twink gear, no stash, no trade, campaign-only resources).

**Transcript format:** SRT with timestamps (e.g., `00:12:34,000 --> 00:13:45,000`). Cite timestamps when referencing specific tips so the source moment can be located.

## Extraction Criteria

From this transcript, extract every piece of **actionable competitive knowledge** that contributes to faster Act 1–10 completion under SSF league-start conditions.

**Extract these categories:**
- Route decisions (zone pathing, quest skip/do logic, waypoint usage)
- XP manipulation (when to kill packs, when to skip, level targets per zone)
- Gear acquisition (vendor purchases, what to pick up, essence usage, socket/link priorities)
- Gem timing (quest reward choices, vendor gem purchases, support link breakpoints)
- Movement optimization (flask timing, shield charge, movement speed gear priority)
- Boss strategy (phasing, damage thresholds, when to portal, prep steps)
- Vendor recipe usage (iron rings, chromatics, any crafting at vendor)
- Inventory management (what to carry, when to sell, what to leave on ground)
- Flask management (which flasks when, mana sustain, flask slot progression)
- Decision heuristics (if/then rules the racer uses, contingency plans, RNG responses)
- Mistakes called out (things the racer explicitly says to avoid or corrects themselves on)

**Ignore completely:**
- Chat banter, jokes, off-topic conversation
- Personality commentary, streamer drama
- Repetition of the same tip (consolidate into one entry)
- Generic advice any casual player would know (e.g., "kill monsters to level up")
- Motivational or hype language

## Output Format

Structure the output as follows:

```
## LEVELING INTELLIGENCE REPORT
### Lightning Arrow Ranger — SSF League Start

---

### 1. CORE PRINCIPLES
The fundamental rules and philosophy guiding this racer's approach.
(Bullet list, max 10 items)

### 2. ACT-BY-ACT BREAKDOWN
For each act covered in the transcript:
- **Route:** Zone pathing and traversal notes
- **Quests:** Do/skip decisions with reasoning
- **Gear checkpoints:** What you should have equipped by when
- **Gem setup:** Links and support gems at this stage
- **Boss notes:** Specific tactics if mentioned
- **Level target:** What level to be at entry/exit

### 3. MECHANICAL OPTIMIZATIONS
Specific tricks and micro-level efficiencies:
- Tag each as [MAJOR] (saves 10+ seconds or prevents death) or [MINOR] (small edge)
- Include timestamp reference where applicable

### 4. POWER SPIKE TIMELINE
Key moments where the build's damage or survivability jumps:
- Level thresholds
- Gem acquisitions
- Link upgrades
- Gear swaps

### 5. DECISION HEURISTICS
Explicit if/then rules extracted from the racer's commentary:
Format: "IF [condition] → THEN [action] — BECAUSE [reason]"

### 6. MISTAKES & ANTI-PATTERNS
Things the racer explicitly warns against or corrects during the run.
Include timestamp for each.

### 7. SSF LEAGUE START PLAYBOOK
Condense everything into a sequential checklist:
- Pre-run setup (filter, keybinds, etc.)
- Act-by-act action items in execution order
- Decision points with branching logic
```

## Rules

- Do NOT describe the streamer or the video itself.
- Do NOT pad sections with filler. If an act isn't covered in the transcript, say "Not covered in transcript" and move on.
- Do NOT invent advice that isn't in the transcript. Only extract what's actually said or clearly demonstrated.
- When the racer contradicts themselves or corrects a mistake mid-run, note both the mistake and the correction.
- Consolidate repeated advice into a single entry with the strongest phrasing.
- If a tip is class/build-specific to Ranger/LA, note it. If it's universal, note that too.
