/*
 * PassiveTooltip.jsx — Positioned tooltip that follows the mouse cursor.
 *
 * Shows node details on hover: name, type, stats, mastery selection status.
 * Uses fixed positioning with pointer-events-none to avoid interfering with mouse events.
 */

import { useState, useEffect } from 'react';
import { NODE_SIZES } from '../../data/passive/passiveTreeConstants';

/**
 * Type badge component for displaying node type
 */
function TypeBadge({ type }) {
  const typeConfig = {
    regular: { label: 'Small Passive', color: 'bg-gray-600' },
    notable: { label: 'Notable', color: 'bg-purple-600' },
    keystone: { label: 'Keystone', color: 'bg-amber-600' },
    mastery: { label: 'Mastery', color: 'bg-blue-600' },
    jewelSocket: { label: 'Jewel Socket', color: 'bg-green-600' },
    classStart: { label: 'Class Start', color: 'bg-slate-600' },
    ascendancyRegular: { label: 'Ascendancy Passive', color: 'bg-red-600' },
    ascendancyNotable: { label: 'Ascendancy Notable', color: 'bg-red-700' },
    ascendancyStart: { label: 'Ascendancy Start', color: 'bg-red-800' },
  };

  const config = typeConfig[type] || { label: type, color: 'bg-gray-600' };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${config.color} text-white`}>
      {config.label}
    </span>
  );
}

/**
 * Stats list component
 */
function StatsList({ stats, isAllocated }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`text-sm ${isAllocated ? 'text-amber-300' : 'text-blue-200'}`}
        >
          {stat}
        </div>
      ))}
    </div>
  );
}

/**
 * Mastery info component
 */
function MasteryInfo({ node, masterySelection }) {
  if (node.type !== 'mastery' && !node.masteryEffects) return null;

  const selectedEffect = masterySelection?.[node.id];

  return (
    <div className="mt-2">
      {selectedEffect ? (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-300">Selected Effect:</div>
          <div className="text-sm text-amber-300">{selectedEffect.effect}</div>
          {selectedEffect.stats && selectedEffect.stats.length > 0 && (
            <div className="ml-2 space-y-0.5">
              {selectedEffect.stats.map((stat, idx) => (
                <div key={idx} className="text-xs text-blue-200">{stat}</div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs italic text-gray-400">Click to choose mastery effect</div>
      )}
    </div>
  );
}

export default function PassiveTooltip({
  node,
  nodeId,
  type,
  isAllocated,
  containerRef,
  masterySelection,
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Offset tooltip to the right and below cursor
      const offsetX = 20;
      const offsetY = 20;

      let x = e.clientX + offsetX;
      let y = e.clientY + offsetY;

      // Prevent tooltip from going off-screen
      const tooltipWidth = 300; // Estimated width
      const tooltipHeight = 200; // Estimated max height

      if (x + tooltipWidth > window.innerWidth) {
        x = e.clientX - tooltipWidth - offsetX;
      }

      if (y + tooltipHeight > window.innerHeight) {
        y = e.clientY - tooltipHeight - offsetY;
      }

      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!node) return null;

  // Build stats array from node data
  const stats = node.stats || [];
  const displayName = node.name || `Node ${nodeId}`;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-3 shadow-2xl max-w-sm">
        {/* Node name */}
        <div className="font-bold text-white text-base mb-1">
          {displayName}
        </div>

        {/* Type badge */}
        <div className="mb-2">
          <TypeBadge type={type} />
        </div>

        {/* Stats */}
        <StatsList stats={stats} isAllocated={isAllocated} />

        {/* Mastery info */}
        <MasteryInfo node={node} masterySelection={masterySelection} />

        {/* Allocated indicator */}
        {isAllocated && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-xs font-semibold text-green-400">✓ Allocated</div>
          </div>
        )}
      </div>
    </div>
  );
}
