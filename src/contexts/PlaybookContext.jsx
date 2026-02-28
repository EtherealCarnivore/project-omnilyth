/**
 * PlaybookContext - State management for leveling playbooks
 *
 * Manages:
 * - Selected playbook
 * - Current act progress
 * - Completed checklist items
 * - Bookmarked decision points
 *
 * Persists to localStorage with key: omnilyth-playbook-state
 * Integrates with LevelingModeContext for shared state
 */

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { playbooks, getPlaybookById } from '../data/leveling/playbooks/index.js';

const PlaybookContext = createContext();

const STORAGE_KEY = 'omnilyth-playbook-state';
const STORAGE_VERSION = '1.0.0';

// Default state structure
const getDefaultState = () => ({
  version: STORAGE_VERSION,
  selectedPlaybookId: null,
  currentAct: 1,
  completedItems: {}, // { 'act1-c1': true, 'act1-c2': false, ... }
  bookmarkedDecisions: [], // ['act2-d1', 'act3-d2']
  collapsedSections: {}, // { 'act1-gear': true, 'act2-quests': false }
  playbookModeEnabled: false,
  lastUpdated: new Date().toISOString()
});

export function PlaybookProvider({ children }) {
  const [state, setState] = useState(getDefaultState);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Version migration (if needed in future)
        if (parsed.version !== STORAGE_VERSION) {
          console.warn('[PlaybookContext] Version mismatch, resetting state');
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        setState(parsed);
      }
    } catch (error) {
      console.error('[PlaybookContext] Failed to load state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...state,
          lastUpdated: new Date().toISOString()
        }));
      } catch (error) {
        console.error('[PlaybookContext] Failed to save state:', error);
      }
    }
  }, [state, isLoading]);

  // Get current playbook object
  const currentPlaybook = useMemo(() => {
    if (!state.selectedPlaybookId) return null;
    return getPlaybookById(state.selectedPlaybookId);
  }, [state.selectedPlaybookId]);

  // Get current act data
  const currentActData = useMemo(() => {
    if (!currentPlaybook) return null;
    return currentPlaybook.acts.find(act => act.act === state.currentAct);
  }, [currentPlaybook, state.currentAct]);

  // Calculate overall progress (% of checklist items completed)
  const progress = useMemo(() => {
    if (!currentPlaybook) return 0;

    const allItems = currentPlaybook.acts.flatMap(act =>
      act.checklistItems.map(item => item.id)
    );

    if (allItems.length === 0) return 0;

    const completedCount = allItems.filter(id => state.completedItems[id]).length;
    return Math.round((completedCount / allItems.length) * 100);
  }, [currentPlaybook, state.completedItems]);

  // Calculate act-specific progress
  const getActProgress = (actNumber) => {
    if (!currentPlaybook) return 0;

    const actData = currentPlaybook.acts.find(act => act.act === actNumber);
    if (!actData || !actData.checklistItems.length) return 0;

    const completedCount = actData.checklistItems.filter(
      item => state.completedItems[item.id]
    ).length;

    return Math.round((completedCount / actData.checklistItems.length) * 100);
  };

  // Select a playbook
  const selectPlaybook = (playbookId) => {
    setState(prev => ({
      ...prev,
      selectedPlaybookId: playbookId,
      currentAct: 1,
      completedItems: {},
      bookmarkedDecisions: [],
      collapsedSections: {}
    }));
  };

  // Clear current playbook
  const clearPlaybook = () => {
    setState(getDefaultState());
  };

  // Set current act
  const setCurrentAct = (actNumber) => {
    setState(prev => ({
      ...prev,
      currentAct: actNumber
    }));
  };

  // Toggle checklist item completion
  const toggleChecklistItem = (itemId) => {
    setState(prev => ({
      ...prev,
      completedItems: {
        ...prev.completedItems,
        [itemId]: !prev.completedItems[itemId]
      }
    }));
  };

  // Mark checklist item as complete
  const completeChecklistItem = (itemId) => {
    setState(prev => ({
      ...prev,
      completedItems: {
        ...prev.completedItems,
        [itemId]: true
      }
    }));
  };

  // Mark checklist item as incomplete
  const uncompleteChecklistItem = (itemId) => {
    setState(prev => ({
      ...prev,
      completedItems: {
        ...prev.completedItems,
        [itemId]: false
      }
    }));
  };

  // Check if checklist item is completed
  const isChecklistItemComplete = (itemId) => {
    return !!state.completedItems[itemId];
  };

  // Toggle decision point bookmark
  const toggleDecisionBookmark = (decisionId) => {
    setState(prev => {
      const isBookmarked = prev.bookmarkedDecisions.includes(decisionId);

      return {
        ...prev,
        bookmarkedDecisions: isBookmarked
          ? prev.bookmarkedDecisions.filter(id => id !== decisionId)
          : [...prev.bookmarkedDecisions, decisionId]
      };
    });
  };

  // Check if decision is bookmarked
  const isDecisionBookmarked = (decisionId) => {
    return state.bookmarkedDecisions.includes(decisionId);
  };

  // Toggle section collapse state
  const toggleSection = (sectionKey) => {
    setState(prev => ({
      ...prev,
      collapsedSections: {
        ...prev.collapsedSections,
        [sectionKey]: !prev.collapsedSections[sectionKey]
      }
    }));
  };

  // Check if section is collapsed
  const isSectionCollapsed = (sectionKey) => {
    return !!state.collapsedSections[sectionKey];
  };

  // Reset progress for current playbook
  const resetProgress = () => {
    setState(prev => ({
      ...prev,
      currentAct: 1,
      completedItems: {},
      bookmarkedDecisions: [],
      collapsedSections: {}
    }));
  };

  // Toggle playbook mode on/off for leveling mode integration
  const togglePlaybookMode = () => {
    setState(prev => ({
      ...prev,
      playbookModeEnabled: !prev.playbookModeEnabled
    }));
  };

  // Reset all state
  const resetAll = () => {
    setState(getDefaultState());
  };

  // Get mistakes relevant to current act
  const getCurrentActMistakes = () => {
    if (!currentActData) return [];
    return currentActData.mistakes || [];
  };

  // Get power spikes relevant to current level range
  const getPowerSpikesForAct = (actNumber) => {
    if (!currentPlaybook) return [];

    const actData = currentPlaybook.acts.find(act => act.act === actNumber);
    if (!actData) return [];

    const { levelRange } = actData;

    return currentPlaybook.powerSpikes.filter(
      spike => spike.level >= levelRange.enter && spike.level <= levelRange.exit
    );
  };

  // Get next incomplete checklist item
  const getNextChecklistItem = () => {
    if (!currentActData) return null;

    return currentActData.checklistItems.find(
      item => !state.completedItems[item.id]
    );
  };

  const value = {
    // State
    selectedPlaybookId: state.selectedPlaybookId,
    currentAct: state.currentAct,
    completedItems: state.completedItems,
    bookmarkedDecisions: state.bookmarkedDecisions,
    collapsedSections: state.collapsedSections,
    playbookModeEnabled: !!state.playbookModeEnabled,

    // Computed
    playbooks,
    currentPlaybook,
    currentActData,
    progress,
    isLoading,

    // Actions
    selectPlaybook,
    clearPlaybook,
    setCurrentAct,
    toggleChecklistItem,
    completeChecklistItem,
    uncompleteChecklistItem,
    isChecklistItemComplete,
    toggleDecisionBookmark,
    isDecisionBookmarked,
    toggleSection,
    isSectionCollapsed,
    resetProgress,
    resetAll,
    togglePlaybookMode,

    // Helpers
    getActProgress,
    getCurrentActMistakes,
    getPowerSpikesForAct,
    getNextChecklistItem
  };

  return (
    <PlaybookContext.Provider value={value}>
      {children}
    </PlaybookContext.Provider>
  );
}

export function usePlaybook() {
  const context = useContext(PlaybookContext);

  if (context === undefined) {
    throw new Error('usePlaybook must be used within a PlaybookProvider');
  }

  return context;
}

export default PlaybookContext;
