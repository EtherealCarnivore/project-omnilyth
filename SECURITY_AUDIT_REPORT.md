# 🔒 SECURITY AUDIT REPORT - Project Omnilyth

**Date:** February 18, 2026
**Auditor:** Security Specialist (OWASP Framework)
**Scope:** Comprehensive security assessment of omnilyth.app
**Exclusions:** BetaGate.jsx password system (acknowledged as intentionally weak)

---

## 🚨 CRITICAL VULNERABILITIES (Immediate Action Required)

### 1. **DOM-Based XSS via innerHTML Manipulation**
**Severity:** CRITICAL
**OWASP:** A03:2021 – Injection
**Location:** `/src/components/YouTubeCard.jsx:38`
**Risk Rating:** 9/10

**Vulnerability:**
```javascript
e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-lg font-bold text-red-400 bg-zinc-800/60">${CHANNEL_NAME[0]}</div>`;
```

**Attack Vector:**
If `CHANNEL_NAME` contains malicious JavaScript, it will execute in the user's browser context. An attacker could modify the constant or inject malicious content.

**Proof of Concept:**
```javascript
const CHANNEL_NAME = '<img src=x onerror="alert(document.cookie)">';
```

**Recommended Fix:**
```javascript
// Use React's safe rendering instead of innerHTML
onError={e => {
  const parent = e.target.parentElement;
  const fallback = document.createElement('div');
  fallback.className = 'w-full h-full flex items-center justify-center text-lg font-bold text-red-400 bg-zinc-800/60';
  fallback.textContent = CHANNEL_NAME[0];
  parent.replaceChild(fallback, e.target);
}}
```

---

## ⚠️ HIGH SEVERITY VULNERABILITIES

### 2. **Overly Permissive CORS Configuration**
**Severity:** HIGH
**OWASP:** A05:2021 – Security Misconfiguration
**Locations:**
- `/netlify/functions/github-feedback.js:15`
- `/netlify/functions/poe-ninja-proxy.js:70`
- `/api/poe-ninja-proxy.js:56`
- `/workers/poe-ninja-proxy.js:12,76`
**Risk Rating:** 7/10

**Vulnerability:**
```javascript
'Access-Control-Allow-Origin': '*'
```

**Attack Vector:**
Any malicious website can make requests to these endpoints, potentially:
- Abuse the GitHub feedback system for spam
- Use the proxy for their own purposes (resource theft)
- Perform reconnaissance on internal services

**Recommended Fix:**
```javascript
// Whitelist specific origins
const allowedOrigins = [
  'https://omnilyth.app',
  'https://omnilyth-beta.netlify.app',
  'https://etherealcarnivore.github.io'
];

const origin = event.headers.origin || event.headers.referer;
if (allowedOrigins.includes(origin)) {
  headers['Access-Control-Allow-Origin'] = origin;
} else {
  return { statusCode: 403, body: 'Forbidden' };
}
```

### 3. **Missing Rate Limiting on Serverless Functions**
**Severity:** HIGH
**OWASP:** A04:2021 – Insecure Design
**Locations:** All serverless functions
**Risk Rating:** 7/10

**Vulnerability:**
No rate limiting implementation allows unlimited requests, enabling:
- DoS attacks
- Resource exhaustion
- Cost inflation (serverless billing)
- GitHub API quota exhaustion

**Attack Vector:**
```bash
# Spam attack example
for i in {1..10000}; do
  curl -X POST https://omnilyth.app/.netlify/functions/github-feedback \
    -d '{"type":"bug","title":"Spam","description":"Attack"}'
done
```

**Recommended Fix:**
Implement rate limiting using Netlify's built-in features or custom implementation:
```javascript
// Simple in-memory rate limiter
const rateLimiter = new Map();
const RATE_LIMIT = 5; // requests
const WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimits = rateLimiter.get(ip) || [];
  const recentRequests = userLimits.filter(time => now - time < WINDOW);

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}

