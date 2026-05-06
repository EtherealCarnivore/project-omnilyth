---
name: calc-new
description: Scaffold a new Path of Exile calculator in Project Omnilyth — generates the calculator/component/page trio AND wires it into src/modules/registry.js. Use when adding a new tool. Requires a kebab-case name as argument (e.g. /calc-new fusing-redux). Will ask for category, subcategory, route, icon, and description if they aren't already obvious from context.
---

# /calc-new — scaffold a new calculator

You are implementing the canonical "new calculator" workflow for Project Omnilyth. By the time this skill exits, four files exist (or have edits queued) and the user can `npm run dev` and click the new tool.

The user has invoked: `/calc-new $ARGUMENTS`

---

## Step 1 — parse and validate the name

The single argument is the **kebab-case calculator name** (e.g. `fusing-redux`, `delve-cost`, `headhunter-roll`).

From it, derive:

- **kebab-case** (used for `id`, `route` slug, `icon` slug): `delve-cost`
- **camelCase** (used for the calculator file name and the exported function): `delveCost` → `delveCostCalc`, `calculateDelveCost`
- **PascalCase** (used for the page component, the UI component, and the file names): `DelveCost` → `DelveCostPage`, `DelveCostCalculator`

If `$ARGUMENTS` is empty or not kebab-case, **ask the user for it once**, then proceed. Do not invent a name.

---

## Step 2 — collect the rest of the metadata

The registry entry needs five more fields. Check whether the user has already supplied these in the prompt or earlier in the conversation; ask only for what's missing. Ask all the missing items in **one** question, not five sequential ones.

Required:

- **category** — one of: `Crafting`, `Atlas`, `Jewels`, `Build Planning`, `Leveling`, `Tools`, `Regex Library`. Read `src/modules/registry.js` to confirm the live set before asking.
- **subcategory** — examples by category: Crafting → `Coloring` / `Links & Sockets` / `Item Search`; Atlas → `Maps` / `Scarabs` / `Kingsmarch` / `Atlas Tree`; Jewels → `Cluster Jewels` / `Timeless Jewels`; Leveling → `Guide` / `Gems` / `Vendors` / `Campaign`. If the new calc fits an existing subcategory, use it; otherwise propose a new one.
- **route** — `/{category-slug}/{kebab-name}`. For most categories the slug is `lowercase(category)`; suggest the route automatically and confirm.
- **icon** — short slug matching an existing icon under `public/icons/` if reusable; otherwise the user provides a placeholder like `placeholder` and adds the SVG later.
- **description** — one sentence, ≤ 12 words, written as user-facing benefit ("Find the best uniques to disenchant for Thaumaturgic Dust").

Optional:

- **`fullWidth: true`** — only for tree-style or wide-canvas pages (passive tree, atlas tree). Skip for everything else.
- **prices required?** — does the calculator consume `usePricesContext`? Determines whether the page wires in `<PriceDisclaimer />` + the prices prop. Default: yes.

---

## Step 3 — read the existing pattern (don't guess)

Before generating files, **read these references** so the new code matches the codebase's actual idioms (not your training-data assumptions):

1. `src/modules/registry.js` — to see the entry shape, current categories, and where to insert the new entry alphabetically within its category.
2. `src/calculators/fusingCalc.js` (or `chromaticCalc.js`) — calculator-file shape: header docblock, module-scope constants, exported pure functions.
3. `src/components/FusingCalculator.jsx` (or `VoriciCalculator.jsx`) — UI component shape: state hooks, calls into the calculator, renders inputs + results, uses Tailwind design tokens.
4. `src/pages/FusingPage.jsx` (or `ChromaticPage.jsx`) — page wrapper shape: imports the component, wraps in `glass-card`, conditionally renders `<PriceDisclaimer />`.

These are the **canonical references**. If a future style emerges that differs, follow the most recent file in that category.

---

## Step 4 — generate the four artifacts

### 4a. `src/calculators/{camelCase}Calc.js`

```js
/**
 * {{Title}} Calculator — <one-sentence description of the math/output>
 *
 * Inputs:  <describe>
 * Outputs: <describe>
 * Source:  <wiki / poedb / patch note URL or "validated by poe-expert YYYY-MM-DD">
 */

// Constants live at module scope so they're not re-allocated per call.
// Document each magic number — where it came from, what patch it reflects.

export function calculate{{PascalCase}}(/* destructure inputs */) {
  // Validate inputs at the boundary; trust internal call sites.
  // Pure function: same inputs → same outputs, no side effects.
  return {
    // structured result the UI can render directly
  };
}
```

