/**
 * Reddit API Proxy
 * Proxies Reddit API requests to avoid CORS issues
 */

const { getCORSHeaders, createForbiddenResponse } = require('./_shared/cors.js');

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

exports.handler = async function(event) {
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

  try {
    // Extract endpoint from query parameters
    const endpoint = event.queryStringParameters?.endpoint;

    if (!endpoint) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing endpoint parameter' }),
      };
    }

    // Validate that endpoint is allowed (pathofexile subreddit only)
    const allowedEndpoints = [
      '/r/pathofexile/new.json',
      '/r/pathofexile/search.json',
      '/r/pathofexile/new.rss',
      '/r/pathofexile/search.rss'
    ];

    const isAllowed = allowedEndpoints.some(allowed => endpoint.startsWith(allowed));
    if (!isAllowed) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Endpoint not allowed' }),
      };
    }

    // Construct full Reddit URL
    const url = `https://www.reddit.com${endpoint}`;

    // Fetch from Reddit with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Omnilyth-PatchNotes/1.0 (https://omnilyth.app)',
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Reddit API error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        responseBody: responseText.substring(0, 500)
      });

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Reddit API error',
          details: process.env.NODE_ENV !== 'production' ? responseText.substring(0, 200) : undefined
        })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Reddit proxy error:', {
      message: error.message,
      name: error.name
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.name === 'AbortError' ? 'Request timeout' : 'Internal server error'
      })
    };
  }
};
