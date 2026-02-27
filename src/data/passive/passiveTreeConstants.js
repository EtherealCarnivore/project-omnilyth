/*
 * passiveTreeConstants.js — Visual configuration for the passive skill tree renderer.
 *
 * Orbit radii and skills-per-orbit come from GGG's data.json constants (identical to atlas).
 * Node sizes, frame names, and class data are specific to the character passive tree.
 */

// From GGG data.json constants (same as atlas)
export const ORBIT_RADII = [0, 82, 162, 335, 493, 662, 846];
export const SKILLS_PER_ORBIT = [1, 6, 16, 16, 40, 72, 72];

// Total points available
export const TOTAL_PASSIVE_POINTS = 123;
export const TOTAL_ASCENDANCY_POINTS = 8;

// Node visual sizes (world-space radius, derived from frame sprite px / zoom factor)
export const NODE_SIZES = {
  regular: 51,
  notable: 76,
  keystone: 108,
  mastery: 90,
  jewelSocket: 60,
  classStart: 80,
  ascendancyRegular: 51,
  ascendancyNotable: 76,
  ascendancyStart: 60,
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
  jewelSocket: {
    idle:      'JewelFrameUnallocated',
    allocated: 'JewelFrameAllocated',
    path:      'JewelFrameCanAllocate',
    hover:     'JewelFrameCanAllocate',
    search:    'JewelFrameCanAllocate',
  },
  ascendancyRegular: {
    idle:      'PSSkillFrame',
    allocated: 'PSSkillFrameActive',
    path:      'PSSkillFrameHighlighted',
    hover:     'PSSkillFrameHighlighted',
    search:    'PSSkillFrameHighlighted',
  },
  ascendancyNotable: {
    idle:      'NotableFrameUnallocated',
    allocated: 'NotableFrameAllocated',
    path:      'NotableFrameCanAllocate',
    hover:     'NotableFrameCanAllocate',
    search:    'NotableFrameCanAllocate',
  },
};

// Connection line styles
export const CONNECTION_COLORS = {
  idle:      { stroke: '#8a96a8', strokeWidth: 3, opacity: 0.85 },
  allocated: { stroke: '#d4af37', strokeWidth: 4, opacity: 1.0 },
  partial:   { stroke: '#9aabbc', strokeWidth: 3, opacity: 0.85 },
};

// Zoom configuration — passive tree has a larger coordinate space (~30,000 units)
export const ZOOM_CONFIG = {
  min: 0.015,
  max: 0.4,
  step: 0.15,
  default: 0.06,
  fitPadding: 80,
};

// Class index mapping (from GGG constants.classes)
export const CLASS_INDEX = {
  0: 'Scion',
  1: 'Marauder',
  2: 'Ranger',
  3: 'Witch',
  4: 'Duelist',
  5: 'Templar',
  6: 'Shadow',
};

// Reverse: name → index
export const CLASS_NAME_TO_INDEX = {
  'Scion': 0,
  'Marauder': 1,
  'Ranger': 2,
  'Witch': 3,
  'Duelist': 4,
  'Templar': 5,
  'Shadow': 6,
};

// Start node sprite key mapping (class name → sprite key in startNode sheet)
export const CLASS_START_SPRITE = {
  'Scion': 'centerscion',
  'Marauder': 'centermarauder',
  'Ranger': 'centerranger',
  'Witch': 'centerwitch',
  'Duelist': 'centerduelist',
  'Templar': 'centertemplar',
  'Shadow': 'centershadow',
};

// Stat categories for the summary panel (passive tree version)
export const STAT_CATEGORIES = {
  'Life & Defence': ['life', 'armour', 'evasion', 'energy shield', 'block', 'resist', 'maximum life', 'fortif'],
  'Attack': ['attack', 'melee', 'weapon', 'dual wield', 'sword', 'axe', 'mace', 'claw', 'dagger', 'bow', 'wand', 'staff', 'two handed'],
  'Spell': ['spell', 'cast speed', 'mana cost'],
  'Critical': ['critical', 'crit'],
  'Elemental': ['fire', 'cold', 'lightning', 'elemental'],
  'Chaos': ['chaos', 'poison', 'wither'],
  'Minions': ['minion', 'zombie', 'skeleton', 'spectre', 'golem', 'sentinel'],
  'DoT': ['damage over time', 'bleeding', 'ignite', 'burn'],
  'Mana & Charges': ['mana', 'charge', 'flask', 'endurance', 'frenzy', 'power'],
  'Attributes': ['strength', 'dexterity', 'intelligence', 'all attributes'],
  'Speed & Movement': ['movement speed', 'attack speed', 'cooldown'],
  'Aura & Curse': ['aura', 'curse', 'hex', 'mark', 'brand'],
  'Totem & Trap & Mine': ['totem', 'trap', 'mine'],
  'General': [],
};
