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

// Total points available to allocate
export const TOTAL_POINTS = 132;

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

// Diff overlay colors (Phase 3)
export const DIFF_COLORS = {
  add: '#22c55e',
  remove: '#ef4444',
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
  'Maps': ['Map', 'Maps', 'map mod', 'map boss'],
  'Scarabs': ['Scarab'],
  'Settlers': ['Ore', 'Kalguur', 'Settlers'],
  'General': [],
};
