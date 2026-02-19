# Feedback Quality Scoring System

Automatic quality filtering for GitHub issue submissions via the feedback form.

## How It Works

Every feedback submission is scored on a 0-100 scale based on multiple quality dimensions:

### Scoring Criteria

**Title Quality (25 points max)**
- ✅ **Length:** 10-100 chars = 15 pts, 5-10 chars = 5 pts
- ✅ **Specificity:** Specific title = +10 pts, vague/generic = -10 pts
- ❌ **All caps:** > 70% caps = -5 pts
- ❌ **Excessive punctuation:** Multiple !!! or ??? = -5 pts

**Description Quality (35 points max)**
- ✅ **Length:** 100+ chars = 25 pts, 30-100 = 15 pts, 10-30 = 5 pts
- ✅ **Actionable content:** Steps/reproduction = +10 pts
- ✅ **Details:** Browser/version/error info = +10 pts
- ❌ **Just complaints:** No specifics = -15 pts

**Spam Detection (20 points deduction)**
- ❌ **Repeated characters:** "aaaaaaaa" = -20 pts
- ❌ **Repeated words:** "word word word word" = -20 pts

**Type-Specific**
- Bug reports without reproduction steps = -5 pts

---

## Quality Levels

| Score | Quality | Action |
|-------|---------|--------|
| 40-100 | **High** | ✅ Auto-accept + `good-first-issue` label |
| 20-39 | **Medium** | ✅ Accept without special labels |
| 10-19 | **Low** | ⚠️ Accept + `needs-triage` label |
| 0-9 | **Very Low** | ❌ Configurable (reject/label/close) |

---

## Configuration

Edit `netlify/functions/github-feedback.js`:

```javascript
const QUALITY_CONFIG = {
  // Minimum score to auto-accept (20 = medium quality)
  minimumScore: 20,

  // Action for low-quality issues:
  // 'reject' = Don't create issue, return error to user
  // 'label'  = Create issue with 'needs-triage' label (DEFAULT)
  // 'close'  = Create issue but immediately close it
  lowQualityAction: 'label',

  // Whether to show detailed feedback to users
  provideDetailedFeedback: true,
};
```

---

## Examples

### ❌ Very Low Quality (Score: 5)
**Title:** "bad"
**Description:** "ui sucks"
**Issues:**
- Title too short (3 chars)
- Title is vague
- Description too short (7 chars)
- Description lacks details

**Action (reject mode):** Returns 400 error with improvement suggestions

**Action (label mode):** Creates issue with `needs-triage` label

---

### ⚠️ Low Quality (Score: 15)
**Title:** "fix it"
**Description:** "The colors are terrible and I don't like the buttons"
**Issues:**
- Title too vague
- No specific examples
- No actionable feedback

**Action:** Creates issue with `needs-triage` label

---

### ✅ Medium Quality (Score: 30)
**Title:** "Chromatic calculator shows wrong probabilities"
**Description:** "When I enter 4R2B sockets, the calculator shows 15% chance but I think it should be 12%"
**Issues:**
- Could include more detail (browser, steps)

**Action:** Creates issue normally

---

### ✅ High Quality (Score: 65)
**Title:** "Chromatic calculator incorrect for 4R2B on item level 50+ items"
**Description:** "Steps to reproduce:
1. Open Chromatic Calculator
2. Select Body Armour
3. Enter 4R2B sockets
4. Item level 50+

Expected: 12.5% probability
Actual: 15.3% shown

Browser: Chrome 120
Page: /crafting/chromatic"

**Issues:** None

**Action:** Creates issue with `good-first-issue` label

---

## Detected Patterns

### Vague Titles (Penalized)
- "bad", "terrible", "sucks", "horrible"
- "fix", "help", "problem", "issue" (alone)
- "doesn't work", "not working", "broken"
- "UI bad", "colors bad", "design sucks"

### Good Indicators (Rewarded)
- Steps to reproduce
- Expected vs actual behavior
- Browser/version info
- Specific page URLs
- Error messages
- Console output

### Spam Patterns (Heavily Penalized)
- Repeated characters: "aaaaaaaaa"
- Repeated words: "help help help help"
- All caps: "THIS IS BROKEN FIX IT NOW"
- Excessive punctuation: "FIX THIS!!!!!!"

