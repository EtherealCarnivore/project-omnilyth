/**
 * GitHub Feedback Proxy
 * Creates GitHub issues from user feedback submissions
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN: Fine-grained personal access token with 'issues:write' permission
 *   Create at: https://github.com/settings/tokens?type=beta
 *   Repository: EtherealCarnivore/project-omnilyth
 *   Permissions: Issues (Read and write)
 */

import { getCORSHeaders, createForbiddenResponse } from './_shared/cors.js';

// Simple in-memory rate limiter
const rateLimiter = new Map();
const RATE_LIMIT = 5; // requests per window
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

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  // Remove null bytes and control characters except newlines/tabs
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit consecutive whitespace
    .replace(/\s{10,}/g, ' '.repeat(9))
    .trim();
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

  // Only allow POST
  if (event.httpMethod !== 'POST') {
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
    // Parse request body
    const body = JSON.parse(event.body || '{}');

    // Sanitize inputs
    const type = sanitizeInput(body.type);
    const title = sanitizeInput(body.title);
    const description = sanitizeInput(body.description);
    const url = sanitizeInput(body.url);
    const userAgent = sanitizeInput(body.userAgent);

    // Validate required fields
    if (!type || !title || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: type, title, description' }),
      };
    }

    // Validate type
    const validTypes = ['bug', 'ui', 'suggestion', 'feature'];
    if (!validTypes.includes(type)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid type. Must be: bug, ui, suggestion, or feature' }),
      };
    }

    // Validate lengths
    if (title.length > 200) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Title too long (max 200 characters)' }),
      };
    }

    if (description.length > 5000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Description too long (max 5000 characters)' }),
      };
    }

    // Check for GitHub token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.error('GITHUB_TOKEN not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Feedback system not configured' }),
      };
    }

    // Build issue body with metadata
    const timestamp = new Date().toISOString();
    const issueBody = `${description}

---

**Metadata:**
- **Submitted:** ${timestamp}
- **Page URL:** ${url || 'Not provided'}
- **User Agent:** ${userAgent || 'Not provided'}

*Submitted via Omnilyth feedback form*`;

    // Map type to label and emoji
    const typeMap = {
      bug: { label: 'bug', emoji: '🐛' },
      ui: { label: 'ui', emoji: '🎨' },
      suggestion: { label: 'enhancement', emoji: '💡' },
      feature: { label: 'feature-request', emoji: '✨' },
    };

    const { label, emoji } = typeMap[type];
    const issueTitle = `${emoji} ${title}`;

    // Create GitHub issue
    const response = await fetch('https://api.github.com/repos/EtherealCarnivore/project-omnilyth/issues', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: [label, 'user-feedback'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Log error details internally only
      if (process.env.NODE_ENV !== 'production') {
        console.error('GitHub API error:', {
          status: response.status,
          data: errorData
        });
      }

      // Don't expose detailed GitHub errors to users
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to submit feedback. Please try again.' }),
      };
    }

    const issue = await response.json();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
      }),
    };

  } catch (error) {
    // Log error details internally only
    if (process.env.NODE_ENV !== 'production') {
      console.error('Feedback submission error:', {
        message: error.message,
        stack: error.stack
      });
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
