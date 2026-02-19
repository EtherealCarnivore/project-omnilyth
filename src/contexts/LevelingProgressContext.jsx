/**
 * Leveling Progress Context
 * Tracks completion state for acts and zones with localStorage persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';

const LevelingProgressContext = createContext();

export const useLevelingProgress = () => {
  const context = useContext(LevelingProgressContext);
  if (!context) {
    throw new Error('useLevelingProgress must be used within LevelingProgressProvider');
  }
  return context;
};

export const LevelingProgressProvider = ({ children }) => {
  const STORAGE_KEY = 'poe-leveling-progress';
  const MODE_KEY = 'poe-leveling-mode';

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
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Failed to load leveling progress:', error);
      return {};
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

  // Check if a zone is completed
  const isZoneCompleted = (actNum, zoneIndex) => {
    return progress[`act-${actNum}`]?.zones?.[zoneIndex] === true;
  };

  // Check if an act is completed (all zones done)
  const isActCompleted = (actNum, totalZones) => {
    const actProgress = progress[`act-${actNum}`]?.zones;
    if (!actProgress) return false;

    for (let i = 0; i < totalZones; i++) {
      if (!actProgress[i]) return false;
    }
    return true;
  };

  // Toggle a single zone
  const toggleZone = (actNum, zoneIndex) => {
    setProgress(prev => {
      const actKey = `act-${actNum}`;
      const newProgress = { ...prev };

      if (!newProgress[actKey]) {
        newProgress[actKey] = { zones: {} };
      }

      if (!newProgress[actKey].zones) {
        newProgress[actKey].zones = {};
      }

      // Toggle the zone
      newProgress[actKey].zones[zoneIndex] = !newProgress[actKey].zones[zoneIndex];

      return newProgress;
    });
  };

  // Mark entire act as completed
  const markActCompleted = (actNum, totalZones) => {
    setProgress(prev => {
      const actKey = `act-${actNum}`;
      const newProgress = { ...prev };

      newProgress[actKey] = {
        zones: {}
      };

      // Mark all zones as completed
      for (let i = 0; i < totalZones; i++) {
        newProgress[actKey].zones[i] = true;
      }

      return newProgress;
    });
  };

  // Mark entire act as incomplete
  const markActIncomplete = (actNum) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[`act-${actNum}`];
      return newProgress;
    });
  };

  // Get overall progress stats
  const getOverallProgress = (acts) => {
    let completedZones = 0;
    let totalZones = 0;

    acts.forEach(act => {
      totalZones += act.zones.length;
      act.zones.forEach((_, index) => {
        if (isZoneCompleted(act.act, index)) {
          completedZones++;
        }
      });
    });

    return {
      completedZones,
      totalZones,
      percentage: totalZones > 0 ? Math.round((completedZones / totalZones) * 100) : 0
    };
  };

  // Find next incomplete zone
  const getNextIncompleteZone = (acts) => {
    for (const act of acts) {
      for (let i = 0; i < act.zones.length; i++) {
        if (!isZoneCompleted(act.act, i)) {
          return {
            act: act.act,
            zoneIndex: i,
            zoneName: act.zones[i].name
          };
        }
      }
    }
    return null; // All completed!
  };

  // Reset all progress
  const resetProgress = () => {
    setProgress({});
  };

  const value = {
    mode,
    setMode,
    progress,
    isZoneCompleted,
    isActCompleted,
    toggleZone,
    markActCompleted,
    markActIncomplete,
    getOverallProgress,
    getNextIncompleteZone,
    resetProgress
  };

  return (
    <LevelingProgressContext.Provider value={value}>
      {children}
    </LevelingProgressContext.Provider>
  );
};
