# Project Omnilyth

A Path of Exile toolkit — crafting calculators, regex generators, and atlas tools.

**Live**: [etherealcarnivore.github.io/omnilyth-core-public](https://etherealcarnivore.github.io/omnilyth-core-public/)

## Stack

- **Frontend**: React 19 + Vite 7 + Tailwind CSS 4
- **Routing**: React Router v7 (lazy-loaded modules)
- **State**: Context API (league, prices, pinning, design variants, leveling progress)
- **Search**: Fuse.js (fuzzy search for gems)
- **Data**: poe.ninja API (prices), PoE Wiki (gem availability)
- **Deployment**: GitHub Actions CI/CD → Netlify/Vercel/GitHub Pages
- **API Proxy**: Serverless functions (Netlify/Vercel/Cloudflare)

## Modules

### Crafting — Coloring
| Module | Description |
|--------|-------------|
| Chromatic Calculator | Vorici bench crafts vs raw Chromatic Orbs |
| Tainted Chromatic | Tainted Chromatic Orb coloring for corrupted items |
| Omen of Blanching | White socket crafting with Omen of Blanching |
| Jeweller's Method | Add/remove sockets to lock in desired colors |

### Crafting — Linking & Socketing
| Module | Description |
|--------|-------------|
| Fusing Calculator | Orbs of Fusing needed to link items (manual, bench, omen, tainted strategies) |
| Socket Calculator | Jeweller's Orbs needed for target socket count |

### Crafting — Items
| Module | Description |
|--------|-------------|
| Item Mod Regex | Generate regex patterns to find items with specific mods |

### Build Planning
| Module | Description |
|--------|-------------|
| Cluster Jewel Calc | Find compatible notables for Large Cluster Jewels |
| Timeless Jewel Calc | Interactive skill tree for timeless jewel seed searching |

### Atlas / Mapping
| Module | Description |
|--------|-------------|
| Map Mod Regex | Generate regex patterns to filter map mods |
| Scarab Regex | Auto-select scarabs by price range, generates stash search regex (multi-output for 250-char limit) |

### Leveling
| Module | Description |
|--------|-------------|
| **Gem Browser** | Browse all 335 gems with advanced filtering by class, act, and availability source |
| **Gem Progression** | Track gem unlocks act-by-act with quest rewards, Siosa (Act 3), and Lilly Roth (Act 6) |
| **Quick Search** | Fuzzy search with keyboard shortcuts (Ctrl+G) and mobile FAB |
| Vendor Leveling Regex | Find vendor items with movement speed, sockets, links, and leveling stats |
| Gem Regex | Generate search patterns for specific gems in your stash |

## Features

- **Gem Progression System** — complete gem unlock tracking with 335 gems, class filtering, act-by-act unlocks, special vendor info (Siosa/Lilly Roth), fuzzy search, keyboard shortcuts (Ctrl+G), mobile FAB, grid/list views, advanced filtering
- **User Feedback** — submit bugs, UI issues, suggestions, and feature requests directly from the app (creates GitHub issues automatically, no account required)
- **Design variant system** — toggleable v1/v2 layouts for A/B testing UX approaches, persisted in localStorage
- **Category overview pages** — hub pages for Crafting, Atlas, Build Planning, and Leveling (v2 layout)
- **League selector** — color-coded dropdown (softcore/HC/SSF/events/PoE2)
- **Module pinning** — pin from sidebar or dashboard, synced via shared context, persisted in localStorage
- **Regex Library** — save and manage regex patterns from any calculator
- **Price disclaimer** — inline warning on all price-using calculators + topbar "Live*" popover
- **Dark-only** zinc-950 theme with glass morphism effects

## Development

```bash
npm install
npm run dev
```

## Deployment

Pushes to `master` trigger GitHub Actions → builds → deploys to `omnilyth-core-public` repo (`gh-pages` branch).

For production deployment with secure proxy, see `SECURITY_FIXES_IMPLEMENTATION.md` for:
- Netlify deployment (recommended)
- Vercel deployment
- Cloudflare Pages + Workers deployment

## Security

Project Omnilyth implements comprehensive security measures:

### ✅ Secure API Proxy
- Self-hosted serverless functions replace third-party CORS proxy
- Path validation and request sanitization
- 5-minute edge caching for performance
- Available for Netlify, Vercel, and Cloudflare Workers

### ✅ Security Headers
- Content-Security-Policy (XSS prevention)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing prevention)
- Referrer-Policy (privacy protection)

