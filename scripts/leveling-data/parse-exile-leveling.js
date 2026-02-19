/**
 * parse-exile-leveling.js
 * Parses data from exile-leveling GitHub repository
 * Source: https://github.com/HeartofPhos/exile-leveling
 *
 * This script downloads and transforms areas.json, quests.json, and gems.json
 * from the exile-leveling repository into Omnilyth's unified schema.
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const EXILE_LEVELING_BASE = 'https://raw.githubusercontent.com/HeartofPhos/exile-leveling/master';
const OUTPUT_DIR = './scripts/leveling-data/raw';

// Endpoints to fetch
const ENDPOINTS = {
  areas: `${EXILE_LEVELING_BASE}/data/areas.json`,
  quests: `${EXILE_LEVELING_BASE}/data/quests.json`,
  gems: `${EXILE_LEVELING_BASE}/data/gems.json`
};

/**
 * Fetch JSON from URL with error handling
 */
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Failed to fetch ${url}:`, error.message);
    return null;
  }
}

/**
 * Transform exile-leveling area data to Omnilyth schema
 */
function transformAreas(rawAreas) {
  if (!rawAreas) return [];

  return rawAreas.map((area, index) => ({
    id: area.id || `area-${index}`,
    name: area.name || 'Unknown Area',
    act: area.act || 1,
    level: area.area_level || 1,
    hasWaypoint: area.has_waypoint || false,
    isOptional: area.is_optional || false,
    connections: area.connection_ids || [],
    objectives: (area.quests || []).map(q => ({
      type: 'quest',
      description: q.name || q,
      reward: q.reward || null
    })),
    tips: [], // Will be enriched from poe-leveling.com
    craftingRecipes: [] // Will be enriched from wiki
  }));
}

/**
 * Transform exile-leveling quest data to Omnilyth schema
 */
function transformQuests(rawQuests) {
  if (!rawQuests) return [];

  return rawQuests.map((quest, index) => ({
    id: quest.id || `quest-${index}`,
    name: quest.name || 'Unknown Quest',
    act: quest.act || 1,
    required: !quest.optional,
    objectives: quest.objectives || [],
    rewards: {
      skillPoints: quest.skill_points || 0,
      passive: quest.passive_point || false,
      items: quest.rewards || []
    },
    zones: quest.areas || []
  }));
}

/**
 * Transform exile-leveling gem data to Omnilyth schema
 */
function transformGems(rawGems) {
  if (!rawGems) return [];

  return rawGems.map((gem, index) => ({
    id: gem.id || `gem-${index}`,
    name: gem.name || 'Unknown Gem',
    level: gem.level || 1,
    act: gem.act || 1,
    source: gem.vendor ? 'vendor' : 'quest',
    classes: gem.classes || [],
    color: gem.primary_attribute || 'str',
    quest: gem.quest_name || null,
    vendor: gem.vendor_name || null
  }));
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Parsing exile-leveling data...\n');

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Fetch all data
  console.log('📥 Fetching data from GitHub...');
  const [areasData, questsData, gemsData] = await Promise.all([
    fetchJSON(ENDPOINTS.areas),
    fetchJSON(ENDPOINTS.quests),
    fetchJSON(ENDPOINTS.gems)
  ]);

  // Transform data
  console.log('🔄 Transforming data to Omnilyth schema...');
  const transformed = {
    source: 'exile-leveling',
    sourceUrl: 'https://github.com/HeartofPhos/exile-leveling',
    fetchedAt: new Date().toISOString(),
    areas: transformAreas(areasData),
    quests: transformQuests(questsData),
    gems: transformGems(gemsData)
  };

  // Save raw data for reference
  console.log('💾 Saving transformed data...');
  await writeFile(
    join(OUTPUT_DIR, 'exile-leveling-transformed.json'),
    JSON.stringify(transformed, null, 2)
  );

  // Generate summary
  console.log('\n✅ Parsing complete!');
  console.log(`   Areas: ${transformed.areas.length}`);
  console.log(`   Quests: ${transformed.quests.length}`);
  console.log(`   Gems: ${transformed.gems.length}`);
  console.log(`   Output: ${OUTPUT_DIR}/exile-leveling-transformed.json\n`);

  return transformed;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { main as parseExileLeveling };
