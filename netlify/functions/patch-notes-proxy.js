/**
 * Netlify Function - PoE Wiki Patch Notes Proxy
 * Fetches patch notes from poewiki.net MediaWiki API
 * Replaces the old Reddit-based proxy
 */

import { getCORSHeaders, createForbiddenResponse } from './_shared/cors.js';

// Simple in-memory rate limiter
const rateLimiter = new Map();
const RATE_LIMIT = 30; // requests per window
const WINDOW_MS = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimits = rateLimiter.get(ip) || [];
  const recentRequests = userLimits.filter(time => now - time < WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);

  // Cleanup old entries periodically
  if (Math.random() < 0.1) {
    for (const [key, timestamps] of rateLimiter.entries()) {
      const valid = timestamps.filter(t => now - t < WINDOW_MS);
      if (valid.length === 0) {
        rateLimiter.delete(key);
      } else {
        rateLimiter.set(key, valid);
      }
    }
  }

  return true;
}

// In-memory cache with 10-minute TTL
let cachedResult = null;
let cachedAt = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Version prefixes to query - update when new leagues drop (~every 3 months)
const VERSION_PREFIXES = ['Version 3.28', 'Version 3.27'];

const WIKI_API = 'https://www.poewiki.net/w/api.php';
const USER_AGENT = 'Omnilyth-PatchNotes/1.0 (https://omnilyth.app; contact@omnilyth.app)';

/**
 * Discover version pages using allpages API
 */
async function discoverVersionPages(controller) {
  const pages = [];

  for (const prefix of VERSION_PREFIXES) {
    const params = new URLSearchParams({
      action: 'query',
      list: 'allpages',
      apprefix: prefix,
      aplimit: '50',
      format: 'json',
    });

    const response = await fetch(`${WIKI_API}?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) continue;

    const data = await response.json();
    const found = data.query?.allpages || [];
    pages.push(...found.map(p => p.title));
  }

  return pages;
}

/**
 * Batch-fetch page content from wiki
 */
async function fetchPageContent(titles, controller) {
  const results = {};

  // MediaWiki limits titles to 50 per request
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const params = new URLSearchParams({
      action: 'query',
      titles: batch.join('|'),
      prop: 'revisions',
      rvprop: 'content',
      rvslots: 'main',
      format: 'json',
    });

    const response = await fetch(`${WIKI_API}?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) continue;

    const data = await response.json();
    const pages = data.query?.pages || {};

    for (const page of Object.values(pages)) {
      if (page.missing !== undefined) continue;
      const content = page.revisions?.[0]?.slots?.main?.['*'] || page.revisions?.[0]?.['*'] || '';
      if (content) {
        results[page.title] = content;
      }
    }
  }

  return results;
}

/**
 * Extract version number from page title
 * "Version 3.28.0" -> "3.28.0"
 */
function extractVersion(title) {
  const match = title.match(/Version\s+([\d.]+\w*)/i);
  return match ? match[1] : null;
}

/**
 * Parse date from {{version}} template in wikitext
 * Looks for patterns like: {{version|release_date = March 6, 2026}}
 * or date in the page content
 */
function parseDate(wikitext) {
  // Try {{version}} template: release_date = ...
  const versionMatch = wikitext.match(/release[_ ]date\s*=\s*([^\n|}]+)/i);
  if (versionMatch) {
    const parsed = new Date(versionMatch[1].trim());
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }

  // Try common date patterns in first few lines
  const dateMatch = wikitext.match(/(\w+ \d{1,2},?\s*\d{4})/);
  if (dateMatch) {
    const parsed = new Date(dateMatch[1].trim());
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }

  return null;
}

/**
 * Extract forum URL from {{cite web}} reference with name="Patch Notes"
 */
function parseForumUrl(wikitext) {
  // Look for pathofexile.com/forum links
  const forumMatch = wikitext.match(/https?:\/\/(?:www\.)?pathofexile\.com\/forum\/view-thread\/\d+/i);
  return forumMatch ? forumMatch[0] : null;
}

/**
 * Extract author from wikitext (usually from cite web or description)
 */
function parseAuthor(wikitext) {
  // Look for author in cite web template
  const authorMatch = wikitext.match(/author\s*=\s*([^\n|}]+)/i);
  if (authorMatch) return authorMatch[1].trim();

  // Look for "by X" patterns
  const byMatch = wikitext.match(/by\s+(\w+(?:_GGG)?)/i);
  if (byMatch) return byMatch[1];

  return 'GGG';
}

/**
 * Convert wikitext to plain text
 */
