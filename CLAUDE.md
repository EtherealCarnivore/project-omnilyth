# CLAUDE.md - Project Omnilyth

**Project Context for AI Assistants**

## What is Omnilyth?

Project Omnilyth is a **Path of Exile toolkit** - a comprehensive web application for PoE players featuring crafting calculators, regex generators, atlas tools, and build planning utilities.

**Tech Stack:** React 19 + Vite 7 + Tailwind CSS 4
**Deployment:** GitHub Pages (private beta with password gate)
**Live URL:** https://etherealcarnivore.github.io/omnilyth-core-public/

---

## Core Architecture

### Technology
- **Frontend:** React 19 with React Router v7
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API (no Redux/Zustand)
- **Data Sources:** poe.ninja API (prices), Reddit API (patch notes)

### Key Patterns
- **Lazy Loading:** All calculator pages use React.lazy() for code splitting
- **Module Registry:** Centralized module management in `src/modules/registry.js`
- **Context Providers:** 6 contexts nested in App.jsx (League, Prices, Pinned, Design, LevelingProgress, PatchNotes)
- **Serverless Proxy:** Secure API proxying via Netlify/Vercel/Cloudflare functions

### Project Structure
```
src/
├── calculators/        # Business logic (separated from UI)
├── components/         # Reusable React components
├── contexts/          # Global state providers
├── data/              # Static game data (item mods, cluster jewels, etc.)
├── hooks/             # Custom React hooks
├── layout/            # App shell (Sidebar, Topbar)
├── modules/           # Module registry
├── pages/             # Route components
└── utils/             # Helper functions
```

---

## Features & Calculators

### Crafting - Coloring
- **Chromatic Calculator** - Vorici bench vs raw Chromatic Orbs
- **Tainted Chromatic** - Corrupted item coloring
- **Omen of Blanching** - White socket crafting
- **Jeweller's Method** - Socket manipulation to lock colors

### Crafting - Linking & Socketing
- **Fusing Calculator** - Linking strategies (manual/bench/omen/tainted)
- **Socket Calculator** - Jeweller's Orb requirements
- **Vendor Leveling** - Socket/link regex for vendor shopping with validation

### Build Planning
- **Cluster Jewel Calc** - Compatible notables for Large Cluster Jewels
- **Timeless Jewel Calc** - Interactive skill tree for seed hunting

### Atlas / Mapping
- **Map Mod Regex** - Filter map mods by preference
- **Scarab Regex** - Price-based scarab selection with multi-output regex

### Regex Library
- **Save Regex Button** - Save patterns from any calculator
- **Regex Library Page** - Manage saved patterns with search/filter
- **Cookie Storage** - Persistent pattern storage

### Patch Notes
- **Patch Notes Widget** - Latest PoE patch notes from Reddit (GGG flair)
- **Forum Link Extraction** - Auto-detects official PoE forum links
- **Read/Unread Tracking** - LocalStorage-based read status

---

## Security Implementation

### 🔐 Beta Gate (Current)
- **Password:** `privat3Be7@_SUB_TO_IVA_NOOBS_uwu^.^_`
- **Hash:** Single SHA-512 (no iterations for simplicity)
- **Storage:** localStorage with 30-day expiry
- **Rate Limiting:** 5 attempts per minute
- **Auto-trim:** Spaces stripped from input

**Files:** `src/components/BetaGate.jsx`

### 🛡️ Security Measures
1. **Serverless API Proxy** - Replaced corsproxy.io with own functions
   - `netlify/functions/poe-ninja-proxy.js` (Netlify)
   - `api/poe-ninja-proxy.js` (Vercel)
   - `workers/poe-ninja-proxy.js` (Cloudflare)

2. **Security Headers** - CSP, X-Frame-Options, X-Content-Type-Options
   - `index.html` - Meta tag headers
   - `netlify.toml` / `vercel.json` - Platform configs

3. **Encrypted Storage** - `src/utils/secureStorage.js`
   - AES-256-GCM encryption for sensitive localStorage data
   - Per-device key generation

