/**
 * poe2Regex.js — Shared regex-generation helper for PoE 2 stash-search tools.
 *
 * PoE's in-game search expects a single quoted regex with `|` alternation
 * between *short, disambiguating fragments* — not the verbatim mod text.
 * Example output: `"Size|Rare M|fe$|extra Damage as Cold"`
 *
 * For each selected mod we compute the shortest substring that:
 *   1. Appears in the selected mod's text, AND
 *   2. Does NOT appear in any other mod from the same pool.
 *
 * If no short substring disambiguates (mods are near-duplicates like
 * "increased Rare Monsters" vs "increased number of Rare Monsters"), we
 * fall back to anchor variants (^prefix, suffix$) and finally the full
 * text. The result is packed into chunks ≤ MAX_LEN chars (50 by default,
 * configurable for the rare longer-stash-search use case).
 *
 * Pure function. Generic over mod source — same helper drives Item Mod
 * Regex + Waystone Mod Regex + future PoE 2 stash-search-shaped tools.
 */

export const DEFAULT_MAX_LEN = 50;

/**
 * Convert a minimum integer threshold into a regex matching any integer ≥ n.
 * Assumes display values are 1–3 digits (PoE display ranges); 4+ digits
 * fall back to the literal value (rare in practice).
 *
 * `round10`: floor n to the nearest 10. So 33 with round10=true acts as
 * 30 — produces a more permissive regex (matches a few values below the
 * exact threshold) at no length cost.
 *
 * Examples:
 *   regexForMin(30)             → "[4-9]\\d|3[0-9]|\\d{3}"
 *   regexForMin(33)             → "[4-9]\\d|3[3-9]|\\d{3}"
 *   regexForMin(33, true)       → "[4-9]\\d|3[0-9]|\\d{3}"  (rounded → 30)
 */
export function regexForMin(n, round10 = false) {
  let v = n;
  if (round10) v = Math.floor(v / 10) * 10;
  if (v <= 0) return '\\d+';
  if (v > 999) return String(v);

  const s = String(v);
  const k = s.length;

  const parts = [];
  let prefix = '';
  for (let i = 0; i < k; i++) {
    const d = Number(s[i]);
    if (i === k - 1) {
      parts.push(`${prefix}[${d}-9]`);
    } else if (d < 9) {
      parts.push(`${prefix}[${d + 1}-9]${'\\d'.repeat(k - i - 1)}`);
    }
    prefix += s[i];
  }
  if (k < 3) parts.push(`\\d{${k + 1},3}`);

  return parts.length === 1 ? parts[0] : parts.join('|');
}

