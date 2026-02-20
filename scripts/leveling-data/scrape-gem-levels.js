/**
 * scrape-gem-levels.js
 * Scrape gem level requirements from PoE Wiki Skill_gem page using jsdom
 * Source: https://www.poewiki.net/wiki/Skill_gem
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_URL = 'https://www.poewiki.net/wiki/Skill_gem';

/**
 * Fetch HTML from PoE Wiki
 */
async function fetchWikiPage() {
  console.log(`📡 Fetching ${WIKI_URL}...`);

  const response = await fetch(WIKI_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch wiki page: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log(`✅ Fetched ${(html.length / 1024).toFixed(1)}KB of HTML`);

  return html;
}

/**
 * Parse gem levels from HTML table
 */
function parseGemLevels(html) {
  console.log('🔍 Parsing HTML...');

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const gemLevels = {};
  let foundGems = 0;

  // Find all tables on the page
  const tables = document.querySelectorAll('table.wikitable');
  console.log(`📋 Found ${tables.length} wikitable(s)`);

  // Process each table
  tables.forEach((table, tableIndex) => {
    const rows = table.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
      // Skip header rows
      if (rowIndex === 0) return;

      // Get all cells in the row
      const cells = row.querySelectorAll('td, th');
      if (cells.length < 2) return;

      // First cell usually contains the gem name (with link)
      const nameCell = cells[0];
      const gemLink = nameCell.querySelector('a');

      if (!gemLink) return;

      const gemName = gemLink.textContent.trim();
      if (!gemName) return;

      // Look for "Requires Level X" in the row
      // It's usually in a span with title="Required character level at gem level 1"
      const levelSpan = row.querySelector('span[title*="Required character level"]');

      if (levelSpan) {
        const levelText = levelSpan.textContent.trim();
        const levelMatch = levelText.match(/(\d+)/);

        if (levelMatch) {
          const level = parseInt(levelMatch[1], 10);
          gemLevels[gemName] = level;
          foundGems++;
        }
      } else {
        // Fallback: Look for "Requires Level X" text pattern anywhere in the row
        const rowText = row.textContent;
        const levelMatch = rowText.match(/Requires Level\s+(\d+)/i);

        if (levelMatch) {
          const level = parseInt(levelMatch[1], 10);
          gemLevels[gemName] = level;
          foundGems++;
        }
      }
    });
  });

  console.log(`✅ Parsed ${foundGems} gems with level requirements`);

  return gemLevels;
}

/**
 * Save gem levels to JSON file
 */
function saveGemLevels(gemLevels) {
  const rawDir = path.join(__dirname, 'raw');
  if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
  }

  const outputPath = path.join(rawDir, 'gem-levels.json');

  const output = {
    scraped: new Date().toISOString(),
    source: WIKI_URL,
    count: Object.keys(gemLevels).length,
    data: gemLevels
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`💾 Saved to ${outputPath}`);

  // Print some stats
  const levels = Object.values(gemLevels);
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);

  console.log('\n📊 Statistics:');
  console.log(`   Total gems: ${output.count}`);
  console.log(`   Level range: ${minLevel} - ${maxLevel}`);

  // Count gems by level
  const levelCounts = {};
  levels.forEach(level => {
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  });

  console.log('\n📈 Gems by level:');
  Object.keys(levelCounts)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach(level => {
      console.log(`   Level ${level}: ${levelCounts[level]} gems`);
    });

  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting gem level scraper...\n');

    const html = await fetchWikiPage();
    const gemLevels = parseGemLevels(html);

    if (Object.keys(gemLevels).length === 0) {
      throw new Error('No gems found! Check HTML structure.');
    }

    const outputPath = saveGemLevels(gemLevels);

    console.log('\n✅ Scraping complete!');
    console.log(`📄 Data saved to: ${outputPath}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fetchWikiPage, parseGemLevels, saveGemLevels };
