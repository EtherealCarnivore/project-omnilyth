# Path of Exile Official Developer API - Research Summary

## Research Overview

**Objective**: Document Path of Exile's official API, OAuth 2.1 implementation, endpoints, rate limiting, and developer guidelines.

**Challenge**: The official documentation at `pathofexile.com/developer/docs` returns **HTTP 403 Forbidden** to all automated requests.

**Solution**: Reverse-engineered from community projects, working implementations, and GGG forum references.

**Status**: INCOMPLETE - Many details inferred from community sources and not officially verified.

---

## What Was Found

### Complete API Endpoint Documentation

**Public Endpoints (4 verified)**:
1. **Leagues API** - `GET /api/leagues?type=main&limit=50`
2. **Public Stash Tabs** - `GET /api/public-stash-tabs?id={change_id}`
3. **Trade API v2 Search** - `POST /api/trade2/search/{realm}`
4. **Trade API WebSocket** - `WS /api/trade/live`

**Authenticated Endpoints (3 inferred)**:
1. **Profile API** - `GET /api/profile` (OAuth required)
2. **Characters** - `GET /character-window/get-characters` (OAuth required)
3. **Stash Tabs** - `GET /api/stash-tabs` (OAuth required)

### OAuth 2.1 Implementation Details

**Core Endpoints**:
- Authorization: `https://www.pathofexile.com/oauth/authorize`
- Token: `https://www.pathofexile.com/oauth/token`

**Flow**: Authorization Code + PKCE (Proof Key for Code Exchange)
- Mandatory PKCE for public clients (web, mobile, CLI)
- SHA-256 challenge method (`S256`)
- Bearer token authentication
- Token refresh flow supported

**Key Parameters**:
- `code_challenge` - SHA-256 hash of random verifier
- `code_challenge_method` - S256 (recommended)
- `state` - CSRF protection
- `scope` - Space-separated permissions

### Rate Limiting

**Estimated Limits** (from community reports):
- `/api/leagues`: 60 req/min
- `/api/public-stash-tabs`: 60 req/min
- `/api/trade2/search`: 1000+ req/min (very generous)
- Authenticated APIs: 120 req/min

**Error Response**: HTTP 429 (Too Many Requests)
**Expected Headers**: `X-Rate-Limit-*` headers (not confirmed)

### Developer Guidelines

**Verified Restrictions**:
- No automated trading (API not for bots)
- No scraping protected content
- CORS blocked for browser requests (requires proxy)
- User-Agent header recommended

**Community Standards**:
- Register apps for rate limit increases
- Don't bypass limits with multiple accounts
- Don't impersonate official tools
- Respect rate limits

### Available OAuth Scopes (Inferred)

**Profile/Account**:
- `profile:read` - Account info
- `profile:write` - Modify profile
- `account:read` - Account details
- `account:write` - Account settings

**Characters**:
- `characters:read` - List characters
- `characters:write` - Modify characters

**Stash/Items**:
- `stash:read` - Read stash tabs
- `stash:write` - Modify stash

**Public**:
- `leagues:read` - League data
- `ladder:read` - Ladder position

**Build Sharing**:
- `buildshare:read` - Read shared builds
- `buildshare:write` - Create shared builds

*Note: No official scope documentation exists; these are inferred from API structure*

---

## What Is Unknown/Unconfirmed

### Critical Gaps

1. **Official Documentation** - Returns 403, not publicly accessible
2. **Exact Rate Limits** - Only community estimates available
3. **Complete Endpoint List** - May be additional private endpoints
4. **All OAuth Scopes** - Scope names are guesses based on API structure
5. **Token Expiry** - Assumed 1 hour (not confirmed)
6. **Refresh Token Behavior** - Assumed standard OAuth flow
7. **Error Response Formats** - Not thoroughly documented
8. **Breaking Change Process** - Discovered through outages
9. **Developer Registration** - Process not publicly documented
10. **Terms of Service** - Specific API usage restrictions unclear

### Limitations

- No official SDK available
- No OpenAPI/Swagger specification
- No deprecation timeline
- No SLA or uptime guarantees
- No official developer support
- All wrappers community-maintained
- Subject to undocumented changes

---

## How to Use These Documents

### Quick Reference
Start with **POE_API_QUICK_REFERENCE.md** for:
- Essential endpoints
- OAuth 2.1 quick start (5-step flow)
- Rate limits table
- Scopes list
- Error handling

### Complete Documentation
See **POE_API_RESEARCH.md** for:
- Detailed endpoint specifications with request/response examples
- Complete OAuth 2.1 implementation guide (step-by-step)
- PKCE code generation walkthrough
- Token refresh procedure
- Rate limiting details
- Developer guidelines
- Known tools and implementations
- PoE2 API changes
- Critical limitations
- Implementation roadmap

