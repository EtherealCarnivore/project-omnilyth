/**
 * Patch Notes Context
 * Fetches PoE patch notes from Reddit (r/pathofexile with GGG flair)
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_CACHE = 'omnilyth_patch_notes_cache_v4'; // v4 to force refresh with improved filtering
const STORAGE_KEY_READ_IDS = 'omnilyth_patch_notes_read_ids_v4';
const STORAGE_KEY_LAST_FETCH = 'omnilyth_patch_notes_last_fetch_v4';
const STORAGE_KEY_LAST_CHECK = 'omnilyth_patch_notes_last_check_v4';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes (reduced for better responsiveness)
const POLL_INTERVAL = 30 * 1000; // Poll every 30 seconds when active

// Use serverless proxy to avoid CORS issues (Reddit blocks direct browser requests)
// GitHub Pages = static hosting (no functions), so use Netlify proxy
// Netlify = has functions, use relative path
// Dev = use production proxy (unless running Netlify Dev on 8888)
const getProxyBase = () => {
  // Development mode - use production proxy for simplicity
  // (To test with local functions, run `netlify dev` instead of `npm run dev`)
  if (import.meta.env.DEV) {
    return 'https://omnilyth-beta.netlify.app/.netlify/functions/reddit-proxy';
  }

  // Production: Check if we're on Netlify or GitHub Pages
  const hostname = window.location.hostname;

  // If on Netlify, use relative path (same-origin, faster)
  if (hostname.includes('netlify.app') || hostname === 'omnilyth.app' || hostname === 'www.omnilyth.app') {
    return '/.netlify/functions/reddit-proxy';
  }

  // If on GitHub Pages, use Netlify proxy (cross-origin)
  return 'https://omnilyth-beta.netlify.app/.netlify/functions/reddit-proxy';
};

const REDDIT_PROXY_BASE = getProxyBase();

// Build proxy URLs
const REDDIT_API_URL = `${REDDIT_PROXY_BASE}?endpoint=/r/pathofexile/new.json?limit=100`;
const REDDIT_RSS_URL = `${REDDIT_PROXY_BASE}?endpoint=/r/pathofexile/new.rss?limit=50`;

// Mock data for when Reddit API is unavailable
const MOCK_PATCHES = [
  {
    id: 'mock_1',
    title: 'Phrecia 2.0 Event - What You Need to Know',
    author: 'Bex_GGG',
    posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'The Phrecia 2.0 event is now live!\n\n- New event-specific rewards\n- Enhanced difficulty modifiers\n- Special league mechanics active\n- Unique voided league experience',
    url: 'https://www.reddit.com/r/pathofexile',
    forumUrl: 'https://www.pathofexile.com/forum/view-thread/3600001',
    category: 'league',
    isMajor: true,
    highlights: ['New event-specific rewards', 'Enhanced difficulty modifiers', 'Special league mechanics active', 'Unique voided league experience'],
    upvotes: 2156,
    comments: 478
  },
  {
    id: 'mock_2',
    title: '3.27.0 Patch Notes',
    author: 'Bex_GGG',
    posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'Path of Exile 3.27 is now live with major balance changes.\n\n- New skill gems and support gems\n- Atlas passive tree rework\n- Unique item rebalancing\n- Performance optimizations\n- Quality of life improvements',
    url: 'https://www.reddit.com/r/pathofexile',
    forumUrl: 'https://www.pathofexile.com/forum/view-thread/3600002',
    category: 'league',
    isMajor: true,
    highlights: ['New skill gems and support gems', 'Atlas passive tree rework', 'Unique item rebalancing', 'Performance optimizations'],
    upvotes: 3421,
    comments: 892
  },
  {
    id: 'mock_3',
    title: '3.27.1b Hotfix',
    author: 'Bex_GGG',
    posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'Fixed several issues discovered after 3.27 launch.\n\n- Fixed crash when using certain skill combinations\n- Fixed trade API performance issues\n- Fixed Atlas passive tree bugs\n- Fixed item filter loading issues',
    url: 'https://www.reddit.com/r/pathofexile',
    forumUrl: 'https://www.pathofexile.com/forum/view-thread/3600003',
    category: 'hotfix',
    isMajor: false,
    highlights: ['Fixed crash when using certain skill combinations', 'Fixed trade API performance issues', 'Fixed Atlas passive tree bugs'],
    upvotes: 1247,
    comments: 234
  },
  {
    id: 'mock_4',
    title: '3.27 Balance Manifesto',
    author: 'Mark_GGG',
    posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    content: 'Overview of balance changes coming in 3.27.\n\n- Melee skill buffs\n- Spell damage adjustments\n- Unique item changes\n- Economy rebalancing',
    url: 'https://www.reddit.com/r/pathofexile',
    forumUrl: 'https://www.pathofexile.com/forum/view-thread/3600004',
    category: 'balance',
    isMajor: true,
    highlights: ['Melee skill buffs', 'Spell damage adjustments', 'Unique item changes', 'Economy rebalancing'],
    upvotes: 2834,
    comments: 671
  }
];

const PatchNotesContext = createContext();

export const usePatchNotes = () => {
  const context = useContext(PatchNotesContext);
  if (!context) {
    throw new Error('usePatchNotes must be used within PatchNotesProvider');
  }
  return context;
};

// Detect major patch keywords
const isMajorPatch = (title) => {
  const majorKeywords = [
    'league',
    'expansion',
    'update',
    'balance manifesto',
    'patch notes',
    'development manifesto'
  ];
  const lowerTitle = title.toLowerCase();
  return majorKeywords.some(keyword => lowerTitle.includes(keyword));
};

// Categorize patch type
const categorizePatch = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('hotfix')) return 'hotfix';
  if (lowerTitle.includes('league') || lowerTitle.includes('expansion')) return 'league';
  if (lowerTitle.includes('balance') || lowerTitle.includes('manifesto')) return 'balance';
  if (lowerTitle.includes('bug') || lowerTitle.includes('fix')) return 'bugfix';
  return 'content';
};

// Extract highlights from markdown content (first 4 bullet points)
const extractHighlights = (content) => {
  // If no content, return fallback message (for video-only announcements)
  if (!content) return ['Click to view full announcement'];

  const lines = content.split('\n');
  const bullets = lines
    .filter(line => line.trim().startsWith('*') || line.trim().startsWith('-'))
    .map(line => line.replace(/^[\s*-]+/, '').trim())
    .filter(line => line.length > 0 && line.length < 150)
    .slice(0, 4);

  return bullets.length > 0 ? bullets : ['View full patch notes for details'];
};

// Extract PoE forum link from Reddit post content
const extractForumLink = (text) => {
  if (!text) return null;

  // Look for pathofexile.com/forum links
  const forumMatch = text.match(/https?:\/\/(?:www\.)?pathofexile\.com\/forum\/view-thread\/\d+/i);
  if (forumMatch) return forumMatch[0];

  return null;
};

// Transform Reddit post to patch note object
const transformRedditPost = (post) => {
  const data = post.data;
  const forumLink = extractForumLink(data.selftext || '');

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    posted: new Date(data.created_utc * 1000).toISOString(),
    content: data.selftext || '',
    url: `https://reddit.com${data.permalink}`,
    forumUrl: forumLink, // Official PoE forum link if found
    category: categorizePatch(data.title),
    isMajor: isMajorPatch(data.title),
    highlights: extractHighlights(data.selftext),
    upvotes: data.ups || 0,
    comments: data.num_comments || 0
  };
};

// Parse RSS feed (lightweight check for new patches)
// Note: RSS not yet supported through proxy, so we skip RSS polling for now
// and rely on full API polling instead. RSS would need XML parsing on server side.
const parseRSSFeed = async () => {
  // For now, just return empty array to skip RSS checks
  // The 30-second polling will use the full JSON API instead
  return [];

  /* TODO: Implement RSS proxy with XML parsing
  try {
    const response = await fetch(REDDIT_RSS_URL);
    if (!response.ok) throw new Error('RSS fetch failed');

    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');

    const items = xml.querySelectorAll('entry');
    const patchIds = Array.from(items).slice(0, 10).map(item => {
      const link = item.querySelector('link')?.getAttribute('href') || '';
      const match = link.match(/\/comments\/([a-z0-9]+)\//);
      return match ? match[1] : null;
    }).filter(Boolean);

    return patchIds;
  } catch (error) {
    console.error('RSS feed parse error:', error);
    return [];
  }
  */
};

