/*
 * AtlasDiffContext.jsx — Page-scoped state for the atlas tree diff tool.
 *
 * NOT added to App.jsx's global provider stack. Wraps only AtlasDiffPage.
 * Manages two tree inputs, decoding, diffing, and hover state.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import useAtlasTreeData from '../hooks/useAtlasTreeData';
import {
  detectAtlasInput,
  decodeAtlasBuild,
  DECODE_STATUS,
  decodeGGGAtlasHash,
  diffTrees,
  groupStatsByContent,
} from '../calculators/atlasTree';

const AtlasDiffContext = createContext();

export function AtlasDiffProvider({ children }) {
  const { data: treeData, loading: dataLoading, error: dataError } = useAtlasTreeData();

  const [targetInput, setTargetInput] = useState('');
  const [yourInput, setYourInput] = useState('');
  const [targetNodes, setTargetNodes] = useState(null);
  const [yourNodes, setYourNodes] = useState(null);
  const [diffResult, setDiffResult] = useState(null);
  const [error, setError] = useState(null);
  // hoveredNode lives in AtlasDiffRenderer as local state — keeping it off
  // the context value prevents context-fan-out re-renders on every
  // mouse-enter (mirrors the passive-tree change).
  const [brightness, setBrightness] = useState(1.3);

  // Detect input type for display badges
  const targetDetected = useMemo(() => detectAtlasInput(targetInput), [targetInput]);
  const yourDetected = useMemo(() => detectAtlasInput(yourInput), [yourInput]);

  // Decode a hash based on detected type → { nodeIds, message }.
  // message is set when an Omnilyth code was refused (older/newer atlas tree).
  const decodeInput = useCallback((detected, nodes) => {
    if (!nodes || detected.type === 'unknown' || !detected.hash) return null;

    if (detected.type === 'ggg') {
      const result = decodeGGGAtlasHash(detected.hash, nodes);
      if (result.size > 0) return { nodeIds: result, message: null };
      // If GGG decode returns empty, fall back to Omnilyth format
    }

    // omnilyth or raw — both use our pako+base64url format
    const res = decodeAtlasBuild(detected.hash, nodes, {
      adjacencyList: treeData?.adjacencyList,
      bridgeNodes: treeData?.bridgeNodes,
      totalPoints: treeData?.totalPoints,
    });
    const refused = res.status === DECODE_STATUS.LEGACY_TREE || res.status === DECODE_STATUS.FUTURE_TREE;
    return { nodeIds: res.nodeIds, message: refused ? res.message : null };
  }, [treeData]);

  // Run comparison
  const compare = useCallback(() => {
    if (!treeData) return;

    setError(null);

    const targetDet = detectAtlasInput(targetInput);
    const yourDet = detectAtlasInput(yourInput);

    if (targetDet.type === 'unknown') {
      setError('Could not detect Target Tree format. Paste a URL or hash.');
      return;
    }
    if (yourDet.type === 'unknown') {
      setError('Could not detect Your Tree format. Paste a URL or hash.');
      return;
    }

    const tDecoded = decodeInput(targetDet, treeData.nodes);
    const yDecoded = decodeInput(yourDet, treeData.nodes);
    const tNodes = tDecoded?.nodeIds;
    const yNodes = yDecoded?.nodeIds;

    if (!tNodes || tNodes.size === 0) {
      setError(tDecoded?.message ? `Target Tree: ${tDecoded.message}` : 'Failed to decode Target Tree. Check the URL or hash.');
      return;
    }
    if (!yNodes || yNodes.size === 0) {
      setError(yDecoded?.message ? `Your Tree: ${yDecoded.message}` : 'Failed to decode Your Tree. Check the URL or hash.');
      return;
    }

    setTargetNodes(tNodes);
    setYourNodes(yNodes);
    // diffTrees(planNodes, targetNodes) — planNodes = "your" tree, targetNodes = "target"
    // toAdd = in your but not target, toRemove = in target but not your
    // We want: toAdd = in target but not yours (green), toRemove = in yours but not target (red)
    setDiffResult(diffTrees(tNodes, yNodes));
  }, [treeData, targetInput, yourInput, decodeInput]);

  // Clear all
  const clear = useCallback(() => {
    setTargetInput('');
    setYourInput('');
    setTargetNodes(null);
    setYourNodes(null);
    setDiffResult(null);
    setError(null);
  }, []);

  // Stat summaries for add/remove lists
  const addStats = useMemo(() => {
    if (!diffResult || !treeData) return {};
    return groupStatsByContent(diffResult.toAdd, treeData.nodes);
  }, [diffResult, treeData]);

  const removeStats = useMemo(() => {
    if (!diffResult || !treeData) return {};
    return groupStatsByContent(diffResult.toRemove, treeData.nodes);
  }, [diffResult, treeData]);

  const value = {
    treeData,
    dataLoading,
    dataError,
    targetInput,
    setTargetInput,
    yourInput,
    setYourInput,
    targetDetected,
    yourDetected,
    targetNodes,
    yourNodes,
    diffResult,
    error,
    compare,
    clear,
    brightness,
    setBrightness,
    addStats,
    removeStats,
  };

  return (
    <AtlasDiffContext.Provider value={value}>
      {children}
    </AtlasDiffContext.Provider>
  );
}

export function useAtlasDiff() {
  const context = useContext(AtlasDiffContext);
  if (context === undefined) {
    throw new Error('useAtlasDiff must be used within an AtlasDiffProvider');
  }
  return context;
}

export default AtlasDiffContext;
