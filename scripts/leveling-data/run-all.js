/**
 * run-all.js
 * Master script that runs all data collection and merging steps
 *
 * Usage:
 *   node scripts/leveling-data/run-all.js           # Full pipeline
 *   node scripts/leveling-data/run-all.js --mock    # Use mock data (for testing)
 */

import { parseExileLeveling } from './parse-exile-leveling.js';
import { scrapePOELeveling } from './scrape-poe-leveling.js';
import { scrapePOEWiki } from './scrape-poe-wiki.js';
import { mergeDataSources } from './merge-data-sources.js';
import { generateMockData } from './generate-mock-data.js';

const useMockData = process.argv.includes('--mock');

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  Omnilyth Leveling Data Pipeline                         ║');
  console.log('║  Phase 2: Data Collection & Parsing                      ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    if (useMockData) {
      console.log('🎭 Running in MOCK MODE (for testing)\n');
      await generateMockData();
    } else {
      console.log('🌐 Running in LIVE MODE (real data sources)\n');
      console.log('⚠️  This will take 10-15 minutes due to rate limiting.\n');

      // Step 1: Parse exile-leveling
      console.log('═══ Step 1/4: Parse exile-leveling ═══');
      await parseExileLeveling();

      // Step 2: Scrape poe-leveling.com
      console.log('\n═══ Step 2/4: Scrape poe-leveling.com ═══');
      await scrapePOELeveling();

      // Step 3: Scrape PoE Wiki
      console.log('\n═══ Step 3/4: Scrape PoE Wiki ═══');
      await scrapePOEWiki();
    }

    // Step 4: Merge all data
    console.log('\n═══ Step 4/4: Merge Data Sources ═══');
    await mergeDataSources();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║  ✅ PIPELINE COMPLETE                                     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    console.log(`   Duration: ${duration}s`);
    console.log(`   Mode: ${useMockData ? 'MOCK' : 'LIVE'}`);
    console.log(`   Output: ./src/data/leveling/`);
    console.log('\n📖 Next steps:');
    console.log('   - Review generated data files in src/data/leveling/');
    console.log('   - Run Phase 3: Create comparison page');
    console.log('   - Run Phase 4: Build production UI\n');

  } catch (error) {
    console.error('\n❌ Pipeline failed:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

main();
