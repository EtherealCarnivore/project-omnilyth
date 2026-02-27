/*
 * passiveTree.js — Pure logic for the passive skill tree planner.
 *
 * Positioning: converts GGG's group + orbit data into absolute x/y coords.
 * Pathing: BFS from class start to validate connected allocations.
 * Encoding: extended format with class, ascendancy, masteries → pako compress → base64url for URL sharing.
 * Stat grouping: categorize node stats by category for the summary panel (includes masteries).
 *
 * No React, no state, no side effects. Just math and graph traversal.
 */

import { deflate, inflate } from 'pako';
import { ORBIT_RADII, SKILLS_PER_ORBIT, STAT_CATEGORIES } from '../data/passive/passiveTreeConstants';

// ─── Positioning ────────────────────────────────────────────────────────────

/**
 * Calculate the absolute x/y position of a node based on its group and orbit.
 * GGG convention: angle starts at -π/2 (top of circle) and goes clockwise.
 */
export function calculateNodePosition(node, groups) {
  const group = groups[node.group];
  if (!group) return { x: 0, y: 0 };

  const orbit = node.orbit;
  const orbitIndex = node.orbitIndex;

  if (orbit === 0) {
    return { x: group.x, y: group.y };
  }

  const radius = ORBIT_RADII[orbit] || 0;
  const skillsInOrbit = SKILLS_PER_ORBIT[orbit] || 1;
  const angle = (2 * Math.PI * orbitIndex / skillsInOrbit) - (Math.PI / 2);

  return {
    x: group.x + radius * Math.cos(angle),
    y: group.y + radius * Math.sin(angle),
  };
}

/**
 * Pre-calculate positions for all nodes. Returns a Map of nodeId → {x, y}.
 */
export function calculateAllPositions(nodes, groups) {
  const positions = {};
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (nodeId === 'root') {
      const rootGroup = groups[node.group];
      positions[nodeId] = rootGroup ? { x: rootGroup.x, y: rootGroup.y } : { x: 0, y: 0 };
    } else {
      positions[nodeId] = calculateNodePosition(node, groups);
    }
  }
  return positions;
}

/**
 * Get the bounding box of all positioned nodes.
 */
export function getBoundingBox(positions) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const { x, y } of Object.values(positions)) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

// ─── Node Classification ────────────────────────────────────────────────────

/**
 * Determine the visual type of a node (extended for passive tree).
 * Returns: regular, notable, keystone, mastery, jewelSocket, classStart,
 *          ascendancyStart, ascendancyRegular, ascendancyNotable
 */
export function getNodeType(node) {
  // Class start nodes
  if (node.classStartIndex !== undefined) return 'classStart';

  // Ascendancy nodes
  if (node.isAscendancyStart) return 'ascendancyStart';
  if (node.ascendancyName) {
    if (node.isNotable) return 'ascendancyNotable';
    return 'ascendancyRegular';
  }

  // Regular tree nodes
  if (node.isJewelSocket || node.expansionJewel) return 'jewelSocket';
  if (node.isKeystone) return 'keystone';
  if (node.isNotable) return 'notable';
  if (node.isMastery) return 'mastery';
  return 'regular';
}

/**
 * Check if a node is allocatable (has stats, not mastery, not class start, not proxy).
 */
export function isAllocatable(nodeId, node) {
  if (nodeId === 'root') return false;
  if (node.classStartIndex !== undefined) return false; // Class start nodes cannot be allocated
  if (node.isProxy) return false; // Proxy nodes are connectors only
  if (node.isMastery) return false;
  if (!node.name || node.name === '') return false;
  return true;
}

/**
 * Check if an ascendancy node can be allocated (requires ascendancy class selected).
 * Returns true if the node belongs to the selected ascendancy and meets normal allocation rules.
 */
export function isAscendancyAllocatable(nodeId, node, selectedAscendancyId) {
  if (!node.ascendancyName) return false;
  if (node.isAscendancyStart) return false; // Start nodes auto-allocated
  if (!selectedAscendancyId) return false; // No ascendancy selected

  // Check if node belongs to the selected ascendancy
  // This requires the node's ascendancyName to match the selected ascendancy
  // (Implementation note: you'll need to map ascendancyId → ascendancyName in the UI layer)
  return isAllocatable(nodeId, node);
}

