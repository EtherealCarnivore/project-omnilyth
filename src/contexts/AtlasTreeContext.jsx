/*
 * AtlasTreeContext.jsx — Page-scoped state for the atlas tree planner.
 *
 * NOT added to App.jsx's global provider stack. Wraps only AtlasTreePage.
 * Manages saved builds in localStorage and coordinates between hooks.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useAtlasTreeData from '../hooks/useAtlasTreeData';
import useAtlasPathing from '../hooks/useAtlasPathing';
import {
  encodeAtlasBuild,
  decodeAtlasBuild,
  DECODE_STATUS,
  searchNodes,
  groupStatsByContent,
  sanitizePicks,
  getAllocatedChoiceNodes,
  getChosenVariant,
  legacyTreeMessage,
} from '../calculators/atlasTree';
import {
  TOTAL_POINTS,
  ATLAS_TREE_GENERATION,
  ATLAS_TREE_GENERATION_SHIPPED_AT,
} from '../data/atlas/atlasTreeConstants';

const AtlasTreeContext = createContext();

const STORAGE_KEY = 'omnilyth-atlas-builds';
// Bumping this wipes every saved build (loadBuilds drops a mismatch), so new
// build fields are additive: `treeGeneration` (number | null), `legacy`
// (bool) and `unreadable` (bool) were added for the 3.30 tree without a bump.
const STORAGE_VERSION = '1.0.0';

const UNREADABLE_MESSAGE = 'This saved build is damaged and cannot be read.';
const SHIPPED_AT_MS = Date.parse(ATLAS_TREE_GENERATION_SHIPPED_AT);

/** Was this saved build last written by a planner running the current graph? */
function writtenOnCurrentTree(build) {
  const t = Date.parse(build.updatedAt || build.createdAt || '');
  return Number.isFinite(t) && t >= SHIPPED_AT_MS;
}

/** A saved build made on an older atlas tree; it cannot load on this one. */
export function isLegacyBuild(build) {
  if (build.legacy) return true;
  return typeof build.treeGeneration === 'number' && build.treeGeneration < ATLAS_TREE_GENERATION;
}

function loadBuilds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (parsed.version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed.builds || [];
  } catch {
    return [];
  }
}

function saveBuilds(builds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      builds,
      lastUpdated: new Date().toISOString(),
    }));
  } catch (err) {
    console.error('[AtlasTreeContext] Failed to save builds:', err);
  }
}

