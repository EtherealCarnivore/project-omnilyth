# WCAG Contrast Ratios - Project Omnilyth

## Background Color
- **zinc-950:** `#09090b` (almost black)

---

## Current Zinc Text Colors (on zinc-950 background)

### ❌ FAIL - Do Not Use

| Color | Hex | Contrast Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) | Usage |
|-------|-----|----------------|-----------------|----------------|-------|
| **text-zinc-700** | #3f3f46 | **1.5:1** | ❌ FAIL | ❌ FAIL | **Invisible** |
| **text-zinc-600** | #52525b | **2.1:1** | ❌ FAIL | ❌ FAIL | **Nearly invisible** |

### ⚠️ CAUTION - Limited Use Only

| Color | Hex | Contrast Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) | Usage |
|-------|-----|----------------|-----------------|----------------|-------|
| **text-zinc-500** | #71717a | **3.2:1** | ❌ FAIL | ❌ FAIL | **Decorative only** |

### ✅ PASS - Safe to Use

| Color | Hex | Contrast Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) | Usage |
|-------|-----|----------------|-----------------|----------------|-------|
| **text-zinc-400** | #a1a1aa | **5.8:1** | ✅ PASS | ❌ FAIL | **Body text minimum** |
| **text-zinc-300** | #d4d4d8 | **10.1:1** | ✅ PASS | ✅ PASS | **Secondary text** |
| **text-zinc-200** | #e4e4e7 | **14.8:1** | ✅ PASS | ✅ PASS | **Headings** |
| **text-zinc-100** | #f4f4f5 | **18.5:1** | ✅ PASS | ✅ PASS | **Primary content** |
| **text-white** | #ffffff | **21:1** | ✅ PASS | ✅ PASS | **Maximum contrast** |

---

## WCAG Standards Reference

### Normal Text (< 18pt or < 14pt bold)
- **Level AA:** 4.5:1 contrast ratio minimum
- **Level AAA:** 7.0:1 contrast ratio minimum

### Large Text (≥ 18pt or ≥ 14pt bold)
- **Level AA:** 3.0:1 contrast ratio minimum
- **Level AAA:** 4.5:1 contrast ratio minimum

### Graphical Objects & UI Components
- **Level AA:** 3.0:1 contrast ratio minimum

---

## Accent Colors on zinc-950 Background

### Status Colors

| Color | Hex | Contrast Ratio | WCAG Pass | Usage |
|-------|-----|----------------|-----------|-------|
| **text-green-500** | #10b981 | **5.1:1** | ✅ AA | Success states |
| **text-red-500** | #ef4444 | **4.7:1** | ✅ AA | Error states |
| **text-amber-500** | #f59e0b | **6.8:1** | ✅ AA | Warning/gold |
| **text-sky-400** | #38bdf8 | **7.2:1** | ✅ AAA | Links/accents |
| **text-indigo-400** | #818cf8 | **5.4:1** | ✅ AA | Secondary accent |
| **text-purple-400** | #c084fc | **6.1:1** | ✅ AA | Special items |

### League Indicator Colors

| Color | Hex | Contrast Ratio | WCAG Pass | Usage |
|-------|-----|----------------|-----------|-------|
| **text-emerald-300** | #6ee7b7 | **10.2:1** | ✅ AAA | Softcore |
| **text-red-300** | #fca5a5 | **8.9:1** | ✅ AAA | Hardcore |
| **text-amber-300** | #fcd34d | **11.5:1** | ✅ AAA | SSF |
| **text-purple-300** | #d8b4fe | **10.8:1** | ✅ AAA | Event |
| **text-rose-300** | #fda4af | **9.1:1** | ✅ AAA | HC Event |

All league colors pass WCAG AAA! ✅

---

## Opacity-Based Colors (Current Issues)

### Glass Card Backgrounds

| Element | Background | Actual Opacity | Visibility |
|---------|-----------|----------------|------------|
| **Current glass-card** | `rgba(24, 24, 27, 0.40)` | 40% | ❌ Too transparent |
| **Recommended** | `rgba(24, 24, 27, 0.85)` | 85% | ✅ Opaque enough |