4. **Input Validation** - `src/utils/inputValidation.js`
   - XSS prevention, ReDoS protection, sanitization

**See:** `SECURITY_FIXES_SUMMARY.md` for complete details

---

## Path of Exile Expert Agent

We have a **PoE Expert Agent** configured at `.claude/agents/poe-expert.yaml`

### What It Does
- Deep game mechanics knowledge (damage calculations, ailments, defense layers)
- Build theory and optimization
- Itemization and crafting strategies
- Tools expertise (PoB, poe.ninja, regex)
- Current meta knowledge (3.27 + Phrecia 2.0)

### How to Use
```
"Using poe-expert: How does poison DPS scale with multiple projectiles?"
"poe-expert: Generate regex for buying 3R-2B-1G gear"
"Ask poe-expert: What's the best way to craft a +2 bow?"
```

The agent provides expert answers with:
- Clear mechanics explanations
- Concrete examples from the game
- Mathematical formulas when relevant
- Trade-offs and alternatives
- Tool references (PoB, poe.ninja)

---

## Development Guidelines

### Running Locally
```bash
npm install          # Install dependencies
npm run dev          # Dev server (auth bypassed)
npm run build        # Production build
npm run preview      # Preview production build (auth enabled)
```

### Key Commands
- **Dev:** `http://localhost:5173` - Auth bypassed in dev mode
- **Preview:** `http://localhost:4173` - Shows password gate
- **Build:** Output to `dist/` directory

### Environment Variables
```bash
# Optional - defaults to Netlify
VITE_PROXY_URL=/.netlify/functions/poe-ninja-proxy  # Netlify
VITE_PROXY_URL=/api/poe-ninja-proxy                 # Vercel
VITE_PROXY_URL=https://worker-url.workers.dev       # Cloudflare
```

### Git Workflow
```bash
# ALWAYS commit as EtherealCarnivore
git config user.name "EtherealCarnivore"
git config user.email "42915554+EtherealCarnivore@users.noreply.github.com"

# Push to master triggers GitHub Actions
git push origin master
# → Builds → Deploys to EtherealCarnivore/omnilyth-core-public (gh-pages)
```

### Deployment
- **Source Repo:** `EtherealCarnivore/project-omnilyth`
- **Deploy Repo:** `EtherealCarnivore/omnilyth-core-public` (gh-pages branch)
- **GitHub Actions:** `.github/workflows/deploy.yml`
- **Build Time:** ~20-25 seconds
- **Deploy Time:** Total ~2-3 minutes after push

---

## Important Patterns

### Adding a New Calculator

1. **Create calculator logic** in `src/calculators/`
2. **Create page component** in `src/pages/`
3. **Register in** `src/modules/registry.js`:
```javascript
{
  id: 'my-calculator',
  title: 'My Calculator',
  category: 'crafting',
  path: '/crafting/my-calculator',
  component: lazy(() => import('../pages/MyCalculatorPage'))
}
```
4. **Add route** automatically handled by registry

### Using Contexts
```javascript
// League selector
import { useLeague } from '../contexts/LeagueContext';
const { league, setLeague, leagues } = useLeague();

// Prices
import { usePrices } from '../hooks/usePrices';
const { prices, loading, error, refresh } = usePrices(league);

// Pinning
import { usePinned } from '../contexts/PinnedContext';
const { pinned, addPin, removePin, isPinned } = usePinned();
```

### Socket Validation
Socket limits enforced by `src/data/vendorLevelingStats.js`:
- **Body Armour / 2H Weapons / Bow / Staff:** 6 sockets, 6 links
- **Most gear:** 4 sockets, 4 links
- **Rings / Amulets / Belts / Quivers:** 0 sockets (cannot have)

### Regex Generation
Follow PoE's 250-character limit:
- Multi-output when necessary (Scarab Calculator splits into multiple patterns)
- Test in PoE before committing
- Use `SaveRegexButton` component for all calculators

