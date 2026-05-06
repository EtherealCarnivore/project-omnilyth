---
topic: Ailments — poison, bleed, ignite, shock, chill, freeze (PoE 1)
sources:
  - https://www.poewiki.net/wiki/Ailment
  - https://www.poewiki.net/wiki/Status_ailment
  - https://www.poewiki.net/wiki/Poison
  - https://www.poewiki.net/wiki/Bleeding
  - https://www.poewiki.net/wiki/Ignite
  - https://www.poewiki.net/wiki/Shock
  - https://www.poewiki.net/wiki/Chill
  - https://www.poewiki.net/wiki/Freeze
fetched: 2026-05-06
local_data_refs: []
patch: 3.27 / Mirage
---

# Ailments — PoE 1

The six status ailments and their independent damage / threshold mechanics. The hit-damage ailments (poison, bleed, ignite) scale fundamentally differently from the threshold-based ailments (shock, chill, freeze).

## Answer

| Ailment | Damage type | Scales from | Stacks? | Caps |
|---|---|---|---|---|
| **Poison** | Chaos DoT | Base hit damage (phys + chaos portions, by default) | YES — every application is independent | No theoretical cap; practical cap from generic DoT cap |
| **Bleed** | Physical DoT | Base hit damage (phys portion, by default) | NO — only the strongest applies (unless skill says otherwise) | DoT cap |
| **Ignite** | Fire DoT | Base hit damage (fire portion + added fire on hit, by default) | NO — only the strongest applies | DoT cap |
| **Shock** | (modifier) | Hit damage threshold vs target's max life/ES | YES — only strongest active | 50% increased damage taken (hard cap, scaled by ailment effect) |
| **Chill** | (modifier) | Hit damage threshold vs target's max life/ES | YES — only strongest active | 30% reduced action speed (hard cap, scaled by ailment effect) |
| **Freeze** | (binary stun) | Hit damage threshold vs target's max life/ES (≥ ~5%) | YES — single freeze | 6 sec hard cap on duration; effectively binary (frozen or not) |

## Details

### Hit-based ailments — poison, bleed, ignite

These three apply when a hit lands. Their damage is computed at the moment of application from the **base hit damage** (with various skill / gear / stat modifiers), then scales independently as a damage-over-time effect for its duration.

**Common pipeline for a hit-based ailment:**

```
1. Compute base hit damage (post-conversion, post-modifiers).
2. Determine the ailment's "base damage" from the eligible portion of the hit:
     - Poison      → phys + chaos portions of the hit, default
     - Bleed       → phys portion of the hit, default
     - Ignite      → (fire + added fire damage on hit) portion, default
3. Apply the ailment's damage multiplier (a fixed ratio per ailment type).
4. Apply DoT-relevant modifiers:
     - +X% generic damage
     - +X% damage over time
     - +X% specific to the ailment type ("+X% increased poison damage")
     - +X% chaos damage (poison) / phys damage (bleed) / fire damage (ignite)
5. Apply duration modifiers (longer DoT = more total damage).
```

**Ailment damage multipliers (canonical):**

| Ailment | Multiplier from base hit damage |
|---|---|
| Poison | 30% per second × 2 sec = 60% total per stack (default) |
| Bleed | 70% per second × 5 sec = 350% total (default; double while moving) |
| Ignite | 90% per second × 4 sec = 360% total (default) |

These multipliers can be modified by gear / passives / specific keystones — these are the unmodified baselines.

### Stacking rules

**Poison stacks.** Every poison-applying hit creates a new, independent stack. A build that hits 10 times per second with 100% poison chance creates 10 new poison stacks per second; each stack is a separate timer with its own damage. After ~2 seconds the build has ~20 stacks active.

**Bleed and ignite do not stack.** A new bleed application replaces the old one *only if it is stronger*. This is why bleed builds use Crimson Dance (a key passive that allows bleed to stack up to 8 times) and ignite builds use Elemental Equilibrium + skills that increase ignite chance / damage rather than rate.

**Implication:** poison builds scale with hit rate; bleed/ignite builds scale with hit damage.

### Threshold ailments — shock, chill, freeze

These three modify the target rather than dealing DoT. They are based on a **threshold check**: the hit's damage relative to the target's maximum life/ES determines the strength of the resulting ailment.

**Shock formula (current, post-rework):**

```
shock_effect = (hit_damage / target_max_life) × scaling_factor

# Min/max effect:
0% effect at 0.05% threshold
50% effect at 5%+ threshold  (hard cap)
```

A 5%-of-target-max-life hit produces a 50%-effect shock — the maximum shock effect (50% increased damage taken on the target) before ailment-effect modifiers.

