/**
 * ActNavigation
 * Horizontal scrollable act selector with progress indicators
 * Shows Acts 1-10 with completion percentage
 */

import { useMemo } from 'react';
import { useLevelingProgress } from '../../contexts/LevelingProgressContext';

export default function ActNavigation({ currentAct, onSelectAct }) {
  const { completedZones, areas } = useLevelingProgress();

  // Calculate completion percentage for each act
  const actProgress = useMemo(() => {
    const progress = {};
    for (let act = 1; act <= 10; act++) {
      const actAreas = areas.filter(area => area.act === act && !area.isOptional);
      const completed = actAreas.filter(area => completedZones.includes(area.id)).length;
      progress[act] = actAreas.length > 0 ? Math.round((completed / actAreas.length) * 100) : 0;
    }
    return progress;
  }, [completedZones, areas]);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(act => {
          const isActive = currentAct === act;
          const progress = actProgress[act] || 0;
          const isComplete = progress === 100;

          return (
            <button
              key={act}
              onClick={() => onSelectAct(act)}
              className={`
                flex-shrink-0 px-4 py-3 rounded-lg transition-all
                ${isActive
                  ? 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-400'
                  : 'bg-zinc-800/40 border border-white/[0.04] text-zinc-400 hover:border-white/[0.08] hover:text-zinc-300'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium">
                  Act {act}
                </span>

                {/* Progress indicator */}
                <div className="flex items-center gap-1">
                  {isComplete ? (
                    <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : progress > 0 ? (
                    <span className="text-xs text-zinc-500">
                      {progress}%
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600">
                      0%
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
