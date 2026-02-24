/*
 * useAtlasPathing.js — React wrapper around the atlas tree pathing calculator.
 *
 * Maintains the set of allocated nodes and handles allocation/deallocation
 * with pathing validation. All the heavy lifting is in calculators/atlasTree.js.
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  canAllocate,
  canDeallocate,
  getAvailableNodes,
  findShortestPath,
} from '../calculators/atlasTree';

export default function useAtlasPathing(treeData, maxPoints = 132) {
  const [allocated, setAllocated] = useState(new Set());
  // Rejected path: { nodeIds: string[], reason: string } — shown as red overlay, auto-clears
  const [rejectedPath, setRejectedPath] = useState(null);
  const rejectTimerRef = useRef(null);

  const { nodes, adjacencyList, bridgeNodes, nodeMeta } = treeData || {};

  // Available nodes (adjacent to current tree, expanding through bridge nodes)
  const available = useMemo(() => {
    if (!nodes || !adjacencyList || !bridgeNodes) return new Set();
    return getAvailableNodes(allocated, adjacencyList, nodes, bridgeNodes);
  }, [allocated, nodes, adjacencyList, bridgeNodes]);

  // Show a rejected path for 2 seconds then clear it
  const showRejection = useCallback((nodeIds, reason) => {
    if (rejectTimerRef.current) clearTimeout(rejectTimerRef.current);
    setRejectedPath({ nodeIds, reason });
    rejectTimerRef.current = setTimeout(() => setRejectedPath(null), 2000);
  }, []);

  // Allocate a node (with optional auto-pathing)
  const allocateNode = useCallback((nodeId, autoPath = false) => {
    if (!nodes || !adjacencyList || !nodeMeta || !bridgeNodes) return false;
    if (allocated.has(nodeId)) return false;
    if (!nodeMeta[nodeId]?.allocatable) return false;

    // Direct neighbor allocation
    if (canAllocate(nodeId, allocated, adjacencyList, bridgeNodes)) {
      const newSize = allocated.size + 1;
      if (newSize > maxPoints) {
        showRejection([nodeId], `Exceeds point limit (${newSize}/${maxPoints})`);
        return false;
      }
      setAllocated(prev => new Set([...prev, nodeId]));
      return true;
    }

    // Try auto-pathing: find shortest path and allocate all intermediate nodes
    if (autoPath) {
      const path = findShortestPath(nodeId, allocated, adjacencyList, nodes, bridgeNodes);
      if (path.length > 0) {
        const newSize = allocated.size + path.length;
        if (newSize > maxPoints) {
          showRejection(path, `Needs ${path.length} points, only ${maxPoints - allocated.size} remaining`);
          return false;
        }
        setAllocated(prev => {
          const next = new Set(prev);
          for (const id of path) next.add(id);
          return next;
        });
        return true;
      }
    }

    return false;
  }, [allocated, nodes, adjacencyList, nodeMeta, bridgeNodes, maxPoints, showRejection]);

  // Deallocate a node
  const deallocateNode = useCallback((nodeId) => {
    if (!adjacencyList || !bridgeNodes) return false;
    if (!allocated.has(nodeId)) return false;

    if (canDeallocate(nodeId, allocated, adjacencyList, bridgeNodes)) {
      setAllocated(prev => {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      });
      return true;
    }

    return false;
  }, [allocated, adjacencyList, bridgeNodes]);

  // Toggle a node
  const toggleNode = useCallback((nodeId) => {
    if (allocated.has(nodeId)) {
      return deallocateNode(nodeId);
    }
    return allocateNode(nodeId, true);
  }, [allocated, allocateNode, deallocateNode]);

  // Reset all allocations
  const resetAllocations = useCallback(() => {
    setAllocated(new Set());
    setRejectedPath(null);
  }, []);

  // Load a set of allocations (from URL or saved build)
  const loadAllocations = useCallback((nodeIds) => {
    setAllocated(new Set(nodeIds));
    setRejectedPath(null);
  }, []);

  return {
    allocated,
    available,
    rejectedPath,
    allocateNode,
    deallocateNode,
    toggleNode,
    resetAllocations,
    loadAllocations,
  };
}
