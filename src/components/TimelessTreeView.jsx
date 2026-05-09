/*
 * TimelessTreeView.jsx — SVG passive tree for timeless jewel socket/node selection.
 *
 * Uses GGG sprite sheets for nodes in the jewel radius,
 * simple circles for distant background nodes (performance).
 */

import { useMemo, useCallback, useState, memo } from 'react';
import useZoomPan from '../hooks/useZoomPan';
import { PASSIVE_TYPE, getPassiveSkillType } from '../calculators/timelessJewel';
import { FRAME_NAMES, NODE_SIZES } from '../data/passive/passiveTreeConstants';

const JEWEL_RADIUS = 1800;

const ZOOM_CONFIG = {
  min: 0.01,
  max: 0.25,
  step: 0.15,
  default: 0.04,
  fitPadding: 40,
};

// Map our PASSIVE_TYPE to the frame name keys used by passiveTreeConstants
const TYPE_TO_FRAME_KEY = {
  [PASSIVE_TYPE.SMALL_ATTRIBUTE]: 'regular',
  [PASSIVE_TYPE.SMALL_NORMAL]: 'regular',
  [PASSIVE_TYPE.NOTABLE]: 'notable',
  [PASSIVE_TYPE.KEYSTONE]: 'keystone',
  [PASSIVE_TYPE.JEWEL_SOCKET]: 'jewelSocket',
};

// World-space diameter per type (for sprite rendering)
const SPRITE_SIZE = {
  [PASSIVE_TYPE.SMALL_ATTRIBUTE]: NODE_SIZES.regular * 2,
  [PASSIVE_TYPE.SMALL_NORMAL]: NODE_SIZES.regular * 2,
  [PASSIVE_TYPE.NOTABLE]: NODE_SIZES.notable * 2,
  [PASSIVE_TYPE.KEYSTONE]: NODE_SIZES.keystone * 2,
  [PASSIVE_TYPE.JEWEL_SOCKET]: NODE_SIZES.jewelSocket * 2,
};

// Simple circle radii (for background nodes without sprites)
const CIRCLE_R = {
  [PASSIVE_TYPE.SMALL_ATTRIBUTE]: 30,
  [PASSIVE_TYPE.SMALL_NORMAL]: 30,
  [PASSIVE_TYPE.NOTABLE]: 55,
  [PASSIVE_TYPE.KEYSTONE]: 80,
  [PASSIVE_TYPE.JEWEL_SOCKET]: 55,
};

const NODE_COLORS = {
  [PASSIVE_TYPE.SMALL_ATTRIBUTE]: '#52525b',
  [PASSIVE_TYPE.SMALL_NORMAL]: '#52525b',
  [PASSIVE_TYPE.NOTABLE]: '#71717a',
  [PASSIVE_TYPE.KEYSTONE]: '#a1a1aa',
  [PASSIVE_TYPE.JEWEL_SOCKET]: '#fbbf24',
};

const PINNED_COLOR = '#f472b6';

