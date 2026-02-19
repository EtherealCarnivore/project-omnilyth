# Leveling Mode Feature - Complete Documentation

Comprehensive leveling guide for Path of Exile integrated into Omnilyth, featuring quest tracking, zone tips, vendor recipes, gem progression, and racing advice.

---

## 🎯 Feature Overview

### What It Does

Leveling Mode transforms Omnilyth into a complete leveling companion with:
- **Quest Tracking** - Check off objectives as you complete them
- **Zone Guidance** - Tips and strategies for each area
- **Vendor Recipes** - Crafting recipes at vendors (Fresh mode only)
- **Gem Progression** - Class-specific gem availability
- **Racing Tips** - Curated advice for speed leveling
- **Mode Toggle** - Fresh Start vs Alt Character modes

### Target Users

- **Fresh League Starters** - Full guidance with vendor recipes
- **Alt Character Levelers** - Streamlined tips for speed
- **Racing Players** - Optimized routes and strategies
- **New Players** - Step-by-step progression

---

## ✅ Implementation Status

### Phase 1: Infrastructure ✅ COMPLETE

**Files Created:**
- `src/contexts/LevelingProgressContext.jsx` - Extended with mode toggle
- `src/components/leveling/ModeToggle.jsx` - Fresh/Alt switcher
- `src/pages/LevelingModePage.jsx` - Main page shell
- `src/modules/registry.js` - Module registration

**Features:**
- ✅ Mode selection (Fresh/Alt) with localStorage persistence
- ✅ Mode toggle with confirmation dialogs
- ✅ Progress tracking infrastructure
- ✅ Reset progress functionality
- ✅ Quick links to existing tools
- ✅ Coming soon placeholder

**Build:** 5.61 KB (gzipped: 1.52 KB)

---

### Phase 2: Data Collection & Parsing ✅ COMPLETE

**Scripts Created:**
- `scripts/leveling-data/parse-exile-leveling.js` - GitHub parser
- `scripts/leveling-data/scrape-poe-leveling.js` - Web scraper
- `scripts/leveling-data/scrape-poe-wiki.js` - Wiki scraper
- `scripts/leveling-data/merge-data-sources.js` - Data merger
- `scripts/leveling-data/generate-mock-data.js` - Mock data generator
- `scripts/leveling-data/run-all.js` - Master pipeline
- `scripts/leveling-data/README.md` - Documentation

**Data Files Generated:**
- `src/data/leveling/acts123-data.js` - Acts 1-3 (11 KB)
- `src/data/leveling/acts456-data.js` - Acts 4-6 (placeholder)
- `src/data/leveling/acts789-data.js` - Acts 7-9 (placeholder)
- `src/data/leveling/act10-data.js` - Act 10 (placeholder)

**NPM Scripts Added:**
```bash
npm run leveling-data:mock      # Generate mock data
npm run leveling-data:live      # Full pipeline
npm run leveling-data:parse     # Parse GitHub only
npm run leveling-data:scrape-poe # Scrape poe-leveling.com
npm run leveling-data:scrape-wiki # Scrape PoE Wiki
npm run leveling-data:merge     # Merge all sources
```

**Data Sources:**
- ✅ exile-leveling (GitHub) - Structured data
- ✅ poe-leveling.com - Leveling guides
- ✅ PoE Wiki (CC BY-NC-SA 3.0) - Gem data
- ✅ Proper attribution in all files

**Features:**
- ✅ Mock data generation (instant)
- ✅ Live data scraping with rate limiting
- ✅ Act-based data chunks for code splitting
- ✅ Source attribution metadata
- ✅ Error handling and caching

**Current Data:** Act 1 complete with 14 areas, 7 quests, 6 gems

---

### Phase 3: Comparison Page ✅ COMPLETE

**Files Created:**
- `src/pages/LevelingPreviewPage.jsx` - Preview page
- `src/components/leveling/preview/ExileLevelingLayout.jsx` - Structured layout
- `src/components/leveling/preview/PoELevelingLayout.jsx` - Narrative layout
- `PHASE_3_GUIDE.md` - Comparison guide

**Features:**
- ✅ Layout style toggle (exile-leveling vs poe-leveling)
- ✅ Side-by-side comparison mode (desktop)
- ✅ Interactive checkboxes (exile style)
- ✅ Expandable zones (poe style)
- ✅ Progress tracking in both styles
- ✅ Feedback section for decision-making
- ✅ Uses same mock data in both layouts

**Build:** 11.28 KB (gzipped: 2.79 KB) + lazy-loaded layouts

