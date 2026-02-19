/**
 * merge-data-sources.js
 * Merges data from all three sources into unified Omnilyth format
 * Creates act-based data chunks for code splitting
 *
 * Sources:
 * 1. exile-leveling (GitHub) - Areas, quests, gems
 * 2. poe-leveling.com - Zone guides and tips
 * 3. poewiki.net - Gem vendor availability
 *
 * Output: acts123-data.js, acts456-data.js, acts789-data.js, act10-data.js
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { parseExileLeveling } from './parse-exile-leveling.js';
import { scrapePOELeveling } from './scrape-poe-leveling.js';
import { scrapePOEWiki } from './scrape-poe-wiki.js';

const RAW_DIR = './scripts/leveling-data/raw';
const OUTPUT_DIR = './src/data/leveling';

/**
 * Load previously scraped data or scrape fresh
 */
async function loadOrFetchData() {
  console.log('📚 Loading/fetching data from all sources...\n');

  let exileLeveling, poeLeveling, poeWiki;

  // Try to load cached data first
  try {
    const exileRaw = await readFile(join(RAW_DIR, 'exile-leveling-transformed.json'), 'utf-8');
    exileLeveling = JSON.parse(exileRaw);
    console.log('✓ Loaded cached exile-leveling data');
  } catch {
    console.log('⟳ Fetching fresh exile-leveling data...');
    exileLeveling = await parseExileLeveling();
  }

  try {
    const poeRaw = await readFile(join(RAW_DIR, 'poe-leveling-scraped.json'), 'utf-8');
    poeLeveling = JSON.parse(poeRaw);
    console.log('✓ Loaded cached poe-leveling data');
  } catch {
    console.log('⟳ Scraping fresh poe-leveling data...');
    poeLeveling = await scrapePOELeveling();
  }

  try {
    const wikiRaw = await readFile(join(RAW_DIR, 'poe-wiki-gems.json'), 'utf-8');
    poeWiki = JSON.parse(wikiRaw);
    console.log('✓ Loaded cached wiki data');
  } catch {
    console.log('⟳ Scraping fresh wiki data...');
    poeWiki = await scrapePOEWiki();
  }

  return { exileLeveling, poeLeveling, poeWiki };
}

/**
 * Merge area data from multiple sources
 */
function mergeAreaData(exileAreas, poeLevelingActs) {
  const merged = [];

  // Use exile-leveling as base (most structured)
  exileAreas.forEach(area => {
    const mergedArea = { ...area };

    // Find corresponding zone in poe-leveling data
    const actData = poeLevelingActs?.find(a => a.act === area.act);
    if (actData) {
      const zoneData = actData.zones.find(z =>
        z.name.toLowerCase().includes(area.name.toLowerCase()) ||
        area.name.toLowerCase().includes(z.name.toLowerCase())
      );

      if (zoneData && zoneData.tips.length > 0) {
        mergedArea.tips = zoneData.tips;
      }
    }

    merged.push(mergedArea);
  });

  return merged;
}

/**
 * Enrich gem data with vendor availability
 */
function enrichGemData(exileGems, wikiGemData) {
  return exileGems.map(gem => {
    const enriched = { ...gem };

    // Find matching wiki data
    const wikiGem = wikiGemData?.rawData?.find(w =>
      w.gem.toLowerCase() === gem.name.toLowerCase()
    );

    if (wikiGem) {
      enriched.questRewards = wikiGem.questRewards;
      enriched.vendorAvailability = wikiGem.vendorAvailability;
    }

    return enriched;
  });
}

/**
 * Split merged data into act-based chunks
 */
function splitIntoActChunks(areas, quests, gems) {
  const chunks = {
    acts123: { acts: [1, 2, 3], areas: [], quests: [], gems: [] },
    acts456: { acts: [4, 5, 6], areas: [], quests: [], gems: [] },
    acts789: { acts: [7, 8, 9], areas: [], quests: [], gems: [] },
    act10: { acts: [10], areas: [], quests: [], gems: [] }
  };

  // Distribute areas
  areas.forEach(area => {
    if (area.act <= 3) chunks.acts123.areas.push(area);
    else if (area.act <= 6) chunks.acts456.areas.push(area);
    else if (area.act <= 9) chunks.acts789.areas.push(area);
    else chunks.act10.areas.push(area);
  });

  // Distribute quests
  quests.forEach(quest => {
    if (quest.act <= 3) chunks.acts123.quests.push(quest);
    else if (quest.act <= 6) chunks.acts456.quests.push(quest);
    else if (quest.act <= 9) chunks.acts789.quests.push(quest);
    else chunks.act10.quests.push(quest);
  });

  // Distribute gems
  gems.forEach(gem => {
    if (gem.act <= 3) chunks.acts123.gems.push(gem);
    else if (gem.act <= 6) chunks.acts456.gems.push(gem);
    else if (gem.act <= 9) chunks.acts789.gems.push(gem);
    else chunks.act10.gems.push(gem);
  });

  return chunks;
}

