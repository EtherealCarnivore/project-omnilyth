/**
 * transform-gem-data.js
 * Transforms scraped quest reward data into production gem availability format
 *
 * Input: quest-rewards-complete.json + gemData.js (existing gem icons)
 * Output: gemAvailability.js (production-ready)
 *
 * Usage: node scripts/leveling-data/transform-gem-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read quest rewards data
const questRewardsPath = path.join(__dirname, 'raw', 'quest-rewards-complete.json');
const questRewardsData = JSON.parse(fs.readFileSync(questRewardsPath, 'utf8'));

// Read existing gem data for icons
const gemDataPath = path.join(__dirname, '..', '..', 'src', 'data', 'gemData.js');
const gemDataContent = fs.readFileSync(gemDataPath, 'utf8');

// Extract gem data from JavaScript export
function extractGemData() {
  const match = gemDataContent.match(/export const skillGems = ({[\s\S]*?});/);
  if (!match) {
    throw new Error('Could not parse gemData.js');
  }

  // Convert JavaScript object to JSON-parseable format (simplified)
  // This is a basic parser - in production, use a proper JS parser
  const gemsMatch = gemDataContent.matchAll(/"([^"]+)":\s*{\s*name:\s*"([^"]+)",\s*regex:\s*"([^"]+)",\s*icon:\s*"([^"]+)",\s*isSupport:\s*(true|false)\s*}/g);

  const gems = {};
  for (const match of gemsMatch) {
    const [, key, name, regex, icon, isSupport] = match;
    gems[name] = {
      name,
      icon,
      isSupport: isSupport === 'true'
    };
  }

  return gems;
}

// Transform quest data to gem availability format
function transformToGemAvailability() {
  const existingGems = extractGemData();
  const gemAvailability = {};

  console.log('📊 Processing quest rewards...');
  console.log(`   Existing gems in gemData.js: ${Object.keys(existingGems).length}`);

  let totalGems = 0;
  let missingIcons = [];

  // Process each quest
  for (const quest of questRewardsData.quests) {
    for (const [gemName, classes] of Object.entries(quest.gems)) {
      totalGems++;

      // Create gem entry if it doesn't exist
      if (!gemAvailability[gemName]) {
        const gemInfo = existingGems[gemName];

        if (!gemInfo) {
          missingIcons.push(gemName);
          console.warn(`⚠️  Gem not found in gemData.js: ${gemName}`);
          continue;
        }

        gemAvailability[gemName] = {
          gemId: gemName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          name: gemName,
          icon: gemInfo.icon,
          type: gemInfo.isSupport ? 'support' : 'active',
          availability: []
        };
      }

      // Add quest availability
      gemAvailability[gemName].availability.push({
        act: quest.act,
        source: 'quest',
        questName: quest.quest,
        questId: quest.questId,
        classes: classes
      });
    }
  }

  console.log(`✅ Processed ${totalGems} gem rewards across ${questRewardsData.quests.length} quests`);
  console.log(`   Unique gems: ${Object.keys(gemAvailability).length}`);

  if (missingIcons.length > 0) {
    console.log(`⚠️  Missing icons for ${missingIcons.length} gems:`);
    missingIcons.forEach(gem => console.log(`      - ${gem}`));
  }

  // Add all remaining gems from gemData.js that aren't in quest rewards
  // These are vendor-purchasable gems, Vaal gems, Transfigured gems, drop-only gems, etc.
  console.log('📦 Adding non-quest gems from gemData.js...');

  let addedFromGemData = 0;
  for (const [gemName, gemInfo] of Object.entries(existingGems)) {
    if (gemAvailability[gemName]) continue; // Already has quest reward data

    gemAvailability[gemName] = {
      gemId: gemName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      name: gemName,
      icon: gemInfo.icon,
      type: gemInfo.isSupport ? 'support' : 'active',
      availability: []
    };
    addedFromGemData++;
  }
  console.log(`   Added ${addedFromGemData} gems from gemData.js`);
  console.log(`   Total unique gems: ${Object.keys(gemAvailability).length}`);

  // Add special vendors (Siosa, Lilly Roth) to all gems
  console.log('🔓 Adding special vendor availability...');

  for (const gem of Object.values(gemAvailability)) {
    // Siosa (Act 3) - removes class restrictions
    gem.availability.push({
      act: 3,
      source: 'siosa',
      questName: 'A Fixture of Fate',
      classes: [] // Empty = available to all classes
    });

    // Lilly Roth (Act 6) - all gems available
    gem.availability.push({
      act: 6,
      source: 'lilly',
      questName: 'Fallen from Grace',
      classes: []
    });
  }

  return gemAvailability;
}

// Generate production JavaScript file
function generateProductionFile(gemAvailability) {
  const outputPath = path.join(__dirname, '..', '..', 'src', 'data', 'leveling', 'gemAvailability.js');

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileContent = `/**
 * gemAvailability.js
 * Gem quest reward data merged with gem icons and level requirements
 * Generated: ${new Date().toISOString()}
 *
 * Data sources:
 * - Quest rewards: https://www.poewiki.net/wiki/Quest_Rewards
 * - Gem levels: https://www.poewiki.net/wiki/Skill_gem
 * - Gem icons: src/data/gemData.js (web.poecdn.com)
 *
 * Special vendors:
 * - Siosa (Act 3): Removes class restrictions
 * - Lilly Roth (Act 6): All gems available
 */

