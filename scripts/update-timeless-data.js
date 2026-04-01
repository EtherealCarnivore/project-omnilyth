#!/usr/bin/env node
/**
 * Downloads timeless jewel data files from Nifth's TimelessCalcPreprocess repository.
 * Run: node scripts/update-timeless-data.js [version]
 * Default version: 3.28
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const version = process.argv[2] || '3.28';
const outDir = path.join(__dirname, '..', 'src', 'data', 'timeless');

const files = [
  {
    url: `https://raw.githubusercontent.com/Nifth/TimelessCalcPreprocess/main/data/${version}/alternatepassiveskills.json`,
    out: 'alternatePassiveSkills.json',
  },
  {
    url: `https://raw.githubusercontent.com/Nifth/TimelessCalcPreprocess/main/data/${version}/alternatepassiveadditions.json`,
    out: 'alternatePassiveAdditions.json',
  },
  {
    url: `https://nifth.github.io/TimelessCalc/data/translation.json`,
    out: 'translations.json',
  },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const get = (u) => {
      https.get(u, { headers: { 'User-Agent': 'Omnilyth-Updater' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }).on('error', reject);
    };
    get(url);
  });
}

(async () => {
  console.log(`Downloading timeless jewel data (version ${version})...`);
  for (const { url, out } of files) {
    try {
      const data = await fetch(url);
      const outPath = path.join(outDir, out);
      fs.writeFileSync(outPath, data);
      console.log(`  ${out}: ${data.length} bytes`);
    } catch (err) {
      console.error(`  FAILED ${out}: ${err.message}`);
      process.exit(1);
    }
  }
  console.log('Done.');
})();
