# Path of Exile Official API - Quick Reference

## Essential Endpoints

### Public (No Auth)
```
GET  https://www.pathofexile.com/api/leagues?type=main&limit=50
POST https://www.pathofexile.com/api/trade2/search/{realm}
GET  https://www.pathofexile.com/api/public-stash-tabs?id={change_id}
WS   wss://www.pathofexile.com/api/trade/live
```

### Authenticated (OAuth Bearer Token)
```
GET  https://www.pathofexile.com/api/profile
GET  https://www.pathofexile.com/character-window/get-characters
GET  https://www.pathofexile.com/api/stash-tabs
```

## OAuth 2.1 Quick Start

### 1. Generate PKCE
```javascript
// Create code_verifier (128 chars)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
const codeVerifier = Array.from({length: 128}, () => 
  chars[Math.floor(Math.random() * chars.length)]
).join('');

// SHA-256 hash to code_challenge
const buffer = await crypto.subtle.digest('SHA-256', 
  new TextEncoder().encode(codeVerifier));
const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

sessionStorage.setItem('poe_code_verifier', codeVerifier);
```

### 2. Redirect to OAuth
```
https://www.pathofexile.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://yourapp.com/callback&
  response_type=code&
  scope=profile:read%20stash:read&
  state=RANDOM_STATE&
  code_challenge=CODE_CHALLENGE&
  code_challenge_method=S256
```

### 3. Exchange Code for Token
```bash
curl -X POST https://www.pathofexile.com/oauth/token \
  -d "grant_type=authorization_code&code=CODE&client_id=ID&client_secret=SECRET&redirect_uri=URI&code_verifier=VERIFIER"
```

### 4. Use Bearer Token
```javascript
const response = await fetch('https://www.pathofexile.com/api/profile', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

### 5. Refresh Token
```bash
curl -X POST https://www.pathofexile.com/oauth/token \
  -d "grant_type=refresh_token&refresh_token=TOKEN&client_id=ID&client_secret=SECRET"
```

## Rate Limits (Estimated)

| Endpoint | Limit |
|----------|-------|
| `/api/leagues` | 60 req/min |
| `/api/public-stash-tabs` | 60 req/min |
| `/api/trade2/search` | 1000+ req/min |
| Authenticated APIs | 120 req/min |

## Scopes (Inferred)

- `profile:read` - Account info
- `characters:read` - Character list
- `stash:read` - Private stash
- `stash:write` - Modify stash
- `account:read` - Account details
- `account:write` - Account settings
- `buildshare:read` - Read builds
- `buildshare:write` - Create builds

## Response Format

```json
{
  "access_token": "token_string",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_string",
  "scope": "profile:read stash:read"
}
```

## Error Handling

| Code | Meaning |
|------|---------|
| 401 | Token expired/invalid - refresh or re-authorize |
| 429 | Rate limited - wait and retry |
| 403 | Insufficient scope - request new authorization |

## Implementation Notes

- **CORS**: Browser requests blocked, use proxy (Netlify/Vercel/Cloudflare)
- **Caching**: League data (24h), Character data (1h), Trade results (10m)
- **No Official Docs**: All info reverse-engineered from community
- **Breaking Changes**: No warning, discovered through outages

## Key Files for Reference

- Complete docs: `/POE_API_RESEARCH.md`
- Project proxy: `/netlify/functions/poe-proxy.js`
- League context: `/src/contexts/LeagueContext.jsx`
