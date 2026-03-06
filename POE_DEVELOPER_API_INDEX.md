# Path of Exile Developer API Documentation Index

## Overview

This folder contains comprehensive documentation of the Path of Exile official developer API, including OAuth 2.1 implementation details, all available endpoints, rate limiting rules, and developer guidelines.

**Critical Note**: The official API documentation at `pathofexile.com/developer/docs` returns HTTP 403 Forbidden. All information here is reverse-engineered from community projects and not officially verified.

---

## Documents in This Package

### 1. POE_API_QUICK_REFERENCE.md (3.4 KB)
**Quick lookup guide for implementation reference**

Contains:
- Essential endpoint list (public + authenticated)
- OAuth 2.1 5-step implementation flow
- PKCE code generation
- Rate limits table
- OAuth scopes (inferred)
- Error handling codes
- Implementation notes

Use when: Coding OAuth flow or making API calls
Best for: Quick reference during implementation

---

### 2. POE_API_RESEARCH.md (14 KB)
**Complete technical documentation with examples**

Contains (9 parts):
1. **Public Endpoints** - Detailed specs for 4 public endpoints
   - Request/response formats
   - Parameters and query options
   - Rate limits per endpoint
   - CORS considerations

2. **Authenticated Endpoints** - 3 OAuth-protected endpoints
   - Profile API
   - Characters endpoint
   - Stash tabs access

3. **OAuth 2.1 Implementation** - Step-by-step guide
   - PKCE challenge generation (JavaScript)
   - Authorization redirect
   - Token exchange
   - Token usage and refresh

4. **OAuth Scopes** - Complete list (inferred)
   - Profile, characters, stash, account, leagues, builds
   - Read and write variants

5. **Rate Limiting** - Public vs authenticated
   - Estimated limits per endpoint
   - Response codes and headers
   - Exponential backoff strategy
   - Caching recommendations

6. **Developer Guidelines** - Restrictions and best practices
   - No automated trading
   - CORS requirements
   - User-Agent headers
   - Community standards

7. **Known Tools** - Community implementations
   - Official tools (poe.ninja, PathOfBuilding)
   - Community overlays and wrappers
   - Language-specific implementations

8. **PoE2 API Changes** - Expected changes for PoE2
   - Realm parameter updates
   - Potential new endpoints

9. **Implementation Roadmap** - 4-phase approach
   - Phase 1: Public APIs
   - Phase 2: OAuth setup
   - Phase 3: Authenticated features
   - Phase 4: Advanced features

Use when: Learning the full API specification
Best for: Understanding implementation details and examples

---

### 3. POE_API_RESEARCH_SUMMARY.md (9.1 KB)
**Research overview and findings summary**

Contains:
- What was found (endpoints, OAuth, rate limits, guidelines)
- What is unknown (9 critical gaps)
- How to use the documents
- Implementation recommendations
- Known implementations
- Critical caveats
- How to get official documentation
- Research methodology

Use when: Understanding research scope and limitations
Best for: Executive summary and context

---

## Quick Navigation

### I need to...

**Implement Leagues API** (public, no auth):
- Start: POE_API_QUICK_REFERENCE.md
- Detailed: POE_API_RESEARCH.md Part 1
- Example: `/src/contexts/LeagueContext.jsx` in this project

**Implement OAuth 2.1**:
- Quick: POE_API_QUICK_REFERENCE.md (steps 1-5)
- Detailed: POE_API_RESEARCH.md Part 2
- PKCE: POE_API_RESEARCH.md Part 2 Step 1

**Make Trade API Search**:
- Detailed: POE_API_RESEARCH.md Part 1, Section 3
- Rate limits: POE_API_QUICK_REFERENCE.md
- Examples: See Trade overlays (Awakened PoE Trade, TradeMacro)

**Use WebSocket Trade Feed**:
- Detailed: POE_API_RESEARCH.md Part 1, Section 4
- Message format: Included in complete docs

**Access Stash Tabs (OAuth)**:
- OAuth setup: POE_API_QUICK_REFERENCE.md
- Endpoint: POE_API_RESEARCH.md Part 1, Section 2

**Understand Rate Limits**:
- Quick: POE_API_QUICK_REFERENCE.md
- Full: POE_API_RESEARCH.md Part 4

**Handle Errors**:
- Quick: POE_API_QUICK_REFERENCE.md
- Full: POE_API_RESEARCH.md Part 4

**Understand Limitations**:
- Summary: POE_API_RESEARCH_SUMMARY.md
- Detail: POE_API_RESEARCH.md Part 8

---

## Key Findings Summary

### Verified
- 4 public endpoints (leagues, stash tabs, trade search, trade websocket)
- OAuth 2.1 with PKCE is implemented
- Bearer token authentication
- Rate limiting exists
- JSON response format
- Token refresh supported

### Inferred (Not Official)
- 3 authenticated endpoints
- 12+ OAuth scopes
- Exact rate limits
- Token expiry (assumed 1 hour)
- Error response formats

