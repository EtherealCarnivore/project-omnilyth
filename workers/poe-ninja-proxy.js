// SPDX-License-Identifier: MIT
// Copyright (c) 2024-2026 EtherealCarnivore
//
// This Cloudflare Worker is licensed under MIT (see workers/LICENSE),
// independently from the GPL-3.0 license that covers the rest of the
// Omnilyth repository. Community Path of Exile tools may fork the proxy
// logic under MIT terms.

/**
 * Cloudflare Worker — Unified API Proxy + GitHub Feedback
 *
 * GET (query-string dispatch):
 *   ?path=/poe1/api/...         → poe.ninja
 *   ?endpoint=/api/leagues...   → pathofexile.com
 *   ?wiki=/w/api.php?...        → poewiki.net
 *   ?pob=pobbin|pastebin&id=... → fetch raw PoB build code
 *   ?notes=patch&game=poe1|poe2 → PoE patch notes scraped from GGG's patch-notes forums
 *
 * POST (JSON body):
 *   POST /                      → create GitHub issue from feedback
 *
 * Secrets (set via `wrangler secret put`):
 *   GITHUB_TOKEN — fine-grained PAT, repo issues:write on omnilyth-core-public
 */

import { handleAuth } from './auth.js';

const ALLOWED_ORIGINS = [
  'https://omnilyth.app',
  'https://www.omnilyth.app',
  'https://etherealcarnivore.github.io',
  'http://localhost:5173',
  'http://localhost:8888',
];

// ─── Rate limiting (per-route, in-memory) ──────────────────────────────────

const RATE_CONFIG = {
  proxy:    { limit: 60, window: 60_000, map: new Map() },
  pob:      { limit: 15, window: 60_000, map: new Map() },
  notes:    { limit: 30, window: 60_000, map: new Map() },
  feedback: { limit: 5,  window: 60_000, map: new Map() },
  auth:     { limit: 10, window: 60_000, map: new Map() },
};

function checkRateLimit(route, ip) {
  const cfg = RATE_CONFIG[route];
  const now = Date.now();
  const recent = (cfg.map.get(ip) || []).filter(t => now - t < cfg.window);
  if (recent.length >= cfg.limit) return false;
  recent.push(now);
  cfg.map.set(ip, recent);
  if (Math.random() < 0.05) {
    for (const [k, v] of cfg.map) {
      const valid = v.filter(t => now - t < cfg.window);
      valid.length ? cfg.map.set(k, valid) : cfg.map.delete(k);
    }
  }
  return true;
}

// ─── CORS / helpers ────────────────────────────────────────────────────────

function getOrigin(request) {
  return request.headers.get('origin') || request.headers.get('referer') || '';
}

// Dev / LAN allowance regex — matches localhost, loopback, and RFC 1918
// private IPs on any port. Browsers send the real Origin header; non-browser
// clients (curl, scripts) don't, and getOrigin() returns '' for missing →
// rejected. Spoofing Origin from another browser is blocked by the response's
// same-origin policy. Strictly additive to the prod allowlist above.
const DEV_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):\d+/;

function isOriginAllowed(origin) {
  // Exact match — `startsWith` would let "https://omnilyth.app.evil.com" pass.
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return DEV_ORIGIN_RE.test(origin);
}

function corsHeaders(origin, methods = 'GET') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': `${methods}, OPTIONS`,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonError(status, message, origin, methods = 'GET') {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, methods) },
  });
}

function getClientIP(request) {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

// ─── Generic upstream proxy (poe.ninja / pathofexile.com / poewiki.net) ────

const NINJA_ALLOWED = [
  '/poe1/api/economy/exchange/current/details',
  '/poe1/api/economy/exchange/current/overview',
  '/poe1/api/economy/stash/current/item/overview',
  '/poe2/api/economy/exchange/current/details',
  '/poe2/api/economy/exchange/current/overview',
  '/poe2/api/economy/stash/current/item/overview',
];
const POE_ALLOWED = ['/api/leagues', '/api/trade'];
const WIKI_ALLOWED = ['/w/api.php'];

async function proxyTo(targetUrl, origin) {
  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Omnilyth-Calculator/1.0' },
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!res.ok) return jsonError(res.status, 'Upstream API error', origin);
    const response = new Response(res.body, res);
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Cache-Control', 'public, max-age=300');
    return response;
  } catch {
    return jsonError(500, 'Internal server error', origin);
  }
}

