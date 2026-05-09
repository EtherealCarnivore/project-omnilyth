/*
 * PassiveTreeRenderer.jsx — The main SVG canvas for the passive skill tree.
 *
 * Renders layers in order: group backgrounds → connections → nodes.
 * Zoom/pan handled by useZoomPan hook via CSS transform on a <g> wrapper.
 * Uses GGG's official sprite assets for authentic PoE appearance.
 */

import { useMemo, useCallback, useState, useEffect, memo } from 'react';
import useZoomPan from '../../hooks/useZoomPan';
import { usePassiveTree } from '../../contexts/PassiveTreeContext';
import PassiveNode from './PassiveNode';
import PassiveConnection from './PassiveConnection';
import PassiveGroupBackground from './PassiveGroupBackground';
import PassiveTooltip from './PassiveTooltip';
import PassiveMinimap from './PassiveMinimap';
import { ORBIT_RADII, ZOOM_CONFIG } from '../../data/passive/passiveTreeConstants';

const ZOOM_FACTOR = 0.3835;

export default function PassiveTreeRenderer() {
  const {
    treeData,
    allocated,
    ascAllocated,
    available,
    ascAvailable,
    rejectedPath,
    toggleNode,
    searchResults,
    selectedAscendancy,
    masterySelections,
    onMasteryClick,
  } = usePassiveTree();

  // Hover lives here, not on the context. Mouse-enter on a node updates a
  // single component's state instead of fanning a new context value out to
  // every subscriber — the context value only changes when allocation /
  // search / build state actually changes.
  const [hoveredNode, setHoveredNode] = useState(null);

  const rejectedNodes = useMemo(() => {
    if (!rejectedPath?.nodeIds) return new Set();
    return new Set(rejectedPath.nodeIds);
  }, [rejectedPath]);

  const { containerRef, transform, handlers, zoomIn, zoomOut, fitToView, panTo } =
    useZoomPan(treeData?.bounds, ZOOM_CONFIG);

  // Track container dimensions for minimap
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  // Build connection list from adjacency data
  // Filters: skip root node, skip cross-domain (ascendancy ↔ main tree) connections
  const connections = useMemo(() => {
    if (!treeData) return [];
    const { nodes, positions, groups } = treeData;
    const seen = new Set();
    const conns = [];

    for (const [nodeId, node] of Object.entries(nodes)) {
      // Skip root — its connections span the entire tree
      if (nodeId === 'root') continue;

      const from = positions[nodeId];
      if (!from) continue;

      for (const outId of (node.out || [])) {
        // Skip connections back to root
        if (outId === 'root') continue;

        const key = [nodeId, outId].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);

        const to = positions[outId];
        if (!to) continue;

        const target = nodes[outId];
        if (!target) continue;

        // Skip cross-domain connections (ascendancy node ↔ non-ascendancy node)
        if (node.ascendancyName && !target.ascendancyName) continue;
        if (!node.ascendancyName && target.ascendancyName) continue;

        // Skip connections between different ascendancy subtrees
        if (node.ascendancyName && target.ascendancyName && node.ascendancyName !== target.ascendancyName) continue;

        const conn = {
          key,
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          fromId: nodeId,
          toId: outId,
        };

        // Detect same-orbit connections → render as arcs
        if (node.group === target.group && node.orbit === target.orbit && node.orbit > 0) {
          const group = groups[node.group];
          if (group) {
            conn.arc = {
              cx: group.x,
              cy: group.y,
              r: ORBIT_RADII[node.orbit] || 0,
            };
          }
        }

        conns.push(conn);
      }
    }

    return conns;
  }, [treeData]);

  // Build group background list
  const groupBackgrounds = useMemo(() => {
    if (!treeData?.groups || !treeData?.spriteMap?.groupBackgrounds) return [];
    const list = [];
    for (const [groupId, group] of Object.entries(treeData.groups)) {
      if (!group.background?.image) continue;
      const spriteName = group.background.image;
      const sprite = treeData.spriteMap.groupBackgrounds[spriteName];
      if (!sprite) continue;
      list.push({
        key: groupId,
        x: group.x + (group.background.offsetX || 0),
        y: group.y + (group.background.offsetY || 0),
        sprite,
      });
    }
    return list;
  }, [treeData]);

  // Viewport culling: only render what's visible + margin
  const viewport = useMemo(() => {
    if (!containerSize.w || !containerSize.h || !transform.scale) return null;
    const margin = 500; // world-space margin for nodes just outside view
    const invScale = 1 / transform.scale;
    return {
      minX: (-transform.x * invScale) - margin,
      minY: (-transform.y * invScale) - margin,
      maxX: (-transform.x * invScale) + (containerSize.w * invScale) + margin,
      maxY: (-transform.y * invScale) + (containerSize.h * invScale) + margin,
    };
  }, [transform, containerSize]);

  // Combine allocated sets for connection rendering
  const allAllocated = useMemo(() => {
    const combined = new Set(allocated);
    for (const id of ascAllocated) combined.add(id);
    return combined;
  }, [allocated, ascAllocated]);

  // Combined available sets
  const allAvailable = useMemo(() => {
    const combined = new Set(available);
    for (const id of ascAvailable) combined.add(id);
    return combined;
  }, [available, ascAvailable]);

  // Determine which mastery nodes are connected (adjacent to allocated)
  const connectedMasteries = useMemo(() => {
    if (!treeData) return new Set();
    const { nodes, adjacencyList } = treeData;
    const connected = new Set();
    for (const nodeId of allAllocated) {
      const neighbors = adjacencyList[nodeId];
      if (!neighbors) continue;
      for (const neighbor of neighbors) {
        if (nodes[neighbor]?.isMastery) {
          connected.add(neighbor);
        }
      }
    }
    return connected;
  }, [allAllocated, treeData]);

  // Build full renderable node list (sorted, not culled)
  const allRenderableNodes = useMemo(() => {
    if (!treeData) return [];
    const { nodes, positions, nodeMeta } = treeData;
    const list = [];

    for (const [nodeId, node] of Object.entries(nodes)) {
      if (nodeId === 'root') continue;
      if (!node.name && !node.isMastery && node.classStartIndex === undefined) continue;

      const pos = positions[nodeId];
      if (!pos) continue;

      list.push({
        nodeId,
        node,
        x: pos.x,
        y: pos.y,
        type: nodeMeta[nodeId]?.type || 'regular',
      });
    }

    const typeOrder = { classStart: 0, mastery: 1, ascendancyRegular: 2, regular: 3, jewelSocket: 4, ascendancyNotable: 5, notable: 6, ascendancyStart: 7, keystone: 8 };
    list.sort((a, b) => (typeOrder[a.type] ?? 3) - (typeOrder[b.type] ?? 3));

    return list;
  }, [treeData]);

  // Viewport-culled nodes
  const renderableNodes = useMemo(() => {
    if (!viewport) return allRenderableNodes;
    return allRenderableNodes.filter(n =>
      n.x >= viewport.minX && n.x <= viewport.maxX &&
      n.y >= viewport.minY && n.y <= viewport.maxY
    );
  }, [allRenderableNodes, viewport]);

  // Viewport-culled connections
  const visibleConnections = useMemo(() => {
    if (!viewport) return connections;
    return connections.filter(c => {
      // Include if either endpoint is in viewport
      const fromIn = c.x1 >= viewport.minX && c.x1 <= viewport.maxX && c.y1 >= viewport.minY && c.y1 <= viewport.maxY;
      const toIn = c.x2 >= viewport.minX && c.x2 <= viewport.maxX && c.y2 >= viewport.minY && c.y2 <= viewport.maxY;
      return fromIn || toIn;
    });
  }, [connections, viewport]);

  const onNodeClick = useCallback((nodeId) => {
    // If it's a mastery node with effects and is connected, open modal instead
    const node = treeData?.nodes[nodeId];
    if (node?.isMastery && node?.masteryEffects?.length > 0 && connectedMasteries.has(nodeId)) {
      onMasteryClick?.(nodeId);
      return;
    }
    toggleNode(nodeId);
  }, [toggleNode, treeData, connectedMasteries, onMasteryClick]);

  const onNodeEnter = useCallback((nodeId) => {
    setHoveredNode(nodeId);
  }, [setHoveredNode]);

  const onNodeLeave = useCallback(() => {
    setHoveredNode(null);
  }, [setHoveredNode]);

  // Hovered node data for tooltip
  const hoveredNodeData = useMemo(() => {
    if (!hoveredNode || !treeData) return null;
    return {
      node: treeData.nodes[hoveredNode],
      type: treeData.nodeMeta[hoveredNode]?.type || 'regular',
      isAllocated: allAllocated.has(hoveredNode),
    };
  }, [hoveredNode, treeData, allAllocated]);

  // Class start node art
  const startNodeArt = useMemo(() => {
    if (!treeData?.classData || !treeData?.spriteMap?.startNodes) return [];
    const art = [];
    for (const [idx, cls] of Object.entries(treeData.classData)) {
      if (!cls.position || !cls.startNodeId) continue;
      // Map class name to sprite key
      const spriteKey = `center${cls.name.toLowerCase()}`;
      const sprite = treeData.spriteMap.startNodes[spriteKey];
      if (!sprite) continue;
      const worldW = sprite.w / ZOOM_FACTOR;
      const worldH = sprite.h / ZOOM_FACTOR;
      art.push({
        key: `start-${idx}`,
        sprite,
        x: cls.position.x - worldW / 2,
        y: cls.position.y - worldH / 2,
        width: worldW,
        height: worldH,
      });
    }
    return art;
  }, [treeData]);

  if (!treeData) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#12131e]" ref={containerRef}>
      {/* SVG Canvas — layers split into memo'd children so unrelated state */}
      {/* changes (hover, search, allocation) don't cause every layer's */}
      {/* iteration to re-run. Each layer skips when ITS inputs are stable. */}
      <svg
        className="w-full h-full select-none"
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        <g
          style={{ willChange: 'transform' }}
          transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}
        >
          <GroupBackgroundsLayer groupBackgrounds={groupBackgrounds} />
          <ClassStartArtLayer startNodeArt={startNodeArt} />
          <ConnectionsLayer
            visibleConnections={visibleConnections}
            allAllocated={allAllocated}
          />
          <NodesLayer
            renderableNodes={renderableNodes}
            allAllocated={allAllocated}
            allAvailable={allAvailable}
            searchResults={searchResults}
            hoveredNode={hoveredNode}
            rejectedNodes={rejectedNodes}
            spriteMap={treeData.spriteMap}
            selectedAscendancy={selectedAscendancy}
            masterySelections={masterySelections}
            connectedMasteries={connectedMasteries}
            onNodeClick={onNodeClick}
            onNodeEnter={onNodeEnter}
            onNodeLeave={onNodeLeave}
          />
          <RejectedPathLayer connections={connections} rejectedNodes={rejectedNodes} />
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredNodeData && (
        <PassiveTooltip
          node={hoveredNodeData.node}
          nodeId={hoveredNode}
          type={hoveredNodeData.type}
          isAllocated={hoveredNodeData.isAllocated}
          containerRef={containerRef}
          masterySelection={masterySelections.get(hoveredNode)}
        />
      )}

      {/* Minimap */}
      <PassiveMinimap
        transform={transform}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {/* Rejection message */}
      {rejectedPath && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-red-950/90 backdrop-blur-sm border border-red-500/40 rounded-lg px-4 py-2 text-sm text-red-300 shadow-lg pointer-events-none animate-pulse">
          {rejectedPath.reason}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button
          onClick={zoomIn}
          className="w-8 h-8 rounded-lg bg-zinc-800/90 border border-white/10 text-zinc-300 hover:bg-zinc-700/90 hover:text-zinc-100 flex items-center justify-center text-sm font-bold transition-colors"
          title="Zoom in (+)"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 rounded-lg bg-zinc-800/90 border border-white/10 text-zinc-300 hover:bg-zinc-700/90 hover:text-zinc-100 flex items-center justify-center text-sm font-bold transition-colors"
          title="Zoom out (-)"
        >
          -
        </button>
        <button
          onClick={fitToView}
          className="w-8 h-8 rounded-lg bg-zinc-800/90 border border-white/10 text-zinc-300 hover:bg-zinc-700/90 hover:text-zinc-100 flex items-center justify-center transition-colors"
          title="Fit to view (F)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Layered children ────────────────────────────────────────────────────────
//
// Each layer is wrapped in React.memo with default shallow-prop comparison.
// All array / Set / Map props the layers receive are useMemo'd in the parent,
// so identity is stable across unrelated state changes and the memo skip kicks
// in. Net effect: hover only re-renders <NodesLayer>; allocation changes only
// re-render <NodesLayer> + <ConnectionsLayer>; group backgrounds and class-
// start art skip everything except a treeData reload.

const GroupBackgroundsLayer = memo(function GroupBackgroundsLayer({ groupBackgrounds }) {
  return (
    <g>
      {groupBackgrounds.map((gb) => (
        <PassiveGroupBackground key={gb.key} x={gb.x} y={gb.y} sprite={gb.sprite} />
      ))}
    </g>
  );
});

const ClassStartArtLayer = memo(function ClassStartArtLayer({ startNodeArt }) {
  return (
    <g>
      {startNodeArt.map((art) => (
        <svg
          key={art.key}
          x={art.x}
          y={art.y}
          width={art.width}
          height={art.height}
          viewBox={`${art.sprite.x} ${art.sprite.y} ${art.sprite.w} ${art.sprite.h}`}
          className="pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <image href={art.sprite.sheetUrl} width={art.sprite.sheetW} height={art.sprite.sheetH} />
        </svg>
      ))}
    </g>
  );
});

const ConnectionsLayer = memo(function ConnectionsLayer({ visibleConnections, allAllocated }) {
  return (
    <g>
      {visibleConnections.map((conn) => (
        <PassiveConnection
          key={conn.key}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          arc={conn.arc}
          bothAllocated={allAllocated.has(conn.fromId) && allAllocated.has(conn.toId)}
          oneAllocated={allAllocated.has(conn.fromId) || allAllocated.has(conn.toId)}
        />
      ))}
    </g>
  );
});

const NodesLayer = memo(function NodesLayer({
  renderableNodes,
  allAllocated,
  allAvailable,
  searchResults,
  hoveredNode,
  rejectedNodes,
  spriteMap,
  selectedAscendancy,
  masterySelections,
  connectedMasteries,
  onNodeClick,
  onNodeEnter,
  onNodeLeave,
}) {
  return (
    <g>
      {renderableNodes.map(({ nodeId, node, x, y, type }) => (
        <PassiveNode
          key={nodeId}
          nodeId={nodeId}
          node={node}
          x={x}
          y={y}
          type={type}
          isAllocated={allAllocated.has(nodeId)}
          isAvailable={allAvailable.has(nodeId)}
          isSearchMatch={searchResults.has(nodeId)}
          isHovered={hoveredNode === nodeId}
          isRejected={rejectedNodes.has(nodeId)}
          spriteMap={spriteMap}
          onClick={onNodeClick}
          onMouseEnter={onNodeEnter}
          onMouseLeave={onNodeLeave}
          isSelectedAscendancy={
            node.ascendancyName ? node.ascendancyName === selectedAscendancy : undefined
          }
          isMasteryConnected={connectedMasteries.has(nodeId)}
          isMasterySelected={masterySelections.has(nodeId)}
        />
      ))}
    </g>
  );
});

const RejectedPathLayer = memo(function RejectedPathLayer({ connections, rejectedNodes }) {
  if (rejectedNodes.size <= 1) return null;
  return (
    <g>
      {connections
        .filter((c) => rejectedNodes.has(c.fromId) && rejectedNodes.has(c.toId))
        .map((conn) => (
          <line
            key={`rej-${conn.key}`}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="#ef4444"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.8}
          />
        ))}
    </g>
  );
});