// In handler:
const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'];
if (!checkRateLimit(ip)) {
  return { statusCode: 429, body: 'Too many requests' };
}
```

### 4. **Insufficient Input Sanitization in Feedback System**
**Severity:** HIGH
**OWASP:** A03:2021 – Injection
**Location:** `/netlify/functions/github-feedback.js`
**Risk Rating:** 6/10

**Vulnerability:**
While basic length validation exists, there's no content sanitization before creating GitHub issues. Malicious markdown could be injected.

**Attack Vector:**
```javascript
{
  "title": "Test](https://evil.com) [Click",
  "description": "![](https://evil.com/track.gif)\n<script>alert(1)</script>"
}
```

**Recommended Fix:**
```javascript
const DOMPurify = require('isomorphic-dompurify');

// Sanitize inputs
const sanitizedTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [] });
const sanitizedDescription = DOMPurify.sanitize(description, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre'],
  ALLOWED_ATTR: []
});
```

---

## 🟡 MEDIUM SEVERITY VULNERABILITIES

### 5. **Weak Cryptographic Key Management**
**Severity:** MEDIUM
**OWASP:** A02:2021 – Cryptographic Failures
**Location:** `/src/utils/secureStorage.js:78-87`
**Risk Rating:** 5/10

**Vulnerability:**
Device key stored in plaintext localStorage, defeating encryption purpose:
```javascript
localStorage.setItem('__device_key', key);
```

**Attack:**
Any XSS vulnerability gives access to the encryption key, making encrypted storage pointless.

**Recommended Fix:**
```javascript
// Use Web Crypto API for non-extractable keys
async function getDeviceKey() {
  const keyName = '__device_key_handle';

  // Try to retrieve existing key
  let keyHandle = localStorage.getItem(keyName);

  if (!keyHandle) {
    // Generate non-extractable key
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false, // non-extractable
      ['encrypt', 'decrypt']
    );

    // Store only a reference/handle, not the key itself
    const exported = await crypto.subtle.exportKey('jwk', key);
    keyHandle = btoa(JSON.stringify(exported));
    localStorage.setItem(keyName, keyHandle);
  }

  return keyHandle;
}
```

### 6. **ReDoS Risk in Regex Validation**
**Severity:** MEDIUM
**OWASP:** A03:2021 – Injection
**Location:** `/src/utils/inputValidation.js:111`
**Risk Rating:** 5/10

**Vulnerability:**
```javascript
if (allowedChars && !new RegExp(`^${allowedChars}*$`).test(str))
```

User-controlled `allowedChars` could create catastrophic backtracking.

**Attack Vector:**
```javascript
validateString(input, { allowedChars: '(a+)+b' });
// With input "aaaaaaaaaaaaaaaaaaaaaaaaa" causes CPU spike
```

**Recommended Fix:**
```javascript
// Use safe regex patterns or character whitelists
const SAFE_PATTERNS = {
  alphanumeric: /^[a-zA-Z0-9]*$/,
  alphanumericSpace: /^[a-zA-Z0-9\s]*$/,
  // ... predefined safe patterns
};

if (allowedChars && SAFE_PATTERNS[allowedChars]) {
  if (!SAFE_PATTERNS[allowedChars].test(str)) {
    return defaultValue;
  }
}
```

### 7. **Missing CSRF Protection**
**Severity:** MEDIUM
**OWASP:** A01:2021 – Broken Access Control
**Location:** All serverless functions
**Risk Rating:** 5/10

**Vulnerability:**
No CSRF tokens or origin validation for state-changing operations.

**Recommended Fix:**
```javascript
// Add CSRF token validation
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Store in session/cookie and validate on requests
if (event.httpMethod === 'POST') {
  const token = event.headers['x-csrf-token'];
  const sessionToken = getSessionToken(event);

  if (token !== sessionToken) {
    return { statusCode: 403, body: 'Invalid CSRF token' };
  }
}
```

---

## 🟢 LOW SEVERITY VULNERABILITIES

### 8. **Information Disclosure in Error Messages**
**Severity:** LOW
**OWASP:** A09:2021 – Security Logging and Monitoring Failures
**Location:** Multiple serverless functions
**Risk Rating:** 3/10

**Vulnerability:**
Console.error exposes internal details in production logs.

**Recommended Fix:**
```javascript
// Use structured logging with appropriate levels
if (process.env.NODE_ENV === 'production') {
  // Log to monitoring service, not console
  logger.error('GitHub API error', {
    error: error.message,
    timestamp: new Date().toISOString()
  });
} else {
  console.error('GitHub API error:', error);
}
```

### 9. **Missing Subresource Integrity (SRI)**
**Severity:** LOW
**OWASP:** A08:2021 – Software and Data Integrity Failures
**Location:** External resource loading
**Risk Rating:** 3/10

**Recommended Fix:**
```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

