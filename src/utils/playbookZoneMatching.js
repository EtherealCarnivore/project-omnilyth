/**
 * Playbook Zone Matching Utilities
 *
 * Bridges playbook zone names to leveling data zone names.
 * Handles "The " prefix differences and other normalization.
 *
 * Examples:
 * - Playbook: 'Twilight Strand' -> Data: 'The Twilight Strand'
 * - Playbook: 'Mud Flats' -> Data: 'The Mud Flats'
 * - Playbook: 'The Coast' -> Data: 'The Coast' (exact match)
 */

/**
 * Normalize a zone name for comparison:
 * lowercase, strip "The " prefix, trim whitespace
 */
export function normalizeZoneName(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/^the\s+/, '').trim();
}

/**
 * Check if two zone names match after normalization
 */
function zonesMatch(a, b) {
  return normalizeZoneName(a) === normalizeZoneName(b);
}

/**
 * Find the route step that matches a given zone name.
 * Returns the route step object or null.
 */
export function findRouteStepForZone(zoneName, playbookActData) {
  if (!playbookActData?.route) return null;

  return playbookActData.route.find(step => zonesMatch(step.zone, zoneName)) || null;
}

/**
 * Find a boss that exists in a given zone.
 * Matches by checking if the boss zone/name appears in the zone name,
 * or if the zone name appears in common boss location patterns.
 */
export function findBossForZone(zoneName, playbookActData) {
  if (!playbookActData?.bosses) return null;

  const normalized = normalizeZoneName(zoneName);

  return playbookActData.bosses.find(boss => {
    // Check route steps to find which zone has this boss
    // Boss locations are implied by the route - e.g., Brutus is in Upper Prison
    const bossRoute = playbookActData.route?.find(step => {
      const stepNorm = normalizeZoneName(step.zone);
      // Check if the route step mentions the boss
      return step.objective?.toLowerCase().includes(boss.name.toLowerCase()) &&
        stepNorm === normalized;
    });

    if (bossRoute) return true;

    // Also check if the zone name contains known boss location patterns
    // e.g., "Merveil's Cavern" contains "merveil"
    if (normalized.includes(boss.name.toLowerCase())) return true;

    return false;
  }) || null;
}

/**
 * Find decision points that reference a given zone.
 * Matches by checking if the decision condition/reasoning mentions the zone name.
 */
export function getDecisionPointsForZone(zoneName, playbookActData) {
  if (!playbookActData?.decisionPoints) return [];

  const normalized = normalizeZoneName(zoneName);

  return playbookActData.decisionPoints.filter(dp => {
    const searchText = [dp.condition, dp.reasoning, dp.ifTrue, dp.ifFalse]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchText.includes(normalized) ||
      (zoneName && searchText.includes(zoneName.toLowerCase()));
  });
}
