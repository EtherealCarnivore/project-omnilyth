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

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save leveling mode state:', error);
    }
  }, [state]);

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
    isActive: state.isActive,
    lastActivity: state.lastActivity,
    enterLevelingMode,
    exitLevelingMode,
    toggleLevelingMode,
    updateActivity
  };

  return (
    <LevelingModeContext.Provider value={value}>
      {children}
    </LevelingModeContext.Provider>
  );
};
