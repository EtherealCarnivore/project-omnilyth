/*
 * useAtlasTreeData.js — Lazy-loads and processes the GGG atlas tree data.
 *
 * Dynamic import so the 1.3MB JSON doesn't bloat the initial bundle.
 * Processes raw data into render-ready structures with pre-calculated positions.
 * Also extracts sprite sheet data for node icons.
 */

import { useState, useEffect, useRef } from 'react';
import { calculateAllPositions, buildAdjacencyList, getBoundingBox, getNodeType, isAllocatable, getBridgeNodes } from '../calculators/atlasTree';

let cachedData = null;

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
 * Extracts icon sprites (active/inactive/mastery), frame sprites, group backgrounds,
 * atlas background, and start node data.
 */
function buildSpriteMap(sprites) {
  const map = { active: {}, inactive: {}, mastery: {}, frames: {}, groupBackgrounds: {}, atlasBackground: null, startNode: null };

  // Active icons (for allocated nodes)
  for (const cat of ['normalActive', 'notableActive', 'keystoneActive']) {
    Object.assign(map.active, extractSprites(sprites[cat]?.[BEST_ZOOM]));
  }

  // Inactive icons (for unallocated nodes)
  for (const cat of ['normalInactive', 'notableInactive', 'keystoneInactive']) {
    Object.assign(map.inactive, extractSprites(sprites[cat]?.[BEST_ZOOM]));
  }

  // Mastery icons
  Object.assign(map.mastery, extractSprites(sprites.mastery?.[BEST_ZOOM]));

  // Frame sprites (PSSkillFrame, NotableFrame*, KeystoneFrame*, WormholeFrame*)
  Object.assign(map.frames, extractSprites(sprites.frame?.[BEST_ZOOM]));

  // Group background sprites (PSGroupBackground1-3, alts, CleansingFire, Tangle)
  Object.assign(map.groupBackgrounds, extractSprites(sprites.groupBackground?.[BEST_ZOOM]));

  // Atlas background (single full image)
  const bgSheet = sprites.atlasBackground?.[BEST_ZOOM];
  if (bgSheet) {
    const bgCoords = bgSheet.coords?.AtlasPassiveBackground;
    if (bgCoords) {
      map.atlasBackground = { url: bgSheet.filename, w: bgCoords.w, h: bgCoords.h };
    }
  }

  // Start node sprite (from group-background sheet)
  const startSheet = sprites.startNode?.[BEST_ZOOM];
  if (startSheet) {
    const startCoords = startSheet.coords?.AtlasPassiveSkillScreenStart;
    if (startCoords) {
      map.startNode = {
        sheetUrl: startSheet.filename,
        sheetW: startSheet.w,
        sheetH: startSheet.h,
        ...startCoords,
      };
    }
  }

  return map;
}

export default function useAtlasTreeData() {
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (cachedData || loadedRef.current) {
      if (cachedData) setData(cachedData);
      return;
    }
    loadedRef.current = true;

    (async () => {
      try {
        const raw = await import('../data/atlas/atlasTreeData.json');
        const json = raw.default || raw;

        const nodes = json.nodes;
        const groups = json.groups;
        const positions = calculateAllPositions(nodes, groups);
        const adjacencyList = buildAdjacencyList(nodes);
        const bridgeNodes = getBridgeNodes(nodes);
        const bounds = getBoundingBox(positions);
        const spriteMap = buildSpriteMap(json.sprites || {});

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

        const processed = {
          nodes,
          groups,
          positions,
          adjacencyList,
          bridgeNodes,
          bounds,
          skillToNodeId,
          nodeMeta,
          spriteMap,
          totalPoints: json.points?.totalPoints || 132,
          constants: json.constants,
        };

        cachedData = processed;
        setData(processed);
      } catch (err) {
        console.error('[useAtlasTreeData] Failed to load atlas tree data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}