export const PatchNotesProvider = ({ children }) => {
  const [patches, setPatches] = useState(MOCK_PATCHES); // Start with mock data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNewPatches, setHasNewPatches] = useState(false); // Notification badge
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_READ_IDS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load patches from cache or fetch
  const fetchPatches = useCallback(async () => {
    // Check cache first
    try {
      const lastFetch = localStorage.getItem(STORAGE_KEY_LAST_FETCH);
      const cachedPatches = localStorage.getItem(STORAGE_KEY_CACHE);

      if (lastFetch && cachedPatches) {
        const age = Date.now() - parseInt(lastFetch);
        if (age < CACHE_TTL) {
          console.log(`💾 Loading from cache (age: ${Math.round(age / 1000)}s)`);
          setPatches(JSON.parse(cachedPatches));
          return;
        } else {
          console.log(`🔄 Cache expired (age: ${Math.round(age / 1000)}s), fetching fresh data`);
        }
      } else {
        console.log(`🆕 No cache found, fetching fresh data`);
      }
    } catch {
      // Cache read failed, continue to fetch
      console.log(`⚠️ Cache read failed, fetching fresh data`);
    }

    // Fetch from Reddit (via proxy)
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(REDDIT_API_URL);
      if (!response.ok) {
        throw new Error(`Reddit proxy returned ${response.status}`);
      }

      const data = await response.json();
      const posts = data.data?.children || [];

      console.log(`📡 Fetched ${posts.length} posts from Reddit`);

      // Transform and filter
      // Accept multiple flair types: GGG, Announcement, Official, News
      const acceptedFlairs = ['GGG', 'Announcement', 'Official', 'News'];
      const transformed = posts
        .filter(post => {
          const flair = post.data?.link_flair_text;
          const author = post.data?.author;
          // Check if it's from a GGG author OR has accepted flair
          const isGGGAuthor = author && author.includes('_GGG');
          const hasAcceptedFlair = flair && acceptedFlairs.includes(flair);

          if (isGGGAuthor || hasAcceptedFlair) {
            console.log(`✅ Including: "${post.data?.title}" (author: ${author}, flair: ${flair})`);
          }

          return isGGGAuthor || hasAcceptedFlair;
        })
        .map(transformRedditPost)
        .filter(patch => patch.title && patch.id);

      console.log(`✨ Filtered to ${transformed.length} patch notes`);

      // Cache
      localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(transformed));
      localStorage.setItem(STORAGE_KEY_LAST_FETCH, Date.now().toString());

      setPatches(transformed);
    } catch (err) {
      console.error('Failed to fetch patch notes:', err);
      setError('Failed to load patch notes from Reddit. Showing mock data.');

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
      localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(MOCK_PATCHES));
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for new patches (lightweight RSS check)
  const checkForUpdates = useCallback(async () => {
    try {
      const lastCheck = localStorage.getItem(STORAGE_KEY_LAST_CHECK);
      const now = Date.now();

      // Debounce checks (minimum 10 seconds between checks)
      if (lastCheck && (now - parseInt(lastCheck)) < 10000) {
        return;
      }

      localStorage.setItem(STORAGE_KEY_LAST_CHECK, now.toString());

      // Get current patch IDs
      const currentIds = patches.map(p => p.id);

      // Check RSS feed for new IDs
      const latestIds = await parseRSSFeed();

      // If RSS has IDs we don't have, flag as new
      const hasNew = latestIds.some(id => !currentIds.includes(id));

      if (hasNew) {
        setHasNewPatches(true);
      }
    } catch (error) {
      console.error('Update check failed:', error);
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
      // Check immediately
      checkForUpdates();

      // Then poll every 30 seconds
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

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    // Start polling if tab is visible
    if (!document.hidden) {
      startPolling();
    }

    // Listen for visibility changes
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
    hasNewPatches, // NEW: notification for updates
    fetchPatches,
    refreshPatches, // NEW: manual refresh
    markAsRead,
    markAllAsRead,
    getLatestPatch,
    getMajorPatches,
    isPatchRead
  };

  return (
    <PatchNotesContext.Provider value={value}>
      {children}
    </PatchNotesContext.Provider>
  );
};
