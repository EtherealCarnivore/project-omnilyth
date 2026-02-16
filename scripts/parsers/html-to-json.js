/**
 * PoE Guide HTML Parser
 * Converts Google Sheets exported HTML into structured JSON
 */

import { readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const parseGuideHTML = (htmlPath, outputPath) => {
  console.log(`📖 Parsing: ${htmlPath}`);

  // Read HTML file
  const html = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Find the main table
  const table = document.querySelector('table');
  if (!table) {
    throw new Error('No table found in HTML');
  }

  const rows = Array.from(table.querySelectorAll('tr'));
  console.log(`📊 Found ${rows.length} rows`);

  const data = [];
  let headers = [];

  rows.forEach((row, index) => {
    const cells = Array.from(row.querySelectorAll('td, th'));
    const cellData = cells.map(cell => {
      // Get text content and clean it up
      let text = cell.textContent.trim();

      // Check for images (gem icons, currency, etc.)
      const img = cell.querySelector('img');
      if (img) {
        text = {
          text,
          image: img.src || img.getAttribute('src'),
          alt: img.alt || ''
        };
      }

      return text;
    });

    // First row is usually headers
    if (index === 0 || cellData.every(cell => typeof cell === 'string' && cell.length < 30)) {
      headers = cellData;
      console.log(`📋 Headers: ${headers.join(' | ')}`);
    } else if (cellData.some(cell => cell)) {
      // Create object from headers
      const rowData = {};
      cellData.forEach((cell, i) => {
        if (headers[i]) {
          rowData[headers[i]] = cell;
        } else {
          rowData[`col_${i}`] = cell;
        }
      });
      data.push(rowData);
    }
  });

  console.log(`✅ Parsed ${data.length} data rows`);

  // Save to JSON
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved to: ${outputPath}`);

  return data;
};

// Parse leveling guide
const levelingHTML = '/Users/kgenov/Downloads/PoE 3.26 Cheat Sheets (QOL Info)/1.Lvling.html';
const levelingJSON = './src/data/guides/leveling.json';

try {
  const data = parseGuideHTML(levelingHTML, levelingJSON);
  console.log('\n🎉 Parsing complete!');
  console.log(`📝 Sample row:`, JSON.stringify(data[0], null, 2));
} catch (error) {
  console.error('❌ Error:', error.message);
}
