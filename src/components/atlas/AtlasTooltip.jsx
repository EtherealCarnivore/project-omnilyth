/*
 * AtlasTooltip.jsx — Hover tooltip for atlas tree nodes.
 *
 * Shows node name, type badge, and stat descriptions.
 * Positioned near the cursor, clamped to viewport edges.
 */

import { useEffect, useRef, useState } from 'react';

export default function AtlasTooltip({ node, nodeId, type, isAllocated, containerRef }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef?.current) return;

    function onMove(e) {
      const rect = containerRef.current.getBoundingClientRect();
      const tooltipEl = tooltipRef.current;
      const tw = tooltipEl?.offsetWidth || 200;
      const th = tooltipEl?.offsetHeight || 100;

      let x = e.clientX - rect.left + 16;
      let y = e.clientY - rect.top + 16;

      // Clamp to container
      if (x + tw > rect.width) x = e.clientX - rect.left - tw - 8;
      if (y + th > rect.height) y = rect.height - th - 8;
      if (y < 0) y = 8;

      setPos({ x, y });
    }

    containerRef.current.addEventListener('mousemove', onMove);
    return () => containerRef.current?.removeEventListener('mousemove', onMove);
  }, [containerRef]);

  if (!node || !node.name) return null;

  const typeBadge = {
    keystone: { text: 'Keystone', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
    notable: { text: 'Notable', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    regular: { text: 'Small', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
  }[type] || { text: '', color: '' };

  return (
    <div
      ref={tooltipRef}
      className="absolute z-50 pointer-events-none"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="bg-zinc-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 shadow-xl max-w-xs">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-zinc-100">{node.name}</span>
          {typeBadge.text && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${typeBadge.color}`}>
              {typeBadge.text}
            </span>
          )}
        </div>

        {/* Allocated indicator */}
        {isAllocated && (
          <div className="text-[10px] text-amber-400/70 mb-1">Allocated</div>
        )}

        {/* Stats */}
        {node.stats && node.stats.length > 0 && (
          <ul className="space-y-0.5">
            {node.stats.map((stat, i) => (
              <li key={i} className="text-xs text-zinc-300 leading-tight">
                {stat}
              </li>
            ))}
          </ul>
        )}

        {/* Flavour text (keystones) */}
        {node.flavourText && node.flavourText.length > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-white/5">
            {node.flavourText.map((text, i) => (
              <p key={i} className="text-[11px] text-zinc-500 italic leading-tight">{text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
