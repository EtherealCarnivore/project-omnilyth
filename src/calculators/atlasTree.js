/*
 * atlasTree.js — Pure logic for the atlas tree planner.
 *
 * Positioning: converts GGG's group + orbit data into absolute x/y coords.
 * Pathing: BFS from root to validate connected allocations.
 * Encoding: format version + tree generation + skill ids + choose-one picks
 *   → pako deflate → base64url, for share URLs and saved builds.
 * Stat grouping: categorize node stats by content type for the summary panel.
 *
 * No React, no state, no side effects. Just math and graph traversal.
 */

import { deflate, inflate } from 'pako';
import {
  ORBIT_RADII,
  SKILLS_PER_ORBIT,
  CONTENT_TYPES,
  ATLAS_TREE_GENERATION,
  TREE_GENERATION_LABELS,
} from '../data/atlas/atlasTreeConstants.js';
import { LEGACY_GRAPHS } from '../data/atlas/atlasTreeLegacyEdges.js';

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

// ─── Choose-one notables (3.30 `isMultipleChoiceVariant`) ───────────────────
//
// 3.30.0 ships 31 notables flagged `isMultipleChoiceVariant` with a
// `variantEffects` array: the player picks exactly one entry when the notable
// is allocated (atlastree-export 3.30.0 data.json). Each entry carries a GGG
// `effect` id (u16) and its own stat lines. Some variant lines are fragments
// that complete the node's own `stats` line ("...to be of type" + "Breach"),
// so a picked node shows its base lines followed by the variant's lines,
// both verbatim.

export function isChoiceNode(node) {
  return !!node?.isMultipleChoiceVariant
    && Array.isArray(node.variantEffects)
    && node.variantEffects.length > 0;
}

/** The variantEffects entry whose `effect` id is `effectId`, or null. */
export function getChosenVariant(node, effectId) {
  if (!isChoiceNode(node) || effectId == null) return null;
  return node.variantEffects.find(v => v.effect === effectId) || null;
}

/** Stat lines a node grants, including the picked variant's lines. */
export function getNodeStatLines(node, effectId) {
  const base = node?.stats || [];
  const variant = getChosenVariant(node, effectId);
  return variant ? [...base, ...variant.stats] : base;
}

/**
 * Keep only picks for allocated choice nodes whose effect id exists on that
 * node. Returns a new { nodeId: effectId } object.
 */
export function sanitizePicks(picks, allocatedSet, nodes) {
  const out = {};
  if (!picks) return out;
  for (const [nodeId, effectId] of Object.entries(picks)) {
    if (!allocatedSet.has(nodeId)) continue;
    if (getChosenVariant(nodes[nodeId], effectId)) out[nodeId] = effectId;
  }
  return out;
}

/** Allocated choice nodes, sorted by name: [{ nodeId, node, effectId|null }]. */
export function getAllocatedChoiceNodes(allocatedSet, nodes, picks = {}) {
  const list = [];
  for (const nodeId of allocatedSet) {
    const node = nodes[nodeId];
    if (!isChoiceNode(node)) continue;
    const effectId = getChosenVariant(node, picks[nodeId]) ? picks[nodeId] : null;
    list.push({ nodeId, node, effectId });
  }
  return list.sort((a, b) => a.node.name.localeCompare(b.node.name));
}

/**
 * Render GGG's inline stat markup for display: "[Thread|Threads]" → "Threads",
 * "[Mirage]" → "Mirage". The text after the pipe is the display form; the
 * part before it is an internal key. Display only — matching and storage keep
 * the raw string.
 */
export function formatStatText(stat) {
  return String(stat)
    .replace(/\[([^\]|]*)\|([^\]]*)\]/g, '$2')
    .replace(/\[([^\]|]*)\]/g, '$1');
}

