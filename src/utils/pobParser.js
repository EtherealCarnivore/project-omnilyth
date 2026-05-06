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
import { pobUrl } from './proxyUrl.js';

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
 * Extract link groups from a parsed PoB XML document.
 * Each <Skill> element represents a link group (gear slot with linked gems).
 * Preserves gem order within each group.
 *
 * Smart filtering:
 * - Skips single-gem groups (standalone auras/buffs don't need link group treatment)
 * - Deduplicates by main skill: keeps the group with the most gems (the "final form")
 * - Prefers slotted groups over unslotted ones (slotted = actual gear setup)
 * - Skips disabled groups
 *
 * Returns array of { id, label, slot, mainSkill, gems: [{ name, isSupport, gemData }], activeLinks, enabled }
 */
export function extractLinkGroupsFromXML(doc) {
  if (!doc) return [];

  const allGroups = [];
  const skillElements = doc.querySelectorAll('Skill');

  skillElements.forEach((skill, index) => {
    const slot = skill.getAttribute('slot') || '';
    const label = skill.getAttribute('label') || '';
    const enabled = skill.getAttribute('enabled') !== 'false';
    const gemElements = skill.querySelectorAll('Gem');

    if (gemElements.length === 0) return;
    if (!enabled) return;

    const gemsInGroup = [];

    gemElements.forEach((gem) => {
      const nameSpec = gem.getAttribute('nameSpec') || gem.getAttribute('skillId') || '';
      const gemEnabled = gem.getAttribute('enabled') !== 'false';

      if (!nameSpec || !gemEnabled) return;

      const name = normalizeGemName(nameSpec);
      if (!name) return;

      gemsInGroup.push({
        name,
        isSupport: name.toLowerCase().includes('support'),
      });
    });

    // Skip empty or single-gem groups
    if (gemsInGroup.length < 2) return;

    // mainSkill = first non-support gem, or first gem if all are supports (e.g. aura setups)
    const mainSkill = gemsInGroup.find(g => !g.isSupport) || gemsInGroup[0];

    allGroups.push({
      id: `lg-${index}`,
      label: label || slot || `Group ${index + 1}`,
      slot,
      mainSkill: mainSkill.name,
      gems: gemsInGroup,
      activeLinks: gemsInGroup.length,
      enabled,
    });
  });

  // Deduplicate by main skill: keep the group with the most gems.
  // If tied, prefer slotted groups (actual gear setup) over unslotted (leveling snapshots).
  const byMainSkill = new Map();
  for (const group of allGroups) {
    const key = group.mainSkill;
    const existing = byMainSkill.get(key);
    if (!existing) {
      byMainSkill.set(key, group);
      continue;
    }
    // Prefer more gems
    if (group.gems.length > existing.gems.length) {
      byMainSkill.set(key, group);
    } else if (group.gems.length === existing.gems.length && group.slot && !existing.slot) {
      // Same gem count: prefer slotted
      byMainSkill.set(key, group);
    }
  }

  return Array.from(byMainSkill.values());
}

/**
 * Detect what kind of input the user pasted.
 * Returns { type, id, message } where:
 * - type: 'raw' | 'pobbin' | 'pastebin' | 'unsupported'
 * - id: extracted ID for URL types, or null for raw
 * - message: user-facing hint for unsupported URLs
 */
export function detectPoBInput(input) {
  if (!input) return { type: 'raw', id: null, message: null };
  const trimmed = input.trim();

  // pobb.in: https://pobb.in/ID or pobb.in/ID
  const pobbinMatch = trimmed.match(/^(?:https?:\/\/)?pobb\.in\/([A-Za-z0-9_-]+)/);
  if (pobbinMatch) return { type: 'pobbin', id: pobbinMatch[1], message: null };

  // pastebin.com: https://pastebin.com/ID or pastebin.com/raw/ID
  const pastebinMatch = trimmed.match(/^(?:https?:\/\/)?pastebin\.com\/(?:raw\/)?([A-Za-z0-9]+)/);
  if (pastebinMatch) return { type: 'pastebin', id: pastebinMatch[1], message: null };

  // Unsupported URLs — give helpful messages
  if (trimmed.match(/^(?:https?:\/\/)?(?:www\.)?poe\.ninja\//i)) {
    return { type: 'unsupported', id: null, message: 'poe.ninja doesn\'t expose build codes in URLs. Open the build on poe.ninja, click the PoB export button, copy the raw code, and paste it here.' };
  }
  if (trimmed.match(/^(?:https?:\/\/)?(?:www\.)?maxroll\.gg\//i)) {
    return { type: 'unsupported', id: null, message: 'Maxroll uses its own planner format. Open the build guide, find the PoB code section, copy the raw code, and paste it here.' };
  }
  if (trimmed.match(/^(?:https?:\/\/)?(?:www\.)?poedb\.tw\//i)) {
    return { type: 'unsupported', id: null, message: 'poedb.tw is a reference wiki and doesn\'t have exportable build codes. Use pobb.in or paste a raw PoB code instead.' };
  }
  // Any other URL
  if (trimmed.match(/^https?:\/\//i)) {
    return { type: 'unsupported', id: null, message: 'This URL isn\'t supported. Paste a pobb.in link, pastebin link, or a raw PoB build code.' };
  }

  // Not a URL — treat as raw build code
  return { type: 'raw', id: null, message: null };
}

/**
 * Fetch the raw PoB build code from a supported URL.
 * In production: uses the Cloudflare Worker proxy.
 * In dev: uses Vite dev server proxy to fetch directly.
 * Returns { code, error }.
 */
export async function fetchPoBCodeFromUrl(source, id) {
  const isDev = import.meta.env.DEV;

  try {
    if (isDev) {
      return await fetchPoBCodeDev(source, id);
    }

    const response = await fetch(pobUrl(source, id));
    const data = await response.json();

    if (!response.ok || data.error) {
      return { code: null, error: data.error || `Failed to fetch build from ${source}` };
    }

    return { code: data.code, error: null };
  } catch (err) {
    return { code: null, error: `Network error fetching from ${source}. Try pasting the raw build code instead.` };
  }
}

/**
 * Dev-mode fetch: uses Vite proxy to bypass CORS, extracts code client-side.
 */
async function fetchPoBCodeDev(source, id) {
  try {
    if (source === 'pobbin') {
      const response = await fetch(`/api/pobbin/${id}`);
      if (!response.ok) {
        return { code: null, error: `pobb.in returned ${response.status}` };
      }
      const html = await response.text();
      const match = html.match(/buildcode[^>]*>([eE][A-Za-z0-9_+/=-]{20,})/);
      if (!match) {
        return { code: null, error: 'Could not extract build code from pobb.in page' };
      }
      return { code: match[1], error: null };
    }

    if (source === 'pastebin') {
      const response = await fetch(`/api/pastebin/raw/${id}`);
      if (!response.ok) {
        return { code: null, error: `Pastebin returned ${response.status}. The paste may be private or expired.` };
      }
      const text = (await response.text()).trim();
      if (!text.match(/^[A-Za-z0-9_+/=-]{20,}$/)) {
        return { code: null, error: 'Pastebin content does not look like a PoB build code' };
      }
      return { code: text, error: null };
    }

    return { code: null, error: `Unknown source: ${source}` };
  } catch (err) {
    return { code: null, error: `Network error fetching from ${source}. Try pasting the raw build code instead.` };
  }
}

/**
 * High-level function: decode PoB code and extract everything.
 */
export function parsePoBBuild(buildCode) {
  const doc = decodePoBCode(buildCode);
  if (!doc) {
    return { error: 'Failed to decode build code. Make sure you copied the full code.', gems: [], linkGroups: [], character: null };
  }

  const gems = extractGemsFromXML(doc);
  const linkGroups = extractLinkGroupsFromXML(doc);
  const character = extractClassFromXML(doc);

  if (gems.length === 0) {
    return { error: 'No gems found in build code. The build might not have any skill gems configured.', gems: [], linkGroups: [], character };
  }

  return { error: null, gems, linkGroups, character };
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
