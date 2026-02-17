/**
 * Netlify Function - PoE Ninja API Proxy
 * Replaces corsproxy.io with secure server-side proxy
 */

export async function handler(event) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Extract path from query parameters
    const path = event.queryStringParameters?.path;

    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing path parameter' })
      };
    }

    // Validate that path starts with allowed endpoints
    const allowedPaths = [
      '/poe1/api/economy/exchange/current/details',
      '/poe1/api/economy/exchange/current/overview'
    ];

    const isAllowed = allowedPaths.some(allowed => path.startsWith(allowed));
    if (!isAllowed) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Path not allowed' })
      };
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
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Upstream API error' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.name === 'AbortError' ? 'Request timeout' : 'Internal server error'
      })
    };
  }
}
