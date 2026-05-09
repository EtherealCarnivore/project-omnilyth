/*
 * AtlasDiffRenderer.jsx — Read-only SVG canvas for the atlas tree diff view.
 *
 * Based on AtlasTreeRenderer but with no click-to-allocate. Colors nodes and
 * connections based on diff result: green (add), red (remove), gold (match), gray (idle).
 */

import { useMemo, useCallback, useState, useEffect, memo } from 'react';
import useZoomPan from '../../hooks/useZoomPan';
import { useAtlasDiff } from '../../contexts/AtlasDiffContext';
import AtlasNode from './AtlasNode';
import AtlasGroupBackground from './AtlasGroupBackground';
import AtlasTooltip from './AtlasTooltip';
import AtlasMinimap from './AtlasDiffMinimap';
import { ORBIT_RADII, DIFF_CONNECTION_COLORS } from '../../data/atlas/atlasTreeConstants';

const ZOOM_FACTOR = 0.3835;

function DiffConnection({ x1, y1, x2, y2, arc, diffState }) {
  const style = DIFF_CONNECTION_COLORS[diffState] || DIFF_CONNECTION_COLORS.idle;

  if (arc && arc.r > 0) {
    const angle1 = Math.atan2(y1 - arc.cy, x1 - arc.cx);
    const angle2 = Math.atan2(y2 - arc.cy, x2 - arc.cx);
    let delta = ((angle2 - angle1) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const sweepFlag = delta <= Math.PI ? 1 : 0;

    return (
      <path
        d={`M ${x1} ${y1} A ${arc.r} ${arc.r} 0 0 ${sweepFlag} ${x2} ${y2}`}
        fill="none"
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeLinecap="round"
        opacity={style.opacity}
      />
    );
  }

  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinecap="round"
      opacity={style.opacity}
    />
  );
}

export default function AtlasDiffRenderer() {
  const {
    treeData,
    diffResult,
    brightness,
  } = useAtlasDiff();

  // Hover lives here, not on the context — same lift as the other renderers.
  const [hoveredNode, setHoveredNode] = useState(null);

  const { containerRef, transform, handlers, zoomIn, zoomOut, fitToView } =
    useZoomPan(treeData?.bounds);

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

  // Connection list with diff state
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
          x1: from.x, y1: from.y,
          x2: to.x, y2: to.y,
          fromId: nodeId, toId: outId,
        };

        if (target && node.group === target.group && node.orbit === target.orbit && node.orbit > 0) {
          const group = groups[node.group];
          if (group) {
            conn.arc = { cx: group.x, cy: group.y, r: ORBIT_RADII[node.orbit] || 0 };
          }
        }

        conns.push(conn);
      }
    }

    return conns;
  }, [treeData]);

  // Determine connection diff states
  const connectionDiffStates = useMemo(() => {
    if (!diffResult) return {};
    const states = {};
    for (const conn of connections) {
      const fromInAdd = diffResult.toAdd.has(conn.fromId);
      const toInAdd = diffResult.toAdd.has(conn.toId);
      const fromInRemove = diffResult.toRemove.has(conn.fromId);
      const toInRemove = diffResult.toRemove.has(conn.toId);
      const fromInMatch = diffResult.matching.has(conn.fromId);
      const toInMatch = diffResult.matching.has(conn.toId);

      if (fromInAdd && toInAdd) states[conn.key] = 'add';
      else if (fromInRemove && toInRemove) states[conn.key] = 'remove';
      else if ((fromInMatch || fromInAdd) && (toInMatch || toInAdd)) states[conn.key] = 'match';
      else if ((fromInMatch || fromInRemove) && (toInMatch || toInRemove)) states[conn.key] = 'match';
      else if (fromInMatch && toInMatch) states[conn.key] = 'match';
      else states[conn.key] = 'idle';
    }
    return states;
  }, [diffResult, connections]);

  // Group backgrounds
  const groupBackgrounds = useMemo(() => {
    if (!treeData?.groups || !treeData?.spriteMap?.groupBackgrounds) return [];
    const list = [];
    for (const [groupId, group] of Object.entries(treeData.groups)) {
      if (!group.background?.image) continue;
      const sprite = treeData.spriteMap.groupBackgrounds[group.background.image];
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

  // Renderable nodes
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
        nodeId, node,
        x: pos.x, y: pos.y,
        type: nodeMeta[nodeId]?.type || 'regular',
      });
    }

    const typeOrder = { mastery: 0, regular: 1, notable: 2, keystone: 3 };
    list.sort((a, b) => (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0));
    return list;
  }, [treeData]);

  const onNodeEnter = useCallback((nodeId) => setHoveredNode(nodeId), [setHoveredNode]);
  const onNodeLeave = useCallback(() => setHoveredNode(null), [setHoveredNode]);

  // Hovered node data for tooltip
  const hoveredNodeData = useMemo(() => {
    if (!hoveredNode || !treeData) return null;
    const isInTarget = diffResult?.toAdd.has(hoveredNode) || diffResult?.matching.has(hoveredNode);
    return {
      node: treeData.nodes[hoveredNode],
      type: treeData.nodeMeta[hoveredNode]?.type || 'regular',
      isAllocated: isInTarget,
    };
  }, [hoveredNode, treeData, diffResult]);

  // Atlas background image
  const bgProps = useMemo(() => {
    if (!treeData?.bounds || !treeData?.spriteMap?.atlasBackground) return null;
    const bg = treeData.spriteMap.atlasBackground;
    const { minX, minY, width, height } = treeData.bounds;
    const worldW = bg.w / ZOOM_FACTOR;
    const worldH = bg.h / ZOOM_FACTOR;
    const cx = minX + width / 2;
    const cy = minY + height / 2;
    return { url: bg.url, x: cx - worldW / 2, y: cy - worldH / 2, width: worldW, height: worldH };
  }, [treeData]);

  // Start node
  const startNodeProps = useMemo(() => {
    if (!treeData?.spriteMap?.startNode || !treeData?.positions?.root) return null;
    const sn = treeData.spriteMap.startNode;
    const rootPos = treeData.positions.root;
    const worldW = sn.w / ZOOM_FACTOR;
    const worldH = sn.h / ZOOM_FACTOR;
    return { sprite: sn, x: rootPos.x - worldW / 2, y: rootPos.y - worldH / 2, width: worldW, height: worldH };
  }, [treeData]);

  if (!treeData) return null;

  // Determine which nodes are "allocated" for display purposes (any node in the diff union)
  const allAllocated = useMemo(() => {
    if (!diffResult) return new Set();
    const all = new Set();
    for (const id of diffResult.toAdd) all.add(id);
    for (const id of diffResult.toRemove) all.add(id);
    for (const id of diffResult.matching) all.add(id);
    return all;
  }, [diffResult]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black" ref={containerRef}>
      <svg
        className="w-full h-full select-none"
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        <g
          style={{ willChange: 'transform' }}
          transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}
        >
          <DiffBackgroundLayer bgProps={bgProps} brightness={brightness} />
          <DiffGroupBackgroundsLayer groupBackgrounds={groupBackgrounds} brightness={brightness} />
          <DiffStartNodeLayer startNodeProps={startNodeProps} />
          <DiffConnectionsLayer connections={connections} connectionDiffStates={connectionDiffStates} />
          <DiffNodesLayer
            renderableNodes={renderableNodes}
            allAllocated={allAllocated}
            diffResult={diffResult}
            hoveredNode={hoveredNode}
            spriteMap={treeData.spriteMap}
            brightness={brightness}
            onNodeEnter={onNodeEnter}
            onNodeLeave={onNodeLeave}
          />
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

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button
          onClick={zoomIn}
          className="w-8 h-8 rounded-lg bg-zinc-800/90 border border-white/10 text-zinc-300 hover:bg-zinc-700/90 hover:text-zinc-100 flex items-center justify-center text-sm font-bold transition-colors"
          title="Zoom in (+)"
        >+</button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 rounded-lg bg-zinc-800/90 border border-white/10 text-zinc-300 hover:bg-zinc-700/90 hover:text-zinc-100 flex items-center justify-center text-sm font-bold transition-colors"
          title="Zoom out (-)"
        >-</button>
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

