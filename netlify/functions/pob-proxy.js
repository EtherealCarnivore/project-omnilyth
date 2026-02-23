/**
 * Netlify Function - PoB Code Proxy
 * Fetches raw PoB build codes from supported platforms:
 * - pobb.in: Extracts code from HTML textarea
 * - pastebin.com: Fetches raw paste content
 */

import { getCORSHeaders, createForbiddenResponse } from './_shared/cors.js';

const rateLimiter = new Map();
const RATE_LIMIT = 15;
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

/**
 * Fetch from pobb.in and extract the build code from the textarea.
 */
async function fetchFromPobbin(id) {
  const url = `https://pobb.in/${id}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(url, {
    signal: controller.signal,
    headers: { 'User-Agent': 'Omnilyth-Calculator/1.0', 'Accept': 'text/html' },
  });
  clearTimeout(timeoutId);

  if (!response.ok) {
    return { code: null, error: `pobb.in returned ${response.status}` };
  }

  const html = await response.text();
  const match = html.match(/buildcode[^>]*>([eE][A-Za-z0-9_+/=-]{20,})/);

  if (!match) {
    return { code: null, error: 'Could not extract build code from pobb.in page' };
  }

  return { code: match[1], error: null };
}

/**
 * Fetch from pastebin.com using the /raw/ endpoint.
 */
async function fetchFromPastebin(id) {
  const url = `https://pastebin.com/raw/${id}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(url, {
    signal: controller.signal,
    headers: { 'User-Agent': 'Omnilyth-Calculator/1.0' },
  });
  clearTimeout(timeoutId);

  if (!response.ok) {
    return { code: null, error: `Pastebin returned ${response.status}. The paste may be private or expired.` };
  }

  const text = (await response.text()).trim();

  // Validate it looks like a PoB code (base64 starting with eNr or similar)
  if (!text.match(/^[A-Za-z0-9_+/=-]{20,}$/)) {
    return { code: null, error: 'Pastebin content does not look like a PoB build code' };
  }

  return { code: text, error: null };
}

export async function handler(event) {
  const origin = event.headers.origin || event.headers.referer || '';
  const headers = getCORSHeaders(origin);

  if (!headers['Access-Control-Allow-Origin']) {
    return createForbiddenResponse();
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0] ||
             event.headers['client-ip'] ||
             'unknown';

  if (!checkRateLimit(ip)) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Too many requests. Please wait.' }) };
  }

  try {
    const source = event.queryStringParameters?.source;
    const id = event.queryStringParameters?.id;

    if (!source || !id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing source or id parameter' }) };
    }

    // Validate ID format
    if (!/^[A-Za-z0-9_-]+$/.test(id)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID format' }) };
    }

    let result;

    switch (source) {
      case 'pobbin':
        result = await fetchFromPobbin(id);
        break;
      case 'pastebin':
        result = await fetchFromPastebin(id);
        break;
      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: `Unsupported source: ${source}` }) };
    }

    if (result.error) {
      return { statusCode: 422, headers, body: JSON.stringify({ error: result.error }) };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Cache-Control': 'public, max-age=3600' },
      body: JSON.stringify({ code: result.code }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.name === 'AbortError' ? 'Request timeout' : 'Internal server error',
      }),
    };
  }
}