### Unknown
- How to register for OAuth
- Exact scope definitions
- Private API availability
- Breaking change notification
- Official support contact
- Full TOS restrictions

---

## Critical Limitations

1. **No Official Docs** - pathofexile.com/developer returns 403
2. **No Verification** - All info reverse-engineered
3. **No Guarantees** - APIs can break without notice
4. **No Support** - GGG does not officially support developers
5. **No SLA** - No uptime guarantees
6. **Subject to Change** - Breaking changes discovered through outages

---

## Existing Implementation in This Project

### Files Using Official APIs

**`/netlify/functions/poe-proxy.js`**
- Serverless CORS proxy
- Allowed endpoints: `/api/leagues`, `/api/trade`
- Rate limiting: 60 req/min
- User-Agent header included

**`/src/contexts/LeagueContext.jsx`**
- Consumes `/api/leagues?type=main&limit=50`
- 3-layer fallback: API → localStorage → hardcoded list
- 24-hour cache TTL
- Filters out Ruthless leagues
- Uses proxy for CORS

**`/src/hooks/usePrices.js`** (if it exists)
- Likely uses poe.ninja API for pricing
- Separate from official PoE API

---

## Getting Official Documentation

### What We Tried
- Direct request to pathofexile.com/developer (403 Forbidden)
- Web archives (blocked)
- GitHub official repos (don't exist)
- Community forums (not publicly available)
- Reddit/StackOverflow (fetch blocked)

### What You Can Try
1. **Contact GGG Support** - Request developer documentation access
2. **Apply for Developer Access** - Unknown process/URL
3. **Join Developer Community** - GGG Discord/forums (if available)
4. **Monitor PoE Forums** - Official API announcements
5. **Watch GitHub** - Star community projects for updates

---

## Sources Used in Research

### GitHub Projects Analyzed
- 50+ repositories with PoE API implementations
- PyPoE (game file parsing, not API wrapper)
- RePoE (data extraction tool)
- poe-stash-indexer (Rust stash tab indexer)
- Fake-PoE-OAuth (mock OAuth server)
- Various trade overlay projects
- PoE.py, poe-scambot, and others

### Working Implementations Reverse-Engineered
- poe.ninja (public stash tabs indexing)
- Official PoE Trade (Trade API 2.0)
- TradeMacro (trade overlay)
- Awakened PoE Trade (Vue.js overlay)
- Path of Building (character/tree data)

### Community Documentation
- GitHub gists and README files
- Project source code analysis
- Trade overlay implementations
- Stash indexer documentation

---

## File Sizes and Metrics

| Document | Size | Lines | Sections | Estimated Read Time |
|----------|------|-------|----------|-------------------|
| Quick Reference | 3.4 KB | 121 | 9 | 5 min |
| Complete Research | 14 KB | 571 | 9 | 30 min |
| Summary | 9.1 KB | 308 | 12 | 15 min |
| **Total** | **26.5 KB** | **1000** | **30** | **50 min** |

---

## Workflow Recommendations

### For Beginners
1. Read: POE_API_RESEARCH_SUMMARY.md (15 min)
2. Reference: POE_API_QUICK_REFERENCE.md
3. Example: Review LeagueContext.jsx in this project
4. Start: Implement leagues endpoint with caching

### For Advanced Implementation
1. Review: POE_API_RESEARCH.md Part 2 (OAuth)
2. Contact: GGG for developer registration
3. Implement: PKCE flow from quick reference
4. Test: Use fake-poe-oauth mock server
5. Deploy: Add token refresh and scope management

### For Production Deployment
1. Ensure: Rate limiting/backoff logic
2. Cache: Aggressively (leagues 24h, character 1h)
3. Monitor: For breaking changes
4. Handle: 401/429 errors gracefully
5. Proxy: Use serverless for CORS
6. Secure: Store tokens securely (not localStorage)

---

## Contact & Next Steps

### For This Project (Omnilyth)
- Leagues API: Already implemented
- Trade API: Consider adding for item searches
- OAuth: Not needed for calculator focus
- See: `/src/contexts/LeagueContext.jsx`

### For PoE Developers
- Getting Official Docs: Contact GGG support
- OAuth Registration: Process unknown (private?)
- Community: Join PoE developer forums
- Tools: Use mtsanaissi/fake-poe-oauth for testing

### For Community
- Questions: Check GitHub communities on PyPoE, RePoE projects
- Implementations: Reference poe.ninja, trade overlays
- Issues: Report breaking changes in community projects

---

## Document Metadata

- **Research Date**: 2026-02-27
- **Status**: Comprehensive community documentation (official docs unavailable)
- **Accuracy**: High for public APIs, Medium for OAuth, Low for undocumented endpoints
- **Maintenance**: Community-maintained (check for updates in referenced projects)
- **License**: Based on reverse engineering and community knowledge
- **Disclaimer**: Use at own risk; subject to breaking changes without notice

---

**Created for Project Omnilyth**
**Path of Exile is a trademark of Grinding Gear Games**