const DiffBackgroundLayer = memo(function DiffBackgroundLayer({ bgProps, brightness }) {
  if (!bgProps) return null;
  return (
    <image
      href={bgProps.url}
      x={bgProps.x}
      y={bgProps.y}
      width={bgProps.width}
      height={bgProps.height}
      preserveAspectRatio="none"
      style={{ filter: `brightness(${brightness})` }}
    />
  );
});

const DiffGroupBackgroundsLayer = memo(function DiffGroupBackgroundsLayer({ groupBackgrounds, brightness }) {
  return (
    <g>
      {groupBackgrounds.map((gb) => (
        <AtlasGroupBackground
          key={gb.key}
          x={gb.x}
          y={gb.y}
          sprite={gb.sprite}
          brightness={brightness}
        />
      ))}
    </g>
  );
});

const DiffStartNodeLayer = memo(function DiffStartNodeLayer({ startNodeProps }) {
  if (!startNodeProps) return null;
  return (
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
  );
});

const DiffConnectionsLayer = memo(function DiffConnectionsLayer({ connections, connectionDiffStates }) {
  return (
    <g>
      {connections.map((conn) => (
        <DiffConnection
          key={conn.key}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          arc={conn.arc}
          diffState={connectionDiffStates[conn.key] || 'idle'}
        />
      ))}
    </g>
  );
});

const DiffNodesLayer = memo(function DiffNodesLayer({
  renderableNodes,
  allAllocated,
  diffResult,
  hoveredNode,
  spriteMap,
  brightness,
  onNodeEnter,
  onNodeLeave,
}) {
  return (
    <g>
      {renderableNodes.map(({ nodeId, node, x, y, type }) => (
        <AtlasNode
          key={nodeId}
          nodeId={nodeId}
          node={node}
          x={x}
          y={y}
          type={type}
          isAllocated={allAllocated.has(nodeId)}
          isAvailable={false}
          isSearchMatch={false}
          isHovered={hoveredNode === nodeId}
          isRejected={false}
          isDiffAdd={diffResult?.toAdd.has(nodeId) || false}
          isDiffRemove={diffResult?.toRemove.has(nodeId) || false}
          spriteMap={spriteMap}
          brightness={brightness}
          onMouseEnter={onNodeEnter}
          onMouseLeave={onNodeLeave}
        />
      ))}
    </g>
  );
});
