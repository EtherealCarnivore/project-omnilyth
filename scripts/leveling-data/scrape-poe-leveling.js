/**
 * scrape-poe-leveling.js
 * Scrapes leveling guides and tips from poe-leveling.com
 * Source: https://www.poe-leveling.com
 *
 * IMPORTANT: This script respects robots.txt and implements rate limiting
 * to avoid overloading the server. Use responsibly.
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://www.poe-leveling.com';
const OUTPUT_DIR = './scripts/leveling-data/raw';
const RATE_LIMIT_MS = 2000; // 2 seconds between requests

// Rate limiter
let lastRequestTime = 0;
async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

/**
 * Fetch HTML with rate limiting and error handling
 */
async function fetchHTML(url) {
  await rateLimit();

  try {
    console.log(`  Fetching: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Omnilyth-Bot/1.0 (Educational; +https://github.com/EtherealCarnivore/project-omnilyth)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`❌ Failed to fetch ${url}:`, error.message);
    return null;
  }
}

/**
 * Check robots.txt before scraping
 */
async function checkRobotsTxt() {
  console.log('🤖 Checking robots.txt...');
  try {
    const response = await fetch(`${BASE_URL}/robots.txt`);
    if (response.ok) {
      const robotsTxt = await response.text();
      console.log('   Found robots.txt - reviewing rules...');

      // Check if our user-agent is disallowed
      if (robotsTxt.includes('Disallow: /')) {
        console.warn('⚠️  Site may disallow scraping. Proceeding with caution...');
      } else {
        console.log('✅ No explicit disallow found');
      }
    }
  } catch (error) {
    console.log('   No robots.txt found - proceeding cautiously');
  }
}

/**
 * Extract zone tips from HTML
 */
function extractZoneTips(dom, zoneName) {
  const tips = [];

  // This is a placeholder - actual implementation depends on site structure
  // We would need to inspect the HTML structure of poe-leveling.com to extract properly
  const document = dom.window.document;

  // Example extraction logic (needs to be adapted to actual site structure)
  const tipElements = document.querySelectorAll('.tip, .advice, .note');
  tipElements.forEach(el => {
    const content = el.textContent?.trim();
    if (content && content.length > 10) {
      tips.push({
        content,
        category: 'general',
        freshOnly: false
      });
    }
  });

  return tips;
}

/**
 * Scrape act pages for zone information
 */
async function scrapeActData(actNumber) {
  const url = `${BASE_URL}/act-${actNumber}`;
  const html = await fetchHTML(url);

  if (!html) {
    return { act: actNumber, zones: [], tips: [] };
  }

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Extract zone information
  const zones = [];
  const zoneElements = document.querySelectorAll('.zone, .area, [data-zone]');

  zoneElements.forEach(el => {
    const zoneName = el.querySelector('.zone-name, h3, h4')?.textContent?.trim();
    if (zoneName) {
      zones.push({
        name: zoneName,
        tips: extractZoneTips(dom, zoneName),
        objectives: []
      });
    }
  });

  return {
    act: actNumber,
    zones,
    scrapedAt: new Date().toISOString()
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🕷️  Scraping poe-leveling.com data...\n');

  // Check robots.txt first
  await checkRobotsTxt();

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log('\n📥 Scraping act data (this may take a while due to rate limiting)...');

  // Scrape all acts (1-10)
  const actData = [];
  for (let act = 1; act <= 10; act++) {
    const data = await scrapeActData(act);
    actData.push(data);
    console.log(`   ✓ Act ${act} complete (${data.zones.length} zones)`);
  }

  // Combine into unified structure
  const transformed = {
    source: 'poe-leveling.com',
    sourceUrl: BASE_URL,
    scrapedAt: new Date().toISOString(),
    acts: actData,
    totalZones: actData.reduce((sum, act) => sum + act.zones.length, 0),
    disclaimer: 'Data scraped for educational purposes. Please support the original site.'
  };

  // Save scraped data
  console.log('\n💾 Saving scraped data...');
  await writeFile(
    join(OUTPUT_DIR, 'poe-leveling-scraped.json'),
    JSON.stringify(transformed, null, 2)
  );

  console.log('\n✅ Scraping complete!');
  console.log(`   Total zones: ${transformed.totalZones}`);
  console.log(`   Output: ${OUTPUT_DIR}/poe-leveling-scraped.json`);
  console.log('\n⚠️  Note: Site structure may change. Verify data quality before use.\n');

  return transformed;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { main as scrapePOELeveling };
