# PoE Wiki Oracle — Knowledge Base Index (Project Omnilyth)

Entry point for the Omnilyth Oracle's knowledge base. Every file in this directory is reachable from here. The Oracle reads this file on every question.

To extend the KB: drop a new file into the right subdirectory and add a one-line pointer under the matching section below. Format:

```
- [Title](path/to/file.md) — one-line hook
```

Sister knowledge base lives at `C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/` — see "Cross-project references" below.

---

## Source URLs

- [sources.md](sources.md) — curated catalogue of authoritative web sources, with what each is good for and last-verified dates.

---

## Quick reference (hand-curated)

*(empty — Oracle adds entries as they prove worth pre-computing)*

Suggested seeds the user may want filled when relevant:

- `quick_reference/socket_link_limits.md` — per-base socket/link maxima (already partly in `src/data/vendorLevelingStats.js`).
- `quick_reference/chromatic_recipes.md` — Vorici bench costs vs raw chromatic EV.
- `quick_reference/regex_idioms.md` — common regex shapes used across Omnilyth's calculators.
- `quick_reference/current_league.md` — current league name, start date, mechanic-defining mods.

---

## Cached answers

*(empty — Oracle caches as questions arrive)*

---

## Mechanics deep-dives

*(empty — Oracle writes these as topics demand depth)*

---

## Cross-project references

The PoB sister KB has rich PoE 1 mechanics coverage. Cite these by absolute path; do not copy.

- [PoB INDEX](C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/INDEX.md) — entry point for the PoB knowledge base.
- [PoB sources](C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/sources.md) — curated source list (largely shared with Omnilyth's).
- PoB cached uniques: Mageblood, Headhunter, Shavronne's Wrappings, The Pandemonius, Doryani's Prototype.
- PoB cached mechanics: Cluster Jewels, Timeless Jewels, Essences, Harvest, Betrayal/Jun.
- PoB mechanics deep-dives: Damage Conversion, Spell Suppression, Critical Strikes, Life Leech.
- PoB quick reference: Base items, Currency, Keystones, Ascendancies.

When the Oracle uses one of these, it cites by absolute path in the answer and adds a brief discovery note here if the topic recurs.

---

## Local data files (Layer 1, not part of the KB)

For convenience — these are the on-disk Omnilyth data files the Oracle sweeps **before** consulting the KB. They are not authored here; they're maintained by `data-curator`.

- `src/data/itemMods.js` — all item mods (~2.9 MB; grep, don't read whole).
- `src/data/magicItemMods.js` — magic-tier prefixes/suffixes.
- `src/data/clusterJewelData.json` — cluster jewel notables (~239 KB).
- `src/data/vendorLevelingStats.js` — vendor-leveling priorities + socket/link rules.
- `src/data/leveling/gemAvailability.js` — 335 gems × class × act × source (~256 KB).
- `src/data/timeless/` — timeless jewel replacement tables.
