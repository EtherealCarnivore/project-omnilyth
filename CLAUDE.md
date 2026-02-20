# CLAUDE.md - Project Omnilyth

**Project Context for AI Assistants**

## What is Omnilyth?

Project Omnilyth is a **Path of Exile toolkit** - a comprehensive web application for PoE players featuring crafting calculators, regex generators, atlas tools, and build planning utilities.

**Tech Stack:** React 19 + Vite 7 + Tailwind CSS 4
**Deployment:** Netlify (primary) + GitHub Pages (backup)
**Live URLs:**
- Netlify (with feedback): https://omnilyth-beta.netlify.app/
- GitHub Pages: https://etherealcarnivore.github.io/omnilyth-core-public/

---

## Core Architecture

### Technology
- **Frontend:** React 19 with React Router v7
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API (no Redux/Zustand)
- **Search:** Fuse.js (fuzzy search for gems)
- **Data Sources:** poe.ninja API (prices), PoE Wiki (gem availability)

### Key Patterns
- **Lazy Loading:** All calculator pages use React.lazy() for code splitting
- **Module Registry:** Centralized module management in `src/modules/registry.js`
- **Context Providers:** 7 contexts nested in App.jsx (League, Prices, Pinned, Design, LevelingProgress, LevelingMode, PatchNotes)
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

### Leveling
- **Gem Browser** (`/leveling/gems`) - Browse all 335 gems with advanced filtering by class, act, and availability source
- **Gem Progression** - Track gem unlocks act-by-act with quest rewards, Siosa (Act 3), and Lilly Roth (Act 6)
- **Quick Search Modal** - Fuzzy search with keyboard shortcuts (Ctrl+G) and mobile FAB
- **Gem Detail Modal** - Complete gem information with external links to PoE Wiki and trade search
- **Class Filtering** - Filter by character class (Witch, Shadow, Ranger, Duelist, Marauder, Templar, Scion, All)
- **Alt Character Mode** - Simplified view for experienced players with all gems unlocked
- **Multiple Views** - Grid view (compact cards), list view (detailed rows), compact icon grid
- **Vendor Leveling** - Socket/link regex for vendor shopping with validation
- **Gem Regex** - Generate search patterns for specific gems in stash

**Data:** 335 unique gems from PoE Wiki, Acts 1-4 complete (256KB), icons from web.poecdn.com CDN

### Regex Library
- **Save Regex Button** - Save patterns from any calculator
- **Regex Library Page** - Manage saved patterns with search/filter
- **Cookie Storage** - Persistent pattern storage

### Patch Notes
- **Patch Notes Widget** - Latest PoE patch notes from Reddit (GGG flair)
- **Forum Link Extraction** - Auto-detects official PoE forum links
- **Read/Unread Tracking** - LocalStorage-based read status

### User Feedback System
- **Feedback Button** - Submit bugs, UI issues, suggestions, feature requests
- **GitHub Issues Integration** - Submissions create GitHub issues automatically
- **No Account Required** - Users don't need GitHub accounts
- **Serverless Backend** - Secure proxy via Netlify function

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
   - `netlify/functions/github-feedback.js` (Feedback system)
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

## Gem Progression System

The Gem Progression System is a comprehensive gem browser and tracking tool for Path of Exile leveling. **See `GEM_PROGRESSION_README.md` for complete documentation.**

### Architecture

**Components** (13 total in `src/components/leveling/`):
- `ClassSelector.jsx` - Character class dropdown
- `AvailabilityBadge.jsx` - Color-coded availability indicators
- `QuickSearchModal.jsx` - Fast fuzzy search overlay
- `GemDetailModal.jsx` - Detailed gem information
- `GemProgressionPanel.jsx` - Sidebar with current/next act unlocks
- `GemUnlocksSection.jsx` - Act-based gem displays
- `SiosaUnlockBanner.jsx` - Act 3 special vendor info
- `LillyRothUnlockBanner.jsx` - Act 6 all-gems vendor info
- `FilterSidebar.jsx` - Advanced filtering panel
- `GemGridView.jsx` - Compact grid layout
- `GemListView.jsx` - Detailed list layout
- `FloatingSearchButton.jsx` - Mobile FAB

