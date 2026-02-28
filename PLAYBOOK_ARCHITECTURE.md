# Leveling Playbook Architecture

Complete data architecture and component structure for the Leveling Playbook feature.

## Overview

The Leveling Playbook system transforms speedrunner knowledge into structured, interactive guides with checklists, decision points, power spike timelines, and contextual warnings.

## Data Architecture

### 1. Playbook Data Schema

**Location:** `src/data/leveling/playbooks/{build-name}.js`

Each playbook is a comprehensive data export with the following structure:

```javascript
{
  // Meta information
  id: 'lightning-arrow-ranger',
  name: 'Lightning Arrow Ranger',
  class: 'Ranger',
  ascendancy: ['Deadeye', 'Raider'],
  patchVersion: '3.27',
  difficulty: 'intermediate',
  estimatedTime: '4-5 hours',
  description: 'Build philosophy and overview',

  // Core principles (5-10 items)
  principles: [
    {
      id: 'p1',
      title: 'Movement is DPS',
      description: 'Detailed explanation',
      priority: 'critical' | 'high' | 'medium'
    }
  ],

  // Power spikes timeline
  powerSpikes: [
    {
      level: 12,
      spike: 'Lightning Arrow online',
      impact: 'What this means for gameplay',
      gear: ['Item names'],
      gems: ['Gem names'],
      videoTimestamp: '00:12:45'
    }
  ],

  // Act-by-act breakdown (10 acts)
  acts: [
    {
      act: 1,
      title: 'The Coast to Brutus',
      levelRange: { enter: 1, exit: 12 },
      timeTarget: '25-30 minutes',

      // Zone routing
      route: [
        {
          zone: 'The Coast',
          objective: 'Rush to Mud Flats',
          skipMobs: true
        }
      ],

      // Quests to complete
      quests: [
        {
          name: 'Enemy at the Gate',
          reward: 'Quicksilver Flask',
          required: true,
          timing: 'Immediately after Coast'
        }
      ],

      // Gem progression
      gems: [
        {
          level: 1,
          action: 'start' | 'add' | 'switch' | 'prepare' | 'remove',
          gems: ['Caustic Arrow'],
          links: ['Caustic Arrow', 'Pierce']
        }
      ],

      // Gear priorities
      gear: [
        {
          slot: 'weapon' | 'boots' | 'helmet' | etc.,
          priority: 'critical' | 'high' | 'medium' | 'low',
          target: 'Stat requirements',
          upgrade: 'When to upgrade'
        }
      ],

      // Boss strategies
      bosses: [
        {
          name: 'Brutus',
          level: 8,
          difficulty: 'easy' | 'medium' | 'hard',
          strategy: 'How to fight',
          dangerLevel: 'low' | 'medium' | 'high',
          videoTimestamp: '00:09:45'
        }
      ],

      // Decision points
      decisionPoints: [
        {
          id: 'act1-d1',
          condition: 'IF condition',
          ifTrue: 'THEN action',
          ifFalse: 'ELSE action',
          reasoning: 'BECAUSE explanation',
          priority: 'critical' | 'high' | 'medium' | 'low'
        }
      ],

      // Checklist items
      checklistItems: [
        {
          id: 'act1-c1',
          task: 'Get Quicksilver Flask',
          category: 'quest' | 'gem' | 'gear' | 'level',
          required: true | false
        }
      ],

      // Act-specific mistakes
      mistakes: [
        {
          id: 'act1-m1',
          mistake: 'Over-leveling in The Ledge',
          why: 'Wastes time',
          severity: 'major' | 'minor',
          videoTimestamp: '00:06:30'
        }
      ]
    }
  ],

  // Global decision heuristics
  heuristics: [
    {
      id: 'h1',
      category: 'gearing' | 'gems' | 'leveling' | 'economy',
      rule: 'IF/THEN/BECAUSE statement',
      reasoning: 'Why this matters',
      priority: 'critical' | 'high' | 'medium' | 'low'
    }
  ],

  // Global common mistakes
  commonMistakes: [
    {
      id: 'cm1',
      mistake: 'Description',
      fix: 'How to fix',
      severity: 'major' | 'minor',
      category: 'economy' | 'combat' | 'routing' | 'defense'
    }
  ],

  // Search/filter tags
  tags: ['bow', 'ranger', 'lightning', 'fast', 'intermediate'],

  // External resources
  resources: {
    pobPaste: 'https://pobb.in/...',
    guideUrl: 'https://...',
    videoUrl: 'https://...'
  }
}
```

### 2. Playbook Index

**Location:** `src/data/leveling/playbooks/index.js`