### 4b. `src/components/{PascalCase}Calculator.jsx`

```jsx
import { useState, useMemo } from 'react';
import { calculate{{PascalCase}} } from '../calculators/{{camelCase}}Calc';

export default function {{PascalCase}}Calculator({ prices }) {
  // 1. Local state for inputs.
  const [inputs, setInputs] = useState({ /* defaults */ });

  // 2. Derived results — useMemo so we don't recompute on unrelated re-renders.
  const result = useMemo(
    () => calculate{{PascalCase}}({ ...inputs, prices }),
    [inputs, prices]
  );

  // 3. Render — use existing design tokens. See ui-designer agent for token reference.
  return (
    <div className="space-y-4">
      {/* Inputs section */}
      {/* Results section */}
    </div>
  );
}
```

### 4c. `src/pages/{PascalCase}Page.jsx`

If prices are required:

```jsx
import {{PascalCase}}Calculator from '../components/{{PascalCase}}Calculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import { usePricesContext } from '../contexts/PricesContext';

export default function {{PascalCase}}Page() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <PriceDisclaimer />
      <{{PascalCase}}Calculator prices={prices} />
    </div>
  );
}
```

If prices are NOT required:

```jsx
import {{PascalCase}}Calculator from '../components/{{PascalCase}}Calculator';

export default function {{PascalCase}}Page() {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <{{PascalCase}}Calculator />
    </div>
  );
}
```

### 4d. `src/modules/registry.js` — insert entry

`Edit` the existing file. Insert the new entry alphabetically *within its category block*, matching the exact shape of neighboring entries. Format:

```js
{
  id: '{{kebab-name}}',
  title: '{{Title}}',
  description: '{{description}}',
  category: '{{category}}',
  subcategory: '{{subcategory}}',
  route: '{{route}}',
  icon: '{{icon}}',
  component: lazy(() => import('../pages/{{PascalCase}}Page')),
  // fullWidth: true,   // uncomment only if the user requested fullWidth
},
```

Don't reformat the rest of the file. Don't reorder existing entries. Single-purpose insertion.

---

## Step 5 — verify and stop

1. **Read each generated file** once to confirm it lands as intended (path, syntax, imports resolve).
2. **Check the registry edit** rendered correctly (no trailing-comma weirdness; entry inside the array, not after it).
3. **Do not run `npm run dev` automatically.** The user runs that. They'll see a route at `{{route}}` that renders an empty calculator scaffold.

---

## Step 6 — hand off the rest

Tell the user the next-step delegation chain, in this exact format:

```
Scaffolded {{kebab-name}} — 4 files written, registry entry inserted.

Routes to: {{route}}
Files:
  - src/calculators/{{camelCase}}Calc.js
  - src/components/{{PascalCase}}Calculator.jsx
  - src/pages/{{PascalCase}}Page.jsx
  - src/modules/registry.js  (entry inserted)

Next steps:
  1. Define the math.
       → poe-expert agent: "What's the formula for {{Title}}? Edge cases?"
       → poe-wiki-oracle agent: "Pull the canonical values I'll need to hardcode."
  2. Implement the calculator body.
       → calculator-engineer agent (or just continue in this session).
  3. Verify against real PoE.
       → poe-expert agent for math validation.
  4. Design the UI.
       → ui-designer agent: review tokens / mobile / states.
  5. Ship gate.
       → feature-reviewer agent: SHIP / REVISE / REJECT.

Want me to kick off step 1 now?
```

End the turn. Don't auto-launch the next agent unless the user says yes.

---

## Hard rules

- **Never write the calculator math during scaffold.** Empty function bodies with the right signature only. The math step belongs to `calculator-engineer` after `poe-expert` defines the formula. Conflating the two leads to ship-gating an untested formula because "we already wrote the calculator".
- **Never invent a category, subcategory, or icon.** If unsure, ask. Bad placement compounds — it's hard to retrofit "this should have been in Atlas, not Tools" later.
- **Never edit `src/modules/registry.js` outside the single-entry insertion.** No reformatting, no sorting, no helper extraction. The registry is load-bearing — keep diffs minimal.
- **Don't add tests.** This codebase has no test framework currently; adding Vitest/Jest scaffolding is out of scope for this skill (and the user hasn't asked for it).
- **Don't add TypeScript.** This codebase is `.jsx`; CLAUDE.md explicitly rejects TS migration.
- **Reuse existing components when possible** — `PriceDisclaimer`, `SaveRegexButton` (for regex tools), `FilterSidebar`, etc. Read the existing components inventory in `ui-designer.md` before adding new ones.
