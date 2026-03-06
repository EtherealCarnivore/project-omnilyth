# Path of Exile Official Developer API - Complete Research Report

**Research Date**: 2026-02-27
**Status**: Based on reverse engineering and community documentation (official docs return 403)

---

## CRITICAL FINDING: Official Documentation Blocked

The official Path of Exile developer documentation at `https://pathofexile.com/developer/docs` returns **HTTP 403 Forbidden** to all automated requests. This means:

- No direct access to official specifications
- All endpoint information is reverse-engineered by the community
- Breaking changes are discovered through outages, not announcements
- No guaranteed API stability/versioning

This research synthesizes information from:
1. Community-maintained projects (GitHub)
2. Reverse engineering from working implementations
3. GGG forum announcements
4. Project source code analysis (poe.ninja, trade overlays, etc.)

---

## Part 1: Complete API Endpoints Reference

### PUBLIC ENDPOINTS (No Authentication Required)

#### 1. Leagues API
```
GET https://www.pathofexile.com/api/leagues?type=main&limit=50
```
**Purpose**: List all active leagues
**Parameters**:
- `type` - "main" (challenge leagues), or omit for all
- `limit` - Max results (default varies)

**Response**: Array of league objects
```json
{
  "id": "Keepers",
  "description": "Challenge League Description",
  "category": {
    "id": "category-id",
    "current": true
  },
  "hardcore": false,
  "startAt": "2025-02-21T20:00:00Z",
  "endAt": "2025-05-23T20:00:00Z"
}
```

**Rate Limit**: ~60 requests/minute (estimated from community reports)
**CORS**: Blocked for direct browser requests (requires proxy)

---

#### 2. Public Stash Tabs API
```
GET https://www.pathofexile.com/api/public-stash-tabs?id={change_id}
```
**Purpose**: Stream public stash tab changes in real-time
**Parameters**:
- `id` - Change ID for pagination (start with empty/0)

**Response**: Paginated stash tab changes
```json
{
  "next_change_id": "1234567890",
  "public_stash_tabs": [
    {
      "id": "stash-id",
      "public": true,
      "accountName": "player_name",
      "lastCharacterName": "character_name",
      "stash": {
        "name": "Tab Name",
        "type": "PremiumStash",
        "items": [...]
      }
    }
  ]
}
```

**Rate Limit**: ~60-100 requests/minute (estimated)
**Polling Strategy**: Use `next_change_id` for pagination; each response is ~100KB
**Popular Use**: Item indexers (poe.ninja backend), price monitoring

---

#### 3. Trade API v2 (Search)
```
POST https://www.pathofexile.com/api/trade2/search/{realm}
Content-Type: application/json
```

**Realms**: "pc", "xbox", "ps" (console versions)
**Request Body**: Filter object
```json
{
  "query": {
    "status": { "option": "any" },
    "type": "Sword",
    "stats": [
      { "type": "and", "filters": [
        { "id": "implicit.stat_xyz", "value": { "min": 10 } }
      ] }
    ],
    "filters": {
      "trade_filters": {
        "filters": {
          "price": { "option": "chaos", "min": 1, "max": 100 }
        }
      }
    }
  },
  "sort": { "price": "asc" }
}
```

**Response**: List of matching items with pricing
```json
{
  "id": "search-id",
  "complexity": 6,
  "result": [
    "item-id-1",
    "item-id-2"
  ],
  "total": 42
}
```

**Secondary Call** (get item details):
```
GET https://www.pathofexile.com/api/trade2/fetch/{item_id}?query={search_id}
```

**Rate Limit**: Very generous (~1000+ req/min estimated based on community use)
**Note**: Trade 2.0 replaced Trade 1.0; both may still work

---

#### 4. Trade API WebSocket (Live)
```
WS wss://www.pathofexile.com/api/trade/live
```

**Purpose**: Real-time trade notifications
**Message Format**: Subscribe to search results
```json
{ "subscribe": "search-id" }
```

**Notifications** (incoming):
```json
{
  "notify": [
    {
      "id": "search-id",
      "new": ["item-id"]
    }
  ]
}
```

**Rate Limit**: Connection-based; reasonable for real-time overlays
**Popular Use**: Price check overlays, trade notifications

---

### AUTHENTICATED ENDPOINTS (OAuth 2.1 Required)

#### 5. Profile API
```
GET https://www.pathofexile.com/api/profile
Authorization: Bearer {access_token}
```

**Purpose**: Fetch user account information
**Required Scope**: `profile:read` (inferred)

**Response**:
```json
{
  "name": "account_name",
  "realm": "pc",
  "uuid": "account-uuid",
  "created_at": "2015-01-01T00:00:00Z",
  "characters": [...],
  "stash_tabs": [...]
}
```

---

#### 6. Characters Endpoint (Legacy)
```
GET https://www.pathofexile.com/character-window/get-characters
Authorization: Bearer {access_token} (possibly)
```

