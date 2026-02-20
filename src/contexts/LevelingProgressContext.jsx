/**
 * Leveling Progress Context
 * Tracks completion state for acts and zones with localStorage persistence
 * Uses area IDs from act data files for zone and objective tracking
 */

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { acts123Data } from '../data/leveling/acts123-data';
import { acts456Data } from '../data/leveling/acts456-data';
import { acts789Data } from '../data/leveling/acts789-data';
import { act10Data } from '../data/leveling/act10-data';

const LevelingProgressContext = createContext();

export const useLevelingProgress = () => {
  const context = useContext(LevelingProgressContext);
  if (!context) {
    throw new Error('useLevelingProgress must be used within LevelingProgressProvider');
  }
  return context;
};

export const LevelingProgressProvider = ({ children }) => {
  const STORAGE_KEY = 'poe-leveling-progress-v2';
  const MODE_KEY = 'poe-leveling-mode';

  // Combine all area data
  const areas = useMemo(() => {
    return [
      ...acts123Data.areas,
      ...acts456Data.areas,
      ...acts789Data.areas,
      ...act10Data.areas
    ];
  }, []);

  // Load mode from localStorage (default: 'fresh')
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY);
      return saved || 'fresh';
    } catch (error) {
      console.error('Failed to load leveling mode:', error);
      return 'fresh';
    }
  });

  // Load progress from localStorage or initialize empty
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { zones: [], objectives: [] };
    } catch (error) {
      console.error('Failed to load leveling progress:', error);
      return { zones: [], objectives: [] };
    }
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save leveling progress:', error);
    }
  }, [progress]);

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch (error) {
      console.error('Failed to save leveling mode:', error);
    }
  }, [mode]);

  // Toggle a single zone (by area ID like "act1-area-0")
  const toggleZone = (areaId) => {
    setProgress(prev => {
      const zones = [...prev.zones];
      const index = zones.indexOf(areaId);

      if (index >= 0) {
        // Remove if exists
        zones.splice(index, 1);
      } else {
        // Add if doesn't exist
        zones.push(areaId);
      }

      return { ...prev, zones };
    });
  };

  // Toggle an objective (by composite ID like "act1-area-0-Complete objectives")
  const toggleObjective = (objectiveId) => {
    setProgress(prev => {
      const objectives = [...prev.objectives];
      const index = objectives.indexOf(objectiveId);

      if (index >= 0) {
        // Remove if exists
        objectives.splice(index, 1);
      } else {
        // Add if doesn't exist
        objectives.push(objectiveId);
      }

      return { ...prev, objectives };
    });
  };

  // Reset all progress
  const resetProgress = () => {
    setProgress({ zones: [], objectives: [] });
  };

  const value = {
    mode,
    setMode,
    areas,
    completedZones: progress.zones || [],
    completedObjectives: progress.objectives || [],
    toggleZone,
    toggleObjective,
    resetProgress
  };

  return (
    <LevelingProgressContext.Provider value={value}>
      {children}
    </LevelingProgressContext.Provider>
  );
};