// ─── Graph / Pathing ────────────────────────────────────────────────────────

/**
 * Build an adjacency list from node connections.
 * Connections are bidirectional: if A→B exists, B→A is also valid for pathing.
 */
export function buildAdjacencyList(nodes) {
  const adj = {};
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (!adj[nodeId]) adj[nodeId] = new Set();
    for (const outId of (node.out || [])) {
      adj[nodeId].add(outId);
      if (!adj[outId]) adj[outId] = new Set();
      adj[outId].add(nodeId);
    }
    for (const inId of (node.in || [])) {
      adj[nodeId].add(inId);
      if (!adj[inId]) adj[inId] = new Set();
      adj[inId].add(nodeId);
    }
  }
  return adj;
}

/**
 * Identify bridge nodes — nodes that aren't allocatable but exist as connectors
 * (like proxy nodes). These are traversed through transparently during pathing.
 */
export function getBridgeNodes(nodes) {
  const bridges = new Set();
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (nodeId === 'root') continue;
    if (!isAllocatable(nodeId, node) && !node.isMastery && (node.out?.length > 0 || node.in?.length > 0)) {
      bridges.add(nodeId);
    }
  }
  return bridges;
}

/**
 * BFS from root through allocated nodes (and bridge nodes). Returns the set of reachable allocated nodeIds.
 * Bridge nodes are traversed through transparently — they don't need to be allocated.
 */
export function getReachableNodes(allocatedSet, adjacencyList, bridgeNodes, rootId = 'root') {
  const reachable = new Set();
  const queue = [rootId];
  const visited = new Set([rootId]);

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = adjacencyList[current];
    if (!neighbors) continue;

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);

      // Bridge nodes: traverse through without needing allocation
      if (bridgeNodes.has(neighbor)) {
        queue.push(neighbor);
        continue;
      }

      if (allocatedSet.has(neighbor)) {
        reachable.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return reachable;
}

/**
 * Check if allocating a node would maintain a connected tree.
 * A node can be allocated if it's reachable from root/allocated tree through
 * allocated or bridge nodes.
 */
