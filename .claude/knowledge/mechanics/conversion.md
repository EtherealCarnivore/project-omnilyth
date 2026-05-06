---
topic: Damage conversion (PoE 1)
sources:
  - https://www.poewiki.net/wiki/Damage_conversion
  - https://www.poewiki.net/wiki/Modifier#Damage_modifiers
fetched: 2026-05-06
local_data_refs: []
patch: 3.27 / Mirage
---

# Damage conversion — PoE 1

How damage flows from one type to another, in what order, and what stacks vs what doesn't. This is the single most-misunderstood part of PoE damage math; bad assumptions here ripple into every damage calculator.

## Answer

The conversion pipeline runs in this fixed order:

```
Physical → Lightning → Cold → Fire → Chaos
```

At each step, two operations happen in sequence:

1. **Conversion** — a portion of the source-type damage becomes the next-type damage. Each source can have at most **100% of its damage converted**.
2. **"As extra" damage** — adds *new* damage of the next type alongside the source. Not constrained by the 100% conversion cap; "as extra" is added damage, not redirected damage.

Then each type independently applies its own modifiers:

```
final_<type>_damage = (sum of all damage assigned to <type>)
                    × (1 + sum_of_increased_<type>)
                    × Π(more_<type>)
                    × penetration_<type>
```

Generic modifiers ("increased damage", "more damage") apply to every type. Type-specific modifiers ("increased fire damage", "more cold damage") apply only when the damage has reached that type.

## Details

### The four conversion mechanics distinguished

| Term | Mechanic |
|---|---|
| **Conversion** | "X% of physical converted to fire" — the converted portion *leaves* the source type and *becomes* the destination type. Source-type modifiers apply once (during the source phase), then destination-type modifiers apply (during the destination phase). |
| **"As extra"** | "X% of physical added as extra fire" — duplicates a portion of the damage as a new type, alongside the original. Both source and destination scaling apply, and the total can exceed 100% of the source. |
| **Skill conversion** (e.g., Cold to Fire support, Avatar of Fire) | Acts like conversion but is fixed at the skill level. Avatar of Fire is 50% phys-to-fire + 50% cold-to-fire + 50% lightning-to-fire AND prevents non-fire damage, so the math collapses cleanly. |
| **Gear conversion** (e.g., "X% of physical damage converted to lightning" on a Tabula) | Acts like conversion but applied via gear modifiers. Stacks with skill conversion up to the 100% cap. |

### The fixed order: phys → lightning → cold → fire → chaos

Each type can only convert *forward* in this chain. Phys can convert to lightning, cold, fire, or chaos. Lightning can convert to cold, fire, or chaos. **Lightning cannot convert back to phys.** Chaos doesn't convert to anything.

This means:

- Physical damage can be modified by phys-scaling first, then by lightning-scaling (if converted to lightning), then by cold-scaling (if further converted), and so on.
- A "phys → fire" conversion via Avatar of Fire skips lightning and cold scaling entirely (the damage moves directly to the fire phase of the pipeline).

### The 100% cap per source

Each source-type can have at most 100% of its damage converted. This means:

- 60% phys-to-fire (gear) + 50% phys-to-fire (Avatar of Fire) = 110% requested, but capped at 100%. The 110% scales proportionally back to 100%.
- 50% phys-to-cold + 50% phys-to-fire = 100%, no overflow. Each goes 50/50.

The cap applies **per source type**, not per chain. Phys can convert 100% to lightning; that lightning can then convert 100% to cold; that cold can then convert 100% to fire. The final result: phys → lightning → cold → fire all in sequence, with each step's modifiers applying.

### "As extra" is added, not converted

"X% of physical added as extra fire" duplicates the phys damage as fire alongside, **not instead of**. Both versions exist:

- The original phys damage, modified by phys-scaling.
- A second copy of that same damage, scaled as fire.

Crucially, "as extra" applies *before* conversion in the pipeline. So 100% phys + 50% phys-as-extra-fire + 100% phys-converted-to-cold yields: 100% cold (the converted phys, scaled as cold) + 50% fire (the as-extra fire, scaled as fire). The original phys is gone (converted), but the fire copy survives.

