/*
 * usePassiveTreeData.js — Lazy-loads and processes the GGG passive tree data.
 *
 * Dynamic import so the large JSON doesn't bloat the initial bundle.
 * Processes raw data into render-ready structures with pre-calculated positions.
 * Also extracts sprite sheet data for node icons, masteries, class starts, and jewel sockets.
 *
 * Supports multiple tree versions (e.g. 3.27, 3.28) with per-version caching.
 */

import { useState, useEffect, useRef } from 'react';
import { calculateAllPositions, buildAdjacencyList, getBoundingBox, getNodeType, isAllocatable, getBridgeNodes } from '../calculators/passiveTree';

// Per-version cache — avoids reprocessing when switching back and forth
const cache = {};

// Vite requires static paths for dynamic imports — map versions to their loaders
const VERSION_LOADERS = {
  '3.28': () => import('../data/passive/passiveTreeData_3_28.json'),
  '3.27': () => import('../data/passive/passiveTreeData_3_27.json'),
};

export const AVAILABLE_VERSIONS = Object.keys(VERSION_LOADERS).sort((a, b) => parseFloat(b) - parseFloat(a));
export const DEFAULT_VERSION = AVAILABLE_VERSIONS[0]; // Latest first

// Use the highest zoom level for best icon quality
const BEST_ZOOM = '0.3835';

/**
 * Extract sprite entries from a sheet into a flat lookup: name → { sheetUrl, sheetW, sheetH, x, y, w, h }
 */
function extractSprites(sheet) {
  if (!sheet) return {};
  const out = {};
  for (const [key, coords] of Object.entries(sheet.coords)) {
    out[key] = {
      sheetUrl: sheet.filename,
      sheetW: sheet.w,
      sheetH: sheet.h,
      ...coords,
    };
  }
  return out;
}

/**
 * Build a lookup from icon path → { sheetUrl, x, y, w, h } for each sprite category.
 * Extracts:
 * - active/inactive icons (normal/notable/keystone)
 * - mastery variants (mastery, masteryInactive, masteryConnected, masteryActiveSelected, masteryActiveEffect)
 * - frame sprites
 * - group backgrounds
 * - start nodes (class center art like centerscion, centermarauder)
 * - jewel/jewelSocket sprites
 */
function buildSpriteMap(sprites) {
  const map = {
    active: {},
    inactive: {},
    mastery: {},
    masteryInactive: {},
    masteryConnected: {},
    masteryActiveSelected: {},
    masteryActiveEffect: {},
    frames: {},
    groupBackgrounds: {},
    startNodes: {},
    jewel: {},
    jewelSocket: {},
  };

  // Active icons (for allocated nodes)
  for (const cat of ['normalActive', 'notableActive', 'keystoneActive']) {
    Object.assign(map.active, extractSprites(sprites[cat]?.[BEST_ZOOM]));
  }

  // Inactive icons (for unallocated nodes)
  for (const cat of ['normalInactive', 'notableInactive', 'keystoneInactive']) {
    Object.assign(map.inactive, extractSprites(sprites[cat]?.[BEST_ZOOM]));
  }

  // Mastery sprites (various states)
  Object.assign(map.mastery, extractSprites(sprites.mastery?.[BEST_ZOOM]));
  Object.assign(map.masteryInactive, extractSprites(sprites.masteryInactive?.[BEST_ZOOM]));
  Object.assign(map.masteryConnected, extractSprites(sprites.masteryConnected?.[BEST_ZOOM]));
  Object.assign(map.masteryActiveSelected, extractSprites(sprites.masteryActiveSelected?.[BEST_ZOOM]));
  Object.assign(map.masteryActiveEffect, extractSprites(sprites.masteryActiveEffect?.[BEST_ZOOM]));

  // Frame sprites (PSSkillFrame, NotableFrame*, KeystoneFrame*)
  Object.assign(map.frames, extractSprites(sprites.frame?.[BEST_ZOOM]));

  // Group background sprites (PSGroupBackground1-3, alts, etc.)
  Object.assign(map.groupBackgrounds, extractSprites(sprites.groupBackground?.[BEST_ZOOM]));

  // Start node sprites (class center art: centerscion, centermarauder, etc.)
  Object.assign(map.startNodes, extractSprites(sprites.startNode?.[BEST_ZOOM]));

  // Jewel sprites (if present)
  Object.assign(map.jewel, extractSprites(sprites.jewel?.[BEST_ZOOM]));

  // Jewel socket sprites (if present)
  Object.assign(map.jewelSocket, extractSprites(sprites.jewelSocket?.[BEST_ZOOM]));

  return map;
}