/**
 * Generate JavaScript module file
 */
function generateModuleFile(chunkName, data, credits) {
  const header = `/**
 * ${chunkName}.js - Leveling data for Acts ${data.acts.join(', ')}
 * Generated: ${new Date().toISOString()}
 *
 * Data sources:
 * - exile-leveling by HeartofPhos (GitHub)
 * - poe-leveling.com leveling guides
 * - Path of Exile Wiki (CC BY-NC-SA 3.0)
 */

`;

  const dataExport = `export const ${chunkName}Data = ${JSON.stringify(data, null, 2)};

export const credits = ${JSON.stringify(credits, null, 2)};

export default { data: ${chunkName}Data, credits };
`;

  return header + dataExport;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Merging data from all sources...\n');

  // Load data
  const { exileLeveling, poeLeveling, poeWiki } = await loadOrFetchData();

  // Merge data
  console.log('\n🔄 Merging datasets...');
  const mergedAreas = mergeAreaData(
    exileLeveling.areas,
    poeLeveling?.acts
  );

  const enrichedGems = enrichGemData(
    exileLeveling.gems,
    poeWiki
  );

  console.log(`   ✓ Merged ${mergedAreas.length} areas`);
  console.log(`   ✓ Enriched ${enrichedGems.length} gems`);
  console.log(`   ✓ Included ${exileLeveling.quests.length} quests`);

  // Split into chunks
  console.log('\n📦 Creating act-based chunks...');
  const chunks = splitIntoActChunks(
    mergedAreas,
    exileLeveling.quests,
    enrichedGems
  );

  // Generate credits
  const credits = {
    sources: [
      {
        name: 'exile-leveling',
        author: 'HeartofPhos',
        url: 'https://github.com/HeartofPhos/exile-leveling',
        description: 'Structured leveling data'
      },
      {
        name: 'poe-leveling.com',
        url: 'https://www.poe-leveling.com',
        description: 'Leveling guides and tips'
      },
      {
        name: 'Path of Exile Wiki',
        url: 'https://www.poewiki.net',
        license: 'CC BY-NC-SA 3.0',
        description: 'Community-maintained game data'
      }
    ],
    generatedAt: new Date().toISOString(),
    disclaimer: 'Data compiled for educational purposes. Please support the original sources.'
  };

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Write chunk files
  console.log('\n💾 Writing chunk files...');
  for (const [chunkName, chunkData] of Object.entries(chunks)) {
    const moduleContent = generateModuleFile(chunkName, chunkData, credits);
    const filename = `${chunkName}-data.js`;

    await writeFile(
      join(OUTPUT_DIR, filename),
      moduleContent
    );

    const sizeKB = (moduleContent.length / 1024).toFixed(2);
    console.log(`   ✓ ${filename} (${sizeKB} KB, ${chunkData.areas.length} areas)`);
  }

  // Generate summary
  console.log('\n✅ Data merge complete!\n');
  console.log('📊 Summary:');
  console.log(`   Acts 1-3:  ${chunks.acts123.areas.length} areas, ${chunks.acts123.quests.length} quests, ${chunks.acts123.gems.length} gems`);
  console.log(`   Acts 4-6:  ${chunks.acts456.areas.length} areas, ${chunks.acts456.quests.length} quests, ${chunks.acts456.gems.length} gems`);
  console.log(`   Acts 7-9:  ${chunks.acts789.areas.length} areas, ${chunks.acts789.quests.length} quests, ${chunks.acts789.gems.length} gems`);
  console.log(`   Act 10:    ${chunks.act10.areas.length} areas, ${chunks.act10.quests.length} quests, ${chunks.act10.gems.length} gems`);
  console.log(`\n   Output: ${OUTPUT_DIR}/\n`);

  return chunks;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { main as mergeDataSources };
