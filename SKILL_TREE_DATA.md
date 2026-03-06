# Skill Tree Data — Source, Update, and Usage Guide

How the passive skill tree and atlas tree data gets into Omnilyth, and how to update it each league.

---

## Data Sources

Both trees come from GGG's official GitHub exports:

| Tree | Repo | File We Use | Current Version |
|------|------|-------------|-----------------|
| Passive Skill Tree | [grindinggear/skilltree-export](https://github.com/grindinggear/skilltree-export) | `data.json` | 3.27.0g |
| Atlas Tree | [grindinggear/atlastree-export](https://github.com/grindinggear/atlastree-export) | `league.json` | 3.27.0 |

GGG updates these repos around league launch (sometimes a day or two before, sometimes on patch day). The skilltree-export repo also has `alternate.json`, `ruthless.json`, and `ruthless-alternate.json` — we only use `data.json`.

### Other files in GGG's repos

```
skilltree-export/
├── assets/          # Sprite sheet PNGs (we DON'T use these — we load from web.poecdn.com)
├── data.json        # ← THIS is what we copy into passiveTreeData.json
├── alternate.json   # Alternate ascendancies (not used)
├── ruthless.json    # Ruthless mode tree (not used)
└── ruthless-alternate.json

atlastree-export/
├── assets/          # Atlas sprite sheets (same — loaded from CDN)
├── data.json        # Standard (permanent) atlas
├── league.json      # ← THIS is what we copy into atlasTreeData.json
├── ruthless.json    # Ruthless atlas (not used)
└── ruthless-league.json
```

---

## Where the Data Lives in Omnilyth

```
src/data/
├── passive/
│   ├── passiveTreeData.json        # 5.3MB — raw GGG export (data.json, renamed)
│   └── passiveTreeConstants.js     # Orbit radii, node sizes, frame names, zoom config
├── atlas/
│   ├── atlasTreeData.json          # 1.3MB — raw GGG export (league.json, renamed)
│   └── atlasTreeConstants.js       # Atlas-specific orbit/zoom/node config
```

The JSON files are committed to the repo as-is — no transformation step. They're the exact output from GGG's export.

---

## How to Update for a New League

### Step 1: Get the new data

GGG pushes updates to their repos around league launch. Check for new releases:

- Passive: https://github.com/grindinggear/skilltree-export/releases
- Atlas: https://github.com/grindinggear/atlastree-export/releases

Download the raw JSON directly:

```bash
# Passive tree
curl -L https://raw.githubusercontent.com/grindinggear/skilltree-export/master/data.json \
  -o src/data/passive/passiveTreeData.json

# Atlas tree (league variant — changes each league)
curl -L https://raw.githubusercontent.com/grindinggear/atlastree-export/master/league.json \
  -o src/data/atlas/atlasTreeData.json
```

### Step 2: Verify

```bash
# Check the files aren't empty/corrupted
node -e "const d = require('./src/data/passive/passiveTreeData.json'); console.log('Nodes:', Object.keys(d.nodes).length, '| Groups:', Object.keys(d.groups).length)"

node -e "const d = require('./src/data/atlas/atlasTreeData.json'); console.log('Nodes:', Object.keys(d.nodes).length, '| Groups:', Object.keys(d.groups).length)"
```

Expected output (3.27 reference):
- Passive: ~3,281 nodes, ~748 groups
- Atlas: ~960 nodes, ~239 groups

### Step 3: Check for breaking changes

GGG occasionally changes the JSON structure. Recent example from 3.27.0g:
> "Group backgrounds are now defined within group objects" and "all image assets are now in spritesheet format"

If the structure changes, you may need to update:
- `src/hooks/usePassiveTreeData.js` — data loading and transformation
- `src/hooks/useAtlasTreeData.js` — same for atlas
- `src/data/passive/passiveTreeConstants.js` — if orbit/zoom constants change
- `src/data/atlas/atlasTreeConstants.js` — same for atlas

### Step 4: Build and test

```bash
npm run build    # Should complete without errors
npm run dev      # Load the passive tree page, verify nodes render
```

Things to visually check:
- Nodes appear in correct positions (not stacked or scattered)
- Connections draw between correct nodes
- Sprite icons load (from web.poecdn.com CDN)
- Class selection works (all 7 classes)
- Ascendancy subtrees render
- Search finds nodes by name/stat

### Step 5: Update constants if needed

If GGG changes total passive points or ascendancy points (rare, but happens):

```javascript
// src/data/passive/passiveTreeConstants.js
export const TOTAL_PASSIVE_POINTS = 123;      // Check patch notes
export const TOTAL_ASCENDANCY_POINTS = 8;     // Check patch notes
```

Atlas total points are read from the JSON itself (`json.points.totalPoints`).

---

## How the Data is Used

### Loading Pipeline

Both trees follow the same pattern:

```
1. Page mounts (PassiveTreePage.jsx or AtlasPage.jsx)
      ↓
2. Hook fires (usePassiveTreeData / useAtlasTreeData)
      ↓
3. Dynamic import (lazy-loaded to avoid bloating initial bundle)
      const raw = await import('../data/passive/passiveTreeData.json')
      ↓
4. Position calculation (group center + orbit radius × trig)
      calculateAllPositions(nodes, groups)
      ↓
5. Graph building (bidirectional adjacency list from node.out/in)
      buildAdjacencyList(nodes)
      ↓
6. Sprite extraction (parse sprite sheet coords at zoom 0.3835)
      buildSpriteMap(json.sprites)
      ↓
7. Class/ascendancy mapping
      ↓
8. Cached in module-level variable (only processed once)
```

### Key Files in the Rendering Pipeline

| File | Role |
|------|------|
| `src/hooks/usePassiveTreeData.js` | Loads JSON, computes positions, builds graph |
| `src/hooks/usePassivePathing.js` | BFS pathfinding, allocation validation |
| `src/calculators/passiveTree.js` | Position math, path search, URL encode/decode |
| `src/contexts/PassiveTreeContext.jsx` | Allocation state, undo/redo, mastery selections |
| `src/components/passive/PassiveTreeRenderer.jsx` | SVG rendering with viewport culling |
| `src/components/passive/PassiveNode.jsx` | Individual node sprites and frames |
| `src/components/passive/PassiveConnection.jsx` | Lines between nodes |
| `src/pages/PassiveTreePage.jsx` | Page layout, wires everything together |

Atlas equivalents follow the same pattern in `src/hooks/useAtlasTreeData.js`, `src/calculators/atlasTree.js`, `src/contexts/AtlasTreeContext.jsx`, and `src/components/atlas/`.

### Sprite Loading

Node icons and frames are loaded from GGG's CDN at runtime via `<image>` tags in SVG. The sprite sheet URLs are embedded in the JSON data itself (e.g., `sprites.normalActive[0.3835].filename`). We do NOT bundle the sprite PNGs — the browser fetches them from `web.poecdn.com` and caches them normally.

### Position Calculation

GGG's data uses an orbit-based coordinate system:

```
Each node belongs to a group (has x, y center coordinates).
Each node has an orbit (0-6) and orbitIndex within that orbit.

Position formula:
  if orbit === 0 → position = group center
  if orbit > 0:
    angle = (2π × orbitIndex / skillsPerOrbit[orbit]) - π/2
    x = groupX + orbitRadii[orbit] × cos(angle)
    y = groupY + orbitRadii[orbit] × sin(angle)

Orbit radii: [0, 82, 162, 335, 493, 662, 846]
Skills per orbit: [1, 6, 16, 16, 40, 72, 72]
```

### Build Sharing

Allocated nodes are compressed into a URL hash:

```
[version:1][classIndex:1][ascId:1][masteryCount:2][masteries...][skillIds...]
  → pako deflate → base64url → appended as URL #hash
```

This means shared build URLs depend on node skill IDs staying consistent across patches. If GGG renumbers nodes, old shared URLs may break.

---

## Analysis Script

There's a utility script for inspecting the passive tree data:

```bash
node scripts/analyze-connections.mjs
```

This reads `passiveTreeData.json` and logs connection statistics. Useful for debugging after a data update.

---

## Timing Notes

- GGG typically updates these repos **around league launch**, sometimes a few days before
- The atlas tree changes every league (new nodes for league mechanics)
- The passive tree changes less frequently — mostly when they rework an area or add nodes
- Sprite sheet URLs in the JSON point to the current CDN assets, so they should "just work" after updating the JSON
- If GGG changes the JSON schema, the `usePassiveTreeData.js` / `useAtlasTreeData.js` hooks will need updating

---

## Quick Reference

```bash
# Update passive tree
curl -L https://raw.githubusercontent.com/grindinggear/skilltree-export/master/data.json \
  -o src/data/passive/passiveTreeData.json

# Update atlas tree
curl -L https://raw.githubusercontent.com/grindinggear/atlastree-export/master/league.json \
  -o src/data/atlas/atlasTreeData.json

# Verify
npm run build && npm run dev
# → Check /build/passive-tree and /atlas pages
```