export default function TimelessTreeView({
  treeData, selectedSocket, onSelectSocket, results, className,
  inRadiusNodeIds, pinnedNodes, onToggleNode,
}) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const { renderNodes, connections, bounds, socketSet } = useMemo(() => {
    if (!treeData) return { renderNodes: [], connections: [], bounds: null, socketSet: new Set() };

    const { nodes, positions } = treeData;
    const rn = [];
    const ss = new Set();
    const conns = [];

    for (const [nodeId, node] of Object.entries(nodes)) {
      if (nodeId === 'root') continue;
      if (node.ascendancyName) continue;
      if (node.isMastery) continue;
      if (node.isProxy) continue;
      if (!node.skill) continue;

      const pos = positions[nodeId];
      if (!pos) continue;

      const isBasicSocket = node.isJewelSocket && node.name === 'Basic Jewel Socket';
      const type = isBasicSocket ? PASSIVE_TYPE.JEWEL_SOCKET : getPassiveSkillType(node);
      if (type === PASSIVE_TYPE.NONE) continue;
      if (node.isJewelSocket && !isBasicSocket) continue;

      rn.push({ nodeId, x: pos.x, y: pos.y, type, name: node.name, icon: node.icon });
      if (isBasicSocket) ss.add(nodeId);

      if (node.out) {
        for (const targetId of node.out) {
          const target = nodes[targetId];
          if (!target || target.ascendancyName) continue;
          const tp = positions[targetId];
          if (!tp) continue;
          conns.push({ x1: pos.x, y1: pos.y, x2: tp.x, y2: tp.y });
        }
      }
    }

    const b = treeData.bounds || { minX: -14000, minY: -11000, maxX: 13000, maxY: 11000 };
    return {
      renderNodes: rn,
      connections: conns,
      bounds: { minX: b.minX, minY: b.minY, maxX: b.maxX, maxY: b.maxY, width: b.maxX - b.minX, height: b.maxY - b.minY },
      socketSet: ss,
    };
  }, [treeData]);

  const { containerRef, transform, handlers, fitToView, zoomIn, zoomOut } = useZoomPan(bounds, ZOOM_CONFIG);

  const socketPos = useMemo(() => {
    if (!selectedSocket || !treeData) return null;
    return treeData.positions[selectedSocket] || null;
  }, [selectedSocket, treeData]);

  const affectedNodeIds = useMemo(() => {
    if (!results) return new Set();
    return new Set(results.map(r => r.nodeId));
  }, [results]);

  // A node is clickable if it's a socket, or if it's in the jewel radius (even without results)
  const clickableNodeIds = useMemo(() => {
    const s = new Set(inRadiusNodeIds || []);
    for (const id of affectedNodeIds) s.add(id);
    return s;
  }, [inRadiusNodeIds, affectedNodeIds]);

  const handleNodeClick = useCallback((nodeId) => {
    if (socketSet.has(nodeId)) {
      onSelectSocket(nodeId);
    } else if (clickableNodeIds.has(nodeId) && onToggleNode) {
      onToggleNode(nodeId);
    }
  }, [socketSet, clickableNodeIds, onSelectSocket, onToggleNode]);

  const { visibleNodes, visibleConns } = useMemo(() => {
    if (!bounds) return { visibleNodes: renderNodes, visibleConns: connections };
    const el = containerRef.current;
    if (!el || transform.scale === 0) return { visibleNodes: renderNodes, visibleConns: connections };

    const rect = el.getBoundingClientRect();
    const margin = 200;
    const invScale = 1 / transform.scale;
    const vMinX = (-transform.x - margin) * invScale;
    const vMaxX = (rect.width - transform.x + margin) * invScale;
    const vMinY = (-transform.y - margin) * invScale;
    const vMaxY = (rect.height - transform.y + margin) * invScale;

    return {
      visibleNodes: renderNodes.filter(n => n.x >= vMinX && n.x <= vMaxX && n.y >= vMinY && n.y <= vMaxY),
      visibleConns: connections.filter(c =>
        (c.x1 >= vMinX && c.x1 <= vMaxX && c.y1 >= vMinY && c.y1 <= vMaxY) ||
        (c.x2 >= vMinX && c.x2 <= vMaxX && c.y2 >= vMinY && c.y2 <= vMaxY)
      ),
    };
  }, [renderNodes, connections, transform, bounds, containerRef]);

  const spriteMap = treeData?.spriteMap || null;

  const tooltipNode = hoveredNode ? renderNodes.find(n => n.nodeId === hoveredNode) : null;

  if (!treeData || !bounds) return null;

  return (
    <div className={`relative bg-zinc-950 rounded-xl overflow-hidden border border-white/5 ${className || ''}`}>
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button onClick={zoomIn} className="w-7 h-7 rounded bg-zinc-800/90 border border-white/10 text-zinc-400 hover:text-zinc-100 text-sm font-bold">+</button>
        <button onClick={zoomOut} className="w-7 h-7 rounded bg-zinc-800/90 border border-white/10 text-zinc-400 hover:text-zinc-100 text-sm font-bold">&minus;</button>
        <button onClick={fitToView} className="w-7 h-7 rounded bg-zinc-800/90 border border-white/10 text-zinc-400 hover:text-zinc-100 text-xs" title="Fit to view">
          <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
      </div>

      {!selectedSocket && (
        <div className="absolute bottom-2 left-2 z-10 px-2 py-1 rounded bg-zinc-900/90 border border-white/10 text-xs text-zinc-500">
          Click a yellow jewel socket to select it
        </div>
      )}

      {tooltipNode && (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded bg-zinc-900/95 border border-white/10 text-xs text-zinc-300 pointer-events-none max-w-[200px]">
          <div className="font-medium">{tooltipNode.name}</div>
          <div className="text-zinc-500 mt-0.5">
            {tooltipNode.type === PASSIVE_TYPE.KEYSTONE ? 'Keystone' :
             tooltipNode.type === PASSIVE_TYPE.NOTABLE ? 'Notable' :
             tooltipNode.type === PASSIVE_TYPE.JEWEL_SOCKET ? 'Jewel Socket' : 'Small Passive'}
            {pinnedNodes?.has(tooltipNode.nodeId) && <span className="text-pink-400 ml-1">(pinned)</span>}
          </div>
        </div>
      )}

      <svg
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Connections */}
          <g opacity={0.15}>
            {visibleConns.map((c, i) => (
              <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#71717a" strokeWidth={12} />
            ))}
          </g>

          {/* Radius circle */}
          {socketPos && (
            <circle
              cx={socketPos.x} cy={socketPos.y} r={JEWEL_RADIUS}
              fill="rgba(45, 212, 191, 0.04)"
              stroke="rgba(45, 212, 191, 0.25)"
              strokeWidth={8}
              strokeDasharray="40 20"
            />
          )}

          {/* Nodes */}
          {visibleNodes.map((n) => {
            const isAffected = affectedNodeIds.has(n.nodeId);
            const isInRadius = clickableNodeIds.has(n.nodeId);
            const isSocket = socketSet.has(n.nodeId);
            // Use sprites for sockets, in-radius nodes, and pinned nodes
            const useSprite = spriteMap && (isSocket || isInRadius || pinnedNodes?.has(n.nodeId));

            return (
              <TreeNode
                key={n.nodeId}
                node={n}
                isSocket={isSocket}
                isSelectedSocket={n.nodeId === selectedSocket}
                isAffected={isAffected}
                isInRadius={isInRadius}
                isPinned={pinnedNodes?.has(n.nodeId) || false}
                hasResults={results !== null}
                onClick={handleNodeClick}
                onHover={setHoveredNode}
                spriteMap={useSprite ? spriteMap : null}
              />
            );
          })}

          {/* Labels for pinned nodes */}
          {visibleNodes.filter(n => pinnedNodes?.has(n.nodeId)).map(n => (
            <text
              key={`lbl-${n.nodeId}`}
              x={n.x}
              y={n.y - (CIRCLE_R[n.type] || 30) - 22}
              textAnchor="middle"
              fill={PINNED_COLOR}
              fontSize={34}
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {n.name}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

// ─── Sprite image helper ────────────────────────────────────────────────────

function SpriteImg({ sprite, worldSize }) {
  if (!sprite) return null;
  const scale = worldSize / Math.max(sprite.w, sprite.h);
  const dw = sprite.w * scale;
  const dh = sprite.h * scale;
  return (
    <foreignObject x={-dw / 2} y={-dh / 2} width={dw} height={dh} className="pointer-events-none">
      <div style={{
        width: dw,
        height: dh,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundImage: `url(${sprite.sheetUrl})`,
        backgroundPosition: `-${sprite.x * scale}px -${sprite.y * scale}px`,
        backgroundSize: `${sprite.sheetW * scale}px ${sprite.sheetH * scale}px`,
        backgroundRepeat: 'no-repeat',
      }} />
    </foreignObject>
  );
}

// ─── Individual tree node ───────────────────────────────────────────────────

const TreeNode = memo(function TreeNode({ node, isSocket, isSelectedSocket, isAffected, isInRadius, isPinned, hasResults, onClick, onHover, spriteMap }) {
  const { nodeId, x, y, type, icon } = node;
  const isClickable = isSocket || isInRadius;

  // Determine visual state for frame lookup
  let frameState = 'idle';
  if (isPinned || isSelectedSocket) frameState = 'allocated';
  else if (isAffected || isInRadius) frameState = 'path';

  const frameKey = TYPE_TO_FRAME_KEY[type];

  if (spriteMap && frameKey) {
    // ─── Sprite rendering ───
    const worldSize = SPRITE_SIZE[type] || 102;
    const frameName = FRAME_NAMES[frameKey]?.[frameState];
    const frameSprite = frameName ? spriteMap.frames[frameName] : null;
    const iconSprite = icon ? (spriteMap.inactive[icon] || spriteMap.active[icon]) : null;

    const opacity = !isSocket && !isInRadius && !isPinned && hasResults ? 0.2 : 1;

    return (
      <g
        transform={`translate(${x},${y})`}
        onClick={isClickable ? () => onClick(nodeId) : undefined}
        onMouseEnter={isClickable ? () => onHover(nodeId) : undefined}
        onMouseLeave={isClickable ? () => onHover(null) : undefined}
        style={isClickable ? { cursor: 'pointer' } : undefined}
        opacity={opacity}
      >
        {/* Frame */}
        <SpriteImg sprite={frameSprite} worldSize={worldSize} />
        {/* Icon */}
        <SpriteImg sprite={iconSprite} worldSize={worldSize * 0.65} />

        {/* Pinned ring overlay */}
        {isPinned && (
          <circle cx={0} cy={0} r={worldSize / 2 + 12} fill="none" stroke={PINNED_COLOR} strokeWidth={6} opacity={0.7} />
        )}
        {/* Selected socket ring */}
        {isSelectedSocket && (
          <circle cx={0} cy={0} r={worldSize / 2 + 16} fill="none" stroke="#fbbf24" strokeWidth={5} opacity={0.5} />
        )}

        {/* Hit area */}
        {isClickable && (
          <circle cx={0} cy={0} r={worldSize / 2 + 30} fill="transparent" />
        )}
      </g>
    );
  }

  // ─── Simple circle fallback (background nodes) ───
  const r = CIRCLE_R[type] || 30;
  const fill = isSocket ? '#fbbf24' : (NODE_COLORS[type] || '#52525b');
  const opacity = !isSocket && !isInRadius && !isPinned && hasResults ? 0.2 : 1;

  return (
    <g
      onClick={isSocket ? () => onClick(nodeId) : undefined}
      onMouseEnter={isSocket ? () => onHover(nodeId) : undefined}
      onMouseLeave={isSocket ? () => onHover(null) : undefined}
      style={isSocket ? { cursor: 'pointer' } : undefined}
      opacity={opacity}
    >
      <circle cx={x} cy={y} r={r} fill={fill} stroke={isSocket ? '#92400e' : 'none'} strokeWidth={isSocket ? 6 : 0} />
      {isSocket && <circle cx={x} cy={y} r={r + 40} fill="transparent" />}
    </g>
  );
});
