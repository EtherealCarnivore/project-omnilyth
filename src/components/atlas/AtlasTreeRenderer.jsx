/*
 * AtlasTreeRenderer.jsx — The main SVG canvas for the atlas tree.
 *
 * Renders layers in order: background image → group backgrounds → connections → nodes.
 * Zoom/pan handled by useZoomPan hook via CSS transform on a <g> wrapper.
 * Uses GGG's official sprite assets for authentic PoE atlas appearance.
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import useZoomPan from '../../hooks/useZoomPan';
import { useAtlasTree } from '../../contexts/AtlasTreeContext';
import AtlasNode from './AtlasNode';
import AtlasConnection from './AtlasConnection';
import AtlasGroupBackground from './AtlasGroupBackground';
import AtlasTooltip from './AtlasTooltip';
import AtlasMinimap from './AtlasMinimap';
import { ORBIT_RADII } from '../../data/atlas/atlasTreeConstants';

// The zoom factor used in the sprite data — world-space = sprite_px / ZOOM_FACTOR
const ZOOM_FACTOR = 0.3835;

export default function AtlasTreeRenderer() {
  const {
    treeData,
    allocated,
    available,
    rejectedPath,
    toggleNode,
    searchResults,
    hoveredNode,
    setHoveredNode,
    brightness,
  } = useAtlasTree();

  // Set of node IDs in the rejected path (for red highlighting)
  const rejectedNodes = useMemo(() => {
    if (!rejectedPath?.nodeIds) return new Set();
    return new Set(rejectedPath.nodeIds);
  }, [rejectedPath]);

  const { containerRef, transform, handlers, zoomIn, zoomOut, fitToView } =
    useZoomPan(treeData?.bounds);

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

  // Build connection list from adjacency data.
  // Same-orbit connections get arc metadata (center + radius) for curved rendering.
  const connections = useMemo(() => {
    if (!treeData) return [];
    const { nodes, positions, groups } = treeData;
    const seen = new Set();
    const conns = [];

    for (const [nodeId, node] of Object.entries(nodes)) {
      const from = positions[nodeId];
      if (!from) continue;

      for (const outId of (node.out || [])) {
        const key = [nodeId, outId].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);

        const to = positions[outId];
        if (!to) continue;

        const target = nodes[outId];
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
        if (target && node.group === target.group && node.orbit === target.orbit && node.orbit > 0) {
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
        spriteName,
      });
    }
    return list;
  }, [treeData]);

  // Build renderable node list (skip root and empty nodes)
  const renderableNodes = useMemo(() => {
    if (!treeData) return [];
    const { nodes, positions, nodeMeta } = treeData;
    const list = [];

    for (const [nodeId, node] of Object.entries(nodes)) {
      if (nodeId === 'root') continue;
      if (!node.name && !node.isMastery) continue;

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

    // Render mastery nodes first (background), then regular, notable, keystone on top
    const typeOrder = { mastery: 0, regular: 1, notable: 2, keystone: 3 };
    list.sort((a, b) => (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0));

    return list;
  }, [treeData]);

  const onNodeClick = useCallback((nodeId) => {
    toggleNode(nodeId);
  }, [toggleNode]);

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
      isAllocated: allocated.has(hoveredNode),
    };
  }, [hoveredNode, treeData, allocated]);

  // Atlas background image positioning (centered on tree bounds)
  const bgProps = useMemo(() => {
    if (!treeData?.bounds || !treeData?.spriteMap?.atlasBackground) return null;
    const bg = treeData.spriteMap.atlasBackground;
    const { minX, minY, width, height } = treeData.bounds;
    // Scale the image to world-space
    const worldW = bg.w / ZOOM_FACTOR;
    const worldH = bg.h / ZOOM_FACTOR;
    // Center on the tree bounding box
    const cx = minX + width / 2;
    const cy = minY + height / 2;
    return {
      url: bg.url,
      x: cx - worldW / 2,
      y: cy - worldH / 2,
      width: worldW,
      height: worldH,
    };
  }, [treeData]);

  // Start node positioning (at root position)
  const startNodeProps = useMemo(() => {
    if (!treeData?.spriteMap?.startNode || !treeData?.positions?.root) return null;
    const sn = treeData.spriteMap.startNode;
    const rootPos = treeData.positions.root;
    const worldW = sn.w / ZOOM_FACTOR;
    const worldH = sn.h / ZOOM_FACTOR;
    return {
      sprite: sn,
      x: rootPos.x - worldW / 2,
      y: rootPos.y - worldH / 2,
      width: worldW,
      height: worldH,
    };
  }, [treeData]);

  if (!treeData) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black" ref={containerRef}>
      {/* SVG Canvas */}
      <svg
        className="w-full h-full select-none"
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Layer 0: Atlas background image */}
          {bgProps && (
            <image
              href={bgProps.url}
              x={bgProps.x}
              y={bgProps.y}
              width={bgProps.width}
              height={bgProps.height}
              preserveAspectRatio="none"
              style={{ filter: `brightness(${brightness})` }}
            />
          )}

          {/* Layer 1: Group backgrounds (teal/gold nebula clusters) */}
          <g>
            {groupBackgrounds.map(gb => (
              <AtlasGroupBackground
                key={gb.key}
                x={gb.x}
                y={gb.y}
                sprite={gb.sprite}
                brightness={brightness}
              />
            ))}
          </g>

          {/* Layer 2: Start node art */}
          {startNodeProps && (
            <foreignObject
              x={startNodeProps.x}
              y={startNodeProps.y}
              width={startNodeProps.width}
              height={startNodeProps.height}
              className="pointer-events-none"
            >
              <div
                style={{
                  width: startNodeProps.width,
                  height: startNodeProps.height,
                  backgroundImage: `url(${startNodeProps.sprite.sheetUrl})`,
                  backgroundPosition: `-${startNodeProps.sprite.x / ZOOM_FACTOR}px -${startNodeProps.sprite.y / ZOOM_FACTOR}px`,
                  backgroundSize: `${startNodeProps.sprite.sheetW / ZOOM_FACTOR}px ${startNodeProps.sprite.sheetH / ZOOM_FACTOR}px`,
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </foreignObject>
          )}

          {/* Layer 3: Connections */}
          <g>
            {connections.map(conn => (
              <AtlasConnection
                key={conn.key}
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                arc={conn.arc}
                bothAllocated={allocated.has(conn.fromId) && allocated.has(conn.toId)}
                oneAllocated={allocated.has(conn.fromId) || allocated.has(conn.toId)}
              />
            ))}
          </g>

          {/* Layer 4: Nodes */}
          <g>
            {renderableNodes.map(({ nodeId, node, x, y, type }) => (
              <AtlasNode
                key={nodeId}
                nodeId={nodeId}
                node={node}
                x={x}
                y={y}
                type={type}
                isAllocated={allocated.has(nodeId)}
                isAvailable={available.has(nodeId)}
                isSearchMatch={searchResults.has(nodeId)}
                isHovered={hoveredNode === nodeId}
                isRejected={rejectedNodes.has(nodeId)}
                spriteMap={treeData.spriteMap}
                brightness={brightness}
                onClick={onNodeClick}
                onMouseEnter={onNodeEnter}
                onMouseLeave={onNodeLeave}
              />
            ))}
          </g>

          {/* Layer 5: Rejected path connections (red overlay) */}
          {rejectedNodes.size > 1 && (
            <g>
              {connections
                .filter(c => rejectedNodes.has(c.fromId) && rejectedNodes.has(c.toId))
                .map(conn => (
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
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredNodeData && (
        <AtlasTooltip
          node={hoveredNodeData.node}
          nodeId={hoveredNode}
          type={hoveredNodeData.type}
          isAllocated={hoveredNodeData.isAllocated}
          containerRef={containerRef}
        />
      )}

      {/* Minimap */}
      <AtlasMinimap
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