// ─── Share codes / saved-build hashes ───────────────────────────────────────
//
// A share code is base64url(deflate(payload)). The payload's first byte is the
// format version.
//
//   v1 (made before tree generations existed; still decoded, never written)
//     [0]      0x01
//     [1..]    u16 BE skill ids
//
//   v2 (current)
//     [0]      0x02
//     [1]      tree generation (ATLAS_TREE_GENERATION; 30 = 3.30.0 graph)
//     [2..3]   u16 BE  N = number of allocated skill ids
//     [..]     N × u16 BE skill ids, ascending
//     [..]     u8      M = number of choose-one picks
//     [..]     M × (u16 BE node skill id, u16 BE variant `effect` id),
//              ascending by node skill id
//     length must be exactly 4 + 2N + 1 + 4M.
//
// Picks are stored by GGG `effect` id, not by list position, so a data update
// that reorders `variantEffects` does not silently swap a player's pick.
//
// Compatibility rule:
//   - v2, generation == current      → load; picks that don't fit are dropped
//                                      and reported.
//   - v2, generation <  current      → reject ('legacy-tree').
//   - v2, generation >  current      → reject ('future-tree').
//   - v1 (no marker)                 → classifyUnmarkedAllocation, in order:
//       1. any skill id missing from the current tree, any id that is not an
//          allocatable node, or more ids than the point budget → reject
//          ('legacy-tree'). An untouched older tree always has some of these
//          once it is past a handful of nodes.
//       2. connected tree from the start on the current graph → accept.
//       3. connected tree from the start on an older graph (LEGACY_GRAPHS:
//          the older graph's edges between ids that survived) → reject. A
//          real tree is connected on the graph it was built on, so this is
//          an intact older tree whose ids happen to all survive.
//          Skipped when the caller knows the code was written by a planner
//          already running the current graph (options.writtenOnCurrentTree:
//          a saved build whose updatedAt is after
//          ATLAS_TREE_GENERATION_SHIPPED_AT). Such a build can look exactly
//          like an intact older tree: the older build it came from lost only
//          leaf nodes when it was loaded and re-saved.
//       4. connected on neither → accept. This is what the planner itself
//          wrote between the 3.30 data import and tree generations: an older
//          build loaded with its retired ids dropped, then re-saved. The
//          retired ids leave gaps, so it is no longer a tree on either graph.
//   - every accepted decode (v1 or v2) keeps only the part connected to the
//     start on the current graph; the rest is reported in
//     `disconnectedNodeIds` (and still listed in `allNodeIds`), so the planner
//     never holds an allocation it could not have built.
//   - anything that fails to base64/inflate/parse → reject ('invalid').

export const SHARE_FORMAT_VERSION = 2;

export const DECODE_STATUS = {
  OK: 'ok',
  EMPTY: 'empty',
  INVALID: 'invalid',
  LEGACY_TREE: 'legacy-tree',
  FUTURE_TREE: 'future-tree',
};

function generationLabel(gen) {
  return TREE_GENERATION_LABELS[gen] || `generation ${gen}`;
}

const CURRENT_LABEL = generationLabel(ATLAS_TREE_GENERATION);

const MESSAGES = {
  invalid: 'This is not a valid Omnilyth atlas tree code.',
  legacyUnmarked:
    `This atlas tree was made for an older atlas tree (before the ${CURRENT_LABEL} rework). ` +
    `It does not fit the ${CURRENT_LABEL} tree, so it was not loaded.`,
  legacyMarked: gen =>
    `This atlas tree was made for the ${generationLabel(gen)} atlas tree. ` +
    `It does not fit the ${CURRENT_LABEL} tree, so it was not loaded.`,
  future: gen =>
    `This atlas tree was made for a newer atlas tree (${generationLabel(gen)}) than this page has. ` +
    'Reload the page to get the latest version.',
};

/** User-facing refusal for a build made on an older tree (generation if known). */
export function legacyTreeMessage(generation) {
  return generation != null && generation < ATLAS_TREE_GENERATION
    ? MESSAGES.legacyMarked(generation)
    : MESSAGES.legacyUnmarked;
}

