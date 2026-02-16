#!/usr/bin/env node
/**
 * generateGemData.js — Fetches gem names from poe.ninja and generates
 * src/data/gemData.js with shortest-unique-regex fragments.
 *
 * Usage: node scripts/generateGemData.js "Phrecia 2.0"
 *
 * The regex algorithm finds the shortest substring of each gem name that
 * uniquely identifies it within the full gem list. Tries plain substrings
 * first, then ^-anchored and $-anchored variants.
 */

const league = process.argv[2] || 'Phrecia 2.0';
const API_URL = `https://poe.ninja/poe1/api/economy/stash/current/item/overview?league=${encodeURIComponent(league)}&type=SkillGem`;
const OUTPUT_PATH = new URL('../src/data/gemData.js', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

async function fetchGems() {
  console.log(`Fetching gems for league: ${league}`);
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`poe.ninja returned ${res.status}: ${res.statusText}`);
  const data = await res.json();

  // Collect unique names + first icon seen per gem
  const gems = new Map();
  for (const line of data.lines) {
    if (line.name && !gems.has(line.name)) {
      gems.set(line.name, line.icon || '');
    }
  }

  console.log(`Found ${gems.size} unique gem names`);
  return gems; // Map<name, icon>
}

function classify(name) {
  return name.endsWith(' Support');
}

/**
 * For a given gem name, find the shortest substring (optionally anchored)
 * that uniquely matches only this gem within the provided name list.
 *
 * Awakened gems get special treatment: short fragments like "d br" would match
 * item mods in the stash, so we use "awa.+<token>.+support" format instead.
 * PoE's stash search supports regex, and this pattern is both specific and readable.
 */
function findShortestRegex(target, allNames) {
  // Awakened gems: use "awa.+<unique middle>.+support" pattern
  const awakenedMatch = target.match(/^Awakened (.+) Support$/i);
  if (awakenedMatch) {
    return findAwakenedRegex(awakenedMatch[1], allNames);
  }

  const lower = target.toLowerCase();
  const lowerAll = allNames.map(n => n.toLowerCase());

  for (let len = 1; len <= lower.length; len++) {
    for (let start = 0; start + len <= lower.length; start++) {
      const sub = lower.slice(start, start + len);

      // Plain substring
      if (lowerAll.filter(n => n.includes(sub)).length === 1) {
        return sub;
      }

      // ^-anchored (start of string)
      if (start === 0) {
        const anchored = '^' + sub;
        if (lowerAll.filter(n => n.startsWith(sub)).length === 1) {
          return anchored;
        }
      }

      // $-anchored (end of string)
      if (start + len === lower.length) {
        const anchored = sub + '$';
        if (lowerAll.filter(n => n.endsWith(sub)).length === 1) {
          return anchored;
        }
      }
    }
  }

  // Fallback: full name anchored both sides (should never happen)
  return '^' + lower + '$';
}

/**
 * For "Awakened X Support" gems, find the shortest substring of the middle part (X)
 * that uniquely identifies it among all awakened gems, then return "awa.+<token>.+support".
 */
function findAwakenedRegex(middle, allNames) {
  const middles = allNames
    .filter(n => /^Awakened .+ Support$/i.test(n))
    .map(n => n.match(/^Awakened (.+) Support$/i)[1].toLowerCase());

  const lower = middle.toLowerCase();

  for (let len = 1; len <= lower.length; len++) {
    for (let start = 0; start + len <= lower.length; start++) {
      const sub = lower.slice(start, start + len);
      if (middles.filter(m => m.includes(sub)).length === 1) {
        return `awa.+${sub}.+support`;
      }
    }
  }

  // Fallback: full middle
  return `awa.+${lower}.+support`;
}

/**
 * Plain shortest-unique-substring regex (no awakened special-casing).
 * Used for the "short mode" toggle on awakened gems.
 */
function findShortestPlainRegex(target, allNames) {
  const lower = target.toLowerCase();
  const lowerAll = allNames.map(n => n.toLowerCase());

  for (let len = 1; len <= lower.length; len++) {
    for (let start = 0; start + len <= lower.length; start++) {
      const sub = lower.slice(start, start + len);
      if (lowerAll.filter(n => n.includes(sub)).length === 1) return sub;
      if (start === 0 && lowerAll.filter(n => n.startsWith(sub)).length === 1) return '^' + sub;
      if (start + len === lower.length && lowerAll.filter(n => n.endsWith(sub)).length === 1) return sub + '$';
    }
  }
  return '^' + lower + '$';
}

function generateFileContent(skillGems, supportGems) {
  const timestamp = new Date().toISOString().slice(0, 10);

  let out = `/*\n * gemData.js — Auto-generated gem data with shortest-unique regex fragments.\n * Generated: ${timestamp} | League: ${league}\n *\n * Do not edit manually. Regenerate with:\n *   node scripts/generateGemData.js "${league}"\n */\n\n`;

  out += 'export const skillGems = {\n';
  for (const gem of skillGems) {
    out += `  ${JSON.stringify(gem.name)}: { name: ${JSON.stringify(gem.name)}, regex: ${JSON.stringify(gem.regex)}, icon: ${JSON.stringify(gem.icon)}, isSupport: false },\n`;
  }
  out += '};\n\n';

  out += 'export const supportGems = {\n';
  for (const gem of supportGems) {
    const short = gem.regexShort ? `, regexShort: ${JSON.stringify(gem.regexShort)}` : '';
    out += `  ${JSON.stringify(gem.name)}: { name: ${JSON.stringify(gem.name)}, regex: ${JSON.stringify(gem.regex)}${short}, icon: ${JSON.stringify(gem.icon)}, isSupport: true },\n`;
  }
  out += '};\n\n';

  out += 'export const skillGemList = Object.values(skillGems);\n';
  out += 'export const supportGemList = Object.values(supportGems);\n';
  out += 'export const allGems = { ...skillGems, ...supportGems };\n';

  return out;
}

async function main() {
  const gemMap = await fetchGems();
  const allNames = [...gemMap.keys()].sort();

  const skillNames = allNames.filter(n => !classify(n));
  const supportNames = allNames.filter(n => classify(n));
  console.log(`Classified: ${skillNames.length} skill gems, ${supportNames.length} support gems`);

  console.log('Computing regexes for skill gems...');
  const skillGems = skillNames.map(name => ({
    name,
    regex: findShortestRegex(name, allNames),
    icon: gemMap.get(name),
  }));

  console.log('Computing regexes for support gems...');
  const supportGems = supportNames.map(name => {
    const gem = { name, regex: findShortestRegex(name, allNames), icon: gemMap.get(name) };
    // Awakened gems get a second, shorter regex (plain unique substring) for the "short mode" toggle
    if (/^Awakened .+ Support$/i.test(name)) {
      gem.regexShort = findShortestPlainRegex(name, allNames);
    }
    return gem;
  });

  const content = generateFileContent(skillGems, supportGems);

  const fs = await import('node:fs');
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`  ${skillGems.length} skill gems + ${supportGems.length} support gems = ${skillGems.length + supportGems.length} total`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
