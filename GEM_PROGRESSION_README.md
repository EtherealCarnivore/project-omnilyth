# Gem Progression System

**Complete gem unlock tracking and browser for Path of Exile leveling**

## 📋 Overview

The Gem Progression System helps players find and track gem availability throughout their leveling journey in Path of Exile. It provides comprehensive information about quest rewards, special vendors (Siosa, Lilly Roth), and class-specific gem access.

### Key Features

- **335 Unique Gems** - Complete gem database with icons from web.poecdn.com
- **Class Filtering** - Filter by character class (Witch, Shadow, Ranger, Duelist, Marauder, Templar, Scion)
- **Act-by-Act Unlocks** - See which gems become available in each act (1-10)
- **Special Vendors** - Information about Siosa (Act 3) and Lilly Roth (Act 6)
- **Alt Character Mode** - Simplified view for experienced players with all gems unlocked
- **Advanced Search** - Fuzzy search with real-time filtering
- **Multiple View Modes** - Grid, list, and compact views
- **Keyboard Shortcuts** - Ctrl+G for quick search access
- **Mobile Optimized** - Floating Action Button and responsive layouts
- **Accessibility** - WCAG AA compliant with proper ARIA labels

---

## 🗂️ Components

### Pages

#### `/leveling/preview` - LevelingPreviewPage
Preview page showcasing gem progression features:
- Act selector (1-10)
- Class filtering
- Per-act gem unlocks
- Special vendor banners (Acts 3 & 6)
- Sidebar with gem progression panel
- View mode toggle (full/compact)

#### `/leveling/gems` - LevelingGemsPage
Full-featured gem browser with advanced filtering:
- Search bar with real-time filtering
- Filter sidebar (type, act, source)
- Sort options (name, act, type)
- View toggle (grid/list)
- Results count
- Mobile FAB for quick access

### Core Components

#### `ClassSelector.jsx`
Dropdown for character class selection:
- 7 character classes + "All Classes" option
- Persisted to localStorage
- Integrated with LevelingModeContext

#### `AvailabilityBadge.jsx`
Visual indicator for gem availability:
- Color-coded by source (green=quest, yellow=vendor, purple=special)
- Compact and full modes
- Accessibility tooltips

#### `QuickSearchModal.jsx`
Fast gem search overlay:
- Fuzzy search (Fuse.js)
- Top 10 results
- Keyboard navigation (Escape to close)
- Auto-focus input
- Sort by earliest availability

#### `GemDetailModal.jsx`
Detailed gem information modal:
- All availability sources
- Quest details by class
- Special vendor info (Siosa, Lilly Roth)
- External links (PoE Wiki, Trade Search)
- Alt character mode banner

#### `GemProgressionPanel.jsx`
Sidebar panel for gem tracking:
- Quick search button
- Current act unlocks (max 6)
- Next act preview (max 6)
- Collapsible sections
- Link to full gem browser

#### `GemUnlocksSection.jsx`
Displays gems available in specific act:
- Full mode (detailed list)
- Compact mode (icon grid)
- Gem count badge for headers

#### `SiosaUnlockBanner.jsx` & `LillyRothUnlockBanner.jsx`
Info banners for special vendors:
- Quest requirements
- Benefits explanation
- Important warnings
- External wiki links

#### `FilterSidebar.jsx`
Advanced filtering panel:
- Type filter (Active/Support)
- Act filter (1-10)
- Source filter (Quest/Siosa/Lilly)
- Reset all button
- Current class indicator

#### `GemGridView.jsx` & `GemListView.jsx`
Display modes for gem browser:
- Grid: Compact cards with hover details
- List: Detailed rows with full info
- Empty state handling
- Availability indicators

#### `FloatingSearchButton.jsx`
Mobile-optimized Floating Action Button:
- Fixed bottom-right position
- Hidden on desktop (sidebar available)
- Ripple effect on click
- Keyboard hint badge (desktop)

### Hooks

#### `useGemSearch.js`
Custom hook for gem searching:
- Fuzzy matching with Fuse.js
- Class filtering
- Sort options (relevance, name, act)
- Helper functions:
  - `getGemAvailabilityForClass` - Filter by class
  - `getBestAvailability` - Get primary source
  - `getGemsForAct` - Get all gems for act

#### `useKeyboardShortcut.js`
Custom hook for global keyboard shortcuts:
- Modifier key support (Ctrl, Cmd, Shift, Alt)
- Preset hooks: `useGlobalSearch`, `useEscapeKey`, `useCommandPalette`, `useSlashSearch`
- Input field detection

