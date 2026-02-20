# Privacy Policy

**Effective Date:** February 21, 2026
**Last Updated:** February 21, 2026

## Our Commitment

Omnilyth is a free, community-driven toolkit for Path of Exile players. **We do not track users, sell data, or serve advertisements.** This privacy policy explains what data we access, how we use it, and your rights.

---

## What We Collect

### 1. **No Personal Information Required**

You can use Omnilyth without creating an account or providing personal information. We do not collect:
- ❌ Names
- ❌ Email addresses
- ❌ Phone numbers
- ❌ Physical addresses
- ❌ Credit card information

### 2. **Browser Storage (LocalStorage)**

We store data in your browser to enhance your experience:

| Data | Purpose | Storage |
|------|---------|---------|
| League selection | Remember your preferred league | `localStorage` |
| Pinned modules | Save your favorite calculators | `localStorage` |
| Design variant preference | Remember v1/v2 layout choice | `localStorage` |
| Leveling progress | Track completed acts/quests | `localStorage` |
| Regex library | Save your custom regex patterns | `localStorage` |
| Patch notes read status | Track which patch notes you've read | `localStorage` |

**Important:** This data **never leaves your device**. It's stored locally in your browser and is automatically deleted if you clear your browser data.

### 3. **No Cookies**

We do **not** use cookies for tracking. The only cookies we use are:
- **Technical cookies** (when OAuth is implemented) - Secure httpOnly cookies for authentication tokens only

### 4. **No Analytics or Tracking**

We do **not** use:
- ❌ Google Analytics
- ❌ Facebook Pixel
- ❌ Tracking pixels
- ❌ Heatmaps
- ❌ Session recording
- ❌ A/B testing services
- ❌ Advertising networks

---

## What We Access (When You Use OAuth)

**Note:** OAuth integration is currently in development. When implemented, the following will apply:

### Path of Exile Account Data

If you choose to **"Login with Path of Exile"**, we will request access to:

| Data Type | What We See | Why We Need It | How We Use It |
|-----------|-------------|----------------|---------------|
| **Account Profile** | Your PoE account name | To personalize the site | Display "Logged in as: YourName" |
| **Character List** | Character names, levels, classes | To import your characters | Show in build planner |
| **Stash Tabs** | Gem items in your stash | To scan for owned gems | Highlight gems you already have |

### What We Do NOT Access

Even with OAuth, we **cannot** and **will not** access:
- ❌ Your password (handled by GGG)
- ❌ Payment information
- ❌ Private messages
- ❌ Trade history
- ❌ MTX purchases
- ❌ Email address (unless GGG provides it)

### User Consent

Before accessing your PoE account:
1. **You click** "Login with Path of Exile"
2. **GGG shows you** exactly what we're requesting
3. **You approve** or deny the request
4. **You can revoke** access anytime at pathofexile.com/my-account

We only access data **you explicitly authorize**.

---

## How We Use Data

### What We DO:

✅ **Store data in your browser** (localStorage/sessionStorage)
- League preference
- Calculator settings
- Saved regex patterns
- Leveling progress

✅ **Fetch prices from poe.ninja**
- Public API calls
- Cached for 24 hours
- No user data sent

✅ **Proxy API requests** (via Netlify Functions)
- To avoid CORS issues
- To secure OAuth tokens
- No logging or storage

✅ **Submit feedback** (with your permission)
- Creates GitHub issues
- Only includes data you provide in the form
- No automatic user tracking

### What We DON'T Do:

❌ **No server-side storage**
- We don't have a database
- We can't store your data even if we wanted to

❌ **No behavioral tracking**
- We don't track clicks, scrolls, or page views
- We don't build user profiles
- We don't analyze usage patterns

❌ **No third-party data sharing**
- We don't sell data (we don't have any to sell!)
- We don't share data with advertisers
- We don't use analytics services

❌ **No monetization**
- No ads
- No premium features
- No data mining
- Completely free

---

## Data Security

### How We Protect Your Data

🔒 **HTTPS Everywhere**
- All connections encrypted
- No unencrypted transmission

