# CSS Issues by File - Detailed Breakdown

## Core Styling Files

### `src/index.css`

#### Line 48-55: Glass Card Background (CRITICAL)
```css
/* CURRENT (TOO TRANSPARENT) */
.glass-card {
  background: rgba(24, 24, 27, 0.40);  /* ← 40% opacity causes elements to blend */
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* FIX */
.glass-card {
  background: rgba(24, 24, 27, 0.85);  /* ← 85% opacity */
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```
**Impact:** Glass cards used throughout app become readable

---

#### Line 58-76: Input Styling (CRITICAL)
```css
/* CURRENT */
.calc-input {
  background: rgba(39, 39, 42, 0.60);  /* ← Too transparent */
  border: 1px solid rgba(255, 255, 255, 0.08);  /* ← Border too subtle */
}
.calc-input::placeholder {
  color: rgba(244, 244, 245, 0.35);  /* ← Placeholder too faint */
}

/* FIX */
.calc-input {
  background: rgba(39, 39, 42, 0.80);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.calc-input::placeholder {
  color: rgba(244, 244, 245, 0.50);
}
```
**Impact:** All calculator inputs become more visible

---

#### Line 126-132: Fade-In Animation (CRITICAL)
```css
/* CURRENT (STARTS INVISIBLE) */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }  /* ← Starts at 0% opacity */
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.25s ease-out both;
}

/* FIX */
@keyframes fadeIn {
  from { opacity: 0.6; transform: translateY(4px); }  /* ← Start at 60% */
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.2s ease-out both;  /* ← Faster */
}
```
**Impact:** Content visible during animation, no "blending with background"

---

## Layout Components

### `src/layout/Sidebar.jsx`

#### Line 146: Brand Subtitle (CRITICAL)
```jsx
// CURRENT
<p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">
  {/*                                                     ^^^^^^^^^ INVISIBLE */}

// FIX
<p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">
```

---

#### Line 160: Search Input Placeholder (CRITICAL)
```jsx
// CURRENT
placeholder:text-zinc-600
//          ^^^^^^^^^^^^^ INVISIBLE

// FIX
placeholder:text-zinc-400
```

---

#### Line 171: Pinned Section Header (HIGH)
```jsx
// CURRENT
<div className="... text-amber-500/70 ...">
//                    ^^^^^^^^^^^^^^^^^ 70% opacity on amber may be too faint

// FIX
<div className="... text-amber-500/80 ...">  // 80% opacity
```

---

#### Lines 38-39: Pin Button Visibility (HIGH PRIORITY)
```jsx
// CURRENT (INVISIBLE UNTIL HOVER)
className={`... ${
  isPinned
    ? 'text-amber-400 opacity-100'
    : 'text-zinc-600 opacity-0 group-hover:opacity-100'
    //                ^^^^^^^^^^^ COMPLETELY HIDDEN
}`}

// FIX
className={`... ${
  isPinned
    ? 'text-amber-400 opacity-100'
    : 'text-zinc-600/50 group-hover:opacity-100'  // Always visible at 50%
}`}
```
**Impact:** Users can discover pinning feature

---

#### Line 249: Subcategory Headers (MEDIUM)
```jsx
// CURRENT
<div className="px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600">
//                                                                  ^^^^^^^^^^^^

// FIX
<div className="px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
```

---

#### Line 273: Coming Soon Section Header (MEDIUM)
```jsx
// CURRENT
<div className="px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-600 ...">

// FIX
<div className="px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-500 ...">
```

---

#### Line 279: Coming Soon Items (MEDIUM)
```jsx
// CURRENT
<div className="px-3 py-1.5 ml-2 text-sm text-zinc-600 ...">

// FIX
<div className="px-3 py-1.5 ml-2 text-sm text-zinc-500 ...">
```

---

#### Line 58: Link Hover State (MEDIUM)
```jsx
// CURRENT
hover:bg-white/[0.04]  // Only 4% opacity - barely visible

// FIX
hover:bg-white/[0.08]  // 8% opacity - noticeable
```

---

### `src/layout/Topbar.jsx`

#### Lines 69, 248, 296: Dropdown Backgrounds (HIGH PRIORITY)
```jsx
// CURRENT (BLEND WITH PAGE)
className="absolute top-full right-0 mt-1 w-56 py-1 rounded-xl bg-zinc-900 border border-white/[0.08] ..."
//                                                                         ^^^^^^^^^^                ^^^^ Too subtle

// FIX
className="absolute top-full right-0 mt-1 w-56 py-1 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.15] shadow-2xl ..."
//                                                                         ^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^      ^^^^^^^^^ More visible
```
**Impact:** All dropdowns (league selector, price status, support) stand out

