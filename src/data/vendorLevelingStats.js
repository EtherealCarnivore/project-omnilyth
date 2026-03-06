/**
 * Vendor Leveling Stats Database
 *
 * Comprehensive database of leveling stats for vendor shopping.
 * Organized by item type with priority stats (e.g., Movement Speed for boots)
 * and secondary stats (life, resistances, etc.).
 */

// Socket limits by item type
// Body Armour and 2H weapons can have 6 sockets
// Most other gear can have up to 4 sockets
// Rings/Amulets/Belts/Quivers cannot have sockets
export const socketLimits = {
  "Boots": { maxSockets: 4, maxLinks: 4 },
  "Gloves": { maxSockets: 4, maxLinks: 4 },
  "Helmet": { maxSockets: 4, maxLinks: 4 },
  "Body Armour": { maxSockets: 6, maxLinks: 6 },
  "Shield": { maxSockets: 3, maxLinks: 3 },
  "Weapon (1H)": { maxSockets: 3, maxLinks: 3 },
  "Weapon (2H)": { maxSockets: 6, maxLinks: 6 },
  "Bow": { maxSockets: 6, maxLinks: 6 },
  "Staff": { maxSockets: 6, maxLinks: 6 },
  "Quiver": { maxSockets: 0, maxLinks: 0 },
  "Belt": { maxSockets: 0, maxLinks: 0 },
  "Ring": { maxSockets: 0, maxLinks: 0 },
  "Amulet": { maxSockets: 0, maxLinks: 0 }
};

// Common socket patterns for quick selection
export const socketPresets = [
  { id: 'custom', label: 'Custom', sockets: null },
  { id: '3-any', label: '3S (Any Colors)', sockets: { r: 1, g: 1, b: 1, w: 0 } },
  { id: '3r', label: '3R (All Red)', sockets: { r: 3, g: 0, b: 0, w: 0 } },
  { id: '3g', label: '3G (All Green)', sockets: { r: 0, g: 3, b: 0, w: 0 } },
  { id: '3b', label: '3B (All Blue)', sockets: { r: 0, g: 0, b: 3, w: 0 } },
  { id: '2r-1g', label: '2R-1G', sockets: { r: 2, g: 1, b: 0, w: 0 } },
  { id: '2r-1b', label: '2R-1B', sockets: { r: 2, g: 0, b: 1, w: 0 } },
  { id: '2g-1r', label: '2G-1R', sockets: { r: 1, g: 2, b: 0, w: 0 } },
  { id: '2g-1b', label: '2G-1B', sockets: { r: 0, g: 2, b: 1, w: 0 } },
  { id: '2b-1r', label: '2B-1R', sockets: { r: 1, g: 0, b: 2, w: 0 } },
  { id: '2b-1g', label: '2B-1G', sockets: { r: 0, g: 1, b: 2, w: 0 } },
  { id: '4-any', label: '4S (Any Colors)', sockets: { r: 1, g: 1, b: 1, w: 1 } },
  { id: '3r-1g', label: '3R-1G', sockets: { r: 3, g: 1, b: 0, w: 0 } },
  { id: '3g-1r', label: '3G-1R', sockets: { r: 1, g: 3, b: 0, w: 0 } },
  { id: '3b-1r', label: '3B-1R', sockets: { r: 1, g: 0, b: 3, w: 0 } },
  { id: '2r-2g', label: '2R-2G', sockets: { r: 2, g: 2, b: 0, w: 0 } },
  { id: '2r-2b', label: '2R-2B', sockets: { r: 2, g: 0, b: 2, w: 0 } },
  { id: '2g-2b', label: '2G-2B', sockets: { r: 0, g: 2, b: 2, w: 0 } },
  { id: '6-any', label: '6S (Any Colors)', sockets: { r: 2, g: 2, b: 2, w: 0 } },
];