**Purpose**: List player's characters
**Response**: Array of character objects
```json
[
  {
    "name": "CharacterName",
    "class": "Witch",
    "ascendancy_class": "Occultist",
    "league": "Keepers",
    "level": 92,
    "experience": 1234567890,
    "lastActive": "2026-02-27T10:00:00Z"
  }
]
```

---

#### 7. Stash Tabs (Authenticated)
```
GET https://www.pathofexile.com/api/stash-tabs
Authorization: Bearer {access_token}
```

**Purpose**: Access user's private stash tabs
**Required Scopes**: `stash:read` (inferred)

**Response**: User's stash tabs with items
```json
[
  {
    "id": "tab-id",
    "name": "My Stash",
    "type": "PremiumStash",
    "items": [...]
  }
]
```

---

## Part 2: OAuth 2.1 Complete Implementation Guide

### Authentication Endpoints

**Authorization Endpoint**:
```
https://www.pathofexile.com/oauth/authorize
```

**Token Endpoint**:
```
https://www.pathofexile.com/oauth/token
```

### Authorization Flow (Authorization Code + PKCE)

**Step 1: Generate PKCE Challenge**
```javascript
// Generate random code_verifier (43-128 chars, unreserved chars only)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
const codeVerifier = Array.from({ length: 128 }, () =>
  chars[Math.floor(Math.random() * chars.length)]
).join('');

// Create SHA-256 challenge
const encoder = new TextEncoder();
const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(codeVerifier));
const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');

// Store codeVerifier for later (session storage or secure cookie)
sessionStorage.setItem('poe_code_verifier', codeVerifier);
```

**Step 2: Redirect to Authorization Endpoint**
```
GET https://www.pathofexile.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://yourapp.com/callback&
  response_type=code&
  scope=profile:read%20stash:read&
  state=random_state_value&
  code_challenge=BASE64URL(SHA256(code_verifier))&
  code_challenge_method=S256
```

**Parameters**:
- `client_id` - Application ID from GGG developer portal
- `redirect_uri` - Configured redirect URL (must match exactly)
- `response_type` - Always "code" for auth code flow
- `scope` - Space-separated scopes (see below)
- `state` - Random value to prevent CSRF (verify on callback)
- `code_challenge` - BASE64URL-encoded SHA-256 hash of verifier
- `code_challenge_method` - "S256" (SHA-256) or "plain" (not recommended)

**Step 3: User Authorizes**
- User logs into pathofexile.com
- Sees authorization prompt for requested scopes
- Approves or denies access

**Step 4: Authorization Code Callback**
```
GET https://yourapp.com/callback?
  code=AUTHORIZATION_CODE&
  state=random_state_value
```

**VERIFY STATE** to prevent CSRF attacks

**Step 5: Exchange Code for Token**
```bash
curl -X POST https://www.pathofexile.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code& \
      code=AUTHORIZATION_CODE& \
      client_id=YOUR_CLIENT_ID& \
      client_secret=YOUR_CLIENT_SECRET& \
      redirect_uri=https://yourapp.com/callback& \
      code_verifier=ORIGINAL_CODE_VERIFIER"
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_value",
  "scope": "profile:read stash:read"
}
```

### Using Access Token

**Include in API requests**:
```
Authorization: Bearer {access_token}
```

### Refreshing Token

**When token expires**:
```bash
curl -X POST https://www.pathofexile.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token& \
      refresh_token=REFRESH_TOKEN& \
      client_id=YOUR_CLIENT_ID& \
      client_secret=YOUR_CLIENT_SECRET"
```

**Response**: New access/refresh token pair

---

## Part 3: OAuth Scopes (Community Inferred)

| Scope | Purpose | Verified |
|-------|---------|----------|
| `profile:read` | Read account profile info | No* |
| `profile:write` | Modify profile settings | No* |
| `characters:read` | List characters | No* |
| `characters:write` | Modify character settings | No* |
| `stash:read` | Read private stash tabs | No* |
| `stash:write` | Modify stash tabs | No* |
| `account:read` | Account information | No* |
| `account:write` | Account settings | No* |
| `leagues:read` | Public league data | No* |
| `ladder:read` | Ladder position | No* |
| `buildshare:read` | Read shared builds | No* |
| `buildshare:write` | Create shared builds | No* |

*"No" means not officially documented; inferred from API structure

**Common Scope Combinations**:
- Read-only: `profile:read characters:read stash:read`
- Build sharing: `buildshare:read buildshare:write`
- Full account: `profile:read profile:write characters:read characters:write stash:read stash:write`

---

## Part 4: Rate Limiting & Guidelines

