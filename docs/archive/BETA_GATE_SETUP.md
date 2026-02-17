# 🔐 Beta Gate Setup Guide

## Overview

Your private beta password protection is now set up with **much better security** than before:

### ✅ Security Improvements
- **Salt + 100,000 iterations** (vs single SHA-256 before)
- **30-day authentication expiry** (users stay logged in for a month)
- **Rate limiting** (max 5 attempts per minute)
- **Better UX** (no rickroll trolling, professional design)
- **Clear security model** (honest about limitations)

### ⚠️ Security Model

**This is good for:**
- ✅ Private beta among friends
- ✅ Keeping casual users out during development
- ✅ "Good enough" security for non-sensitive data

**This is NOT good for:**
- ❌ Protecting truly sensitive data
- ❌ Production authentication
- ❌ Preventing determined attackers (DevTools can bypass this)

**For production:** Use Auth0, Clerk, or Netlify Identity (see `AUTHENTICATION_REMOVED.md`)

---

## Setup Instructions

### Step 1: Generate Your Password Hash

**Tell me your password string**, and I'll generate a secure hash for you.

Or run this command yourself:

```bash
node scripts/generate-password-hash.js "your-password-here"
```

**Example:**
```bash
node scripts/generate-password-hash.js "PathOfExile2025Beta!"
```

This will output:
```
✅ Password hash generated successfully!

═══════════════════════════════════════════════════════════════

📋 Copy these values to src/components/BetaGate.jsx:

const SALT = 'a3f8d9e2b1c4f5a6...';
const HASH = '7d2e8f1a3b4c5d6e...';
const ITERATIONS = 100000;

═══════════════════════════════════════════════════════════════
```

### Step 2: Update BetaGate.jsx

Open `src/components/BetaGate.jsx` and replace these lines:

```javascript
// FIND THESE LINES (around line 35):
const SALT = 'YOUR_SALT_HERE';
const HASH = 'YOUR_HASH_HERE';
const ITERATIONS = 100000;

// REPLACE WITH YOUR GENERATED VALUES:
const SALT = 'a3f8d9e2b1c4f5a6...'; // Your actual salt
const HASH = '7d2e8f1a3b4c5d6e...'; // Your actual hash
const ITERATIONS = 100000;
```

### Step 3: Test It

```bash
# Start dev server (auth bypassed in dev mode)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
# Now you'll see the password gate - test it!
```

### Step 4: Deploy

```bash
git add .
git commit -m "Add beta gate with secure password protection"
git push origin main
```

---

## User Experience

### First Visit
1. User sees a clean password prompt
2. They enter the password you gave them
3. If correct: redirected to app immediately
4. Authentication stored for 30 days

### Subsequent Visits
- No password prompt - automatically authenticated
- Valid for 30 days
- After 30 days, they'll need to re-enter password

### Wrong Password
- Clear error message
- After 5 failed attempts: 1-minute cooldown
- Professional UX (no rickrolling)

---

## How It Works

### Password Hashing
```javascript
// Your password string
"PathOfExile2025Beta!"

// + Random salt (unique per deployment)
+ "a3f8d9e2b1c4f5a6..."

// = Hashed 100,000 times with SHA-256
= "7d2e8f1a3b4c5d6e..." (final hash)
```

### Authentication Flow
```
User enters password
    ↓
Hash with salt + 100k iterations (takes ~100ms)
    ↓
Compare to stored hash
    ↓
If match: Store auth token + 30-day expiry
    ↓
Redirect to app
```

### Storage
```javascript
localStorage.setItem('beta_auth_token', HASH);
localStorage.setItem('beta_auth_expiry', Date.now() + 30_DAYS);
```

---

## Sharing Access

### Give your friends:
1. **The URL**: `https://your-site.netlify.app`
2. **The password**: `PathOfExile2025Beta!` (or whatever you chose)

That's it! They enter it once and have access for 30 days.

---

## Security Notes

### What This Protects Against
- ✅ Casual visitors stumbling upon the site
- ✅ Search engines indexing your beta
- ✅ Friends accidentally sharing the URL publicly

### What This DOESN'T Protect Against
- ❌ Someone with DevTools who knows JavaScript
- ❌ Rainbow table attacks (hash is public in source code)
- ❌ Brute force if they have infinite time

### Why It's Still Useful
For a **private beta among friends**, this is perfectly adequate:
- Your friends aren't trying to hack you
- Casual visitors are blocked
- Professional UX with proper rate limiting
- Clear security model without false promises

---

## Comparison with Old Password Gate

| Feature | Old PasswordGate | New BetaGate |
|---------|------------------|--------------|
| Hashing | Single SHA-256 | Salt + 100k iterations |
| Expiry | Session only | 30 days |
| Rate Limiting | None | 5 attempts/minute |
| UX | Rickroll on fail | Professional |
| Security Model | Hidden | Documented clearly |
| Development | Always active | Bypassed in dev |

---

## Troubleshooting

### "I forgot my password"
No problem! Just generate a new hash:
```bash
node scripts/generate-password-hash.js "new-password"
```
Update `BetaGate.jsx` with new values.

### "Users get logged out too quickly"
Change the duration in `BetaGate.jsx`:
```javascript
const AUTH_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days instead of 30
```

### "Rate limiting is too strict"
Adjust the limits in `BetaGate.jsx`:
```javascript
const MAX_ATTEMPTS = 10; // Allow 10 attempts instead of 5
```

### "I want to kick everyone out"
Change any of these values in `BetaGate.jsx`:
```javascript
const AUTH_KEY = 'beta_auth_token_v2'; // Change version
// Everyone will need to re-authenticate
```

---

## Need Real Authentication?

If your beta grows or you need actual security, migrate to:

**Netlify Identity** (easiest):
```bash
npm install netlify-identity-widget
```

**Clerk** (best UX):
```bash
npm install @clerk/clerk-react
```

**Auth0** (most features):
```bash
npm install @auth0/auth0-react
```

See `AUTHENTICATION_REMOVED.md` for implementation guides.

---

## Ready to Set Up?

**Tell me your password string** and I'll generate the hash for you right now! 🔐

Example: `"PathOfExile2025BetaAccess"` or `"ExileDevs2025"` or whatever you want.
