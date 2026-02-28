/*
 * AtlasDiffMinimap.jsx — Minimap for the diff view.
 *
 * Same as AtlasMinimap but uses AtlasDiffContext instead of AtlasTreeContext.
 * Shows diff-colored dots: green (add), red (remove), gold (match).
 */

import { useMemo } from 'react';
import { useAtlasDiff } from '../../contexts/AtlasDiffContext';
import { DIFF_COLORS } from '../../data/atlas/atlasTreeConstants';

const MINIMAP_SIZE = 140;

export default function AtlasDiffMinimap({ transform, containerWidth, containerHeight }) {
  const { treeData, diffResult } = useAtlasDiff();

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

      let color = '#4a5568'; // idle gray
      if (diffResult) {
        if (diffResult.toAdd.has(nodeId)) color = DIFF_COLORS.add;
        else if (diffResult.toRemove.has(nodeId)) color = DIFF_COLORS.remove;
        else if (diffResult.matching.has(nodeId)) color = DIFF_COLORS.match;
      }

      dots.push({
        x: (pos.x - bounds.minX) * scale + offsetX,
        y: (pos.y - bounds.minY) * scale + offsetY,
        color,
        type: meta.type,
      });
    }

    return { dots, scale, offsetX, offsetY, bounds };
  }, [treeData, diffResult]);

  if (!mapData || !containerWidth || !containerHeight) return null;

  const { scale: mapScale, offsetX, offsetY, bounds } = mapData;
  const viewX = (-transform.x / transform.scale - bounds.minX) * mapScale + offsetX;
  const viewY = (-transform.y / transform.scale - bounds.minY) * mapScale + offsetY;
  const viewW = (containerWidth / transform.scale) * mapScale;
  const viewH = (containerHeight / transform.scale) * mapScale;

  return (
    <div className="absolute top-4 right-4 bg-zinc-900/90 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
      <svg width={MINIMAP_SIZE} height={MINIMAP_SIZE} className="block">
        <rect width={MINIMAP_SIZE} height={MINIMAP_SIZE} fill="#0a0a0f" />
        {mapData.dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x} cy={dot.y}
            r={dot.type === 'keystone' ? 2.5 : dot.type === 'notable' ? 2 : 1.2}
            fill={dot.color}
          />
        ))}
        <rect
          x={viewX} y={viewY} width={viewW} height={viewH}
          fill="none" stroke="#5a8aaa" strokeWidth={1} opacity={0.7} rx={1}
        />
      </svg>
    </div>
  );
}
