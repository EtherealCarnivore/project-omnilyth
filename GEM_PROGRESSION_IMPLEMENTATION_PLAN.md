# Gem Progression System - Implementation Plan

**Feature**: Comprehensive gem acquisition tracking for Path of Exile leveling
**Target Users**: Players leveling characters (fresh league + alt characters)
**Priority**: Phase 4 of Leveling Mode implementation
**Timeline**: 12-16 days (5 phases)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Data Model](#data-model)
4. [Data Sources & Scraping](#data-sources--scraping)
5. [Component Structure](#component-structure)
6. [User Flows](#user-flows)
7. [Implementation Phases](#implementation-phases)
8. [Technical Specifications](#technical-specifications)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Checklist](#deployment-checklist)

---

## Executive Summary

### Problem Statement

Players leveling in Path of Exile need to know:
1. **Which gems are available** for their character class
2. **When gems become available** (which act/quest)
3. **How to obtain gems** (quest reward vs vendor vs special NPCs)
4. **Cross-class gem acquisition** (Siosa, Lilly Roth)

### Solution Overview

**Three-tier hybrid system:**
- **Tier 1**: Quick search modal (Ctrl+G) for instant gem lookup
- **Tier 2**: Per-act gem displays integrated into existing act cards
- **Tier 3**: Full gem browser page (`/leveling/gems`) for build planning

**Key Features:**
- Class-specific gem availability
- Fresh vs Alt character modes
- Siosa (Act 3) and Lilly Roth (Act 6) NPC tracking
- Visual availability indicators (quest, vendor, special unlock)
- Mobile-optimized with floating action button

### Success Metrics

- Gem lookup time < 5 seconds
- Zero "wrong gem" user reports
- 70%+ user engagement with gem system
- 4.5+ satisfaction rating

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Quick Search Modal  │  Per-Act Cards  │  Full Browser Page │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Component Layer                             │
├─────────────────────────────────────────────────────────────┤
│  GemSearch  │  GemGrid  │  GemDetail  │  ClassSelector      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│  gemAvailability.js  │  gemData.js (existing)  │  Storage   │
└─────────────────────────────────────────────────────────────┘
```

### Integration Points

**Existing Systems:**
- `src/data/gemData.js` - 400+ gems with icons from PoE CDN
- `src/layout/LevelingSidebar.jsx` - Sidebar navigation
- `src/pages/LevelingPreviewPage.jsx` - Act-by-act leveling guide
- `src/contexts/LevelingModeContext.jsx` - Mode state (Fresh/Alt)

**New Systems:**
- Gem availability data (quest rewards by class)
- Class selection state management
- Gem search/filter functionality
- Siosa/Lilly Roth unlock tracking

---

## Data Model

### Core Data Structures

#### 1. Gem Availability Schema

```typescript
interface GemAvailability {
  gemId: string;              // Matches gemData.js key
  name: string;               // "Arc", "Determination", etc.
  icon: string;               // URL from gemData.js
  level: number;              // Level requirement
  type: 'active' | 'support'; // Gem type
  tags: string[];             // "Spell", "Lightning", "Aura", etc.

  availability: GemSource[];  // All ways to obtain this gem
}

interface GemSource {
  act: number;                // 1-10
  source: 'quest' | 'vendor' | 'siosa' | 'lilly';
  questName?: string;         // "Enemy at the Gate", "Lost in Love"
  questId?: string;           // For linking to quest details
  classes: string[];          // ["Witch", "Templar"] or [] for all
  notes?: string;             // Optional clarifications
}
```

#### 2. Quest Gem Rewards Schema

```typescript
interface QuestGemReward {
  questId: string;
  questName: string;
  act: number;
  required: boolean;          // Required vs optional quest
  location: string;           // "Lioneye's Watch", "The Library"

  gems: {
    gemId: string;
    classes: string[];        // Which classes get this as reward
  }[];
}
```

#### 3. Special NPC Schema

```typescript
interface SpecialVendor {
  npcId: string;
  name: string;               // "Siosa", "Lilly Roth"
  act: number;
  unlockQuest: string;
  location: string;
  description: string;

  provides: 'cross_class' | 'all_gems';
  restrictions?: string[];    // "Must carry currency", etc.
}
```

### Data File Structure

```
src/data/leveling/
├── gemAvailability.js        # Main gem-quest mapping (NEW)
├── questGemRewards.js        # Quest-centric view (NEW)
├── specialVendors.js         # Siosa, Lilly Roth (NEW)
└── gemProgression.js         # Aggregated exports (NEW)

src/data/
└── gemData.js                # Existing gem list with icons
```

### Example Data

```javascript
// gemAvailability.js
export const gemAvailabilityData = {
  "arc": {
    gemId: "arc",
    name: "Arc",
    icon: "https://web.poecdn.com/gen/image/.../Arc.png",
    level: 12,
    type: "active",
    tags: ["Spell", "Chaining", "Lightning"],
    availability: [
      {
        act: 1,
        source: "quest",
        questName: "Enemy at the Gate",
        questId: "a1q1",
        classes: ["Witch", "Templar"]
      },
      {
        act: 3,
        source: "siosa",
        questName: "A Fixture of Fate",
        classes: [] // All classes
      },
      {
        act: 6,
        source: "lilly",
        questName: "Fallen from Grace",
        classes: []
      }
    ]
  },
  // ... 400+ more gems
};

// specialVendors.js
export const specialVendors = [
  {
    npcId: "siosa",
    name: "Siosa",
    act: 3,
    unlockQuest: "A Fixture of Fate",
    location: "The Library",
    description: "Removes class restrictions for gems you've unlocked via quests",
    provides: "cross_class",
    restrictions: ["Cannot access stash in this zone - carry currency in inventory"]
  },
  {
    npcId: "lilly_roth",
    name: "Lilly Roth",
    act: 6,
    unlockQuest: "Fallen from Grace",
    location: "Lioneye's Watch (Act 6+)",
    description: "Unlocks all gems regardless of class or quest completion",
    provides: "all_gems",
    restrictions: ["All gems start at level 1"]
  }
];
```

---

## Data Sources & Scraping

### Primary Data Source: PoE Wiki

**URL**: https://www.poewiki.net/wiki/Quest_Rewards

**Structure:**
- Tables with class columns (Witch, Shadow, Ranger, Duelist, Marauder, Templar, Scion)
- Rows for each quest
- Cells indicate which gems that class receives

**Scraping Strategy:**

```javascript
// scripts/scrape-gem-rewards.js
async function scrapeQuestRewards() {
  const response = await fetch('https://www.poewiki.net/wiki/Quest_Rewards');
  const html = await response.text();

  // Parse HTML tables
  const $ = cheerio.load(html);

  const quests = [];

  $('table.quest-rewards').each((i, table) => {
    const quest = {
      act: extractActNumber(table),
      name: extractQuestName(table),
      gems: []
    };

    // Parse class columns
    const classes = ['Witch', 'Shadow', 'Ranger', 'Duelist', 'Marauder', 'Templar', 'Scion'];

    $(table).find('tbody tr').each((j, row) => {
      const gemName = $(row).find('td:first').text().trim();
      const classAvailability = {};

      classes.forEach((cls, idx) => {
        const cell = $(row).find(`td:nth-child(${idx + 2})`);
        classAvailability[cls] = cell.hasClass('available'); // or check for checkmark icon
      });

      quest.gems.push({ gemName, classes: classAvailability });
    });

    quests.push(quest);
  });

  return quests;
}
```

### Secondary Source: Siosa & Lilly Roth Pages

**Siosa URL**: https://www.poewiki.net/wiki/Siosa
**Lilly Roth URL**: https://www.poewiki.net/wiki/Lilly_Roth

**Extract:**
- Unlock quest name and act
- Location in world
- Gem access rules
- Special restrictions

### Data Transformation Pipeline

```
1. Scrape Wiki → Raw HTML
2. Parse Tables → Structured JSON
3. Cross-reference gemData.js → Add icons
4. Validate → Check for missing gems
5. Generate gemAvailability.js → Production data
```

**Validation Checks:**
- All gem names from wiki exist in `gemData.js`
- No duplicate quest entries
- All classes covered
- Act numbers valid (1-10)

---

## Component Structure

### Component Hierarchy

```
LevelingSidebar.jsx (EXISTING)
├── ClassSelector (NEW)
│   └── Dropdown: Select character class
├── ModeToggle (EXISTS - update for gems)
│   └── Fresh/Alt character mode
└── GemProgressionPanel (NEW)
    ├── QuickSearchButton
    │   └── Opens QuickSearchModal
    └── NextUnlockPreview
        └── Shows upcoming gem unlocks

QuickSearchModal (NEW)
├── SearchInput (autocomplete)
├── FilterPanel (collapsible)
└── GemResultsList
    └── GemResultCard (multiple)
        └── Opens GemDetailModal

LevelingPreviewPage.jsx (EXISTING - enhanced)
└── ActCard (EXISTING - add gem section)
    └── GemUnlocksSection (NEW)
        ├── QuestGemsCollapsed (3-5 icons + count)
        ├── QuestGemsExpanded (full grid)
        └── SiosaUnlockBanner (Act 3 only)

GemDetailModal (NEW)
├── GemHeader (icon, name, level, type)
├── AvailabilitySection
│   ├── QuestRewardsList (per class)
│   ├── VendorInfo
│   └── SpecialUnlocks (Siosa/Lilly)
└── ExternalLinks (wiki, trade)

LevelingGemsPage (NEW)
├── GemBrowserHeader
│   ├── ClassSelector
│   ├── ModeToggle
│   └── ViewToggle (grid/list)
├── FilterSidebar
│   ├── TypeFilter (active/support)
│   ├── TagFilter (spell, aura, etc.)
│   └── AvailabilityFilter (quest/vendor/special)
└── GemGridView / GemListView
    └── GemCard (multiple)
        └── Opens GemDetailModal
```

### New Components to Create

#### 1. ClassSelector.jsx
```jsx
export default function ClassSelector({ selectedClass, onClassChange }) {
  const classes = [
    { id: 'witch', name: 'Witch', icon: '/icons/witch.png' },
    { id: 'shadow', name: 'Shadow', icon: '/icons/shadow.png' },
    // ... all 7 classes
    { id: 'all', name: 'All Classes', icon: null }
  ];

  return (
    <select value={selectedClass} onChange={(e) => onClassChange(e.target.value)}>
      {classes.map(cls => (
        <option key={cls.id} value={cls.id}>{cls.name}</option>
      ))}
    </select>
  );
}
```

#### 2. GemProgressionPanel.jsx
```jsx
export default function GemProgressionPanel({ selectedClass, mode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const nextUnlocks = getNextGemUnlocks(selectedClass, currentAct);

  return (
    <div className="gem-progression-panel">
      <button onClick={() => setShowSearch(true)}>
        🔍 Search Gems
      </button>

      {!isExpanded && (
        <div className="next-unlock-preview">
          <span>Next Unlock: Act {nextUnlocks.act}</span>
          <div className="gem-icons">
            {nextUnlocks.gems.slice(0, 5).map(gem => (
              <img key={gem.id} src={gem.icon} alt={gem.name} />
            ))}
            {nextUnlocks.gems.length > 5 && <span>+{nextUnlocks.gems.length - 5} more</span>}
          </div>
        </div>
      )}

      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Hide Details' : 'View All Gems'}
      </button>

      {showSearch && <QuickSearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}
```

#### 3. QuickSearchModal.jsx
```jsx
export default function QuickSearchModal({ onClose, selectedClass }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = searchGems(term, selectedClass);
    setResults(filtered.slice(0, 10)); // Limit to 10 results
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Search gems..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
        />

        <div className="results">
          {results.map(gem => (
            <GemResultCard key={gem.id} gem={gem} selectedClass={selectedClass} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 4. GemResultCard.jsx
```jsx
export default function GemResultCard({ gem, selectedClass }) {
  const availability = getGemAvailabilityForClass(gem, selectedClass);

  return (
    <div className="gem-result-card">
      <img src={gem.icon} alt={gem.name} />
      <div className="gem-info">
        <h4>{gem.name}</h4>
        <span className="gem-meta">⚡ {gem.tags.join(' • ')} • Lv{gem.level}</span>
        <AvailabilityBadge availability={availability} />
      </div>
    </div>
  );
}
```

#### 5. AvailabilityBadge.jsx
```jsx
export default function AvailabilityBadge({ availability }) {
  const badge = getBadgeType(availability);

  const badges = {
    quest: { icon: '✅', color: 'green', text: `Act ${availability.act}: ${availability.questName}` },
    vendor: { icon: '🛒', color: 'yellow', text: `Act ${availability.act}: Vendor` },
    siosa: { icon: '🔓', color: 'purple', text: 'Act 3: Siosa' },
    lilly: { icon: '🔓', color: 'purple', text: 'Act 6: Lilly Roth' },
    unavailable: { icon: '🔒', color: 'red', text: 'Not available yet' }
  };

  const { icon, color, text } = badges[badge];

  return (
    <span className={`availability-badge badge-${color}`}>
      {icon} {text}
    </span>
  );
}
```

#### 6. GemDetailModal.jsx
```jsx
export default function GemDetailModal({ gem, selectedClass, onClose }) {
  const availability = gem.availability;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="gem-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gem-header">
          <img src={gem.icon} alt={gem.name} />
          <div>
            <h2>{gem.name}</h2>
            <span>Level {gem.level} • {gem.type} • {gem.tags.join(' • ')}</span>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="availability-section">
          <h3>Availability</h3>

          {/* Quest Rewards */}
          {availability.filter(a => a.source === 'quest').map(source => (
            <div key={source.questId} className="availability-item">
              <AvailabilityBadge availability={source} />
              <div>
                <strong>Quest Reward: {source.questName}</strong>
                <div>Available for: {source.classes.join(', ') || 'All classes'}</div>
              </div>
            </div>
          ))}

          {/* Siosa */}
          {availability.some(a => a.source === 'siosa') && (
            <div className="availability-item">
              <AvailabilityBadge availability={{ source: 'siosa', act: 3 }} />
              <div>
                <strong>Siosa (The Library)</strong>
                <div>Removes class restrictions for completed quests</div>
              </div>
            </div>
          )}

          {/* Lilly Roth */}
          {availability.some(a => a.source === 'lilly') && (
            <div className="availability-item">
              <AvailabilityBadge availability={{ source: 'lilly', act: 6 }} />
              <div>
                <strong>Lilly Roth (Lioneye's Watch)</strong>
                <div>All gems available (start at level 1)</div>
              </div>
            </div>
          )}
        </div>

        <div className="external-links">
          <a href={`https://www.poewiki.net/wiki/${gem.name}`} target="_blank">PoE Wiki</a>
          <a href={`https://www.pathofexile.com/trade/search?q=${gem.name}`} target="_blank">Trade</a>
        </div>
      </div>
    </div>
  );
}
```

#### 7. GemUnlocksSection.jsx (for Act Cards)
```jsx
export default function GemUnlocksSection({ act, selectedClass, mode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const questGems = getGemsForAct(act, selectedClass, 'quest');
  const siosaGems = act === 3 ? getGemsForAct(3, selectedClass, 'siosa') : [];

  if (mode === 'alt') {
    return (
      <div className="gems-alt-mode">
        <span>✅ All gems available at vendors from Act {act}</span>
      </div>
    );
  }

  return (
    <div className="gem-unlocks-section">
      {/* Siosa Banner (Act 3 only) */}
      {act === 3 && (
        <div className="siosa-banner">
          <strong>🔓 Siosa Quest (A Fixture of Fate)</strong>
          <div className="gem-icons">
            {siosaGems.slice(0, 5).map(gem => (
              <img key={gem.id} src={gem.icon} alt={gem.name} title={gem.name} />
            ))}
            {siosaGems.length > 5 && <span>+{siosaGems.length - 5} more</span>}
          </div>
        </div>
      )}

      {/* Quest Rewards */}
      <div className="quest-gems">
        <strong>🎁 Quest Rewards ({questGems.length})</strong>
        {!isExpanded && (
          <div className="gem-icons-preview">
            {questGems.slice(0, 5).map(gem => (
              <img key={gem.id} src={gem.icon} alt={gem.name} title={gem.name} />
            ))}
            {questGems.length > 5 && <span>+{questGems.length - 5} more</span>}
          </div>
        )}
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="gem-grid">
          {questGems.map(gem => (
            <div key={gem.id} className="gem-card" onClick={() => openGemDetail(gem)}>
              <img src={gem.icon} alt={gem.name} />
              <span>{gem.name}</span>
              <AvailabilityBadge availability={gem.availability[0]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## User Flows

### Flow 1: Fresh Character - Shadow Looking for Arc

**Scenario**: Shadow player wants to get Arc (Witch/Templar quest reward only)

```
1. User clicks 🔍 button in sidebar (or presses Ctrl+G)
   → QuickSearchModal opens

2. Types "arc" in search input
   → Autocomplete shows "Arc" as first result

3. Sees gem card:
   [Arc Icon] Arc
   ⚡ Lightning Spell • Lv 12
   🔓 Act 3: Siosa (not class reward)

4. Clicks on Arc card
   → GemDetailModal opens

5. Reads availability:
   - ✅ Witch/Templar: Act 1 (Enemy at the Gate)
   - 🔓 Shadow: Act 3 (Siosa - A Fixture of Fate)
   - 🔓 All: Act 6 (Lilly Roth)

6. Notes: "Get Arc from Siosa in Act 3"
   → Closes modal, continues leveling

RESULT: User found answer in ~10 seconds, 3 clicks
```

### Flow 2: Alt Character (Fast Mode)

**Scenario**: Player leveling 2nd character, wants to know when gems are available

```
1. User opens Leveling Mode
   → Sidebar shows class selector + mode toggle

2. Selects "Alt Character" mode
   → Banner appears: "✅ All gems unlocked (alt character)"
   → Per-act gem sections simplify to: "Available from Act X onwards"

3. User searches for "Determination"
   → Result shows: "🛒 Act 3: Any vendor (all gems unlocked)"

4. User happy - no need to track quests
   → Focuses on racing through acts

RESULT: Simplified experience for experienced players
```

### Flow 3: Build Planning - When Can I Get Determination?

**Scenario**: Player in Act 2, planning build, needs Determination aura

```
1. User scrolling through Leveling Preview page
   → Act 2 card visible

2. Sees Act 3 card preview:
   "🎁 Quest Rewards (Lost in Love)
    [Determination][Vitality][Purity] ✅ Available"

3. Clicks "Expand" on gem section
   → Full grid shows Determination with green badge

4. Hovers over Determination
   → Tooltip: "Lost in Love quest, available for Shadow"

5. Notes: "Pick up Determination in Act 3"
   → Continues reading guide

ALTERNATIVE FLOW:
1. User presses Ctrl+G
2. Types "deter"
3. Sees: "✅ Act 3: Lost in Love (all classes)"
4. Done

RESULT: Natural discovery while browsing OR instant search
```

### Flow 4: Siosa Unlock Guidance

**Scenario**: Player reaches Act 3, sees Siosa mentioned

```
1. User reaches Act 3 in leveling guide
   → Act card shows Siosa banner:
   "🔓 Siosa Quest (A Fixture of Fate)
    Unlocks: [Arc][Clarity][+23 more]"

2. User clicks "What's Siosa?" info icon
   → Tooltip/modal explains:
   "Siosa removes class restrictions for gems you've unlocked.
    Complete 'A Fixture of Fate' quest in The Library."

3. User understands value
   → Decides whether to complete optional quest

4. If completed:
   → Siosa gems now show 🔓 badge instead of 🔒
   → Can purchase previously unavailable gems

RESULT: Clear explanation of optional content value
```

---

## Implementation Phases

### Phase 1: Data Scraping & Preparation (2-3 days)

**Goals:**
- Scrape complete gem reward data from wiki
- Transform into production-ready JSON
- Validate data integrity

**Tasks:**
1. ✅ Create `scripts/scrape-gem-rewards.js`
   - Scrape quest rewards wiki page
   - Parse HTML tables by class
   - Extract gem-quest-class mappings

2. ✅ Create `scripts/scrape-special-vendors.js`
   - Scrape Siosa page
   - Scrape Lilly Roth page
   - Document unlock conditions

3. ✅ Create `scripts/transform-gem-data.js`
   - Cross-reference with `gemData.js` (add icons)
   - Generate `gemAvailability.js`
   - Generate `questGemRewards.js`
   - Generate `specialVendors.js`

4. ✅ Validate data
   - All gems from wiki exist in `gemData.js`
   - No missing quests or classes
   - Act numbers valid (1-10)

**Deliverables:**
- `src/data/leveling/gemAvailability.js` (400+ gems)
- `src/data/leveling/questGemRewards.js` (40+ quests)
- `src/data/leveling/specialVendors.js` (2 NPCs)
- `src/data/leveling/gemProgression.js` (aggregated exports)

**Acceptance Criteria:**
- Data complete for all 7 classes
- All gems have icons from `gemData.js`
- Zero validation errors
- Data structure matches TypeScript interfaces

---

### Phase 2: Core Components (3-4 days)

**Goals:**
- Build reusable gem UI components
- Implement search/filter logic
- Create modal overlays

**Tasks:**

**Day 1: Foundation**
1. ✅ Create `ClassSelector.jsx`
   - Dropdown with 7 classes + "All Classes"
   - Store selection in localStorage
   - Emit onChange event

2. ✅ Update `LevelingModeContext.jsx`
   - Add `selectedClass` state
   - Add `gemMode` state ('fresh' | 'alt')
   - Provide getters/setters

3. ✅ Create `useGemSearch.js` hook
   - Fuzzy search logic (Fuse.js)
   - Filter by class, act, availability
   - Return sorted results

**Day 2: Search Components**
4. ✅ Create `QuickSearchModal.jsx`
   - Modal overlay with search input
   - Autocomplete on keystroke
   - Display top 10 results
   - Click outside to close

5. ✅ Create `GemResultCard.jsx`
   - Display gem icon, name, level
   - Show availability badge
   - Click to open detail modal

6. ✅ Create `AvailabilityBadge.jsx`
   - Color-coded badges (green/yellow/purple/red)
   - Icon + text labels
   - Hover tooltip with details

**Day 3: Detail Modal**
7. ✅ Create `GemDetailModal.jsx`
   - Full gem information
   - All availability sources
   - Quest details
   - External links (wiki, trade)

8. ✅ Create `GemProgressionPanel.jsx` (sidebar)
   - Quick search button
   - Next unlock preview (collapsed)
   - Expand to show per-act gems

**Day 4: Polish & Testing**
9. ✅ Keyboard shortcuts
   - `Ctrl+G` opens search
   - `Esc` closes modals
   - Arrow keys navigate results

10. ✅ Component testing
    - Unit tests for search logic
    - Integration tests for modals
    - Visual regression tests

**Deliverables:**
- 8 new React components
- 1 custom hook (`useGemSearch`)
- Context updates
- Component tests (Jest + RTL)

**Acceptance Criteria:**
- Search returns results < 100ms
- Modal keyboard navigation works
- All badges display correctly
- Mobile-responsive (basic)

---

### Phase 3: Per-Act Integration (2-3 days)

**Goals:**
- Add gem displays to existing act cards
- Show Siosa/Lilly banners
- Progressive disclosure (collapse/expand)

**Tasks:**

**Day 1: Act Card Enhancement**
1. ✅ Create `GemUnlocksSection.jsx`
   - Collapsed: 3-5 gem icons + count
   - Expanded: Full grid with names
   - Filter by selected class

2. ✅ Update `LevelingPreviewPage.jsx`
   - Add `<GemUnlocksSection />` to each act card
   - Pass act number, selected class, mode

3. ✅ Create `SiosaUnlockBanner.jsx` (Act 3)
   - Highlighted banner
   - "Complete A Fixture of Fate to unlock Siosa"
   - Preview of available gems

**Day 2: Layout & Styling**
4. ✅ Style gem grids
   - Icon size: 48x48px
   - Hover effects
   - Click to open detail modal

5. ✅ Responsive design
   - Desktop: inline grid
   - Mobile: 3-column grid, smaller icons

6. ✅ Loading states
   - Skeleton placeholders for gem icons
   - Graceful handling of missing images

**Day 3: Alt Character Mode**
7. ✅ Simplify gem displays for alt mode
   - Show "All gems available from Act X"
   - Hide quest-specific details
   - Faster UI for experienced players

8. ✅ Mode toggle in sidebar
   - Prominent position below class selector
   - Persisted in localStorage

**Deliverables:**
- `GemUnlocksSection.jsx` component
- `SiosaUnlockBanner.jsx` component
- Updated `LevelingPreviewPage.jsx`
- Responsive CSS

**Acceptance Criteria:**
- Gems display in all act cards (1-10)
- Siosa banner only in Act 3
- Lilly Roth note in Act 6
- Alt mode simplifies correctly
- Mobile layout usable

---

### Phase 4: Full Gem Browser Page (2-3 days)

**Goals:**
- Build dedicated `/leveling/gems` page
- Advanced filters and sorting
- Grid/list view toggle

**Tasks:**

**Day 1: Page Structure**
1. ✅ Create `LevelingGemsPage.jsx`
   - Route: `/leveling/gems`
   - Full-page layout
   - Header with filters

2. ✅ Create `GemBrowserHeader.jsx`
   - Class selector
   - Mode toggle
   - View toggle (grid/list)
   - Sort dropdown (name, level, act)

3. ✅ Create `FilterSidebar.jsx`
   - Type filter (active/support)
   - Tag filter (spell, attack, aura, etc.)
   - Availability filter (quest/vendor/special)
   - Act range slider

**Day 2: Grid & List Views**
4. ✅ Create `GemGridView.jsx`
   - Masonry grid layout
   - Gem cards with icons
   - Hover for quick info

5. ✅ Create `GemListView.jsx`
   - Table layout
   - Columns: Icon, Name, Level, Type, Availability
   - Sortable columns

6. ✅ Create `GemCard.jsx` (for grid)
   - Larger than result cards
   - Shows all tags
   - Click to open detail modal

**Day 3: Filtering Logic**
7. ✅ Implement filter combinations
   - Multiple filters AND together
   - Real-time updates (debounced)
   - URL state sync (shareable links)

8. ✅ Add pagination
   - 50 gems per page
   - Infinite scroll (optional)
   - "Load more" button

**Deliverables:**
- `LevelingGemsPage.jsx` with full browser
- `FilterSidebar.jsx` with all filter types
- Grid and list view components
- URL state management

**Acceptance Criteria:**
- All 400+ gems browsable
- Filters work in combination
- Grid/list toggle instant
- Shareable URLs work
- Performance <200ms for filter changes

---

### Phase 5: Mobile & Polish (2-3 days)

**Goals:**
- Optimize for mobile devices
- Add keyboard shortcuts
- Accessibility improvements
- Performance optimization

**Tasks:**

**Day 1: Mobile Optimization**
1. ✅ Floating Action Button (FAB)
   - Bottom-right corner
   - Opens search modal
   - Always visible

2. ✅ Mobile modal layouts
   - Full-screen modals on small screens
   - Touch-friendly hit targets (48px min)
   - Swipe-to-close gesture

3. ✅ Responsive gem grids
   - 2 columns on mobile
   - 4 columns on tablet
   - 6 columns on desktop

**Day 2: Accessibility**
4. ✅ Keyboard navigation
   - Tab through all interactive elements
   - Enter to open modals
   - Arrow keys in lists
   - Focus indicators visible

5. ✅ Screen reader support
   - ARIA labels on all icons
   - role="dialog" on modals
   - Semantic HTML

6. ✅ Color contrast
   - All badges meet WCAG AA (4.5:1)
   - Test with contrast checker
   - Provide high-contrast mode option

**Day 3: Performance & Polish**
7. ✅ Code splitting
   - Lazy load gem browser page
   - Lazy load gem detail modal
   - Reduce initial bundle size

8. ✅ Image optimization
   - Lazy load gem icons
   - Use srcset for retina
   - Fallback for broken images

9. ✅ Animation polish
   - Smooth modal transitions
   - Loading skeletons
   - Micro-interactions (hover, focus)

10. ✅ Error states
    - No results found
    - API failure handling
    - Graceful degradation

**Deliverables:**
- Mobile-optimized UI
- Keyboard shortcuts documentation
- WCAG AA compliance
- Performance metrics report

**Acceptance Criteria:**
- Mobile usable with one hand
- Lighthouse Accessibility score >95
- Bundle size increase <100KB
- No layout shift (CLS <0.1)
- Keyboard users can access all features

---

## Technical Specifications

### Search Algorithm

**Fuzzy Search with Fuse.js:**

```javascript
import Fuse from 'fuse.js';

const fuseOptions = {
  keys: ['name', 'tags'],
  threshold: 0.3, // 0 = exact match, 1 = match anything
  ignoreLocation: true,
  minMatchCharLength: 2
};

function searchGems(query, selectedClass, gems) {
  const fuse = new Fuse(gems, fuseOptions);
  const results = fuse.search(query);

  // Filter by class availability
  const filtered = results
    .map(r => r.item)
    .filter(gem => isGemAvailableForClass(gem, selectedClass));

  // Sort by relevance, then by act availability
  return filtered.sort((a, b) => {
    const actA = getEarliestAct(a, selectedClass);
    const actB = getEarliestAct(b, selectedClass);
    return actA - actB;
  });
}
```

### Availability Logic

**Determine gem availability for class:**

```javascript
function isGemAvailableForClass(gem, selectedClass) {
  // "All Classes" mode shows everything
  if (selectedClass === 'all') return true;

  // Check if any availability source includes this class
  return gem.availability.some(source => {
    // Empty classes array = available to all
    if (source.classes.length === 0) return true;

    // Check if class is in list
    return source.classes.includes(selectedClass);
  });
}

function getEarliestAct(gem, selectedClass) {
  const available = gem.availability.filter(source =>
    source.classes.length === 0 || source.classes.includes(selectedClass)
  );

  if (available.length === 0) return Infinity;

  return Math.min(...available.map(a => a.act));
}

function getBestAvailability(gem, selectedClass) {
  const sources = gem.availability;

  // Priority: quest > vendor > siosa > lilly
  const quest = sources.find(s =>
    s.source === 'quest' &&
    (s.classes.length === 0 || s.classes.includes(selectedClass))
  );
  if (quest) return quest;

  const vendor = sources.find(s => s.source === 'vendor');
  if (vendor) return vendor;

  const siosa = sources.find(s => s.source === 'siosa');
  if (siosa) return siosa;

  const lilly = sources.find(s => s.source === 'lilly');
  return lilly;
}
```

### State Management

**LevelingModeContext Enhancement:**

```javascript
// src/contexts/LevelingModeContext.jsx
export const LevelingModeContext = createContext();

export function LevelingModeProvider({ children }) {
  // Existing state
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('omnilyth_leveling_mode') || 'fresh';
    } catch {
      return 'fresh';
    }
  });

  // NEW: Selected class
  const [selectedClass, setSelectedClass] = useState(() => {
    try {
      return localStorage.getItem('omnilyth_selected_class') || 'all';
    } catch {
      return 'all';
    }
  });

  // NEW: Current act (for "next unlock" feature)
  const [currentAct, setCurrentAct] = useState(() => {
    try {
      return parseInt(localStorage.getItem('omnilyth_current_act') || '1');
    } catch {
      return 1;
    }
  });

  // Persist selected class
  useEffect(() => {
    localStorage.setItem('omnilyth_selected_class', selectedClass);
  }, [selectedClass]);

  // Persist current act
  useEffect(() => {
    localStorage.setItem('omnilyth_current_act', currentAct.toString());
  }, [currentAct]);

  const value = {
    mode,
    setMode,
    selectedClass,
    setSelectedClass,
    currentAct,
    setCurrentAct
  };

  return (
    <LevelingModeContext.Provider value={value}>
      {children}
    </LevelingModeContext.Provider>
  );
}

export function useLevelingMode() {
  return useContext(LevelingModeContext);
}
```

### Performance Optimization

**Code Splitting:**

```javascript
// App.jsx
const LevelingGemsPage = lazy(() => import('./pages/LevelingGemsPage'));

// Route
<Route path="/leveling/gems" element={
  <Suspense fallback={<LoadingSpinner />}>
    <LevelingGemsPage />
  </Suspense>
} />
```

**Memoization:**

```javascript
// GemGridView.jsx
import { memo } from 'react';

const GemCard = memo(({ gem, onClick }) => {
  return (
    <div className="gem-card" onClick={() => onClick(gem)}>
      <img src={gem.icon} alt={gem.name} loading="lazy" />
      <span>{gem.name}</span>
    </div>
  );
});
```

**Virtual Scrolling (for large lists):**

```javascript
// Optional: Use react-window for 400+ gem list
import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={6}
  columnWidth={120}
  height={600}
  rowCount={Math.ceil(gems.length / 6)}
  rowHeight={150}
  width={800}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 6 + columnIndex;
    const gem = gems[index];
    return gem ? <GemCard gem={gem} style={style} /> : null;
  }}
</FixedSizeGrid>
```

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Test Files:**

```
src/data/leveling/__tests__/
├── gemAvailability.test.js
├── questGemRewards.test.js
└── gemProgression.test.js

src/components/leveling/__tests__/
├── ClassSelector.test.jsx
├── QuickSearchModal.test.jsx
├── GemResultCard.test.jsx
├── AvailabilityBadge.test.jsx
├── GemDetailModal.test.jsx
└── GemProgressionPanel.test.jsx

src/hooks/__tests__/
└── useGemSearch.test.js
```

**Example Test: GemResultCard**

```javascript
import { render, screen } from '@testing-library/react';
import GemResultCard from '../GemResultCard';

describe('GemResultCard', () => {
  const mockGem = {
    id: 'arc',
    name: 'Arc',
    icon: 'https://web.poecdn.com/.../Arc.png',
    level: 12,
    type: 'active',
    tags: ['Spell', 'Lightning'],
    availability: [
      { act: 1, source: 'quest', classes: ['Witch', 'Templar'] }
    ]
  };

  it('renders gem name and icon', () => {
    render(<GemResultCard gem={mockGem} selectedClass="witch" />);

    expect(screen.getByText('Arc')).toBeInTheDocument();
    expect(screen.getByAltText('Arc')).toHaveAttribute('src', mockGem.icon);
  });

  it('shows quest reward badge for valid class', () => {
    render(<GemResultCard gem={mockGem} selectedClass="witch" />);

    expect(screen.getByText(/Act 1:/)).toBeInTheDocument();
  });

  it('shows Siosa badge for invalid class', () => {
    render(<GemResultCard gem={mockGem} selectedClass="shadow" />);

    expect(screen.getByText(/Siosa/)).toBeInTheDocument();
  });
});
```

### Integration Tests

**Test Scenarios:**

1. **Search Flow**: Type query → See results → Click gem → View details
2. **Class Filter**: Change class → Results update → Badges change
3. **Mode Toggle**: Switch to Alt → UI simplifies → Switch back
4. **Per-Act Display**: Navigate acts → Gems appear → Expand works
5. **Modal Flow**: Open search → Search gem → Open detail → Close all

**Example E2E Test (Cypress):**

```javascript
describe('Gem Search Flow', () => {
  beforeEach(() => {
    cy.visit('/leveling/mode');
  });

  it('allows searching for a gem and viewing details', () => {
    // Open search modal
    cy.get('[data-testid="gem-search-button"]').click();

    // Type search query
    cy.get('[data-testid="search-input"]').type('arc');

    // Wait for results
    cy.get('[data-testid="gem-result-card"]').should('have.length.at.least', 1);

    // Click first result
    cy.get('[data-testid="gem-result-card"]').first().click();

    // Detail modal should open
    cy.get('[data-testid="gem-detail-modal"]').should('be.visible');
    cy.get('[data-testid="gem-detail-modal"]').should('contain', 'Arc');

    // Availability section should be present
    cy.get('[data-testid="availability-section"]').should('exist');
  });

  it('filters results by selected class', () => {
    // Select Shadow class
    cy.get('[data-testid="class-selector"]').select('shadow');

    // Open search
    cy.get('[data-testid="gem-search-button"]').click();

    // Search for Arc (not available as quest reward for Shadow)
    cy.get('[data-testid="search-input"]').type('arc');

    // Should show Siosa badge
    cy.get('[data-testid="availability-badge"]').should('contain', 'Siosa');
  });
});
```

### Visual Regression Tests

**Use Percy or Chromatic:**

```javascript
// .storybook/stories/GemComponents.stories.jsx
export default {
  title: 'Leveling/Gem Components',
};

export const GemResultCard_QuestReward = () => (
  <GemResultCard
    gem={mockGems.arc}
    selectedClass="witch"
  />
);

export const GemResultCard_Siosa = () => (
  <GemResultCard
    gem={mockGems.arc}
    selectedClass="shadow"
  />
);

export const QuickSearchModal_WithResults = () => (
  <QuickSearchModal
    isOpen={true}
    onClose={() => {}}
  />
);
```

### Performance Tests

**Lighthouse Metrics:**

```bash
# Run Lighthouse CI
npm run lighthouse:ci

# Target scores:
# - Performance: >90
# - Accessibility: >95
# - Best Practices: >90
# - SEO: >90
```

**Bundle Size:**

```bash
# Analyze bundle
npm run build
npm run analyze

# Gem progression feature should add <150KB to bundle
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All unit tests pass (`npm test`)
- [ ] Integration tests pass (`npm run test:e2e`)
- [ ] Lighthouse scores meet targets
- [ ] Bundle size increase acceptable (<150KB)
- [ ] Manual testing on:
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Mobile Safari (iOS)
  - [ ] Mobile Chrome (Android)
- [ ] Accessibility audit (WAVE, axe DevTools)
- [ ] Cross-browser compatibility verified
- [ ] Data validation complete (all 400+ gems)
- [ ] No console errors or warnings

### Deployment Steps

1. **Merge to main branch**
   ```bash
   git checkout main
   git merge feature/gem-progression
   git push origin main
   ```

2. **Netlify auto-deploys**
   - Wait for build to complete (~2 minutes)
   - Check Netlify deploy log for errors

3. **Post-deployment verification**
   - [ ] Visit https://omnilyth-beta.netlify.app/leveling/gems
   - [ ] Test search functionality
   - [ ] Test class selector
   - [ ] Test mode toggle
   - [ ] Verify gem icons load
   - [ ] Test on mobile device

4. **Monitor for issues**
   - Check Netlify analytics for errors
   - Monitor user feedback
   - Watch for bug reports

### Rollback Plan

If critical issues found:

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or revert to specific commit
git reset --hard <previous-commit-hash>
git push --force origin main
```

Netlify will auto-deploy the reverted version.

### Post-Launch Tasks

- [ ] Update CLAUDE.md with new feature documentation
- [ ] Create user guide/tutorial
- [ ] Add feature to changelog
- [ ] Monitor usage analytics
- [ ] Collect user feedback
- [ ] Plan iteration improvements

---

## Appendix

### File Structure (Complete)

```
project-omnilyth/
├── src/
│   ├── components/
│   │   └── leveling/
│   │       ├── ClassSelector.jsx (NEW)
│   │       ├── GemProgressionPanel.jsx (NEW)
│   │       ├── QuickSearchModal.jsx (NEW)
│   │       ├── GemResultCard.jsx (NEW)
│   │       ├── AvailabilityBadge.jsx (NEW)
│   │       ├── GemDetailModal.jsx (NEW)
│   │       ├── GemUnlocksSection.jsx (NEW)
│   │       ├── SiosaUnlockBanner.jsx (NEW)
│   │       ├── GemBrowserHeader.jsx (NEW)
│   │       ├── FilterSidebar.jsx (NEW)
│   │       ├── GemGridView.jsx (NEW)
│   │       ├── GemListView.jsx (NEW)
│   │       ├── GemCard.jsx (NEW)
│   │       └── TrialsTracker.jsx (existing)
│   ├── contexts/
│   │   └── LevelingModeContext.jsx (UPDATE)
│   ├── data/
│   │   ├── gemData.js (existing - gem icons)
│   │   └── leveling/
│   │       ├── gemAvailability.js (NEW)
│   │       ├── questGemRewards.js (NEW)
│   │       ├── specialVendors.js (NEW)
│   │       └── gemProgression.js (NEW)
│   ├── hooks/
│   │   └── useGemSearch.js (NEW)
│   ├── layout/
│   │   └── LevelingSidebar.jsx (UPDATE)
│   ├── pages/
│   │   ├── LevelingPreviewPage.jsx (UPDATE)
│   │   └── LevelingGemsPage.jsx (NEW)
│   └── utils/
│       └── gemFilters.js (NEW)
├── scripts/
│   ├── scrape-gem-rewards.js (NEW)
│   ├── scrape-special-vendors.js (NEW)
│   ├── transform-gem-data.js (NEW)
│   └── validate-gem-data.js (NEW)
└── GEM_PROGRESSION_IMPLEMENTATION_PLAN.md (this file)
```

### Dependencies to Install

```bash
# Fuzzy search
npm install fuse.js

# Optional: Virtual scrolling (if needed)
npm install react-window

# Development
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Environment Variables

No new environment variables needed - uses existing setup.

### API Endpoints

No backend APIs required - all data is static JSON bundled with app.

### Browser Support

Same as existing project:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility Standards

- WCAG 2.1 Level AA compliance
- Keyboard navigable
- Screen reader compatible
- Color contrast ratios ≥4.5:1

### Performance Budgets

| Metric | Target | Max |
|--------|--------|-----|
| Initial bundle size | +100KB | +150KB |
| Gem search response time | 50ms | 100ms |
| Modal open time | 100ms | 200ms |
| Image load time | 500ms | 1000ms |
| Lighthouse Performance | 90+ | 85+ |

---

**Document Version**: 1.0
**Last Updated**: 2026-02-20
**Owner**: EtherealCarnivore
**Status**: Ready for Implementation
