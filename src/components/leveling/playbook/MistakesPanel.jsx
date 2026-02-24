/**
 * MistakesPanel - Contextual warnings for current act
 *
 * @component
 */

import { useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} MistakesPanelProps
 * @property {number} actNumber - Act number to display mistakes for
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [showGlobal] - Show global common mistakes too
 */

export default function MistakesPanel({
  actNumber,
  className = '',
  showGlobal = false
}) {
  const { currentPlaybook } = usePlaybook();

  const actData = useMemo(() => {
    if (!currentPlaybook) return null;
    return currentPlaybook.acts.find(act => act.act === actNumber);
  }, [currentPlaybook, actNumber]);

  const actMistakes = actData?.mistakes || [];
  const globalMistakes = showGlobal ? (currentPlaybook?.commonMistakes || []) : [];

  if (actMistakes.length === 0 && globalMistakes.length === 0) {
    return (
      <div className={`text-center py-8 text-zinc-500 ${className}`}>
        No warnings for this act — smooth sailing.
      </div>
    );
  }

  return (
    <div className={`mistakes-panel ${className}`}>
      {/* Act-Specific Mistakes */}
      {actMistakes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span>
            <span>Common Mistakes - Act {actNumber}</span>
          </h3>

          <div className="space-y-3">
            {actMistakes.map(mistake => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                showCategory={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Global Common Mistakes */}
      {globalMistakes.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🚫</span>
            <span>General Anti-Patterns</span>
          </h3>

          <div className="space-y-3">
            {globalMistakes.map(mistake => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                showCategory={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * MistakeCard - Individual mistake card
 *
 * @typedef {Object} MistakeCardProps
 * @property {Object} mistake - Mistake data
 * @property {boolean} showCategory - Show category badge
 */
function MistakeCard({ mistake, showCategory }) {
  const severityConfig = {
    major: {
      color: 'border-red-500 bg-red-500/10',
      badgeColor: 'bg-red-500',
      icon: '🔴',
      label: 'MAJOR'
    },
    minor: {
      color: 'border-yellow-500 bg-yellow-500/10',
      badgeColor: 'bg-yellow-500',
      icon: '🟡',
      label: 'MINOR'
    }
  };

  const config = severityConfig[mistake.severity] || severityConfig.minor;

  const categoryLabels = {
    economy: '💰 Economy',
    combat: '⚔️ Combat',
    routing: '🗺️ Routing',
    defense: '🛡️ Defense',
    gearing: '⚙️ Gearing',
    gems: '💎 Gems',
    leveling: '📊 Leveling'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${config.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className={`px-2 py-0.5 text-xs font-bold text-white rounded ${config.badgeColor}`}>
            {config.label}
          </span>
          {showCategory && mistake.category && (
            <span className="px-2 py-0.5 text-xs bg-zinc-800/60 text-zinc-300 rounded">
              {categoryLabels[mistake.category] || mistake.category}
            </span>
          )}
        </div>

        {/* Video Timestamp */}
        {mistake.videoTimestamp && (
          <button
            onClick={() => {
              console.log('Open video at:', mistake.videoTimestamp);
            }}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>{mistake.videoTimestamp}</span>
          </button>
        )}
      </div>

      {/* Mistake Description */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-zinc-400 mb-1">
          MISTAKE
        </div>
        <div className="text-sm text-white">
          {mistake.mistake}
        </div>
      </div>

      {/* Why It's Bad */}
      <div className={`
        p-3 rounded
        ${mistake.severity === 'major' ? 'bg-red-900/20' : 'bg-yellow-900/20'}
      `}>
        <div className="text-xs font-semibold text-zinc-400 mb-1">
          WHY IT'S BAD
        </div>
        <div className="text-sm text-zinc-300">
          {mistake.why}
        </div>
      </div>

      {/* Fix (for global mistakes) */}
      {mistake.fix && (
        <div className="mt-3 p-3 bg-green-900/20 rounded">
          <div className="text-xs font-semibold text-green-400 mb-1">
            HOW TO FIX
          </div>
          <div className="text-sm text-zinc-300">
            {mistake.fix}
          </div>
        </div>
      )}
    </div>
  );
}
