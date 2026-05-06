import { allGems } from '../data/gemData';

// QUIRK: PoE's in-game stash search has a hard 250-character cap per query.
// Patterns over this are silently rejected — no error toast, just no matches.
// Mirrored in scarabRegex.js, vendorRegex.js, mapModRegex.js. If GGG ever
// raises the cap, all four constants need updating in lockstep.
const MAX_LEN = 250;

/**
 * Generates one or more regex strings from selected gem names,
 * each fitting within PoE's 250-character limit.
 * Returns an array of regex strings like `"tok1|tok2|tok3"`.
 *
 * When useStrictAwakened is true (default), awakened gems use the longer
 * "awa.+token.+support" format that won't false-match item mods in stash.
 * When false, uses the shorter plain-substring tokens.
 */
export function generateGemRegexes(selectedNames, { useStrictAwakened = true } = {}) {
  const tokens = selectedNames.map(name => {
    const gem = allGems[name];
    if (!gem) return null;
    if (!useStrictAwakened && gem.regexShort) return gem.regexShort;
    return gem.regex;
  }).filter(Boolean);
  if (tokens.length === 0) return [];

  const chunks = [];
  let current = [];

  for (const token of tokens) {
    // Greedy bin-pack: keep stuffing tokens into `current` until the next
    // would push the joined chunk past 250 chars, then flush and start fresh.
    // Format: "tok1|tok2|...|tokN" — quotes (2) + joins (|) between tokens
    const wouldBe = current.length === 0
      ? 2 + token.length
      : 2 + current.reduce((s, t) => s + t.length, 0) + (current.length - 1) + 1 + token.length;

    if (wouldBe > MAX_LEN && current.length > 0) {
      chunks.push(`"${current.join('|')}"`);
      current = [token];
    } else {
      current.push(token);
    }
  }

  if (current.length > 0) {
    chunks.push(`"${current.join('|')}"`);
  }

  return chunks;
}