---

#### Line 234: Status Dot Colors (MEDIUM)
```jsx
// CURRENT
const dotClass = loading ? 'bg-zinc-500 animate-pulse' : error ? 'bg-red-500' : prices ? 'bg-green-500' : 'bg-zinc-600';
//                                                                                                           ^^^^^^^^^^^^

// FIX
const dotClass = loading ? 'bg-zinc-400 animate-pulse' : error ? 'bg-red-500' : prices ? 'bg-green-500' : 'bg-zinc-500';
```

---

#### Line 256: Popover Text Color (MEDIUM)
```jsx
// CURRENT
<p className="text-xs text-zinc-400 leading-relaxed">

// Already good! But check line 257:
Prices are sourced from <span className="text-zinc-300">poe.ninja</span>
// This is fine
```

---

#### Line 353: League Dropdown Label (LOW)
```jsx
// CURRENT
<span className="text-xs text-zinc-500 hidden sm:inline">League</span>

// FIX (optional)
<span className="text-xs text-zinc-400 hidden sm:inline">League</span>
```

---

### `src/layout/AppShell.jsx`

#### Line 37: Loading Spinner (OK)
```jsx
// CURRENT (GOOD)
<div className="w-6 h-6 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
// This contrast is fine - spinner is accent color
```

---

## Component Files

### `src/components/SaveRegexButton.jsx`

#### Line 138: Modal Backdrop (HIGH PRIORITY)
```jsx
// CURRENT (NOT DARK ENOUGH)
className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
//                                                                                  ^^^^^^^^^^

// FIX
className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
//                                                                                  ^^^^^^^^^^  ^^
```

---

#### Line 101: Compact Button Background (MEDIUM)
```jsx
// CURRENT
className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
//                                                                                            ^^^^^^^^^^^^

// FIX (increase contrast)
className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all bg-zinc-900/90 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
//                                                                                            ^^^^^^^^^^^^               ^^^^^^^^^^^^
```

---

#### Lines 150, 170, 176, 185, 200: Text Colors (MEDIUM)
```jsx
// CURRENT
className="text-zinc-400 ..."  // These are actually OK at zinc-400

// But line 200 could be improved:
<div className="text-xs text-zinc-500 text-right">
//                      ^^^^^^^^^^^^^

// FIX
<div className="text-xs text-zinc-400 text-right">
```

---

### `src/components/PatchNotesWidget.jsx`

#### Line 235: Modal Backdrop (HIGH PRIORITY)
```jsx
// CURRENT
className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
//                                                                                  ^^^^^^^^^^ Actually good!

// This one is already at 90%, which is better. Consider making SaveRegexButton match this.
```

---

#### Line 154: Unread Indicator (OK)
```jsx
// CURRENT (GOOD)
<span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-green-500 animate-pulse"></span>
// Green on dark background has good contrast
```

---

### `src/components/CategoryOverviewCard.jsx`

#### Line 9: Tool Count Text (MEDIUM)
```jsx
// CURRENT
<span className="text-[10px] uppercase tracking-wider text-zinc-500 ml-auto">
//                                                      ^^^^^^^^^^^^

// FIX
<span className="text-[10px] uppercase tracking-wider text-zinc-400 ml-auto">
```

---

#### Line 25: Description Text (OK)
```jsx
// CURRENT (GOOD)
<div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
// This is acceptable for secondary descriptive text
```

---

### `src/components/SocketCalculator.jsx`

#### Line 40: Description Text (OK)
```jsx
// CURRENT
<p className="text-sm text-zinc-400 mt-1">
// This is good - zinc-400 passes WCAG
```

---

#### Line 78: Label Text (OK)
```jsx
// CURRENT
<label className="text-xs uppercase tracking-wider text-zinc-400">
// Good contrast
```

---

#### Line 103: Range Labels (LOW)
```jsx
// CURRENT
<div className="flex justify-between text-[10px] text-zinc-400/60 px-0.5">
//                                                ^^^^^^^^^^^^^^^^^ 60% of zinc-400

// This is decorative text (0% and 20% labels), acceptable to be faint
// But could increase to 70% for slightly better visibility:
<div className="flex justify-between text-[10px] text-zinc-400/70 px-0.5">
```

---

### `src/components/ClusterJewelCalculator.jsx`

