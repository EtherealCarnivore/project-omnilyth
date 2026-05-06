---
topic: Spell suppression (PoE 1)
sources:
  - https://www.poewiki.net/wiki/Spell_suppression
fetched: 2026-05-06
local_data_refs: []
patch: 3.27 / Mirage
---

# Spell suppression — PoE 1

How spell suppression works, what its cap is, and how every modern PoE 1 build that takes spell hits routes its defense through it.

## Answer

```
Suppression triggers   : on spell-hit damage only (not DoT, not melee, not attacks)
Per-trigger reduction  : reduces hit damage by 50% (the "suppressed" half)
Chance source          : "+X% chance to suppress spell damage" modifiers, additive
Chance cap             : 100% chance (full suppression of every spell hit you take)
Effective layer        : (1 - chance_to_suppress × 0.5) — NOT (1 - chance) like dodge

EHP impact at full cap : 2× spell EHP (every spell hit deals half damage on average,
                          but at 100% chance the half is guaranteed, so EHP doubles
                          against spells)
```

## Details

### What suppression actually does

Spell suppression is a **mitigation** layer, not an avoidance layer. When a spell hits you and is suppressed:

- Half the damage is removed (50% multiplicative reduction on the hit).
- The other half goes through your normal mitigation (resists, armour, evade, block, etc.).
- DoT components of spells are **not** suppressed (a suppressed Bear Trap explosion has its hit suppressed, but the bleed it inflicts is unaffected).

This differs from PoE's previous spell-dodge mechanic (removed in 3.16 alongside the introduction of suppression). Old spell-dodge was binary avoidance; suppression is partial mitigation with a chance-to-trigger.

### Why 100% suppression is so valuable

Spell suppression has an unusually clean effective-layer math:

```
chance × 0.5 = expected_damage_reduction_from_suppression
1 - (chance × 0.5) = effective_damage_taken_from_spells
```

| Suppress chance | Damage taken from spells | Effective EHP multiplier |
|---|---|---|
| 0% | 100% | 1.0× |
| 25% | 87.5% | 1.14× |
| 50% | 75% | 1.33× |
| 75% | 62.5% | 1.6× |
| **100%** | **50%** | **2.0×** |

A build that suppresses 100% of spell hits effectively doubles its EHP against spell damage. This is comparable to having permanent +75% all max resistance (also 2× EHP), but suppression is *much* easier to acquire than max-res.

### Where suppression chance comes from

Common sources of "+X% chance to suppress spell damage":

| Source | Approximate amount |
|---|---|
| Passive nodes (cluster of nodes near each side of the tree) | up to 15–25% from medium-investment routing |
| Body armor mod | up to 30% (rare) |
| Helmet mod | up to 25% (rare) |
| Boots mod | up to 25% (rare) |
| Glove mod | up to 25% (rare) |
| Shield mod | up to 25% (rare) |
| Cluster jewel notables | varies; 15% commonly per relevant notable |
| Wise Oak (specific tinctures / harvest crafts) | varies |
| Eldritch implicits | up to 8% on certain slots |

A build at 100% suppression typically has:

- ~25% from passives.
- ~25% from body armor.
- ~25% from helm or boots.
- ~25% spread across the remaining slots and clusters.

Roughly 4–6 slots committed to spell suppression to cap.

### Why "100%" matters and not "85%"

PoE's randomness penalizes near-cap defense. A build at 85% spell suppression takes 100% damage on 15% of hits — over 100 spell hits, that's 15 hits of full damage and 85 of half damage, average 57.5%. This is fine in mapping but **not** in HC where one full hit can one-shot.

100% suppression turns this into 100 hits of half damage = 50% — *deterministic* mitigation. This is why HC builds prioritize 100% suppression specifically; SC builds can usually stop at ~80–90% if other defenses are deep.

### Interaction with other mitigation layers

Suppression applies **before** resistance and armour:

```
incoming_spell_hit
  → suppress_check (at 100%, always halves)
  → resists (capped at 75%)
  → armour (low impact on big hits)
  → block / evade / dodge (whatever remains)
  → final damage
```

A 100% suppression + 75% all max-res build halves every hit, then takes 25% of the half = 12.5% of original damage, before armour. This is why max-res + suppression stacks so well — they multiply.

### Common bugs in suppression math

1. **Treating suppression as avoidance** (1 - chance, like dodge). It's mitigation; the formula is `1 - (chance × 0.5)`.
2. **Suppressing DoT.** DoT is unaffected. A suppressed Bladefall hits get reduced; the resulting bleed is full strength.
3. **Suppressing attack damage.** Suppression is **spell-only**. Phys-melee, projectile-attacks, etc. are not suppressed.
4. **Capping at 75% by accident.** Resistance caps at 75%, suppression caps at 100%. Don't cross-pollinate the rules.
5. **Forgetting to halve once.** Some calcs apply "1 - chance" first and then multiply by 0.5 again — that's wrong, it's a single 0.5 halving applied to the suppressed portion.

### Suppression in EHP-style calculators

If a calc is computing total EHP against spells:

```
spell_EHP = pool / (
  effective_spell_damage_taken
)

effective_spell_damage_taken =
  (1 - suppression_chance × 0.5)
  × (1 - block_chance)
  × (1 - max_res / 100)        // if elemental damage
  × (1 - phys_taken_as_<element> × <element_res_factor>)
  × armour_mitigation_factor
```

Each layer is multiplicative and applies in the order PoE's engine processes them (suppression is one of the earliest mitigations in the chain).

### Inevitable Judgement and other interaction nodes

Some passives interact with suppression:

- **Inevitable Judgement** (Inquisitor ascendancy) — your hits ignore enemy elemental res. Doesn't directly affect your suppression, but pairs well with suppression-based EHP because you lose nothing offensive while gaining a defensive layer.
- **Trickster's Patient Reaper / Polymath** — synergize with energy-shield-based suppression builds.
- **Acrobatics** — used to *replace* spell dodge; in the post-3.16 era, Acrobatics has been re-tuned to interact with Phase Acrobatics and other dodge-flavored nodes.

## Source excerpts

> "Spell suppression: When you are hit by a spell, there is a chance equal to your spell suppression chance to reduce the damage of the hit by 50%. The maximum spell suppression chance is 100%."
> — [PoE Wiki — Spell suppression](https://www.poewiki.net/wiki/Spell_suppression), verified 2026-05-06

## Related Omnilyth files

- *(no current calculator models EHP-shaped suppression; this file documents the math contract for any future EHP / defense calculator that gets added.)*

## Cross-project reference

The PoB sister knowledge base has a deeper EHP / suppression deep-dive at:

```
C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/mechanics/spell-suppression.md
```

If you're building a defense calculator in Omnilyth, cross-reference that file for additional tested examples; cite by absolute path.
