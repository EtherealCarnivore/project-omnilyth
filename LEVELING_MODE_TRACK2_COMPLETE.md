# Leveling Mode - Track 2 Complete ✅

**Status:** Track 2 (Trial of Ascendancy Data) fully integrated
**Build Status:** ✅ Production build successful (3.82s)
**Data Source:** https://www.poewiki.net/wiki/Trial_of_Ascendancy

---

## What Was Implemented

### 1. Trial Data Structure
**File:** `src/data/leveling/trials-data.js`
- ✅ Complete trial location data for all 4 labyrinth tiers
- ✅ Normal Lab trials (6 trials in Acts 1-3)
- ✅ Cruel Lab trials (3 trials in Acts 6-7)
- ✅ Merciless Lab trials (3 trials in Acts 8-10)
- ✅ Eternal Lab trials (6 trials in yellow+ maps)
- ✅ Trap type information for each trial
- ✅ Level requirements for each lab tier
- ✅ Labyrinth unlock requirements
- ✅ Trap survival tips for each trap type

### 2. Trial Markers in Zone Data
**File:** `scripts/leveling-data/generate-mock-data.js`
- ✅ Added `hasTrial` flag to zones containing trials
- ✅ Added `trialType` information for each trial zone
- ✅ Regenerated all acts data (acts123, acts456, acts789, act10)
- ✅ 12 campaign trial locations marked (6 Normal + 3 Cruel + 3 Merciless)

### 3. Data Integration
- ✅ Trial data fully integrated into mock data generation
- ✅ All 4 data chunks regenerated with trial markers:
  - `acts123-data.js` (25.72 KB, 40 areas)
  - `acts456-data.js` (15.20 KB, 26 areas)
  - `acts789-data.js` (14.86 KB, 27 areas)
  - `act10-data.js` (4.89 KB, 7 areas)
- ✅ Production build successful with new data

---

## Complete Trial Location Data

### Normal Labyrinth Trials (Acts 1-3)
Unlock requirement: Complete all 6 trials
Minimum level: 33
Rewards: First 2 Ascendancy points

| Order | Act | Zone | Trap Type | Level |
|-------|-----|------|-----------|-------|
| 1 | 1 | The Lower Prison | Spike traps | 9 |
| 2 | 2 | The Crypt Level 1 | Spinning blades | 18 |
| 3 | 2 | The Chamber of Sins Level 2 | Sawblades | 18 |
| 4 | 3 | The Crematorium | Furnace traps | 24 |
| 5 | 3 | The Catacombs | Blade sentries | 26 |
| 6 | 3 | The Imperial Gardens | Dart traps | 27 |

### Cruel Labyrinth Trials (Acts 6-7)
Unlock requirement: Complete all 3 trials
Minimum level: 40
Rewards: 2 more Ascendancy points (4 total)

| Order | Act | Zone | Trap Type | Level |
|-------|-----|------|-----------|-------|
| 1 | 6 | The Prison | Spike traps | 52 |
| 2 | 7 | The Crypt | Spinning blades | 59 |
| 3 | 7 | The Chamber of Sins Level 2 | Sawblades | 60 |

### Merciless Labyrinth Trials (Acts 8-10)
Unlock requirement: Complete all 3 trials
Minimum level: 50
Rewards: 2 more Ascendancy points (6 total)

| Order | Act | Zone | Trap Type | Level |
|-------|-----|------|-----------|-------|
| 1 | 8 | The Bath House | Furnace traps | 65 |
| 2 | 9 | The Tunnel | Blade sentries | 75 |
| 3 | 10 | The Ossuary | Dart traps | 80 |

### Eternal Labyrinth Trials (Maps)
Unlock requirement: Complete all 6 trials
Minimum level: 60
Rewards: 2 more Ascendancy points (8 total)
Source: Random spawns in yellow+ maps (Tier 6+)

| Trial Name | Trap Type |
|-----------|-----------|
| Trial of Piercing Truth | Spike traps |
| Trial of Swirling Fear | Spinning blades |
| Trial of Crippling Grief | Sawblades |
| Trial of Burning Rage | Furnace traps |
| Trial of Lingering Pain | Blade sentries |
| Trial of Stinging Doubt | Dart traps |

---

## Trap Type Survival Tips

### Spike Traps (Physical Damage)
- Time your movement between spike intervals
- Physical mitigation helps (armor, endurance charges)
- Watch for patterns - some alternate timing

### Spinning Blades (Physical Damage)
- Move through gaps, never run parallel
- Some patterns require waiting for alignment
- Quicksilver flask helps with tight timing

### Sawblades (Physical Damage)
- Horizontal blades - jump over or go under
- Multiple lanes often alternate patterns
- Movement skills can skip entire sections

### Furnace Traps (Fire Damage)
- Fire resistance is critical (75%+ recommended)
- Ruby flask provides temporary immunity
- Burst through with movement skill + instant flask

### Blade Sentries (Physical Damage)
- Stationary spinners - safe zones between them
- Time your dash during gaps in rotation
- Can be skipped with leap slam / flame dash

### Dart Traps (Physical Damage)
- Projectiles fired in patterns
- Hug walls to avoid most darts
- Evasion and dodge help but not reliable

---

## Helper Functions Available

### Get Trials for Specific Act
```javascript
import { getTrialsForAct } from '../data/leveling/trials-data';

const act1Trials = getTrialsForAct(1);
// Returns: [{ act: 1, zone: 'The Lower Prison', ... }]
```

### Get All Trials Up To Act
```javascript
import { getTrialsUpToAct } from '../data/leveling/trials-data';

const trialsUpTo3 = getTrialsUpToAct(3);
// Returns: All 6 Normal Lab trials
```

