---
topic: Socket and link limits per base type (PoE 1)
sources: [https://www.poewiki.net/wiki/Item_socket]
fetched: 2026-05-06
local_data_refs: [src/data/vendorLevelingStats.js]
patch: 3.27 / Mirage
---

# Socket and link limits — PoE 1

Maximum sockets and links per base type. The fusing/jeweller/chromatic calculators in Omnilyth all derive their bounds from this table.

## Answer

| Base type | Max sockets | Max links | Notes |
|---|---|---|---|
| Body armor | 6 | 6 | All body armor bases (str / dex / int / hybrid). |
| Two-handed weapons (axes, maces, swords) | 6 | 6 | Includes all 2H melee. |
| Bows | 6 | 6 | |
| Staves / Warstaves | 6 | 6 | |
| Helmets | 4 | 4 | |
| Gloves | 4 | 4 | |
| Boots | 4 | 4 | |
| Shields (all) | 3 | 3 | Including Spirit Shields and bucklers. |
| One-handed weapons (axes, maces, swords) | 3 | 3 | |
| Daggers | 3 | 3 | |
| Claws | 3 | 3 | |
| Sceptres | 3 | 3 | |
| Wands | 3 | 3 | |
| Rune Daggers | 3 | 3 | |
| **Rings** | **0** | **0** | No sockets. |
| **Amulets** | **0** | **0** | No sockets. |
| **Belts** | **0** | **0** | No sockets. |
| **Quivers** | **0** | **0** | No sockets. |
| **Jewels** (abyss / cluster / regular / timeless) | **0** | **0** | No sockets — they ARE the socket fill. |
| **Flasks** | **0** | **0** | No sockets. |

## Details

### Why 6S/6L is the ceiling

Path of Exile 1 caps gear sockets at 6 across the entire game. The 6 ceiling exists for body armor, 2H weapons, bows, and staves because those bases have an item-graphic large enough to fit a 3×2 socket grid. Everything smaller is hard-capped to 4 (helm/glove/boot) or 3 (1H weapons, shields, daggers, claws, sceptres, wands).

### Items that simply can't have sockets

Rings, amulets, belts, quivers, jewels, and flasks have **zero sockets** in PoE 1. A common bug in PoE tools is to treat these as if they could be socketed; Omnilyth's `vendorLevelingStats.js` enforces 0 sockets for these bases.

The exception people sometimes confuse: **abyss jewels** plug into existing abyssal sockets on body armor / belts / boots / helms — the abyssal sockets are part of the *armor's* socket set when applicable, not the jewel's.

### Influence and special bases

- **Influenced bases** don't change socket / link maxima — Shaper / Elder / Awakener / etc. items follow base-type rules.
- **Synthesized bases** likewise unchanged.
- **Corrupted bases** can have **white sockets** (any color gem socketable) but the count itself is unchanged.

### Tainted considerations

Tainted Fusing / Tainted Chromatic operate on **corrupted items only**. They preserve the base type's socket and link maxima — Tainted Fusing on a corrupted helmet still caps at 4L.

### Six-link cost intuition

Rough averages by base (from PoE Wiki + community studies):

| Action | Average cost |
|---|---|
| 6-link a 6-socket body armor | ~1500 fusing orbs |
| 6-socket any eligible base | ~350 jeweller's orbs |
| 5-link any 5+ socket base | ~150 fusing orbs |
| Vorici 1500-fuse 6L bench | 1500 fusings (deterministic) |
| Tainted Fusing 6L on corrupted | ~750 (50% effective rate of raw fusing) |

These are approximations; for the actual probability tables see `src/calculators/fusingCalc.js` and the wiki's [Orb of Fusing](https://www.poewiki.net/wiki/Orb_of_Fusing) page.

## Source excerpts

> "Socket numbers are limited by item type. Body armours, two-handed weapons, bows and staves can have up to six sockets. Helmets, gloves and boots can have up to four sockets. One-handed weapons and shields can have up to three sockets. Rings, amulets, belts, quivers, jewels and flasks cannot have sockets."
> — [PoE Wiki — Item socket](https://www.poewiki.net/wiki/Item_socket), verified 2026-05-06

## Related Omnilyth files

- `src/data/vendorLevelingStats.js` — encodes socket/link maxima per base type, consumed by:
  - `src/calculators/fusingCalc.js`
  - `src/calculators/socketCalc.js`
  - `src/calculators/jewellerCalc.js`
  - `src/calculators/chromaticCalc.js` (via shared base-type metadata)

If the wiki contradicts `vendorLevelingStats.js`, the canonical source is the wiki — flag the divergence and route the fix to `data-curator`.