/** Strip `#` placeholders + collapse whitespace. */
function normalize(text) {
  return text.replace(/#/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Find the shortest substring of `target` (normalized) that does NOT
 * appear in any of `others` (also normalized). Tries unanchored fragments
 * first, then falls back to ^prefix / suffix$ anchors, then the full
 * normalized text as a last resort.
 *
 * Search is case-insensitive (PoE search is too) — internal comparisons
 * lowercase both sides; the returned fragment preserves the source case.
 */
export function shortestUniqueFragment(target, others) {
  const t = normalize(target);
  const tLower = t.toLowerCase();
  const othersLower = others.map((s) => normalize(s).toLowerCase());

  function isUnique(candidateLower) {
    return !othersLower.some((o) => o.includes(candidateLower));
  }

  // Try every substring length from 2 chars up. Within each length, prefer
  // earlier positions (loose preference for stable, predictable output).
  for (let len = 2; len <= t.length; len++) {
    for (let start = 0; start + len <= t.length; start++) {
      const cand = t.slice(start, start + len);
      if (isUnique(cand.toLowerCase())) return cand;
    }
  }

  // Anchored fallbacks. Useful when one mod is a substring-prefix of another
  // (e.g. "increased Rare Monsters" lives inside "increased number of Rare
  // Monsters" only by considering trailing context — but anchoring at the
  // mod start/end side-steps that).
  for (let len = 2; len <= t.length; len++) {
    const head = t.slice(0, len);
    const headLower = head.toLowerCase();
    if (!othersLower.some((o) => o.startsWith(headLower))) {
      return `^${head}`;
    }
  }
  for (let len = 2; len <= t.length; len++) {
    const tail = t.slice(t.length - len);
    const tailLower = tail.toLowerCase();
    if (!othersLower.some((o) => o.endsWith(tailLower))) {
      return `${tail}$`;
    }
  }

  // Last resort: full text. Never matches unique, but at least the user
  // sees something rather than empty output.
  return t;
}

/**
 * Pack fragments into ≤ maxLen-char chunks. Each chunk is `"frag1|frag2|…"`
 * including the surrounding double-quotes — so the budget is maxLen − 2 of
 * payload per chunk.
 */
function packChunks(fragments, maxLen) {
  const budget = maxLen - 2; // surrounding quotes
  const chunks = [];
  let current = [];
  let currentLen = 0;

  for (const frag of fragments) {
    const sep = current.length > 0 ? 1 : 0;
    if (currentLen + sep + frag.length <= budget) {
      current.push(frag);
      currentLen += sep + frag.length;
    } else {
      if (current.length) chunks.push(`"${current.join('|')}"`);
      // Single fragment longer than the budget: ship it alone (will exceed
      // limit but is the user's signal that the mod text is too generic).
      current = [frag];
      currentLen = frag.length;
    }
  }
  if (current.length) chunks.push(`"${current.join('|')}"`);
  return chunks;
}

/**
 * Generate quoted-regex chunks for an array of selected items.
 *
 * Each `selected` item is either:
 *   - A flat mod descriptor: { text }
 *   - A waystone-style affix:  { lines: [text, ...], regex?: string }
 *
 * For affixes with a precomputed `regex` field (hand-curated unique
 * fragment), that fragment is emitted verbatim — no algorithmic search.
 * For affixes without one, we compute the shortest substring of ANY of
 * the affix's `lines` that uniquely identifies it within the pool's
 * combined line set.
 *
 * @param {Array} selected - Mods/affixes the user picked.
 * @param {Array} pool     - The full pool (selected + the rest). Used to
 *                           compute disambiguating fragments for entries
 *                           without a precomputed `regex`.
 * @param {{maxLen?:number}} options
 * @returns {string[]} One or more quoted patterns, each ≤ maxLen chars.
 */
export function generateRegex(selected, pool, options = {}) {
  const { maxLen = DEFAULT_MAX_LEN } = options;
  if (!selected || !selected.length) return [];

  // Normalize input: flat mods become single-line affixes for uniform
  // handling downstream.
  const selectedAffixes = selected.map(toAffix);
  const poolAffixes = (pool || []).map(toAffix);

  // Build the "others" pool (lines that belong to UN-selected affixes).
  const selectedKeys = new Set(selectedAffixes.map(affixKey));
  const otherLines = poolAffixes
    .filter((a) => !selectedKeys.has(affixKey(a)))
    .flatMap((a) => a.lines);

  const fragments = selectedAffixes.map((affix) => {
    let frag;
    if (affix.regex) {
      frag = affix.regex; // precomputed, hand-curated
    } else {
      // Algorithmic: find the shortest substring of ANY of this affix's
      // lines that is unique relative to lines belonging to OTHER affixes.
      let best = null;
      for (const line of affix.lines) {
        const cand = shortestUniqueFragment(line, otherLines);
        if (best === null || cand.length < best.length) best = cand;
      }
      frag = best || affix.lines[0];
    }
    // If the user set a minValue threshold for this affix, prepend the
    // numeric-range regex + `.*` so the pattern matches "value ≥ min" then
    // anything then the disambiguating fragment.
    if (typeof affix.minValue === 'number' && affix.minValue > 0) {
      frag = `${regexForMin(affix.minValue, options.round10)}.*${frag}`;
    }
    return frag;
  });

  return packChunks(fragments, maxLen);
}

/** Coerce a flat mod or a waystone-style affix into a uniform shape. */
function toAffix(item) {
  if (Array.isArray(item.lines)) return item; // already an affix
  return { lines: [item.text], regex: null, affix: item.affix, minValue: item.minValue };
}

/** Stable identity for affix dedup. */
function affixKey(a) {
  return a.lines.join('||');
}