export const vendorLevelingStats = {
  "Boots": {
    priority: [
      {
        id: "ms",
        desc: "#% increased Movement Speed",
        regex: "mov.*spee",
        minValue: 10,
        maxValue: 35,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 20,
        maxValue: 79,
        hasRange: true
      },
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "chaos_res",
        desc: "+#% to Chaos Resistance",
        regex: "chaos.*resis",
        minValue: 5,
        maxValue: 25,
        hasRange: true
      }
    ]
  },

  "Gloves": {
    priority: [
      {
        id: "attack_speed",
        desc: "#% increased Attack Speed",
        regex: "attack.*spee",
        minValue: 5,
        maxValue: 16,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 20,
        maxValue: 79,
        hasRange: true
      },
      {
        id: "phys_dmg",
        desc: "Adds # to # Physical Damage to Attacks",
        regex: "adds.*phys",
        minValue: 1,
        maxValue: 20,
        hasRange: true
      },
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      }
    ]
  },

  "Helmet": {
    priority: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 30,
        maxValue: 109,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "armour",
        desc: "+# to Armour",
        regex: "\\+.*armour",
        minValue: 50,
        maxValue: 500,
        hasRange: true
      },
      {
        id: "evasion",
        desc: "+# to Evasion Rating",
        regex: "evasion",
        minValue: 50,
        maxValue: 500,
        hasRange: true
      }
    ]
  },

  "Body Armour": {
    priority: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 40,
        maxValue: 139,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "links",
        desc: "Has at least # linked sockets",
        regex: "socket",
        minValue: 3,
        maxValue: 6,
        hasRange: true
      }
    ]
  },

  "Belt": {
    priority: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 25,
        maxValue: 89,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "flask_charges",
        desc: "#% increased Flask Charges gained",
        regex: "flask.*charge",
        minValue: 10,
        maxValue: 30,
        hasRange: true
      }
    ]
  },

  "Ring": {
    priority: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 20,
        maxValue: 79,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "phys_dmg",
        desc: "Adds # to # Physical Damage to Attacks",
        regex: "adds.*phys",
        minValue: 1,
        maxValue: 15,
        hasRange: true
      },
      {
        id: "mana",
        desc: "+# to maximum Mana",
        regex: "\\+.*mana",
        minValue: 20,
        maxValue: 70,
        hasRange: true
      }
    ]
  },

  "Amulet": {
    priority: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 25,
        maxValue: 89,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "crit_multi",
        desc: "+#% to Global Critical Strike Multiplier",
        regex: "crit.*multi",
        minValue: 10,
        maxValue: 38,
        hasRange: true
      },
      {
        id: "phys_dmg",
        desc: "Adds # to # Physical Damage to Attacks",
        regex: "adds.*phys",
        minValue: 1,
        maxValue: 20,
        hasRange: true
      }
    ]
  },

  "Shield": {
    priority: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 30,
        maxValue: 109,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "cold_res",
        desc: "+#% to Cold Resistance",
        regex: "cold.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "lightning_res",
        desc: "+#% to Lightning Resistance",
        regex: "light.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      },
      {
        id: "spell_dmg",
        desc: "#% increased Spell Damage",
        regex: "spell.*damag",
        minValue: 10,
        maxValue: 50,
        hasRange: true
      }
    ]
  },

  "Weapon (1H)": {
    priority: [
      {
        id: "phys_dmg",
        desc: "Adds # to # Physical Damage",
        regex: "adds.*phys",
        minValue: 5,
        maxValue: 40,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "attack_speed",
        desc: "#% increased Attack Speed",
        regex: "attack.*spee",
        minValue: 5,
        maxValue: 27,
        hasRange: true
      },
      {
        id: "crit_chance",
        desc: "+#% to Critical Strike Chance",
        regex: "crit.*chance",
        minValue: 15,
        maxValue: 38,
        hasRange: true
      },
      {
        id: "ele_dmg",
        desc: "Adds # to # Elemental Damage",
        regex: "adds.*(fire|cold|light)",
        minValue: 1,
        maxValue: 30,
        hasRange: true
      }
    ]
  },

  "Weapon (2H)": {
    priority: [
      {
        id: "phys_dmg",
        desc: "Adds # to # Physical Damage",
        regex: "adds.*phys",
        minValue: 10,
        maxValue: 80,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "attack_speed",
        desc: "#% increased Attack Speed",
        regex: "attack.*spee",
        minValue: 5,
        maxValue: 20,
        hasRange: true
      },
      {
        id: "crit_chance",
        desc: "+#% to Critical Strike Chance",
        regex: "crit.*chance",
        minValue: 15,
        maxValue: 38,
        hasRange: true
      },
      {
        id: "links",
        desc: "Has at least # linked sockets",
        regex: "socket",
        minValue: 3,
        maxValue: 6,
        hasRange: true
      }
    ]
  },

  "Quiver": {
    priority: [
      {
        id: "life",
        desc: "+# to maximum Life",
        regex: "\\+.*life",
        minValue: 25,
        maxValue: 89,
        hasRange: true
      }
    ],
    secondary: [
      {
        id: "phys_dmg",
        desc: "Adds # to # Physical Damage to Bow Attacks",
        regex: "adds.*phys",
        minValue: 3,
        maxValue: 25,
        hasRange: true
      },
      {
        id: "attack_speed",
        desc: "#% increased Attack Speed",
        regex: "attack.*spee",
        minValue: 5,
        maxValue: 16,
        hasRange: true
      },
      {
        id: "crit_chance",
        desc: "+#% to Critical Strike Chance",
        regex: "crit.*chance",
        minValue: 15,
        maxValue: 38,
        hasRange: true
      },
      {
        id: "fire_res",
        desc: "+#% to Fire Resistance",
        regex: "fire.*resis",
        minValue: 10,
        maxValue: 48,
        hasRange: true
      }
    ]
  }
};

