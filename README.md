# Project Omnilyth

A Path of Exile toolkit — crafting calculators, regex generators, and atlas tools.

**Live**: [etherealcarnivore.github.io/omnilyth-core-public](https://etherealcarnivore.github.io/omnilyth-core-public/)

## Stack

- React 19 + Vite 6 + Tailwind CSS 4
- React Router v7 (lazy-loaded modules)
- Context API for state (league, prices, pinning, design variants)
- Prices from poe.ninja (secure serverless proxy in prod, Vite proxy in dev)
- GitHub Actions CI/CD → Netlify/Vercel/GitHub Pages

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

## Features

- **Design variant system** — toggleable v1/v2 layouts for A/B testing UX approaches, persisted in localStorage
- **Category overview pages** — hub pages for Crafting, Atlas, and Build Planning (v2 layout)
- **League selector** with color-coded dropdown (softcore/HC/SSF/events/PoE2)
- **Module pinning** — pin from sidebar or dashboard, synced via shared context, persisted in localStorage
- **Price disclaimer** — inline warning on all price-using calculators + topbar "Live*" popover
- **Dark-only** zinc-950 theme

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
