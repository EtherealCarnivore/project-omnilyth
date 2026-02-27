/*
 * PassiveMinimap.jsx — Overview minimap showing the full tree with viewport rectangle.
 *
 * Fixed 140x140px display in bottom-left corner. Shows allocated nodes as colored dots,
 * with a viewport rectangle indicating current camera position.
 */

import { useMemo } from 'react';

const MINIMAP_SIZE = 140;

export default function PassiveMinimap({
  treeData,
  allocated,
  ascAllocated,
  transform,
  containerWidth,
  containerHeight,
}) {
  // Calculate minimap scale and positions
  const minimapData = useMemo(() => {
    if (!treeData?.positions || !treeData?.bounds) return null;

    const { bounds, positions } = treeData;
    const treeWidth = bounds.maxX - bounds.minX;
    const treeHeight = bounds.maxY - bounds.minY;

    // Scale to fit minimap
    const scale = (MINIMAP_SIZE - 20) / Math.max(treeWidth, treeHeight);

    // Convert world positions to minimap positions
    const dots = [];
    for (const [nodeId, pos] of Object.entries(positions)) {
      const x = (pos.x - bounds.minX) * scale + 10;
      const y = (pos.y - bounds.minY) * scale + 10;

      // Determine dot color
      let color = '#4a5568'; // gray for unallocated
      if (allocated?.has?.(nodeId)) {
        color = '#fbbf24'; // amber for allocated passive
      } else if (ascAllocated?.has?.(nodeId)) {
        color = '#ef4444'; // red for allocated ascendancy
      }

      dots.push({ x, y, color, nodeId });
    }

    return { scale, dots, treeWidth, treeHeight };
  }, [treeData, allocated, ascAllocated]);

  // Calculate viewport rectangle
  const viewportRect = useMemo(() => {
    if (!minimapData || !transform || !treeData?.bounds) return null;

    const { bounds } = treeData;
    const { scale: minimapScale, treeWidth, treeHeight } = minimapData;
    const { x, y, scale: viewScale } = transform;

    // Calculate visible area in world coordinates
    const viewWidth = containerWidth / viewScale;
    const viewHeight = containerHeight / viewScale;
    const viewCenterX = -x / viewScale;
    const viewCenterY = -y / viewScale;

    // Convert to minimap coordinates
    const viewX = ((viewCenterX - viewWidth / 2 - bounds.minX) * minimapScale) + 10;
    const viewY = ((viewCenterY - viewHeight / 2 - bounds.minY) * minimapScale) + 10;
    const viewW = (viewWidth * minimapScale);
    const viewH = (viewHeight * minimapScale);

    return { x: viewX, y: viewY, width: viewW, height: viewH };
  }, [minimapData, transform, containerWidth, containerHeight, treeData]);

  if (!minimapData) {
    return (
      <div
        className="fixed bottom-4 left-4 bg-gray-900 border-2 border-gray-700 rounded-lg
                   flex items-center justify-center"
        style={{ width: MINIMAP_SIZE, height: MINIMAP_SIZE }}
      >
        <div className="text-xs text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden"
      style={{ width: MINIMAP_SIZE, height: MINIMAP_SIZE }}
    >
      <svg width={MINIMAP_SIZE} height={MINIMAP_SIZE}>
        {/* Background grid */}
        <rect width={MINIMAP_SIZE} height={MINIMAP_SIZE} fill="#1a202c" />

        {/* Node dots - render allocated first, then unallocated */}
        {minimapData.dots
          .sort((a, b) => {
            // Sort so allocated nodes render on top
            const aAllocated = a.color !== '#4a5568';
            const bAllocated = b.color !== '#4a5568';
            if (aAllocated && !bAllocated) return 1;
            if (!aAllocated && bAllocated) return -1;
            return 0;
          })
          .map(dot => (
            <circle
              key={dot.nodeId}
              cx={dot.x}
              cy={dot.y}
              r={dot.color === '#4a5568' ? 0.8 : 1.2}
              fill={dot.color}
              opacity={dot.color === '#4a5568' ? 0.4 : 0.9}
            />
          ))}

        {/* Viewport rectangle */}
        {viewportRect && (
          <rect
            x={viewportRect.x}
            y={viewportRect.y}
            width={viewportRect.width}
            height={viewportRect.height}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={2}
            opacity={0.8}
          />
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-gray-900 bg-opacity-75 px-1 rounded">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <span>P</span>
          <div className="w-2 h-2 rounded-full bg-red-400 ml-1"></div>
          <span>A</span>
        </div>
      </div>
    </div>
  );
}