**Pages** (2 total):
- `LevelingGemsPage.jsx` - Full browser at `/leveling/gems`
- `LevelingPreviewPage.jsx` - Showcase at `/leveling/preview`

**Hooks** (2 total):
- `useGemSearch.js` - Fuzzy search with Fuse.js, class filtering
- `useKeyboardShortcut.js` - Global keyboard shortcuts (Ctrl+G)

**Context:**
- `LevelingModeContext.jsx` - Global state (selectedClass, mode, currentAct)

**Data:**
- `src/data/leveling/gemAvailability.js` - 335 gems, 256KB
- Generated from `scripts/leveling-data/transform-gem-data.js`
- Source: PoE Wiki Quest Rewards page

### Key Features

- **335 Unique Gems** - Acts 1-4 complete, icons from web.poecdn.com
- **Class Filtering** - 7 classes + "All Classes" option
- **Act-by-Act Unlocks** - See gems available in each act (1-10)
- **Special Vendors** - Siosa (Act 3), Lilly Roth (Act 6)
- **Alt Character Mode** - Simplified view for experienced players
- **Fuzzy Search** - Fuse.js with 0.3 threshold, min 2 characters
- **Multiple Views** - Grid (compact cards), List (detailed rows)
- **Keyboard Shortcuts** - Ctrl+G (or Cmd+G) for quick search
- **Mobile FAB** - Floating action button for quick access
- **Accessibility** - WCAG AA compliant

### What's Left to Do

**High Priority:**
- Mobile filter modal (currently shows alert)
- Component tests (Jest + React Testing Library)
- Acts 5-10 gem data (only Acts 1-4 currently)
- Performance profiling

**Medium Priority:**
- Gem favorites/bookmarks
- Export gem lists to clipboard
- Loading states for gem images
- Error boundaries

**Nice to Have:**
- Build integration (suggest gems)
- Gem level tracking
- Quality gem indicators
- Awakened gem support
- Vaal gem variants

**Long Term:**
- User accounts (cross-device sync)
- Community recommendations
- AI-powered suggestions
- Real-time API updates

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

**Primary (Netlify):**
- **URL:** https://omnilyth-beta.netlify.app/
- **Auto-deploy:** Push to master triggers build
- **Build Time:** ~1-2 minutes
- **Features:** Serverless functions, environment variables, feedback system

**Backup (GitHub Pages):**
- **URL:** https://etherealcarnivore.github.io/omnilyth-core-public/
- **Deploy Repo:** `EtherealCarnivore/omnilyth-core-public` (gh-pages branch)
- **GitHub Actions:** `.github/workflows/deploy.yml`
- **Limitation:** No serverless functions (feedback button won't work)

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

// Leveling Mode
import { useLevelingMode } from '../contexts/LevelingModeContext';
const { selectedClass, setSelectedClass, mode, setMode, currentAct, setCurrentAct } = useLevelingMode();
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
- **FEEDBACK_SYSTEM_SETUP.md** - User feedback system setup guide
- **SECURITY_FIXES_SUMMARY.md** - Security improvements overview
- **PERFORMANCE_ANALYSIS.md** - Performance review and optimizations
- **BETA_GATE_SETUP.md** - Password authentication setup

### Configuration
- **vite.config.js** - Build configuration, proxy setup
- **tailwind.config.js** - Tailwind CSS configuration
- **netlify.toml** / **vercel.json** - Deployment configs

### Key Components
- **BetaGate.jsx** - Password authentication
- **FeedbackButton.jsx** - User feedback submission (uses React Portal)
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
