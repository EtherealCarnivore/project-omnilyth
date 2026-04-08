/**
 * Cloudflare Worker — Unified API Proxy
 *
 * Replaces all Netlify proxy functions. Routes:
 *   ?path=/poe1/api/...         → poe.ninja (prices, economy data)
 *   ?endpoint=/api/leagues...   → pathofexile.com (league list)
 *   ?endpoint=/api/trade...     → pathofexile.com (trade data)
 */

const ALLOWED_ORIGINS = [
  'https://omnilyth.app',
  'https://www.omnilyth.app',
  'https://omnilyth-beta.netlify.app',
  'https://etherealcarnivore.github.io',
  'http://localhost:5173',
  'http://localhost:8888',
];

// ─── Rate Limiting ─────────────────────────────────────────────────────────

const rateLimiter = new Map();
const RATE_LIMIT = 60;
const WINDOW_MS = 60000;

function checkRateLimit(ip) {
  const now = Date.now();
  const recent = (rateLimiter.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateLimiter.set(ip, recent);
  // Periodic cleanup
  if (Math.random() < 0.05) {
    for (const [k, v] of rateLimiter) {
      const valid = v.filter(t => now - t < WINDOW_MS);
      valid.length ? rateLimiter.set(k, valid) : rateLimiter.delete(k);
    }
  }
  return true;
}

// ─── Origin Validation ─────────────────────────────────────────────────────

function getOrigin(request) {
  return request.headers.get('origin') || request.headers.get('referer') || '';
}

function isOriginAllowed(origin) {
  return ALLOWED_ORIGINS.some(a => origin.startsWith(a)) || origin.startsWith('http://localhost:');
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonError(status, message, origin) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

// ─── Path Whitelists ───────────────────────────────────────────────────────

const NINJA_ALLOWED = [
  '/poe1/api/economy/exchange/current/details',
  '/poe1/api/economy/exchange/current/overview',
  '/poe1/api/economy/stash/current/item/overview',
];

const POE_ALLOWED = [
  '/api/leagues',
  '/api/trade',
];

const WIKI_ALLOWED = [
  '/w/api.php',
];

// ─── Handler ───────────────────────────────────────────────────────────────

export default {
  async fetch(request) {
    const origin = getOrigin(request);
    if (!isOriginAllowed(origin)) return jsonError(403, 'Origin not allowed', origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: { ...corsHeaders(origin), 'Access-Control-Max-Age': '86400' },
      });
    }

    if (request.method !== 'GET') return jsonError(405, 'Method not allowed', origin);

    // Rate limit
    const ip = request.headers.get('cf-connecting-ip') ||
               request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) return jsonError(429, 'Too many requests', origin);

    const url = new URL(request.url);

    // Route: ?path=... → poe.ninja
    const ninjaPath = url.searchParams.get('path');
    if (ninjaPath) {
      if (!NINJA_ALLOWED.some(a => ninjaPath.startsWith(a))) {
        return jsonError(403, 'Path not allowed', origin);
      }
      return proxyTo(`https://poe.ninja${ninjaPath}`, origin);
    }

    // Route: ?endpoint=... → pathofexile.com
    const poeEndpoint = url.searchParams.get('endpoint');
    if (poeEndpoint) {
      if (!POE_ALLOWED.some(a => poeEndpoint.startsWith(a))) {
        return jsonError(403, 'Endpoint not allowed', origin);
      }
      return proxyTo(`https://www.pathofexile.com${poeEndpoint}`, origin);
    }

    // Route: ?wiki=... → poewiki.net
    const wikiPath = url.searchParams.get('wiki');
    if (wikiPath) {
      if (!WIKI_ALLOWED.some(a => wikiPath.startsWith(a))) {
        return jsonError(403, 'Wiki path not allowed', origin);
      }
      return proxyTo(`https://www.poewiki.net${wikiPath}`, origin);
    }

    return jsonError(400, 'Missing path, endpoint, or wiki parameter', origin);
  },
};

async function proxyTo(targetUrl, origin) {
  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Omnilyth-Calculator/1.0' },
      cf: { cacheTtl: 300, cacheEverything: true },
    });

    if (!res.ok) {
      console.error('Upstream error:', res.status, targetUrl);
      return jsonError(res.status, 'Upstream API error', origin);
    }

    const response = new Response(res.body, res);
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Cache-Control', 'public, max-age=300');
    return response;
  } catch (err) {
    console.error('Proxy error:', err.message);
    return jsonError(500, 'Internal server error', origin);
  }
}
