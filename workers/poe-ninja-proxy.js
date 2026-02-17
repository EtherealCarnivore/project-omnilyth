/**
 * Cloudflare Workers - PoE Ninja API Proxy
 * Replaces corsproxy.io with secure edge proxy
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
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
        return new Response(JSON.stringify({ error: 'Upstream API error' }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Clone response and add CORS headers
      const modifiedResponse = new Response(response.body, response);
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET');
      modifiedResponse.headers.set('Cache-Control', 'public, max-age=300');

      return modifiedResponse;
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
