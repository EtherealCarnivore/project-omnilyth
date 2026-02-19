/**
 * generate-mock-data.js
 * Generates realistic mock data for testing without scraping
 *
 * This allows development to continue without hitting actual websites
 * and enables faster iteration during UI development.
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const OUTPUT_DIR = './scripts/leveling-data/raw';

/**
 * Generate mock exile-leveling data
 */
function generateMockExileLeveling() {
  const areas = [];
  const quests = [];
  const gems = [];

  // Act data structure: [act_number, zones, quest_count]
  const actData = [
    // Act 1
    {
      act: 1,
      zones: [
        { name: 'Lioneye\'s Watch', level: 1, hasWaypoint: true },
        { name: 'The Coast', level: 1, hasWaypoint: false },
        { name: 'The Mud Flats', level: 2, hasWaypoint: true },
        { name: 'The Fetid Pool', level: 3, hasWaypoint: false, isOptional: true },
        { name: 'The Submerged Passage', level: 3, hasWaypoint: false },
        { name: 'The Flooded Depths', level: 4, hasWaypoint: false, isOptional: true },
        { name: 'The Ledge', level: 5, hasWaypoint: false },
        { name: 'The Climb', level: 8, hasWaypoint: false },
        { name: 'The Lower Prison', level: 9, hasWaypoint: true, hasTrial: true, trialType: 'Spike traps' },
        { name: 'The Upper Prison', level: 10, hasWaypoint: false, isOptional: true },
        { name: 'Prisoner\'s Gate', level: 11, hasWaypoint: true },
        { name: 'The Ship Graveyard', level: 11, hasWaypoint: true },
        { name: 'The Cavern of Wrath', level: 12, hasWaypoint: false },
        { name: 'The Cavern of Anger', level: 13, hasWaypoint: false, isOptional: true }
      ],
      quests: [
        { name: 'Enemy at the Gate', skillPoints: 0, passive: false },
        { name: 'Mercy Mission', skillPoints: 1, passive: true },
        { name: 'Breaking Some Eggs', skillPoints: 0, passive: false },
        { name: 'The Caged Brute', skillPoints: 0, passive: false },
        { name: 'The Siren\'s Cadence', skillPoints: 1, passive: true },
        { name: 'The Marooned Mariner', skillPoints: 0, passive: false },
        { name: 'The Dweller of the Deep', skillPoints: 1, passive: true }
      ]
    },
    // Act 2
    {
      act: 2,
      zones: [
        { name: 'The Forest Encampment', level: 14, hasWaypoint: true },
        { name: 'The Riverways', level: 14, hasWaypoint: true },
        { name: 'The Crossroads', level: 15, hasWaypoint: true },
        { name: 'The Chamber of Sins Level 1', level: 16, hasWaypoint: false },
        { name: 'The Chamber of Sins Level 2', level: 18, hasWaypoint: true, hasTrial: true, trialType: 'Sawblades' },
        { name: 'The Broken Bridge', level: 16, hasWaypoint: false, isOptional: true },
        { name: 'The Fellshrine Ruins', level: 17, hasWaypoint: true },
        { name: 'The Crypt Level 1', level: 18, hasWaypoint: false, isOptional: true, hasTrial: true, trialType: 'Spinning blades' },
        { name: 'The Western Forest', level: 17, hasWaypoint: true },
        { name: 'The Weaver\'s Chambers', level: 19, hasWaypoint: false },
        { name: 'The Wetlands', level: 18, hasWaypoint: true },
        { name: 'The Vaal Ruins', level: 20, hasWaypoint: true },
        { name: 'The Northern Forest', level: 21, hasWaypoint: true },
        { name: 'The Caverns', level: 22, hasWaypoint: false }
      ],
      quests: [
        { name: 'Deal with the Bandits', skillPoints: 2, passive: true },
        { name: 'The Way Forward', skillPoints: 0, passive: false },
        { name: 'Intruders in Black', skillPoints: 1, passive: true },
        { name: 'Sharp and Cruel', skillPoints: 0, passive: false },
        { name: 'Through Sacred Ground', skillPoints: 0, passive: false }
      ]
    },
    // Act 3
    {
      act: 3,
      zones: [
        { name: 'The Sarn Encampment', level: 23, hasWaypoint: true },
        { name: 'The Slums', level: 23, hasWaypoint: true },
        { name: 'The Crematorium', level: 24, hasWaypoint: false, isOptional: true, hasTrial: true, trialType: 'Furnace traps' },
        { name: 'The Sewers', level: 24, hasWaypoint: false },
        { name: 'The Marketplace', level: 25, hasWaypoint: true },
        { name: 'The Catacombs', level: 26, hasWaypoint: false, hasTrial: true, trialType: 'Blade sentries' },
        { name: 'The Battlefront', level: 27, hasWaypoint: true },
        { name: 'The Imperial Gardens', level: 27, hasWaypoint: true, hasTrial: true, trialType: 'Dart traps' },
        { name: 'The Docks', level: 26, hasWaypoint: true },
        { name: 'The Solaris Temple Level 2', level: 28, hasWaypoint: true },
        { name: 'The Eternal Laboratory', level: 30, hasWaypoint: true },
        { name: 'The Sceptre of God', level: 32, hasWaypoint: false }
      ],
      quests: [
        { name: 'Lost in Love', skillPoints: 1, passive: true },
        { name: 'Victario\'s Secrets', skillPoints: 1, passive: true },
        { name: 'Piety\'s Pets', skillPoints: 0, passive: false },
        { name: 'A Fixture of Fate', skillPoints: 2, passive: true }
      ]
    },
    // Act 4
    {
      act: 4,
      zones: [
        { name: 'Highgate', level: 33, hasWaypoint: true },
        { name: 'The Aqueduct', level: 33, hasWaypoint: true },
        { name: 'The Dried Lake', level: 34, hasWaypoint: true },
        { name: 'The Mines Level 1', level: 35, hasWaypoint: false },
        { name: 'The Mines Level 2', level: 36, hasWaypoint: true },
        { name: 'The Crystal Veins', level: 37, hasWaypoint: true },
        { name: 'Daresso\'s Dream', level: 38, hasWaypoint: true },
        { name: 'Kaom\'s Dream', level: 39, hasWaypoint: true },
        { name: 'The Harvest', level: 41, hasWaypoint: false }
      ],
      quests: [
        { name: 'Breaking the Seal', skillPoints: 0, passive: false },
        { name: 'The Eternal Nightmare', skillPoints: 2, passive: true },
        { name: 'An Indomitable Spirit', skillPoints: 0, passive: false }
      ]
    },
    // Act 5
    {
      act: 5,
      zones: [
        { name: 'Oriath Square', level: 42, hasWaypoint: true },
        { name: 'The Torched Courts', level: 42, hasWaypoint: true },
        { name: 'The Ruined Square', level: 43, hasWaypoint: true },
        { name: 'The Ossuary', level: 44, hasWaypoint: true },
        { name: 'The Reliquary', level: 45, hasWaypoint: false },
        { name: 'The Cathedral Rooftop', level: 45, hasWaypoint: false },
        { name: 'The Templar Courts', level: 46, hasWaypoint: true },
        { name: 'The Chamber of Innocence', level: 47, hasWaypoint: true }
      ],
      quests: [
        { name: 'The Key to Freedom', skillPoints: 0, passive: false },
        { name: 'Death to Purity', skillPoints: 1, passive: true },
        { name: 'Kitava\'s Torments', skillPoints: 0, passive: false }
      ]
    },
    // Act 6
    {
      act: 6,
      zones: [
        { name: 'Lioneye\'s Watch', level: 48, hasWaypoint: true },
        { name: 'The Coast', level: 48, hasWaypoint: false },
        { name: 'The Mud Flats', level: 49, hasWaypoint: true },
        { name: 'The Karui Fortress', level: 50, hasWaypoint: true },
        { name: 'The Ridge', level: 51, hasWaypoint: true },
        { name: 'The Prison', level: 52, hasWaypoint: true, hasTrial: true, trialType: 'Spike traps' },
        { name: 'Shavronne\'s Tower', level: 53, hasWaypoint: true },
        { name: 'The Beacon', level: 54, hasWaypoint: true },
        { name: 'The Twilight Strand', level: 55, hasWaypoint: false }
      ],
      quests: [
        { name: 'Fallen from Grace', skillPoints: 1, passive: true },
        { name: 'The Father of War', skillPoints: 0, passive: false },
        { name: 'The Cloven One', skillPoints: 1, passive: true }
      ]
    },
    // Act 7
    {
      act: 7,
      zones: [
        { name: 'The Bridge Encampment', level: 56, hasWaypoint: true },
        { name: 'The Broken Bridge', level: 56, hasWaypoint: true },
        { name: 'The Crossroads', level: 57, hasWaypoint: true },
        { name: 'The Fellshrine Ruins', level: 58, hasWaypoint: true },
        { name: 'The Crypt', level: 59, hasWaypoint: false, hasTrial: true, trialType: 'Spinning blades' },
        { name: 'The Chamber of Sins Level 1', level: 59, hasWaypoint: false },
        { name: 'The Chamber of Sins Level 2', level: 60, hasWaypoint: true, hasTrial: true, trialType: 'Sawblades' },
        { name: 'The Den', level: 60, hasWaypoint: true },
        { name: 'The Ashen Fields', level: 61, hasWaypoint: true },
        { name: 'The Northern Forest', level: 62, hasWaypoint: true }
      ],
      quests: [
        { name: 'The Master of a Million Faces', skillPoints: 2, passive: true },
        { name: 'Kishara\'s Star', skillPoints: 0, passive: false },
        { name: 'Queen of Despair', skillPoints: 0, passive: false }
      ]
    },
    // Act 8
    {
      act: 8,
      zones: [
        { name: 'The Sarn Encampment', level: 63, hasWaypoint: true },
        { name: 'The Toxic Conduits', level: 63, hasWaypoint: true },
        { name: 'The Doedre\'s Cesspool', level: 64, hasWaypoint: true },
        { name: 'The Quay', level: 65, hasWaypoint: true },
        { name: 'The Bath House', level: 65, hasWaypoint: false, hasTrial: true, trialType: 'Furnace traps' },
        { name: 'The Grain Gate', level: 66, hasWaypoint: true },
        { name: 'The Imperial Fields', level: 67, hasWaypoint: true },
        { name: 'The Solaris Temple Level 2', level: 68, hasWaypoint: true },
        { name: 'The Harbour Bridge', level: 69, hasWaypoint: true }
      ],
      quests: [
        { name: 'Lunar Eclipse', skillPoints: 2, passive: true },
        { name: 'Solar Eclipse', skillPoints: 2, passive: true },
        { name: 'Love is Dead', skillPoints: 0, passive: false }
      ]
    },
    // Act 9
    {
      act: 9,
      zones: [
        { name: 'Highgate', level: 70, hasWaypoint: true },
        { name: 'The Descent', level: 70, hasWaypoint: true },
        { name: 'The Vastiri Desert', level: 71, hasWaypoint: true },
        { name: 'The Oasis', level: 72, hasWaypoint: true },
        { name: 'The Foothills', level: 73, hasWaypoint: true },
        { name: 'The Boiling Lake', level: 74, hasWaypoint: true },
        { name: 'The Tunnel', level: 75, hasWaypoint: true, hasTrial: true, trialType: 'Blade sentries' },
        { name: 'The Quarry', level: 76, hasWaypoint: true }
      ],
      quests: [
        { name: 'Queen of the Sands', skillPoints: 2, passive: true },
        { name: 'The Ruler of Highgate', skillPoints: 0, passive: false },
        { name: 'Fastis Fortuna', skillPoints: 0, passive: false }
      ]
    },
    // Act 10
    {
      act: 10,
      zones: [
        { name: 'Oriath Square', level: 77, hasWaypoint: true },
        { name: 'The Ravaged Square', level: 77, hasWaypoint: true },
        { name: 'The Torched Courts', level: 78, hasWaypoint: true },
        { name: 'The Desecrated Chambers', level: 79, hasWaypoint: true },
        { name: 'The Ossuary', level: 80, hasWaypoint: true, hasTrial: true, trialType: 'Dart traps' },
        { name: 'The Feeding Trough', level: 81, hasWaypoint: false },
        { name: 'The Canals', level: 82, hasWaypoint: true }
      ],
      quests: [
        { name: 'Safe Passage', skillPoints: 0, passive: false },
        { name: 'Vilenta\'s Vengeance', skillPoints: 2, passive: true },
        { name: 'An End to Hunger', skillPoints: 0, passive: false }
      ]
    }
  ];

  // Generate areas for all acts
  actData.forEach(act => {
    act.zones.forEach((zone, zoneIndex) => {
      areas.push({
        id: `act${act.act}-area-${zoneIndex}`,
        name: zone.name,
        act: act.act,
        level: zone.level,
        hasWaypoint: zone.hasWaypoint,
        isOptional: zone.isOptional || false,
        connections: [],
        objectives: [
          { type: 'quest', description: `Complete objectives in ${zone.name}`, reward: null }
        ],
        tips: [],
        craftingRecipes: []
      });
    });

    // Generate quests for each act
    act.quests.forEach((quest, questIndex) => {
      quests.push({
        id: `act${act.act}-quest-${questIndex}`,
        name: quest.name,
        act: act.act,
        required: !quest.passive,
        objectives: ['Complete the quest objective'],
        rewards: {
          skillPoints: quest.skillPoints,
          passive: quest.passive,
          items: []
        },
        zones: []
      });
    });
  });

  // Generate mock gems (spread across acts)
  const mockGems = [
    { name: 'Cleave', level: 1, act: 1, color: 'str', classes: ['Marauder', 'Duelist', 'Templar'] },
    { name: 'Ground Slam', level: 1, act: 1, color: 'str', classes: ['Marauder', 'Duelist'] },
    { name: 'Splitting Steel', level: 1, act: 1, color: 'dex', classes: ['Duelist', 'Ranger', 'Shadow'] },
    { name: 'Spectral Throw', level: 1, act: 1, color: 'dex', classes: ['Ranger', 'Shadow', 'Scion'] },
    { name: 'Freezing Pulse', level: 1, act: 1, color: 'int', classes: ['Witch', 'Templar', 'Shadow'] },
    { name: 'Spark', level: 1, act: 1, color: 'int', classes: ['Witch', 'Shadow'] },
    { name: 'Herald of Ash', level: 16, act: 2, color: 'str', classes: ['Marauder', 'Duelist', 'Templar'] },
    { name: 'Herald of Ice', level: 16, act: 2, color: 'dex', classes: ['Ranger', 'Shadow', 'Scion'] },
    { name: 'Herald of Thunder', level: 16, act: 2, color: 'int', classes: ['Witch', 'Templar', 'Shadow'] },
    { name: 'Molten Strike', level: 38, act: 4, color: 'str', classes: ['Marauder', 'Duelist'] },
    { name: 'Blade Vortex', level: 38, act: 4, color: 'dex', classes: ['Shadow', 'Ranger'] }
  ];

  mockGems.forEach((gem, index) => {
    gems.push({
      id: `gem-${index}`,
      name: gem.name,
      level: gem.level,
      act: gem.act,
      source: 'vendor',
      classes: gem.classes,
      color: gem.color,
      quest: null,
      vendor: gem.act >= 1 && gem.act <= 3 ? 'Nessa' : gem.act >= 4 && gem.act <= 5 ? 'Petarus' : 'Lilly'
    });
  });

  return {
    source: 'exile-leveling',
    sourceUrl: 'https://github.com/HeartofPhos/exile-leveling',
    fetchedAt: new Date().toISOString(),
    areas,
    quests,
    gems,
    __mock: true
  };
}

