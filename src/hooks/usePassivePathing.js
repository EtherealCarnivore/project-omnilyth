/*
 * usePassivePathing.js — React wrapper around the passive tree pathing calculator.
 *
 * Dual point pools: allocated (main passive tree) + ascAllocated (ascendancy)
 * Maintains connectivity: BFS from classStartNodeId for main tree, adjacency for ascendancy
 * Handles auto-pathing with rejection feedback
 *
 * Key differences from useAtlasPathing:
 * - Takes (treeData, classStartNodeId, maxPassivePoints, maxAscendancyPoints)
 * - Separate state for allocated and ascAllocated
 * - Separate available and ascAvailable sets
 * - Routes node allocation/deallocation based on ascendancyName
 * - Simple adjacency checking for ascendancy (no full BFS pathing)
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  canAllocate,
  canDeallocate,
  getAvailableNodes,
  findShortestPath,
  isAllocatable,
  isAscendancyAllocatable,
} from '../calculators/passiveTree';

export default function usePassivePathing(
  treeData,
  classStartNodeId,
  maxPassivePoints = 123,
  maxAscendancyPoints = 8
) {
  // Main tree allocations
  const [allocated, setAllocated] = useState(new Set());
  // Ascendancy allocations
  const [ascAllocated, setAscAllocated] = useState(new Set());
  // Rejected path: { nodeIds: string[], reason: string } — shown as red overlay, auto-clears
  const [rejectedPath, setRejectedPath] = useState(null);
  const rejectTimerRef = useRef(null);

  const { nodes, adjacencyList, bridgeNodes, nodeMeta } = treeData || {};

  // Available main tree nodes (adjacent to current tree, expanding through bridge nodes)
  const available = useMemo(() => {
    if (!nodes || !adjacencyList || !bridgeNodes || !classStartNodeId) return new Set();
    return getAvailableNodes(allocated, adjacencyList, nodes, bridgeNodes, classStartNodeId);
  }, [allocated, nodes, adjacencyList, bridgeNodes, classStartNodeId]);

  // Available ascendancy nodes (simple adjacency check)
  const ascAvailable = useMemo(() => {
    if (!nodes || !adjacencyList) return new Set();
    const availSet = new Set();

    // Find ascendancy start node(s) for the current class
    const ascStartNodes = Object.entries(nodes)
      .filter(([_, node]) => node.isAscendancyStart)
      .map(([nodeId, _]) => nodeId);

    // Get all neighbors of ascendancy start nodes + already allocated ascendancy nodes
    const sources = new Set([...ascStartNodes, ...ascAllocated]);

    for (const nodeId of sources) {
      const neighbors = adjacencyList[nodeId];
      if (!neighbors) continue;

      for (const neighbor of neighbors) {
        const node = nodes[neighbor];
        if (!ascAllocated.has(neighbor) &&
            node?.ascendancyName &&
            isAllocatable(neighbor, node)) {
          availSet.add(neighbor);
        }
      }
    }

    return availSet;
  }, [ascAllocated, nodes, adjacencyList]);

  // Show a rejected path for 2 seconds then clear it
  const showRejection = useCallback((nodeIds, reason) => {
    if (rejectTimerRef.current) clearTimeout(rejectTimerRef.current);
    setRejectedPath({ nodeIds, reason });
    rejectTimerRef.current = setTimeout(() => setRejectedPath(null), 2000);
  }, []);

  // Allocate a main tree node (with optional auto-pathing)
  const allocateNode = useCallback((nodeId, autoPath = false) => {
    if (!nodes || !adjacencyList || !nodeMeta || !bridgeNodes || !classStartNodeId) return false;
    if (allocated.has(nodeId)) return false;
    if (!nodeMeta[nodeId]?.allocatable) return false;

    // Direct neighbor allocation
    if (canAllocate(nodeId, allocated, adjacencyList, bridgeNodes, classStartNodeId)) {
      const newSize = allocated.size + 1;
      if (newSize > maxPassivePoints) {
        showRejection([nodeId], `Exceeds point limit (${newSize}/${maxPassivePoints})`);
        return false;
      }
      setAllocated(prev => new Set([...prev, nodeId]));
      return true;
    }

    // Try auto-pathing: find shortest path and allocate all intermediate nodes
    if (autoPath) {
      const path = findShortestPath(nodeId, allocated, adjacencyList, nodes, bridgeNodes, classStartNodeId);
      if (path.length > 0) {
        const newSize = allocated.size + path.length;
        if (newSize > maxPassivePoints) {
          showRejection(path, `Needs ${path.length} points, only ${maxPassivePoints - allocated.size} remaining`);
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
  }, [allocated, nodes, adjacencyList, nodeMeta, bridgeNodes, classStartNodeId, maxPassivePoints, showRejection]);

  // Deallocate a main tree node
  const deallocateNode = useCallback((nodeId) => {
    if (!adjacencyList || !bridgeNodes || !classStartNodeId) return false;
    if (!allocated.has(nodeId)) return false;

    if (canDeallocate(nodeId, allocated, adjacencyList, bridgeNodes, classStartNodeId)) {
      setAllocated(prev => {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      });
      return true;
    }

    return false;
  }, [allocated, adjacencyList, bridgeNodes, classStartNodeId]);

  // Allocate an ascendancy node (simple adjacency check)
  const allocateAscendancyNode = useCallback((nodeId) => {
    if (!nodes || !adjacencyList) return false;
    if (ascAllocated.has(nodeId)) return false;

    const node = nodes[nodeId];
    if (!node || !node.ascendancyName || !isAllocatable(nodeId, node)) return false;

    // Check if adjacent to an already-allocated ascendancy node OR ascendancy start
    const neighbors = adjacencyList[nodeId];
    if (!neighbors) return false;

    let isAdjacentToAllocated = false;
    for (const neighbor of neighbors) {
      const neighborNode = nodes[neighbor];
      if (ascAllocated.has(neighbor) ||
          (neighborNode?.isAscendancyStart && neighborNode.ascendancyName === node.ascendancyName)) {
        isAdjacentToAllocated = true;
        break;
      }
    }

    if (!isAdjacentToAllocated) return false;

    // Check point limit
    const newSize = ascAllocated.size + 1;
    if (newSize > maxAscendancyPoints) {
      showRejection([nodeId], `Exceeds ascendancy point limit (${newSize}/${maxAscendancyPoints})`);
      return false;
    }

    setAscAllocated(prev => new Set([...prev, nodeId]));
    return true;
  }, [ascAllocated, nodes, adjacencyList, maxAscendancyPoints, showRejection]);

  // Deallocate an ascendancy node (must maintain connectivity within ascendancy subtree)
  const deallocateAscendancyNode = useCallback((nodeId) => {
    if (!ascAllocated.has(nodeId)) return false;
    if (!nodes || !adjacencyList) return false;

    const node = nodes[nodeId];
    if (!node || !node.ascendancyName) return false;

    // Simple check: can only deallocate if it's a leaf node in the ascendancy subtree
    // (no other allocated ascendancy nodes depend on it)
    const neighbors = adjacencyList[nodeId];
    if (!neighbors) return false;

    // Check if any allocated ascendancy neighbors would become disconnected
    for (const neighbor of neighbors) {
      const neighborNode = nodes[neighbor];
      if (ascAllocated.has(neighbor) && neighborNode?.ascendancyName === node.ascendancyName) {
        // This neighbor is allocated and in the same ascendancy
        // Check if it has another path to the ascendancy start
        const remaining = new Set(ascAllocated);
        remaining.delete(nodeId);

        // Simple connectivity check: BFS from ascendancy start
        const ascStartNodes = Object.entries(nodes)
          .filter(([_, n]) => n.isAscendancyStart && n.ascendancyName === node.ascendancyName)
          .map(([id, _]) => id);

        if (ascStartNodes.length === 0) return false;

        const reachable = new Set();
        const queue = [...ascStartNodes];
        const visited = new Set(queue);

        while (queue.length > 0) {
          const current = queue.shift();
          const currentNeighbors = adjacencyList[current];
          if (!currentNeighbors) continue;

          for (const n of currentNeighbors) {
            if (visited.has(n)) continue;
            if (remaining.has(n) && nodes[n]?.ascendancyName === node.ascendancyName) {
              visited.add(n);
              reachable.add(n);
              queue.push(n);
            }
          }
        }

        // If this neighbor is not reachable after removing nodeId, we can't deallocate
        if (remaining.has(neighbor) && !reachable.has(neighbor)) {
          return false;
        }
      }
    }

    setAscAllocated(prev => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
    return true;
  }, [ascAllocated, nodes, adjacencyList]);

  // Toggle a node (routes to main tree or ascendancy based on node.ascendancyName)
  const toggleNode = useCallback((nodeId) => {
    if (!nodes) return false;

    const node = nodes[nodeId];
    if (!node) return false;

    // Check if it's an ascendancy node
    if (node.ascendancyName) {
      if (ascAllocated.has(nodeId)) {
        return deallocateAscendancyNode(nodeId);
      }
      return allocateAscendancyNode(nodeId);
    }

    // Main tree node
    if (allocated.has(nodeId)) {
      return deallocateNode(nodeId);
    }
    return allocateNode(nodeId, true);
  }, [nodes, allocated, ascAllocated, allocateNode, deallocateNode, allocateAscendancyNode, deallocateAscendancyNode]);

  // Reset all allocations
  const resetAllocations = useCallback(() => {
    setAllocated(new Set());
    setAscAllocated(new Set());
    setRejectedPath(null);
  }, []);

  // Load a set of allocations (from URL or saved build)
  const loadAllocations = useCallback((mainIds, ascIds) => {
    setAllocated(new Set(mainIds || []));
    setAscAllocated(new Set(ascIds || []));
    setRejectedPath(null);
  }, []);

  return {
    allocated,
    ascAllocated,
    available,
    ascAvailable,
    rejectedPath,
    toggleNode,
    resetAllocations,
    loadAllocations,
  };
}