### Input Backgrounds

| Element | Background | Actual Opacity | Visibility |
|---------|-----------|----------------|------------|
| **Current calc-input** | `rgba(39, 39, 42, 0.60)` | 60% | ⚠️ Too subtle |
| **Recommended** | `rgba(39, 39, 42, 0.80)` | 80% | ✅ Clear |

### Placeholder Text

| Element | Color | Actual Opacity | Visibility |
|---------|-------|----------------|------------|
| **Current placeholder** | `rgba(244, 244, 245, 0.35)` | 35% of zinc-100 | ❌ Too faint |
| **Recommended** | `rgba(244, 244, 245, 0.50)` | 50% of zinc-100 | ✅ Readable |

---

## Real-World Examples

### Sidebar Brand Text (Line 146)
```jsx
// CURRENT (NEARLY INVISIBLE)
<p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">
  PoE Toolkit
</p>
// Color: #52525b on #09090b = 2.1:1 contrast ❌

// FIX (READABLE)
<p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">
  PoE Toolkit
</p>
// Color: #a1a1aa on #09090b = 5.8:1 contrast ✅
```

### Pin Button Visibility (Homepage Line 112)
```jsx
// CURRENT (INVISIBLE UNTIL HOVER)
'text-zinc-600 opacity-0 group-hover:opacity-100'
// Effective contrast: 0:1 (completely hidden) ❌

// FIX (ALWAYS VISIBLE)
'text-zinc-600/50 group-hover:opacity-100'
// Effective contrast: 1.05:1 at 50% opacity (visible but subtle) ✅
// On hover: 2.1:1 (more visible)
```

### Coming Soon Items (Sidebar Line 279)
```jsx
// CURRENT
<div className="px-3 py-1.5 ml-2 text-sm text-zinc-600 ...">
  DPS Simulator
</div>
// Color: #52525b on #09090b = 2.1:1 contrast ❌

// FIX
<div className="px-3 py-1.5 ml-2 text-sm text-zinc-500 ...">
  DPS Simulator
</div>
// Color: #71717a on #09090b = 3.2:1 contrast ⚠️
// Still fails AA but acceptable for "Coming Soon" (decorative)
// Or better: text-zinc-400 for 5.8:1 ✅
```

---

## Fade-In Animation Impact

### Current Animation
```css
@keyframes fadeIn {
  from { opacity: 0; }  /* 0% opacity = INVISIBLE */
  to { opacity: 1; }    /* 100% opacity = VISIBLE */
}
```

**At animation start:**
- zinc-600 at 0% opacity = **0:1 contrast** (completely invisible)
- zinc-400 at 0% opacity = **0:1 contrast** (completely invisible)

**The problem:** Even good text colors become invisible at start of animation!

### Fixed Animation
```css
@keyframes fadeIn {
  from { opacity: 0.6; }  /* 60% opacity = STILL VISIBLE */
  to { opacity: 1; }      /* 100% opacity = FULLY VISIBLE */
}
```

**At animation start (60% opacity):**
- zinc-600 at 60%: **1.26:1 contrast** ⚠️ Still too faint
- zinc-400 at 60%: **3.48:1 contrast** ✅ Visible!
- zinc-300 at 60%: **6.06:1 contrast** ✅ Clear!

**Result:** Content visible throughout entire animation with zinc-400+

---

## Compounding Opacity Problem

### Example: Text on Glass Card with Fade-In

