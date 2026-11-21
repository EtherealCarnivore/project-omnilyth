/*
 * atlasTreeConstants.js — Visual configuration for the atlas tree renderer.
 *
 * Orbit radii and skills-per-orbit come from GGG's data.json constants.
 * Visual design follows PoE's "constellation map" aesthetic: dark background
 * with bright, high-contrast nodes that glow golden when allocated.
 */

// From GGG data.json constants
export const ORBIT_RADII = [0, 82, 162, 335, 493, 662, 846];
export const SKILLS_PER_ORBIT = [1, 6, 16, 16, 40, 72, 72];

// Total points available to allocate.
// 2026-11-15 — 138 → 150 for the 3.30 atlas tree rework. Source:
// grindinggear/atlastree-export tag 3.30.0 (commit d225501d), data.json
// `points.totalPoints` = 150; patch notes thread 4013680: "increased to 150
// (previously 138)"; patch 3.30.0.
// 2026-08-07 — 132 → 138 (3.28/3.29, tags 3.28.0 and 3.29.1).
// NOTE: useAtlasTreeData.js reads json.points.totalPoints from the tree file
// itself, so the planner follows the bundled JSON, not this constant.
export const TOTAL_POINTS = 150;

// Tree generation stamped into share codes and saved builds. It names the
// atlas graph the bundled atlasTreeData.json is, NOT the game patch: bump it
// only when GGG ships a new graph (atlastree-export tag with different node
// ids), and keep the previous value in LEGACY_TREE_GENERATIONS so codes made
// against it are rejected by name instead of decoded onto the new ids.
// 30 = grindinggear/atlastree-export tag 3.30.0 (1117 nodes, 150 points).
// Codes made before generations existed carry no marker (format v1); they are
// classified by atlasTree.js `classifyUnmarkedAllocation`.
export const ATLAS_TREE_GENERATION = 30;
export const TREE_GENERATION_LABELS = {
  29: '3.29',
  30: '3.30',
};

// Node visual sizes (world-space diameter, derived from frame sprite px / zoom factor)
// Frame sprites at 0.3835 zoom: regular=39px, notable=58px, keystone=83px
// World-space = sprite_px / 0.3835
export const NODE_SIZES = {
  regular: 51,   // 39 / 0.3835 ≈ 102 diameter → 51 radius
  notable: 76,   // 58 / 0.3835 ≈ 151 diameter → 76 radius
  keystone: 108, // 83 / 0.3835 ≈ 216 diameter → 108 radius
  mastery: 90,
  root: 50,
};

// Frame sprite name mapping: nodeType + state → frame sprite key
export const FRAME_NAMES = {
  regular: {
    idle:      'PSSkillFrame',
    allocated: 'PSSkillFrameActive',
    path:      'PSSkillFrameHighlighted',
    hover:     'PSSkillFrameHighlighted',
    search:    'PSSkillFrameHighlighted',
  },
  notable: {
    idle:      'NotableFrameUnallocated',
    allocated: 'NotableFrameAllocated',
    path:      'NotableFrameCanAllocate',
    hover:     'NotableFrameCanAllocate',
    search:    'NotableFrameCanAllocate',
  },
  keystone: {
    idle:      'KeystoneFrameUnallocated',
    allocated: 'KeystoneFrameAllocated',
    path:      'KeystoneFrameCanAllocate',
    hover:     'KeystoneFrameCanAllocate',
    search:    'KeystoneFrameCanAllocate',
  },
};

// Connection line styles — subtler against dark background image
export const CONNECTION_COLORS = {
  idle:      { stroke: '#5a6578', strokeWidth: 3, opacity: 0.7 },
  allocated: { stroke: '#c8a24e', strokeWidth: 4, opacity: 0.95 },
  partial:   { stroke: '#7a8598', strokeWidth: 3, opacity: 0.7 },
};

// Diff overlay colors
export const DIFF_COLORS = {
  add: '#22c55e',
  remove: '#ef4444',
  match: '#c8a24e',
};

// Diff connection line styles
export const DIFF_CONNECTION_COLORS = {
  add:     { stroke: '#22c55e', strokeWidth: 4, opacity: 0.9 },
  remove:  { stroke: '#ef4444', strokeWidth: 4, opacity: 0.9 },
  match:   { stroke: '#c8a24e', strokeWidth: 4, opacity: 0.95 },
  idle:    { stroke: '#5a6578', strokeWidth: 3, opacity: 0.5 },
};

// Zoom configuration — tuned for ~11,000 unit coordinate space
export const ZOOM_CONFIG = {
  min: 0.03,
  max: 0.5,
  step: 0.15,
  default: 0.12,
  fitPadding: 80,
};

// Content type keywords for stat grouping in summary panel
export const CONTENT_TYPES = {
  'Delirium': ['Delirium', 'Simulacrum', 'Delirium Orb'],
  'Harvest': ['Harvest', 'Lifeforce', 'Crop'],
  'Essence': ['Essence', 'Essences'],
  'Breach': ['Breach', 'Breachstone', 'Breach Ring'],
  'Legion': ['Legion', 'Timeless'],
  'Ritual': ['Ritual', 'Tribute'],
  'Expedition': ['Expedition', 'Logbook', 'Artifact'],
  'Blight': ['Blight', 'Blighted'],
  'Abyss': ['Abyss', 'Abyssal'],
  'Betrayal': ['Betrayal', 'Safehouse', 'Syndicate'],
  'Incursion': ['Incursion', 'Temple', 'Alva'],
  'Delve': ['Delve', 'Sulphite', 'Azurite'],
  'Heist': ['Heist', 'Contract', 'Blueprint', 'Rogue'],
  'Metamorph': ['Metamorph'],
  'Beyond': ['Beyond'],
  'Harbinger': ['Harbinger'],
  'Torment': ['Torment', 'Possessed'],
  'Strongbox': ['Strongbox', 'strongbox'],
  'Shrines': ['Shrine'],
  // 2026-11-15 — 3.30.0: Scarabs removed and replaced by Threads (thread
  // 4013680; 0 "Scarab" / 85 "Thread" stat lines in atlastree-export 3.30.0).
  // Mirage went core (9 stat lines); Mercenary nodes (48 lines) were falling
  // through to General. Threads/Mirage/Mercenaries/Settlers sit before 'Maps' because
  // first keyword match wins and nearly every atlas stat contains "Maps".
  'Threads': ['Thread'],
  'Mirage': ['Mirage'],
  'Mercenaries': ['Mercenar'],
  // 2026-11-15 — 'Ore' → 'Ore Deposit': the substring match on 'Ore' caught
  // every "...% more ..." stat (62 lines in the 3.30.0 tree, most not Kingsmarch).
  'Settlers': ['Ore Deposit', 'Kalguur', 'Settlers'],
  'Maps': ['Map', 'Maps', 'map mod', 'map boss'],
  'General': [],
};
