/*
 * PassiveTreeContext.jsx — Page-scoped state for the passive skill tree planner.
 *
 * NOT added to App.jsx's global provider stack. Wraps only PassiveTreePage.
 * Manages class/ascendancy selection, mastery selections, saved builds,
 * and coordinates between hooks.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import usePassiveTreeData from '../hooks/usePassiveTreeData';
import usePassivePathing from '../hooks/usePassivePathing';
import { encodePassiveTree, decodePassiveTree, searchNodes, groupStatsByCategory } from '../calculators/passiveTree';
import { TOTAL_PASSIVE_POINTS, TOTAL_ASCENDANCY_POINTS } from '../data/passive/passiveTreeConstants';

const PassiveTreeContext = createContext();

const STORAGE_KEY = 'omnilyth-passive-builds';
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

function saveBuildsToStorage(builds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      builds,
      lastUpdated: new Date().toISOString(),
    }));
  } catch (err) {
    console.error('[PassiveTreeContext] Failed to save builds:', err);
  }
}

export function PassiveTreeProvider({ children }) {
  const { data: treeData, loading: dataLoading, error: dataError } = usePassiveTreeData();

  // Class & ascendancy selection
  const [selectedClass, setSelectedClass] = useState(null); // classIndex (0-6) or null
  const [selectedAscendancy, setSelectedAscendancy] = useState(null); // ascendancy id string
  const [freeMode, setFreeMode] = useState(false);

  // Points
  const [maxPassivePoints, setMaxPassivePoints] = useState(TOTAL_PASSIVE_POINTS);
  const [maxAscendancyPoints, setMaxAscendancyPoints] = useState(TOTAL_ASCENDANCY_POINTS);

  // Mastery selections: nodeId → effectId
  const [masterySelections, setMasterySelections] = useState(new Map());

  // Mastery click callback — set by the page to open the modal
  const [onMasteryClick, setOnMasteryClick] = useState(null);

  // Get the class start node ID for current selection
  const classStartNodeId = useMemo(() => {
    if (selectedClass === null || !treeData?.classData) return null;
    return treeData.classData[selectedClass]?.startNodeId || null;
  }, [selectedClass, treeData]);

  // Pathing hook
  const pathing = usePassivePathing(treeData, classStartNodeId, maxPassivePoints, maxAscendancyPoints);

  // Builds persistence
  const [builds, setBuilds] = useState(loadBuilds);
  const [activeBuildId, setActiveBuildId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);

  // Search results
  const searchResults = useMemo(() => {
    if (!treeData || !searchQuery) return new Set();
    return searchNodes(searchQuery, treeData.nodes);
  }, [searchQuery, treeData]);

  // Stat summary
  const statSummary = useMemo(() => {
    if (!treeData) return {};
    return groupStatsByCategory(pathing.allocated, pathing.ascAllocated, masterySelections, treeData.nodes);
  }, [pathing.allocated, pathing.ascAllocated, masterySelections, treeData]);

  // Persist builds
  useEffect(() => {
    saveBuildsToStorage(builds);
  }, [builds]);

  // Change class — resets allocations
  const selectClass = useCallback((classIndex) => {
    setSelectedClass(classIndex);
    setSelectedAscendancy(null);
    setMasterySelections(new Map());
    pathing.resetAllocations();
  }, [pathing]);

  // Change ascendancy — resets ascendancy allocations
  const selectAscendancy = useCallback((ascId) => {
    setSelectedAscendancy(ascId);
    // Clear ascendancy allocations
    pathing.loadAllocations([...pathing.allocated], []);
  }, [pathing]);

  // Toggle free mode
  const toggleFreeMode = useCallback(() => {
    setFreeMode(prev => !prev);
    if (!freeMode) {
      // Entering free mode: keep current class
    } else {
      // Leaving free mode: reset
      setSelectedClass(null);
      setSelectedAscendancy(null);
      setMasterySelections(new Map());
      pathing.resetAllocations();
    }
  }, [freeMode, pathing]);

  // Mastery selection
  const selectMastery = useCallback((nodeId, effectId) => {
    setMasterySelections(prev => {
      const next = new Map(prev);
      if (effectId === null) {
        next.delete(nodeId);
      } else {
        next.set(nodeId, effectId);
      }
      return next;
    });
  }, []);

  // Save current build
  const saveBuild = useCallback((name) => {
    if (!treeData) return null;
    const id = Date.now().toString(36);
    const hash = encodePassiveTree(
      pathing.allocated, pathing.ascAllocated, masterySelections,
      selectedClass ?? -1, selectedAscendancy ? getAscendancyNumericId(selectedAscendancy) : 0,
      treeData.nodes
    );
    const build = {
      id,
      name,
      hash,
      className: selectedClass !== null ? treeData.classData[selectedClass]?.name : 'None',
      ascendancyName: selectedAscendancy || null,
      passiveCount: pathing.allocated.size,
      ascendancyCount: pathing.ascAllocated.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBuilds(prev => [...prev, build]);
    setActiveBuildId(id);
    return build;
  }, [pathing.allocated, pathing.ascAllocated, masterySelections, selectedClass, selectedAscendancy, treeData]);

  // Update existing build
  const updateBuild = useCallback((buildId) => {
    if (!treeData) return;
    const hash = encodePassiveTree(
      pathing.allocated, pathing.ascAllocated, masterySelections,
      selectedClass ?? -1, selectedAscendancy ? getAscendancyNumericId(selectedAscendancy) : 0,
      treeData.nodes
    );
    setBuilds(prev => prev.map(b =>
      b.id === buildId
        ? {
          ...b, hash,
          passiveCount: pathing.allocated.size,
          ascendancyCount: pathing.ascAllocated.size,
          updatedAt: new Date().toISOString(),
        }
        : b
    ));
  }, [pathing.allocated, pathing.ascAllocated, masterySelections, selectedClass, selectedAscendancy, treeData]);

  // Load a saved build
  const loadBuild = useCallback((buildId) => {
    if (!treeData) return;
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    const decoded = decodePassiveTree(build.hash, treeData.nodes);
    setSelectedClass(decoded.classIndex >= 0 ? decoded.classIndex : null);
    // Restore ascendancy from build metadata
    setSelectedAscendancy(build.ascendancyName || null);
    setMasterySelections(decoded.masterySelections);
    pathing.loadAllocations(decoded.allocated, decoded.ascAllocated);
    setActiveBuildId(buildId);
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
    const decoded = decodePassiveTree(hash, treeData.nodes);
    setSelectedClass(decoded.classIndex >= 0 ? decoded.classIndex : null);
    setMasterySelections(decoded.masterySelections);
    pathing.loadAllocations(decoded.allocated, decoded.ascAllocated);
    setActiveBuildId(null);
  }, [treeData, pathing]);

  // Get current hash for sharing
  const getCurrentHash = useCallback(() => {
    if (!treeData) return '';
    return encodePassiveTree(
      pathing.allocated, pathing.ascAllocated, masterySelections,
      selectedClass ?? -1, selectedAscendancy ? getAscendancyNumericId(selectedAscendancy) : 0,
      treeData.nodes
    );
  }, [pathing.allocated, pathing.ascAllocated, masterySelections, selectedClass, selectedAscendancy, treeData]);

  const value = {
    // Data
    treeData,
    dataLoading,
    dataError,

    // Class & ascendancy
    selectedClass,
    selectedAscendancy,
    freeMode,
    selectClass,
    selectAscendancy,
    toggleFreeMode,

    // Points
    maxPassivePoints,
    setMaxPassivePoints,
    maxAscendancyPoints,
    setMaxAscendancyPoints,

    // Pathing
    allocated: pathing.allocated,
    ascAllocated: pathing.ascAllocated,
    available: pathing.available,
    ascAvailable: pathing.ascAvailable,
    rejectedPath: pathing.rejectedPath,
    toggleNode: pathing.toggleNode,
    resetAllocations: pathing.resetAllocations,

    // Mastery
    masterySelections,
    selectMastery,
    onMasteryClick,
    setOnMasteryClick,

    // Search
    searchQuery,
    setSearchQuery,
    searchResults,

    // Hover
    hoveredNode,
    setHoveredNode,

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
  };

  return (
    <PassiveTreeContext.Provider value={value}>
      {children}
    </PassiveTreeContext.Provider>
  );
}

export function usePassiveTree() {
  const context = useContext(PassiveTreeContext);
  if (context === undefined) {
    throw new Error('usePassiveTree must be used within a PassiveTreeProvider');
  }
  return context;
}

// Helper: convert ascendancy name to a numeric ID for encoding
// Uses a simple hash since we just need consistency
function getAscendancyNumericId(ascName) {
  if (!ascName) return 0;
  let hash = 0;
  for (let i = 0; i < ascName.length; i++) {
    hash = ((hash << 5) - hash + ascName.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) & 0xff;
}

export default PassiveTreeContext;
