# Project Omnilyth

A Path of Exile toolkit — crafting calculators, regex generators, and atlas tools.

**Live**: [etherealcarnivore.github.io/omnilyth-core-public](https://etherealcarnivore.github.io/omnilyth-core-public/)

## Stack

- React + Vite + Tailwind CSS 4
- React Router (lazy-loaded modules)
- Prices from poe.ninja (CORS proxy in prod, Vite proxy in dev)

## Modules

### Crafting
| Module | Description |
|--------|-------------|
| Chromatic Calculator | Vorici bench crafts vs raw Chromatic Orbs |
| Tainted Chromatic | Tainted Chromatic Orb coloring for corrupted items |
| Omen of Blanching | White socket crafting with Omen of Blanching |
| Jeweller's Method | Add/remove sockets to lock in desired colors |
| Fusing Calculator | Orbs of Fusing needed to link items (manual, bench, omen, tainted strategies) |
| Socket Calculator | Jeweller's Orbs needed for target socket count |
| Item Mod Regex | Generate regex patterns to find items with specific mods |
| Cluster Jewel Calc | Find compatible notables for Large Cluster Jewels |
| Timeless Jewel Calc | Interactive skill tree for timeless jewel seed searching (Soon) |

### Atlas / Mapping
| Module | Description |
|--------|-------------|
| Map Mod Regex | Generate regex patterns to filter map mods |
| Scarab Regex | Auto-select scarabs by price range, generates stash search regex (multi-output for 250-char limit) |

## Features

- **League selector** with color-coded dropdown (softcore/HC/SSF/events/PoE2)
- **Module pinning** — pin from sidebar or dashboard, synced via shared context, persisted in localStorage
- **Price disclaimer** — inline warning on all price-using calculators + topbar "Live*" popover
- **Support skeleton** — BuyMeACoffee / Patreon placeholders (coming soon)
- **Dark-only** zinc-950 theme

## Development

```bash
npm install
npm run dev
```

## Deployment

Pushes to `master` trigger GitHub Actions → builds → deploys to `omnilyth-core-public` repo (`gh-pages` branch).