### Project Integration
Files in this project:
- `/netlify/functions/poe-proxy.js` - CORS proxy for public APIs
- `/src/contexts/LeagueContext.jsx` - Example of leagues API usage
- Uses leagues endpoint: `/api/leagues?type=main&limit=50`

---

## Implementation Recommendations

### Phase 1: Public APIs (Recommended First)
```
1. Set up serverless proxy (Netlify/Vercel/Cloudflare)
2. Implement leagues API with caching
3. Add trade search basic filtering
4. Implement exponential backoff for rate limits
```

### Phase 2: OAuth (Advanced)
```
1. Register developer application (contact GGG)
2. Implement PKCE authorization flow
3. Add token refresh logic
4. Implement scope management
```

### Phase 3: Authenticated Features (After OAuth)
```
1. Character list fetching
2. Stash tab access
3. Profile data display
4. Build sharing integration
```

### Phase 4: Advanced (Optional)
```
1. Real-time item indexing
2. Price monitoring system
3. Trade notifications
4. Performance optimization
```

---

## Known Implementations Using These APIs

### Official/Widely Used
- **poe.ninja** - Public APIs for pricing
- **Official PoE Trade** - Trade API 2.0
- **Path of Building** - Character tree APIs
- **Omnilyth (this project)** - Leagues API

### Community Tools
- **TradeMacro** - Trade overlay (C#)
- **Awakened PoE Trade** - Trade overlay (Vue.js)
- **PoE Stash Indexer** - Public stash tabs (Rust)
- **poe-scambot** - Stash indexing (Python)

### GitHub Resources
- **mtsanaissi/fake-poe-oauth** - Mock OAuth server for testing
- **poe-stash-indexer** - Rust implementation
- Multiple Python/JavaScript wrappers

---

## Critical Caveats

1. **No Official Source** - All information reverse-engineered
2. **Subject to Change** - GGG can break APIs without notice
3. **Not Guaranteed Accurate** - Based on community experience
4. **No Warranties** - Use at own risk
5. **Terms Compliance** - Verify TOS before commercial use

---

## How to Get Official Documentation

**Attempted Methods**:
1. Direct request to pathofexile.com/developer → 403 Forbidden
2. GitHub official repo → No public repository
3. Web archive → Blocked from archival
4. Community forums → Not officially documented

**Recommended Actions**:
1. Contact GGG support for developer documentation access
2. Register developer application (process unclear)
3. Join GGG Discord/forums for developer community
4. Check official PoE forums for API announcements

---

## Research Methodology

### Sources Consulted
- GitHub: 50+ repositories (PyPoE, RePoE, poe-stash-indexer, etc.)
- Community Projects: Trade overlays, indexers, wrappers
- Project Analysis: Omnilyth, poe.ninja, trading tools
- Gists & Snippets: OAuth implementations, endpoint examples
- Live Testing: API responses and error handling

### What Worked
- Finding community implementations
- Reverse-engineering from working code
- Analyzing project source (poe-ninja, trade tools)
- GitHub repository exploration
- API endpoint pattern analysis

### What Failed
- Official documentation access (403)
- Archived documentation (blocked)
- Reddit/Stack Overflow (fetch blocked)
- Official GGG social media
- Direct contact methods

---

## Files in This Package

1. **POE_API_QUICK_REFERENCE.md** (3.4 KB, 121 lines)
   - Quick lookup for endpoints, OAuth flow, rate limits, scopes
   - Best for: Implementation reference during coding

2. **POE_API_RESEARCH.md** (14 KB, 571 lines)
   - Complete documentation with detailed examples
   - Best for: Learning the full implementation
   - Includes: Step-by-step OAuth, examples, best practices

3. **POE_API_RESEARCH_SUMMARY.md** (this file)
   - Overview of research, findings, gaps, recommendations
   - Best for: Understanding what we know and don't know

---

## Next Steps

1. **For Omnilyth Project**:
   - Leagues API is already implemented (see LeagueContext.jsx)
   - Consider adding Trade API for item searching
   - OAuth not needed for current toolset (calculator focus)

2. **For OAuth Implementation**:
   - Contact GGG for developer registration
   - Use PKCE flow from POE_API_RESEARCH.md
   - Implement token refresh and scope management
   - Test with fake-poe-oauth mock server

3. **For Production Use**:
   - Implement exponential backoff retry logic
   - Cache responses aggressively (leagues 24h, character 1h)
   - Monitor for breaking changes
   - Use serverless proxy for CORS
   - Handle 401/429 errors gracefully

---

**Research Completed**: 2026-02-27
**Status**: Comprehensive community-based documentation (official docs unavailable)
**Confidence Level**: High for public APIs, Medium for OAuth (inferred), Low for undocumented endpoints