export function canAllocate(nodeId, allocatedSet, adjacencyList, bridgeNodes, rootId = 'root') {
  // Check direct adjacency to root or bridge nodes connected to root
  const sources = new Set([rootId]);

  // Expand sources through bridge nodes
  const visited = new Set([rootId]);
  const queue = [rootId];
  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = adjacencyList[current];
    if (!neighbors) continue;
    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      if (bridgeNodes.has(neighbor)) {
        sources.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  if (allocatedSet.size === 0) {
    // First node: must be adjacent to root or a bridge node connected to root
    for (const src of sources) {
      const srcNeighbors = adjacencyList[src];
      if (srcNeighbors && srcNeighbors.has(nodeId)) return true;
    }
    return false;
  }

  // Must be adjacent to an already-allocated node, root, or bridge connected to allocated
  const neighbors = adjacencyList[nodeId];
  if (!neighbors) return false;

  for (const neighbor of neighbors) {
    if (sources.has(neighbor)) return true;
    if (allocatedSet.has(neighbor)) return true;
  }
  return false;
}

/**
 * Check if deallocating a node would disconnect the tree.
 * Returns true if the node can be safely removed.
 */
export function canDeallocate(nodeId, allocatedSet, adjacencyList, bridgeNodes, rootId = 'root') {
  if (!allocatedSet.has(nodeId)) return false;

  // Try removing the node and check if all remaining nodes are still connected
  const remaining = new Set(allocatedSet);
  remaining.delete(nodeId);

  if (remaining.size === 0) return true;

  const reachable = getReachableNodes(remaining, adjacencyList, bridgeNodes, rootId);
  return reachable.size === remaining.size;
}

/**
 * Get all nodes that can currently be allocated (adjacent to the allocated tree).
 * Expands through bridge nodes to find all reachable allocatable neighbors.
 */
export function getAvailableNodes(allocatedSet, adjacencyList, nodes, bridgeNodes, rootId = 'root') {
  const available = new Set();

  // Start from root, all allocated nodes, and bridge nodes reachable from them
  const sources = new Set([rootId, ...allocatedSet]);

  // Expand through bridge nodes
  const bridgeQueue = [...sources];
  const bridgeVisited = new Set(sources);
  while (bridgeQueue.length > 0) {
    const current = bridgeQueue.shift();
    const neighbors = adjacencyList[current];
    if (!neighbors) continue;
    for (const neighbor of neighbors) {
      if (bridgeVisited.has(neighbor)) continue;
      bridgeVisited.add(neighbor);
      if (bridgeNodes.has(neighbor)) {
        sources.add(neighbor);
        bridgeQueue.push(neighbor);
      }
    }
  }

  // From all sources, find allocatable unallocated neighbors
  for (const nodeId of sources) {
    const neighbors = adjacencyList[nodeId];
    if (!neighbors) continue;
    for (const neighbor of neighbors) {
      if (!allocatedSet.has(neighbor) && isAllocatable(neighbor, nodes[neighbor])) {
        available.add(neighbor);
      }
    }
  }

  return available;
}

// ─── Shortest Path for Auto-Pathing ─────────────────────────────────────────

/**
 * Find the shortest path from the allocated tree to a target node.
 * Returns array of allocatable nodeIds to allocate (excluding already-allocated and bridge nodes).
 * Bridge nodes are traversed through transparently.
 */
export function findShortestPath(targetId, allocatedSet, adjacencyList, nodes, bridgeNodes, rootId = 'root') {
  const visited = new Map(); // nodeId → parentId
  const sources = new Set([rootId, ...allocatedSet]);

  // Also treat bridge nodes connected to sources as sources
  const bridgeQueue = [...sources];
  const bridgeVisited = new Set(sources);
  while (bridgeQueue.length > 0) {
    const current = bridgeQueue.shift();
    const neighbors = adjacencyList[current];
    if (!neighbors) continue;
    for (const neighbor of neighbors) {
      if (bridgeVisited.has(neighbor)) continue;
      bridgeVisited.add(neighbor);
      if (bridgeNodes.has(neighbor)) {
        sources.add(neighbor);
        bridgeQueue.push(neighbor);
      }
    }
  }

  const queue = [];
  for (const src of sources) {
    visited.set(src, null);
    queue.push(src);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === targetId) {
      // Reconstruct path — only include allocatable nodes (skip bridges/root/already-allocated)
      const path = [];
      let node = targetId;
      while (node !== null && !sources.has(node)) {
        if (!bridgeNodes.has(node)) {
          path.push(node);
        }
        node = visited.get(node);
      }
      return path.reverse();
    }

    const neighbors = adjacencyList[current];
    if (!neighbors) continue;
    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;
      // Traverse through both allocatable nodes AND bridge nodes
      if (isAllocatable(neighbor, nodes[neighbor]) || bridgeNodes.has(neighbor)) {
        visited.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  return []; // No path found
}

// ─── URL Encoding / Decoding ────────────────────────────────────────────────

/**
 * Encode a passive tree build into a URL-safe string.
 * Format: [version:1][classIndex:1][ascendancyId:1][masteryCount:2]
 *         [masteryEntries: skillId:2 + effectId:2 each][allocatedSkillIds: 2 bytes each]
 *         → pako deflate → base64url
 *
 * @param {Set} allocated - Set of allocated nodeIds (regular tree)
 * @param {Set} ascAllocated - Set of allocated ascendancy nodeIds
 * @param {Map} masterySelections - Map of masteryNodeId → selectedEffectIndex
 * @param {number} classIndex - Selected class (0-6)
 * @param {number} ascendancyId - Selected ascendancy ID (0 = none)
 * @param {Object} nodes - Full nodes data structure
 */
export function encodePassiveTree(allocated, ascAllocated, masterySelections, classIndex, ascendancyId, nodes) {
  // Combine allocated and ascAllocated
  const allAllocated = new Set([...allocated, ...ascAllocated]);

  // Get sorted skill IDs (numeric) for allocated nodes
  const skillIds = [];
  for (const nodeId of allAllocated) {
    const node = nodes[nodeId];
    if (node && node.skill) {
      skillIds.push(node.skill);
    }
  }
  skillIds.sort((a, b) => a - b);

  // Prepare mastery entries
  const masteryEntries = [];
  for (const [nodeId, effectIndex] of masterySelections.entries()) {
    const node = nodes[nodeId];
    if (node && node.skill) {
      masteryEntries.push({ skillId: node.skill, effectId: effectIndex });
    }
  }

  // Calculate buffer size
  const headerSize = 5; // version(1) + classIndex(1) + ascendancyId(1) + masteryCount(2)
  const masterySize = masteryEntries.length * 4; // skillId(2) + effectId(2)
  const allocatedSize = skillIds.length * 2; // 2 bytes per skill ID
  const totalSize = headerSize + masterySize + allocatedSize;

  const buffer = new Uint8Array(totalSize);
  let offset = 0;

  // Header
  buffer[offset++] = 1; // version
  buffer[offset++] = classIndex & 0xff;
  buffer[offset++] = ascendancyId & 0xff;
  buffer[offset++] = (masteryEntries.length >> 8) & 0xff;
  buffer[offset++] = masteryEntries.length & 0xff;

  // Mastery entries
  for (const { skillId, effectId } of masteryEntries) {
    buffer[offset++] = (skillId >> 8) & 0xff;
    buffer[offset++] = skillId & 0xff;
    buffer[offset++] = (effectId >> 8) & 0xff;
    buffer[offset++] = effectId & 0xff;
  }

  // Allocated skill IDs
  for (const skillId of skillIds) {
    buffer[offset++] = (skillId >> 8) & 0xff;
    buffer[offset++] = skillId & 0xff;
  }

  // Compress with pako
  const compressed = deflate(buffer);

  // Base64url encode
  return btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decode a URL hash back into passive tree data.
 * @returns {Object} { allocated: Set, ascAllocated: Set, masterySelections: Map, classIndex: number, ascendancyId: number }
 */
export function decodePassiveTree(hash, nodes) {
  if (!hash) {
    return {
      allocated: new Set(),
      ascAllocated: new Set(),
      masterySelections: new Map(),
      classIndex: 0,
      ascendancyId: 0,
    };
  }

  try {
    // Base64url decode
    const base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Decompress with pako
    const decompressed = inflate(bytes);

    if (decompressed[0] !== 1) {
      // Version check failed
      return {
        allocated: new Set(),
        ascAllocated: new Set(),
        masterySelections: new Map(),
        classIndex: 0,
        ascendancyId: 0,
      };
    }

    let offset = 1;

    // Read header
    const classIndex = decompressed[offset++];
    const ascendancyId = decompressed[offset++];
    const masteryCount = (decompressed[offset++] << 8) | decompressed[offset++];

    // Read mastery selections
    const masterySelections = new Map();
    const masterySkillToNodeId = new Map();

    // Build reverse mapping: skill → nodeId for masteries
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.isMastery && node.skill) {
        masterySkillToNodeId.set(node.skill, nodeId);
      }
    }

    for (let i = 0; i < masteryCount; i++) {
      const skillId = (decompressed[offset++] << 8) | decompressed[offset++];
      const effectId = (decompressed[offset++] << 8) | decompressed[offset++];
      const nodeId = masterySkillToNodeId.get(skillId);
      if (nodeId) {
        masterySelections.set(nodeId, effectId);
      }
    }

    // Read skill IDs
    const skillIds = new Set();
    while (offset < decompressed.length) {
      const id = (decompressed[offset++] << 8) | decompressed[offset++];
      skillIds.add(id);
    }

    // Map skill IDs back to node IDs
    const allocated = new Set();
    const ascAllocated = new Set();

    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.skill && skillIds.has(node.skill)) {
        if (node.ascendancyName) {
          ascAllocated.add(nodeId);
        } else {
          allocated.add(nodeId);
        }
      }
    }

    return {
      allocated,
      ascAllocated,
      masterySelections,
      classIndex,
      ascendancyId,
    };
  } catch (error) {
    console.error('Failed to decode passive tree:', error);
    return {
      allocated: new Set(),
      ascAllocated: new Set(),
      masterySelections: new Map(),
      classIndex: 0,
      ascendancyId: 0,
    };
  }
}