---

## Integration with GitHub

### Labels Applied

**Always:**
- Type-based: `bug`, `ui`, `enhancement`, or `feature-request`
- `user-feedback` (all submissions)

**Quality-based:**
- `good-first-issue` - High quality (score 40+)
- `needs-triage` - Low quality (score <20)

### Issue Body Includes Quality Score

```markdown
---

**Metadata:**
- **Submitted:** 2026-02-19T12:00:00Z
- **Page URL:** /crafting/chromatic
- **User Agent:** Chrome/120.0.0
- **Quality Score:** ✅ 65/100 (high)

*Submitted via Omnilyth feedback form*
```

---

## Recommended Configurations

### Strict (For High-Traffic Sites)
```javascript
minimumScore: 30,
lowQualityAction: 'reject',
provideDetailedFeedback: true,
```
- Blocks vague/spam submissions
- Forces users to provide details
- Shows improvement suggestions

### Balanced (Default)
```javascript
minimumScore: 20,
lowQualityAction: 'label',
provideDetailedFeedback: true,
```
- Accepts most submissions
- Flags low-quality for review
- Lets maintainer decide

### Permissive (For Small Projects)
```javascript
minimumScore: 10,
lowQualityAction: 'label',
provideDetailedFeedback: false,
```
- Accepts almost everything
- Only blocks obvious spam
- Minimal user friction

---

## Monitoring Quality

Check GitHub labels to see quality distribution:
- `good-first-issue` - High quality submissions
- `needs-triage` - Low quality submissions

If too many `needs-triage` issues:
1. Increase `minimumScore` threshold
2. Switch to `lowQualityAction: 'reject'`
3. Update feedback form with better guidance

If too few submissions:
1. Decrease `minimumScore` threshold
2. Disable `provideDetailedFeedback`
3. Make feedback form more prominent

---

## Testing

### Test Low-Quality Submission
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/github-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "type": "bug",
    "title": "bad",
    "description": "ui sucks",
    "url": "/test"
  }'
```

Expected (reject mode): 400 error with improvement suggestions

Expected (label mode): 201 success with `needs-triage` label

### Test High-Quality Submission
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/github-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "type": "bug",
    "title": "Calculator shows incorrect value for 4R2B configuration",
    "description": "When entering 4R2B sockets on the Chromatic Calculator, the displayed probability is 15.3% but manual calculation shows it should be 12.5%. Steps to reproduce: 1. Open calculator 2. Select Body Armour 3. Enter 4R2B. Browser: Chrome 120, Page: /crafting/chromatic",
    "url": "/crafting/chromatic"
  }'
```

Expected: 201 success with `good-first-issue` label

---

## User Experience

### Rejected Submission (Strict Mode)

User sees:
```
❌ Feedback quality is too low (score: 15/100).
Please provide more detail:

• Title is too vague or generic
• Description too short (minimum 30 characters)
• Description lacks specific details or actionable feedback

Please be more specific:
- For bugs: Include steps to reproduce
- For UI issues: Specify which page/element
- For suggestions: Explain the problem and proposed solution
```

### Accepted Low-Quality (Balanced Mode)

User sees:
```
✅ Feedback submitted successfully!
Issue #123 created.

Note: Your feedback was flagged for review due to limited detail.
Consider adding:
• Steps to reproduce (for bugs)
• Specific examples
• Browser/device information
```

---

## Privacy & Security

**What's stored in quality metadata:**
- ✅ Quality score (0-100)
- ✅ Quality level (high/medium/low)
- ✅ Quality issues (generic feedback, not user-specific)
- ❌ **NOT stored:** IP addresses, user identifiers

**User data handling:**
- Quality checks are stateless
- No user tracking between submissions
- Rate limiting by IP (5 per minute)

---

## Future Enhancements

Potential improvements:
- ML-based spam detection
- Duplicate detection (similar issue already exists)
- Sentiment analysis (hostile vs constructive)
- Auto-suggest similar existing issues
- User reputation system (frequent submitters)
- Language detection (non-English support)

---

**Last Updated:** 2026-02-19
**Version:** 1.0.0
**Status:** Production Ready
