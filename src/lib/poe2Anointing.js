/**
 * poe2Anointing.js — Liquid Emotion anointing lookup (PoE 2).
 *
 * Mechanic: 3 Liquid Emotions, anointed in an ORDERED sequence, enchant a
 * passive-tree notable onto an equipped amulet. Order matters — (A,B,C) and
 * (B,A,C) can map to different notables (197/216 multisets map to >1 notable).
 *
 * Data: src/data/poe2/anointing/{emotions,combinations}.json
 *   — datamined from poe2db.tw 2026-05-22 (pre-launch; verify at 2026-05-29).
 * Contract: .claude/knowledge/poe2/cached/liquid-emotion-anointing.md
 *
 *   Forward : findNotableForCombo([s1,s2,s3]) → recipe | null
 *   Reverse : searchNotables(query)           → recipe[]
 */
import emotionsData from '../data/poe2/anointing/emotions.json';
import combosData from '../data/poe2/anointing/combinations.json';

export const EMOTIONS = emotionsData.emotions;
export const ANOINT_META = combosData._meta;
export const ALL_RECIPES = combosData.recipes;

export const TIER_ORDER = ['diluted', 'standard', 'concentrated'];
export const TIER_LABELS = {
  diluted: 'Diluted',
  standard: 'Standard',
  concentrated: 'Concentrated',
};

const emotionById = new Map(EMOTIONS.map((e) => [e.id, e]));

// Ordered key — join in slot order, do NOT sort (order is meaningful).
const forwardIndex = new Map();
for (const r of ALL_RECIPES) {
  forwardIndex.set(r.e.join('|'), r);
}

export function emotionName(id) {
  return emotionById.get(id)?.displayName ?? id;
}

// Forward: an ordered triple of emotion ids → the recipe, or null if the
// combo anoints no notable (179 of 1000 ordered triples are no-ops).
export function findNotableForCombo(emotionIds) {
  if (!Array.isArray(emotionIds) || emotionIds.length !== 3) return null;
  if (emotionIds.some((id) => !id || !emotionById.has(id))) return null;
  return forwardIndex.get(emotionIds.join('|')) ?? null;
}

// Reverse: free-text notable search. Ranks exact > prefix > substring, then
// alphabetical. Returns recipes (each carries its ordered emotion triple).
export function searchNotables(query, limit = 60) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const r of ALL_RECIPES) {
    const name = r.notable.toLowerCase();
    const idx = name.indexOf(q);
    if (idx === -1) continue;
    const score = name === q ? 0 : idx === 0 ? 1 : 2;
    scored.push({ recipe: r, score });
  }
  scored.sort((a, b) => a.score - b.score || a.recipe.notable.localeCompare(b.recipe.notable));
  return scored.slice(0, limit).map((s) => s.recipe);
}
