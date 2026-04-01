/*
 * TimelessTreeView.jsx — Lightweight SVG passive tree for timeless jewel socket selection.
 *
 * Renders simplified nodes (circles) with zoom/pan. No sprite sheets.
 * Click a jewel socket to select it → shows 1800-unit radius and affected nodes.
 */

import { useMemo, useCallback, memo } from 'react';
import useZoomPan from '../hooks/useZoomPan';
import { PASSIVE_TYPE, getPassiveSkillType } from '../calculators/timelessJewel';

const JEWEL_RADIUS = 1800;

const ZOOM_CONFIG = {
  min: 0.01,
  max: 0.25,
  step: 0.15,
  default: 0.04,
  fitPadding: 40,
};

// Node visual sizes (world-space radius)
const NODE_R = {
  [PASSIVE_TYPE.SMALL_ATTRIBUTE]: 30,
  [PASSIVE_TYPE.SMALL_NORMAL]: 30,
  [PASSIVE_TYPE.NOTABLE]: 55,
  [PASSIVE_TYPE.KEYSTONE]: 80,
  [PASSIVE_TYPE.JEWEL_SOCKET]: 55,
};

// Node colors
const NODE_COLORS = {
  [PASSIVE_TYPE.SMALL_ATTRIBUTE]: '#52525b',
  [PASSIVE_TYPE.SMALL_NORMAL]: '#52525b',
  [PASSIVE_TYPE.NOTABLE]: '#71717a',
  [PASSIVE_TYPE.KEYSTONE]: '#a1a1aa',
  [PASSIVE_TYPE.JEWEL_SOCKET]: '#fbbf24',
};

// Colors when in jewel radius
const AFFECTED_COLORS = {
  [PASSIVE_TYPE.SMALL_ATTRIBUTE]: '#5eead4',
  [PASSIVE_TYPE.SMALL_NORMAL]: '#5eead4',
  [PASSIVE_TYPE.NOTABLE]: '#2dd4bf',
  [PASSIVE_TYPE.KEYSTONE]: '#f59e0b',
};

