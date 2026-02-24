/*
 * AtlasMinimap.jsx — Small overview showing the full tree with viewport indicator.
 *
 * Shows all nodes as dots in a small fixed-size box. A rectangle indicates
 * what portion of the tree is currently visible in the main viewport.
 */

import { useMemo } from 'react';
import { useAtlasTree } from '../../contexts/AtlasTreeContext';

const MINIMAP_SIZE = 140;

export default function AtlasMinimap({ transform, containerWidth, containerHeight }) {
  const { treeData, allocated } = useAtlasTree();

  const mapData = useMemo(() => {
    if (!treeData) return null;
    const { bounds, positions, nodeMeta } = treeData;

    const padding = 10;
    const scaleX = (MINIMAP_SIZE - padding * 2) / bounds.width;
    const scaleY = (MINIMAP_SIZE - padding * 2) / bounds.height;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = padding + (MINIMAP_SIZE - padding * 2 - bounds.width * scale) / 2;
    const offsetY = padding + (MINIMAP_SIZE - padding * 2 - bounds.height * scale) / 2;

    const dots = [];
    for (const [nodeId, pos] of Object.entries(positions)) {
      if (nodeId === 'root') continue;
      const meta = nodeMeta[nodeId];
      if (!meta || meta.type === 'mastery') continue;

      dots.push({
        x: (pos.x - bounds.minX) * scale + offsetX,
        y: (pos.y - bounds.minY) * scale + offsetY,
        allocated: allocated.has(nodeId),
        type: meta.type,
      });
    }

    return { dots, scale, offsetX, offsetY, bounds };
  }, [treeData, allocated]);

  if (!mapData || !containerWidth || !containerHeight) return null;

  // Viewport rectangle in minimap coords
  const { scale: mapScale, offsetX, offsetY, bounds } = mapData;
  const viewX = (-transform.x / transform.scale - bounds.minX) * mapScale + offsetX;
  const viewY = (-transform.y / transform.scale - bounds.minY) * mapScale + offsetY;
  const viewW = (containerWidth / transform.scale) * mapScale;
  const viewH = (containerHeight / transform.scale) * mapScale;

  return (
    <div className="absolute top-4 right-4 bg-zinc-900/90 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
      <svg width={MINIMAP_SIZE} height={MINIMAP_SIZE} className="block">
        {/* Background */}
        <rect width={MINIMAP_SIZE} height={MINIMAP_SIZE} fill="#0a0a0f" />

        {/* Node dots */}
        {mapData.dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.type === 'keystone' ? 2.5 : dot.type === 'notable' ? 2 : 1.2}
            fill={dot.allocated ? '#fbbf24' : '#4a5568'}
          />
        ))}

        {/* Viewport indicator */}
        <rect
          x={viewX}
          y={viewY}
          width={viewW}
          height={viewH}
          fill="none"
          stroke="#5a8aaa"
          strokeWidth={1}
          opacity={0.7}
          rx={1}
        />
      </svg>
    </div>
  );
}