function bytesToBase64url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBytes(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const skillIndexCache = new WeakMap();

/** skill id → node key for a nodes object (cached per object). */
function getSkillIndex(nodes) {
  let index = skillIndexCache.get(nodes);
  if (!index) {
    index = new Map();
    for (const [nodeId, node] of Object.entries(nodes)) {
      if (node.skill) index.set(node.skill, nodeId);
    }
    skillIndexCache.set(nodes, index);
  }
  return index;
}

/**
 * Encode allocations + choose-one picks as a v2 share code stamped with the
 * tree generation. Returns '' for an empty tree.
 */
export function encodeAtlasBuild(allocatedSet, nodes, picks = {}, generation = ATLAS_TREE_GENERATION) {
  const skillIds = [];
  for (const nodeId of allocatedSet) {
    const node = nodes[nodeId];
    if (node && node.skill) skillIds.push(node.skill);
  }
  if (skillIds.length === 0) return '';
  skillIds.sort((a, b) => a - b);

  const clean = sanitizePicks(picks, allocatedSet, nodes);
  const pickPairs = Object.entries(clean)
    .map(([nodeId, effect]) => [nodes[nodeId].skill, effect])
    .sort((a, b) => a[0] - b[0])
    .slice(0, 255);

  const n = skillIds.length;
  const m = pickPairs.length;
  const buf = new Uint8Array(4 + 2 * n + 1 + 4 * m);
  buf[0] = SHARE_FORMAT_VERSION;
  buf[1] = generation & 0xff;
  buf[2] = (n >> 8) & 0xff;
  buf[3] = n & 0xff;
  let o = 4;
  for (const id of skillIds) {
    buf[o++] = (id >> 8) & 0xff;
    buf[o++] = id & 0xff;
  }
  buf[o++] = m;
  for (const [skill, effect] of pickPairs) {
    buf[o++] = (skill >> 8) & 0xff;
    buf[o++] = skill & 0xff;
    buf[o++] = (effect >> 8) & 0xff;
    buf[o++] = effect & 0xff;
  }

  return bytesToBase64url(deflate(buf));
}

/**
 * Decide whether an unmarked (v1) allocation was made on the current graph.
 * See the compatibility rule above. Returns
 * { verdict: 'current' | 'legacy', reason, nodeIds, missingSkillIds }.
 */
export function classifyUnmarkedAllocation(skillIds, nodes, options = {}) {
  const index = getSkillIndex(nodes);
  const nodeIds = new Set();
  const missingSkillIds = [];
  for (const id of skillIds) {
    const nodeId = index.get(id);
    if (nodeId === undefined) missingSkillIds.push(id);
    else nodeIds.add(nodeId);
  }
  const legacy = reason => ({ verdict: 'legacy', reason, nodeIds, missingSkillIds });

  if (missingSkillIds.length > 0) return legacy('unknown-skill-ids');
  for (const nodeId of nodeIds) {
    if (!isAllocatable(nodeId, nodes[nodeId])) return legacy('not-allocatable');
  }
  const budget = options.totalPoints;
  if (budget && nodeIds.size > budget) return legacy('over-budget');

  const adjacencyList = options.adjacencyList || buildAdjacencyList(nodes);
  const bridgeNodes = options.bridgeNodes || getBridgeNodes(nodes);
  const reachable = getReachableNodes(nodeIds, adjacencyList, bridgeNodes);
  if (reachable.size === nodeIds.size) {
    return { verdict: 'current', reason: null, nodeIds, missingSkillIds };
  }

  const legacyGraphs = options.writtenOnCurrentTree ? [] : options.legacyGraphs || LEGACY_GRAPHS;
  for (const graph of legacyGraphs) {
    if (isConnectedOnSkillGraph(skillIds, graph)) return legacy(`intact-generation-${graph.generation}`);
  }

  return { verdict: 'current', reason: 'trimmed-older-tree', nodeIds, missingSkillIds };
}

/**
 * Is this set of skill ids one connected tree from the start on a reduced
 * skill-id graph ({ start: skill[], edges: [skillA, skillB][] })?
 */
export function isConnectedOnSkillGraph(skillIds, graph) {
  const wanted = new Set(skillIds);
  if (wanted.size === 0) return false;
  const adj = new Map();
  for (const [a, b] of graph.edges) {
    if (!wanted.has(a) || !wanted.has(b)) continue;
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(b);
    adj.get(b).push(a);
  }
  const seen = new Set(graph.start.filter(id => wanted.has(id)));
  const queue = [...seen];
  while (queue.length) {
    for (const next of adj.get(queue.shift()) || []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen.size === wanted.size;
}

/**
 * Decode a share code / saved-build hash against the current tree.
 *
 * options: { adjacencyList, bridgeNodes, totalPoints, legacyGraphs,
 * writtenOnCurrentTree } — pass the planner's precomputed structures to skip
 * rebuilding them; see classifyUnmarkedAllocation for writtenOnCurrentTree.
 *
 * Returns {
 *   status: DECODE_STATUS.*,
 *   message: string | null,       // user-facing, set for every non-ok status
 *   nodeIds: Set<string>,          // loadable nodes; empty unless status === 'ok'
 *   allNodeIds: Set<string>,       // every id in the code that resolves
 *                                  // (nodeIds + disconnectedNodeIds)
 *   savedNodeCount: number,        // skill ids in the code
 *   disconnectedNodeIds: string[], // resolved but not connected to the start
 *   picks: { [nodeId]: effectId },
 *   missingSkillIds: number[],     // v2 ids absent from the current tree
 *   droppedPicks: { skill, effect }[],
 *   formatVersion: 1 | 2 | null,
 *   treeGeneration: number | null, // as stamped (v2) or inferred (v1 → current)
 *   unmarked: boolean,             // true for an accepted v1 code
 *   legacyReason: string | null,   // why a v1 code was classed legacy
 * }
 */
export function decodeAtlasBuild(hash, nodes, options = {}) {
  const result = {
    status: DECODE_STATUS.EMPTY,
    message: null,
    nodeIds: new Set(),
    allNodeIds: new Set(),
    savedNodeCount: 0,
    disconnectedNodeIds: [],
    picks: {},
    missingSkillIds: [],
    droppedPicks: [],
    formatVersion: null,
    treeGeneration: null,
    unmarked: false,
    legacyReason: null,
  };
  if (!hash) return result;

  const reject = (status, message) => {
    result.status = status;
    result.message = message;
    result.nodeIds = new Set();
    result.allNodeIds = new Set();
    result.disconnectedNodeIds = [];
    result.picks = {};
    return result;
  };

  // Keep the part connected to the start; report the rest.
  const trim = resolved => {
    const adjacencyList = options.adjacencyList || buildAdjacencyList(nodes);
    const bridgeNodes = options.bridgeNodes || getBridgeNodes(nodes);
    const reachable = getReachableNodes(resolved, adjacencyList, bridgeNodes);
    result.allNodeIds = resolved;
    result.disconnectedNodeIds = [...resolved].filter(id => !reachable.has(id));
    return reachable;
  };

  let data;
  try {
    data = inflate(base64urlToBytes(String(hash).trim()));
  } catch {
    return reject(DECODE_STATUS.INVALID, MESSAGES.invalid);
  }
  if (!data || data.length < 1) return reject(DECODE_STATUS.INVALID, MESSAGES.invalid);

  const u16 = i => (data[i] << 8) | data[i + 1];
  const version = data[0];
  result.formatVersion = version === 1 || version === 2 ? version : null;

  if (version === 1) {
    if (data.length < 3 || (data.length - 1) % 2 !== 0) {
      return reject(DECODE_STATUS.INVALID, MESSAGES.invalid);
    }
    const skillIds = new Set();
    for (let i = 1; i < data.length; i += 2) skillIds.add(u16(i));
    result.savedNodeCount = skillIds.size;

    const verdict = classifyUnmarkedAllocation(skillIds, nodes, options);
    if (verdict.verdict === 'legacy') {
      result.legacyReason = verdict.reason;
      result.missingSkillIds = verdict.missingSkillIds;
      return reject(DECODE_STATUS.LEGACY_TREE, MESSAGES.legacyUnmarked);
    }
    result.status = DECODE_STATUS.OK;
    result.nodeIds = trim(verdict.nodeIds);
    result.treeGeneration = ATLAS_TREE_GENERATION;
    result.unmarked = true;
    return result;
  }

  if (version !== 2 || data.length < 5) {
    return reject(DECODE_STATUS.INVALID, MESSAGES.invalid);
  }

  const generation = data[1];
  const n = u16(2);
  const pickCountAt = 4 + 2 * n;
  if (pickCountAt >= data.length) return reject(DECODE_STATUS.INVALID, MESSAGES.invalid);
  const m = data[pickCountAt];
  if (data.length !== pickCountAt + 1 + 4 * m) {
    return reject(DECODE_STATUS.INVALID, MESSAGES.invalid);
  }
  result.treeGeneration = generation;

  if (generation < ATLAS_TREE_GENERATION) {
    return reject(DECODE_STATUS.LEGACY_TREE, MESSAGES.legacyMarked(generation));
  }
  if (generation > ATLAS_TREE_GENERATION) {
    return reject(DECODE_STATUS.FUTURE_TREE, MESSAGES.future(generation));
  }

  const index = getSkillIndex(nodes);
  const resolved = new Set();
  for (let i = 0; i < n; i++) {
    const id = u16(4 + 2 * i);
    const nodeId = index.get(id);
    if (nodeId === undefined) result.missingSkillIds.push(id);
    else if (isAllocatable(nodeId, nodes[nodeId])) resolved.add(nodeId);
    else result.missingSkillIds.push(id);
  }
  result.savedNodeCount = n;
  const nodeIds = trim(resolved);

  const picks = {};
  for (let i = 0; i < m; i++) {
    const at = pickCountAt + 1 + 4 * i;
    const skill = u16(at);
    const effect = u16(at + 2);
    const nodeId = index.get(skill);
    if (nodeId !== undefined && nodeIds.has(nodeId) && getChosenVariant(nodes[nodeId], effect)) {
      picks[nodeId] = effect;
    } else {
      result.droppedPicks.push({ skill, effect });
    }
  }

  result.status = DECODE_STATUS.OK;
  result.nodeIds = nodeIds;
  result.picks = picks;
  return result;
}


// ─── Stat Grouping ──────────────────────────────────────────────────────────

/** First CONTENT_TYPES bucket whose keyword appears in `text` (else General). */
function categorizeStat(text) {
  const lower = text.toLowerCase();
  for (const [contentType, keywords] of Object.entries(CONTENT_TYPES)) {
    if (contentType === 'General') continue;
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) return contentType;
  }
  return 'General';
}

/**
 * Group allocated node stats by content type for the summary panel.
 * `picks` ({ nodeId: effectId }) adds each choose-one notable's picked lines.
 * A choose-one notable is bucketed as one unit (base + picked lines together)
 * because its variant lines are often fragments ("Breach") of its base line.
 * Returns { contentType: [stat1, stat2, ...] }
 */
export function groupStatsByContent(allocatedSet, nodes, picks = {}) {
  const grouped = {};
  const push = (contentType, stat) => {
    if (!grouped[contentType]) grouped[contentType] = [];
    grouped[contentType].push(stat);
  };

  for (const nodeId of allocatedSet) {
    const node = nodes[nodeId];
    if (!node) continue;

    if (isChoiceNode(node)) {
      const lines = getNodeStatLines(node, picks[nodeId]);
      if (lines.length === 0) continue;
      // The base line names the mechanic ("Threads ... of type"); the picked
      // fragment ("Ritual") would otherwise win on keyword order.
      const baseType = categorizeStat((node.stats || []).join(' '));
      const contentType = baseType !== 'General' ? baseType : categorizeStat(lines.join(' '));
      for (const stat of lines) push(contentType, stat);
      continue;
    }

    if (!node.stats) continue;
    for (const stat of node.stats) push(categorizeStat(stat), stat);
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
 * Search nodes by name, stat text or choose-one variant text. Returns matching nodeIds.
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

    const lines = [
      ...(node.stats || []),
      ...(node.variantEffects || []).flatMap(v => v.stats || []),
    ];
    if (lines.some(stat => stat.toLowerCase().includes(lower))) matches.add(nodeId);
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