#### Line 226: Dropdown Menu Background (MEDIUM)
```jsx
// CURRENT
<div className="fade-in absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
//                                                                                                      ^^^^^^^^^^

// FIX (add backdrop blur)
<div className="fade-in absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl">
//                                                                                                      ^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^
```

---

#### Line 273: Disabled Notable Badge (OK)
```jsx
// CURRENT (INTENTIONALLY FADED)
disabled ? 'bg-zinc-900/30 border-zinc-800/40 opacity-50' : ...
// Disabled state should be faded, this is correct
```

---

## Page Files

### `src/pages/HomePage.jsx`

#### Lines 111-112: Pin Button on Module Cards (HIGH PRIORITY)
```jsx
// CURRENT (SAME ISSUE AS SIDEBAR)
className={`... ${
  pinned
    ? 'text-amber-400 opacity-100 bg-amber-400/10'
    : 'text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-zinc-300 hover:bg-white/[0.06]'
    //                ^^^^^^^^^^^ INVISIBLE
}`}

// FIX
className={`... ${
  pinned
    ? 'text-amber-400 opacity-100 bg-amber-400/10'
    : 'text-zinc-600/50 group-hover:opacity-100 hover:text-zinc-300 hover:bg-white/[0.06]'
    //                ^^^^^ Always visible at 50%
}`}
```

---

#### Line 147: Module Card Category Label (MEDIUM)
```jsx
// CURRENT
<span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
//                                                      ^^^^^^^^^^^^

// FIX
<span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
```

---

#### Line 150: Module Card Subcategory (MEDIUM)
```jsx
// CURRENT
<span className="text-[10px] uppercase tracking-wider text-zinc-600">
//                                                      ^^^^^^^^^^^^

// FIX
<span className="text-[10px] uppercase tracking-wider text-zinc-500">
```

---

#### Line 196: Hub Card Description (OK)
```jsx
// CURRENT (GOOD)
<p className="text-sm text-zinc-500 mt-1 leading-relaxed">
// This is acceptable for hub card descriptions
```

---

#### Line 255: Search Icon (LOW)
```jsx
// CURRENT
<svg className="... w-4 h-4 text-zinc-500" ...>
//                          ^^^^^^^^^^^^

// FIX (slightly brighter)
<svg className="... w-4 h-4 text-zinc-400" ...>
```

---

#### Line 263: Search Input (MEDIUM)
```jsx
// CURRENT
className="w-full bg-zinc-900/60 border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 ..."
//                ^^^^^^^^^^^^^^        ^^^^^^^^^^^^^^^^^^^

// FIX
className="w-full bg-zinc-900/80 border border-white/[0.12] rounded-xl py-3 pl-11 pr-4 ..."
//                ^^^^^^^^^^^^^^        ^^^^^^^^^^^^^^^^^^^
```

---

#### Line 336: Credits Toggle Button (LOW)
```jsx
// CURRENT
<button className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
//                        ^^^^^^^^^^^^

// FIX
<button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
```

---

#### Line 341: Credits Footer (LOW)
```jsx
// CURRENT
<footer className="text-xs text-zinc-500 space-y-1 mt-2 animate-in fade-in">
//                        ^^^^^^^^^^^^

// This is actually fine for footer text, but links inside need checking:
<a href="..." className="underline hover:text-zinc-300 transition-colors">
// Missing explicit text color! Add: text-zinc-400

// FIX
<a href="..." className="text-zinc-400 underline hover:text-zinc-200 transition-colors">
```

---

### `src/pages/RegexLibraryPage.jsx`

#### Multiple text color issues throughout:
- Line 60: `text-zinc-100` ✅ GOOD
- Line 63: `text-zinc-400` ✅ GOOD
- Line 73: `text-zinc-300` ✅ GOOD
- Line 74: `text-zinc-500` - Could be zinc-400
- Line 133: `text-zinc-300` ✅ GOOD
- Line 138: `text-zinc-400` ✅ GOOD
- Line 150: `text-zinc-400` ✅ GOOD
- Line 166: `text-zinc-500` - Could be zinc-400
- Line 184: `text-zinc-700` ❌ CRITICAL - Change to zinc-500
- Line 190: `text-zinc-300` ✅ GOOD
- Line 193: `text-zinc-500` - Could be zinc-400
- Line 209: `text-zinc-100` ✅ GOOD
- Line 216: `text-zinc-500` - Could be zinc-400