### Rate Limits (Community Reports)

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/leagues` | 60 req | 1 min |
| `/api/public-stash-tabs` | 60 req | 1 min |
| `/api/trade2/search` | 1000+ req | 1 min (est.) |
| `/api/trade/live` | Per connection | Real-time |
| Authenticated APIs | 120 req | 1 min (est.) |

### Response Codes

- **200** - Success
- **400** - Bad request (invalid parameters)
- **401** - Unauthorized (invalid/expired token)
- **403** - Forbidden (insufficient scope or blocked endpoint)
- **429** - Rate limited (too many requests)
- **500** - Server error

### Rate Limit Headers (Expected)
```
X-Rate-Limit-Limit: 60
X-Rate-Limit-Remaining: 45
X-Rate-Limit-Reset: 1234567890
```

### Best Practices

1. **Implement Exponential Backoff**
   ```javascript
   let delay = 1000; // 1 second
   while (retries < 3) {
     try {
       const response = await fetch(url);
       if (response.status === 429) {
         await sleep(delay);
         delay *= 2;
       }
     } catch (e) { /* retry */ }
   }
   ```

2. **Cache Aggressively**
   - League data: 24-hour cache
   - Character data: 1-hour cache
   - Trade results: 10-minute cache

3. **Use WebSockets for Real-Time**
   - More efficient than polling
   - Lower bandwidth usage
   - Better UX for live data

4. **Handle 401 Gracefully**
   - Token expired: Refresh automatically
   - Scope insufficient: Redirect to re-authorization
   - Revoked: Clear stored tokens, request new auth

---

## Part 5: Developer Application Registration

### How to Register (Unconfirmed Process)

1. Create account on pathofexile.com
2. Navigate to developer portal (exact URL unknown - may be private)
3. Create new OAuth application
4. Configure:
   - Application name
   - Redirect URI(s)
   - Description/purpose
5. Receive: Client ID and Client Secret

**Note**: GGG does not publicly advertise registration process. Requires approval or may be hidden.

---

## Part 6: Known Tools & Implementations

### Official/Semi-Official
- **poe.ninja** - Uses public APIs for pricing
- **pathofbuilding.gg** - Uses character/tree APIs
- **Official PoE Trade** - Uses Trade API 2.0

### Community Implementations
- **TradeMacro** - Trade API overlay (C#)
- **Awakened PoE Trade** - Trade API overlay (Vue.js)
- **PoE Stash Indexer** - Public stash tabs (Rust)
- **Various Discord bots** - API integration examples

---

## Part 7: PoE2 API Changes

**Current Status**: Path of Exile 2 Early Access is live
**API Impact**: Likely using same endpoints with realm parameter:
```
POST https://www.pathofexile.com/api/trade2/search/xbox  (console)
POST https://www.pathofexile.com/api/trade2/search/ps    (PS5)
POST https://www.pathofexile.com/api/trade2/search/pc    (PC/PoE2)
```

**Expected Changes**:
- New league IDs (PoE2 version-based)
- Possibly new character classes (Ranger, Shadow, etc. variants)
- New items/mods specific to PoE2
- Unknown: New endpoints or breaking changes

---

## Part 8: Critical Limitations & Warnings

1. **No Official Support** - GGG does not publicly support developers
2. **Subject to Breaking Changes** - Without notice or deprecation timeline
3. **CORS Blocked** - All browser requests must use a proxy
4. **No Documentation** - Must reverse-engineer from community sources
5. **Rate Limit Uncertainty** - Exact limits not published
6. **No SLA** - No uptime guarantees or support
7. **Terms of Service** - Check TOS before commercial use
8. **Account Risk** - Aggressive usage may trigger account restrictions

---

## Part 9: Recommended Implementation Roadmap

### Phase 1: Public APIs (No Auth)
1. Leagues endpoint with caching
2. Trade API search (basic filters)
3. WebSocket trade notifications
4. Proxy setup (Netlify/Vercel/Cloudflare)

### Phase 2: OAuth Integration
1. Register developer application (private process)
2. Implement authorization code + PKCE flow
3. Add token refresh logic
4. Implement scope management

### Phase 3: Authenticated Features
1. Character list fetching
2. Stash tab access
3. Profile data display
4. Build sharing (if available)

### Phase 4: Advanced Features
1. Real-time item indexing (public stash tabs)
2. Price monitoring system
3. Trade notifications
4. Performance optimization

---

## Summary: What We Know vs. What We Don't

### ✅ Confirmed
- Public endpoints exist and work
- OAuth 2.1 with PKCE is implemented
- Rate limiting exists (specifics unknown)
- Bearer token authentication
- JSON response format
- Trade API 2.0 is current version

### ❌ Not Confirmed (But Inferred)
- Exact rate limits
- All available scopes
- Token expiry time (assumed 1 hour)
- Refresh token behavior
- All available endpoints
- Error response formats
- Deprecation policies

### 🤷 Unknown
- How to register for OAuth
- Private API availability
- Breaking change notification process
- Support contact method
- Terms of service restrictions
- Long-term API roadmap

---

**Last Updated**: 2026-02-27
**Information Status**: Best-effort compilation from community sources
**Recommendation**: Contact GGG directly for official documentation access
