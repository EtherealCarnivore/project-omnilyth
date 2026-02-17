/**
 * Cloudflare Workers - PoE Ninja API Proxy
 * Replaces corsproxy.io with secure edge proxy
 */

// Whitelist of allowed origins
const ALLOWED_ORIGINS = [
  'https://omnilyth.app',
  'https://www.omnilyth.app',
  'https://omnilyth-beta.netlify.app',
  'https://etherealcarnivore.github.io',
  'http://localhost:5173', // Dev mode
  'http://localhost:8888', // Netlify dev
];

// Rate limiter using Cloudflare Workers KV (would need env binding)
// For now, simple in-memory (resets on worker restart)
const rateLimiter = new Map();
const RATE_LIMIT = 30;
const WINDOW_MS = 60000;

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimits = rateLimiter.get(ip) || [];
  const recentRequests = userLimits.filter(time => now - time < WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);

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

function validateOrigin(origin) {
  const requestOrigin = origin || '';
  // Check whitelist
  const inWhitelist = ALLOWED_ORIGINS.some(allowed => requestOrigin.startsWith(allowed));
  // Also allow any localhost port for development
  const isLocalhost = requestOrigin.startsWith('http://localhost:');
  return inWhitelist || isLocalhost;
}

export default {
  async fetch(request, env, ctx) {
    // Validate origin
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    if (!validateOrigin(origin)) {
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Rate limiting
    const ip = request.headers.get('cf-connecting-ip') ||
               request.headers.get('x-forwarded-for')?.split(',')[0] ||
               'unknown';

    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please wait before trying again.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const url = new URL(request.url);
      const path = url.searchParams.get('path');

      if (!path) {
        return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Validate that path starts with allowed endpoints
      const allowedPaths = [
        '/poe1/api/economy/exchange/current/details',
        '/poe1/api/economy/exchange/current/overview'
      ];

      const isAllowed = allowedPaths.some(allowed => path.startsWith(allowed));
      if (!isAllowed) {
        return new Response(JSON.stringify({ error: 'Path not allowed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Construct full URL
      const targetUrl = `https://poe.ninja${path}`;

      // Fetch from poe.ninja
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Omnilyth-Calculator/1.0'
        },
        cf: {
          cacheTtl: 300, // Cache for 5 minutes at Cloudflare edge
          cacheEverything: true
        }
      });

      if (!response.ok) {
        // Log error details internally only (Cloudflare Workers have different logging)
        console.error('poe.ninja API error:', response.status);

        return new Response(JSON.stringify({ error: 'Upstream API error' }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Clone response and add CORS headers
      const modifiedResponse = new Response(response.body, response);
      modifiedResponse.headers.set('Access-Control-Allow-Origin', origin);
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET');
      modifiedResponse.headers.set('Cache-Control', 'public, max-age=300');

      return modifiedResponse;
    } catch (error) {
      // Log error details internally only
      console.error('Proxy error:', error.message);

      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