🔒 **Secure Token Storage**
- Access tokens: Memory only (cleared on tab close)
- Refresh tokens: httpOnly cookies (can't be accessed by JavaScript)
- Client secrets: Server-side only (Netlify environment variables)

🔒 **No Data Persistence**
- SessionStorage cleared when you close the tab
- LocalStorage can be cleared anytime
- No server-side storage

🔒 **Open Source Code**
- All code is public (or will be)
- Community can audit for security issues
- Transparent implementation

### Your Responsibilities

- **Keep your browser secure** - Update regularly, use strong passwords
- **Clear browser data** - If using a shared computer
- **Revoke OAuth access** - If you no longer want us to access your PoE account

---

## Your Rights

### You Can Always:

✅ **View your data** - Check localStorage in browser DevTools
✅ **Delete your data** - Clear browser storage (Settings → Clear Data)
✅ **Revoke OAuth** - Visit pathofexile.com/my-account/applications
✅ **Export your data** - Copy localStorage data (all text, easily portable)
✅ **Use without account** - No registration required for most features

### GDPR Compliance (If Applicable)

If you're in the EU, you have additional rights:
- **Right to Access** - See what data we have (none on our servers!)
- **Right to Deletion** - Request data deletion (clear localStorage)
- **Right to Portability** - Export your data (JSON format)
- **Right to Rectification** - Correct inaccurate data (edit localStorage)

**Since we don't store user data on servers**, most GDPR requests are handled client-side (clear your browser data).

---

## Third-Party Services

### Data Fetched From:

**poe.ninja API**
- Public price data
- No user tracking
- See [poe.ninja Privacy Policy](https://poe.ninja)

**Path of Exile API** (when OAuth implemented)
- Your PoE account data (with your consent)
- See [GGG Privacy Policy](https://www.pathofexile.com/privacy-policy)

**GitHub Issues** (for feedback)
- Creates public issues with data you provide
- See [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

**Netlify** (hosting)
- Edge functions for API proxying
- No user tracking configured
- See [Netlify Privacy Policy](https://www.netlify.com/privacy/)

### We Don't Send Data To:

❌ Advertising networks
❌ Analytics services
❌ Social media trackers
❌ Data brokers
❌ Marketing platforms

---

## Children's Privacy

Omnilyth is not directed at children under 13. We do not knowingly collect information from children. If you're under 13, please don't use OAuth features.

Path of Exile is rated M (Mature 17+). Please follow GGG's age requirements.

---

## Changes to This Policy

We may update this privacy policy to reflect:
- New features (e.g., OAuth implementation)
- Legal requirements
- User feedback

**How we'll notify you:**
- Update "Last Updated" date
- Post notice on homepage
- GitHub commit message

**Your continued use** of Omnilyth after changes means you accept the updated policy.

---

## Data Retention

### LocalStorage Data
- **Retained:** Until you clear browser data
- **Deleted:** When you clear browser storage or uninstall browser

### OAuth Tokens
- **Access tokens:** Expire after 28 days
- **Refresh tokens:** Cleared when you logout
- **Stored:** In secure httpOnly cookies only

### No Server-Side Data
- We don't have a database
- Nothing to retain on our side
- All data is client-side

---

## Contact Us

Questions about privacy?

- **GitHub Issues:** https://github.com/EtherealCarnivore/project-omnilyth/issues
- **Reddit:** r/pathofexile (mention @Omnilyth)
- **In-App Feedback:** Use the feedback button (bottom-right)

We respond to privacy inquiries within 7 days.

---

## Transparency Commitment

**We believe in radical transparency:**
- All code is open source (or will be)
- No hidden tracking
- No dark patterns
- No data collection beyond what's necessary
- Clear explanations of what we access and why

**If we ever change our stance on privacy (e.g., add analytics), we will:**
1. Make it **opt-in only** (disabled by default)
2. Announce it prominently on the homepage
3. Explain exactly what changed and why
4. Provide an easy way to disable it

**Our promise:** Omnilyth will always prioritize user privacy over monetization.

---

## Legal Compliance

### Applicable Laws
- GDPR (EU General Data Protection Regulation) - ✅ Compliant (no data stored)
- CCPA (California Consumer Privacy Act) - ✅ Compliant (no data sold)
- COPPA (Children's Online Privacy Protection Act) - ✅ Compliant (no data collection from children)

### Terms Summary
- **No warranties** - Use at your own risk
- **No liability** - We're not responsible for calculator errors or game decisions
- **Open source** - MIT License (see LICENSE file)
- **Fair use** - Game data used for informational purposes only

---

**Summary:** We don't collect your data, we don't track you, we don't serve ads. Everything stays in your browser. When OAuth is added, you'll explicitly authorize what we access, and you can revoke it anytime.

**Questions? Ask us!** We're here to help, not to collect data.

---

*This privacy policy is written in plain English, not legalese. If anything is unclear, please ask.*

*Omnilyth is a fan-made tool. We are not affiliated with Grinding Gear Games.*
