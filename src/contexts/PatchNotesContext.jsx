/**
 * Patch Notes Context
 * Fetches PoE patch notes from Reddit (r/pathofexile with GGG flair)
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_CACHE = 'omnilyth_patch_notes_cache_v2'; // v2 to force refresh for 3.27
const STORAGE_KEY_READ_IDS = 'omnilyth_patch_notes_read_ids_v2';
const STORAGE_KEY_LAST_FETCH = 'omnilyth_patch_notes_last_fetch_v2';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const REDDIT_API_URL = 'https://www.reddit.com/r/pathofexile/search.json?q=flair_name:"GGG"&sort=new&limit=50&restrict_sr=1';

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

export const PatchNotesProvider = ({ children }) => {
  const [patches, setPatches] = useState(MOCK_PATCHES); // Start with mock data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
          setPatches(JSON.parse(cachedPatches));
          return;
        }
      }
    } catch {
      // Cache read failed, continue to fetch
    }

    // Fetch from Reddit
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(REDDIT_API_URL);
      if (!response.ok) {
        throw new Error(`Reddit API returned ${response.status}`);
      }

      const data = await response.json();
      const posts = data.data?.children || [];

      // Transform and filter
      const transformed = posts
        .filter(post => post.data?.link_flair_text === 'GGG')
        .map(transformRedditPost)
        .filter(patch => patch.title && patch.id);

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

  // Initial fetch
  useEffect(() => {
    fetchPatches();
  }, [fetchPatches]);

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
    fetchPatches,
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