/**
 * Generate mock poe-leveling.com data
 */
function generateMockPOELeveling() {
  const acts = [];

  // Add tips for each act
  const actTips = [
    // Act 1
    {
      act: 1,
      zones: [
        { name: 'The Coast', tips: [
          { content: 'Skip most monsters, only kill blue packs for flasks', category: 'combat', freshOnly: false },
          { content: 'Pick up all movement speed boots at vendors', category: 'vendor', freshOnly: true }
        ]},
        { name: 'The Mud Flats', tips: [
          { content: 'Grab the Quicksilver Flask from this zone', category: 'quest', freshOnly: false },
          { content: 'Use Flame Dash or Leap Slam for faster movement', category: 'movement', freshOnly: false }
        ]}
      ]
    },
    // Act 2
    {
      act: 2,
      zones: [
        { name: 'The Riverways', tips: [
          { content: 'Deal with bandits - usually kill all for 2 passive points', category: 'quest', freshOnly: false }
        ]},
        { name: 'The Western Forest', tips: [
          { content: 'Get Quicksilver Flask of Adrenaline from Weaver quest', category: 'quest', freshOnly: false }
        ]}
      ]
    },
    // Act 3
    {
      act: 3,
      zones: [
        { name: 'The Sarn Encampment', tips: [
          { content: 'Stock up on Chromatic Orbs from vendoring RGB items', category: 'vendor', freshOnly: true }
        ]},
        { name: 'The Library', tips: [
          { content: 'Pick up skill books for quest rewards', category: 'quest', freshOnly: false }
        ]}
      ]
    },
    // Act 4
    {
      act: 4,
      zones: [
        { name: 'The Dried Lake', tips: [
          { content: 'Good farming zone if you need levels', category: 'leveling', freshOnly: false }
        ]},
        { name: 'The Mines', tips: [
          { content: 'Watch out for explosive enemies', category: 'combat', freshOnly: false }
        ]}
      ]
    },
    // Act 5
    {
      act: 5,
      zones: [
        { name: 'The Cathedral Rooftop', tips: [
          { content: 'Kitava fight - get resistances ready (-30% after)', category: 'combat', freshOnly: false }
        ]}
      ]
    },
    // Act 6
    {
      act: 6,
      zones: [
        { name: 'The Coast', tips: [
          { content: 'Back in Act 1 areas but higher level', category: 'general', freshOnly: false }
        ]}
      ]
    },
    // Act 7
    {
      act: 7,
      zones: [
        { name: 'The Bridge Encampment', tips: [
          { content: 'Grab Maramoa\'s quest for skill point', category: 'quest', freshOnly: false }
        ]}
      ]
    },
    // Act 8
    {
      act: 8,
      zones: [
        { name: 'The Harbour Bridge', tips: [
          { content: 'Popular farming spot for Humility cards', category: 'farming', freshOnly: false }
        ]}
      ]
    },
    // Act 9
    {
      act: 9,
      zones: [
        { name: 'The Vastiri Desert', tips: [
          { content: 'Oasis waypoint is tucked in the corner', category: 'navigation', freshOnly: false }
        ]}
      ]
    },
    // Act 10
    {
      act: 10,
      zones: [
        { name: 'The Ravaged Square', tips: [
          { content: 'Final Kitava fight - get resistances (-60% total after)', category: 'combat', freshOnly: false }
        ]}
      ]
    }
  ];

  actTips.forEach(actData => {
    acts.push({
      act: actData.act,
      zones: actData.zones.map(zone => ({
        name: zone.name,
        tips: zone.tips,
        objectives: []
      })),
      scrapedAt: new Date().toISOString()
    });
  });

  return {
    source: 'poe-leveling.com',
    sourceUrl: 'https://www.poe-leveling.com',
    scrapedAt: new Date().toISOString(),
    acts,
    totalZones: acts.reduce((sum, act) => sum + act.zones.length, 0),
    disclaimer: 'Mock data for testing',
    __mock: true
  };
}

