# Security Audit Report - Project Omnilyth

**Date:** February 17, 2026
**Auditor:** Security Specialist
**Application:** Project Omnilyth - Path of Exile Crafting Toolkit
**Version:** 2.0.0
**Risk Assessment:** **MEDIUM-HIGH**

## Executive Summary

The Omnilyth project is a React-based web application for Path of Exile game crafting calculations. While the application follows many good practices, several security vulnerabilities and areas of concern were identified that require immediate attention.

### Critical Findings
1. **Insecure Password Protection** - Client-side only authentication with hardcoded SHA-256 hash
2. **CORS Proxy Dependency** - Use of third-party proxy service (corsproxy.io) for API calls
3. **Missing Security Headers** - No CSP, X-Frame-Options, or other security headers
4. **Unsafe DOM Manipulation** - Direct innerHTML usage in legacy JavaScript files

### Risk Summary
- **High Risk:** 2 issues
- **Medium Risk:** 5 issues
- **Low Risk:** 3 issues
- **Informational:** 4 items

---

## 1. XSS Vulnerabilities Assessment

### ✅ No dangerouslySetInnerHTML Usage
**Status:** PASS
The React application does not use `dangerouslySetInnerHTML`, which is excellent for XSS prevention.

### ⚠️ Direct innerHTML Usage in Legacy Code
**Status:** FAIL - Medium Risk
**Location:** Multiple legacy JavaScript files
```javascript
// JewellerMethodCalc.js:224
body.innerHTML = html;

// TaintedChromaticCalc.js:74
body.innerHTML = '<tr class="prob">' + ...

// YouTubeCard.jsx:37
e.target.parentElement.innerHTML = `<div class="w-full h-full...
```

**Risk:** Direct innerHTML assignment with concatenated strings can lead to XSS if any user input reaches these functions.

**Recommendation:**
- Migrate legacy code to use safe DOM manipulation methods
- Use `textContent` for text-only content
- Use `createElement` and `appendChild` for complex DOM structures
- For React components, use JSX instead of innerHTML

### ✅ Input Sanitization in React Components
**Status:** PASS
React components properly handle user input through controlled components and state management.

---

## 2. External API Security

### 🔴 Third-Party CORS Proxy Usage
**Status:** FAIL - High Risk
**Location:** `src/hooks/usePrices.js`, `src/components/ScarabCalculator.jsx`

```javascript
return `https://corsproxy.io/?url=${encodeURIComponent(`https://poe.ninja${path}`)}`;
```

**Risks:**
1. **Data Interception** - All API data passes through untrusted third-party proxy
2. **Service Availability** - Application depends on external proxy availability
3. **Data Manipulation** - Proxy could modify response data
4. **Privacy Concerns** - Proxy logs all requests and can track users

**Recommendation:**
- Implement backend API proxy service
- Use environment-specific configuration
- Consider serverless functions (Vercel, Netlify Functions) for API proxying
- Add request signing and response validation

### ⚠️ Reddit API Direct Access
**Status:** Medium Risk
**Location:** `src/contexts/PatchNotesContext.jsx`

```javascript
const REDDIT_API_URL = 'https://www.reddit.com/r/pathofexile/search.json?q=flair_name:"GGG"&sort=new&limit=50&restrict_sr=1';
```

**Risks:**
- No authentication or rate limiting
- Potential for API abuse if traffic scales
- No validation of Reddit response data structure

**Recommendation:**
- Implement response schema validation
- Add error boundaries for malformed data
- Consider caching layer to reduce API calls

---

## 3. Local Storage Security

### ⚠️ Sensitive Data in localStorage
**Status:** Medium Risk

**Items Stored:**
- League cache data
- Regex patterns library
- Patch notes cache
- User preferences
- Progress tracking

**Risks:**
1. **No Encryption** - All data stored in plaintext
2. **XSS Exposure** - Any XSS vulnerability exposes all stored data
3. **No Expiration** - Some data lacks proper TTL management

**Recommendation:**
```javascript
// Implement encrypted storage wrapper
class SecureStorage {
  static encrypt(data) {
    // Use SubtleCrypto API for client-side encryption
    return crypto.subtle.encrypt(/*...*/);
  }

