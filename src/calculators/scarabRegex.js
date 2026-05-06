import { scarabs } from '../data/scarabData';

// PoE's stash search has a 250-char limit because apparently GGG's regex engine
// runs on a potato. We must chunk our output to fit.
// LINK: same constant + bin-pack pattern lives in src/calculators/{gemRegex,
// vendorRegex,mapModRegex}.js — keep them in sync if GGG ever bumps the cap.
const MAX_LEN = 250;

/**
 * Generates one or more regex strings from selected scarab names,
 * each fitting within PoE's 250-character limit.
 * Cuts at valid token boundaries (between `|`-separated tokens).
 * Returns an array of regex strings like `"tok1|tok2|tok3"`.
 *
 * This is basically a bin-packing problem disguised as string concatenation.
 * At least it's not NP-hard... just NP-annoying.
 * Same greedy algorithm I'd use for order batching. Except there the chunks
 * go to an exchange and here they go to a PoE stash search bar. Same energy.
 */
export function generateScarabRegexes(selectedNames) {
  const tokens = selectedNames.map(name => scarabs[name]?.regex).filter(Boolean);
  if (tokens.length === 0) return [];

  const chunks = [];
  let current = [];

  for (const token of tokens) {
    // Check if adding this token would exceed the limit
    // Format: "tok1|tok2|...|tokN" — quotes (2) + joins (|) between tokens
    const wouldBe = current.length === 0
      ? 2 + token.length                                    // "token"
      : 2 + current.reduce((s, t) => s + t.length, 0) + (current.length - 1) + 1 + token.length;
      // 2 quotes + existing tokens + existing pipes + new pipe + new token

    if (wouldBe > MAX_LEN && current.length > 0) {
      // Flush current chunk
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
