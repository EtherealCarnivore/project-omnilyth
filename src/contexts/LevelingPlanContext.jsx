/**
 * LevelingPlanContext
 * Manages leveling build plan state: selected gems, progress tracking, socket goals
 */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const LevelingPlanContext = createContext();

const STORAGE_KEY = 'poe-leveling-plan';

// Default empty plan
const defaultPlan = {
  characterClass: null,
  gems: [], // { name, level, priority, obtained, source, act, questName, colors, linkGroup }
  linkGroups: [], // { id, name, gems: [], sockets: '' }
  createdAt: null,
  updatedAt: null,
};

export function LevelingPlanProvider({ children }) {
  const [plan, setPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultPlan;
    } catch (err) {
      console.error('Failed to load leveling plan:', err);
      return defaultPlan;
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...plan,
        updatedAt: new Date().toISOString(),
      }));
    } catch (err) {
      console.error('Failed to save leveling plan:', err);
    }
  }, [plan]);

  // Add gem to plan
  const addGem = (gemData) => {
    setPlan(prev => {
      // Don't add duplicates
      if (prev.gems.some(g => g.name === gemData.name)) {
        return prev;
      }

      const newGem = {
        name: gemData.name,
        icon: gemData.icon,
        type: gemData.type,
        level: estimateGemLevel(gemData),
        colors: estimateGemColors(gemData.name),
        source: gemData.availability?.[0]?.source || 'unknown',
        act: gemData.availability?.[0]?.act || null,
        questName: gemData.availability?.[0]?.questName || null,
        classes: gemData.availability?.[0]?.classes || [],
        obtained: false,
        addedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        gems: [...prev.gems, newGem],
      };
    });
  };

  // Remove gem from plan
  const removeGem = (gemName) => {
    setPlan(prev => ({
      ...prev,
      gems: prev.gems.filter(g => g.name !== gemName),
    }));
  };

  // Toggle gem obtained status
  const toggleObtained = (gemName) => {
    setPlan(prev => ({
      ...prev,
      gems: prev.gems.map(g =>
        g.name === gemName ? { ...g, obtained: !g.obtained } : g
      ),
    }));
  };

  // Set character class
  const setCharacterClass = (className) => {
    setPlan(prev => ({
      ...prev,
      characterClass: className,
      createdAt: prev.createdAt || new Date().toISOString(),
    }));
  };

  // Set link groups (bulk, from PoB import)
  const setLinkGroups = (groups) => {
    setPlan(prev => ({
      ...prev,
      linkGroups: groups,
    }));
  };

  // Update active link count for a specific group
  const updateLinkCount = (groupId, count) => {
    setPlan(prev => ({
      ...prev,
      linkGroups: prev.linkGroups.map(g =>
        g.id === groupId ? { ...g, activeLinks: count } : g
      ),
    }));
  };

  // Remove a link group
  const removeLinkGroup = (groupId) => {
    setPlan(prev => ({
      ...prev,
      linkGroups: prev.linkGroups.filter(g => g.id !== groupId),
    }));
  };

  // Clear entire plan
  const clearPlan = () => {
    setPlan(defaultPlan);
  };

  // Group gems by level ranges
  const gemsByLevel = useMemo(() => {
    const ranges = [
      { min: 1, max: 10, label: 'Level 1-10 (Act 1)' },
      { min: 10, max: 20, label: 'Level 10-20 (Act 2)' },
      { min: 20, max: 31, label: 'Level 20-31 (Act 3-4)' },
      { min: 31, max: 50, label: 'Level 31-50 (Act 4-6)' },
      { min: 50, max: 100, label: 'Level 50+ (Endgame)' },
    ];

    const grouped = {};
    ranges.forEach(range => {
      grouped[range.label] = plan.gems.filter(
        g => g.level >= range.min && g.level < range.max
      );
    });

    return grouped;
  }, [plan.gems]);

  // Calculate socket requirements for current plan
  const socketRequirements = useMemo(() => {
    const counts = { R: 0, G: 0, B: 0 };
    plan.gems.forEach(gem => {
      gem.colors.split('').forEach(color => {
        if (counts[color] !== undefined) counts[color]++;
      });
    });

    // Generate socket string (e.g., "3G-2R-1B")
    const parts = [];
    if (counts.R > 0) parts.push(`${counts.R}R`);
    if (counts.G > 0) parts.push(`${counts.G}G`);
    if (counts.B > 0) parts.push(`${counts.B}B`);

    return {
      R: counts.R,
      G: counts.G,
      B: counts.B,
      total: counts.R + counts.G + counts.B,
      string: parts.join('-'),
    };
  }, [plan.gems]);

  // Get plan statistics
  const stats = useMemo(() => ({
    total: plan.gems.length,
    obtained: plan.gems.filter(g => g.obtained).length,
    remaining: plan.gems.filter(g => !g.obtained).length,
    progress: plan.gems.length > 0
      ? Math.round((plan.gems.filter(g => g.obtained).length / plan.gems.length) * 100)
      : 0,
  }), [plan.gems]);

  const value = {
    plan,
    gems: plan.gems,
    linkGroups: plan.linkGroups,
    characterClass: plan.characterClass,
    addGem,
    removeGem,
    toggleObtained,
    setCharacterClass,
    setLinkGroups,
    updateLinkCount,
    removeLinkGroup,
    clearPlan,
    gemsByLevel,
    socketRequirements,
    stats,
  };

  return (
    <LevelingPlanContext.Provider value={value}>
      {children}
    </LevelingPlanContext.Provider>
  );
}