### Context

#### `LevelingModeContext.jsx`
Global state management:
- `selectedClass` - Current character class
- `mode` - Fresh start vs alt character
- `currentAct` - Current act (1-10)
- All states persisted to localStorage

---

## 📊 Data Structure

### Gem Availability Data
Located: `src/data/leveling/gemAvailability.js`

```javascript
{
  "Arc": {
    "gemId": "arc",
    "name": "Arc",
    "icon": "https://web.poecdn.com/.../Arc.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "classes": ["Witch"]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  }
}
```

### Source Types

- **quest** - Quest reward (class-specific or all classes)
- **siosa** - Siosa vendor (Act 3 Library, requires "A Fixture of Fate")
- **lilly** - Lilly Roth (Act 6 Lioneye's Watch, requires "Fallen from Grace")

### Empty Classes Array

`classes: []` means available for all classes.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+G` (or `Cmd+G`) | Open quick search modal (Preview page) |
| `Ctrl+G` (or `Cmd+G`) | Focus search input (Gems page) |
| `Escape` | Close modals |

---

## 📱 Mobile Features

- **Floating Action Button** - Quick access to gem search
- **Responsive Layouts** - Sidebar → stacked layout
- **Touch Optimized** - Proper tap targets (min 44x44px)
- **Collapsible Sections** - Space-efficient on small screens
- **Smooth Scrolling** - FAB scrolls to top on tap

---

## ♿ Accessibility

- **ARIA Labels** - All interactive elements labeled
- **Keyboard Navigation** - Full keyboard support
- **Color Contrast** - WCAG AA compliant ratios
- **Focus Indicators** - Visible focus states
- **Screen Reader Support** - Semantic HTML and roles
- **Skip Links** - Quick navigation for screen readers

---

## 🎨 Design Patterns

### Color Coding

- **Green** (`green-500`) - Quest rewards
- **Yellow** (`yellow-500`) - Regular vendors
- **Purple** (`purple-500`) - Special vendors (Siosa, Lilly)
- **Amber** (`amber-500`) - Active skills
- **Blue** (`blue-500`) - Support gems
- **Red** (`red-500`) - Not available

### Glass Morphism

- `bg-zinc-900/60` - Semi-transparent backgrounds
- `backdrop-blur-sm` - Blur effect
- `border-white/[0.08]` - Subtle borders

### Hover States

- Border color change
- Scale transform (1.05)
- Text color transition
- Shadow elevation

---

## 🚀 Performance

### Optimizations

- **Lazy Loading** - Pages loaded on demand (React.lazy)
- **Code Splitting** - Separate bundles for each page
- **Memoization** - useMemo for expensive computations
- **Debounced Search** - Search triggers after typing stops
- **Image Lazy Loading** - `loading="lazy"` on gem icons
- **CDN Icons** - No local image storage, use web.poecdn.com

### Bundle Sizes

- **gemAvailability.js** - 256KB (335 gems)
- **FilterSidebar** - ~8KB
- **GemDetailModal** - ~12KB
- **QuickSearchModal** - ~10KB

---

## 📖 Usage Examples

### Basic Class Filtering

```jsx
import ClassSelector from '../components/leveling/ClassSelector';
import { useLevelingMode } from '../contexts/LevelingModeContext';

function MyComponent() {
  const { selectedClass } = useLevelingMode();

  return (
    <>
      <ClassSelector />
      <p>Selected: {selectedClass}</p>
    </>
  );
}
```

### Gem Search

```jsx
import { useGemSearch } from '../hooks/useGemSearch';

function SearchComponent() {
  const { results, hasResults } = useGemSearch('arc', 'witch', {
    limit: 10,
    sortBy: 'act'
  });

  return (
    <ul>
      {results.map(gem => (
        <li key={gem.gemId}>{gem.name}</li>
      ))}
    </ul>
  );
}
```

### Keyboard Shortcut

```jsx
import { useGlobalSearch } from '../hooks/useKeyboardShortcut';

function MyPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useGlobalSearch(() => {
    setIsSearchOpen(true);
  });

  return <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />;
}
```

---

## 🧪 Testing

### Component Tests (TODO)

- ClassSelector dropdown behavior
- AvailabilityBadge color coding
- GemSearch fuzzy matching
- FilterSidebar filter combinations
- Modal keyboard interactions

### Integration Tests (TODO)

- End-to-end gem search flow
- Class filtering across components
- Act navigation updates
- Mobile FAB interactions

---

## 🔧 Development

### Adding New Gems

1. Update `scripts/leveling-data/raw/quest-rewards-complete.json`
2. Run `node scripts/leveling-data/transform-gem-data.js`
3. Verify generated `src/data/leveling/gemAvailability.js`

### Adding New Components

1. Create component in `src/components/leveling/`
2. Follow existing naming conventions
3. Include JSDoc comment header
4. Export default function
5. Use TypeScript-style prop destructuring
6. Add accessibility attributes

### Code Style

```jsx
/**
 * ComponentName
 * Brief description
 * Key features
 */