### Modifier cascade

Once damage settles into its final type, modifiers apply in the standard order:

```
final = base_at_this_type
      × (1 + sum_of_all_increased_for_this_type)    // increased adds
      × Π(more_for_this_type)                        // each more multiplies
      × crit_factor
      × penetration_factor
```

Generic modifiers like "+50% increased damage" apply to every type at every phase. Specific modifiers like "+50% increased fire damage" only apply once the damage is fire.

A common modeling mistake: applying "+50% increased phys" to damage that has already converted to fire. The phys-specific modifier doesn't follow the damage forward; only generic modifiers do.

### Tags and skill-relevance

A skill that uses physical damage (e.g., Bladefall) and converts 60% to fire still benefits from:

- Generic damage modifiers (always).
- "Spell damage" modifiers (the skill is a spell, regardless of damage type).
- Phys-specific modifiers (for the 40% that didn't convert).
- Fire-specific modifiers (for the 60% that did convert).
- Modifiers that match the *original* source type via "scales with X" mechanics.

The skill keeps its **tags** through conversion. A converted-to-fire spell is still a spell, still has the same gem tags it started with. Tags affect modifier eligibility at every phase.

### Conversion vs penetration

Penetration (e.g., "fire damage penetrates 25% fire resistance") applies to *outgoing* damage of that type, **after all conversion is complete**. The damage type at the moment of hit determines which penetration applies. Phys-converted-to-fire benefits from fire pen, not phys pen.

Penetration is **not** the same as negative resistance. If the target is at -10% fire res and you apply 25% fire pen, the effective res is -10% - 25% = -35%, multiplying damage by 1.35. But if the target is already at -100% fire res (capped), penetration above that cap has no effect (you can't go below -100%).

### Conversion timing in mechanics

- **Hit damage**: conversion applies at hit calculation — the final damage that enters mitigation / resist checks is the converted form.
- **DoT damage** (ignite, poison, bleed): the *base* damage of the DoT is determined at the moment of application. Once applied, the DoT type is fixed (poison is always chaos, bleed is always phys, ignite is always fire — even if the hit was fully converted from another type).
- **Reflect**: the target reflects the type of damage they received. Phys-converted-to-fire that hits is reflected as fire damage.

### Common bugs in conversion math

1. **Applying source-type modifiers to converted damage.** "+50% phys" doesn't carry forward to the converted-fire copy.
2. **Stacking "as extra" with conversion as if they were the same.** They compose; both exist after the calculation.
3. **Allowing >100% conversion.** A conversion calc must clamp the per-source total at 100%.
4. **Forgetting Avatar of Fire blocks non-fire damage.** AoF prevents you from dealing non-fire damage at all, which means non-converted phys is *zeroed*, not just unscaled.
5. **Mixing skill conversion with gear conversion incorrectly.** They share the 100% pool, but skill conversion applies first in the calculation order; gear conversion fills the remainder.

## Source excerpts

> "Conversion is applied in the order: physical, lightning, cold, fire, chaos. Damage can only convert forward in this chain. The total of any one type's outgoing conversion can never exceed 100%."
> — [PoE Wiki — Damage conversion](https://www.poewiki.net/wiki/Damage_conversion), verified 2026-05-06

> "'X% of damage as extra' is added damage; it scales with both the source type's modifiers and the destination type's modifiers."
> — [PoE Wiki — Damage conversion](https://www.poewiki.net/wiki/Damage_conversion), verified 2026-05-06

## Related Omnilyth files

- *(no calculator currently models conversion deeply — most damage-shape calculators in Omnilyth are crafting / atlas / regex-flavored, not damage-dealing simulators. If a PoB-style damage simulator is ever built here, this file is its math contract.)*

## Cross-project reference

The PoB sister knowledge base has a deeper damage-conversion deep-dive at:

```
C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/mechanics/damage-conversion.md
```

That file may have additional examples and edge cases that didn't fit here. Cite by absolute path; do not copy.
