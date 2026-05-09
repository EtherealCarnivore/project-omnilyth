# Project Omnilyth

A Path of Exile toolkit — crafting calculators, regex generators, atlas tree planner, leveling tools, and more. **Supports both PoE 1 and PoE 2** (dual-game shell, in-progress for PoE 2 0.5 launch on 2026-05-29).

**Live**: [omnilyth.app](https://omnilyth.app/)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![License: MIT (workers)](https://img.shields.io/badge/workers/-MIT-green.svg)](workers/LICENSE)

Omnilyth's source code is licensed under the **GNU General Public License v3.0 or later** ([LICENSE](LICENSE)). The Cloudflare Worker proxy under `workers/` is licensed separately under **MIT** ([workers/LICENSE](workers/LICENSE)) so other Path of Exile community tools may freely fork the proxy logic. The license covers Omnilyth's original source code only — Path of Exile, the game's assets, item names, skill names, mod text, sprite icons, and related content remain the property of [Grinding Gear Games](https://www.grindinggear.com/) and are used here under their fan content policy. Omnilyth is not affiliated with, endorsed by, or connected to Grinding Gear Games.

For third-party dependency licenses and embedded data attributions, see [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). Contributions are accepted under the Developer Certificate of Origin — see [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Stack

- **Frontend**: React 19 + Vite 7 + Tailwind CSS 4
- **Routing**: React Router v7 (lazy-loaded modules)
- **State**: Context API (league, prices, pinning, leveling, atlas tree)
- **Search**: Fuse.js (fuzzy search for gems)
- **Data**: poe.ninja API (prices), PoE Wiki (gem availability), GGG atlas tree export
- **Deployment**: GitHub Actions CI/CD → GitHub Pages (this repo's `gh-pages` branch) → custom domain `omnilyth.app`
- **API Proxy**: Cloudflare Worker at [`k-genov.workers.dev`](https://k-genov.workers.dev/) (poe.ninja allowlist; legacy Netlify/Vercel function shims still in-tree as fallback)

## Modules

### Crafting — Coloring
| Module | Description |
|--------|-------------|
| Chromatic Calculator | Vorici bench crafts vs raw Chromatic Orbs |
| Tainted Chromatic | Tainted Chromatic Orb coloring for corrupted items |
| Omen of Blanching | White socket crafting with Omen of Blanching |
| Jeweller's Method | Add/remove sockets to lock in desired colors |

### Crafting — Links & Sockets
| Module | Description |
|--------|-------------|
| Fusing Calculator | Orbs of Fusing needed to link items (manual, bench, omen, tainted strategies) |
| Socket Calculator | Jeweller's Orbs needed for target socket count |

### Crafting — Item Search
| Module | Description |
|--------|-------------|
| Item Mod Regex | Generate regex patterns to find items with specific mods |

### Jewels
| Module | Description |
|--------|-------------|
| Cluster Jewel Calc | Find compatible notables for Large Cluster Jewels |
| Timeless Jewel Calc | Interactive skill tree for timeless jewel seed searching |

### Atlas
| Module | Description |
|--------|-------------|
| **Atlas Tree Planner** | Full interactive atlas passive tree with GGG sprite rendering, build saves, and point management |
| Map Mod Regex | Generate regex patterns to filter map mods |
| Scarab Regex | Auto-select scarabs by price range, generates stash search regex (multi-output for 250-char limit) |

### Leveling
| Module | Description |
|--------|-------------|
| **Gem Browser** | Browse all 335 gems with advanced filtering by class, act, and availability source |
| **Gem Planner** | Plan leveling gems before league start — track what to get and when |
| **Gem Lookup** | Campaign gem availability — check where to obtain specific gems act-by-act |
| **Leveling Playbook** | Step-by-step speedrunner strategies with checklists, decisions, and power spikes |
| Leveling Mode | Complete leveling guide with quest tracking and zone tips |
| Vendor Leveling Regex | Find vendor items with movement speed, sockets, links, and leveling stats |
| Gem Regex | Generate search patterns for specific gems in your stash |

### Regex Library
| Module | Description |
|--------|-------------|
| Regex Library | Save and manage regex patterns from any calculator |

## Features

- **Atlas Tree Planner** — interactive atlas passive tree using GGG's official sprite assets (3.27 league data), auto-pathing, build save/load, URL hash sharing, point limit enforcement with Full Atlas / Custom toggle, adjustable brightness presets, minimap
- **Gem Progression System** — 335 gems, class filtering, act-by-act unlocks, Siosa/Lilly Roth vendors, fuzzy search, keyboard shortcuts (Ctrl+G), mobile FAB, grid/list views
- **Leveling Playbook** — speedrunner strategies with PoB link group awareness, multi-source import, and tabbed UI
- **User Feedback** — submit bugs, UI issues, suggestions, and feature requests directly from the app (creates GitHub issues automatically, no account required)
- **Category overview pages** — hub pages for Crafting, Atlas, Jewels, and Leveling
- **League selector** — color-coded dropdown (softcore/HC/SSF/events/PoE2)
- **Module pinning** — pin from sidebar or dashboard, synced via shared context, persisted in localStorage
- **Regex Library** — save and manage regex patterns from any calculator (top-level navigation)
- **Patch Notes Widget** — latest PoE patch notes with read/unread tracking
- **Price disclaimer** — inline warning on all price-using calculators + topbar "Live*" popover
- **Dark-only** zinc-950 theme with glass morphism effects

## Atlas Tree Planner

Interactive atlas passive tree planner at `/atlas/tree`.

### Features
- **Official GGG Assets** — background image, group background nebulas, node frame sprites, and icons from PoE CDN
- **3.27 League Data** — current Keepers of the Kalguur atlas tree (960 nodes, 132 points)
- **Auto-Pathing** — click any node, shortest path is auto-calculated and allocated
- **Arc Connections** — same-orbit connections follow circular arcs (not straight lines)
- **Point Limit** — Full Atlas (132) or Custom (0-132) with over-limit rejection visualization
- **Build Manager** — save, load, rename, delete builds (localStorage)
- **URL Hash Sharing** — share builds via URL hash encoding
- **Search** — find nodes by name or stat keywords
- **Summary Panel** — grouped stats for allocated nodes
- **Brightness Control** — Dark / Dim / Normal / Bright presets
- **Minimap** — overview of tree with allocated node highlights
- **Keyboard Shortcuts** — R (reset), S (toggle panel), scroll (zoom), drag (pan)

### Data Source
Atlas tree data from [GGG's official export](https://github.com/grindinggear/atlastree-export) (`league.json`).

## Gem Progression System

Comprehensive gem browser and tracking tool.

### Features
- **335 Unique Gems** — complete database with icons from web.poecdn.com
- **Class Filtering** — filter by character class (Witch, Shadow, Ranger, Duelist, Marauder, Templar, Scion, All)
- **Act-by-Act Tracking** — see which gems unlock in each act (1-10)
- **Special Vendors** — Siosa (Act 3 Library) and Lilly Roth (Act 6)
- **Alt Character Mode** — simplified view for experienced players
- **Advanced Search** — fuzzy search with Fuse.js, real-time filtering
- **Multiple Views** — grid view, list view, compact icon grid
- **Keyboard Shortcuts** — Ctrl+G (or Cmd+G) for quick search
- **Mobile Optimized** — floating action button and responsive layouts

### Components
- **Gem Browser** (`/leveling/gems`) — full-featured browser with advanced filtering
- **Gem Lookup** (`/leveling/gem-lookup`) — campaign gem availability reference
- **Gem Planner** (`/leveling/planner`) — pre-league gem planning tool
- **Quick Search Modal** — fast fuzzy search overlay
- **Gem Detail Modal** — complete gem information with external links

### Data Sources
- Quest Rewards: [PoE Wiki](https://www.poewiki.net/wiki/Quest_Rewards)
- Gem Icons: [web.poecdn.com](https://web.poecdn.com)
- 256KB data file with 335 gems, Acts 1-4 complete

## Development

```bash
npm install
npm run dev      # Dev server (auth bypassed)
npm run build    # Production build
npm run preview  # Preview production build (auth enabled)
```

## Deployment

Pushes to `master` trigger GitHub Actions (`.github/workflows/deploy.yml`) → builds → deploys to this repo's own `gh-pages` branch via `peaceiris/actions-gh-pages`. The custom domain `omnilyth.app` is bound at the GitHub Pages level (CNAME file emitted into the gh-pages output by the workflow).

**Live:** [omnilyth.app](https://omnilyth.app/)

## Security

### Secure API Proxy
- Self-hosted Cloudflare Worker replaces third-party CORS proxy
- Path validation and request sanitization (allowlist-driven)
- 5-minute edge caching for performance
- Active proxy: [`k-genov.workers.dev`](https://k-genov.workers.dev/) (Cloudflare Workers); legacy Netlify/Vercel function shims still in-tree as fallback

### Security Headers
- Content-Security-Policy (XSS prevention)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing prevention)
- Referrer-Policy (privacy protection)

### Encrypted Storage
- AES-256-GCM encryption for sensitive localStorage data
- Per-device key generation using Web Crypto API

### Input Validation
- XSS prevention through HTML sanitization
- ReDoS protection for regex patterns
- Number/string validation with range checking
- Rate limiting for authentication attempts

To report a security vulnerability privately, see [SECURITY.md](SECURITY.md).

## What's Left to Do

### High Priority
- [ ] **Mobile Filter Modal** — full-screen filter panel for mobile gem browser
- [ ] **Acts 5-10 Data** — complete gem availability for remaining acts
- [ ] **Performance Profiling** — optimize large data rendering

### Medium Priority
- [ ] **Gem Favorites** — bookmark/favorite gems for quick access
- [ ] **Export Gem Lists** — copy gem lists to clipboard
- [ ] **Error Boundaries** — graceful error handling for components

### Planned Features
- [ ] **Passive Planner** — skill tree passive planning tool
- [ ] **Stash Valuation** — estimate stash tab value using poe.ninja prices
- [ ] **Seed Finder** — timeless jewel seed optimization
- [ ] **PoE 2 dual-game shell** — GameContext + registry filter + topbar switcher + PoE 2 stub home (Phase 1 in progress; target 2026-05-07)
- [ ] **PoE 2 Item Mod Regex** — fork of `item-regex` with poe2db.tw mod data (Phase 3, ships post-0.5 launch on 2026-05-29)
- [ ] **PoE 2 Gem Browser** — fork of `leveling-gems` with PoE 2 gem system (uncut/skill/spirit/support/meta gems)
- [ ] **PoE 2 Atlas Tree Planner** — Phase 4, ships once 0.5 atlas tree expansion (~40+ nodes) lands and community data extraction stabilizes

### Long Term
- [ ] **TypeScript Migration** — add type safety progressively
- [ ] **User Accounts** — save progress across devices
- [ ] **PWA Support** — offline access and install prompt

---

## Credits & Attribution

This project uses data from various Path of Exile community resources.

### Data Sources

- **[Grinding Gear Games](https://github.com/grindinggear/atlastree-export)** - Official atlas tree data export
- **[exile-leveling](https://github.com/HeartofPhos/exile-leveling)** by HeartofPhos - Act progression data
- **[poe-leveling.com](https://poe-leveling.com)** - Leveling tips and racing strategies
- **[Path of Exile Wiki](https://www.poewiki.net)** (CC BY-NC-SA 3.0) - Gem data, quest rewards, game mechanics
- **[poe.ninja](https://poe.ninja)** - Real-time item and currency prices (public API)
- **[web.poecdn.com](https://web.poecdn.com)** - Gem icons, atlas sprites (official PoE CDN)

**Complete attribution details:** See [ATTRIBUTIONS.md](ATTRIBUTIONS.md)

### License

This project is licensed under **GPL-3.0-or-later** — see [LICENSE](LICENSE) for details. The Cloudflare Worker proxy under `workers/` is carved out under **MIT** ([workers/LICENSE](workers/LICENSE)).

**Scope:** the GPL-3.0 license applies to Omnilyth's original source code. Third-party data (PoE Wiki under CC BY-NC-SA 3.0, HeartofPhos/exile-leveling, Siveran's CC0 chromatic calc, GGG atlas/passive tree exports, vilsol/timeless-jewels under GPL-3.0, etc.) remains under its original license terms. The full register lives in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). Path of Exile assets remain GGG's IP and are used under their fan content policy.

### Privacy

No tracking, no ads, no data collection. Visit `/privacy` on the live site for the full policy.

---

## Disclaimer

Omnilyth is a fan-made tool and is not affiliated with Grinding Gear Games. Path of Exile and all related content are trademarks of Grinding Gear Games.

This tool is provided for informational purposes only. We are not responsible for any game decisions made based on calculator results.

---
**Last Updated:** 2026-05-06 — Dual-game framing added; PoE 2 support roadmap planned for 0.5 launch.