export default function ComponentName({ prop1, prop2, className = '' }) {
  // State
  const [state, setState] = useState(null);

  // Hooks
  useEffect(() => {
    // Effect logic
  }, []);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  return (
    <div className={`base-classes ${className}`}>
      {/* Content */}
    </div>
  );
}
```

---

## 📦 File Structure

```
src/
├── components/
│   └── leveling/
│       ├── AvailabilityBadge.jsx
│       ├── ClassSelector.jsx
│       ├── FilterSidebar.jsx
│       ├── FloatingSearchButton.jsx
│       ├── GemDetailModal.jsx
│       ├── GemGridView.jsx
│       ├── GemListView.jsx
│       ├── GemProgressionPanel.jsx
│       ├── GemUnlocksSection.jsx
│       ├── LillyRothUnlockBanner.jsx
│       ├── QuickSearchModal.jsx
│       └── SiosaUnlockBanner.jsx
├── contexts/
│   └── LevelingModeContext.jsx
├── data/
│   └── leveling/
│       └── gemAvailability.js (256KB, 335 gems)
├── hooks/
│   ├── useGemSearch.js
│   └── useKeyboardShortcut.js
├── pages/
│   ├── LevelingGemsPage.jsx
│   └── LevelingPreviewPage.jsx
└── scripts/
    └── leveling-data/
        ├── scrape-gem-rewards.js
        ├── transform-gem-data.js
        └── raw/
            └── quest-rewards-complete.json
```

---

## 🌐 Data Sources

- **Quest Rewards** - [PoE Wiki: Quest Rewards](https://www.poewiki.net/wiki/Quest_Rewards)
- **Gem Icons** - [web.poecdn.com](https://web.poecdn.com)
- **Siosa Info** - [PoE Wiki: Siosa](https://www.poewiki.net/wiki/Siosa)
- **Lilly Roth Info** - [PoE Wiki: Lilly Roth](https://www.poewiki.net/wiki/Lilly_Roth)

---

## 🎯 Future Enhancements

### High Priority

- [ ] Mobile filter modal (currently shows alert)
- [ ] Component tests (Jest + React Testing Library)
- [ ] Performance profiling and optimization
- [ ] Loading states for gem images

### Nice to Have

- [ ] Gem favorites/bookmarks
- [ ] Export gem list to clipboard
- [ ] Integration with build guides
- [ ] Gem level-up tracking
- [ ] Quality gem indicators
- [ ] Awakened gem support
- [ ] Vaal gem variants

### Long Term

- [ ] User accounts (save progress across devices)
- [ ] Community gem recommendations
- [ ] Build-specific gem suggestions
- [ ] API integration for real-time data updates

---

## 📝 Implementation Timeline

- **Phase 1** (2 days) - Data scraping & transformation ✅
- **Phase 2** (3 days) - Core components (ClassSelector, AvailabilityBadge, QuickSearchModal, GemDetailModal, GemProgressionPanel) ✅
- **Phase 3** (2 days) - Per-act integration (GemUnlocksSection, vendor banners, LevelingPreviewPage) ✅
- **Phase 4** (3 days) - Full gem browser (FilterSidebar, GemGridView, GemListView, LevelingGemsPage) ✅
- **Phase 5** (2 days) - Mobile & polish (FAB, keyboard shortcuts, accessibility) ✅

**Total: 12 days** (estimated 2-3 weeks)

---

## 🙏 Credits

- **Data** - Path of Exile Wiki contributors
- **Icons** - Grinding Gear Games (web.poecdn.com)
- **Search** - Fuse.js fuzzy search library
- **Design** - Inspired by PoE leveling guides

---

## 📄 License

Part of Project Omnilyth - See main project LICENSE for details.

---

**Last Updated:** 2026-02-20
**Version:** 1.0.0
**Status:** Production Ready ✅