Centralized registry with helper functions:

```javascript
import lightningArrowRangerPlaybook from './lightning-arrow-ranger.js';

export const playbooks = [lightningArrowRangerPlaybook];

export const getPlaybookById = (id) => { /* ... */ };
export const getPlaybooksByClass = (className) => { /* ... */ };
export const getPlaybooksByTag = (tag) => { /* ... */ };
export const getPlaybooksByDifficulty = (difficulty) => { /* ... */ };
```

## State Management

### PlaybookContext

**Location:** `src/contexts/PlaybookContext.jsx`

#### State Shape

```javascript
{
  version: '1.0.0',
  selectedPlaybookId: 'lightning-arrow-ranger' | null,
  currentAct: 1-10,
  completedItems: {
    'act1-c1': true,
    'act1-c2': false,
    // ... all checklist items
  },
  bookmarkedDecisions: ['act2-d1', 'act3-d2'],
  collapsedSections: {
    'act1-gear': true,
    'act2-quests': false
  },
  lastUpdated: '2025-02-17T10:30:00Z'
}
```

#### localStorage Key

`omnilyth-playbook-state`

#### Context Interface

```javascript
const {
  // State
  selectedPlaybookId,
  currentAct,
  completedItems,
  bookmarkedDecisions,
  collapsedSections,

  // Computed
  playbooks,              // All available playbooks
  currentPlaybook,        // Selected playbook object
  currentActData,         // Current act data
  progress,               // Overall progress (0-100%)
  isLoading,              // Initial load state

  // Actions
  selectPlaybook,         // (id) => void
  clearPlaybook,          // () => void
  setCurrentAct,          // (actNumber) => void
  toggleChecklistItem,    // (itemId) => void
  completeChecklistItem,  // (itemId) => void
  uncompleteChecklistItem,// (itemId) => void
  isChecklistItemComplete,// (itemId) => boolean
  toggleDecisionBookmark, // (decisionId) => void
  isDecisionBookmarked,   // (decisionId) => boolean
  toggleSection,          // (sectionKey) => void
  isSectionCollapsed,     // (sectionKey) => boolean
  resetProgress,          // () => void - Reset current playbook
  resetAll,               // () => void - Reset everything

  // Helpers
  getActProgress,         // (actNumber) => number (0-100%)
  getCurrentActMistakes,  // () => Mistake[]
  getPowerSpikesForAct,   // (actNumber) => PowerSpike[]
  getNextChecklistItem    // () => ChecklistItem | null
} = usePlaybook();
```

### Integration with Existing Contexts

**LevelingModeContext** - Shares `selectedClass` and `currentAct`:
- PlaybookContext can read `selectedClass` to filter playbooks
- Both contexts can sync `currentAct` state
- No direct dependency (optional integration)

**LevelingProgressContext** - Tracks zone progress:
- Can be used to auto-advance act in playbook
- Optional enhancement for future

**LevelingPlanContext** - Gem plans:
- Can populate gem planner from playbook data
- Optional integration point

## Component Architecture

### Component Tree

```
PlaybookPage (src/pages/PlaybookPage.jsx)
├── PlaybookSelector (no playbook selected state)
│   └── PlaybookCard (individual playbook cards)
│
├── ActNavigation (act tabs with progress)
│
├── PlaybookActView (main content area)
│   ├── TabNavigation
│   ├── ActChecklist (grouped by category)
│   │   └── ChecklistItem
│   ├── ActDecisionPoints (IF/THEN cards)
│   ├── RouteView (zone progression)
│   ├── ActGearCheckpoints (gear priorities)
│   ├── ActGemSetup (gem progression)
│   ├── ActBossNotes (boss strategies)
│   └── MistakesPanel (contextual warnings)
│       └── MistakeCard
│
└── PowerSpikeSidebar (sticky sidebar)
    └── PowerSpikeCard
```

### Component Props

#### PlaybookSelector

```javascript
{
  className?: string,
  onSelect?: (playbookId: string) => void
}
```

#### ActNavigation

```javascript
{
  className?: string,
  showProgress?: boolean
}
```

#### ActChecklist

```javascript
{
  actNumber: number,
  className?: string,
  groupByCategory?: boolean,
  showOnlyIncomplete?: boolean
}
```

#### ActDecisionPoints

```javascript
{
  actNumber: number,
  className?: string,
  showBookmarked?: boolean
}
```

#### PowerSpikeSidebar

```javascript
{
  className?: string,
  currentLevel?: number,
  showAll?: boolean
}
```

#### MistakesPanel

```javascript
{
  actNumber: number,
  className?: string,
  showGlobal?: boolean
}
```

