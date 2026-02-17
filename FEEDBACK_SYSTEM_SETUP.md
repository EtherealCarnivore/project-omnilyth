# Feedback System Setup Guide

The feedback system allows users to submit bugs, UI issues, suggestions, and feature requests directly from the website without needing a GitHub account. Submissions are created as GitHub issues via a serverless function.

## How It Works

1. User clicks feedback button in Topbar
2. Fills out form (type, title, description)
3. Submits via serverless function
4. Function creates GitHub issue with labels
5. You view/manage in GitHub Issues tab

---

## Initial Setup (One-Time)

### 1. Create GitHub Personal Access Token

You need a fine-grained personal access token with `issues:write` permission.

**Steps:**
1. Go to: https://github.com/settings/tokens?type=beta
2. Click **"Generate new token"**
3. Configure:
   - **Token name**: `Omnilyth Feedback System`
   - **Expiration**: Custom → 1 year (or never)
   - **Repository access**: Only select repositories → `EtherealCarnivore/project-omnilyth`
   - **Permissions**:
     - Repository permissions → Issues → **Read and write**
4. Click **"Generate token"**
5. **Copy the token** (you won't see it again!)

Token format: `github_pat_11XXXXXXXXXX...`

---

### 2. Add Token to Netlify

**Via Netlify Dashboard:**
1. Go to: https://app.netlify.com/
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Configure:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Paste your token
   - **Scopes**: All (production, deploy previews, branch deploys)
6. Click **Create variable**

**Via Netlify CLI:**
```bash
netlify env:set GITHUB_TOKEN "your_token_here"
```

---

### 3. Deploy

Push to master or manually deploy:
```bash
git push origin master
# Or
netlify deploy --prod
```

---

## Testing Locally

### 1. Install Netlify CLI (if not installed)
```bash
npm install -g netlify-cli
```

### 2. Create `.env` file
```bash
# In project root
echo "GITHUB_TOKEN=your_token_here" > .env
```

**Important:** `.env` is already in `.gitignore` - never commit this file!

### 3. Run Netlify Dev
```bash
netlify dev
# Or
npm run dev  # If configured in package.json
```

This runs Vite dev server + Netlify functions at `http://localhost:8888`

### 4. Test Feedback Form
1. Open `http://localhost:8888`
2. Click feedback button in Topbar
3. Fill form and submit
4. Check GitHub Issues: https://github.com/EtherealCarnivore/project-omnilyth/issues

---

## Usage

### User Flow
1. User clicks feedback icon (💬) in Topbar
2. Selects type:
   - 🐛 Bug Report
   - 🎨 UI Issue
   - 💡 Suggestion
   - ✨ Feature Request
3. Enters title (max 200 chars)
4. Enters description (max 5000 chars)
5. Submits
6. Receives confirmation

### What You See (GitHub)

**Issue Title Format:**
```
🐛 Button doesn't work on mobile
```

**Issue Body Format:**
```markdown
Description of the issue...

---

**Metadata:**
- **Submitted:** 2025-02-17T14:23:45.123Z
- **Page URL:** https://etherealcarnivore.github.io/omnilyth-core-public/crafting/chromatic
- **User Agent:** Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)

*Submitted via Omnilyth feedback form*
```

**Labels Applied:**
- Type label: `bug` / `ui` / `enhancement` / `feature-request`
- Source label: `user-feedback`

### Managing Feedback

**In GitHub Issues:**
- View all: https://github.com/EtherealCarnivore/project-omnilyth/issues
- Filter by label: `label:user-feedback`
- Filter by type: `label:bug`, `label:ui`, etc.
- Close resolved issues
- Add comments to ask follow-up questions
- Assign to yourself or others

---

## Security

### What's Protected
- ✅ GitHub token never exposed to client
- ✅ Input validation (length limits, type validation)
- ✅ CORS configured for your domain only
- ✅ Rate limiting (via GitHub API)
- ✅ No user authentication required

### What's NOT Protected
- ⚠️ Anyone with the site password can submit feedback
- ⚠️ No captcha/anti-spam (GitHub API rate limits apply)
- ⚠️ Metadata is visible in public issues (page URL, user agent)

**For production**: Consider adding:
- Honeypot field (anti-bot)
- Client-side rate limiting
- IP-based rate limiting (via Netlify functions)
- Private repository (if feedback should be private)

---

## Troubleshooting

### "Feedback system not configured"
- Missing `GITHUB_TOKEN` environment variable
- Check Netlify dashboard → Environment variables
- Redeploy after adding token

### "Failed to submit feedback"
- Check Netlify function logs
- Verify token has `issues:write` permission
- Verify token isn't expired
- Check repository name is correct

### Issues not appearing in GitHub
- Check function succeeded (Netlify logs)
- Verify repository: `EtherealCarnivore/project-omnilyth`
- Check GitHub Issues tab isn't filtered
- Try searching: `label:user-feedback`

### Local testing not working
- Ensure `.env` file exists with `GITHUB_TOKEN`
- Use `netlify dev` not `npm run dev` (for functions)
- Check localhost:8888 not localhost:5173

---

## Files Reference

### Serverless Function
- **Path**: `netlify/functions/github-feedback.js`
- **Endpoint**: `/.netlify/functions/github-feedback`
- **Method**: POST
- **Body**: `{ type, title, description, url, userAgent }`

### React Component
- **Path**: `src/components/FeedbackButton.jsx`
- **Integrated**: `src/layout/Topbar.jsx`

### Environment Variables
- **Production**: Netlify dashboard
- **Local**: `.env` file (never commit!)

---

## API Reference

### Request Format
```json
{
  "type": "bug",
  "title": "Button doesn't work",
  "description": "When I click the calculate button, nothing happens",
  "url": "https://example.com/calculator",
  "userAgent": "Mozilla/5.0..."
}
```

### Response Format (Success)
```json
{
  "success": true,
  "issueNumber": 42,
  "issueUrl": "https://github.com/EtherealCarnivore/project-omnilyth/issues/42"
}
```

### Response Format (Error)
```json
{
  "error": "Missing required fields: type, title, description"
}
```

### Status Codes
- `201` - Issue created successfully
- `400` - Invalid request (missing fields, invalid type, too long)
- `405` - Method not allowed (only POST accepted)
- `500` - Server error (GitHub API failure, missing token)

---

## Cost & Limits

### GitHub
- ✅ **Free** for public repositories
- ✅ Unlimited issues
- ✅ 5,000 API requests/hour (per token)
- ✅ No storage limits

### Netlify
- ✅ **Free tier**: 125,000 function invocations/month
- ✅ Each submission = 1 invocation
- ✅ ~4,000+ submissions/day before hitting limit
- ✅ Function timeout: 10 seconds (more than enough)

**Expected usage**: 10-50 submissions/day = well within free tier

---

## Future Enhancements

### Optional Improvements
1. **Screenshot upload** - Allow users to paste/upload images
2. **Anonymous vs authenticated** - Capture GitHub username if logged in
3. **Email notifications** - Get notified on new submissions
4. **Admin dashboard** - View feedback stats in-app
5. **Public feedback board** - Display issues on `/feedback` page
6. **Upvoting** - Users vote on existing suggestions
7. **Status tracking** - Show "in progress" / "fixed" status

### Alternative: Make Repository Private
If you want feedback to be private:
1. Make `project-omnilyth` repository private
2. Token still works the same
3. Only you can see issues

---

## Quick Commands

```bash
# View Netlify environment variables
netlify env:list

# Add token
netlify env:set GITHUB_TOKEN "your_token_here"

# Test locally
netlify dev

# Check function logs
netlify functions:log github-feedback

# Deploy
git push origin master
```

---

## Support

If feedback system stops working:
1. Check GitHub token hasn't expired
2. Check Netlify function logs
3. Verify environment variable is set
4. Test with `curl`:

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/github-feedback \
  -H "Content-Type: application/json" \
  -d '{"type":"bug","title":"Test","description":"Testing feedback system"}'
```

Expected response: `{"success":true,"issueNumber":X,"issueUrl":"..."}`

---

**Setup Time**: 5-10 minutes
**Cost**: $0 (free forever)
**Maintenance**: Token renewal (yearly if set to expire)
