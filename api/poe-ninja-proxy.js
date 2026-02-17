/**
 * Vercel Serverless Function - PoE Ninja API Proxy
 * Replaces corsproxy.io with secure server-side proxy
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

function validateOrigin(origin) {
  const requestOrigin = origin || '';
  return ALLOWED_ORIGINS.some(allowed => requestOrigin.startsWith(allowed));
}

export default async function handler(req, res) {
  // Validate origin
  const origin = req.headers.origin || req.headers.referer || '';
  if (!validateOrigin(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
             req.headers['x-real-ip'] ||
             req.socket.remoteAddress ||
             'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
  }

  try {
    // Extract path from query parameters
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: 'Missing path parameter' });
    }

    // Validate that path starts with allowed endpoints
    const allowedPaths = [
      '/poe1/api/economy/exchange/current/details',
      '/poe1/api/economy/exchange/current/overview'
    ];

    const isAllowed = allowedPaths.some(allowed => path.startsWith(allowed));
    if (!isAllowed) {
      return res.status(403).json({ error: 'Path not allowed' });
    }

    // Construct full URL
    const url = `https://poe.ninja${path}`;

    // Fetch from poe.ninja with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Omnilyth-Calculator/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Log error details internally only
      if (process.env.NODE_ENV !== 'production') {
        console.error('poe.ninja API error:', {
          status: response.status,
          url
        });
      }

      return res.status(response.status).json({ error: 'Upstream API error' });
    }

    const data = await response.json();

    // Set security and caching headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    // Log error details internally only
    if (process.env.NODE_ENV !== 'production') {
      console.error('Proxy error:', {
        message: error.message,
        name: error.name
      });
    }

    return res.status(500).json({
      error: error.name === 'AbortError' ? 'Request timeout' : 'Internal server error'
    });
  }
}
