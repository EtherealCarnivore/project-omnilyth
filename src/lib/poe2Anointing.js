/**
 * poe2Anointing.js — Liquid Emotion anointing lookup (PoE 2).
 *
 * Mechanic: 3 Liquid Emotions (multiset of 3 emotion IDs) → passive-tree
 * notable, displayed on an equipped amulet. Two access patterns:
 *
 *   Forward : findNotableForCombo([e1, e2, e3]) → notableId | null
 *   Reverse : findRecipesForNotable(notableId)  → recipe[]
 *
 * Data source: src/data/poe2/anointing/combinations.json (not yet ingested).
 * v1 scrape target: poe2db.tw/us/Liquid_Emotions (aoeah refused full-table
 * extraction on copyright grounds — do not scrape it). Refresh post-patch-notes
 * 2026-05-22.
 *
 * Math contract: .claude/knowledge/poe2/cached/liquid-emotion-anointing.md
 * Validation : poe2-mechanics-expert + poe-wiki-oracle (2026-05-17).
 *
 * Open question (calculator-engineer to resolve): combo is *ordered tuple*
 * per oracle's poe2db reading, but mechanics-expert defaulted to multiset
 * per PoE 1 convention. Confirm against in-game UI on 2026-05-29 launch.
 * Stub keys both directions below until that's settled.
 */

// Canonical key for a combo. Stub: lexical sort of emotion IDs (multiset path).
// If 0.5 UI shows slot positions, swap to identity (preserve order).
export function canonicalComboKey(emotionIds) {
  return [...emotionIds].sort().join('|');
}

// Forward: 3 emotions → notable. Returns the notableId, or null if combo is a sink.
// recipeIndex is a Map<canonicalKey, notableId>; build once at data load.
export function findNotableForCombo(_emotionIds, _recipeIndex) {
  // calculator-engineer: implement against canonicalComboKey + recipeIndex lookup.
  return null;
}

// Reverse: notable → recipe[]. May return >1 entry once Potent variants land.
// reverseIndex is a Map<notableId, recipe[]>; build once at data load.
export function findRecipesForNotable(_notableId, _reverseIndex) {
  // calculator-engineer: implement against reverseIndex lookup.
  return [];
}