export const gemAvailabilityData = ${JSON.stringify(gemAvailability, null, 2)};

/**
 * Special vendors data
 */
export const specialVendors = ${JSON.stringify(questRewardsData.specialVendors, null, 2)};

/**
 * Get gem availability for specific class
 */
export function getGemAvailabilityForClass(gemName, className) {
  const gem = gemAvailabilityData[gemName];
  if (!gem) return null;

  // Filter sources available to this class
  return gem.availability.filter(source =>
    source.classes.length === 0 || source.classes.includes(className)
  );
}

/**
 * Get earliest act where gem is available for class
 */
export function getEarliestAct(gemName, className) {
  const availability = getGemAvailabilityForClass(gemName, className);
  if (!availability || availability.length === 0) return null;

  return Math.min(...availability.map(a => a.act));
}

/**
 * Check if gem is available as quest reward for class
 */
export function isQuestReward(gemName, className) {
  const availability = getGemAvailabilityForClass(gemName, className);
  return availability && availability.some(a =>
    a.source === 'quest' &&
    (a.classes.length === 0 || a.classes.includes(className))
  );
}

/**
 * Get all gems available in specific act
 */
export function getGemsForAct(actNumber, className) {
  const actGems = [];

  for (const [gemName, gemData] of Object.entries(gemAvailabilityData)) {
    const availability = gemData.availability.filter(a =>
      a.act === actNumber &&
      (a.classes.length === 0 || a.classes.includes(className))
    );

    if (availability.length > 0) {
      actGems.push({
        ...gemData,
        actAvailability: availability
      });
    }
  }

  return actGems;
}

export default gemAvailabilityData;
`;

  fs.writeFileSync(outputPath, fileContent);
  console.log(`✅ Generated production file: ${outputPath}`);
  console.log(`   Gems: ${Object.keys(gemAvailability).length}`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

  return outputPath;
}

// Validate generated data
function validateData(gemAvailability) {
  console.log('🔍 Validating generated data...');

  let errors = 0;
  const classes = ['Witch', 'Shadow', 'Ranger', 'Duelist', 'Marauder', 'Templar', 'Scion'];

  for (const [gemName, gemData] of Object.entries(gemAvailability)) {
    // Check required fields
    if (!gemData.gemId || !gemData.name || !gemData.icon || !gemData.type) {
      console.error(`❌ Missing required field for gem: ${gemName}`);
      errors++;
    }

    // Check availability array
    if (!Array.isArray(gemData.availability) || gemData.availability.length === 0) {
      console.error(`❌ No availability data for gem: ${gemName}`);
      errors++;
    }

    // Check each availability source
    for (const source of gemData.availability) {
      if (!source.act || !source.source) {
        console.error(`❌ Invalid availability source for gem: ${gemName}`);
        errors++;
      }

      // Validate class names
      for (const className of source.classes) {
        if (!classes.includes(className)) {
          console.error(`❌ Invalid class name "${className}" for gem: ${gemName}`);
          errors++;
        }
      }
    }
  }

  if (errors === 0) {
    console.log('✅ Validation passed - no errors found');
  } else {
    console.error(`❌ Validation failed with ${errors} errors`);
    process.exit(1);
  }
}

// Main execution
function main() {
  console.log('🚀 Starting gem data transformation...\n');

  try {
    const gemAvailability = transformToGemAvailability();
    validateData(gemAvailability);
    const outputPath = generateProductionFile(gemAvailability);

    console.log('\n✅ Transformation complete!');
    console.log(`\n📁 Output file: ${outputPath}`);
    console.log('\nNext steps:');
    console.log('  1. Review generated file for accuracy');
    console.log('  2. Import in React components:');
    console.log('     import { gemAvailabilityData } from "../data/leveling/gemAvailability";');
    console.log('  3. Use helper functions for filtering');
    console.log('  4. Test with different character classes\n');

  } catch (error) {
    console.error('❌ Error during transformation:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { transformToGemAvailability, generateProductionFile, validateData };
