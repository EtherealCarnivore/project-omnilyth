/**
 * Reddit API Proxy
 * Proxies Reddit API requests to avoid CORS issues
 */

import { getCORSHeaders, createForbiddenResponse } from './_shared/cors.js';
import https from 'https';

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

    // Fetch from Reddit using native https module (ensures User-Agent is sent correctly)
    const data = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Request timeout')), 10000);

      const req = https.get(url, {
        headers: {
          'User-Agent': 'Omnilyth-PatchNotes/1.0 (https://omnilyth.app)',
          'Accept': 'application/json'
        }
      }, (res) => {
        clearTimeout(timeout);

        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error('Reddit API error:', {
              status: res.statusCode,
              statusMessage: res.statusMessage,
              url,
              responseBody: body.substring(0, 500)
            });

            reject({
              statusCode: res.statusCode,
              message: 'Reddit API error',
              details: body.substring(0, 200)
            });
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      req.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Log error details internally only
    console.error('Reddit proxy error:', {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode
    });

    // Handle Reddit API errors
    if (error.statusCode) {
      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({
          error: error.message,
          details: process.env.NODE_ENV !== 'production' ? error.details : undefined
        })
      };
    }

    // Handle other errors (timeout, network, etc.)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message === 'Request timeout' ? 'Request timeout' : 'Internal server error'
      })
    };
  }
}