### Check Lab Unlock Status
```javascript
import { checkLabUnlock } from '../data/leveling/trials-data';

const completedTrials = ['1-The Lower Prison', '2-The Crypt Level 1', ...];
const unlocks = checkLabUnlock(completedTrials);
// Returns: { normal: true, cruel: false, merciless: false }
```

---

## Data Structure

### Trial Object
```javascript
{
  act: 1,                           // Act number
  zone: 'The Lower Prison',        // Zone name
  trapType: 'Spike traps',         // Trap mechanic
  tier: 'Normal',                   // Lab tier
  required: 6,                      // Total trials needed
  order: 1,                         // Trial order
  minLevel: 33,                     // Minimum level (optional)
  notes: 'First trial - introduces spike trap mechanics'
}
```

### Zone Object (with trial marker)
```javascript
{
  name: 'The Lower Prison',
  level: 9,
  hasWaypoint: true,
  hasTrial: true,                   // ← New property
  trialType: 'Spike traps'         // ← New property
}
```

---

## Integration with Leveling System

### Current State
- ✅ Trial data structure created
- ✅ Trial markers added to zone data
- ✅ Helper functions available
- ✅ Trap tips documented
- ✅ Lab unlock requirements defined
- ✅ Data successfully merged into acts chunks

### Ready for UI Implementation
The trial data is now ready to be displayed in the leveling guide:
1. Show trial icon on zones with `hasTrial: true`
2. Display trap type information
3. Track trial completion status
4. Show lab unlock progress (X/6 trials for Normal, etc.)
5. Display trap survival tips when user clicks trial
6. Highlight next required trial

---

## Future UI Enhancements

### Phase 4-5 Implementation Ideas

**Trial Indicators:**
```jsx
{area.hasTrial && (
  <div className="trial-marker">
    <svg>⚔️</svg> {/* Trial icon */}
    <span>{area.trialType}</span>
    <input type="checkbox" checked={completed} />
  </div>
)}
```

**Lab Progress Tracker:**
```jsx
<div className="lab-progress">
  <h4>Normal Lab: {normalTrials.completed}/{normalTrials.total}</h4>
  <ProgressBar percent={normalTrials.percent} />
  {normalTrials.completed === normalTrials.total && (
    <button onClick={runNormalLab}>Ready to Run!</button>
  )}
</div>
```

**Trap Tips Popup:**
```jsx
<TrapTipModal
  trapType={selectedTrial.trapType}
  tips={trapTips[selectedTrial.trapType]}
  danger={trapTips[selectedTrial.trapType].danger}
/>
```

---

## Testing Checklist

### Manual Testing Required
- [ ] Verify all 12 campaign trial zones marked correctly
- [ ] Check trial types match wiki data
- [ ] Verify level ranges are accurate
- [ ] Test helper functions (getTrialsForAct, checkLabUnlock)
- [ ] Verify trap tips are comprehensive
- [ ] Check lab unlock requirements are correct

### Data Validation
- [ ] All 6 Normal Lab trials present in Acts 1-3
- [ ] All 3 Cruel Lab trials present in Acts 6-7
- [ ] All 3 Merciless Lab trials present in Acts 8-10
- [ ] Trap types match between trialsData and zone markers
- [ ] Level requirements align with normal progression

---

## Files Modified

### New Files (1)
1. `src/data/leveling/trials-data.js` - Complete trial data structure

### Modified Files (1)
1. `scripts/leveling-data/generate-mock-data.js` - Added trial markers to 12 zones

### Regenerated Files (4)
1. `src/data/leveling/acts123-data.js` - Now includes trial markers
2. `src/data/leveling/acts456-data.js` - Now includes trial markers
3. `src/data/leveling/acts789-data.js` - Now includes trial markers
4. `src/data/leveling/act10-data.js` - Now includes trial markers

---

## Completion Summary

✅ **Track 2 Complete**
- Trial data extracted from PoE Wiki
- 12 campaign trial locations marked
- 6 Eternal Lab trials documented
- Trap survival tips included
- Helper functions implemented
- Lab unlock requirements defined
- Data successfully merged and built

🎯 **Ready for Phase 4**
- All trial data available for UI implementation
- Zone markers in place for trial indicators
- Progress tracking logic ready to integrate
- Build successful (3.82s)

---

## Data Credits

**Source:** https://www.poewiki.net/wiki/Trial_of_Ascendancy
**License:** Community-maintained Path of Exile Wiki
**Usage:** Educational and game enhancement purposes
**Acknowledgment:** Thanks to the PoE Wiki community for maintaining accurate game data

---

**Build Timestamp:** 2026-02-19
**Build Time:** 3.82s
**Data Chunks:** 4 files, 60.67 KB total
**Trial Locations:** 12 campaign + 6 map trials
**Status:** ✅ TRACK 2 COMPLETE

---

## Next Steps

### Immediate (Your Testing)
1. Review trial locations in preview page
2. Verify data accuracy against in-game
3. Test that trial markers appear correctly
4. Provide feedback on trap tips

### Phase 4 (Production UI)
1. Add trial icons to zone cards
2. Implement trial completion checkboxes
3. Add lab unlock progress bars
4. Create trap tip modals
5. Highlight next required trial
6. Add lab ready notifications

### Phase 5 (Enhanced Features)
1. Ascendancy class selection
2. Class-specific lab tips
3. Ascendancy point allocation tracker
4. Lab layout variations (daily rotations)
5. Offering to the Goddess tracking

---

**Ready for Testing:** Yes
**Production Ready:** Data layer complete, UI pending
**Next Action:** User testing + Phase 4 UI implementation

🚀 Both Track 1 (Mode System) and Track 2 (Trial Data) are now complete!