// ─── Stat Grouping ──────────────────────────────────────────────────────────

/**
 * Group allocated node stats by category for the summary panel.
 * Includes stats from allocated nodes AND selected mastery effects.
 * Returns { categoryName: [stat1, stat2, ...] }
 */
export function groupStatsByCategory(allocated, ascAllocated, masterySelections, nodes) {
  const grouped = {};
  const categorized = new Set();

  // Combine all allocated nodes
  const allAllocated = new Set([...allocated, ...ascAllocated]);

  // Process regular allocated nodes
  for (const nodeId of allAllocated) {
    const node = nodes[nodeId];
    if (!node || !node.stats) continue;

    for (const stat of node.stats) {
      categorizeAndAddStat(stat, grouped, categorized);
    }
  }

  // Process mastery selections
  for (const [nodeId, effectIndex] of masterySelections.entries()) {
    const node = nodes[nodeId];
    if (!node || !node.masteryEffects) continue;

    const effect = node.masteryEffects[effectIndex];
    if (!effect || !effect.stats) continue;

    for (const stat of effect.stats) {
      categorizeAndAddStat(stat, grouped, categorized);
    }
  }

  // Sort by number of stats (most first)
  const sorted = {};
  const entries = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
  for (const [key, val] of entries) {
    sorted[key] = val;
  }

  return sorted;
}

