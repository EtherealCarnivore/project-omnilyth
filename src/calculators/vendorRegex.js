/**
 * Vendor Regex Calculator
 *
 * Generates regex patterns for finding vendor items during leveling.
 * Handles sockets, links, stats, and item bases within PoE's 250-char limit.
 *
 * QUIRK: vendor stash search uses a different syntax than the player stash.
 * Vendor inventory tooltips include socket-color characters ("RGB"), link
 * dashes ("R-G-B"), and base-item names — so a vendor regex composes those
 * three layers, AND-ing them with spaces (not pipes). Compare gemRegex.js,
 * scarabRegex.js: those produce pipe-separated alternation lists.
 *
 * LINK: see also src/calculators/{gemRegex,scarabRegex,mapModRegex}.js — same
 * 250-char ceiling, different output shape per search context.
 */

/**
 * Get total socket count from socket configuration
 */
export function getTotalSockets(sockets) {
  return (sockets.r || 0) + (sockets.g || 0) + (sockets.b || 0) + (sockets.w || 0);
}

/**
 * Validate socket configuration
 */
export function validateSocketConfig(sockets) {
  const total = getTotalSockets(sockets);
  if (total > 6) {
    return { valid: false, error: 'Maximum 6 sockets allowed' };
  }
  return { valid: true };
}

/**
 * Validate link configuration against socket count
 */
export function validateLinkConfig(links, sockets) {
  const totalSockets = getTotalSockets(sockets);
  if (links > totalSockets) {
    return { valid: false, error: `Cannot have ${links} links with only ${totalSockets} sockets` };
  }
  if (links > 6) {
    return { valid: false, error: 'Maximum 6 links allowed' };
  }
  return { valid: true };
}

/**
 * Generate socket pattern regex
 * e.g., {r: 1, g: 1, b: 1} -> pattern for R-G-B in any order
 */
export function generateSocketPatternRegex(sockets, minLinks = 0) {
  const total = getTotalSockets(sockets);
  if (total === 0) return null;

  const parts = [];

  // Add socket colors
  if (sockets.r > 0) parts.push(`r{${sockets.r}}`);
  if (sockets.g > 0) parts.push(`g{${sockets.g}}`);
  if (sockets.b > 0) parts.push(`b{${sockets.b}}`);
  if (sockets.w > 0) parts.push(`w{${sockets.w}}`);

  // Create pattern - order doesn't matter in vendor search
  const pattern = parts.join('.*');

  return pattern;
}

/**
 * Generate link regex
 * e.g., 3 links -> "[-]{2}" (2 dashes = 3 linked sockets)
 *
 * QUIRK: PoE renders linked sockets with `-` between them in tooltips, so
 * "R-G-B" means a 3-link. Therefore N-link = (N-1) consecutive dashes. The
 * 1- and 2-link cases short-circuit out because they don't render dashes.
 */
export function generateLinkRegex(linkCount) {
  if (linkCount < 3) return null;

  const dashCount = linkCount - 1;
  return `[-]{${dashCount}}`;
}

/**
 * Generate stat regex with value range
 */
export function generateStatRegex(stat, minValue = null) {
  if (!stat) return null;

  let pattern = stat.regex;

  // If stat has range and user specified min value, add it
  if (stat.hasRange && minValue !== null && minValue > 0) {
    // Create number range regex
    // For example, if minValue is 25, match 25-99
    const rangePattern = generateNumberRangeRegex(minValue, stat.maxValue);
    pattern = `${rangePattern}.*${stat.regex}`;
  }

  return pattern;
}

/**
 * Generate number range regex (simplified)
 * This creates a pattern that matches numbers >= minValue
 */
function generateNumberRangeRegex(minValue, maxValue) {
  // For simplicity, just match the prefix digits
  // e.g., for 25+, match "2[5-9]|[3-9]\\d"

  if (minValue <= 0) return "\\d+";

  const minStr = minValue.toString();
  const maxStr = maxValue.toString();

  // Simple case: single digit
  if (minStr.length === 1) {
    if (maxStr.length === 1) {
      return `[${minStr}-${maxStr}]`;
    }
    return `[${minStr}-9]|\\d{2,}`;
  }

  // Two digits: match tens place and up
  if (minStr.length === 2) {
    const tens = minStr[0];
    const ones = minStr[1];

    if (ones === '0') {
      return `[${tens}-9]\\d`;
    }
    return `${tens}[${ones}-9]|[${parseInt(tens)+1}-9]\\d|\\d{3,}`;
  }

  // For larger numbers, just match prefix
  return `${minStr.substring(0, 2)}\\d*|[${parseInt(minStr[0])+1}-9]\\d+|\\d{${minStr.length+1},}`;
}

/**
 * Main function: Generate vendor regex based on configuration
 */
export function generateVendorRegex(config) {
  const { itemBase, sockets, links, stats, includeBase } = config;

  const parts = [];
  const warnings = [];

  // 1. Item base (if specified)
  if (includeBase && itemBase) {
    // Simplify item base name for regex
    const basePattern = itemBase
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .map(word => word.substring(0, 4))
      .join('.*');
    parts.push(`"${basePattern}"`);
  }

  // 2. Socket pattern
  if (sockets && getTotalSockets(sockets) > 0) {
    const socketPattern = generateSocketPatternRegex(sockets, links);
    if (socketPattern) {
      parts.push(`"${socketPattern}"`);
    }
  }

  // 3. Link pattern
  if (links >= 3) {
    const linkPattern = generateLinkRegex(links);
    if (linkPattern) {
      parts.push(`"${linkPattern}"`);
    }
  }

  // 4. Stats
  if (stats && stats.length > 0) {
    for (const statConfig of stats) {
      const { stat, value } = statConfig;
      if (!stat) continue;

      const statPattern = generateStatRegex(stat, value);
      if (statPattern) {
        parts.push(`"${statPattern}"`);
      }
    }
  }

  // Combine parts
  const regex = parts.join(' ');
  const characterCount = regex.length;

  // Check for warnings
  if (characterCount > 250) {
    warnings.push('Pattern exceeds 250 character limit');
  }

  if (links >= 5) {
    warnings.push(`${links}-link items are extremely rare in vendors`);
  }

  if (stats && stats.length > 5) {
    warnings.push('Too many stat filters may return no results');
  }

  return {
    regex,
    characterCount,
    valid: characterCount <= 250 && regex.length > 0,
    warnings
  };
}

/**
 * Chunk long regex patterns into 250-char segments
 * (for when you need multiple searches)
 *
 * Greedy bin-pack on space boundaries. Splits by ` ` (which is also the
 * AND-operator in PoE vendor search), so each chunk remains a syntactically
 * complete query. Don't change the split delimiter without checking that
 * generated chunks still parse correctly in-game.
 */
export function chunkRegex(pattern, maxLength = 250) {
  if (pattern.length <= maxLength) {
    return [pattern];
  }

  const chunks = [];
  const parts = pattern.split(' ');
  let currentChunk = '';

  for (const part of parts) {
    if ((currentChunk + ' ' + part).length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = part;
    } else {
      currentChunk = currentChunk ? currentChunk + ' ' + part : part;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
