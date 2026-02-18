/**
 * Path of Exile API Proxy
 * Proxies pathofexile.com API requests to avoid CORS issues
 */

const { getCORSHeaders, createForbiddenResponse } = require('./_shared/cors.js');

// Simple in-memory rate limiter
const rateLimiter = new Map();
const RATE_LIMIT = 60; // requests per window (generous for league data)
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

    // Validate that endpoint is allowed (pathofexile.com API only)
    const allowedEndpoints = [
      '/api/leagues',
      '/api/trade'
    ];

    const isAllowed = allowedEndpoints.some(allowed => endpoint.startsWith(allowed));
    if (!isAllowed) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Endpoint not allowed' }),
      };
    }

    // Construct full PoE URL
    const url = `https://www.pathofexile.com${endpoint}`;

    // Fetch from pathofexile.com with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Omnilyth-Calculator/1.0 (https://omnilyth.app)'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Log error details internally only
      if (process.env.NODE_ENV !== 'production') {
        console.error('pathofexile.com API error:', {
          status: response.status,
          url
        });
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'PoE API error' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour (league data rarely changes)
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Log error details internally only
    if (process.env.NODE_ENV !== 'production') {
      console.error('PoE proxy error:', {
        message: error.message,
        name: error.name
      });
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.name === 'AbortError' ? 'Request timeout' : 'Internal server error'
      })
    };
  }
};