export function useLevelingPlan() {
  const context = useContext(LevelingPlanContext);
  if (!context) {
    throw new Error('useLevelingPlan must be used within LevelingPlanProvider');
  }
  return context;
}

// Helper: Estimate gem level based on availability
function estimateGemLevel(gemData) {
  const firstAvailability = gemData.availability?.[0];
  if (!firstAvailability) return 1;

  const { act, source, questId } = firstAvailability;

  // Quest rewards by quest ID (real level requirements from PoE Wiki)
  if (source === 'quest' && questId) {
    const QUEST_LEVELS = {
      // Act 1
      'a1q1': 1,   // Enemy at the Gate
      'a1q2': 1,   // Mercy Mission
      'a1q3': 4,   // Breaking Some Eggs / The Siren's Cadence
      'a1q4': 8,   // The Dweller of the Deep
      'a1q5': 8,   // The Marooned Mariner
      'a1q6': 10,  // The Way Forward
      // Act 2
      'a2q1': 10,  // Intruders in Black
      'a2q2': 12,  // Sharp and Cruel
      'a2q3': 16,  // Through Sacred Ground
      'a2q4': 19,  // Sever the Right Hand
      // Act 3
      'a3q1': 24,  // Lost in Love
      'a3q2': 24,  // Victario's Secrets
      'a3q3': 28,  // Sever the Right Hand (Act 3)
      'a3q4': 31,  // A Fixture of Fate (Siosa unlock)
      // Act 4
      'a4q1': 31,  // Breaking the Seal
      'a4q2': 34,  // The Eternal Nightmare
      'a4q3': 38,  // An Indomitable Spirit
    };

    return QUEST_LEVELS[questId] || 1;
  }

  // Fallback by act for quests without questId
  if (source === 'quest') {
    if (act === 1) return 4;
    if (act === 2) return 12;
    if (act === 3) return 24;
    if (act === 4) return 31;
  }

  // Siosa/Lilly
  if (source === 'siosa') return 24;
  if (source === 'lilly') return 38;

  return 1;
}

// Helper: Estimate gem socket colors based on name
function estimateGemColors(gemName) {
  const name = gemName.toLowerCase();

  // Support gems (usually same color as what they support)
  if (name.includes('support') || name.includes('inspiration') || name.includes('blessing')) {
    if (name.includes('melee') || name.includes('fortify') || name.includes('brutality')) return 'R';
    if (name.includes('pierce') || name.includes('projectile') || name.includes('mirage')) return 'G';
    if (name.includes('spell') || name.includes('unleash') || name.includes('arcane')) return 'B';
    return 'R'; // Default for unknown supports
  }

  // Red (Strength) - Melee, Fire, Physical
  if (name.includes('slam') || name.includes('strike') || name.includes('cleave') ||
      name.includes('sweep') || name.includes('earthquake') || name.includes('melee') ||
      name.includes('fire') || name.includes('burn') || name.includes('infernal') ||
      name.includes('molten') || name.includes('rage') || name.includes('warcry') ||
      name.includes('enduring')) {
    return 'R';
  }

  // Green (Dexterity) - Projectiles, Bow, Trap, Poison
  if (name.includes('arrow') || name.includes('bow') || name.includes('projectile') ||
      name.includes('trap') || name.includes('mine') || name.includes('poison') ||
      name.includes('venom') || name.includes('toxic') || name.includes('caustic') ||
      name.includes('ballista') || name.includes('tornado') || name.includes('blade vortex')) {
    return 'G';
  }

  // Blue (Intelligence) - Spells, Lightning, Cold, Chaos
  if (name.includes('spell') || name.includes('lightning') || name.includes('shock') ||
      name.includes('arc') || name.includes('storm') || name.includes('cold') ||
      name.includes('ice') || name.includes('frost') || name.includes('freeze') ||
      name.includes('chaos') || name.includes('blight') || name.includes('essence drain') ||
      name.includes('brand') || name.includes('orb') || name.includes('wave')) {
    return 'B';
  }

  // Default: Red for attacks, Blue for casters
  if (name.includes('attack')) return 'R';
  return 'B';
}
