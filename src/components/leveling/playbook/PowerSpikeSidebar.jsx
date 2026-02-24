/**
 * PowerSpikeSidebar - Timeline of power milestones
 *
 * @component
 */

import { useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} PowerSpikeSidebarProps
 * @property {string} [className] - Additional CSS classes
 * @property {number} [currentLevel] - Current character level (highlights relevant spikes)
 * @property {boolean} [showAll] - Show all spikes or only upcoming ones
 */

export default function PowerSpikeSidebar({
  className = '',
  currentLevel = 1,
  showAll = true
}) {
  const { currentPlaybook } = usePlaybook();

  const displayedSpikes = useMemo(() => {
    if (!currentPlaybook?.powerSpikes) return [];

    if (showAll) {
      return currentPlaybook.powerSpikes;
    }

    // Show current spike and next 3 upcoming spikes
    return currentPlaybook.powerSpikes.filter(
      spike => spike.level >= currentLevel && spike.level <= currentLevel + 10
    );
  }, [currentPlaybook, currentLevel, showAll]);

  if (!displayedSpikes.length) {
    return (
      <div className={`text-center py-8 text-zinc-500 ${className}`}>
        No power spikes available
      </div>
    );
  }

  return (
    <div className={`power-spike-sidebar ${className}`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>⚡</span>
        <span>Power Spikes</span>
      </h3>

      <div className="space-y-3">
        {displayedSpikes.map((spike, index) => {
          const isPassed = currentLevel > spike.level;
          const isCurrent = currentLevel === spike.level;
          const isUpcoming = currentLevel < spike.level;

          return (
            <PowerSpikeCard
              key={`${spike.level}-${index}`}
              spike={spike}
              isPassed={isPassed}
              isCurrent={isCurrent}
              isUpcoming={isUpcoming}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * PowerSpikeCard - Individual power spike card
 *
 * @typedef {Object} PowerSpikeCardProps
 * @property {Object} spike - Power spike data
 * @property {boolean} isPassed - Is this spike in the past
 * @property {boolean} isCurrent - Is this spike at current level
 * @property {boolean} isUpcoming - Is this spike in the future
 */
function PowerSpikeCard({ spike, isPassed, isCurrent, isUpcoming }) {
  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all
        ${isCurrent
          ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/20'
          : isPassed
            ? 'border-white/[0.06] bg-zinc-900/60 opacity-60'
            : 'border-blue-500/50 bg-blue-500/5'
        }
      `}
    >
      {/* Level Badge */}
      <div className={`
        absolute -top-2 -left-2 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
        ${isCurrent
          ? 'border-yellow-500 bg-yellow-500 text-black'
          : isPassed
            ? 'border-zinc-700 bg-zinc-800/60 text-zinc-400'
            : 'border-blue-500 bg-blue-500 text-white'
        }
      `}>
        {spike.level}
      </div>

      {/* Status Indicator */}
      <div className="mb-3 flex justify-end">
        {isCurrent && (
          <span className="px-2 py-0.5 text-xs font-bold bg-yellow-500 text-black rounded">
            NOW
          </span>
        )}
        {isPassed && (
          <span className="px-2 py-0.5 text-xs font-bold bg-zinc-700 text-zinc-300 rounded">
            PASSED
          </span>
        )}
        {isUpcoming && (
          <span className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded">
            UPCOMING
          </span>
        )}
      </div>

      {/* Spike Name */}
      <h4 className={`
        text-sm font-bold mb-2
        ${isPassed ? 'text-zinc-400' : 'text-white'}
      `}>
        {spike.spike}
      </h4>

      {/* Impact */}
      <p className={`
        text-xs mb-3
        ${isPassed ? 'text-zinc-500' : 'text-zinc-300'}
      `}>
        {spike.impact}
      </p>

      {/* Gear Requirements */}
      {spike.gear && spike.gear.length > 0 && (
        <div className="mb-2">
          <div className="text-xs font-semibold text-zinc-400 mb-1">
            Gear
          </div>
          <div className="flex flex-wrap gap-1">
            {spike.gear.map((item, idx) => (
              <span
                key={idx}
                className={`
                  px-2 py-0.5 text-xs rounded
                  ${isPassed
                    ? 'bg-zinc-800/60 text-zinc-500'
                    : 'bg-zinc-800/60 text-zinc-300'
                  }
                `}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gem Requirements */}
      {spike.gems && spike.gems.length > 0 && (
        <div className="mb-2">
          <div className="text-xs font-semibold text-zinc-400 mb-1">
            Gems
          </div>
          <div className="flex flex-wrap gap-1">
            {spike.gems.map((gem, idx) => (
              <span
                key={idx}
                className={`
                  px-2 py-0.5 text-xs rounded
                  ${isPassed
                    ? 'bg-zinc-800/60 text-zinc-500'
                    : 'bg-blue-900/50 text-blue-300'
                  }
                `}
              >
                {gem}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Video Timestamp Link */}
      {spike.videoTimestamp && (
        <button
          onClick={() => {
            // In real implementation, this would open video at timestamp
            console.log('Open video at:', spike.videoTimestamp);
          }}
          className={`
            text-xs flex items-center gap-1 transition-colors
            ${isPassed
              ? 'text-zinc-600 hover:text-zinc-500'
              : 'text-blue-400 hover:text-blue-300'
            }
          `}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>{spike.videoTimestamp}</span>
        </button>
      )}
    </div>
  );
}