**Most critical:** Line 184 uses `text-zinc-700` which is nearly invisible

---

### `src/pages/VendorLevelingPage.jsx`

#### Line 213, 394: Button States (OK but could improve)
```jsx
// CURRENT
isEnabled
  ? 'bg-indigo-500/10 ring-1 ring-indigo-400/30 ...'
  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
  //  ^^^^^^^^^^^^^^               ^^^^^^^^^^^^

// Consider increasing disabled state opacity:
  : 'bg-zinc-900/70 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70'
```

---

### `src/pages/CraftingOverviewPage.jsx`

#### Line 55: Category Link (OK)
```jsx
// CURRENT
className="text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-zinc-400 hover:text-sky-400 ..."
//                                                                       ^^^^^^^^^^^^

// Actually good - zinc-400 is acceptable here
// But border could be slightly stronger:
border-white/[0.08]  // Instead of 0.06
```

---

## Summary by Priority

### Critical Files (Fix First)
1. `src/index.css` - 3 critical issues
2. `src/layout/Sidebar.jsx` - 3 critical text colors
3. `src/layout/Topbar.jsx` - 3 dropdown backgrounds
4. `src/pages/HomePage.jsx` - Pin button visibility
5. `src/components/SaveRegexButton.jsx` - Modal backdrop

### High Priority Files
1. `src/pages/RegexLibraryPage.jsx` - Multiple text colors including one zinc-700
2. `src/components/ClusterJewelCalculator.jsx` - Dropdown backgrounds
3. `src/components/ItemBaseSelector.jsx` - Dropdown backgrounds

### Medium Priority Files
1. All calculator components - Various text color improvements
2. All page components - Search inputs, labels
3. All card components - Border and text visibility

---

## Search & Replace Patterns

### Regex Patterns for Find & Replace

```regex
# Pattern 1: text-zinc-600 (critical)
Find:    text-zinc-600
Replace: text-zinc-400

# Pattern 2: text-zinc-700 (critical)
Find:    text-zinc-700
Replace: text-zinc-500

# Pattern 3: opacity-0 (for pin buttons only)
Find:    opacity-0 group-hover:opacity-100
Replace: opacity-50 group-hover:opacity-100

# Pattern 4: bg-zinc-900 border border-white/\[0\.08\] (dropdowns)
Find:    bg-zinc-900 border border-white/\[0\.08\]
Replace: bg-zinc-900/95 backdrop-blur-xl border border-white/[0.15]

# Pattern 5: hover:bg-white/\[0\.04\] (hover states)
Find:    hover:bg-white/\[0\.04\]
Replace: hover:bg-white/\[0\.08\]
```

---

## Testing Each Fix

### Glass Card Test
1. Open any calculator page
2. Check card backgrounds are solid enough
3. Text should not blend with content behind

### Text Color Test
1. Open Sidebar
2. Check "PoE Toolkit" subtitle is visible
3. Check "Coming Soon" section is readable
4. Check all category labels are visible

### Pin Button Test
1. Open Homepage
2. Pin buttons should be faintly visible on all cards
3. Hover should make them brighter
4. Pinned items should have amber color

### Dropdown Test
1. Click league selector in Topbar
2. Dropdown should stand out from page
3. Background should be distinct
4. Text should be clearly readable

### Animation Test
1. Navigate between pages
2. Content should be visible during fade-in
3. No "invisible" moment
4. Smooth appearance

---

## File Edit Count

- `src/index.css`: 4 sections
- `src/layout/Sidebar.jsx`: ~8 lines
- `src/layout/Topbar.jsx`: ~5 sections
- `src/pages/HomePage.jsx`: ~6 locations
- `src/components/SaveRegexButton.jsx`: ~3 locations
- `src/components/PatchNotesWidget.jsx`: ~1 location
- `src/pages/RegexLibraryPage.jsx`: ~5 locations
- Other files: ~20 minor updates

**Total estimated edits: ~50 locations across 20 files**

---

## Verification Checklist

After making all fixes, verify:

- [ ] All text passes WCAG AA (4.5:1 minimum)
- [ ] Pin buttons visible on all module cards
- [ ] Dropdowns stand out from page background
- [ ] Glass cards have opaque backgrounds
- [ ] Inputs have clear borders and placeholders
- [ ] Hover states are noticeable
- [ ] Animations don't cause invisibility
- [ ] Modal backdrops sufficiently darken page
- [ ] No `text-zinc-600` or `text-zinc-700` remain
- [ ] All interactive elements discoverable