/**
 * Extract class data from nodes with classStartIndex.
 * Returns: { classIndex → { name, startNodeId, ascendancies: [], position: {x, y} } }
 */
function extractClassData(nodes, positions) {
  const classData = {};
  const ascendancyStarts = {}; // temp map: ascendancyName → startNodeId

  // Find class start nodes
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.classStartIndex !== undefined) {
      const classIndex = node.classStartIndex;
      const pos = positions[nodeId] || { x: 0, y: 0 };

      if (!classData[classIndex]) {
        classData[classIndex] = {
          name: node.name || `Class${classIndex}`,
          startNodeId: nodeId,
          ascendancies: [],
          position: pos,
        };
      }
    }

    // Track ascendancy start nodes
    if (node.isAscendancyStart && node.ascendancyName) {
      ascendancyStarts[node.ascendancyName] = nodeId;
    }
  }

  // Build ascendancy list per class by matching ascendancy nodes to class indices
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.ascendancyName && node.classStartIndex !== undefined) {
      const classIndex = node.classStartIndex;
      if (classData[classIndex] && !classData[classIndex].ascendancies.includes(node.ascendancyName)) {
        classData[classIndex].ascendancies.push(node.ascendancyName);
      }
    }
  }

  return classData;
}

/**
 * Extract ascendancy map from nodes with ascendancyName.
 * Returns: { ascendancyName → { startNodeId, nodes: [nodeIds] } }
 */
function extractAscendancyMap(nodes) {
  const ascendancyMap = {};

  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.ascendancyName) {
      if (!ascendancyMap[node.ascendancyName]) {
        ascendancyMap[node.ascendancyName] = {
          startNodeId: node.isAscendancyStart ? nodeId : null,
          nodes: [],
        };
      }
      ascendancyMap[node.ascendancyName].nodes.push(nodeId);

      // Set start node if this is the ascendancy start
      if (node.isAscendancyStart) {
        ascendancyMap[node.ascendancyName].startNodeId = nodeId;
      }
    }
  }

  return ascendancyMap;
}

/**
 * Process raw GGG JSON into render-ready data structures.
 */
function processTreeData(json) {
  const nodes = json.nodes;
  const groups = json.groups;
  const positions = calculateAllPositions(nodes, groups);
  const adjacencyList = buildAdjacencyList(nodes);
  const bridgeNodes = getBridgeNodes(nodes);
  const bounds = getBoundingBox(positions);
  const spriteMap = buildSpriteMap(json.sprites || {});
  const classData = extractClassData(nodes, positions);
  const ascendancyMap = extractAscendancyMap(nodes);

  // Build a lookup of nodeId → skill for encoding
  const skillToNodeId = {};
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.skill) {
      skillToNodeId[node.skill] = nodeId;
    }
  }

  // Pre-compute node metadata for fast access
  const nodeMeta = {};
  for (const [nodeId, node] of Object.entries(nodes)) {
    nodeMeta[nodeId] = {
      type: getNodeType(node),
      allocatable: isAllocatable(nodeId, node),
    };
  }

  return {
    nodes,
    groups,
    positions,
    adjacencyList,
    bridgeNodes,
    bounds,
    skillToNodeId,
    nodeMeta,
    spriteMap,
    classData,
    ascendancyMap,
    constants: json.constants,
    totalPoints: json.points?.totalPoints || 123,
  };
}

export default function usePassiveTreeData(version = DEFAULT_VERSION) {
  const [data, setData] = useState(cache[version] || null);
  const [loading, setLoading] = useState(!cache[version]);
  const [error, setError] = useState(null);
  const loadingRef = useRef(null); // tracks which version is currently loading

  useEffect(() => {
    // Already cached
    if (cache[version]) {
      setData(cache[version]);
      setLoading(false);
      setError(null);
      return;
    }

    // Already loading this version
    if (loadingRef.current === version) return;

    const loader = VERSION_LOADERS[version];
    if (!loader) {
      setError(new Error(`Unknown tree version: ${version}`));
      setLoading(false);
      return;
    }

    loadingRef.current = version;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const raw = await loader();
        const json = raw.default || raw;
        const processed = processTreeData(json);

        cache[version] = processed;

        // Only update state if this version is still the requested one
        if (loadingRef.current === version) {
          setData(processed);
        }
      } catch (err) {
        console.error(`[usePassiveTreeData] Failed to load version ${version}:`, err);
        if (loadingRef.current === version) {
          setError(err);
        }
      } finally {
        if (loadingRef.current === version) {
          setLoading(false);
        }
      }
    })();
  }, [version]);

  return { data, loading, error };
}
