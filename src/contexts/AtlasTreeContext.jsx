/*
 * AtlasTreeContext.jsx — Page-scoped state for the atlas tree planner.
 *
 * NOT added to App.jsx's global provider stack. Wraps only AtlasTreePage.
 * Manages saved builds in localStorage and coordinates between hooks.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import useAtlasTreeData from '../hooks/useAtlasTreeData';
import useAtlasPathing from '../hooks/useAtlasPathing';
import { encodeAllocatedNodes, decodeAllocatedNodesDetailed, searchNodes, groupStatsByContent } from '../calculators/atlasTree';
import { TOTAL_POINTS } from '../data/atlas/atlasTreeConstants';

const AtlasTreeContext = createContext();

const STORAGE_KEY = 'omnilyth-atlas-builds';
const STORAGE_VERSION = '1.0.0';

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
  // actually reports (see the effect below). GGG moved this 132 → 138 in 3.28.
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
    return groupStatsByContent(pathing.allocated, treeData.nodes);
  }, [pathing.allocated, treeData]);

  // Persist builds whenever they change
  useEffect(() => {
    saveBuilds(builds);
  }, [builds]);

  // Save current allocations as a new build
  const saveBuild = useCallback((name) => {
    if (!treeData) return null;
    const id = Date.now().toString(36);
    const hash = encodeAllocatedNodes(pathing.allocated, treeData.nodes);
    const build = {
      id,
      name,
      hash,
      nodeCount: pathing.allocated.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBuilds(prev => [...prev, build]);
    setActiveBuildId(id);
    return build;
  }, [pathing.allocated, treeData]);

  // Update an existing build with current allocations
  const updateBuild = useCallback((buildId) => {
    if (!treeData) return;
    const hash = encodeAllocatedNodes(pathing.allocated, treeData.nodes);
    setBuilds(prev => prev.map(b =>
      b.id === buildId
        ? { ...b, hash, nodeCount: pathing.allocated.size, updatedAt: new Date().toISOString() }
        : b
    ));
  }, [pathing.allocated, treeData]);

  // Load a saved build
  const loadBuild = useCallback((buildId) => {
    if (!treeData) return;
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    const { nodeIds, missingSkillIds } = decodeAllocatedNodesDetailed(build.hash, treeData.nodes);
    pathing.loadAllocations(nodeIds);
    setActiveBuildId(buildId);
    setStaleAllocationNotice(missingSkillIds.length ? {
      buildName: build.name,
      missing: missingSkillIds.length,
      loaded: nodeIds.size,
      savedCount: build.nodeCount,
    } : null);
  }, [builds, treeData, pathing]);

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
    const { nodeIds, missingSkillIds } = decodeAllocatedNodesDetailed(hash, treeData.nodes);
    pathing.loadAllocations(nodeIds);
    setActiveBuildId(null);
    setStaleAllocationNotice(missingSkillIds.length ? {
      buildName: null,
      missing: missingSkillIds.length,
      loaded: nodeIds.size,
      savedCount: null,
    } : null);
  }, [treeData, pathing]);

  // Get current hash for sharing
  const getCurrentHash = useCallback(() => {
    if (!treeData) return '';
    return encodeAllocatedNodes(pathing.allocated, treeData.nodes);
  }, [pathing.allocated, treeData]);

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
    toggleNode: pathing.toggleNode,
    resetAllocations: pathing.resetAllocations,

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