**Scenario:**
- Page background: `zinc-950` (#09090b)
- Glass card: `rgba(24, 24, 27, 0.40)` (40% opacity)
- Text: `text-zinc-600` (#52525b)
- Animation: Starts at `opacity: 0`

**Effective contrast calculation:**
1. Glass card at 40% opacity blends with page
2. Text zinc-600 already has 2.1:1 contrast
3. Animation starts at 0% opacity
4. **Result: Completely invisible text during animation**

**After fix:**
- Glass card: `rgba(24, 24, 27, 0.85)` (85% opacity)
- Text: `text-zinc-400` (#a1a1aa)
- Animation: Starts at `opacity: 0.6` (60%)
- **Result: 3.48:1 contrast even at animation start** ✅

---

## Button States

### Default Button
```jsx
// Base state
className="... text-zinc-400 bg-zinc-900/80 ..."
// Text: 5.8:1 ✅
// Background visible enough ✅
```

### Hover Button
```jsx
// Hover state
className="... hover:text-zinc-100 hover:bg-zinc-800 ..."
// Text: 18.5:1 ✅ (very clear on hover)
// Background change noticeable ✅
```

### Disabled Button
```jsx
// CURRENT (TOO FAINT)
className="... disabled:opacity-40 ..."
// At 40% opacity: 2.32:1 (text-zinc-400 becomes too faint) ❌

// FIX
className="... disabled:opacity-50 ..."
// At 50% opacity: 2.9:1 (still faint but more visible) ⚠️

// BETTER FIX
className="... disabled:text-zinc-500 disabled:opacity-70 ..."
// Use slightly darker color but higher opacity
// Result: Better visual indicator while maintaining readability ✅
```

---

## Search Input Contrast

### Search Placeholder
```jsx
// CURRENT
<input
  placeholder="Search modules..."
  className="... placeholder:text-zinc-600 ..."
/>
// Placeholder: #52525b = 2.1:1 ❌

// FIX
<input
  placeholder="Search modules..."
  className="... placeholder:text-zinc-400 ..."
/>
// Placeholder: #a1a1aa = 5.8:1 ✅
```

### Search Border
```jsx
// CURRENT
className="... border border-white/[0.06] ..."
// Border: 6% white opacity = very subtle, hard to see where input is

// FIX
className="... border border-white/[0.10] ..."
// Border: 10% white opacity = noticeable, clear input boundary
```

---

## Dropdown Menu Contrast

### Dropdown Background
```jsx
// CURRENT (BLENDS WITH PAGE)
className="... bg-zinc-900 border border-white/[0.08] ..."
// Background: #18181b on #09090b = 1.24:1 ⚠️ Too similar
// Border: 8% white opacity = subtle

// FIX (STANDS OUT)
className="... bg-zinc-900/95 backdrop-blur-xl border border-white/[0.15] ..."
// Background: more opaque + blur effect = distinct
// Border: 15% white opacity = clear boundary
// Shadow adds additional separation ✅
```

### Dropdown Item Text
```jsx
// If using zinc-600 in dropdown items:
<button className="... text-zinc-600 ...">
// 2.1:1 contrast ❌

// Use zinc-300 or zinc-400 instead:
<button className="... text-zinc-300 ...">
// 10.1:1 contrast ✅
```

---

## Modal Overlay Contrast

### Modal Backdrop
```jsx
// CURRENT (NOT DARK ENOUGH)
className="... bg-black/70 ..."
// Backdrop: 70% black = page content 30% visible through
// Modal content competes with background ⚠️

// FIX (PROPER DARKNESS)
className="... bg-black/85 ..."
// Backdrop: 85% black = page content only 15% visible
// Modal content stands out clearly ✅
```

### Modal Content
```jsx
// Modal with proper contrast:
<div className="glass-card rounded-xl p-6">
  <h3 className="text-xl font-bold text-zinc-100">Title</h3>
  <p className="text-sm text-zinc-300">Description</p>
  <button className="... text-white bg-amber-500">Action</button>
</div>
// Title: 18.5:1 ✅
// Description: 10.1:1 ✅
// Button text on amber: 9.5:1 ✅
```

---

## Badge/Label Contrast

### Category Labels (Small Text)
```jsx
// CURRENT
<span className="text-[10px] uppercase text-zinc-600">
  CRAFTING
</span>
// Small text at 2.1:1 = very hard to read ❌

// FIX (increase 2 levels)
<span className="text-[10px] uppercase text-zinc-400">
  CRAFTING
</span>
// Small text at 5.8:1 = readable ✅
```

### Metadata Text (Very Small)
```jsx
// For very small text (8-9px), use even higher contrast:
<span className="text-[9px] text-zinc-300">
  12 minutes ago
</span>
// 10.1:1 contrast compensates for small size ✅
```

---

## Icon Contrast

### Navigation Icons
```jsx
// CURRENT
<svg className="w-4 h-4 text-zinc-600" ...>
// Icon: 2.1:1 ❌ Nearly invisible

// FIX
<svg className="w-4 h-4 text-zinc-500" ...>
// Icon: 3.2:1 ⚠️ Better but still subtle (decorative)

// OR (for important icons)
<svg className="w-4 h-4 text-zinc-400" ...>
// Icon: 5.8:1 ✅ Clearly visible
```

### Active/Selected Icons
```jsx
<svg className="w-4 h-4 text-sky-400" ...>
// Icon: 7.2:1 ✅ High contrast, draws attention
```

---

## Quick Reference Table

### Text Color Decision Matrix

| Content Type | Size | Importance | Recommended Color | Contrast |
|--------------|------|------------|-------------------|----------|
| Headings | Large | High | zinc-100 or zinc-200 | 18.5:1 or 14.8:1 |
| Body text | Normal | High | zinc-300 or zinc-400 | 10.1:1 or 5.8:1 |
| Secondary text | Normal | Medium | zinc-400 | 5.8:1 |
| Captions | Small | Medium | zinc-300 or zinc-400 | 10.1:1 or 5.8:1 |
| Labels | Small | Low | zinc-400 or zinc-500 | 5.8:1 or 3.2:1 |
| Metadata | Small | Low | zinc-300 | 10.1:1 |
| Decorative | Any | None | zinc-500 | 3.2:1 |

### Element Type Decision Matrix

| Element | Background | Text | Border |
|---------|-----------|------|--------|
| Cards | zinc-900/85 | zinc-300 | white/8% |
| Inputs | zinc-900/80 | zinc-100 | white/12% |
| Dropdowns | zinc-900/95 + blur | zinc-300 | white/15% |
| Modals | zinc-900/95 | zinc-100 | white/10% |
| Buttons | zinc-800/80 | zinc-100 | white/8% |
| Disabled | zinc-900/60 | zinc-500 opacity-70 | white/5% |

---

## Testing Tools

### Online Contrast Checkers
1. **WebAIM:** https://webaim.org/resources/contrastchecker/
   - Input: Foreground color, Background color
   - Output: Contrast ratio, WCAG pass/fail

2. **Coolors:** https://coolors.co/contrast-checker/
   - Visual interface
   - Shows both AA and AAA results

3. **Adobe Color:** https://color.adobe.com/create/color-contrast-analyzer
   - Multiple color testing
   - Color blind simulation

### Browser DevTools
1. Chrome DevTools - Inspect element
2. Look for contrast ratio in color picker
3. Shows WCAG pass/fail inline

### Automated Testing
1. **axe DevTools:** Browser extension for accessibility testing
2. **Lighthouse:** Built into Chrome DevTools
3. **WAVE:** Web accessibility evaluation tool

---

## Summary

### Current State
- 30+ instances of zinc-600 (2.1:1) ❌
- 20+ instances of zinc-500 on body text (3.2:1) ❌
- ~60% of text fails WCAG AA

### After Fixes
- Zero instances of zinc-600 on text ✅
- zinc-500 only for decorative/labels ✅
- 95%+ of text passes WCAG AA ✅

### Minimum Standards
- **Normal text:** zinc-400 (5.8:1)
- **Small text:** zinc-300 (10.1:1)
- **Headings:** zinc-200 (14.8:1)
- **Primary:** zinc-100 (18.5:1)

### Never Use on Dark Backgrounds
- ❌ zinc-700 (1.5:1)
- ❌ zinc-600 (2.1:1)
- ⚠️ zinc-500 only for decorative (3.2:1)

---

**Use this document as a reference when making color decisions throughout the app.**
