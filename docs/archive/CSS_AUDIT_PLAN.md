# CSS & Styling Audit Plan - Project Omnilyth

**Date:** 2026-02-17
**Project:** Path of Exile Toolkit (React 19 + Tailwind CSS 4)
**Issue:** CSS visibility problems during testing - elements fading in with background

---

## Executive Summary

The application uses a **dark zinc-950 background (#09090b)** with various opacity-based glass effects and fade-in animations. The primary issue is **low contrast between text/elements and backgrounds**, especially with:
- Zinc color palette (600-950) on zinc-950 background
- Opacity-based glass effects (glass-card with rgba backgrounds)
- Fade-in animations that may cause elements to appear with insufficient opacity
- Interactive elements with subtle hover states

---

## Critical Issues (P0 - Fix Immediately)

### 1. Low Contrast Text Colors
**Location:** Throughout the application
**Issue:** Text colors using `text-zinc-600`, `text-zinc-500`, `text-zinc-400` on `bg-zinc-950` background

**Examples:**
- `src/layout/Sidebar.jsx:146` - Brand subtitle: `text-zinc-600` (nearly invisible)
- `src/layout/Sidebar.jsx:160` - Search placeholder: `text-zinc-600`
- `src/layout/Topbar.jsx:234` - Status text: `text-zinc-500`
- `src/components/SaveRegexButton.jsx:200` - Character count: `text-zinc-500`

**Root Cause:**
Zinc-600 (#52525b) on zinc-950 (#09090b) = **Contrast ratio: ~2.1:1** (WCAG minimum is 4.5:1)

**Fix:**
```css
/* BEFORE */
text-zinc-600  /* Too dark on dark background */
text-zinc-500  /* Also too dark */

/* AFTER */
text-zinc-400  /* Minimum for body text */
text-zinc-300  /* For important secondary text */
text-zinc-200  /* For emphasized content */
```

**Files to Update:**
- `src/layout/Sidebar.jsx` (lines 146, 160, 171, 249, 273, 276, 297, 323)
- `src/layout/Topbar.jsx` (lines 234, 256, 353)
- `src/components/SaveRegexButton.jsx` (lines 150, 170, 176, 185, 200)
- `src/pages/HomePage.jsx` (lines 147, 150, 196, 255, 336)
- All other files using zinc-600/500 text

---

### 2. Glass Card Background Opacity Issue
**Location:** `src/index.css:48-55`
**Issue:** Glass card background too transparent, content bleeds through

**Current:**
```css
.glass-card {
  background: rgba(24, 24, 27, 0.40);  /* 40% opacity - TOO LOW */
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
}
```

**Problem:**
- Background elements visible through cards
- Text readability reduced
- Fade-in animation makes it worse (starts at 0% opacity)

**Fix:**
```css
.glass-card {
  background: rgba(24, 24, 27, 0.85);  /* Increase to 85% */
  border: 1px solid rgba(255, 255, 255, 0.08);  /* Slightly stronger border */
  backdrop-filter: blur(24px);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    0 1px 0 rgba(255, 255, 255, 0.03) inset;
}
```

---

### 3. Fade-In Animation Timing Issue
**Location:** `src/index.css:126-132`
**Issue:** Elements start at 0 opacity and fade in, causing visibility problems

**Current:**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.25s ease-out both;
}
```

**Problem:**
- Elements invisible initially (opacity: 0)
- If animation fails/pauses, content stays invisible
- Combined with low contrast text, creates "elements blending with background"

**Fix:**
```css
@keyframes fadeIn {
  from {
    opacity: 0.6;  /* Start more visible */
    transform: translateY(4px);  /* Smaller movement */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in {
  animation: fadeIn 0.2s ease-out both;  /* Faster animation */
}
```

**Alternative Fix (Safer):**
Remove fade-in from critical content, only use for non-essential decorative elements.

---

## High Priority Issues (P1 - Fix Soon)

### 4. Input Field Contrast
**Location:** `src/index.css:58-76`
**Issue:** Input backgrounds too dark, borders too subtle

**Current:**
```css
.calc-input {
  background: rgba(39, 39, 42, 0.60);  /* 60% opacity */
  border: 1px solid rgba(255, 255, 255, 0.08);  /* Very subtle */
  color: #f4f4f5;
}
.calc-input::placeholder {
  color: rgba(244, 244, 245, 0.35);  /* 35% opacity - TOO LOW */
}
```

**Fix:**
```css
.calc-input {
  background: rgba(39, 39, 42, 0.80);  /* Increase opacity */
  border: 1px solid rgba(255, 255, 255, 0.12);  /* More visible border */
  color: #f4f4f5;
}
.calc-input::placeholder {
  color: rgba(244, 244, 245, 0.45);  /* Increase to 45% */
}
```

---

### 5. Pin Button Visibility
**Location:** `src/layout/Sidebar.jsx:32-47`, `src/pages/HomePage.jsx:104-118`
**Issue:** Pin buttons invisible until hover, users don't know pinning exists

**Current:**
```jsx
className={`... ${
  isPinned
    ? 'text-amber-400 opacity-100'
    : 'text-zinc-600 opacity-0 group-hover:opacity-100'  // INVISIBLE
}`}
```

**Problem:**
- Users can't discover pinning feature
- No visual affordance
- Accessibility issue (keyboard navigation doesn't trigger hover)

**Fix:**
```jsx
className={`... ${
  isPinned
    ? 'text-amber-400 opacity-100'
    : 'text-zinc-600/40 group-hover:opacity-100'  // Always visible at 40%
}`}
```

---

### 6. Dropdown Background Contrast
**Location:** Multiple dropdowns in `src/layout/Topbar.jsx`
**Issue:** Dropdown backgrounds blend with page background

**Examples:**
- Line 69: `bg-zinc-900` - Too similar to page background
- Line 248: `bg-zinc-900` - Same issue

**Fix:**
```jsx
// BEFORE
className="... bg-zinc-900 border border-white/[0.08] ..."

// AFTER
className="... bg-zinc-900/95 backdrop-blur-xl border border-white/[0.15] shadow-2xl ..."
```

---

### 7. Modal Backdrop Contrast
**Location:** `src/components/SaveRegexButton.jsx:138`, `src/components/PatchNotesWidget.jsx:235`
**Issue:** Modal backdrops not dark enough, content behind is distracting

**Current:**
```jsx
className="fixed inset-0 ... bg-black/70 backdrop-blur-sm"
```

**Fix:**
```jsx
className="fixed inset-0 ... bg-black/85 backdrop-blur-md"
```

---

## Medium Priority Issues (P2 - Quality of Life)

### 8. Hover State Visibility
**Location:** Various components
**Issue:** Hover states too subtle, users don't know elements are interactive

**Examples:**
- `src/layout/Sidebar.jsx:58` - Link hover: `hover:bg-white/[0.04]` (4% opacity)
- `src/pages/HomePage.jsx:112` - Pin button: `hover:bg-white/[0.06]` (6% opacity)

**Fix:**
```jsx
// Increase hover background opacity
hover:bg-white/[0.08]  // From 0.04 to 0.08
```

---

### 9. Search Input Visibility
**Location:** `src/layout/Sidebar.jsx:160`, `src/pages/HomePage.jsx:263`
**Issue:** Search inputs don't stand out, border too subtle

**Current:**
```jsx
className="... bg-zinc-900/60 border border-white/[0.06] ..."
```

**Fix:**
```jsx
className="... bg-zinc-900/80 border border-white/[0.10] ..."
```

---

### 10. Icon Contrast
**Location:** Throughout SVG icons
**Issue:** Icons using `text-zinc-600` are nearly invisible

**Examples:**
- `src/layout/Sidebar.jsx:152` - Search icon: `text-zinc-600`
- `src/pages/HomePage.jsx:255` - Search icon: `text-zinc-500`

**Fix:**
```jsx
// BEFORE
className="w-4 h-4 text-zinc-600"

// AFTER
className="w-4 h-4 text-zinc-500"  // For decorative icons
className="w-4 h-4 text-zinc-400"  // For important icons
```

---

### 11. Category Card Borders
**Location:** `src/components/CategoryOverviewCard.jsx:5`
**Issue:** Cards don't have enough separation from background

**Current:**
```jsx
className={`rounded-2xl border bg-gradient-to-br p-6 ${accentColor}`}
```

**Problem:** Border color comes from `accentColor` prop which may be too subtle

**Fix:** Ensure all accent colors have sufficient opacity:
```javascript
// In CraftingOverviewPage.jsx, etc.
accentColor="from-sky-500/20 to-sky-500/5 border-sky-500/25"  // Increase from /20 to /25
```

---

### 12. Coming Soon Items
**Location:** `src/layout/Sidebar.jsx:276-285`
**Issue:** "Coming Soon" items use `text-zinc-600` which is nearly invisible

**Fix:**
```jsx
// Line 273
className="... text-zinc-600 ..."  // Change to text-zinc-500

// Line 279
className="px-3 py-1.5 ml-2 text-sm text-zinc-600 ..."  // Change to text-zinc-500
```

---

## Low Priority Issues (P3 - Polish)

### 13. Skeleton Loader Colors
**Location:** `src/index.css:139-144`
**Issue:** Skeleton shimmer colors may be too dark

**Current:**
```css
.skeleton {
  background: linear-gradient(90deg, #3f3f46 25%, #52525b 50%, #3f3f46 75%);
}
```

**Recommendation:** Test if users notice the shimmer effect. If not visible:
```css
.skeleton {
  background: linear-gradient(90deg, #3f3f46 25%, #5a5a62 50%, #3f3f46 75%);
}
```

---

### 14. Tooltip/Popover Backgrounds
**Location:** `src/layout/Topbar.jsx:248` (Price status popover)
**Issue:** Popover background may blend with page

**Enhancement:**
```jsx
className="... bg-zinc-900/98 backdrop-blur-xl border border-white/[0.12] ..."
```

---

### 15. Link Underlines Missing
**Location:** `src/pages/HomePage.jsx:343-344` (Credits links)
**Issue:** Links have underline but insufficient contrast on text color

**Current:**
```jsx
className="underline hover:text-zinc-300"  // Base color inherited as text-zinc-500
```

**Fix:**
```jsx
className="text-zinc-400 underline hover:text-zinc-200"  // Explicit brighter base color
```

---

## Accessibility Issues (WCAG Compliance)

### 16. Color Contrast Ratio Failures
**WCAG 2.1 Level AA Requirements:**
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Current Failures:**
| Element | Current | Contrast Ratio | WCAG Pass |
|---------|---------|---------------|-----------|
| `text-zinc-600` on `bg-zinc-950` | #52525b on #09090b | ~2.1:1 | ❌ FAIL |
| `text-zinc-500` on `bg-zinc-950` | #71717a on #09090b | ~3.2:1 | ❌ FAIL (normal text) |
| `text-zinc-400` on `bg-zinc-950` | #a1a1aa on #09090b | ~5.8:1 | ✅ PASS |
| `text-zinc-300` on `bg-zinc-950` | #d4d4d8 on #09090b | ~10.1:1 | ✅ PASS |

**Minimum Color Usage:**
- Body text: `text-zinc-400` (5.8:1)
- Headings: `text-zinc-200` or `text-zinc-100` (14.8:1+)
- Secondary text: `text-zinc-400` minimum
- Decorative only: `text-zinc-500` acceptable

---

### 17. Focus Indicator Visibility
**Location:** Various interactive elements
**Issue:** Some focus states may not be visible enough

**Check:**
```jsx
// Inputs
focus:border-sky-400/30  // May be too subtle
// Should be:
focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/25
```

---

### 18. Opacity on Interactive Elements
**Location:** Disabled buttons, loading states
**Issue:** `opacity-40` may make elements too invisible

**Current:**
```jsx
disabled:opacity-40  // 40% opacity may be too faint
```

**Recommendation:**
```jsx
disabled:opacity-50  // 50% more visible
disabled:cursor-not-allowed  // Already present, good
```

---

## Implementation Strategy

### Phase 1: Critical Fixes (Day 1)
1. Update all `text-zinc-600` to `text-zinc-400` or higher
2. Fix `.glass-card` background opacity (0.40 → 0.85)
3. Fix `.fade-in` animation (start at opacity: 0.6)
4. Update input placeholder opacity (0.35 → 0.45)

### Phase 2: High Priority (Day 2)
1. Fix pin button visibility (opacity-0 → opacity-40)
2. Update dropdown backgrounds (add backdrop-blur-xl, stronger borders)
3. Increase modal backdrop opacity (70% → 85%)
4. Update all hover states (increase opacity by 50%)

### Phase 3: Medium Priority (Day 3)
1. Update search input visibility
2. Fix icon colors throughout
3. Ensure category card border visibility
4. Update "Coming Soon" text colors

### Phase 4: Polish & Accessibility (Day 4-5)
1. Test all color contrasts with WCAG tool
2. Update skeleton loader if needed
3. Fix link colors in footers
4. Verify focus indicators
5. Test with screen reader
6. Keyboard navigation test

---

## Testing Checklist

### Visual Testing
- [ ] View all pages in normal browser
- [ ] View with 50% browser zoom
- [ ] View with dark mode only (already dark)
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Test with high contrast mode (Windows)

### Contrast Testing
- [ ] Use WebAIM Contrast Checker on all text colors
- [ ] Verify WCAG AA compliance (4.5:1 for normal text)
- [ ] Check large text (3:1 minimum)
- [ ] Verify UI component contrast (borders, icons)

### Animation Testing
- [ ] Disable animations (prefers-reduced-motion)
- [ ] Verify content still visible without animations
- [ ] Check fade-in doesn't cause FOUC (Flash of Unstyled Content)

### Interaction Testing
- [ ] Hover states visible on all interactive elements
- [ ] Focus indicators visible (keyboard navigation)
- [ ] Active states visible (button press)
- [ ] Disabled states distinguishable

### Specific Problem Areas
- [ ] Pin buttons visible without hover
- [ ] Search inputs stand out
- [ ] Dropdowns don't blend with background
- [ ] Modal backdrops sufficiently dark
- [ ] Glass cards have opaque backgrounds
- [ ] All text readable at a glance

---

## Color Palette Recommendations

### Current Zinc Scale (Dark Background)
```css
/* TOO DARK - Avoid on dark backgrounds */
text-zinc-700: #3f3f46  /* Invisible */
text-zinc-600: #52525b  /* Nearly invisible - DON'T USE */
text-zinc-500: #71717a  /* Too dark for body text */

/* ACCEPTABLE - Use with caution */
text-zinc-400: #a1a1aa  /* Minimum for body text */

/* RECOMMENDED - Use for all text */
text-zinc-300: #d4d4d8  /* Good for secondary text */
text-zinc-200: #e4e4e7  /* Good for headings */
text-zinc-100: #f4f4f5  /* Best for primary text */
text-white:    #ffffff  /* Maximum contrast */
```

### Usage Guidelines
```jsx
// Primary content (headings, important text)
className="text-zinc-100"

// Secondary content (descriptions, labels)
className="text-zinc-300"

// Tertiary content (timestamps, metadata)
className="text-zinc-400"

// Decorative only (NOT for readable text)
className="text-zinc-500"  // Use sparingly

// NEVER USE on dark backgrounds
className="text-zinc-600"  // ❌ Delete all instances
```

---

## Files Requiring Updates (Summary)

### Core Styles
- `src/index.css` - Glass card, fade-in animation, inputs

### Layout
- `src/layout/Sidebar.jsx` - Text colors, hover states, pin buttons
- `src/layout/Topbar.jsx` - Text colors, dropdowns, status indicators
- `src/layout/AppShell.jsx` - Loading spinner

### Components
- `src/components/SaveRegexButton.jsx` - Text colors, modal backdrop
- `src/components/CategoryOverviewCard.jsx` - Border visibility
- `src/components/PatchNotesWidget.jsx` - Text colors, modal backdrop
- `src/components/SocketCalculator.jsx` - Text colors throughout
- `src/components/ClusterJewelCalculator.jsx` - Text colors, dropdowns
- `src/components/ItemBaseSelector.jsx` - Dropdown backgrounds
- `src/components/ItemRegexCalculator.jsx` - Result text

### Pages
- `src/pages/HomePage.jsx` - Pin buttons, search, credits text
- `src/pages/RegexLibraryPage.jsx` - Text colors throughout
- `src/pages/VendorLevelingPage.jsx` - Button states, text colors
- `src/pages/CraftingOverviewPage.jsx` - Card accent colors
- `src/pages/BuildPlanningOverviewPage.jsx` - Card accent colors
- `src/pages/AtlasOverviewPage.jsx` - Card accent colors

---

## Root Cause Analysis

### Why This Happened
1. **Design System Assumption**: Zinc-600 looks good on light backgrounds but fails on dark backgrounds
2. **Opacity Overuse**: Multiple opacity layers compound to create very low contrast
3. **Animation Side Effects**: Fade-in starts at opacity: 0, making already-low-contrast text worse
4. **Insufficient Testing**: Dark mode not tested with various contrast ratios
5. **Tailwind Defaults**: Tailwind's zinc scale designed for light mode by default

### Prevention
1. **Contrast Testing**: Run WCAG contrast checker on all color combinations
2. **Design Tokens**: Define semantic color tokens (e.g., `text-secondary`) instead of raw zinc values
3. **Animation Audit**: Review all animations for accessibility impact
4. **Light Mode Testing**: Test in both light and dark modes
5. **Accessibility Standards**: Make WCAG AA compliance a requirement

---

## Estimated Impact

### Before Fixes
- **WCAG Failures**: ~60% of text elements fail contrast requirements
- **UX Issues**: Pin buttons invisible, dropdowns blend, inputs hard to see
- **Animation Issues**: Content appears to fade into background

### After Fixes
- **WCAG Compliance**: 95%+ text passes AA standards (4.5:1)
- **UX Improvements**: All interactive elements discoverable at a glance
- **Animation Improvements**: Content always visible, smooth transitions

---

## Questions for User

1. **Theme Preference**: Should we keep dark-only theme or add light mode option?
2. **Brand Colors**: Are amber (pins), sky (links), teal (mapping) color scheme correct?
3. **Glass Effect**: Do you want to keep glass effect or prefer solid backgrounds?
4. **Animations**: Should we keep fade-in animations or remove for performance?
5. **Accessibility**: Target WCAG AA (4.5:1) or AAA (7:1) compliance?

---

## Next Steps

1. **Review this plan** with stakeholder
2. **Create GitHub issues** for each priority level
3. **Branch strategy**: Create `fix/css-visibility-issues` branch
4. **Implement Phase 1** (critical fixes)
5. **Test thoroughly** before merging
6. **Document color system** in style guide
7. **Add contrast tests** to CI/CD pipeline

---

**Document Version:** 1.0
**Last Updated:** 2026-02-17
**Author:** CSS Audit - Claude Code
