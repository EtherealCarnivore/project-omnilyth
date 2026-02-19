# Phase 3: Comparison Page - Complete Guide

## Overview

Phase 3 provides a side-by-side comparison of two layout styles to help decide on the final UI design for Leveling Mode.

---

## 🎯 What Was Built

### 1. **LevelingPreviewPage** (`/leveling/preview`)

Main preview page with:
- Layout style toggle (exile-leveling vs poe-leveling)
- Side-by-side comparison mode (desktop)
- Single layout view (mobile)
- Feedback section for decision-making
- Data source attribution

### 2. **ExileLevelingLayout** (Structured Style)

**Inspired by exile-leveling:**
- Table-like, checkbox-driven interface
- Clear sections: zones, quests, tips
- Checkbox objectives with strikethrough on completion
- Collapsible tips sections
- Minimal narrative, data-focused
- Progress percentage tracker

**Best For:**
- Quick scanning and reference
- Checkbox-style task completion
- Seeing all zones at a glance
- Efficiency-focused users

### 3. **PoELevelingLayout** (Narrative Style)

**Inspired by poe-leveling.com:**
- Step-by-step guide with numbered zones
- Expandable zone cards (click to reveal)
- Integrated tips within zone details
- Story-like progression
- "Mark Complete" buttons
- More contextual information

**Best For:**
- First-time players
- Detailed guidance needed
- Story-like flow
- Contextual learning

---

## 🚀 How to Use

### Access the Preview

1. **Navigate to:** `http://localhost:5173/leveling/preview` (dev) or `/leveling/preview` (production)
2. **Toggle layouts:** Click "exile-leveling Style" or "poe-leveling Style"
3. **Comparison mode:** Click "Side-by-Side" (desktop only)

### Test the Layouts

**ExileLevelingLayout:**
- Check/uncheck objectives
- See progress percentage update
- Expand collapsible tips
- Notice clean, scannable structure

**PoELevelingLayout:**
- Click zone headers to expand
- Read integrated tips
- Mark zones complete
- Notice narrative flow

### Make a Decision

Compare and ask:
1. Which feels more natural for Omnilyth users?
2. Which is easier to scan during leveling?
3. Which better matches existing Omnilyth aesthetics?
4. Which supports both Fresh and Alt modes better?

---

## 📊 Layout Comparison

| Feature | exile-leveling Style | poe-leveling Style |
|---------|---------------------|-------------------|
| **Structure** | Table-like, rigid | Narrative, flowing |
| **Objectives** | Checkboxes, all visible | Hidden until expanded |
| **Tips** | Collapsible, separate | Integrated, inline |
| **Progress** | Percentage at top | Visual step numbers |
| **Density** | High (see more at once) | Lower (one zone at a time) |
| **Learning Curve** | Low (familiar pattern) | Medium (need to explore) |
| **Mobile** | Good (compact) | Better (larger tap targets) |
| **Speed** | Faster scanning | Slower, more reading |

---

## 🎨 Design Differences

### exile-leveling Style

```
┌────────────────────────────────┐
│ Act 1                    75%   │
├────────────────────────────────┤
│ □ The Coast (Lv 1)            │
│   □ Get quicksilver flask       │
│   □ Kill zombies               │
│   [2 tips ▼]                   │
├────────────────────────────────┤
│ □ The Mud Flats (Lv 2)        │
│   □ Collect rhoa eggs          │
│   [1 tip ▼]                    │
└────────────────────────────────┘
```

**Visual Identity:**
- Purple accent color
- Clean borders
- Checkbox-focused
- Dense information

### poe-leveling Style

```
┌────────────────────────────────┐
│ Act 1 Guide                    │
│ Follow this guide...           │
│ ○ 5 Zones  ● 2 Completed      │
├────────────────────────────────┤
│ ① The Coast (Lv 1) [▼]        │
│   What to do:                  │
│   • Get quicksilver flask      │
│   Pro Tips:                    │
│   • Skip most monsters         │
│   [Mark Complete]              │
├────────────────────────────────┤
│ ② The Mud Flats (Lv 2) [▶]    │
└────────────────────────────────┘
```

**Visual Identity:**
- Blue accent color
- Card-based
- Expandable zones
- Integrated tips

---

## 💡 Design Insights

### Strengths: exile-leveling Style

✅ **Efficiency**: See all zones at once
✅ **Familiarity**: Checkbox pattern is universal
✅ **Density**: More information visible
✅ **Quick Reference**: Easy to scan for what's next
✅ **Desktop Friendly**: Works well on large screens

### Strengths: poe-leveling Style

✅ **Guidance**: Step-by-step feels less overwhelming
✅ **Context**: Tips are right where you need them
✅ **Mobile Friendly**: Larger tap targets, better spacing
✅ **Engagement**: Expandable zones create discovery
✅ **Progression**: Numbered steps feel like advancement