// General stats available for all item types
export const generalStats = [
  // Attributes
  { id: 'str', desc: '+# to Strength', regex: '\\+.*streng', minValue: 10, maxValue: 55, hasRange: true },
  { id: 'dex', desc: '+# to Dexterity', regex: '\\+.*dexter', minValue: 10, maxValue: 55, hasRange: true },
  { id: 'int', desc: '+# to Intelligence', regex: '\\+.*intell', minValue: 10, maxValue: 55, hasRange: true },
  { id: 'all_attr', desc: '+# to all Attributes', regex: 'all.*attri', minValue: 5, maxValue: 20, hasRange: true },
  { id: 'str_dex', desc: '+# to Strength and Dexterity', regex: 'streng.*dexter', minValue: 5, maxValue: 20, hasRange: true },
  { id: 'str_int', desc: '+# to Strength and Intelligence', regex: 'streng.*intell', minValue: 5, maxValue: 20, hasRange: true },
  { id: 'dex_int', desc: '+# to Dexterity and Intelligence', regex: 'dexter.*intell', minValue: 5, maxValue: 20, hasRange: true },

  // Life & Mana
  { id: 'gen_life', desc: '+# to maximum Life', regex: '\\+.*life', minValue: 20, maxValue: 139, hasRange: true },
  { id: 'gen_mana', desc: '+# to maximum Mana', regex: '\\+.*mana', minValue: 20, maxValue: 75, hasRange: true },
  { id: 'life_regen', desc: '# Life Regenerated per second', regex: 'life.*regen', minValue: 1, maxValue: 20, hasRange: true },
  { id: 'mana_regen', desc: '#% increased Mana Regeneration Rate', regex: 'mana.*regen', minValue: 10, maxValue: 60, hasRange: true },

  // Resistances
  { id: 'gen_fire_res', desc: '+#% to Fire Resistance', regex: 'fire.*resis', minValue: 10, maxValue: 48, hasRange: true },
  { id: 'gen_cold_res', desc: '+#% to Cold Resistance', regex: 'cold.*resis', minValue: 10, maxValue: 48, hasRange: true },
  { id: 'gen_lightning_res', desc: '+#% to Lightning Resistance', regex: 'light.*resis', minValue: 10, maxValue: 48, hasRange: true },
  { id: 'gen_chaos_res', desc: '+#% to Chaos Resistance', regex: 'chaos.*resis', minValue: 5, maxValue: 35, hasRange: true },
  { id: 'all_ele_res', desc: '+#% to all Elemental Resistances', regex: 'all.*elem.*resis', minValue: 5, maxValue: 16, hasRange: true },

  // Damage
  { id: 'gen_phys_dmg', desc: 'Adds # to # Physical Damage to Attacks', regex: 'adds.*phys', minValue: 1, maxValue: 40, hasRange: true },
  { id: 'gen_fire_dmg', desc: 'Adds # to # Fire Damage to Attacks', regex: 'adds.*fire', minValue: 1, maxValue: 40, hasRange: true },
  { id: 'gen_cold_dmg', desc: 'Adds # to # Cold Damage to Attacks', regex: 'adds.*cold', minValue: 1, maxValue: 40, hasRange: true },
  { id: 'gen_lightning_dmg', desc: 'Adds # to # Lightning Damage to Attacks', regex: 'adds.*light', minValue: 1, maxValue: 50, hasRange: true },
  { id: 'spell_dmg', desc: '#% increased Spell Damage', regex: 'spell.*damag', minValue: 10, maxValue: 50, hasRange: true },
  { id: 'gen_ele_dmg', desc: '#% increased Elemental Damage', regex: 'elem.*damag', minValue: 10, maxValue: 40, hasRange: true },

  // Speed & Crit
  { id: 'gen_attack_speed', desc: '#% increased Attack Speed', regex: 'attack.*spee', minValue: 5, maxValue: 27, hasRange: true },
  { id: 'gen_cast_speed', desc: '#% increased Cast Speed', regex: 'cast.*spee', minValue: 5, maxValue: 20, hasRange: true },
  { id: 'gen_ms', desc: '#% increased Movement Speed', regex: 'mov.*spee', minValue: 5, maxValue: 35, hasRange: true },
  { id: 'gen_crit_chance', desc: '#% increased Global Critical Strike Chance', regex: 'crit.*chance', minValue: 10, maxValue: 38, hasRange: true },
  { id: 'gen_crit_multi', desc: '+#% to Global Critical Strike Multiplier', regex: 'crit.*multi', minValue: 10, maxValue: 38, hasRange: true },

  // Defence
  { id: 'gen_armour', desc: '+# to Armour', regex: '\\+.*armour', minValue: 50, maxValue: 500, hasRange: true },
  { id: 'gen_evasion', desc: '+# to Evasion Rating', regex: 'evasion', minValue: 50, maxValue: 500, hasRange: true },
  { id: 'gen_es', desc: '+# to maximum Energy Shield', regex: 'energy.*shiel', minValue: 10, maxValue: 100, hasRange: true },
  { id: 'inc_armour', desc: '#% increased Armour', regex: 'incr.*armour', minValue: 10, maxValue: 100, hasRange: true },
  { id: 'inc_evasion', desc: '#% increased Evasion Rating', regex: 'incr.*evasion', minValue: 10, maxValue: 100, hasRange: true },
  { id: 'inc_es', desc: '#% increased Energy Shield', regex: 'incr.*energy', minValue: 10, maxValue: 100, hasRange: true },

  // Misc
  { id: 'item_rarity', desc: '#% increased Rarity of Items found', regex: 'rarity', minValue: 10, maxValue: 40, hasRange: true },
  { id: 'flask_charges', desc: '#% increased Flask Charges gained', regex: 'flask.*charge', minValue: 10, maxValue: 30, hasRange: true },
  { id: 'flask_effect', desc: '#% increased Flask Effect Duration', regex: 'flask.*durat', minValue: 5, maxValue: 20, hasRange: true },
  { id: 'stun_recovery', desc: '#% increased Stun and Block Recovery', regex: 'stun.*recov', minValue: 10, maxValue: 30, hasRange: true },
];