  static setItem(key, value, ttl) {
    const encrypted = await this.encrypt(value);
    const item = {
      data: encrypted,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
}
```

### 🔴 Session Storage for Authentication
**Status:** FAIL - High Risk
**Location:** `src/components/PasswordGate.jsx`

```javascript
sessionStorage.setItem(SESSION_KEY, '1');
```

**Risks:**
- Authentication bypass possible via console
- No server-side validation
- Session persists across tabs

---

## 4. CORS and CSP Headers

### 🔴 Missing Security Headers
**Status:** FAIL - High Risk

**Missing Headers:**
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

**Recommendation:**
Add security headers via Vite configuration:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://poe.ninja https://www.pathofexile.com https://www.reddit.com;",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});
```

For production (GitHub Pages), use meta tags:
```html
<meta http-equiv="Content-Security-Policy" content="...">
```

---

## 5. Dependency Vulnerabilities

### ✅ No Known Vulnerabilities
**Status:** PASS
`npm audit` reports no vulnerabilities in current dependencies.

**Dependencies Reviewed:**
- react: ^19.2.4
- react-router-dom: ^7.13.0
- vite: ^7.3.1
- All dev dependencies

**Recommendation:**
- Set up automated dependency scanning (Dependabot)
- Regular monthly security updates
- Use `npm audit fix` for automatic patches

---

## 6. Input Validation

### ⚠️ Limited Input Validation
**Status:** Medium Risk

**Areas Lacking Validation:**
1. Regex pattern inputs - no complexity limits
2. Numeric inputs - no range validation in some calculators
3. URL parameters - decoded without validation

**Example Issue:**
```javascript
// ClusterJewelCalculator.jsx:46
const names = decodeURIComponent(s).split(',').filter((n) => n && clusterData.sortOrderMap[n]);
```

**Recommendation:**
```javascript
// Add input validation layer
const validateInput = (input, type) => {
  const validators = {
    regex: (val) => {
      if (val.length > 500) throw new Error('Pattern too long');
      try { new RegExp(val); } catch { throw new Error('Invalid regex'); }
    },
    number: (val, min, max) => {
      const num = Number(val);
      if (isNaN(num) || num < min || num > max) {
        throw new Error(`Value must be between ${min} and ${max}`);
      }
    }
  };
  return validators[type](input);
};
```

---

## 7. Authentication/Authorization

### 🔴 Weak Client-Side Authentication
**Status:** FAIL - High Risk
**Location:** `src/components/PasswordGate.jsx`

**Issues:**
1. **Hardcoded Password Hash** - SHA-256 hash visible in source
2. **Client-Side Only** - No server validation
3. **Weak Protection** - Easily bypassed via DevTools

```javascript
const HASH = '39d8e865e9453850ff62a5477e612ecbbf22597f02b64b7a1c9e03e609714158';
```

**Recommendation:**
- Remove password gate for public application
- If protection needed, implement proper backend authentication
- Use OAuth2/OpenID Connect for real authentication
- Consider making it fully open-source without gates

---

## 8. Additional Security Concerns

### ⚠️ Weak UUID Generation
**Status:** Low Risk
**Location:** `src/utils/regexLibrary.js:332`

```javascript
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    // ...
  });
}
```

**Risk:** Math.random() is not cryptographically secure

**Recommendation:**
```javascript
function generateUUID() {
  return crypto.randomUUID(); // Use native secure UUID
}
```

### ⚠️ Information Disclosure
**Status:** Low Risk

**Issues:**
1. Detailed error messages exposed to users
2. Stack traces visible in production build
3. API endpoints revealed in source

---

## Immediate Action Items

### Priority 1 - Critical (Implement within 1 week)
1. [ ] Remove or properly secure PasswordGate component
2. [ ] Implement backend proxy for external API calls
3. [ ] Add CSP and security headers

### Priority 2 - High (Implement within 2 weeks)
1. [ ] Replace innerHTML with safe DOM manipulation
2. [ ] Add input validation for all user inputs
3. [ ] Implement secure storage wrapper for localStorage

### Priority 3 - Medium (Implement within 1 month)
1. [ ] Add response validation for external APIs
2. [ ] Implement rate limiting for API calls
3. [ ] Add error boundaries and sanitization
4. [ ] Replace Math.random() with crypto.randomUUID()

### Priority 4 - Low (Ongoing)
1. [ ] Regular dependency updates
2. [ ] Security monitoring and logging
3. [ ] Penetration testing

---

## Security Best Practices Recommendations

### 1. Implement Defense in Depth
```javascript
// Example: Multi-layer validation
const processUserInput = (input) => {
  // Layer 1: Type checking
  if (typeof input !== 'string') throw new Error('Invalid type');

  // Layer 2: Length limits
  if (input.length > 1000) throw new Error('Input too long');

  // Layer 3: Character whitelist
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(input)) throw new Error('Invalid characters');

  // Layer 4: Business logic validation
  return sanitizeAndProcess(input);
};
```

### 2. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'sha256-[hash]';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://poe.ninja https://www.pathofexile.com;
               frame-ancestors 'none';
               base-uri 'self';
               form-action 'self';">
```

### 3. Secure API Proxy Pattern
```javascript
// Backend proxy endpoint
app.post('/api/proxy/poe-ninja', authenticate, rateLimit, async (req, res) => {
  const { endpoint } = req.body;

  // Whitelist allowed endpoints
  if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
    return res.status(403).json({ error: 'Forbidden endpoint' });
  }

  // Make request with timeout
  const response = await fetch(`https://poe.ninja${endpoint}`, {
    timeout: 5000,
    headers: { 'User-Agent': 'Omnilyth/2.0' }
  });

  // Validate response schema
  const data = await response.json();
  const validated = validateSchema(data, POE_NINJA_SCHEMA);

  res.json(validated);
});
```

---

## Conclusion

The Omnilyth project demonstrates good React development practices but has significant security gaps that need addressing. The most critical issues are:

1. **Dependency on third-party CORS proxy** - Major privacy and security risk
2. **Weak client-side authentication** - Easily bypassed protection
3. **Missing security headers** - Vulnerable to various attacks
4. **Legacy code with innerHTML** - Potential XSS vectors

Implementing the recommended fixes will significantly improve the application's security posture. Focus on the Priority 1 items first, as they address the most critical vulnerabilities.

## Risk Matrix

| Component | Current Risk | After Mitigation | Priority |
|-----------|-------------|------------------|----------|
| CORS Proxy | HIGH | LOW | 1 |
| Authentication | HIGH | LOW | 1 |
| Security Headers | HIGH | LOW | 1 |
| innerHTML Usage | MEDIUM | LOW | 2 |
| Input Validation | MEDIUM | LOW | 2 |
| localStorage | MEDIUM | LOW | 2 |
| UUID Generation | LOW | NEGLIGIBLE | 3 |

---

**Disclaimer:** This audit represents a point-in-time assessment. Regular security reviews and updates are recommended as the application evolves.