/**
 * Helper function to categorize a single stat and add it to the grouped object.
 */
function categorizeAndAddStat(stat, grouped, categorized) {
  let found = false;
  for (const [categoryName, keywords] of Object.entries(STAT_CATEGORIES)) {
    if (categoryName === 'General') continue;
    if (keywords.some(kw => stat.toLowerCase().includes(kw.toLowerCase()))) {
      if (!grouped[categoryName]) grouped[categoryName] = [];
      grouped[categoryName].push(stat);
      categorized.add(stat);
      found = true;
      break;
    }
  }
  if (!found) {
    if (!grouped['General']) grouped['General'] = [];
    grouped['General'].push(stat);
  }
}

// ─── Search ─────────────────────────────────────────────────────────────────

/**
 * Search nodes by name or stat text. Returns matching nodeIds.
 */
export function searchNodes(query, nodes) {
  if (!query || query.length < 2) return new Set();

  const lower = query.toLowerCase();
  const matches = new Set();

  for (const [nodeId, node] of Object.entries(nodes)) {
    if (nodeId === 'root') continue;
    if (node.isMastery) continue;

    if (node.name && node.name.toLowerCase().includes(lower)) {
      matches.add(nodeId);
      continue;
    }

    if (node.stats) {
      for (const stat of node.stats) {
        if (stat.toLowerCase().includes(lower)) {
          matches.add(nodeId);
          break;
        }
      }
    }
  }

  return matches;
}

// ─── Diff (Future phase prep) ──────────────────────────────────────────────

/**
 * Compare two sets of allocated nodes and return the diff.
 */
export function diffTrees(planNodes, targetNodes) {
  const toAdd = new Set();
  const toRemove = new Set();
  const matching = new Set();

  for (const nodeId of planNodes) {
    if (targetNodes.has(nodeId)) {
      matching.add(nodeId);
    } else {
      toAdd.add(nodeId);
    }
  }

  for (const nodeId of targetNodes) {
    if (!planNodes.has(nodeId)) {
      toRemove.add(nodeId);
    }
  }

  return { toAdd, toRemove, matching };
}
