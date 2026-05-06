/**
 * Cloudflare Worker — Unified API Proxy + GitHub Feedback
 *
 * GET (query-string dispatch):
 *   ?path=/poe1/api/...         → poe.ninja
 *   ?endpoint=/api/leagues...   → pathofexile.com
 *   ?wiki=/w/api.php?...        → poewiki.net
 *   ?pob=pobbin|pastebin&id=... → fetch raw PoB build code
 *   ?notes=patch                → discover & parse PoE patch notes from poewiki.net
 *
 * POST (JSON body):
 *   POST /                      → create GitHub issue from feedback
 *
 * Secrets (set via `wrangler secret put`):
 *   GITHUB_TOKEN — fine-grained PAT, repo issues:write on omnilyth-core-public
 */

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
  if (ALLOWED_ORIGINS.some(a => origin.startsWith(a))) return true;
  return DEV_ORIGIN_RE.test(origin);
}

function corsHeaders(origin, methods = 'GET') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': `${methods}, OPTIONS`,
    'Access-Control-Allow-Headers': 'Content-Type',
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

// ─── Patch notes (poewiki.net version pages) ───────────────────────────────

const WIKI_API = 'https://www.poewiki.net/w/api.php';
const WIKI_USER_AGENT = 'Omnilyth-PatchNotes/1.0 (https://omnilyth.app; contact@omnilyth.app)';
// Update when new leagues drop (~every 3 months)
const VERSION_PREFIXES = ['Version 3.28', 'Version 3.27'];
const NOTES_CACHE_TTL = 10 * 60 * 1000;

let notesCache = { body: null, at: 0 };

async function discoverVersionPages(controller) {
  const pages = [];
  for (const prefix of VERSION_PREFIXES) {
    const params = new URLSearchParams({
      action: 'query', list: 'allpages', apprefix: prefix, aplimit: '50', format: 'json',
    });
    const res = await fetch(`${WIKI_API}?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': WIKI_USER_AGENT },
    });
    if (!res.ok) continue;
    const data = await res.json();
    const found = data.query?.allpages || [];
    pages.push(...found.map(p => p.title));
  }
  return pages;
}

async function fetchPageContent(titles, controller) {
  const results = {};
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const params = new URLSearchParams({
      action: 'query', titles: batch.join('|'),
      prop: 'revisions', rvprop: 'content', rvslots: 'main', format: 'json',
    });
    const res = await fetch(`${WIKI_API}?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': WIKI_USER_AGENT },
    });
    if (!res.ok) continue;
    const data = await res.json();
    const pages = data.query?.pages || {};
    for (const page of Object.values(pages)) {
      if (page.missing !== undefined) continue;
      const content = page.revisions?.[0]?.slots?.main?.['*'] || page.revisions?.[0]?.['*'] || '';
      if (content) results[page.title] = content;
    }
  }
  return results;
}

function extractVersion(title) {
  const m = title.match(/Version\s+([\d.]+\w*)/i);
  return m ? m[1] : null;
}

function parseDate(wikitext) {
  const versionMatch = wikitext.match(/release[_ ]date\s*=\s*([^\n|}]+)/i);
  if (versionMatch) {
    const parsed = new Date(versionMatch[1].trim());
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }
  const dateMatch = wikitext.match(/(\w+ \d{1,2},?\s*\d{4})/);
  if (dateMatch) {
    const parsed = new Date(dateMatch[1].trim());
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

function parseForumUrl(wikitext) {
  const m = wikitext.match(/https?:\/\/(?:www\.)?pathofexile\.com\/forum\/view-thread\/\d+/i);
  return m ? m[0] : null;
}

function parseAuthor(wikitext) {
  const authorMatch = wikitext.match(/author\s*=\s*([^\n|}]+)/i);
  if (authorMatch) return authorMatch[1].trim();
  const byMatch = wikitext.match(/by\s+(\w+(?:_GGG)?)/i);
  if (byMatch) return byMatch[1];
  return 'GGG';
}