export function AtlasTreeProvider({ children }) {
  const { data: treeData, loading: dataLoading, error: dataError } = useAtlasTreeData();
  // Seeded from the constant, then reconciled to whatever the loaded tree file
  // actually reports (see the effect below). GGG moved this 132 → 138 in 3.28
  // and 138 → 150 in 3.30.
  const [maxPoints, setMaxPoints] = useState(TOTAL_POINTS);
  const [brightness, setBrightness] = useState(1.3); // Default "Normal"
  const pathing = useAtlasPathing(treeData, maxPoints);

  const [builds, setBuilds] = useState(loadBuilds);
  const [activeBuildId, setActiveBuildId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Set when a loaded build referenced nodes GGG has since retired. Surfaced by
  // AtlasBuildManager — a build that silently loads 3 points short is worse than
  // one that says so out loud.
  const [staleAllocationNotice, setStaleAllocationNotice] = useState(null);
  // Set when a link or saved build was refused (older/newer tree, bad code).
  // The current allocation is left untouched.
  const [loadRejection, setLoadRejection] = useState(null);
  // Choose-one notable picks: { nodeId: variant effect id }. Picks for nodes
  // that are later deallocated stay here (re-allocating restores them) but are
  // filtered out of the summary and the share code.
  const [picks, setPicks] = useState({});

  const decodeOptions = useMemo(() => treeData ? {
    adjacencyList: treeData.adjacencyList,
    bridgeNodes: treeData.bridgeNodes,
    totalPoints: treeData.totalPoints,
  } : null, [treeData]);

  // Tag builds saved before tree generations existed, once:
  //   fits the bundled tree → re-encoded as a v2 hash stamped with it (every
  //                           resolved node kept, so nothing is lost);
  //   empty                 → stamped (it fits any tree);
  //   older tree            → kept, tagged legacy, refused on load;
  //   unreadable            → kept, tagged unreadable (not "older tree").
  useEffect(() => {
    if (!treeData) return;
    setBuilds(prev => {
      let changed = false;
      const next = prev.map(b => {
        if (b.treeGeneration !== undefined) return b;
        changed = true;
        const res = decodeAtlasBuild(b.hash, treeData.nodes, {
          ...decodeOptions,
          writtenOnCurrentTree: writtenOnCurrentTree(b),
        });
        switch (res.status) {
          case DECODE_STATUS.OK:
            return {
              ...b,
              hash: encodeAtlasBuild(res.allNodeIds, treeData.nodes, res.picks),
              treeGeneration: ATLAS_TREE_GENERATION,
            };
          case DECODE_STATUS.EMPTY:
            return { ...b, treeGeneration: ATLAS_TREE_GENERATION };
          case DECODE_STATUS.LEGACY_TREE:
            return { ...b, treeGeneration: res.treeGeneration ?? null, legacy: true };
          default:
            return { ...b, treeGeneration: res.treeGeneration ?? null, unreadable: true };
        }
      });
      return changed ? next : prev;
    });
  }, [treeData, decodeOptions]);

  // The tree file is the authority on the point budget; the constant is only a
  // pre-load seed. Keeps the counter honest across a tree-version swap without
  // anyone remembering to edit two places.
  useEffect(() => {
    if (treeData?.totalPoints) setMaxPoints(treeData.totalPoints);
  }, [treeData]);
  // hoveredNode lives in AtlasTreeRenderer as local state — keeping it
  // off context prevents every consumer of useAtlasTree() from re-rendering
  // on every mouse-enter (mirrors the passive-tree change).

  // Search results
  const searchResults = useMemo(() => {
    if (!treeData || !searchQuery) return new Set();
    return searchNodes(searchQuery, treeData.nodes);
  }, [searchQuery, treeData]);

  // Stat summary grouped by content type
  const statSummary = useMemo(() => {
    if (!treeData) return {};
    return groupStatsByContent(pathing.allocated, treeData.nodes, picks);
  }, [pathing.allocated, treeData, picks]);

  // Allocated choose-one notables, for the Choices panel and its tab badge
  const choiceNodes = useMemo(() => {
    if (!treeData) return [];
    return getAllocatedChoiceNodes(pathing.allocated, treeData.nodes, picks);
  }, [pathing.allocated, treeData, picks]);

  // Bumped when a click allocates a choose-one notable that has no pick yet
  // (as the target or along the auto-path). AtlasTreePage opens the Choices
  // tab on it. Loads never bump it.
  const [choicePrompt, setChoicePrompt] = useState(0);
  const prevChoiceIdsRef = useRef(new Set());
  useEffect(() => {
    const prev = prevChoiceIdsRef.current;
    prevChoiceIdsRef.current = new Set(choiceNodes.map(c => c.nodeId));
    if (changeSourceRef.current !== 'user') return;
    if (choiceNodes.some(c => c.effectId == null && !prev.has(c.nodeId))) {
      setChoicePrompt(n => n + 1);
    }
  }, [choiceNodes]);

  // effectId null clears the pick
  const setPick = useCallback((nodeId, effectId) => {
    if (!treeData) return;
    if (effectId != null && !getChosenVariant(treeData.nodes[nodeId], effectId)) return;
    setPicks(prev => {
      const next = { ...prev };
      if (effectId == null) delete next[nodeId];
      else next[nodeId] = effectId;
      return next;
    });
  }, [treeData]);

  const encodeCurrent = useCallback(() => {
    if (!treeData) return '';
    return encodeAtlasBuild(pathing.allocated, treeData.nodes, picks);
  }, [pathing.allocated, treeData, picks]);

  // Stable callbacks from useAtlasPathing (the `pathing` object itself is new
  // every render, so depending on it would churn every consumer).
  const { resetAllocations: resetPathing, loadAllocations, toggleNode: togglePathing } = pathing;

  // Who changed the allocation last: 'user' (a click) or 'load' (link, saved
  // build, reset). Only a click on an unpicked choose-one notable should pull
  // the Choices tab open.
  const changeSourceRef = useRef('load');

  const toggleNode = useCallback((nodeId) => {
    changeSourceRef.current = 'user';
    return togglePathing(nodeId);
  }, [togglePathing]);

  const resetAllocations = useCallback(() => {
    changeSourceRef.current = 'load';
    resetPathing();
    setPicks({});
  }, [resetPathing]);

  // Apply a decode result. Returns false (and leaves the tree alone) when the
  // code cannot be loaded on this tree. `savedCount` is the build's stored
  // nodeCount (null for a link; the code's own id count is used then).
  const applyDecoded = useCallback((res, buildName, savedCount = null) => {
    if (res.status === DECODE_STATUS.EMPTY) {
      changeSourceRef.current = 'load';
      loadAllocations(new Set());
      setPicks({});
      setLoadRejection(null);
      setStaleAllocationNotice(null);
      return true;
    }
    if (res.status !== DECODE_STATUS.OK) {
      setLoadRejection({ buildName, status: res.status, message: res.message });
      return false;
    }
    changeSourceRef.current = 'load';
    loadAllocations(res.nodeIds);
    setPicks(res.picks);
    setLoadRejection(null);
    const missing = res.missingSkillIds.length;
    const disconnected = res.disconnectedNodeIds.length;
    const droppedPicks = res.droppedPicks.length;
    setStaleAllocationNotice(missing || disconnected || droppedPicks ? {
      buildName,
      missing,
      disconnected,
      droppedPicks,
      loaded: res.nodeIds.size,
      savedCount: savedCount ?? res.savedNodeCount,
    } : null);
    return true;
  }, [loadAllocations]);

  // Persist builds whenever they change
  useEffect(() => {
    saveBuilds(builds);
  }, [builds]);

  // Save current allocations as a new build
  const saveBuild = useCallback((name) => {
    if (!treeData) return null;
    const id = Date.now().toString(36);
    const hash = encodeCurrent();
    const build = {
      id,
      name,
      hash,
      nodeCount: pathing.allocated.size,
      treeGeneration: ATLAS_TREE_GENERATION,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBuilds(prev => [...prev, build]);
    setActiveBuildId(id);
    return build;
  }, [pathing.allocated, treeData, encodeCurrent]);

  // Update an existing build with current allocations
  const updateBuild = useCallback((buildId) => {
    if (!treeData) return;
    const hash = encodeCurrent();
    setBuilds(prev => prev.map(b =>
      b.id === buildId
        ? {
            ...b,
            hash,
            nodeCount: pathing.allocated.size,
            treeGeneration: ATLAS_TREE_GENERATION,
            legacy: false,
            updatedAt: new Date().toISOString(),
          }
        : b
    ));
  }, [pathing.allocated, treeData, encodeCurrent]);

  // Load a saved build
  const loadBuild = useCallback((buildId) => {
    if (!treeData) return;
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    if (isLegacyBuild(build)) {
      setLoadRejection({
        buildName: build.name,
        status: DECODE_STATUS.LEGACY_TREE,
        message: legacyTreeMessage(build.treeGeneration),
      });
      return;
    }
    const res = decodeAtlasBuild(build.hash, treeData.nodes, {
      ...decodeOptions,
      writtenOnCurrentTree: writtenOnCurrentTree(build),
    });
    if (res.status === DECODE_STATUS.INVALID) res.message = UNREADABLE_MESSAGE;
    if (applyDecoded(res, build.name, build.nodeCount)) setActiveBuildId(buildId);
  }, [builds, treeData, decodeOptions, applyDecoded]);

  // Delete a saved build
  const deleteBuild = useCallback((buildId) => {
    setBuilds(prev => prev.filter(b => b.id !== buildId));
    if (activeBuildId === buildId) setActiveBuildId(null);
  }, [activeBuildId]);

  // Rename a saved build
  const renameBuild = useCallback((buildId, newName) => {
    setBuilds(prev => prev.map(b =>
      b.id === buildId ? { ...b, name: newName, updatedAt: new Date().toISOString() } : b
    ));
  }, []);

  // Load from URL hash
  const loadFromHash = useCallback((hash) => {
    if (!treeData || !hash) return;
    const res = decodeAtlasBuild(hash, treeData.nodes, decodeOptions);
    if (applyDecoded(res, null)) setActiveBuildId(null);
  }, [treeData, decodeOptions, applyDecoded]);

  // Get current hash for sharing
  const getCurrentHash = encodeCurrent;

  // Picks that apply to the current tree (allocated nodes only)
  const activePicks = useMemo(() => {
    if (!treeData) return {};
    return sanitizePicks(picks, pathing.allocated, treeData.nodes);
  }, [picks, pathing.allocated, treeData]);

  const value = {
    // Data
    treeData,
    dataLoading,
    dataError,

    // Points
    maxPoints,
    setMaxPoints,

    // Brightness
    brightness,
    setBrightness,

    // Pathing
    allocated: pathing.allocated,
    available: pathing.available,
    rejectedPath: pathing.rejectedPath,
    toggleNode,
    resetAllocations,

    // Choose-one notables
    picks: activePicks,
    setPick,
    choiceNodes,
    choicePrompt,

    // Search
    searchQuery,
    setSearchQuery,
    searchResults,

    // Stats
    statSummary,

    // Builds
    builds,
    activeBuildId,
    saveBuild,
    updateBuild,
    loadBuild,
    deleteBuild,
    renameBuild,
    loadFromHash,
    getCurrentHash,
    staleAllocationNotice,
    dismissStaleAllocationNotice: () => setStaleAllocationNotice(null),
    loadRejection,
    dismissLoadRejection: () => setLoadRejection(null),
  };

  return (
    <AtlasTreeContext.Provider value={value}>
      {children}
    </AtlasTreeContext.Provider>
  );
}

export function useAtlasTree() {
  const context = useContext(AtlasTreeContext);
  if (context === undefined) {
    throw new Error('useAtlasTree must be used within an AtlasTreeProvider');
  }
  return context;
}

export default AtlasTreeContext;