export default function TimelessTreeView({ treeData, selectedSocket, onSelectSocket, results, className }) {
  // Pre-process: collect renderable nodes + positions + connections
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
      // Skip cluster jewel sockets
      if (node.isJewelSocket && !isBasicSocket) continue;

      rn.push({ nodeId, x: pos.x, y: pos.y, type, name: node.name });
      if (isBasicSocket) ss.add(nodeId);

      // Connections (only outgoing to avoid duplicates)
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
    const width = b.maxX - b.minX;
    const height = b.maxY - b.minY;

    return {
      renderNodes: rn,
      connections: conns,
      bounds: { minX: b.minX, minY: b.minY, maxX: b.maxX, maxY: b.maxY, width, height },
      socketSet: ss,
    };
  }, [treeData]);

  // Zoom/pan
  const { containerRef, transform, handlers, fitToView, zoomIn, zoomOut } = useZoomPan(bounds, ZOOM_CONFIG);

  // Socket position for radius circle
  const socketPos = useMemo(() => {
    if (!selectedSocket || !treeData) return null;
    return treeData.positions[selectedSocket] || null;
  }, [selectedSocket, treeData]);

  // Set of affected node IDs (from results)
  const affectedNodeIds = useMemo(() => {
    if (!results) return new Set();
    return new Set(results.map(r => r.nodeId));
  }, [results]);

  // Node click handler
  const handleNodeClick = useCallback((nodeId) => {
    if (socketSet.has(nodeId)) {
      onSelectSocket(nodeId);
    }
  }, [socketSet, onSelectSocket]);

  // Viewport culling
  const { visibleNodes, visibleConns } = useMemo(() => {
    if (!bounds) return { visibleNodes: renderNodes, visibleConns: connections };
    const el = containerRef.current;
    if (!el || transform.scale === 0) return { visibleNodes: renderNodes, visibleConns: connections };

    const rect = el.getBoundingClientRect();
    const margin = 200; // px
    const invScale = 1 / transform.scale;
    const vMinX = (-transform.x - margin) * invScale;
    const vMaxX = (rect.width - transform.x + margin) * invScale;
    const vMinY = (-transform.y - margin) * invScale;
    const vMaxY = (rect.height - transform.y + margin) * invScale;

    const vn = renderNodes.filter(n => n.x >= vMinX && n.x <= vMaxX && n.y >= vMinY && n.y <= vMaxY);
    const vc = connections.filter(c =>
      (c.x1 >= vMinX && c.x1 <= vMaxX && c.y1 >= vMinY && c.y1 <= vMaxY) ||
      (c.x2 >= vMinX && c.x2 <= vMaxX && c.y2 >= vMinY && c.y2 <= vMaxY)
    );

    return { visibleNodes: vn, visibleConns: vc };
  }, [renderNodes, connections, transform, bounds, containerRef]);

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

      {/* Hint */}
      {!selectedSocket && (
        <div className="absolute bottom-2 left-2 z-10 px-2 py-1 rounded bg-zinc-900/90 border border-white/10 text-xs text-zinc-500">
          Click a yellow jewel socket to select it
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Connections layer */}
          <g opacity={0.15}>
            {visibleConns.map((c, i) => (
              <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#71717a" strokeWidth={12} />
            ))}
          </g>

          {/* Radius circle for selected socket */}
          {socketPos && (
            <circle
              cx={socketPos.x}
              cy={socketPos.y}
              r={JEWEL_RADIUS}
              fill="rgba(45, 212, 191, 0.04)"
              stroke="rgba(45, 212, 191, 0.25)"
              strokeWidth={8}
              strokeDasharray="40 20"
            />
          )}

          {/* Nodes layer */}
          {visibleNodes.map((n) => (
            <TreeNode
              key={n.nodeId}
              node={n}
              isSocket={socketSet.has(n.nodeId)}
              isSelectedSocket={n.nodeId === selectedSocket}
              isAffected={affectedNodeIds.has(n.nodeId)}
              hasResults={results !== null}
              onClick={handleNodeClick}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ─── Individual tree node (memoized) ────────────────────────────────────────

const TreeNode = memo(function TreeNode({ node, isSocket, isSelectedSocket, isAffected, hasResults, onClick }) {
  const { nodeId, x, y, type, name } = node;
  const r = NODE_R[type] || 30;

  let fill;
  if (isSelectedSocket) {
    fill = '#f59e0b'; // bright amber for selected socket
  } else if (isSocket) {
    fill = '#fbbf24'; // yellow for jewel sockets
  } else if (hasResults && isAffected) {
    fill = AFFECTED_COLORS[type] || '#5eead4';
  } else if (hasResults && !isAffected) {
    fill = '#27272a'; // very dim for unaffected when results shown
  } else {
    fill = NODE_COLORS[type] || '#52525b';
  }

  const opacity = hasResults && !isAffected && !isSocket ? 0.3 : 1;
  const strokeWidth = isSelectedSocket ? 12 : (isSocket ? 6 : 0);
  const stroke = isSelectedSocket ? '#f59e0b' : (isSocket ? '#92400e' : 'none');

  return (
    <g
      onClick={isSocket ? () => onClick(nodeId) : undefined}
      style={isSocket ? { cursor: 'pointer' } : undefined}
      opacity={opacity}
    >
      <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {/* Socket pulsing ring */}
      {isSelectedSocket && (
        <circle cx={x} cy={y} r={r + 20} fill="none" stroke="#fbbf24" strokeWidth={4} opacity={0.4} />
      )}
      {/* Hover hit area for sockets (larger) */}
      {isSocket && (
        <circle cx={x} cy={y} r={r + 40} fill="transparent" />
      )}
    </g>
  );
});
