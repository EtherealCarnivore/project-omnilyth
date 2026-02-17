/**
 * Input Validation Utilities
 * Prevents XSS, injection attacks, and validates user input
 */

/**
 * Sanitize HTML string to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Validate and sanitize number input
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @returns {number|null} Validated number or null
 */
export function validateNumber(value, options = {}) {
  const {
    min = -Infinity,
    max = Infinity,
    allowFloat = true,
    defaultValue = null
  } = options;

  const num = Number(value);

  // Check if valid number
  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }

  // Check if integer required
  if (!allowFloat && !Number.isInteger(num)) {
    return Math.floor(num);
  }

  // Clamp to range
  return Math.min(Math.max(num, min), max);
}

/**
 * Validate regex pattern complexity to prevent ReDoS
 * @param {string} pattern - Regex pattern to validate
 * @returns {boolean} True if pattern is safe
 */
export function validateRegexComplexity(pattern) {
  if (typeof pattern !== 'string') return false;

  // Check pattern length (prevent extremely long patterns)
  if (pattern.length > 1000) return false;

  // Check for excessive nesting
  const nestingDepth = (pattern.match(/\(/g) || []).length;
  if (nestingDepth > 20) return false;

  // Check for dangerous patterns that can cause ReDoS
  const dangerousPatterns = [
    /(\*\+|\+\*|\*\*|\+\+)/,  // Nested quantifiers
    /(\(\?!.*\)\*|\(\?=.*\)\+)/, // Lookahead with quantifiers
    /(\(.*\)\{.*,.*\}){2,}/, // Multiple unbounded repeats
  ];

  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(pattern)) return false;
  }

  return true;
}

/**
 * Validate and sanitize string input
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @returns {string} Validated string
 */
export function validateString(value, options = {}) {
  const {
    maxLength = 1000,
    allowedChars = null, // Predefined pattern name or null
    trim = true,
    defaultValue = ''
  } = options;

  if (typeof value !== 'string') {
    return defaultValue;
  }

  let str = trim ? value.trim() : value;

  // Truncate if too long
  if (str.length > maxLength) {
    str = str.slice(0, maxLength);
  }

  // Check allowed characters using safe predefined patterns only
  if (allowedChars) {
    // Predefined safe patterns to prevent ReDoS
    const SAFE_PATTERNS = {
      'alphanumeric': /^[a-zA-Z0-9]*$/,
      'alphanumericSpace': /^[a-zA-Z0-9\s]*$/,
      'alphanumericDash': /^[a-zA-Z0-9\s\-_]*$/,
      'numeric': /^[0-9]*$/,
      'alpha': /^[a-zA-Z]*$/,
      'hex': /^[0-9a-fA-F]*$/,
    };

    // Only allow predefined patterns, not arbitrary regex
    const pattern = SAFE_PATTERNS[allowedChars];
    if (pattern && !pattern.test(str)) {
      return defaultValue;
    }
  }

  return str;
}

/**
 * Validate league name
 * @param {string} league - League name to validate
 * @returns {string|null} Validated league or null
 */
export function validateLeagueName(league) {
  if (typeof league !== 'string') return null;

  // League names should be alphanumeric with hyphens/spaces
  const sanitized = validateString(league, {
    maxLength: 100,
    allowedChars: 'alphanumericDash', // Use predefined safe pattern
    trim: true
  });

  return sanitized || null;
}

/**
 * Validate socket input (R/G/B/W)
 * @param {object} sockets - Socket counts { r, g, b, w }
 * @param {number} maxSockets - Maximum total sockets allowed
 * @returns {object|null} Validated socket object or null
 */
export function validateSocketInput(sockets, maxSockets = 6) {
  if (typeof sockets !== 'object' || !sockets) return null;

  const validated = {
    r: validateNumber(sockets.r, { min: 0, max: maxSockets, allowFloat: false, defaultValue: 0 }),
    g: validateNumber(sockets.g, { min: 0, max: maxSockets, allowFloat: false, defaultValue: 0 }),
    b: validateNumber(sockets.b, { min: 0, max: maxSockets, allowFloat: false, defaultValue: 0 }),
    w: validateNumber(sockets.w, { min: 0, max: maxSockets, allowFloat: false, defaultValue: 0 })
  };

  const total = validated.r + validated.g + validated.b + validated.w;

  if (total > maxSockets) {
    // Scale down proportionally
    const scale = maxSockets / total;
    validated.r = Math.floor(validated.r * scale);
    validated.g = Math.floor(validated.g * scale);
    validated.b = Math.floor(validated.b * scale);
    validated.w = Math.floor(validated.w * scale);
  }

  return validated;
}

/**
 * Validate URL (for external links)
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid and safe
 */
export function validateURL(url) {
  if (typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Block common dangerous patterns
    if (url.includes('javascript:') || url.includes('data:') || url.includes('vbscript:')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Debounce function to limit expensive operations
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Rate limiter for expensive operations
 * @param {Function} func - Function to rate limit
 * @param {number} limit - Minimum time between calls (ms)
 * @returns {Function} Rate-limited function
 */
export function rateLimit(func, limit = 1000) {
  let lastCall = 0;
  let pending = null;

  return function rateLimited(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= limit) {
      lastCall = now;
      return func(...args);
    } else {
      // Queue the call for later
      if (pending) clearTimeout(pending);
      pending = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        pending = null;
      }, limit - timeSinceLastCall);
    }
  };
}

/**
 * Example usage:
 *
 * // Sanitize user input
 * const clean = sanitizeHTML(userInput);
 *
 * // Validate number with constraints
 * const sockets = validateNumber(input, { min: 0, max: 6, allowFloat: false });
 *
 * // Validate regex pattern
 * if (!validateRegexComplexity(pattern)) {
 *   throw new Error('Pattern too complex');
 * }
 *
 * // Debounce search input
 * const debouncedSearch = debounce(handleSearch, 300);
 *
 * // Rate limit API calls
 * const limitedFetch = rateLimit(fetchPrices, 1000);
 */
