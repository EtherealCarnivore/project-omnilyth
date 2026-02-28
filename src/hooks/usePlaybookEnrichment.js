/**
 * usePlaybookEnrichment
 *
 * Returns enrichment data from the active playbook for a given zone area.
 * Returns null when playbook mode is disabled or no playbook is selected.
 */

import { useMemo } from 'react';
import { usePlaybook } from '../contexts/PlaybookContext';
import {
  findRouteStepForZone,
  findBossForZone,
  getDecisionPointsForZone
} from '../utils/playbookZoneMatching';

export function usePlaybookEnrichment(area) {
  const { playbookModeEnabled, currentPlaybook } = usePlaybook();

  return useMemo(() => {
    if (!playbookModeEnabled || !currentPlaybook || !area) return null;

    const actData = currentPlaybook.acts.find(a => a.act === area.act);
    if (!actData) return null;

    const routeStep = findRouteStepForZone(area.name, actData);
    const boss = findBossForZone(area.name, actData);
    const decisions = getDecisionPointsForZone(area.name, actData);

    const hasEnrichment = !!(routeStep || boss || decisions.length > 0);

    if (!hasEnrichment) return null;

    return {
      hasEnrichment,
      routeStep,
      boss,
      decisions,
      playbookName: currentPlaybook.name
    };
  }, [playbookModeEnabled, currentPlaybook, area]);
}
