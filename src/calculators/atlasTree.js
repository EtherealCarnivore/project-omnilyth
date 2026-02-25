/*
 * atlasTree.js — Pure logic for the atlas tree planner.
 *
 * Positioning: converts GGG's group + orbit data into absolute x/y coords.
 * Pathing: BFS from root to validate connected allocations.
 * Encoding: bitfield → pako compress → base64url for URL sharing.
 * Stat grouping: categorize node stats by content type for the summary panel.
 *
 * No React, no state, no side effects. Just math and graph traversal.
 */

import { deflate, inflate } from 'pako';
import { ORBIT_RADII, SKILLS_PER_ORBIT, CONTENT_TYPES } from '../data/atlas/atlasTreeConstants';

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
 * Determine the visual type of a node.
 */
export function getNodeType(node) {
  if (node.isKeystone) return 'keystone';
  if (node.isNotable) return 'notable';
  if (node.isMastery) return 'mastery';
  return 'regular';
}

/**
 * Check if a node is allocatable (has stats, not mastery, not root).
 */
export function isAllocatable(nodeId, node) {
  if (nodeId === 'root') return false;
  if (node.isMastery) return false;
  if (!node.name || node.name === '') return false;
  return true;
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
 * (like the root-adjacent hub node with no name/stats). These are traversed through
 * transparently during pathing.
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
 * Encode a set of allocated node IDs into a URL-safe string.
 * Strategy: sort numeric skill IDs → pack as bitfield → pako deflate → base64url
 */
export function encodeAllocatedNodes(allocatedSet, nodes) {
  if (allocatedSet.size === 0) return '';

  // Get sorted skill IDs (numeric) for allocated nodes
  const skillIds = [];
  for (const nodeId of allocatedSet) {
    const node = nodes[nodeId];
    if (node && node.skill) {
      skillIds.push(node.skill);
    }
  }
  skillIds.sort((a, b) => a - b);

  if (skillIds.length === 0) return '';

  // Use a simple encoding: version byte + 2 bytes per skill ID (big endian)
  const buffer = new Uint8Array(1 + skillIds.length * 2);
  buffer[0] = 1; // version
  for (let i = 0; i < skillIds.length; i++) {
    buffer[1 + i * 2] = (skillIds[i] >> 8) & 0xff;
    buffer[1 + i * 2 + 1] = skillIds[i] & 0xff;
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
 * Decode a URL hash back into a set of node IDs.
 */
export function decodeAllocatedNodes(hash, nodes) {
  if (!hash) return new Set();

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

    if (decompressed[0] !== 1) return new Set(); // version check

    // Read skill IDs
    const skillIds = new Set();
    for (let i = 1; i < decompressed.length; i += 2) {
      const id = (decompressed[i] << 8) | decompressed[i + 1];
      skillIds.add(id);
    }

    // Map skill IDs back to node IDs
    const nodeIds = new Set();
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.skill && skillIds.has(node.skill)) {
        nodeIds.add(nodeId);
      }
    }

    return nodeIds;
  } catch {
    return new Set();
  }
}

// ─── Stat Grouping ──────────────────────────────────────────────────────────

/**
 * Group allocated node stats by content type for the summary panel.
 * Returns { contentType: [stat1, stat2, ...] }
 */
export function groupStatsByContent(allocatedSet, nodes) {
  const grouped = {};
  const categorized = new Set();

  for (const nodeId of allocatedSet) {
    const node = nodes[nodeId];
    if (!node || !node.stats) continue;

    for (const stat of node.stats) {
      let found = false;
      for (const [contentType, keywords] of Object.entries(CONTENT_TYPES)) {
        if (contentType === 'General') continue;
        if (keywords.some(kw => stat.toLowerCase().includes(kw.toLowerCase()))) {
          if (!grouped[contentType]) grouped[contentType] = [];
          grouped[contentType].push(stat);
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
  }

  // Sort by number of stats (most first)
  const sorted = {};
  const entries = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
  for (const [key, val] of entries) {
    sorted[key] = val;
  }

  return sorted;
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

// ─── Input Detection ────────────────────────────────────────────────────────

/**
 * Detect what kind of atlas tree input the user pasted.
 * Returns { type: 'ggg'|'omnilyth'|'raw'|'unknown', hash }
 */
export function detectAtlasInput(input) {
  if (!input || typeof input !== 'string') return { type: 'unknown', hash: '' };

  const trimmed = input.trim();

  // GGG URL: pathofexile.com/fullscreen-atlas-skill-tree/.../{hash}
  const gggMatch = trimmed.match(
    /pathofexile\.com\/fullscreen-atlas-skill-tree\/[^/]+\/([A-Za-z0-9_-]+)/
  );
  if (gggMatch) return { type: 'ggg', hash: gggMatch[1] };

  // Omnilyth URL: .../atlas/tree#{hash} or .../atlas/tree#...
  const omnilythMatch = trimmed.match(
    /\/atlas\/tree#([A-Za-z0-9_+/=-]+)/
  );
  if (omnilythMatch) return { type: 'omnilyth', hash: omnilythMatch[1] };

  // Raw hash: base64url characters only, reasonable length
  if (/^[A-Za-z0-9_+/=-]{4,}$/.test(trimmed)) {
    return { type: 'raw', hash: trimmed };
  }

  return { type: 'unknown', hash: '' };
}

/**
 * Attempt to decode a GGG atlas hash.
 * GGG format is not formally documented — try multiple strategies:
 * 1. Base64url → raw bytes (no compression), varying header sizes
 * 2. Base64url → pako inflate, varying header sizes
 * Validates results against known node skill IDs.
 */
export function decodeGGGAtlasHash(hash, nodes) {
  if (!hash) return new Set();

  // Build a set of valid skill IDs for validation
  const validSkills = new Set();
  for (const node of Object.values(nodes)) {
    if (node.skill) validSkills.add(node.skill);
  }

  // Base64url decode
  let bytes;
  try {
    const base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
  } catch {
    return new Set();
  }

  // Try decompressed first, then raw bytes, with header sizes 0-4
  const candidates = [];

  // Try pako inflate
  try {
    const decompressed = inflate(bytes);
    candidates.push(decompressed);
  } catch {
    // Not compressed — that's expected for GGG format
  }

  // Also try raw bytes (GGG may not compress)
  candidates.push(bytes);

  for (const data of candidates) {
    // Try header sizes 0-4 (skip N bytes, then read 2-byte skill IDs)
    for (let headerSize = 0; headerSize <= 4; headerSize++) {
      const remaining = data.length - headerSize;
      if (remaining < 2 || remaining % 2 !== 0) continue;

      const skillIds = new Set();
      let allValid = true;

      for (let i = headerSize; i < data.length; i += 2) {
        const id = (data[i] << 8) | data[i + 1];
        if (id === 0) { allValid = false; break; }
        if (!validSkills.has(id)) { allValid = false; break; }
        skillIds.add(id);
      }

      // Need at least 1 valid skill and all must be valid
      if (allValid && skillIds.size > 0) {
        const nodeIds = new Set();
        for (const [nodeId, node] of Object.entries(nodes)) {
          if (node.skill && skillIds.has(node.skill)) {
            nodeIds.add(nodeId);
          }
        }
        return nodeIds;
      }
    }
  }

  return new Set();
}

// ─── Diff ───────────────────────────────────────────────────────────────────

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
