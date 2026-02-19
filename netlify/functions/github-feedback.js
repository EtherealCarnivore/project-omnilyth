/**
 * GitHub Feedback Proxy
 * Creates GitHub issues from user feedback submissions
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN: Fine-grained personal access token with 'issues:write' permission
 *   Create at: https://github.com/settings/tokens?type=beta
 *   Repository: EtherealCarnivore/omnilyth-core-public
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

/**
 * Issue Quality Scoring System
 * Evaluates feedback quality to filter out spam/low-effort submissions
 */
function scoreIssueQuality(title, description, type) {
  let score = 0;
  const issues = [];

  // === TITLE SCORING ===

  // Length check (3-200 chars ideal)
  if (title.length < 5) {
    issues.push('Title too short (minimum 5 characters)');
  } else if (title.length >= 5 && title.length < 10) {
    score += 5; // Very short but acceptable
  } else if (title.length >= 10 && title.length <= 100) {
    score += 15; // Good length
  } else {
    score += 10; // A bit long but ok
  }

  // Check for vague/generic titles
  const vaguePatterns = [
    /^(bad|terrible|awful|sucks|horrible|wtf|shit|crap|stupid)/i,
    /^(fix|help|problem|issue|bug)\s*$/i,
    /^(doesn't work|not working|broken)/i,
    /^(ui|ux|design|colors?|buttons?)\s*(bad|terrible|awful|sucks)/i,
  ];

  if (vaguePatterns.some(pattern => pattern.test(title))) {
    issues.push('Title is too vague or generic');
    score -= 10;
  } else {
    score += 10; // Specific title
  }

  // Check for all caps (shouting)
  const capsRatio = (title.match(/[A-Z]/g) || []).length / title.length;
  if (capsRatio > 0.7 && title.length > 10) {
    issues.push('Title is mostly in caps (avoid shouting)');
    score -= 5;
  }

  // Check for excessive punctuation (!!! or ???)
  if (/[!?]{3,}/.test(title)) {
    issues.push('Excessive punctuation in title');
    score -= 5;
  }

  // === DESCRIPTION SCORING ===

  // Length check (20+ chars minimum for quality)
  if (description.length < 10) {
    issues.push('Description too short (minimum 10 characters)');
    score -= 10;
  } else if (description.length >= 10 && description.length < 30) {
    score += 5; // Minimal effort
  } else if (description.length >= 30 && description.length < 100) {
    score += 15; // Decent detail
  } else if (description.length >= 100) {
    score += 25; // Good detail
  }

  // Check for actionable content
  const hasSteps = /step|reproduce|when|after|if|because|expected|actual/i.test(description);
  const hasDetails = /version|browser|page|error|console|screenshot/i.test(description);

  if (hasSteps) score += 10;
  if (hasDetails) score += 10;

  // Check for just insults/complaints with no detail
  const complaintPatterns = [
    /^(terrible|awful|bad|sucks|horrible|shit|crap|wtf)\s*$/i,
    /^(fix it|fix this|change it|remove it)\s*$/i,
    /^(i hate|i don't like|this is bad)\s*(it|this)?\.?\s*$/i,
  ];

  if (complaintPatterns.some(pattern => pattern.test(description))) {
    issues.push('Description lacks specific details or actionable feedback');
    score -= 15;
  }

  // Check for spam patterns
  const hasRepeatedChars = /(.)\1{5,}/.test(title + description); // aaaaaaaa
  const hasRepeatedWords = /(\b\w+\b)(\s+\1){3,}/i.test(title + description); // word word word word

  if (hasRepeatedChars || hasRepeatedWords) {
    issues.push('Spam pattern detected (repeated characters/words)');
    score -= 20;
  }

  // Type-specific adjustments
  if (type === 'bug') {
    // Bugs should have reproduction steps
    if (!hasSteps) {
      issues.push('Bug report should include steps to reproduce');
      score -= 5;
    }
  }

  // === SCORING THRESHOLDS ===
  // 40+  = High quality (good detail, actionable)
  // 20-39 = Medium quality (acceptable, some detail)
  // 10-19 = Low quality (minimal effort, vague)
  // <10   = Very low quality (spam/useless)

  return {
    score,
    quality: score >= 40 ? 'high' : score >= 20 ? 'medium' : score >= 10 ? 'low' : 'very-low',
    issues,
  };
}

/**
 * Configuration for quality handling
 */
const QUALITY_CONFIG = {
  // Minimum score to auto-accept (20 = medium quality)
  minimumScore: 20,

  // Action to take for low-quality issues
  // 'reject' = Don't create issue, return error
  // 'label' = Create issue but add 'needs-triage' label
  // 'close' = Create issue but immediately close it
  lowQualityAction: 'label', // Change to 'reject' to block completely

  // Whether to provide detailed feedback to user
  provideDetailedFeedback: true,
};

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

    // === QUALITY SCORING ===
    const qualityCheck = scoreIssueQuality(title, description, type);

    // Handle low-quality submissions
    if (qualityCheck.score < QUALITY_CONFIG.minimumScore) {
      if (QUALITY_CONFIG.lowQualityAction === 'reject') {
        // Reject the submission entirely
        const errorMessage = QUALITY_CONFIG.provideDetailedFeedback
          ? `Feedback quality is too low (score: ${qualityCheck.score}/100). Please provide more detail:\n${qualityCheck.issues.map(i => `• ${i}`).join('\n')}`
          : 'Please provide more specific details about your feedback. Include steps to reproduce bugs, specific examples for UI issues, or clear descriptions for suggestions.';

        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: errorMessage,
            quality: qualityCheck.quality,
            score: qualityCheck.score,
            suggestions: qualityCheck.issues,
          }),
        };
      }
      // If not rejecting, we'll add a label later
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

    // Build issue body with metadata and quality score
    const timestamp = new Date().toISOString();
    const qualityEmoji = qualityCheck.quality === 'high' ? '✅' :
                        qualityCheck.quality === 'medium' ? '⚠️' :
                        qualityCheck.quality === 'low' ? '❌' : '🚫';

    const issueBody = `${description}

---

**Metadata:**
- **Submitted:** ${timestamp}
- **Page URL:** ${url || 'Not provided'}
- **User Agent:** ${userAgent || 'Not provided'}
- **Quality Score:** ${qualityEmoji} ${qualityCheck.score}/100 (${qualityCheck.quality})
${qualityCheck.issues.length > 0 ? `- **Quality Notes:** ${qualityCheck.issues.join('; ')}` : ''}

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

    // Prepare labels based on quality
    const labels = [label, 'user-feedback'];

    // Add quality-based labels
    if (qualityCheck.score < QUALITY_CONFIG.minimumScore) {
      labels.push('needs-triage'); // Low quality, needs review
    }
    if (qualityCheck.quality === 'high') {
      labels.push('good-first-issue'); // High quality, easy to process
    }

    // Create GitHub issue
    const response = await fetch('https://api.github.com/repos/EtherealCarnivore/omnilyth-core-public/issues', {
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
        labels: labels,
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

    // Handle 'close' action for low-quality issues
    if (qualityCheck.score < QUALITY_CONFIG.minimumScore &&
        QUALITY_CONFIG.lowQualityAction === 'close') {
      // Close the issue with a comment
      await fetch(`https://api.github.com/repos/EtherealCarnivore/omnilyth-core-public/issues/${issue.number}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          state: 'closed',
        }),
      });

      // Add closing comment
      await fetch(`https://api.github.com/repos/EtherealCarnivore/omnilyth-core-public/issues/${issue.number}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          body: `This issue was automatically closed due to low quality (score: ${qualityCheck.score}/100).\n\nTo reopen, please provide:\n${qualityCheck.issues.map(i => `- ${i}`).join('\n')}`,
        }),
      });
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        qualityScore: qualityCheck.score,
        qualityLevel: qualityCheck.quality,
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
