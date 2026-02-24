/**
 * ActDecisionPoints - IF/THEN decision cards for current act
 *
 * @component
 */

import { useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} ActDecisionPointsProps
 * @property {number} actNumber - Act number to display decisions for
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [showBookmarked] - Only show bookmarked decisions
 */

export default function ActDecisionPoints({
  actNumber,
  className = '',
  showBookmarked = false
}) {
  const {
    currentPlaybook,
    toggleDecisionBookmark,
    isDecisionBookmarked
  } = usePlaybook();

  const actData = useMemo(() => {
    if (!currentPlaybook) return null;
    return currentPlaybook.acts.find(act => act.act === actNumber);
  }, [currentPlaybook, actNumber]);

  const decisions = useMemo(() => {
    if (!actData?.decisionPoints) return [];

    if (showBookmarked) {
      return actData.decisionPoints.filter(d => isDecisionBookmarked(d.id));
    }

    return actData.decisionPoints;
  }, [actData, showBookmarked, isDecisionBookmarked]);

  if (!decisions.length) {
    return (
      <div className={`text-center py-8 text-zinc-500 ${className}`}>
        {showBookmarked
          ? 'No bookmarked decisions for this act'
          : 'No decision points for this act'
        }
      </div>
    );
  }

  const priorityColors = {
    critical: 'border-red-500 bg-red-500/5',
    high: 'border-orange-500 bg-orange-500/5',
    medium: 'border-yellow-500 bg-yellow-500/5',
    low: 'border-zinc-700 bg-zinc-800/40'
  };

  const priorityLabels = {
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW'
  };

  return (
    <div className={`act-decision-points space-y-4 ${className}`}>
      {decisions.map(decision => {
        const isBookmarked = isDecisionBookmarked(decision.id);

        return (
          <div
            key={decision.id}
            className={`
              relative p-4 rounded-lg border-2 transition-all
              ${priorityColors[decision.priority]}
            `}
          >
            {/* Bookmark Button */}
            <button
              onClick={() => toggleDecisionBookmark(decision.id)}
              className={`
                absolute top-3 right-3 p-1.5 rounded-lg transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                ${isBookmarked
                  ? 'text-yellow-400 hover:text-yellow-300'
                  : 'text-zinc-600 hover:text-zinc-400'
                }
              `}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <svg
                className="w-5 h-5"
                fill={isBookmarked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>

            {/* Priority Badge */}
            <div className="mb-3">
              <span className={`
                inline-flex items-center px-2 py-1 text-xs font-bold rounded
                ${decision.priority === 'critical' ? 'bg-red-500 text-white' :
                  decision.priority === 'high' ? 'bg-orange-500 text-white' :
                  decision.priority === 'medium' ? 'bg-yellow-500 text-black' :
                  'bg-zinc-700 text-white'
                }
              `}>
                {priorityLabels[decision.priority]}
              </span>
            </div>

            {/* Condition */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-zinc-400 mb-1">
                IF
              </div>
              <div className="text-sm text-white">
                {decision.condition}
              </div>
            </div>

            {/* Outcomes */}
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              {/* If True */}
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                <div className="text-xs font-semibold text-green-400 mb-1">
                  THEN (TRUE)
                </div>
                <div className="text-sm text-white">
                  {decision.ifTrue}
                </div>
              </div>

              {/* If False */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <div className="text-xs font-semibold text-blue-400 mb-1">
                  ELSE (FALSE)
                </div>
                <div className="text-sm text-white">
                  {decision.ifFalse}
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-3 bg-zinc-950/50 rounded">
              <div className="text-xs font-semibold text-zinc-400 mb-1">
                BECAUSE
              </div>
              <div className="text-sm text-zinc-300">
                {decision.reasoning}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
