/**
 * mercenaryTradeQuery.js — builds official PoE 1 trade-site queries for Mercenary Warrants.
 *
 * Trade-site semantics (measured against /api/trade/search/Covens, 2026-11-21):
 *   - `and` group: every filter must match somewhere on the warrant.
 *   - `mercenary` group with no `value`: the supports must be on that skill.
 *     (Frost Blades + Chain T2 on Frost Blades = 5,036 vs 6,637 for "both
 *     anywhere".)
 *   - `mercenary` group with `value.min`: the skill filter itself counts toward
 *     the minimum, so a wanted skill is also put in the `and` group to keep it
 *     required. value.min is therefore the link count (skill + supports).
 *   - A support family (Lesser / normal / Greater) is sent as every tier in the
 *     same group. A skill carries one tier of a family at most, so with
 *     value.min each family counts once and "all families" = 1 + families.
 *   - `not` group: excluded on any skill of the warrant.
 *
 * Complexity, observed: an and/not group costs about 4 + 1 per filter; a
 * mercenary group costs about 35 + 1 per filter. Logged-in users get a higher
 * cap than anonymous API calls.
 */

export const TRADE_STATUS_OPTIONS = [
  { value: 'securable', label: 'Instant Buyout' },
  { value: 'available', label: 'Instant Buyout and In Person' },
  { value: 'online', label: 'In Person (Online in League)' },
  { value: 'any', label: 'Any' },
];

// Enabled is the default; leaving `disabled` out keeps the ?q= link short.
const filter = (id) => ({ id });

/** Above this a ?q= link risks being refused by the trade site (limit unmeasured). */
export const MAX_LINK_LENGTH = 8000;
const uniq = (ids) => [...new Set(ids)];

/**
 * @param {object} spec
 * @param {string} spec.status               trade status option
 * @param {Array<{skillId: string, supportGroups?: string[][], minLinks?: number|null}>} spec.wanted
 *        supportGroups: one array of tier ids per support family.
 *        minLinks: skill + supports that must be linked; null means every family.
 * @param {string[]} [spec.excludedSkillIds]
 * @param {string[]} [spec.excludedSupportIds]
 * @returns {{ query: object, sort: object }}
 */
export function buildMercenaryQuery({ status = 'securable', wanted = [], excludedSkillIds = [], excludedSupportIds = [] }) {
  const stats = [];

  const required = uniq(wanted.map((w) => w.skillId));
  if (required.length) stats.push({ type: 'and', filters: required.map(filter) });

  for (const w of wanted) {
    const groups = (w.supportGroups ?? []).filter((g) => g.length);
    if (!groups.length) continue;
    const all = 1 + groups.length;
    const min = Math.min(all, Math.max(2, w.minLinks ?? all));
    stats.push({
      type: 'mercenary',
      filters: uniq([w.skillId, ...groups.flat()]).map(filter),
      value: { min },
    });
  }

  const excluded = uniq([...excludedSkillIds, ...excludedSupportIds]);
  if (excluded.length) stats.push({ type: 'not', filters: excluded.map(filter) });

  return {
    query: {
      status: { option: status },
      stats,
      filters: { trade_filters: { filters: { sale_type: { option: 'priced' } } } },
    },
    sort: { price: 'asc' },
  };
}

/** Rough complexity estimate (see header). The trade API's own number wins when known. */
export function estimateComplexity(payload) {
  return payload.query.stats.reduce(
    (sum, g) => sum + (g.type === 'mercenary' ? 35 : 4) + g.filters.length,
    0,
  );
}

/** Link that opens the search on the trade site with the user's own login. */
export function tradeSearchUrl(league, payload) {
  return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}?q=${encodeURIComponent(JSON.stringify(payload))}`;
}

/** Short link for a search id returned by the trade API. */
export function tradeResultUrl(league, searchId) {
  return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}/${encodeURIComponent(searchId)}`;
}