**Chill formula:**

```
chill_effect = (hit_damage / target_max_life) × scaling_factor

# Min/max:
0% effect at 0% threshold
30% effect at 1.5%+ threshold (hard cap, before ailment effect modifiers)
```

A 1.5%-of-target-max-life hit produces 30% chill — slow target by 30% (action speed reduction).

**Freeze formula:**

```
freeze_duration = function(cold_hit_damage, target_max_life)

# Min duration: 0.3s   Max: 6s
# Threshold-based; small hits don't freeze, hits at ~10%+ produce reliable long freezes
```

Freeze is binary (frozen or not), but the duration scales with the threshold.

### Threshold-based scaling levers

For shock, chill, freeze:

- **Increased ailment effect** — multiplies the resulting effect (e.g., 50% shock × 1.5 = 75% shock). The hard cap on the *base* effect is 50/30/freeze-yes — but ailment-effect modifiers can push past that.
- **Inevitable Judgement** — your hits ignore enemy elemental resistance, indirectly improving the threshold/damage ratio.
- **Threshold reductions** — some keystones / unique mods reduce the threshold required for max effect. These let smaller hits produce max-effect ailments.

### Skill-based ailment overrides

Some skills bypass the default eligibility rules:

- **Volatile Dead** — a corpse-explosion skill. Its phys hits can ignite if the build supports it (despite ignite normally being fire-only).
- **Caustic Arrow** — applies a chaos DoT directly (similar to poison but skill-controlled, not ailment-categorized).
- **Vaal Cold Snap** — freezes regardless of damage (no threshold check).
- **The Pandemonius** (unique helm) — chills add cold pen rather than slow.

When a skill mechanically overrides ailment behavior, the override always wins. Always check the skill's specific gem text first.

### EHP implications

Hit-based ailment EHP is a separate calculation:

```
ailment_EHP_against_X =
  pool /
  (per-tick damage × duration × tick_count)

# Where per-tick damage already factors in:
# - DoT cap (the global maximum DoT damage you can take per second)
# - Ailment-type-specific modifiers
# - Mitigation (chaos res for poison, phys res for bleed, fire res for ignite)
```

This is materially different from hit-EHP — a build that has 1000 EHP vs hits might have 200 EHP vs a stacked-poison shadow boss. EHP calculators that don't model ailment EHP are incomplete.

### Common bugs in ailment math

1. **Computing poison damage from final hit damage instead of base hit damage.** Poison applies *before* the hit's "more" multipliers in some interpretations; verify carefully.
2. **Treating ignite as fire-only.** Most fire skills apply ignite, but some skills (Volatile Dead, etc.) ignite from non-fire damage.
3. **Stacking bleed without Crimson Dance.** Default bleed only allows the strongest active; stacking it requires the keystone.
4. **Forgetting that poison is chaos DoT.** Chaos res mitigates poison; fire res does not. A "all elemental res" max doesn't help against poison.
5. **Computing freeze duration from hit damage alone.** It's the ratio of hit damage to target max life that matters, not the absolute hit number.
6. **Double-applying ailment-effect modifiers.** "+X% to ailment effect" should apply once, not at both the threshold check and the resulting effect.

## Source excerpts

> "Poison stacks: each instance of poison is independent and applies its own damage over time. Multiple poisons accumulate. Poison damage is dealt as chaos."
> — [PoE Wiki — Poison](https://www.poewiki.net/wiki/Poison), verified 2026-05-06

> "Bleeding: only the strongest bleed applies at any time, unless modified by passives like Crimson Dance which allow bleed to stack."
> — [PoE Wiki — Bleeding](https://www.poewiki.net/wiki/Bleeding), verified 2026-05-06

> "Ignite damage is based on the base fire damage of the hit. Only the most damaging ignite applies."
> — [PoE Wiki — Ignite](https://www.poewiki.net/wiki/Ignite), verified 2026-05-06

> "Shock: increases damage the shocked target takes, scaling with the magnitude of the shock. Maximum shock magnitude is 50% (50% increased damage taken), reachable at 5% of target's maximum life threshold."
> — [PoE Wiki — Shock](https://www.poewiki.net/wiki/Shock), verified 2026-05-06

## Related Omnilyth files

- *(no calculator currently models ailment damage; this file documents the math contract for any future damage-shape calculator.)*

## Cross-project reference

The PoB sister knowledge base may have a more complete ailment + DoT-cap deep-dive at:

```
C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/mechanics/ailments.md
```

(Path may differ — check `INDEX.md` of the PoB KB.) Cite by absolute path; do not copy.
