/**
 * pobParser.js
 * Decodes Path of Building build codes and extracts gem data.
 *
 * PoB export format:
 * 1. XML string
 * 2. Compressed with zlib (deflate)
 * 3. Base64 encoded (URL-safe: - and _ instead of + and /)
 *
 * To decode: base64 → inflate → XML → parse gems
 */
import pako from 'pako';

/**
 * Decode a PoB build code string into parsed XML data.
 * Returns the XML document or null on failure.
 */
export function decodePoBCode(buildCode) {
  try {
    // Clean input
    const cleaned = buildCode.trim();
    if (!cleaned || cleaned.length < 20) {
      throw new Error('Build code too short');
    }

    // Convert URL-safe base64 to standard base64
    const standardBase64 = cleaned
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Decode base64 to binary
    const binaryString = atob(standardBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decompress with zlib inflate
    const xml = pako.inflate(bytes, { to: 'string' });

    // Parse XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML in build code');
    }

    return doc;
  } catch (err) {
    console.error('Failed to decode PoB code:', err.message);
    return null;
  }
}

/**
 * Extract gem names from a parsed PoB XML document.
 * Returns array of { name, level, quality, group } objects.
 */
export function extractGemsFromXML(doc) {
  if (!doc) return [];

  const gems = [];
  const seen = new Set();

  // PoB XML structure: <PathOfBuilding> → <Skills> → <Skill> → <Gem>
  const skillElements = doc.querySelectorAll('Skill');

  skillElements.forEach((skill, groupIndex) => {
    const gemElements = skill.querySelectorAll('Gem');

    gemElements.forEach((gem) => {
      const nameSpec = gem.getAttribute('nameSpec') || gem.getAttribute('skillId') || '';
      const level = parseInt(gem.getAttribute('level')) || 20;
      const quality = parseInt(gem.getAttribute('quality')) || 0;
      const enabled = gem.getAttribute('enabled') !== 'false';

      if (!nameSpec || !enabled) return;

      // Normalize name: remove "Vaal " prefix for matching, handle edge cases
      const name = normalizeGemName(nameSpec);
      if (!name) return;

      // Skip duplicates
      if (seen.has(name)) return;
      seen.add(name);

      gems.push({
        name,
        level,
        quality,
        group: groupIndex + 1,
        isSupport: name.toLowerCase().includes('support'),
      });
    });
  });

  return gems;
}

/**
 * Extract character class from PoB XML.
 */
export function extractClassFromXML(doc) {
  if (!doc) return null;

  const build = doc.querySelector('Build');
  if (!build) return null;

  const className = build.getAttribute('className');
  const ascendClassName = build.getAttribute('ascendClassName');

  // Map PoB class names to our class names
  const CLASS_MAP = {
    'Witch': 'Witch',
    'Shadow': 'Shadow',
    'Ranger': 'Ranger',
    'Duelist': 'Duelist',
    'Marauder': 'Marauder',
    'Templar': 'Templar',
    'Scion': 'Scion',
  };

  return {
    class: CLASS_MAP[className] || className || null,
    ascendancy: ascendClassName || null,
  };
}

/**
 * High-level function: decode PoB code and extract everything.
 */
export function parsePoBBuild(buildCode) {
  const doc = decodePoBCode(buildCode);
  if (!doc) {
    return { error: 'Failed to decode build code. Make sure you copied the full code.', gems: [], character: null };
  }

  const gems = extractGemsFromXML(doc);
  const character = extractClassFromXML(doc);

  if (gems.length === 0) {
    return { error: 'No gems found in build code. The build might not have any skill gems configured.', gems: [], character };
  }

  return { error: null, gems, character };
}

/**
 * Normalize gem names from PoB format to our format.
 * PoB sometimes uses slightly different names.
 */
function normalizeGemName(name) {
  if (!name) return null;

  let normalized = name.trim();

  // Remove "Vaal " prefix (we track base gems, not Vaal versions)
  if (normalized.startsWith('Vaal ')) {
    normalized = normalized.substring(5);
  }

  // Common PoB → standard name mappings
  const NAME_MAP = {
    'Summon Raging Spirit': 'Summon Raging Spirit',
    'Raise Zombie': 'Raise Zombie',
    'Raise Spectre': 'Raise Spectre',
    'Cast when Damage Taken': 'Cast when Damage Taken Support',
    'Ancestral Call': 'Ancestral Call Support',
    'Multistrike': 'Multistrike Support',
    'Spell Echo': 'Spell Echo Support',
    'Greater Multiple Projectiles': 'Greater Multiple Projectiles Support',
    'Lesser Multiple Projectiles': 'Lesser Multiple Projectiles Support',
    'Faster Attacks': 'Faster Attacks Support',
    'Faster Casting': 'Faster Casting Support',
    'Added Fire Damage': 'Added Fire Damage Support',
    'Added Cold Damage': 'Added Cold Damage Support',
    'Added Lightning Damage': 'Added Lightning Damage Support',
    'Increased Critical Strikes': 'Increased Critical Strikes Support',
    'Increased Critical Damage': 'Increased Critical Damage Support',
  };

  // Check if name needs mapping
  if (NAME_MAP[normalized]) {
    normalized = NAME_MAP[normalized];
  }

  return normalized;
}
