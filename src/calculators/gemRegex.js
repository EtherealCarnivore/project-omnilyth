import { allGems } from '../data/gemData';

// PoE's stash search has a 250-char limit.
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
