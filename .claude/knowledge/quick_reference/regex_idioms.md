---
topic: Regex idioms used across Omnilyth's PoE regex tools (PoE 1)
sources:
  - https://www.poewiki.net/wiki/Stash_search
  - in-game search behavior
fetched: 2026-05-06
local_data_refs:
  - src/calculators/itemRegex.js
  - src/calculators/mapModRegex.js
  - src/calculators/scarabRegex.js
  - src/calculators/vendorRegex.js
  - src/calculators/gemRegex.js
patch: 3.27 / Mirage
---

# Regex idioms — Omnilyth's PoE regex tools

Common patterns and constraints for the regex generators across Omnilyth (item mods, map mods, scarabs, vendors, gems).

## Answer

### The hard limit: 250 characters per pattern

PoE's stash search input has a **250-character cap** per query. Every regex calculator in Omnilyth must respect this limit:

- If the natural output exceeds 250 chars, **split into multiple patterns** and present numbered ("Pattern 1 of 3").
- Provide both per-pattern copy buttons AND a "copy all" button.
- The Scarab Regex Calculator (`src/calculators/scarabRegex.js`) is the canonical reference for split logic.

The 250-char limit applies to:

- Stash search box.
- Public stash filters.
- Trade site search filters (some pages — verify per page).

It does **not** apply to:

- The Path of Exile official trade site's *advanced* mod filters (those use structured search).
- In-game vendor search (different search box, often capped lower or unsearchable).

### Common regex shapes used in Omnilyth

#### Alternation — match any of N patterns

```
"of frost|of fire|of light"     // matches any one
```

Use parentheses for grouping when combined with anchors:

```
"^(of frost|of fire|of light)"
```

#### Non-capturing groups

PoE's stash search regex uses standard regex syntax (mostly POE-Search-compatible regex). Capturing groups don't matter (stash search doesn't use captures), so use `(?:...)` for clarity in Omnilyth's outputs:

```
"(?:of frost|of fire) damage"
```

#### Character classes

```
"[A-Z]"                          // any uppercase
"[0-9]+"                         // one or more digit
"[ -]?"                          // optional space or hyphen — useful for "Map" vs "Map "
```

#### Word boundaries

PoE stash search behavior: regex anchors `\b`, `^`, `$` mostly work as expected, but anchoring to start-of-line (`^`) only matches the first line of the item's full text. For most use cases, **substring matching is enough — don't anchor unless required.**

#### Negative patterns

PoE stash search **does not support negative lookahead** (`(?!...)`) reliably. To exclude a mod, the canonical Omnilyth approach is:

- Build a *positive* pattern of what you want.
- Don't try `^(?!.*phys)` — it inconsistently works across PoE's search implementations.

If the user requests "all maps EXCEPT phys reflect", the calculator should warn and offer the closest-positive equivalent.

### Map Mod Regex idioms

Common shorthand for map mod fragments (consumed by `src/calculators/mapModRegex.js`):

| Mod fragment | Shorthand | Why |
|---|---|---|
| "of fr" | matches "of frost", "of frostbite" — fragments are indistinct unless you're careful | |
| "redu" | matches "reduced rare monster", "reduced item rarity", etc. — be specific | |
| "phys" | matches "physical reflect" and "extra physical" — disambiguate with surrounding context |
| "dec" | matches "decreased" — useful for any "decreased X" mod |

The Map Mod Regex calculator carries an internal mod-fragment dictionary that resolves "I want to exclude phys reflect" → safe, specific regex.

### Scarab Regex idioms

Scarabs (consumed by `src/calculators/scarabRegex.js`):

- Each scarab category (Harbinger, Breach, Legion, etc.) has 3 tiers (Polished, Gilded, Winged) plus rarer variants.
- Common pattern: filter by category + minimum tier.
- The 250-char limit is the most common reason this calc splits — full scarab inventories generate dozens of patterns.

### Vendor Leveling Regex idioms

Vendor regex (consumed by `src/calculators/vendorRegex.js`) targets Lilly Roth / Siosa / act vendors for buying gems and bases. Common pattern shape:

```
"(Vit|Det|Pre|Hat) (3-Lin|2-Lin)"   // 3-link or 2-link auras
```

The calculator computes priority by class, level, and act based on `src/data/vendorLevelingStats.js`.

### Gem Regex idioms

Gem regex (consumed by `src/calculators/gemRegex.js`) targets Quest Reward gems via Lilly Roth (vendor-purchased post-quest reward window). Common pattern:

```
"(Bli|Sho)"   // matches any gem starting with "Bli" or "Sho" — Blink, Shockwave Totem, etc.
```

Often paired with class filter: "the gem regex assumes Witch act 3, post-Lilly-unlock."

### Item Mod Regex idioms

Item mod regex (consumed by `src/calculators/itemRegex.js`) is the largest — operates over the 2.9 MB `src/data/itemMods.js`:

- Most flexible — any combination of mod text fragments.
- Most likely to exceed 250 chars — almost always multi-pattern.
- The mod-fragment dictionary is the core asset; updating it requires `data-curator`.

## Details

### Why the 250-char limit hurts

The limit was inherited from PoE 1's early stash-search implementation. It hasn't been raised in 12+ years. Every PoE regex tool that generates non-trivial filters has to cope with it.

The Omnilyth pattern is:

1. Generate the natural full regex string.
2. If `len > 250`, split at semantic boundaries (alternation `|` between mod groups), not arbitrary character boundaries.
3. Number each part ("Pattern 1 of N").
4. Each is independently usable in PoE's stash search.

### Common bugs in regex calculators

1. **Splitting at character N inside a token.** "of fro|st" is broken; split at whole-token boundaries.
2. **Forgetting to escape special chars.** Mod text with `+` (e.g., "+50% to") needs `\\+` if used as regex literal — but PoE's search treats `+` literally already in some implementations. Verify per-tool.
3. **Generating empty patterns.** A filter where the user selects 0 mods should return "" (empty string) or a one-line message, not a regex that crashes the search.
4. **Single-template approach.** Building output as `prefix + middle + suffix` template strings makes splitting hard. Always build as an array of clauses, then `.join('|')` and split when needed.
5. **Hardcoding mod text from training data.** Always source from `src/data/itemMods.js` or the equivalent — wiki text drifts patch over patch.

### Performance note

Some Omnilyth regex calculators iterate over the full `src/data/itemMods.js` (2.9 MB) on every run. The Performance Auditor has flagged these for lazy-loading; verify the hot path is gated behind `useMemo` over the input filter, not the source data.

## Source excerpts

> "Stash search supports regular expressions. The search field is limited to 250 characters."
> — Community-derived (the official wiki documents stash search shape but not the explicit limit, which is empirically 250).

## Related Omnilyth files

- `src/calculators/itemRegex.js` — over `src/data/itemMods.js`.
- `src/calculators/mapModRegex.js` — over a curated map-mod fragment set.
- `src/calculators/scarabRegex.js` — canonical reference for the 250-char split logic.
- `src/calculators/vendorRegex.js` — over `src/data/vendorLevelingStats.js`.
- `src/calculators/gemRegex.js` — over `src/data/leveling/gemAvailability.js`.
- `src/components/SaveRegexButton.jsx` — the UI element for copying / saving the output.

If you find regex output that's silently broken (>250 chars, wrong escape, or missing split), file a bug for `calculator-engineer`.