// ─── PoB build-code fetching (pobb.in / pastebin) ──────────────────────────

async function handlePoB(source, id, origin) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return jsonError(400, 'Invalid ID format', origin);
  if (source !== 'pobbin' && source !== 'pastebin') {
    return jsonError(400, `Unsupported source: ${source}`, origin);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    if (source === 'pobbin') {
      const res = await fetch(`https://pobb.in/${id}`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Omnilyth-Calculator/1.0', 'Accept': 'text/html' },
      });
      clearTimeout(timeout);
      if (!res.ok) return jsonError(422, `pobb.in returned ${res.status}`, origin);

      const html = await res.text();
      const match = html.match(/buildcode[^>]*>([eE][A-Za-z0-9_+/=-]{20,})/);
      if (!match) return jsonError(422, 'Could not extract build code from pobb.in page', origin);

      return new Response(JSON.stringify({ code: match[1] }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', ...corsHeaders(origin) },
      });
    }

    // pastebin
    const res = await fetch(`https://pastebin.com/raw/${id}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Omnilyth-Calculator/1.0' },
    });
    clearTimeout(timeout);
    if (!res.ok) return jsonError(422, `Pastebin returned ${res.status}. The paste may be private or expired.`, origin);

    const text = (await res.text()).trim();
    if (!/^[A-Za-z0-9_+/=-]{20,}$/.test(text)) {
      return jsonError(422, 'Pastebin content does not look like a PoB build code', origin);
    }
    return new Response(JSON.stringify({ code: text }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', ...corsHeaders(origin) },
    });
  } catch (err) {
    clearTimeout(timeout);
    return jsonError(500, err.name === 'AbortError' ? 'Request timeout' : 'Internal server error', origin);
  }
}

// ─── Patch notes (GGG forum patch-notes listings) ──────────────────────────
//
// GGG's patch-notes forums have no RSS, so this scrapes the listing HTML the
// way Discord patch-note bots do. (The old source, poewiki.net, sits behind an
// Anubis bot wall that challenges Workers.) The forum served Workers a clean
// 200 with no challenge when checked on 2026-10-23. If GGG changes the markup,
// parsing returns nothing and the app falls back to its bundled list.

const FORUM_BASE = 'https://www.pathofexile.com';
const PATCH_FORUMS = { poe1: 'patch-notes', poe2: '2212' };
const FORUM_PAGES = 2;          // ~60 threads: a full patch cycle incl. hotfixes
const MAX_PATCH_BODIES = 10;    // thread bodies fetched per refresh
const MAX_CONTENT_CHARS = 20_000;
const NOTES_USER_AGENT = 'Mozilla/5.0 (compatible; Omnilyth-PatchNotes/2.0; +https://omnilyth.app)';
const NOTES_CACHE_TTL = 30 * 60 * 1000;

const notesCache = new Map(); // game -> { body, at }

function decodeEntities(s) {
  return s
    .replace(/&#x2F;/gi, '/')
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

async function fetchForumHtml(path, signal) {
  const res = await fetch(FORUM_BASE + path, {
    signal,
    headers: { 'User-Agent': NOTES_USER_AGENT, Accept: 'text/html' },
  });
  if (!res.ok) {
    console.error('[patch-notes]', path, '->', res.status);
    return null;
  }
  return res.text();
}

// Listing rows -> { id, title, author, posted }
function parseForumListing(html) {
  const rows = [];
  const re = /<div class="title">\s*<a href="\/forum\/view-thread\/(\d+)">\s*([^<]+?)\s*<\/a>[\s\S]*?post_by_account"\s*><a[^>]*>([^<]+)<\/a><\/span><span class="post_date">,\s*([^<]+)<\/span>/g;
  let m;
  while ((m = re.exec(html))) {
    rows.push({ id: m[1], title: decodeEntities(m[2]).trim(), author: m[3].trim(), posted: m[4].trim() });
  }
  return rows;
}

function toIso(forumDate) {
  const d = new Date(forumDate.replace(/,(\s*\d{1,2}:\d{2})/, '$1'));
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function extractVersion(title) {
  const m = title.match(/(\d+\.\d+\.\d+[a-z]?)/i);
  return m ? m[1] : null;
}

// First post body of a thread page -> plain text with "- " bullets.
function parseThreadBody(html) {
  const table = html.indexOf('forumPostListTable');
  if (table === -1) return '';
  const start = html.indexOf('<div class="content">', table);
  const end = html.indexOf('<td class="post_info">', start);
  if (start === -1 || end === -1) return '';
  return decodeEntities(
    html.slice(start, end)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|h\d|ul|ol)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n- ')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter((l, i, a) => l || (a[i - 1] && a[i - 1] !== ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_CONTENT_CHARS);
}

function extractHighlights(text) {
  const bullets = text.split('\n')
    .filter(l => l.startsWith('- '))
    .map(l => l.slice(2).trim())
    .filter(l => l.length > 0 && l.length < 160)
    .slice(0, 4);
  return bullets.length ? bullets : ['View full patch notes for details'];
}

// 0.5.0 / 3.29.0 or "Content Update" = league launch; a body that hit the
// size cap (0.5.5-style mid-league content patch) = content; letter suffix =
// hotfix patch; anything else = bugfix.
function categorizePatch(version, title, truncated) {
  if (!version) return 'content';
  if (/^\d+\.\d+\.0$/.test(version) || /content update/i.test(title)) return 'league';
  if (truncated) return 'content';
  if (/[a-z]$/i.test(version)) return 'hotfix';
  return 'bugfix';
}

async function buildPatchList(game, signal) {
  const forum = PATCH_FORUMS[game];
  const pages = await Promise.all(
    Array.from({ length: FORUM_PAGES }, (_, i) =>
      fetchForumHtml(`/forum/view-forum/${forum}${i ? `/page/${i + 1}` : ''}`, signal)),
  );
  const seen = new Set();
  const rows = pages.filter(Boolean).flatMap(parseForumListing).filter(r => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return extractVersion(r.title); // drops Server Maintenance, Code of Conduct, etc.
  });

  // "0.5.5 Hotfix 7", "3.29.1 Maintenance", "0.5.4e Restart" fold into their
  // parent patch-notes entry instead of crowding the list.
  const patches = [];
  const hotfixes = [];
  for (const r of rows) (/\b(hotfix|maintenance|restart)\b/i.test(r.title) ? hotfixes : patches).push(r);

  const top = patches.slice(0, MAX_PATCH_BODIES);
  const bodies = await Promise.all(top.map(r => fetchForumHtml(`/forum/view-thread/${r.id}`, signal)));

  const out = top.map((r, i) => {
    const version = extractVersion(r.title);
    const content = bodies[i] ? parseThreadBody(bodies[i]) : '';
    const category = categorizePatch(version, r.title, content.length >= MAX_CONTENT_CHARS);
    return {
      id: `forum_${r.id}`,
      title: r.title,
      author: r.author,
      posted: toIso(r.posted) || new Date().toISOString(),
      content,
      url: `${FORUM_BASE}/forum/view-thread/${r.id}`,
      forumUrl: `${FORUM_BASE}/forum/view-thread/${r.id}`,
      category,
      isMajor: category === 'league' || category === 'content',
      highlights: extractHighlights(content),
      version,
      game,
      hotfixes: [],
    };
  });

  for (const h of hotfixes) {
    const version = extractVersion(h.title);
    const entry = { title: h.title, url: `${FORUM_BASE}/forum/view-thread/${h.id}`, posted: toIso(h.posted) };
    const parent = out.find(p => p.version === version && /patch notes|content update/i.test(p.title))
      || out.find(p => p.version === version);
    if (parent) parent.hotfixes.push(entry);
  }
  out.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  return out;
}

async function handlePatchNotes(origin, game) {
  const g = PATCH_FORUMS[game] ? game : 'poe1';
  const cached = notesCache.get(g);
  const headers = (cache) => ({
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=900',
    'X-Cache': cache,
    ...corsHeaders(origin),
  });
  if (cached && (Date.now() - cached.at) < NOTES_CACHE_TTL) {
    return new Response(cached.body, { headers: headers('HIT') });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const patches = await buildPatchList(g, controller.signal);
    clearTimeout(timeout);
    const body = JSON.stringify(patches);
    // Don't pin an empty result (markup change / transient failure) for 30 min.
    if (patches.length) notesCache.set(g, { body, at: Date.now() });
    return new Response(body, { headers: headers('MISS') });
  } catch (err) {
    clearTimeout(timeout);
    console.error('[patch-notes] failed:', err && err.name, '|', err && err.message);
    if (cached) return new Response(cached.body, { headers: headers('STALE') });
    return jsonError(500, err.name === 'AbortError' ? 'Request timeout' : 'Internal server error', origin);
  }
}

// ─── GitHub feedback (POST → creates issue) ────────────────────────────────

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .replace(/\s{10,}/g, ' '.repeat(9))
            .trim();
}

function scoreIssueQuality(title, description, type) {
  let score = 0;
  const issues = [];

  if (title.length < 5) issues.push('Title too short (minimum 5 characters)');
  else if (title.length < 10) score += 5;
  else if (title.length <= 100) score += 15;
  else score += 10;

  const vaguePatterns = [
    /^(bad|terrible|awful|sucks|horrible|wtf|shit|crap|stupid)/i,
    /^(fix|help|problem|issue|bug)\s*$/i,
    /^(doesn't work|not working|broken)/i,
    /^(ui|ux|design|colors?|buttons?)\s*(bad|terrible|awful|sucks)/i,
  ];
  if (vaguePatterns.some(p => p.test(title))) {
    issues.push('Title is too vague or generic');
    score -= 10;
  } else {
    score += 10;
  }

  const capsRatio = (title.match(/[A-Z]/g) || []).length / (title.length || 1);
  if (capsRatio > 0.7 && title.length > 10) {
    issues.push('Title is mostly in caps (avoid shouting)');
    score -= 5;
  }
  if (/[!?]{3,}/.test(title)) {
    issues.push('Excessive punctuation in title');
    score -= 5;
  }

  if (description.length < 10) {
    issues.push('Description too short (minimum 10 characters)');
    score -= 10;
  } else if (description.length < 30) score += 5;
  else if (description.length < 100) score += 15;
  else score += 25;

  const hasSteps = /step|reproduce|when|after|if|because|expected|actual/i.test(description);
  const hasDetails = /version|browser|page|error|console|screenshot/i.test(description);
  if (hasSteps) score += 10;
  if (hasDetails) score += 10;

  const complaintPatterns = [
    /^(terrible|awful|bad|sucks|horrible|shit|crap|wtf)\s*$/i,
    /^(fix it|fix this|change it|remove it)\s*$/i,
    /^(i hate|i don't like|this is bad)\s*(it|this)?\.?\s*$/i,
  ];
  if (complaintPatterns.some(p => p.test(description))) {
    issues.push('Description lacks specific details or actionable feedback');
    score -= 15;
  }

  const combined = title + description;
  if (/(.)\1{5,}/.test(combined) || /(\b\w+\b)(\s+\1){3,}/i.test(combined)) {
    issues.push('Spam pattern detected (repeated characters/words)');
    score -= 20;
  }

  if (type === 'bug' && !hasSteps) {
    issues.push('Bug report should include steps to reproduce');
    score -= 5;
  }

  return {
    score,
    quality: score >= 40 ? 'high' : score >= 20 ? 'medium' : score >= 10 ? 'low' : 'very-low',
    issues,
  };
}

const QUALITY_CONFIG = {
  minimumScore: 20,
  lowQualityAction: 'label', // 'reject' | 'label' | 'close'
  provideDetailedFeedback: true,
};

const TYPE_MAP = {
  bug:        { label: 'bug',             emoji: '🐛' },
  ui:         { label: 'ui',              emoji: '🎨' },
  suggestion: { label: 'enhancement',     emoji: '💡' },
  feature:    { label: 'feature-request', emoji: '✨' },
};

const VALID_TYPES = Object.keys(TYPE_MAP);
const GH_REPO = 'EtherealCarnivore/omnilyth-core-public';

function ghHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'Omnilyth-Feedback/1.0',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function handleFeedback(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body', origin, 'POST');
  }

  const type = sanitizeInput(body.type);
  const title = sanitizeInput(body.title);
  const description = sanitizeInput(body.description);
  const url = sanitizeInput(body.url);
  const userAgent = sanitizeInput(body.userAgent);

  if (!type || !title || !description) {
    return jsonError(400, 'Missing required fields: type, title, description', origin, 'POST');
  }
  if (!VALID_TYPES.includes(type)) {
    return jsonError(400, 'Invalid type. Must be: bug, ui, suggestion, or feature', origin, 'POST');
  }
  if (title.length > 200) return jsonError(400, 'Title too long (max 200 characters)', origin, 'POST');
  if (description.length > 5000) return jsonError(400, 'Description too long (max 5000 characters)', origin, 'POST');

  const quality = scoreIssueQuality(title, description, type);

  if (quality.score < QUALITY_CONFIG.minimumScore && QUALITY_CONFIG.lowQualityAction === 'reject') {
    const errorMessage = QUALITY_CONFIG.provideDetailedFeedback
      ? `Feedback quality is too low (score: ${quality.score}/100). Please provide more detail:\n${quality.issues.map(i => `• ${i}`).join('\n')}`
      : 'Please provide more specific details about your feedback.';
    return new Response(
      JSON.stringify({ error: errorMessage, quality: quality.quality, score: quality.score, suggestions: quality.issues }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, 'POST') } },
    );
  }

  const token = env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN secret not configured');
    return jsonError(500, 'Feedback system not configured', origin, 'POST');
  }

  const timestamp = new Date().toISOString();
  const qEmoji = quality.quality === 'high' ? '✅'
               : quality.quality === 'medium' ? '⚠️'
               : quality.quality === 'low' ? '❌' : '🚫';

  const issueBody = [
    description,
    '',
    '---',
    '',
    '**Metadata:**',
    `- **Submitted:** ${timestamp}`,
    `- **Page URL:** ${url || 'Not provided'}`,
    `- **User Agent:** ${userAgent || 'Not provided'}`,
    `- **Quality Score:** ${qEmoji} ${quality.score}/100 (${quality.quality})`,
    quality.issues.length > 0 ? `- **Quality Notes:** ${quality.issues.join('; ')}` : null,
    '',
    '*Submitted via Omnilyth feedback form*',
  ].filter(Boolean).join('\n');

  const { label, emoji } = TYPE_MAP[type];
  const labels = [label, 'user-feedback'];
  if (quality.score < QUALITY_CONFIG.minimumScore) labels.push('needs-triage');
  if (quality.quality === 'high') labels.push('good-first-issue');

  const ghRes = await fetch(`https://api.github.com/repos/${GH_REPO}/issues`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({ title: `${emoji} ${title}`, body: issueBody, labels }),
  });

  if (!ghRes.ok) {
    console.error('GitHub API error:', ghRes.status);
    return jsonError(500, 'Failed to submit feedback. Please try again.', origin, 'POST');
  }

  const issue = await ghRes.json();

  if (quality.score < QUALITY_CONFIG.minimumScore && QUALITY_CONFIG.lowQualityAction === 'close') {
    await fetch(`https://api.github.com/repos/${GH_REPO}/issues/${issue.number}`, {
      method: 'PATCH',
      headers: ghHeaders(token),
      body: JSON.stringify({ state: 'closed' }),
    });
    await fetch(`https://api.github.com/repos/${GH_REPO}/issues/${issue.number}/comments`, {
      method: 'POST',
      headers: ghHeaders(token),
      body: JSON.stringify({
        body: `This issue was automatically closed due to low quality (score: ${quality.score}/100).\n\nTo reopen, please provide:\n${quality.issues.map(i => `- ${i}`).join('\n')}`,
      }),
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
      qualityScore: quality.score,
      qualityLevel: quality.quality,
    }),
    { status: 201, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, 'POST') } },
  );
}

