/**
 * merge-gem-levels.js
 * Merge gem level requirements into gemAvailability.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load gem levels from scraped data
 */
function loadGemLevels() {
  const levelsPath = path.join(__dirname, 'raw', 'gem-levels.json');

  if (!fs.existsSync(levelsPath)) {
    throw new Error('gem-levels.json not found. Run scrape-gem-levels.js first.');
  }

  const levelsData = JSON.parse(fs.readFileSync(levelsPath, 'utf-8'));
  console.log(`✅ Loaded ${levelsData.count} gem levels from ${levelsPath}`);

  return levelsData.data;
}

/**
 * Load existing gem availability data
 */
function loadGemAvailability() {
  const availPath = path.join(__dirname, '../../src/data/leveling/gemAvailability.js');

  if (!fs.existsSync(availPath)) {
    throw new Error('gemAvailability.js not found.');
  }

  // Read the file and extract the exported object
  const content = fs.readFileSync(availPath, 'utf-8');

  // Extract the gemAvailabilityData object using regex
  const match = content.match(/export const gemAvailabilityData = ({[\s\S]*});/);

  if (!match) {
    throw new Error('Could not parse gemAvailabilityData from file.');
  }

  // Safely evaluate the object
  const gemData = eval(`(${match[1]})`);
  console.log(`✅ Loaded ${Object.keys(gemData).length} gems from gemAvailability.js`);

  return gemData;
}

/**
 * Merge gem levels into availability data
 */
function mergeGemLevels(gemAvailability, gemLevels) {
  console.log('\n🔄 Merging gem levels...');

  let matched = 0;
  let unmatched = 0;
  const unmatchedGems = [];

  for (const [gemName, gemData] of Object.entries(gemAvailability)) {
    if (gemLevels[gemName]) {
      gemData.requiredLevel = gemLevels[gemName];
      matched++;
    } else {
      // Try case-insensitive match
      const levelKey = Object.keys(gemLevels).find(
        key => key.toLowerCase() === gemName.toLowerCase()
      );

      if (levelKey) {
        gemData.requiredLevel = gemLevels[levelKey];
        matched++;
      } else {
        unmatched++;
        unmatchedGems.push(gemName);
      }
    }
  }

  console.log(`✅ Matched: ${matched} gems`);
  console.log(`⚠️  Unmatched: ${unmatched} gems`);

  if (unmatchedGems.length > 0 && unmatchedGems.length <= 20) {
    console.log('\n❌ Unmatched gems:');
    unmatchedGems.forEach(name => console.log(`   - ${name}`));
  }

  return gemAvailability;
}

/**
 * Generate updated gemAvailability.js file
 */
function generateAvailabilityFile(gemData) {
  const outputPath = path.join(__dirname, '../../src/data/leveling/gemAvailability.js');

  const header = `/**
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

export const gemAvailabilityData = `;

  const dataString = JSON.stringify(gemData, null, 2);
  const fileContent = header + dataString + ';\n';

  fs.writeFileSync(outputPath, fileContent);
  console.log(`💾 Saved to ${outputPath}`);

  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting gem level merge...\n');

    const gemLevels = loadGemLevels();
    const gemAvailability = loadGemAvailability();

    const mergedData = mergeGemLevels(gemAvailability, gemLevels);
    const outputPath = generateAvailabilityFile(mergedData);

    console.log('\n✅ Merge complete!');
    console.log(`📄 Updated file: ${outputPath}`);

    // Print some examples
    const exampleGems = ['Lightning Arrow', 'Arc', 'Determination', 'Blight'];
    console.log('\n📋 Example gems with levels:');

    exampleGems.forEach(gemName => {
      const gem = mergedData[gemName];
      if (gem && gem.requiredLevel) {
        console.log(`   ${gemName}: Level ${gem.requiredLevel}`);
      }
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { loadGemLevels, loadGemAvailability, mergeGemLevels, generateAvailabilityFile };