/**
 * Generate mock PoE Wiki data
 */
function generateMockPOEWiki() {
  const rawData = [
    {
      gem: 'Cleave',
      questRewards: { Marauder: true, Duelist: true, Templar: false },
      vendorAvailability: { Marauder: true, Duelist: true, Templar: true, Ranger: false, Shadow: false, Witch: false }
    },
    {
      gem: 'Freezing Pulse',
      questRewards: { Witch: true, Templar: true, Shadow: false },
      vendorAvailability: { Witch: true, Templar: true, Shadow: true, Marauder: false, Duelist: false, Ranger: false }
    }
  ];

  const byClass = {
    Marauder: { questRewards: ['Cleave'], vendorGems: ['Cleave', 'Ground Slam'] },
    Duelist: { questRewards: ['Cleave'], vendorGems: ['Cleave', 'Splitting Steel'] },
    Ranger: { questRewards: [], vendorGems: ['Splitting Steel', 'Spectral Throw'] },
    Shadow: { questRewards: [], vendorGems: ['Spectral Throw', 'Freezing Pulse'] },
    Witch: { questRewards: ['Freezing Pulse'], vendorGems: ['Freezing Pulse', 'Spark'] },
    Templar: { questRewards: [], vendorGems: ['Cleave', 'Freezing Pulse'] },
    Scion: { questRewards: [], vendorGems: [] }
  };

  return {
    source: 'poewiki.net',
    sourceUrl: 'https://www.poewiki.net',
    scrapedAt: new Date().toISOString(),
    license: 'CC BY-NC-SA 3.0',
    gemCount: rawData.length,
    rawData,
    byClass,
    disclaimer: 'Mock data for testing',
    __mock: true
  };
}