// ─── Main handler ──────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const origin = getOrigin(request);
    if (!isOriginAllowed(origin)) return jsonError(403, 'Origin not allowed', origin, 'GET, POST');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: { ...corsHeaders(origin, 'GET, POST'), 'Access-Control-Max-Age': '86400' },
      });
    }

    const ip = getClientIP(request);

    if (request.method === 'POST') {
      // Auth endpoints (D1-backed login/session) are routed by pathname.
      if (new URL(request.url).pathname.startsWith('/auth/')) {
        if (!checkRateLimit('auth', ip)) return jsonError(429, 'Too many requests. Please wait.', origin, 'POST');
        try {
          const res = await handleAuth(request, env, origin, corsHeaders);
          if (res) return res;
          return jsonError(404, 'Unknown auth endpoint', origin, 'POST');
        } catch (err) {
          console.error('Auth handler error:', err.message);
          return jsonError(500, 'Internal server error', origin, 'POST');
        }
      }
      if (!checkRateLimit('feedback', ip)) return jsonError(429, 'Too many requests. Please wait.', origin, 'POST');
      try {
        return await handleFeedback(request, env, origin);
      } catch (err) {
        console.error('Feedback handler error:', err.message);
        return jsonError(500, 'Internal server error', origin, 'POST');
      }
    }

    if (request.method !== 'GET') return jsonError(405, 'Method not allowed', origin, 'GET, POST');

    const url = new URL(request.url);

    // ?pob=pobbin|pastebin&id=...
    const pobSource = url.searchParams.get('pob');
    if (pobSource) {
      if (!checkRateLimit('pob', ip)) return jsonError(429, 'Too many requests. Please wait.', origin);
      const id = url.searchParams.get('id');
      if (!id) return jsonError(400, 'Missing id parameter', origin);
      return handlePoB(pobSource, id, origin);
    }

    // ?notes=patch
    if (url.searchParams.get('notes') === 'patch') {
      if (!checkRateLimit('notes', ip)) return jsonError(429, 'Too many requests. Please wait.', origin);
      return handlePatchNotes(origin, url.searchParams.get('game'));
    }

    // Generic upstream proxies
    if (!checkRateLimit('proxy', ip)) return jsonError(429, 'Too many requests', origin);

    const ninjaPath = url.searchParams.get('path');
    if (ninjaPath) {
      if (!NINJA_ALLOWED.some(a => ninjaPath.startsWith(a))) return jsonError(403, 'Path not allowed', origin);
      return proxyTo(`https://poe.ninja${ninjaPath}`, origin);
    }

    const poeEndpoint = url.searchParams.get('endpoint');
    if (poeEndpoint) {
      if (!POE_ALLOWED.some(a => poeEndpoint.startsWith(a))) return jsonError(403, 'Endpoint not allowed', origin);
      return proxyTo(`https://www.pathofexile.com${poeEndpoint}`, origin);
    }

    const wikiPath = url.searchParams.get('wiki');
    if (wikiPath) {
      if (!WIKI_ALLOWED.some(a => wikiPath.startsWith(a))) return jsonError(403, 'Wiki path not allowed', origin);
      return proxyTo(`https://www.poewiki.net${wikiPath}`, origin);
    }

    return jsonError(400, 'Missing parameter (path, endpoint, wiki, pob, or notes)', origin);
  },
};
