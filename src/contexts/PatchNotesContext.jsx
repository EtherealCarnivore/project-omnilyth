/**
 * Patch Notes Context
 * Fetches PoE patch notes for the active game. The Cloudflare Worker scrapes
 * GGG's patch-notes forums (PoE 1: patch-notes, PoE 2: 2212); the bundled
 * fallback in src/data/patchNotesFallback.js covers outages.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { patchNotesUrl } from '../utils/proxyUrl';
import { useGame } from './GameContext';
import { PATCH_NOTES_FALLBACK } from '../data/patchNotesFallback';

// v6: entries now come from the GGG forum (ids "forum_<thread>") and are per game.
const STORAGE_KEY_CACHE = 'omnilyth_patch_notes_cache_v6_';
const STORAGE_KEY_READ_IDS = 'omnilyth_patch_notes_read_ids_v6';
const STORAGE_KEY_LAST_FETCH = 'omnilyth_patch_notes_last_fetch_v6_';
const STORAGE_KEY_LAST_CHECK = 'omnilyth_patch_notes_last_check_v6_';
const CACHE_TTL = 15 * 60 * 1000;
const POLL_INTERVAL = 5 * 60 * 1000;

const fallbackFor = (game) => PATCH_NOTES_FALLBACK[game] || PATCH_NOTES_FALLBACK.poe1;

const FORUM_LIST_URL = {
  poe1: 'https://www.pathofexile.com/forum/view-forum/patch-notes',
  poe2: 'https://www.pathofexile.com/forum/view-forum/2212',
};

const PatchNotesContext = createContext();

export const usePatchNotes = () => {
  const context = useContext(PatchNotesContext);
  if (!context) {
    throw new Error('usePatchNotes must be used within PatchNotesProvider');
  }
  return context;
};

export const PatchNotesProvider = ({ children }) => {
  const { game } = useGame();
  const [patches, setPatches] = useState(() => fallbackFor(game));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNewPatches, setHasNewPatches] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_READ_IDS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load patches from cache or fetch from the Worker's forum feed
  const fetchPatches = useCallback(async () => {
    // Check cache first
    try {
      const lastFetch = localStorage.getItem(STORAGE_KEY_LAST_FETCH + game);
      const cachedPatches = localStorage.getItem(STORAGE_KEY_CACHE + game);

      if (lastFetch && cachedPatches) {
        const age = Date.now() - parseInt(lastFetch);
        if (age < CACHE_TTL) {
          setPatches(JSON.parse(cachedPatches));
          return;
        }
      }
    } catch {
      // Cache read failed, continue to fetch
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(patchNotesUrl(game));
      if (!response.ok) {
        throw new Error(`Patch notes proxy returned ${response.status}`);
      }

      const patchNotes = await response.json();

      if (!Array.isArray(patchNotes) || patchNotes.length === 0) {
        throw new Error('No patch notes returned');
      }

      // Cache
      localStorage.setItem(STORAGE_KEY_CACHE + game, JSON.stringify(patchNotes));
      localStorage.setItem(STORAGE_KEY_LAST_FETCH + game, Date.now().toString());

      setPatches(patchNotes);
    } catch (err) {
      console.error('Failed to fetch patch notes:', err);
      setError('Failed to load patch notes. Showing cached data.');

      // Try to use stale cache
      try {
        const cachedPatches = localStorage.getItem(STORAGE_KEY_CACHE + game);
        if (cachedPatches) {
          setPatches(JSON.parse(cachedPatches));
          return;
        }
      } catch {
        // Cache failed
      }

      // Fall back to mock data
      setPatches(fallbackFor(game));
    } finally {
      setLoading(false);
    }
  }, [game]);

  // Check for new patches (quick fetch to compare IDs)
  const checkForUpdates = useCallback(async () => {
    try {
      const lastCheck = localStorage.getItem(STORAGE_KEY_LAST_CHECK + game);
      const now = Date.now();

      // Debounce checks (minimum 10 seconds between checks)
      if (lastCheck && (now - parseInt(lastCheck)) < 10000) {
        return;
      }

      localStorage.setItem(STORAGE_KEY_LAST_CHECK + game, now.toString());

      // Quick fetch to get latest IDs
      const response = await fetch(patchNotesUrl(game));
      if (!response.ok) return;

      const latestPatches = await response.json();
      if (!Array.isArray(latestPatches)) return;

      const currentIds = patches.map(p => p.id);
      const hasNew = latestPatches.some(p => !currentIds.includes(p.id));

      if (hasNew) {
        setHasNewPatches(true);
      }
    } catch {
      // Silent fail for background update checks
    }
  }, [patches, game]);

  // Manual refresh with notification clear
  const refreshPatches = useCallback(async () => {
    setHasNewPatches(false);
    // Clear cache to force fresh fetch
    localStorage.removeItem(STORAGE_KEY_CACHE + game);
    localStorage.removeItem(STORAGE_KEY_LAST_FETCH + game);
    await fetchPatches();
  }, [fetchPatches, game]);

  // Initial fetch, and again on game switch (fetchPatches depends on game).
  // Swap to the new game's fallback first so the old game's list never shows.
  useEffect(() => {
    setPatches(fallbackFor(game));
    setHasNewPatches(false);
    fetchPatches();
  }, [fetchPatches, game]);

  // Smart polling: only poll when tab is visible
  useEffect(() => {
    let pollInterval;

    const startPolling = () => {
      checkForUpdates();
      pollInterval = setInterval(() => {
        checkForUpdates();
      }, POLL_INTERVAL);
    };

    const stopPolling = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForUpdates]);

  // Mark patch as read
  const markAsRead = useCallback((patchId) => {
    setReadIds(prev => {
      if (prev.includes(patchId)) return prev;
      const updated = [...prev, patchId];
      localStorage.setItem(STORAGE_KEY_READ_IDS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const allIds = patches.map(p => p.id);
    setReadIds(allIds);
    localStorage.setItem(STORAGE_KEY_READ_IDS, JSON.stringify(allIds));
  }, [patches]);

  // Get unread count
  const unreadCount = patches.filter(p => !readIds.includes(p.id)).length;

  // Get latest patch
  const getLatestPatch = useCallback(() => {
    return patches.length > 0 ? patches[0] : null;
  }, [patches]);

  // Get major patches only
  const getMajorPatches = useCallback(() => {
    return patches.filter(p => p.isMajor);
  }, [patches]);

  // Check if patch is read
  const isPatchRead = useCallback((patchId) => {
    return readIds.includes(patchId);
  }, [readIds]);

  const value = {
    game,
    forumListUrl: FORUM_LIST_URL[game] || FORUM_LIST_URL.poe1,
    patches,
    loading,
    error,
    unreadCount,
    hasNewPatches,
    fetchPatches,
    refreshPatches,
    markAsRead,
    markAllAsRead,
    getLatestPatch,
    getMajorPatches,
    isPatchRead,
  };

  return (
    <PatchNotesContext.Provider value={value}>
      {children}
    </PatchNotesContext.Provider>
  );
};