function wikitextToPlainText(wikitext) {
  let text = wikitext;
  const start = text.search(/\{\{Blockquote top\}\}/i);
  const end = text.search(/\{\{Blockquote bottom\}\}/i);
  if (start !== -1 && end !== -1) text = text.substring(start, end);

  let prev = '';
  while (prev !== text) {
    prev = text;
    text = text.replace(/\{\{[^{}]*\}\}/g, '');
  }
  text = text.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1');
  text = text.replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g, '$1');
  text = text.replace(/\[https?:\/\/[^\s\]]+\]/g, '');
  text = text.replace(/'{3}([^']+)'{3}/g, '$1');
  text = text.replace(/'{2}([^']+)'{2}/g, '$1');
  text = text.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  text = text.replace(/<ref[^/]*\/>/gi, '');
  text = text.replace(/<\/?[^>]+>/g, '');
  text = text.replace(/^=+\s*(.*?)\s*=+$/gm, '$1');
  text = text.replace(/^\*+\s*/gm, '- ');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

function extractHighlights(plainText) {
  if (!plainText) return ['View full patch notes for details'];
  const bullets = plainText.split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[\s\-*]+/, '').trim())
    .filter(line => line.length > 0 && line.length < 150)
    .slice(0, 4);
  return bullets.length > 0 ? bullets : ['View full patch notes for details'];
}

function categorizePatch(version, title) {
  if (!version) return 'content';
  const lower = (title || '').toLowerCase();
  if (/^\d+\.\d+\.0$/.test(version)) return 'league';
  if (/\d+[a-z]$/i.test(version)) return 'hotfix';
  if (/^\d+\.\d+\.\d+$/.test(version)) {
    const parts = version.split('.');
    if (parseInt(parts[2]) > 0) return 'bugfix';
  }
  if (lower.includes('balance') || lower.includes('manifesto')) return 'balance';
  return 'content';
}

function isMajorPatch(version, category) {
  if (category === 'league' || category === 'balance') return true;
  if (version && /^\d+\.\d+\.0$/.test(version)) return true;
  return false;
}

function parsePatchNote(title, wikitext) {
  const version = extractVersion(title);
  if (!version) return null;
  const date = parseDate(wikitext);
  const plainContent = wikitextToPlainText(wikitext);
  const category = categorizePatch(version, title);
  return {
    id: `wiki_${version.replace(/\./g, '_')}`,
    title: `${version} Patch Notes`,
    author: parseAuthor(wikitext),
    posted: date || new Date().toISOString(),
    content: plainContent,
    url: `https://www.poewiki.net/wiki/${encodeURIComponent(title)}`,
    forumUrl: parseForumUrl(wikitext),
    category,
    isMajor: isMajorPatch(version, category),
    highlights: extractHighlights(plainContent),
    version,
  };
}

async function handlePatchNotes(origin) {
  if (notesCache.body && (Date.now() - notesCache.at) < NOTES_CACHE_TTL) {
    return new Response(notesCache.body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600',
        'X-Cache': 'HIT',
        ...corsHeaders(origin),
      },
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const titles = await discoverVersionPages(controller);
    if (titles.length === 0) {
      clearTimeout(timeout);
      return new Response('[]', {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60', ...corsHeaders(origin) },
      });
    }

    const contents = await fetchPageContent(titles, controller);
    clearTimeout(timeout);

    const patches = [];
    for (const [title, wikitext] of Object.entries(contents)) {
      const p = parsePatchNote(title, wikitext);
      if (p) patches.push(p);
    }
    patches.sort((a, b) => new Date(b.posted) - new Date(a.posted));

    const body = JSON.stringify(patches);
    notesCache = { body, at: Date.now() };

    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600',
        'X-Cache': 'MISS',
        ...corsHeaders(origin),
      },
    });
  } catch (err) {
    clearTimeout(timeout);
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
      return handlePatchNotes(origin);
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
