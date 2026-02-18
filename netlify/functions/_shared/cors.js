/**
 * CORS Security Utility
 * Validates origins and provides secure CORS headers
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

/**
 * Validate origin and return secure CORS headers
 * @param {string} origin - Request origin from headers
 * @returns {object|null} - CORS headers if valid, null if blocked
 */
export function validateOrigin(origin) {
  // Extract origin from various header formats
  const requestOrigin = origin || '';

  // Check if origin is in whitelist
  let isAllowed = ALLOWED_ORIGINS.some(allowed =>
    requestOrigin.startsWith(allowed)
  );

  // Also allow any localhost port for development (http://localhost:*)
  if (!isAllowed && requestOrigin.startsWith('http://localhost:')) {
    isAllowed = true;
  }

  // Also allow local network IPs for WiFi testing (http://192.168.*, http://10.*, http://172.16-31.*, http://127.*)
  if (!isAllowed) {
    const localNetworkPattern = /^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.)/;
    if (localNetworkPattern.test(requestOrigin)) {
      isAllowed = true;
    }
  }

  if (!isAllowed) {
    return null; // Blocked
  }

  // Return secure CORS headers
  return {
    'Access-Control-Allow-Origin': requestOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Get standard headers for successful responses
 * @param {string} origin - Request origin
 * @returns {object} - Response headers
 */
export function getCORSHeaders(origin) {
  const corsHeaders = validateOrigin(origin);

  if (!corsHeaders) {
    // Return headers for forbidden response
    return {
      'Content-Type': 'application/json',
    };
  }

  return {
    ...corsHeaders,
    'Content-Type': 'application/json',
  };
}

/**
 * Create forbidden response for invalid origins
 * @returns {object} - 403 response
 */
export function createForbiddenResponse() {
  return {
    statusCode: 403,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Origin not allowed' }),
  };
}