### ✅ Encrypted Storage
- AES-256-GCM encryption for sensitive localStorage data
- Per-device key generation using Web Crypto API
- Backwards compatible migration utilities

### ✅ Input Validation
- XSS prevention through HTML sanitization
- ReDoS protection for regex patterns
- Number/string validation with range checking
- Debouncing and rate limiting for expensive operations

**See `SECURITY_FIXES_SUMMARY.md` for complete details.**

## Gem Progression System

The Gem Progression System is a comprehensive tool for tracking gem availability throughout the Path of Exile campaign. See `GEM_PROGRESSION_README.md` for complete documentation.

### Features
- **335 Unique Gems** — complete database with icons from web.poecdn.com
- **Class Filtering** — filter by character class (Witch, Shadow, Ranger, Duelist, Marauder, Templar, Scion, All)
- **Act-by-Act Tracking** — see which gems unlock in each act (1-10)
- **Special Vendors** — detailed info on Siosa (Act 3 Library) and Lilly Roth (Act 6)
- **Alt Character Mode** — simplified view for experienced players with all gems unlocked
- **Advanced Search** — fuzzy search with Fuse.js, real-time filtering
- **Multiple Views** — grid view, list view, compact icon grid
- **Keyboard Shortcuts** — Ctrl+G (or Cmd+G) for quick search
- **Mobile Optimized** — floating action button and responsive layouts
- **Accessibility** — WCAG AA compliant with proper ARIA labels

### Components
- **Gem Browser** (`/leveling/gems`) — full-featured browser with advanced filtering
- **Preview Page** (`/leveling/preview`) — act-by-act gem unlock showcase
- **Quick Search Modal** — fast fuzzy search overlay
- **Gem Detail Modal** — complete gem information with external links
- **Gem Progression Panel** — sidebar with current/next act unlocks

### Data Sources
- Quest Rewards: [PoE Wiki](https://www.poewiki.net/wiki/Quest_Rewards)
- Gem Icons: [web.poecdn.com](https://web.poecdn.com)
- 256KB data file with 335 gems, Acts 1-4 complete

## What's Left to Do

### High Priority
- [ ] **Mobile Filter Modal** — full-screen filter panel for mobile gem browser (currently shows alert)
- [ ] **Component Tests** — Jest + React Testing Library for gem components
- [ ] **Acts 5-10 Data** — complete gem availability for remaining acts
- [ ] **Performance Profiling** — optimize large data rendering

### Medium Priority
- [ ] **Gem Favorites** — bookmark/favorite gems for quick access
- [ ] **Export Gem Lists** — copy gem lists to clipboard
- [ ] **Loading States** — skeleton loaders for gem images
- [ ] **Error Boundaries** — graceful error handling for components

### Nice to Have
- [ ] **Build Integration** — suggest gems based on build guides
- [ ] **Gem Level Tracking** — track gem leveling progress
- [ ] **Quality Indicators** — show quality gem variants
- [ ] **Awakened Gem Support** — include awakened gem variants
- [ ] **Vaal Gem Variants** — show vaal versions of gems

### Long Term
- [ ] **User Accounts** — save progress across devices
- [ ] **Community Recommendations** — user-submitted gem guides
- [ ] **Build-Specific Suggestions** — AI-powered gem recommendations
- [ ] **API Integration** — real-time data updates from PoE servers
