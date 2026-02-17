# 🔐 Beta Access Information

## Password for Friends

Share this information with your beta testers:

---

### How to Access

1. **Go to:** [Your deployed site URL]
2. **Enter password:** `privat3Be7@_SUB_TO_IVA_NOOBS_uwu^.^_`
3. **That's it!** You'll stay logged in for 30 days.

---

## Technical Details

### Password Security
- Hashed with **salt + 100,000 SHA-256 iterations**
- 30-day authentication expiry
- Rate limited (5 attempts per minute)

### Hash Information
```
Salt: b17dcdd27b23987d5fee342af0cde539
Hash: 44ccaf8bfc9415d6741ee12f1526d07667fb136be984f5af044de828b1c70554
```

### Storage
- Authentication token stored in localStorage
- Expires after 30 days
- Users will need to re-enter password after expiry

---

## To Change Password

Run this command with your new password:
```bash
node scripts/generate-password-hash.js "your-new-password"
```

Then update the `SALT`, `HASH`, and `ITERATIONS` values in:
```
src/components/BetaGate.jsx
```

---

## Security Notes

✅ **Good for:**
- Private beta among friends
- Keeping casual visitors out
- Development phase access control

⚠️ **Not suitable for:**
- Protecting sensitive data
- Production authentication
- Preventing determined attackers

For production, migrate to Auth0, Clerk, or Netlify Identity.

---

## User Experience

### First Time
- Clean password prompt
- Enter password once
- Immediate access

### After Authentication
- No more password prompts
- Auto-login for 30 days
- Professional UX

### Wrong Password
- Clear error message
- Rate limited after 5 attempts
- 1-minute cooldown

---

**Last Updated:** 2025-02-17