/**
 * Main execution
 */
export async function generateMockData() {
  console.log('🎭 Generating mock data for testing...\n');

  await mkdir(OUTPUT_DIR, { recursive: true });

  // Generate all mock datasets
  console.log('📝 Creating mock datasets...');
  const exileLeveling = generateMockExileLeveling();
  const poeLeveling = generateMockPOELeveling();
  const poeWiki = generateMockPOEWiki();

  // Save mock files
  await writeFile(
    join(OUTPUT_DIR, 'exile-leveling-transformed.json'),
    JSON.stringify(exileLeveling, null, 2)
  );
  console.log('   ✓ exile-leveling-transformed.json (mock)');

  await writeFile(
    join(OUTPUT_DIR, 'poe-leveling-scraped.json'),
    JSON.stringify(poeLeveling, null, 2)
  );
  console.log('   ✓ poe-leveling-scraped.json (mock)');

  await writeFile(
    join(OUTPUT_DIR, 'poe-wiki-gems.json'),
    JSON.stringify(poeWiki, null, 2)
  );
  console.log('   ✓ poe-wiki-gems.json (mock)');

  console.log('\n✅ Mock data generation complete!');
  console.log(`   Output: ${OUTPUT_DIR}/`);
  console.log('   Ready for merge step\n');

  return { exileLeveling, poeLeveling, poeWiki };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMockData().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
