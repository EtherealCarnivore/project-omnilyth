/**
 * Patch Notes Context
 * Fetches PoE patch notes from PoE Wiki (poewiki.net) via serverless proxy
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_CACHE = 'omnilyth_patch_notes_cache_v5';
const STORAGE_KEY_READ_IDS = 'omnilyth_patch_notes_read_ids_v5';
const STORAGE_KEY_LAST_FETCH = 'omnilyth_patch_notes_last_fetch_v5';
const STORAGE_KEY_LAST_CHECK = 'omnilyth_patch_notes_last_check_v5';
const CACHE_TTL = 5 * 60 * 1000;
const POLL_INTERVAL = 30 * 1000;

// Patch notes proxy — only available on Netlify (server-side wiki parsing).
// On GitHub Pages, falls back to mock data.
function getPatchNotesProxyUrl() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname.includes('netlify.app') || hostname === 'omnilyth.app' || hostname === 'www.omnilyth.app') {
    return '/.netlify/functions/patch-notes-proxy';
  }
  // No proxy available on GH Pages — will use mock/cached data
  return null;
}

const PROXY_URL = getPatchNotesProxyUrl();

// Mock data for when PoE Wiki API is unavailable
const MOCK_PATCHES = [
  {
    id: 'wiki_3_28_0',
    title: '3.28.0 Patch Notes',
    author: 'GGG',
    posted: '2026-03-06T00:00:00.000Z',
    content: 'Path of Exile 3.28.0 - Mirage League\n\n- New Mirage league mechanic\n- New skill gems and support gems\n- Atlas passive tree updates\n- Unique item rebalancing\n- Performance optimizations',
    url: 'https://www.poewiki.net/wiki/Version_3.28.0',
    forumUrl: 'https://www.pathofexile.com/forum/view-thread/3600001',
    category: 'league',
    isMajor: true,
    highlights: ['New Mirage league mechanic', 'New skill gems and support gems', 'Atlas passive tree updates', 'Performance optimizations'],
    version: '3.28.0',
  },
  {
    id: 'wiki_3_27_0i',
    title: '3.27.0i Patch Notes',
    author: 'GGG',
    posted: '2026-02-15T00:00:00.000Z',
    content: 'Hotfix for Path of Exile 3.27.0\n\n- Fixed crash when using certain skill combinations\n- Fixed trade API performance issues\n- Fixed Atlas passive tree bugs\n- Fixed item filter loading issues',
    url: 'https://www.poewiki.net/wiki/Version_3.27.0i',
    forumUrl: 'https://www.pathofexile.com/forum/view-thread/3600003',
    category: 'hotfix',
    isMajor: false,
    highlights: ['Fixed crash with certain skill combinations', 'Fixed trade API performance', 'Fixed Atlas passive tree bugs'],
    version: '3.27.0i',
  },
  {
    id: 'wiki_3_27_0',
    title: '3.27.0 Patch Notes',
    author: 'GGG',
    posted: '2025-12-06T00:00:00.000Z',
    content: 'Path of Exile 3.27.0 is now live with major balance changes.\n\n- New skill gems and support gems\n- Atlas passive tree rework\n- Unique item rebalancing\n- Performance optimizations\n- Quality of life improvements',
    url: 'https://www.poewiki.net/wiki/Version_3.27.0',
    forumUrl: 'https://www.pathofexile.com/forum/view-thread/3600002',
    category: 'league',
    isMajor: true,
    highlights: ['New skill gems and support gems', 'Atlas passive tree rework', 'Unique item rebalancing', 'Performance optimizations'],
    version: '3.27.0',
  },
];

const PatchNotesContext = createContext();

export const usePatchNotes = () => {
  const context = useContext(PatchNotesContext);
  if (!context) {
    throw new Error('usePatchNotes must be used within PatchNotesProvider');
  }
  return context;
};

export const PatchNotesProvider = ({ children }) => {
  const [patches, setPatches] = useState(MOCK_PATCHES); // Start with mock data
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

  // Load patches from cache or fetch from wiki proxy
  const fetchPatches = useCallback(async () => {
    // Check cache first
    try {
      const lastFetch = localStorage.getItem(STORAGE_KEY_LAST_FETCH);
      const cachedPatches = localStorage.getItem(STORAGE_KEY_CACHE);

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

    // Fetch from wiki proxy (only available on Netlify)
    if (!PROXY_URL) return; // No proxy — keep using mock/cached data

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(PROXY_URL);
      if (!response.ok) {
        throw new Error(`Patch notes proxy returned ${response.status}`);
      }

      const patchNotes = await response.json();

      if (!Array.isArray(patchNotes) || patchNotes.length === 0) {
        throw new Error('No patch notes returned');
      }

      // Cache
      localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(patchNotes));
      localStorage.setItem(STORAGE_KEY_LAST_FETCH, Date.now().toString());

      setPatches(patchNotes);
    } catch (err) {
      console.error('Failed to fetch patch notes:', err);
      setError('Failed to load patch notes. Showing cached data.');

      // Try to use stale cache
      try {
        const cachedPatches = localStorage.getItem(STORAGE_KEY_CACHE);
        if (cachedPatches) {
          setPatches(JSON.parse(cachedPatches));
          return;
        }
      } catch {
        // Cache failed
      }

      // Fall back to mock data
      setPatches(MOCK_PATCHES);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for new patches (quick fetch to compare IDs)
  const checkForUpdates = useCallback(async () => {
    try {
      const lastCheck = localStorage.getItem(STORAGE_KEY_LAST_CHECK);
      const now = Date.now();

      // Debounce checks (minimum 10 seconds between checks)
      if (lastCheck && (now - parseInt(lastCheck)) < 10000) {
        return;
      }

      localStorage.setItem(STORAGE_KEY_LAST_CHECK, now.toString());

      // Quick fetch to get latest IDs
      const response = await fetch(PROXY_URL);
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
  }, [patches]);

  // Manual refresh with notification clear
  const refreshPatches = useCallback(async () => {
    setHasNewPatches(false);
    // Clear cache to force fresh fetch
    localStorage.removeItem(STORAGE_KEY_CACHE);
    localStorage.removeItem(STORAGE_KEY_LAST_FETCH);
    await fetchPatches();
  }, [fetchPatches]);

  // Initial fetch
  useEffect(() => {
    fetchPatches();
  }, [fetchPatches]);

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
