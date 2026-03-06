/**
 * playbookGemParser.js
 * Parses playbook act gem data and link groups into a format
 * compatible with LevelingPlanContext's gem plan structure.
 *
 * Walks all playbook.acts[].gems[] entries, deduplicates, normalizes names,
 * looks up availability in gemAvailabilityData, and produces a ready-to-import plan.
 */

import { estimateGemLevel, estimateGemColors } from '../contexts/LevelingPlanContext';

// Normalize abbreviated playbook gem names to canonical gemAvailabilityData keys
const PLAYBOOK_NAME_ALIASES = {
  'Ancestral Call': 'Ancestral Call Support',
  'Volley': 'Volley Support',
  'Added Cold': 'Added Cold Damage Support',
  'Added Cold Damage': 'Added Cold Damage Support',
  'Added Lightning': 'Added Lightning Damage Support',
  'Added Lightning Damage': 'Added Lightning Damage Support',
  'Faster Attacks': 'Faster Attacks Support',
  'Multiple Traps': 'Multiple Traps Support',
  'Multistrike': 'Multistrike Support',
  'EDA': 'Elemental Damage with Attacks Support',
  'Elemental Damage with Attacks': 'Elemental Damage with Attacks Support',
  'Cast when Damage Taken': 'Cast when Damage Taken Support',
  'CWDT': 'Cast when Damage Taken Support',
  'Increased Duration': 'More Duration Support',
  'Increased Duration Support': 'More Duration Support',
  'Inc Duration': 'More Duration Support',
  'Lightning Pen': 'Lightning Penetration Support',
  'Lightning Penetration': 'Lightning Penetration Support',
  'Arrogance': 'Arrogance Support',
  'Volatility': 'Volatility Support',
};

// Actions that represent passive tree keystones, not gems
const SKIP_ACTIONS = new Set(['keystone']);

/**
 * Resolve a gem name to its canonical form in gemAvailabilityData.
 * Tries: exact match, alias map, "Vaal X" fallback to base gem for icon/availability.
 */
function resolveGemName(name, gemAvailabilityData) {
  // Exact match
  if (gemAvailabilityData[name]) {
    return { canonical: name, gemData: gemAvailabilityData[name], fallback: false };
  }

  // Alias map
  const aliased = PLAYBOOK_NAME_ALIASES[name];
  if (aliased && gemAvailabilityData[aliased]) {
    return { canonical: aliased, gemData: gemAvailabilityData[aliased], fallback: false };
  }

  // Vaal variant: check "Vaal X" first, then fall back to base gem "X"
  if (name.startsWith('Vaal ')) {
    const baseName = name.replace('Vaal ', '');
    if (gemAvailabilityData[name]) {
      return { canonical: name, gemData: gemAvailabilityData[name], fallback: false };
    }
    if (gemAvailabilityData[baseName]) {
      return { canonical: name, gemData: gemAvailabilityData[baseName], fallback: true };
    }
  }

  return null;
}

/**
 * Find the earliest availability entry for a specific class.
 * Returns the first availability where the class is included (or source is siosa/lilly).
 */
function findEarliestForClass(gemData, className) {
  if (!gemData?.availability?.length) return null;

  // First try class-specific quest rewards
  for (const avail of gemData.availability) {
    if (avail.source === 'quest' && avail.classes?.includes(className)) {
      return avail;
    }
  }

  // Then siosa (available to all)
  const siosa = gemData.availability.find(a => a.source === 'siosa');
  if (siosa) return siosa;

  // Then lilly (available to all)
  const lilly = gemData.availability.find(a => a.source === 'lilly');
  if (lilly) return lilly;

  // Fallback: first entry
  return gemData.availability[0];
}

/**
 * Build a gem plan from a playbook's act gem data and link groups.
 *
 * @param {Object} playbook - Full playbook object (e.g., smiteScionPlaybook)
 * @param {Object} gemAvailabilityData - The gemAvailabilityData export from gemAvailability.js
 * @returns {{ gems: Array, linkGroups: Array, skipped: Array }}
 */
export function buildGemPlanFromPlaybook(playbook, gemAvailabilityData) {
  const seen = new Set();
  const gems = [];
  const skipped = [];

  // Walk all acts and collect unique gems
  for (const act of playbook.acts) {
    if (!act.gems) continue;

    for (const entry of act.gems) {
      // Skip keystone actions (passive tree nodes, not gems)
      if (SKIP_ACTIONS.has(entry.action)) continue;

      for (const gemName of entry.gems) {
        if (seen.has(gemName)) continue;
        seen.add(gemName);

        const resolved = resolveGemName(gemName, gemAvailabilityData);

        if (resolved) {
          const { canonical, gemData, fallback } = resolved;
          const earliest = findEarliestForClass(gemData, playbook.class);

          const gemEntry = {
            name: canonical,
            icon: gemData.icon,
            type: gemData.type || (canonical.includes('Support') ? 'support' : 'active'),
            level: estimateGemLevel(gemData),
            colors: estimateGemColors(canonical),
            source: earliest?.source || 'unknown',
            act: earliest?.act || null,
            questName: earliest?.questName || null,
            classes: earliest?.classes || [],
            obtained: false,
            addedAt: new Date().toISOString(),
          };

          // If it was a Vaal fallback, override name to the Vaal version
          if (fallback) {
            gemEntry.name = gemName;
          }

          gems.push(gemEntry);
        } else {
          // Gem not found in availability data - create a fallback entry
          const isSupport = gemName.toLowerCase().includes('support');
          gems.push({
            name: gemName,
            icon: null,
            type: isSupport ? 'support' : 'active',
            level: entry.level || 1,
            colors: estimateGemColors(gemName),
            source: 'unknown',
            act: null,
            questName: null,
            classes: [],
            obtained: false,
            addedAt: new Date().toISOString(),
          });
          skipped.push(gemName);
        }
      }
    }
  }

  // Process link groups from playbook
  const linkGroups = (playbook.linkGroups || []).map(group => {
    const enrichedGems = group.gems.map(g => {
      const resolvedName = PLAYBOOK_NAME_ALIASES[g.name] || g.name;
      const gemData = gemAvailabilityData[resolvedName] || gemAvailabilityData[g.name];

      return {
        name: resolvedName,
        isSupport: g.isSupport,
        icon: gemData?.icon || null,
        colors: estimateGemColors(resolvedName),
      };
    });

    return {
      id: group.id,
      name: group.name,
      slot: group.slot,
      mainSkill: group.mainSkill,
      gems: enrichedGems,
      activeLinks: group.activeLinks || enrichedGems.length,
      sockets: group.sockets || enrichedGems.map(g => g.colors).join(''),
    };
  });

  return { gems, linkGroups, skipped };
}