function wikitextToPlainText(wikitext) {
  let text = wikitext;

  // Remove everything before the first blockquote or main content
  const blockquoteStart = text.search(/\{\{Blockquote top\}\}/i);
  const blockquoteEnd = text.search(/\{\{Blockquote bottom\}\}/i);

  if (blockquoteStart !== -1 && blockquoteEnd !== -1) {
    text = text.substring(blockquoteStart, blockquoteEnd);
  }

  // Remove templates: {{...}}
  // Handle nested templates by iterating
  let prev = '';
  while (prev !== text) {
    prev = text;
    text = text.replace(/\{\{[^{}]*\}\}/g, '');
  }

  // Convert wiki links: [[Display Text|Link]] -> Display Text, [[Link]] -> Link
  text = text.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1');

  // Remove external links: [url text] -> text
  text = text.replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g, '$1');
  text = text.replace(/\[https?:\/\/[^\s\]]+\]/g, '');

  // Convert bold/italic: '''bold''' -> bold, ''italic'' -> italic
  text = text.replace(/'{3}([^']+)'{3}/g, '$1');
  text = text.replace(/'{2}([^']+)'{2}/g, '$1');

  // Remove HTML tags
  text = text.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  text = text.replace(/<ref[^/]*\/>/gi, '');
  text = text.replace(/<\/?[^>]+>/g, '');

  // Convert wiki headers: == Header == -> Header
  text = text.replace(/^=+\s*(.*?)\s*=+$/gm, '$1');

  // Convert wiki lists: * item -> - item
  text = text.replace(/^\*+\s*/gm, '- ');

  // Clean up excessive whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

/**
 * Extract first 4 bullet points as highlights
 */
function extractHighlights(plainText) {
  if (!plainText) return ['View full patch notes for details'];

  const lines = plainText.split('\n');
  const bullets = lines
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[\s\-*]+/, '').trim())
    .filter(line => line.length > 0 && line.length < 150)
    .slice(0, 4);

  return bullets.length > 0 ? bullets : ['View full patch notes for details'];
}

/**
 * Categorize patch by version pattern
 */
function categorizePatch(version, title) {
  if (!version) return 'content';

  const lowerTitle = (title || '').toLowerCase();

  // X.Y.0 = league launch
  if (/^\d+\.\d+\.0$/.test(version)) return 'league';

  // Letter suffix (e.g. 3.27.0i) = hotfix
  if (/\d+[a-z]$/i.test(version)) return 'hotfix';

  // X.Y.Z where Z > 0 and no letter = patch
  if (/^\d+\.\d+\.\d+$/.test(version)) {
    const parts = version.split('.');
    if (parseInt(parts[2]) > 0) return 'bugfix';
  }

  // Check title for additional hints
  if (lowerTitle.includes('balance') || lowerTitle.includes('manifesto')) return 'balance';

  return 'content';
}

/**
 * Determine if a patch is "major"
 */
function isMajorPatch(version, category) {
  if (category === 'league') return true;
  if (category === 'balance') return true;

  // X.Y.0 is always major
  if (version && /^\d+\.\d+\.0$/.test(version)) return true;

  return false;
}

/**
 * Parse a single wiki page into a patch note object
 */
function parsePatchNote(title, wikitext) {
  const version = extractVersion(title);
  if (!version) return null;

  const date = parseDate(wikitext);
  const forumUrl = parseForumUrl(wikitext);
  const author = parseAuthor(wikitext);
  const plainContent = wikitextToPlainText(wikitext);
  const highlights = extractHighlights(plainContent);
  const category = categorizePatch(version, title);
  const major = isMajorPatch(version, category);

  // Generate stable ID from version
  const id = `wiki_${version.replace(/\./g, '_')}`;

  return {
    id,
    title: `${version} Patch Notes`,
    author,
    posted: date || new Date().toISOString(),
    content: plainContent,
    url: `https://www.poewiki.net/wiki/${encodeURIComponent(title)}`,
    forumUrl,
    category,
    isMajor: major,
    highlights,
    version,
  };
}

export async function handler(event) {
  // Get origin for CORS validation
  const origin = event.headers.origin || event.headers.referer || '';
  const headers = getCORSHeaders(origin);

  // Validate origin
  if (!headers['Access-Control-Allow-Origin']) {
    return createForbiddenResponse();
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Rate limiting
  const ip = event.headers['x-forwarded-for']?.split(',')[0] ||
             event.headers['client-ip'] ||
             'unknown';

  if (!checkRateLimit(ip)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many requests. Please wait before trying again.' }),
    };
  }

  // Check server-side cache
  if (cachedResult && (Date.now() - cachedAt) < CACHE_TTL) {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=600', // 10 minutes
        'X-Cache': 'HIT',
      },
      body: cachedResult,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    // Step 1: Discover version pages
    const pageTitles = await discoverVersionPages(controller);

    if (pageTitles.length === 0) {
      clearTimeout(timeoutId);
      return {
        statusCode: 200,
        headers: { ...headers, 'Cache-Control': 'public, max-age=60' },
        body: JSON.stringify([]),
      };
    }

    // Step 2: Fetch content for all pages
    const pageContents = await fetchPageContent(pageTitles, controller);

    clearTimeout(timeoutId);

    // Step 3: Parse each page into patch note objects
    const patchNotes = [];
    for (const [title, wikitext] of Object.entries(pageContents)) {
      const patch = parsePatchNote(title, wikitext);
      if (patch) {
        patchNotes.push(patch);
      }
    }

    // Step 4: Sort by date descending
    patchNotes.sort((a, b) => new Date(b.posted) - new Date(a.posted));

    // Cache the result
    const body = JSON.stringify(patchNotes);
    cachedResult = body;
    cachedAt = Date.now();

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=600', // 10 minutes
        'X-Cache': 'MISS',
      },
      body,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Patch notes proxy error:', {
        message: error.message,
        name: error.name,
      });
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.name === 'AbortError' ? 'Request timeout' : 'Internal server error',
      }),
    };
  }
}