### Potential Hybrid Approach

**Best of Both Worlds:**
- Use **exile-leveling structure** for desktop (efficient scanning)
- Use **poe-leveling cards** for mobile (better touch UX)
- Combine **checkboxes** (quick tracking) with **integrated tips** (contextual help)
- Keep **purple/gold accent** (Omnilyth brand colors)

---

## 🔧 Technical Details

### File Structure

```
src/
├── pages/
│   └── LevelingPreviewPage.jsx          # Main preview page
├── components/
│   └── leveling/
│       ├── ModeToggle.jsx               # Fresh/Alt toggle (Phase 1)
│       └── preview/
│           ├── ExileLevelingLayout.jsx  # Structured layout
│           └── PoELevelingLayout.jsx    # Narrative layout
└── data/
    └── leveling/
        └── acts123-data.js              # Preview data (Phase 2)
```

### Bundle Sizes

- `LevelingPreviewPage.js`: 11.28 KB (gzipped: 2.79 KB)
- `ExileLevelingLayout`: ~4 KB (lazy-loaded)
- `PoELevelingLayout`: ~5 KB (lazy-loaded)
- Total: ~20 KB when comparison mode active

### State Management

Both layouts maintain local state:
- `completedObjectives` (exile style) or `completedZones` (poe style)
- `expandedZones` (poe style only)
- No localStorage persistence (preview only)

---

## 🚦 Next Steps (Phase 4)

Once layout decision is made:

### 1. Create Production Components

Based on chosen style:
- `ActNavigation.jsx` - Act selector tabs
- `ZoneCard.jsx` - Production zone component
- `ObjectiveList.jsx` - Checkbox list with progress tracking
- `TipSection.jsx` - Collapsible tips (filtered by mode)
- `RecipeSection.jsx` - Vendor recipes (Fresh mode only)

### 2. Integrate with Context

Connect to `LevelingProgressContext`:
- Real progress tracking (persistent)
- Mode-based filtering (Fresh vs Alt)
- Overall progress stats
- Next zone recommendation

### 3. Design Unique Omnilyth Style

**Don't copy - create unique:**
- Use Omnilyth's gold accent (#daa520)
- Glass-card styling (bg-zinc-900/60, backdrop-blur)
- Custom icons and illustrations
- Unique interaction patterns
- Original information hierarchy

### 4. Add Enhanced Features

- Gem progression panel (side panel on desktop)
- Class-based gem filtering (using wiki data)
- Racing tips toggle
- Vendor recipe toggle (Fresh mode)
- Credits footer with links

---

## ✅ Phase 3 Completion Checklist

- [x] LevelingPreviewPage created at `/leveling/preview`
- [x] ExileLevelingLayout with checkboxes and progress
- [x] PoELevelingLayout with expandable cards
- [x] Side-by-side comparison mode (desktop)
- [x] Both layouts use same mock data
- [x] Build successful (no errors)
- [x] Routes registered in module registry
- [x] Lazy loading implemented
- [x] Style distinction clear (purple vs blue)
- [ ] **User decision needed: Which style to use?**

---

## 📝 Decision Matrix

Use this to decide:

| Criteria | exile-leveling | poe-leveling | Winner |
|----------|---------------|-------------|--------|
| Efficiency (fast scanning) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ? |
| First-time user friendly | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ? |
| Mobile UX | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ? |
| Desktop UX | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ? |
| Information density | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ? |
| Contextual help | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ? |
| Quick reference | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ? |
| Progression feel | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ? |
| Fits Omnilyth theme | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ? |

**Recommendation:** Test both in actual leveling scenarios. Consider hybrid approach for best of both worlds.

---

## 🎯 Success Criteria

Phase 3 is complete when:

1. ✅ Both layouts render correctly
2. ✅ Comparison mode works on desktop
3. ✅ Same data displays in both styles
4. ✅ User can interact with both
5. ⏳ **Decision made on which style to proceed with**

---

**Status:** Phase 3 Complete - Ready for User Decision
**Next Phase:** Phase 4 - Build Production UI
**Estimated Time:** 4-5 days after decision

---

## 📞 Questions to Answer

Before proceeding to Phase 4:

1. **Which layout style do you prefer?**
   - exile-leveling (structured, checkbox-driven)
   - poe-leveling (narrative, step-by-step)
   - Hybrid (combine best of both)

2. **What's most important for Omnilyth users?**
   - Speed and efficiency (favors exile-leveling)
   - Guidance and context (favors poe-leveling)
   - Balance of both (favors hybrid)

3. **Desktop vs Mobile priority?**
   - Desktop-first (can use denser layout)
   - Mobile-first (need larger tap targets)
   - Equal priority (hybrid responsive)

Answer these questions, then proceed to Phase 4 with clear direction! 🚀
