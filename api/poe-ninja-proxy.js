/**
 * Vercel Serverless Function - PoE Ninja API Proxy
 * Replaces corsproxy.io with secure server-side proxy
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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
      return res.status(response.status).json({ error: 'Upstream API error' });
    }

    const data = await response.json();

    // Set security and caching headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);

    return res.status(500).json({
      error: error.name === 'AbortError' ? 'Request timeout' : 'Internal server error'
    });
  }
}
