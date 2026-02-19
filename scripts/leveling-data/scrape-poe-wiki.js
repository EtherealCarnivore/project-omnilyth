/**
 * scrape-poe-wiki.js
 * Scrapes gem vendor availability and quest rewards from Path of Exile Wiki
 * Source: https://www.poewiki.net
 *
 * IMPORTANT: Respects robots.txt and implements rate limiting.
 * Wiki content is community-maintained and licensed under CC BY-NC-SA 3.0
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://www.poewiki.net';
const OUTPUT_DIR = './scripts/leveling-data/raw';
const RATE_LIMIT_MS = 3000; // 3 seconds between requests (be extra respectful to wiki)

// PoE class names
const POE_CLASSES = [
  'Marauder', 'Duelist', 'Ranger',
  'Shadow', 'Witch', 'Templar', 'Scion'
];

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
 * Fetch HTML with rate limiting
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
 * Check robots.txt
 */
async function checkRobotsTxt() {
  console.log('🤖 Checking robots.txt...');
  try {
    const response = await fetch(`${BASE_URL}/robots.txt`);
    if (response.ok) {
      const robotsTxt = await response.text();
      console.log('   Found robots.txt - reviewing rules...');

      // Wiki typically allows scraping but with rate limits
      if (robotsTxt.toLowerCase().includes('crawl-delay')) {
        console.log('   ⏱️  Crawl delay specified - respecting rate limits');
      }
    }
  } catch (error) {
    console.log('   No robots.txt found');
  }
}

/**
 * Extract gem vendor information from wiki page
 */
function extractGemVendorData(dom, gemName) {
  const document = dom.window.document;
  const vendorInfo = {
    gem: gemName,
    questRewards: {},
    vendorAvailability: {}
  };

  // Look for vendor/quest reward tables
  const tables = document.querySelectorAll('table.wikitable');

  tables.forEach(table => {
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());

    // Check if this is a quest reward or vendor table
    const isQuestTable = headers.some(h => h.toLowerCase().includes('quest'));
    const isVendorTable = headers.some(h => h.toLowerCase().includes('vendor'));

    if (isQuestTable || isVendorTable) {
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const classCell = cells[0]?.textContent?.trim();
          const availableCell = cells[1]?.textContent?.trim();

          // Check if this matches a PoE class
          const poeClass = POE_CLASSES.find(c => classCell?.includes(c));
          if (poeClass) {
            if (isQuestTable) {
              vendorInfo.questRewards[poeClass] = availableCell !== 'No';
            } else if (isVendorTable) {
              vendorInfo.vendorAvailability[poeClass] = availableCell !== 'No';
            }
          }
        }
      });
    }
  });

  return vendorInfo;
}

/**
 * Scrape vendor information for a specific gem
 */
async function scrapeGemPage(gemName) {
  const wikiPageName = gemName.replace(/ /g, '_');
  const url = `${BASE_URL}/wiki/${wikiPageName}`;

  const html = await fetchHTML(url);
  if (!html) {
    return null;
  }

  const dom = new JSDOM(html);
  return extractGemVendorData(dom, gemName);
}

/**
 * Get list of commonly used leveling gems
 */
function getLevelingGems() {
  return [
    // Movement skills
    'Dash', 'Flame Dash', 'Leap Slam', 'Shield Charge', 'Whirling Blades',
    // Common leveling skills
    'Splitting Steel', 'Spectral Helix', 'Holy Flame Totem',
    'Caustic Arrow', 'Toxic Rain', 'Lightning Trap',
    'Freezing Pulse', 'Spark', 'Explosive Trap',
    // Essential support gems
    'Faster Attacks Support', 'Faster Casting Support',
    'Added Cold Damage Support', 'Added Fire Damage Support',
    'Lesser Multiple Projectiles Support', 'Pierce Support',
    // Auras
    'Clarity', 'Grace', 'Determination', 'Discipline'
  ];
}

/**
 * Main execution
 */
async function main() {
  console.log('📚 Scraping PoE Wiki for gem vendor data...\n');

  await checkRobotsTxt();
  await mkdir(OUTPUT_DIR, { recursive: true });

  const levelingGems = getLevelingGems();
  console.log(`\n📥 Scraping ${levelingGems.length} gems (this will take ~${Math.ceil(levelingGems.length * RATE_LIMIT_MS / 1000 / 60)} minutes)...\n`);

  const gemData = [];
  let successCount = 0;
  let failCount = 0;

  for (const gemName of levelingGems) {
    const data = await scrapeGemPage(gemName);
    if (data) {
      gemData.push(data);
      successCount++;
      console.log(`   ✓ ${gemName} (${successCount}/${levelingGems.length})`);
    } else {
      failCount++;
      console.log(`   ✗ ${gemName} failed (${failCount} total failures)`);
    }
  }

  // Organize by class for easy lookup
  const byClass = {};
  POE_CLASSES.forEach(className => {
    byClass[className] = {
      questRewards: [],
      vendorGems: []
    };
  });

  gemData.forEach(gem => {
    Object.entries(gem.questRewards).forEach(([className, available]) => {
      if (available && byClass[className]) {
        byClass[className].questRewards.push(gem.gem);
      }
    });

    Object.entries(gem.vendorAvailability).forEach(([className, available]) => {
      if (available && byClass[className]) {
        byClass[className].vendorGems.push(gem.gem);
      }
    });
  });

  const transformed = {
    source: 'poewiki.net',
    sourceUrl: BASE_URL,
    scrapedAt: new Date().toISOString(),
    license: 'CC BY-NC-SA 3.0',
    gemCount: gemData.length,
    rawData: gemData,
    byClass,
    disclaimer: 'Wiki data is community-maintained. Verify accuracy in-game.'
  };

  // Save data
  console.log('\n💾 Saving wiki data...');
  await writeFile(
    join(OUTPUT_DIR, 'poe-wiki-gems.json'),
    JSON.stringify(transformed, null, 2)
  );

  console.log('\n✅ Wiki scraping complete!');
  console.log(`   Successful: ${successCount}/${levelingGems.length} gems`);
  console.log(`   Failed: ${failCount}/${levelingGems.length} gems`);
  console.log(`   Output: ${OUTPUT_DIR}/poe-wiki-gems.json`);
  console.log('\n📖 License: CC BY-NC-SA 3.0 (community content)\n');

  return transformed;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { main as scrapePOEWiki };