#### ActGearCheckpoints

```javascript
{
  actNumber: number,
  className?: string
}
```

#### ActGemSetup

```javascript
{
  actNumber: number,
  className?: string
}
```

#### ActBossNotes

```javascript
{
  actNumber: number,
  className?: string
}
```

## Module Registry

**Location:** `src/modules/registry.js`

Added entry:

```javascript
{
  id: 'playbook',
  title: 'Leveling Playbook',
  description: 'Step-by-step speedrunner strategies with checklists, decisions, and power spikes',
  category: 'Leveling',
  subcategory: 'Guide',
  route: '/leveling/playbook',
  icon: 'playbook',
  component: lazy(() => import('../pages/PlaybookPage'))
}
```

## App Integration

**Location:** `src/App.jsx`

Added PlaybookProvider to context stack:

```jsx
<LevelingModeProvider>
  <LevelingPlanProvider>
    <PlaybookProvider>  {/* NEW */}
      <PatchNotesProvider>
        {/* ... app content */}
      </PatchNotesProvider>
    </PlaybookProvider>
  </LevelingPlanProvider>
</LevelingModeProvider>
```

## File Structure

```
src/
├── data/
│   └── leveling/
│       └── playbooks/
│           ├── index.js                           # Registry + helpers
│           └── lightning-arrow-ranger.js          # Example playbook
│
├── contexts/
│   └── PlaybookContext.jsx                        # State management
│
├── components/
│   └── leveling/
│       └── playbook/
│           ├── PlaybookSelector.jsx               # Build selection
│           ├── ActNavigation.jsx                  # Act tabs
│           ├── ActChecklist.jsx                   # Task checklist
│           ├── ActDecisionPoints.jsx              # IF/THEN cards
│           ├── ActGearCheckpoints.jsx             # Gear priorities
│           ├── ActGemSetup.jsx                    # Gem progression
│           ├── ActBossNotes.jsx                   # Boss strategies
│           ├── PowerSpikeSidebar.jsx              # Power timeline
│           └── MistakesPanel.jsx                  # Warnings
│
└── pages/
    └── PlaybookPage.jsx                           # Main page
```

## Implementation Status

**Completed:**
- ✅ Data schema design
- ✅ PlaybookContext with localStorage persistence
- ✅ All core components with prop interfaces
- ✅ Module registry integration
- ✅ App.jsx context provider setup
- ✅ Example playbook data (Acts 1-2)

**Next Steps:**
1. Complete Acts 3-10 data for lightning-arrow-ranger playbook
2. Add 2-3 more playbooks (different classes/builds)
3. Implement video timestamp integration (YouTube player)
4. Add PoB import to auto-populate playbook data
5. Create playbook sharing/export feature
6. Add community voting on playbook quality

## Usage Example

```javascript
import { usePlaybook } from '../contexts/PlaybookContext';

function MyComponent() {
  const {
    playbooks,
    selectPlaybook,
    currentPlaybook,
    currentAct,
    progress
  } = usePlaybook();

  // Select a playbook
  const handleSelect = () => {
    selectPlaybook('lightning-arrow-ranger');
  };

  // Check progress
  console.log(`Overall progress: ${progress}%`);

  // Complete checklist item
  const { toggleChecklistItem } = usePlaybook();
  toggleChecklistItem('act1-c1');

  return (
    <div>
      <h1>{currentPlaybook?.name}</h1>
      <p>Act {currentAct}</p>
    </div>
  );
}
```

## Design Principles

1. **Data-driven:** All playbook knowledge is structured data, not hardcoded UI
2. **Reusable components:** Each component focuses on one concern
3. **Progressive enhancement:** Features work without video/external resources
4. **Offline-first:** All data stored locally, no API dependencies
5. **Mobile-responsive:** Collapsible sidebars, touch-friendly UI
6. **Accessible:** WCAG AA compliant, keyboard navigation

## Performance Considerations

- Lazy-loaded page component (code splitting)
- Memoized computations in context (useMemo)
- LocalStorage persistence (fast reads/writes)
- No API calls (all data bundled)
- Minimal re-renders (context optimization)

## Future Enhancements

1. **Playbook Editor:** In-app tool to create/edit playbooks
2. **Community Platform:** Share and rate playbooks
3. **AI Analysis:** Auto-generate playbooks from VODs
4. **Live Progress:** Track real character progress via API
5. **Multiplayer Sync:** Share progress with racing team
6. **Build Comparison:** Compare strategies side-by-side
7. **Season Integration:** Auto-update for league mechanics

---

**Last Updated:** 2025-02-17
**Architecture Version:** 1.0.0
