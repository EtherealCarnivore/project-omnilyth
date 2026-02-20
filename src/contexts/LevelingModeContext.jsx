/**
 * LevelingModeContext
 * Manages Leveling Mode state, persistence, and transitions
 *
 * Features:
 * - Enter/Exit leveling mode
 * - 7-day timeout (auto-exit if inactive)
 * - Smart exit confirmation (only if significant progress)
 * - Progress tracking integration
 */

import { createContext, useContext, useState, useEffect } from 'react';

const LevelingModeContext = createContext();

export const useLevelingMode = () => {
  const context = useContext(LevelingModeContext);
  if (!context) {
    throw new Error('useLevelingMode must be used within LevelingModeProvider');
  }
  return context;
};

const STORAGE_KEY = 'omnilyth_leveling_mode';
const TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Additional storage keys for gem progression
const CLASS_STORAGE_KEY = 'omnilyth_selected_class';
const MODE_STORAGE_KEY = 'omnilyth_leveling_mode_type';
const ACT_STORAGE_KEY = 'omnilyth_current_act';

export const LevelingModeProvider = ({ children }) => {
  // Load state from localStorage
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return { isActive: false, lastActivity: Date.now() };

      const parsed = JSON.parse(saved);

      // Auto-exit if timeout exceeded
      const timeSinceLastActivity = Date.now() - (parsed.lastActivity || 0);
      if (timeSinceLastActivity > TIMEOUT_MS) {
        return { isActive: false, lastActivity: Date.now() };
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load leveling mode state:', error);
      return { isActive: false, lastActivity: Date.now() };
    }
  });

  // Selected character class (for gem filtering)
  const [selectedClass, setSelectedClass] = useState(() => {
    try {
      return localStorage.getItem(CLASS_STORAGE_KEY) || 'all';
    } catch {
      return 'all';
    }
  });

  // Mode type: 'fresh' (new character) or 'alt' (alt character)
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(MODE_STORAGE_KEY) || 'fresh';
    } catch {
      return 'fresh';
    }
  });

  // Current act (for "next unlock" feature)
  const [currentAct, setCurrentAct] = useState(() => {
    try {
      return parseInt(localStorage.getItem(ACT_STORAGE_KEY) || '1');
    } catch {
      return 1;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save leveling mode state:', error);
    }
  }, [state]);

  // Persist selected class
  useEffect(() => {
    try {
      localStorage.setItem(CLASS_STORAGE_KEY, selectedClass);
    } catch (error) {
      console.error('Failed to save selected class:', error);
    }
  }, [selectedClass]);

  // Persist mode
  useEffect(() => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save mode:', error);
    }
  }, [mode]);

  // Persist current act
  useEffect(() => {
    try {
      localStorage.setItem(ACT_STORAGE_KEY, currentAct.toString());
    } catch (error) {
      console.error('Failed to save current act:', error);
    }
  }, [currentAct]);

  // Update last activity timestamp
  const updateActivity = () => {
    setState(prev => ({ ...prev, lastActivity: Date.now() }));
  };

  // Enter leveling mode
  const enterLevelingMode = () => {
    setState(prev => ({
      ...prev,
      isActive: true,
      lastActivity: Date.now()
    }));
  };

  // Exit leveling mode
  const exitLevelingMode = () => {
    setState(prev => ({
      ...prev,
      isActive: false,
      lastActivity: Date.now()
    }));
  };

  // Toggle leveling mode
  const toggleLevelingMode = () => {
    if (state.isActive) {
      exitLevelingMode();
    } else {
      enterLevelingMode();
    }
  };

  const value = {
    // Legacy leveling mode state
    isActive: state.isActive,
    lastActivity: state.lastActivity,
    enterLevelingMode,
    exitLevelingMode,
    toggleLevelingMode,
    updateActivity,
    // Gem progression state
    selectedClass,
    setSelectedClass,
    mode,
    setMode,
    currentAct,
    setCurrentAct
  };

  return (
    <LevelingModeContext.Provider value={value}>
      {children}
    </LevelingModeContext.Provider>
  );
};
