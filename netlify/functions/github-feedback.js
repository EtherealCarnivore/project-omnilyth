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

export async function handler(event) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

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

  try {
    // Parse request body
    const { type, title, description, url, userAgent } = JSON.parse(event.body || '{}');

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
      const errorData = await response.json();
      console.error('GitHub API error:', errorData);

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
    console.error('Feedback submission error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