**Route:** `/leveling/preview`

**Next Step:** User decision on which layout to use for production

---

### Phase 4: Core UI with Unique Design 🚧 NOT STARTED

**Estimated:** 4-5 days

**Planned Components:**
- `ActNavigation.jsx` - Act selector tabs
- `ZoneCard.jsx` - Production zone component
- `ObjectiveList.jsx` - Checkbox list with progress
- `TipSection.jsx` - Collapsible tips (mode-filtered)
- `RecipeSection.jsx` - Vendor recipes (Fresh only)
- `CreditsFooter.jsx` - Source attribution

**Planned Features:**
- Unique Omnilyth design (not copied from sources)
- Gold accent styling (#daa520)
- Glass-card backgrounds
- Custom icons
- Progress stats dashboard
- Zone completion tracking

---

### Phase 5: Enhanced Features 🚧 NOT STARTED

**Estimated:** 3-4 days

**Planned Components:**
- `GemProgressionPanel.jsx` - Gem tracking side panel
- `ProgressStats.jsx` - Overall progress display
- `RacingTipsFilter.jsx` - Toggle racing advice

**Planned Features:**
- Gem panel (side panel desktop, drawer mobile)
- Class-specific gem filtering (wiki data)
- Racing tips toggle
- Vendor recipe toggle (Fresh mode)
- Next incomplete zone finder

---

### Phase 6: Polish & Mobile 🚧 NOT STARTED

**Estimated:** 2-3 days

**Planned:**
- Mobile-optimized layouts
- Responsive breakpoints
- Touch-friendly interactions
- Performance optimization (memoization)
- Links to vendor/gem tools
- Data freshness warning
- Final testing and bug fixes

---

## 📂 Project Structure

```
project-omnilyth/
├── src/
│   ├── contexts/
│   │   └── LevelingProgressContext.jsx ......... Mode + progress state
│   ├── components/
│   │   └── leveling/
│   │       ├── ModeToggle.jsx .................. Fresh/Alt toggle
│   │       └── preview/
│   │           ├── ExileLevelingLayout.jsx ..... Structured layout
│   │           └── PoELevelingLayout.jsx ....... Narrative layout
│   ├── pages/
│   │   ├── LevelingModePage.jsx ................ Main feature page
│   │   └── LevelingPreviewPage.jsx ............. Comparison page
│   ├── data/
│   │   └── leveling/
│   │       ├── acts123-data.js ................. Acts 1-3 data
│   │       ├── acts456-data.js ................. Acts 4-6 (placeholder)
│   │       ├── acts789-data.js ................. Acts 7-9 (placeholder)
│   │       └── act10-data.js ................... Act 10 (placeholder)
│   └── modules/
│       └── registry.js ......................... Route registration
│
├── scripts/
│   └── leveling-data/
│       ├── parse-exile-leveling.js ............. GitHub parser
│       ├── scrape-poe-leveling.js .............. Web scraper
│       ├── scrape-poe-wiki.js .................. Wiki scraper
│       ├── merge-data-sources.js ............... Data merger
│       ├── generate-mock-data.js ............... Mock generator
│       ├── run-all.js .......................... Master pipeline
│       ├── README.md ........................... Scripts docs
│       └── raw/ ................................ Cached data
│
└── docs/
    ├── LEVELING_MODE_PROGRESS.md ............... Progress tracker
    ├── PHASE_3_GUIDE.md ........................ Comparison guide
    └── LEVELING_MODE_README.md (this file) ..... Complete docs
```

---

## 🚀 Usage

### Access Leveling Mode

**Development:**
```bash
npm run dev
# Navigate to: http://localhost:5173/leveling/mode
```

**Production:**
- Navigate to `/leveling/mode`

### Access Preview Page

**Development:**
```bash
npm run dev
# Navigate to: http://localhost:5173/leveling/preview
```

**Production:**
- Navigate to `/leveling/preview`

### Generate Data

**Mock Data (instant):**
```bash
npm run leveling-data:mock
```

**Live Data (10-15 minutes):**
```bash
npm run leveling-data:live
```

---

## 🎨 Design System

### Colors

- **Gold Accent:** `#daa520` (Omnilyth brand)
- **Purple (exile-leveling):** `from-purple-500/20`
- **Blue (poe-leveling):** `from-blue-500/20`
- **Background:** `bg-zinc-900/60` with `backdrop-blur-sm`
- **Border:** `border-white/[0.06]`

### Typography

- **Headings:** `text-zinc-100` with `font-bold`
- **Body:** `text-zinc-400`
- **Muted:** `text-zinc-500` or `text-zinc-600`

### Components

- **Glass Cards:** `bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06]`
- **Buttons:** Hover states with `transition-colors`
- **Checkboxes:** `w-4 h-4 rounded border-2` with accent color on checked

---

## 📊 Performance Metrics

### Bundle Sizes (Current)

| Component | Size | Gzipped |
|-----------|------|---------|
| LevelingModePage | 5.61 KB | 1.52 KB |
| LevelingPreviewPage | 11.28 KB | 2.79 KB |
| ModeToggle | 2.3 KB | - |
| ExileLevelingLayout | 6.0 KB | - |
| PoELevelingLayout | 8.9 KB | - |
| acts123-data | 11 KB | - |

### Expected Final Sizes

| Component | Estimated |
|-----------|-----------|
| Complete Leveling Mode | ~50 KB |
| All Act Data (1-10) | ~100 KB |
| Total Feature | ~150 KB |

All lazy-loaded for optimal performance.

---

## 🔧 Technical Details

### State Management

**LevelingProgressContext:**
```javascript
{
  mode: 'fresh' | 'alt',         // Mode selection
  setMode: (mode) => void,       // Change mode
  progress: { ... },             // Zone completion state
  toggleZone: (act, zone) => void,
  isZoneCompleted: (act, zone) => boolean,
  resetProgress: () => void
}
```

**Storage:**
- `localStorage.getItem('poe-leveling-mode')` - Mode
- `localStorage.getItem('poe-leveling-progress')` - Progress

### Data Schema

**Area Object:**
```javascript
{
  id: 'act1-area-0',
  name: 'Lioneye\'s Watch',
  act: 1,
  level: 1,
  hasWaypoint: true,
  isOptional: false,
  connections: [],
  objectives: [
    { type: 'quest', description: '...', reward: null }
  ],
  tips: [
    { content: '...', category: 'general', freshOnly: false }
  ],
  craftingRecipes: []
}
```

**Quest Object:**
```javascript
{
  id: 'act1-quest-0',
  name: 'Enemy at the Gate',
  act: 1,
  required: true,
  objectives: ['Kill Hillock'],
  rewards: {
    skillPoints: 0,
    passive: false,
    items: []
  },
  zones: []
}
```

**Gem Object:**
```javascript
{
  id: 'gem-0',
  name: 'Cleave',
  level: 1,
  act: 1,
  source: 'vendor',
  classes: ['Marauder', 'Duelist', 'Templar'],
  color: 'str',
  questRewards: { Marauder: true, ... },
  vendorAvailability: { Marauder: true, ... }
}
```

---

## 📖 Data Sources & Attribution

### Sources

1. **exile-leveling** by HeartofPhos
   - Repository: https://github.com/HeartofPhos/exile-leveling
   - Data: Structured areas, quests, gems
   - License: Check repository

2. **poe-leveling.com**
   - URL: https://www.poe-leveling.com
   - Data: Leveling guides and tips
   - Usage: Educational/personal

3. **Path of Exile Wiki**
   - URL: https://www.poewiki.net
   - Data: Gem vendor availability
   - License: CC BY-NC-SA 3.0

### Attribution

All data files include:
```javascript
credits: {
  sources: [
    { name: 'exile-leveling', author: 'HeartofPhos', url: '...' },
    { name: 'poe-leveling.com', url: '...' },
    { name: 'Path of Exile Wiki', license: 'CC BY-NC-SA 3.0', url: '...' }
  ],
  generatedAt: '2026-02-19T...',
  disclaimer: 'Data compiled for educational purposes. Please support the original sources.'
}
```

**UI Attribution (Phase 4):**
- CreditsFooter component with links
- "Data sources" disclosure
- Proper license acknowledgments

---

## 🧪 Testing

### Manual Testing Checklist

**Phase 1 (Infrastructure):**
- [ ] Navigate to `/leveling/mode`
- [ ] Toggle between Fresh Start and Alt Character
- [ ] Verify mode persists on page reload
- [ ] Test reset progress button
- [ ] Check quick links work

**Phase 2 (Data):**
- [ ] Run `npm run leveling-data:mock`
- [ ] Verify files created in `src/data/leveling/`
- [ ] Check data structure is valid
- [ ] Verify credits are included

**Phase 3 (Comparison):**
- [ ] Navigate to `/leveling/preview`
- [ ] Toggle between exile-leveling and poe-leveling styles
- [ ] Test side-by-side comparison (desktop)
- [ ] Check/uncheck objectives (exile style)
- [ ] Expand/collapse zones (poe style)
- [ ] Mark zones complete (poe style)
- [ ] Verify both use same data

---

## 🚦 Next Steps

### Immediate (Phase 3 Decision)

1. **Test both layouts at `/leveling/preview`**
2. **Decide which style to use:**
   - exile-leveling (structured, efficient)
   - poe-leveling (narrative, guided)
   - Hybrid (best of both)
3. **Review `PHASE_3_GUIDE.md` for decision matrix**

### Short-term (Phase 4)

1. Design unique Omnilyth-themed layout
2. Build ActNavigation component
3. Create ZoneCard with checkboxes
4. Implement TipSection (mode-filtered)
5. Add RecipeSection (Fresh only)
6. Build CreditsFooter

### Long-term (Phases 5-6)

1. Add GemProgressionPanel
2. Build ProgressStats
3. Mobile optimization
4. Performance tuning
5. Integration with existing tools
6. Full Act 1-10 data collection

---

## 📝 Known Issues

### Current Limitations

1. **Mock Data Only:** Only Act 1 has real data
2. **No Persistence:** Preview page doesn't save progress
3. **Desktop-focused:** Mobile UX needs work in Phase 6
4. **Placeholder Routes:** Acts 4-10 data not yet collected

### Future Improvements

1. **Real Data:** Scrape full Acts 1-10 from sources
2. **Community Tips:** Allow user-submitted racing tips
3. **Build Integration:** Link to PoB import
4. **Video Integration:** AI-processed racing tips from videos
5. **Ascendancy Tracking:** Lab trials and ascendancy choices
6. **Pantheon Guide:** Pantheon unlock recommendations

---

## 🤝 Contributing

### Adding New Features

1. Check existing phases in `LEVELING_MODE_PROGRESS.md`
2. Follow established patterns (glass cards, lazy loading)
3. Use LevelingProgressContext for state
4. Maintain data source attribution
5. Test on both desktop and mobile

### Updating Data

```bash
# Generate fresh mock data
npm run leveling-data:mock

# Or scrape live data (respects rate limits)
npm run leveling-data:live

# Individual steps
npm run leveling-data:parse      # GitHub only
npm run leveling-data:scrape-poe # poe-leveling.com
npm run leveling-data:scrape-wiki # PoE Wiki
npm run leveling-data:merge      # Combine sources
```

---

## 📞 Support & Documentation

### Documentation Files

- **LEVELING_MODE_PROGRESS.md** - Progress tracker
- **PHASE_3_GUIDE.md** - Comparison guide
- **LEVELING_MODE_README.md** (this file) - Complete docs
- **scripts/leveling-data/README.md** - Data pipeline docs
- **CLAUDE.md** - Project context

### Key Concepts

- **Fresh Mode:** Shows vendor recipes, all tips (new league)
- **Alt Mode:** Hides recipes, streamlined tips (speed leveling)
- **Acts 1-10:** Campaign progression structure
- **Waypoints:** Fast travel points in zones
- **Quest Rewards:** Passive points and skill gems
- **Vendor Recipes:** Crafting at vendors

---

## 📅 Timeline

| Phase | Duration | Status | Completion |
|-------|----------|--------|------------|
| Phase 1: Infrastructure | ~1 hour | ✅ | 100% |
| Phase 2: Data Collection | ~2 hours | ✅ | 100% |
| Phase 3: Comparison Page | ~2 hours | ✅ | 100% |
| **Phase 4: Core UI** | 4-5 days | 🚧 | 0% |
| Phase 5: Enhanced Features | 3-4 days | 📋 | 0% |
| Phase 6: Polish & Mobile | 2-3 days | 📋 | 0% |

**Total Estimated:** ~10-14 days from Phase 4 start
**Current Status:** Phase 3 complete, awaiting user decision

---

## ✅ Success Criteria

Feature is complete when:

1. ✅ Mode toggle works (Fresh/Alt)
2. ✅ Progress persists across sessions
3. ✅ Data pipeline functional
4. ✅ Comparison page built
5. ⏳ Layout decision made
6. ⏳ Production UI built
7. ⏳ All Acts 1-10 have data
8. ⏳ Mobile-responsive
9. ⏳ Proper attribution displayed
10. ⏳ Integration with existing tools

**Current:** 4/10 criteria met

---

**Last Updated:** 2026-02-19
**Version:** 0.3.0 (Phase 3 Complete)
**Status:** Ready for Layout Decision → Phase 4