---

## Common Tasks

### Update Password Hash
```bash
# Generate new hash
node scripts/hash-simple.js "new-password"

# Copy output to src/components/BetaGate.jsx
const PASSWORD_HASH = 'new-hash-here';
```

### Add New Patch Note
Mock data in `src/contexts/PatchNotesContext.jsx` - MOCK_PATCHES array

### Update Price Data
Prices auto-fetch from poe.ninja with 24-hour cache. To force refresh:
```javascript
const { refresh } = usePrices(league);
refresh(); // Clears cache and re-fetches
```

### Debug Build Issues
```bash
# Check bundle size
npm run build

# Large files (>500KB) are flagged
# Consider code splitting if needed
```

---

## File Reference

### Documentation
- **CLAUDE.md** (this file) - Project context for AI
- **README.md** - Public project documentation
- **SECURITY_FIXES_SUMMARY.md** - Security improvements overview
- **PERFORMANCE_ANALYSIS.md** - Performance review and optimizations
- **BETA_GATE_SETUP.md** - Password authentication setup

### Configuration
- **vite.config.js** - Build configuration, proxy setup
- **tailwind.config.js** - Tailwind CSS configuration
- **netlify.toml** / **vercel.json** - Deployment configs

### Key Components
- **BetaGate.jsx** - Password authentication
- **SaveRegexButton.jsx** - Regex pattern saving (uses React Portal)
- **PatchNotesWidget.jsx** - Dashboard patch notes display
- **Sidebar.jsx** / **Topbar.jsx** - App navigation

### Data Files (Large)
- **src/data/itemMods.js** (2.9MB) - All item modifiers
- **src/data/magicItemMods.js** - Magic item affixes
- **src/data/clusterJewelData.json** (239KB) - Cluster jewel notables
- **src/data/vendorLevelingStats.js** - Leveling item priorities

---

## Known Issues & Limitations

### Performance
- **Bundle Size:** 3.6MB uncompressed data files
- **Initial Load:** ~3 seconds on slow connections
- **Code Splitting:** Implemented but large data files still load

### API Rate Limits
- **poe.ninja:** No official rate limit, be respectful
- **Reddit API:** 60 requests/minute (unused, using mock data currently)

### Browser Compatibility
- **Modern browsers only** (Chrome 90+, Firefox 88+, Safari 14+)
- **Web Crypto API required** (for password hashing)
- **LocalStorage required** (for persistence)

### Security Model
- **Client-side only** - Password gate can be bypassed with DevTools
- **Good for:** Private beta among friends
- **Not suitable for:** Protecting truly sensitive data
- **For production auth:** Use Auth0, Clerk, or Netlify Identity

---

## Future Improvements

### High Priority
1. **TypeScript Migration** - Add type safety progressively
2. **Performance Optimization** - React.memo on heavy components
3. **Bundle Size Reduction** - Progressive data loading
4. **Real Authentication** - If needed beyond friends-only beta

### Nice to Have
1. **PWA Support** - Offline access, install prompt
2. **Dark/Light Theme Toggle** - Currently dark-only
3. **User Accounts** - Save preferences across devices
4. **Community Features** - Share regex patterns, build guides

---

## Quick Links

- **Live Site:** https://etherealcarnivore.github.io/omnilyth-core-public/
- **Source Repo:** https://github.com/EtherealCarnivore/project-omnilyth
- **Deploy Repo:** https://github.com/EtherealCarnivore/omnilyth-core-public
- **poe.ninja API:** https://poe.ninja/api
- **Path of Exile Wiki:** https://www.poewiki.net/

---

## Contact & Access

**Password for Beta:** `privat3Be7@_SUB_TO_IVA_NOOBS_uwu^.^_`

**Git User:** EtherealCarnivore
**GitHub:** https://github.com/EtherealCarnivore

---

**Last Updated:** 2025-02-17
**Version:** 1.0.0
**Status:** Private Beta