### 10. **Unsafe GitHub Token Storage in Environment**
**Severity:** LOW (Mitigated by platform security)
**OWASP:** A02:2021 – Cryptographic Failures
**Location:** `GITHUB_TOKEN` environment variable
**Risk Rating:** 2/10

**Note:** While environment variables are generally secure on platforms like Netlify, consider using encrypted secrets management for defense in depth.

---

## ✅ POSITIVE SECURITY FINDINGS

1. **Content Security Policy (CSP)** properly configured in `netlify.toml` and `index.html`
2. **Input validation utilities** in place with `inputValidation.js`
3. **Path validation** in proxy functions prevents SSRF attacks
4. **Secure headers** (X-Frame-Options, X-Content-Type-Options) configured
5. **HTTPS enforcement** across all deployments
6. **No SQL/NoSQL databases** = No injection risks
7. **Dependencies are current** with latest React 19 and other packages

---

## 📊 RISK SUMMARY

| Severity | Count | OWASP Categories Affected |
|----------|-------|---------------------------|
| CRITICAL | 1 | A03 (Injection) |
| HIGH | 4 | A01, A03, A04, A05 |
| MEDIUM | 3 | A01, A02, A03 |
| LOW | 2 | A08, A09 |

**Overall Security Score: 6/10** (Moderate Risk)

---

## 🔧 IMMEDIATE ACTION ITEMS

### Priority 1 (Do Today):
1. **Fix DOM XSS** in YouTubeCard.jsx - Critical vulnerability
2. **Implement rate limiting** on all serverless functions
3. **Restrict CORS origins** to known domains only

### Priority 2 (This Week):
1. Add input sanitization to feedback system
2. Implement CSRF protection
3. Fix ReDoS vulnerability in validation

### Priority 3 (This Month):
1. Improve cryptographic key management
2. Add security monitoring and alerting
3. Implement proper error handling for production

---

## 🛡️ SECURITY HARDENING RECOMMENDATIONS

### 1. **Implement Security Headers Enhancement**
```javascript
// Add to all responses
headers: {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Expect-CT': 'max-age=86400, enforce',
  'Feature-Policy': "camera 'none'; microphone 'none'; geolocation 'none'"
}
```

### 2. **Add Request Signing**
```javascript
// Sign requests to prevent tampering
const signature = crypto
  .createHmac('sha256', SECRET_KEY)
  .update(JSON.stringify(payload))
  .digest('hex');
```

### 3. **Implement Audit Logging**
```javascript
// Log all security-relevant events
const auditLog = {
  timestamp: new Date().toISOString(),
  ip: request.ip,
  action: 'feedback_submission',
  userId: userId || 'anonymous',
  result: 'success|failure',
  metadata: { /* relevant data */ }
};
```

### 4. **Add Dependency Scanning**
```bash
# Add to CI/CD pipeline
npm audit
npm audit fix
# Consider using Snyk or similar tools
```

---

## 📝 COMPLIANCE NOTES

### GDPR Considerations:
- User agent and IP logging may require consent
- Add privacy policy for data collection
- Implement data deletion mechanisms

### Security Best Practices:
- Regular security updates needed
- Penetration testing recommended quarterly
- Security training for development team advised

---

## 🎯 CONCLUSION

Project Omnilyth has a **moderate security posture** with one critical vulnerability requiring immediate attention. The application demonstrates good security awareness with CSP implementation and input validation, but needs improvements in:

1. **Access Control** - CORS and rate limiting
2. **Injection Prevention** - XSS and ReDoS protection
3. **Cryptographic Practices** - Key management

**Recommendation:** Address critical and high-severity issues immediately before public release. The current security level is acceptable for a friends-only beta but insufficient for public production use.

---

*This report should be treated as confidential and shared only with authorized personnel.*