/**
 * Leveling Guide Parser
 * Converts the parsed JSON into component-ready structure
 */

import { readFileSync, writeFileSync } from 'fs';

const rawData = JSON.parse(readFileSync('./src/data/guides/leveling.json', 'utf-8'));

// Extract acts from the raw data
const acts = rawData
  .filter(row => {
    // Find rows that have "Act N:" keys
    return Object.keys(row).some(key => key.match(/^Act \d+:$/));
  })
  .map(row => {
    // Get the act number and content
    const actKey = Object.keys(row).find(key => key.match(/^Act \d+:$/));
    const actNum = parseInt(actKey.match(/\d+/)[0]);
    const content = row[actKey];

    // Parse the zones from the content
    // Format: "Zone1 - notes - Zone2 - notes - DC/TP Zone3 - etc"
    const zones = [];

    // Split by common delimiters but keep zone structure
    const parts = content.split(/\s+-\s+/);

    let currentZone = null;
    let currentNotes = [];

    parts.forEach(part => {
      part = part.trim();
      if (!part) return;

      // Check if this looks like a zone name (capitalized, no special instructions)
      const isZoneName = /^[A-Z]/.test(part) &&
                        !part.includes('DC/TP') &&
                        !part.includes('WP') &&
                        part.length > 2 &&
                        part.length < 40;

      if (isZoneName && !part.match(/^\(\d+\)$/)) {
        // Save previous zone if exists
        if (currentZone) {
          zones.push({
            name: currentZone,
            notes: currentNotes.join(', '),
            waypoint: currentNotes.some(n => n.includes('WP'))
          });
        }

        currentZone = part;
        currentNotes = [];
      } else if (currentZone) {
        currentNotes.push(part);
      }
    });

    // Save last zone
    if (currentZone) {
      zones.push({
        name: currentZone,
        notes: currentNotes.join(', '),
        waypoint: currentNotes.some(n => n.includes('WP'))
      });
    }

    return {
      act: actNum,
      zones: zones.length > 0 ? zones : [
        {
          name: 'Full walkthrough',
          notes: content,
          waypoint: content.includes('WP')
        }
      ]
    };
  })
  .sort((a, b) => a.act - b.act);

console.log(`✅ Parsed ${acts.length} acts`);
acts.forEach(act => {
  console.log(`   Act ${act.act}: ${act.zones.length} zones`);
});

// Save structured data
writeFileSync('./src/data/guides/leveling-structured.json', JSON.stringify(acts, null, 2));
console.log('💾 Saved to: src/data/guides/leveling-structured.json');
