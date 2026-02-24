/**
 * ActBossNotes - Display boss strategies for current act
 *
 * @component
 */

import { useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} ActBossNotesProps
 * @property {number} actNumber - Act number to display bosses for
 * @property {string} [className] - Additional CSS classes
 */

export default function ActBossNotes({ actNumber, className = '' }) {
  const { currentPlaybook } = usePlaybook();

  const actData = useMemo(() => {
    if (!currentPlaybook) return null;
    return currentPlaybook.acts.find(act => act.act === actNumber);
  }, [currentPlaybook, actNumber]);

  if (!actData?.bosses?.length) {
    return (
      <div className={`text-center py-8 text-zinc-500 ${className}`}>
        No boss information for this act
      </div>
    );
  }

  const difficultyConfig = {
    easy: {
      color: 'border-green-500 bg-green-500/5',
      badge: 'bg-green-500 text-white',
      icon: '✓'
    },
    medium: {
      color: 'border-yellow-500 bg-yellow-500/5',
      badge: 'bg-yellow-500 text-black',
      icon: '!'
    },
    hard: {
      color: 'border-red-500 bg-red-500/5',
      badge: 'bg-red-500 text-white',
      icon: '⚠'
    }
  };

  const dangerConfig = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  return (
    <div className={`act-boss-notes space-y-4 ${className}`}>
      {actData.bosses.map((boss, index) => {
        const config = difficultyConfig[boss.difficulty] || difficultyConfig.medium;
        const dangerColor = dangerConfig[boss.dangerLevel] || dangerConfig.medium;

        return (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${config.color}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">
                    {boss.name}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${config.badge}`}>
                    {config.icon} {boss.difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-zinc-400">
                    Level {boss.level}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className={`font-medium ${dangerColor}`}>
                    {(boss.dangerLevel || 'unknown').toUpperCase()} DANGER
                  </span>
                </div>
              </div>

              {/* Video Timestamp */}
              {boss.videoTimestamp && (
                <button
                  onClick={() => {
                    console.log('Open video at:', boss.videoTimestamp);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{boss.videoTimestamp}</span>
                </button>
              )}
            </div>

            {/* Strategy */}
            <div className="p-3 bg-zinc-950/50 rounded">
              <div className="text-xs font-semibold text-zinc-400 mb-2">
                STRATEGY
              </div>
              <div className="text-sm text-white">
                {boss.strategy}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
