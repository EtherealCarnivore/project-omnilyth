/**
 * ActGearCheckpoints - Display gear upgrade priorities for current act
 *
 * @component
 */

import { useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} ActGearCheckpointsProps
 * @property {number} actNumber - Act number to display gear for
 * @property {string} [className] - Additional CSS classes
 */

export default function ActGearCheckpoints({ actNumber, className = '' }) {
  const { currentPlaybook } = usePlaybook();

  const actData = useMemo(() => {
    if (!currentPlaybook) return null;
    return currentPlaybook.acts.find(act => act.act === actNumber);
  }, [currentPlaybook, actNumber]);

  if (!actData?.gear?.length) {
    return (
      <div className={`text-center py-8 text-zinc-500 ${className}`}>
        No gear recommendations for this act
      </div>
    );
  }

  const priorityConfig = {
    critical: {
      color: 'border-red-500 bg-red-500/5',
      badge: 'bg-red-500 text-white',
      label: 'CRITICAL'
    },
    high: {
      color: 'border-orange-500 bg-orange-500/5',
      badge: 'bg-orange-500 text-white',
      label: 'HIGH'
    },
    medium: {
      color: 'border-yellow-500 bg-yellow-500/5',
      badge: 'bg-yellow-500 text-black',
      label: 'MEDIUM'
    },
    low: {
      color: 'border-zinc-700 bg-zinc-800/40',
      badge: 'bg-zinc-700 text-white',
      label: 'LOW'
    }
  };

  const slotIcons = {
    weapon: '⚔️',
    offhand: '🛡️',
    helmet: '⛑️',
    body: '🦺',
    gloves: '🧤',
    boots: '👢',
    belt: '🎗️',
    amulet: '📿',
    ring: '💍',
    quiver: '🏹',
    flasks: '🧪'
  };

  return (
    <div className={`act-gear-checkpoints ${className}`}>
      <div className="grid md:grid-cols-2 gap-4">
        {actData.gear.map((gearItem, index) => {
          const config = priorityConfig[gearItem.priority] || priorityConfig.low;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${config.color}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {slotIcons[gearItem.slot] || '⚙️'}
                  </span>
                  <div>
                    <div className="font-semibold text-white capitalize">
                      {gearItem.slot}
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded ${config.badge}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Stats */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-zinc-400 mb-1">
                  TARGET
                </div>
                <div className="text-sm text-white">
                  {gearItem.target}
                </div>
              </div>

              {/* Upgrade Timing */}
              <div className="p-2 bg-zinc-950/50 rounded">
                <div className="text-xs font-semibold text-zinc-400 mb-1">
                  WHEN TO UPGRADE
                </div>
                <div className="text-xs text-zinc-300">
                  {gearItem.upgrade}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