// Item base types by category
export const vendorItemBases = {
  "Boots": [
    "Iron Greaves",
    "Steel Greaves",
    "Plated Greaves",
    "Reinforced Greaves",
    "Antique Greaves",
    "Ancient Greaves",
    "Goliath Greaves",
    "Rawhide Boots",
    "Goathide Boots",
    "Deerskin Boots",
    "Nubuck Boots",
    "Eelskin Boots",
    "Sharkskin Boots",
    "Shagreen Boots",
    "Stealth Boots",
    "Slink Boots",
    "Wool Shoes",
    "Velvet Slippers",
    "Silk Slippers",
    "Scholar Boots",
    "Satin Slippers",
    "Samite Slippers",
    "Conjurer Boots",
    "Arcanist Slippers",
    "Sorcerer Boots",
    "Soldier Boots",
    "Legion Boots",
    "Crusader Boots",
    "Two-Toned Boots"
  ],
  "Gloves": [
    "Iron Gauntlets",
    "Plated Gauntlets",
    "Bronze Gauntlets",
    "Steel Gauntlets",
    "Antique Gauntlets",
    "Ancient Gauntlets",
    "Goliath Gauntlets",
    "Rawhide Gloves",
    "Goathide Gloves",
    "Deerskin Gloves",
    "Nubuck Gloves",
    "Eelskin Gloves",
    "Sharkskin Gloves",
    "Shagreen Gloves",
    "Stealth Gloves",
    "Slink Gloves",
    "Wool Gloves",
    "Velvet Gloves",
    "Silk Gloves",
    "Embroidered Gloves",
    "Satin Gloves",
    "Samite Gloves",
    "Conjurer Gloves",
    "Arcanist Gloves",
    "Sorcerer Gloves",
    "Soldier Gloves",
    "Legion Gloves",
    "Crusader Gloves",
    "Fingerless Silk Gloves",
    "Two-Toned Boots"
  ],
  "Helmet": [
    "Iron Hat",
    "Cone Helmet",
    "Barbute Helmet",
    "Close Helmet",
    "Gladiator Helmet",
    "Reaver Helmet",
    "Siege Helmet",
    "Samite Helmet",
    "Ezomyte Burgonet",
    "Royal Burgonet",
    "Eternal Burgonet",
    "Leather Cap",
    "Tricorne",
    "Leather Hood",
    "Wolf Pelt",
    "Holy Chainmail",
    "Tortoise Shell",
    "Bone Helmet",
    "Lacquered Helmet",
    "Solaris Circlet",
    "Lunaris Circlet",
    "Hubris Circlet",
    "Praetor Crown",
    "Necromancer Circlet",
    "Lion Pelt"
  ],
  "Body Armour": [
    "Plate Vest",
    "Chestplate",
    "Copper Plate",
    "War Plate",
    "Full Plate",
    "Arena Plate",
    "Lordly Plate",
    "Bronze Plate",
    "Battle Plate",
    "Sun Plate",
    "Colosseum Plate",
    "Majestic Plate",
    "Golden Plate",
    "Crusader Plate",
    "Astral Plate",
    "Gladiator Plate",
    "Glorious Plate",
    "Shabby Jerkin",
    "Strapped Leather",
    "Buckskin Tunic",
    "Wild Leather",
    "Full Leather",
    "Sun Leather",
    "Thief's Garb",
    "Eelskin Tunic",
    "Frontier Leather",
    "Glorious Leather",
    "Coronal Leather",
    "Cutthroat's Garb",
    "Sharkskin Tunic",
    "Destiny Leather",
    "Exquisite Leather",
    "Zodiac Leather",
    "Assassin's Garb",
    "Simple Robe",
    "Silken Vest",
    "Scholar's Robe",
    "Silken Garb",
    "Mage's Vestment",
    "Silk Robe",
    "Cabalist Regalia",
    "Sage's Robe",
    "Silken Wrap",
    "Conjurer's Vestment",
    "Spidersilk Robe",
    "Destroyer Regalia",
    "Savant's Robe",
    "Necromancer Silks",
    "Occultist's Vestment",
    "Widowsilk Robe",
    "Vaal Regalia"
  ],
  "Belt": [
    "Chain Belt",
    "Rustic Sash",
    "Heavy Belt",
    "Leather Belt",
    "Cloth Belt",
    "Studded Belt",
    "Vanguard Belt",
    "Crystal Belt"
  ],
  "Ring": [
    "Iron Ring",
    "Coral Ring",
    "Paua Ring",
    "Sapphire Ring",
    "Topaz Ring",
    "Ruby Ring",
    "Diamond Ring",
    "Gold Ring",
    "Moonstone Ring",
    "Two-Stone Ring",
    "Amethyst Ring",
    "Prismatic Ring",
    "Unset Ring",
    "Vermillion Ring",
    "Cerulean Ring",
    "Opal Ring",
    "Steel Ring",
    "Bone Ring"
  ],
  "Amulet": [
    "Coral Amulet",
    "Paua Amulet",
    "Amber Amulet",
    "Jade Amulet",
    "Lapis Amulet",
    "Gold Amulet",
    "Agate Amulet",
    "Citrine Amulet",
    "Turquoise Amulet",
    "Onyx Amulet",
    "Marble Amulet",
    "Blue Pearl Amulet",
    "Seaglass Amulet",
    "Ashscale Amulet"
  ],
  "Shield": [
    "Splintered Tower Shield",
    "Corroded Tower Shield",
    "Rawhide Tower Shield",
    "Cedar Tower Shield",
    "Copper Tower Shield",
    "Reinforced Tower Shield",
    "Painted Tower Shield",
    "Buckskin Tower Shield",
    "Mahogany Tower Shield",
    "Bronze Tower Shield",
    "Girded Tower Shield",
    "Crested Tower Shield",
    "Shagreen Tower Shield",
    "Ebony Tower Shield",
    "Ezomyte Tower Shield",
    "Colossal Tower Shield"
  ],
  "Weapon (1H)": [
    "Rusted Sword",
    "Copper Sword",
    "Sabre",
    "Broad Sword",
    "War Sword",
    "Ancient Sword",
    "Elegant Sword",
    "Dusk Blade",
    "Hook Sword",
    "Variscite Blade",
    "Cutlass",
    "Baselard",
    "Battle Axe",
    "Cleaver",
    "Broad Axe",
    "Gladius",
    "Legion Sword",
    "Vaal Blade"
  ],
  "Weapon (2H)": [
    "Corroded Blade",
    "Longsword",
    "Bastard Sword",
    "Two-Handed Sword",
    "Etched Greatsword",
    "Ornate Sword",
    "Spectral Sword",
    "Curved Blade",
    "Butcher Axe",
    "Karui Chopper",
    "Talon Axe",
    "Siege Axe",
    "Reaver Axe",
    "Poleaxe",
    "Ezomyte Axe",
    "Vaal Axe",
    "Maraketh Bow",
    "Decimation Bow",
    "Thicket Bow",
    "Steelwood Bow",
    "Citadel Bow"
  ],
  "Quiver": [
    "Two-Point Arrow Quiver",
    "Serrated Arrow Quiver",
    "Sharktooth Arrow Quiver",
    "Blunt Arrow Quiver",
    "Fire Arrow Quiver",
    "Broadhead Arrow Quiver",
    "Penetrating Arrow Quiver",
    "Spike-Point Arrow Quiver"
  ]
};
