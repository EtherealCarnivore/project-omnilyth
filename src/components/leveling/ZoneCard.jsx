/**
 * ZoneCard
 * Individual zone display with objectives, tips, and vendor recipes
 * Supports checkbox-based progress tracking with Fresh/Alt mode filtering
 */

import { useState } from 'react';
import { useLevelingProgress } from '../../contexts/LevelingProgressContext';

export default function ZoneCard({ area }) {
  const { mode, completedZones, completedObjectives, toggleZone, toggleObjective } = useLevelingProgress();
  const [showTips, setShowTips] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);

  const isZoneComplete = completedZones.includes(area.id);

  // Filter tips based on mode
  const visibleTips = mode === 'fresh'
    ? area.tips
    : area.tips.filter(tip => !tip.freshOnly);

  // Show recipes only in fresh mode
  const visibleRecipes = mode === 'fresh' ? area.craftingRecipes : [];

  // Check if all objectives are complete
  const allObjectivesComplete = area.objectives.every(obj =>
    completedObjectives.includes(`${area.id}-${obj.description}`)
  );

  return (
    <div
      className={`
        bg-zinc-900/60 backdrop-blur-sm border rounded-lg p-4 transition-all
        ${isZoneComplete
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-white/[0.06] hover:border-white/[0.08]'
        }
      `}
    >
      {/* Zone Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Completion Checkbox */}
          <button
            onClick={() => toggleZone(area.id)}
            className="mt-0.5 flex-shrink-0"
            aria-label={`Mark ${area.name} as ${isZoneComplete ? 'incomplete' : 'complete'}`}
          >
            <div
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                ${isZoneComplete
                  ? 'bg-green-500 border-green-500'
                  : 'border-zinc-600 hover:border-zinc-500'
                }
              `}
            >
              {isZoneComplete && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>

          {/* Zone Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-medium text-zinc-200">
                {area.name}
              </h3>

              {/* Zone Badges */}
              <div className="flex items-center gap-2 text-xs">
                {area.hasWaypoint && (
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Waypoint
                  </span>
                )}
                {area.isOptional && (
                  <span className="px-2 py-0.5 rounded bg-zinc-700/50 text-zinc-400 border border-zinc-600/50">
                    Optional
                  </span>
                )}
                <span className="text-zinc-500">
                  Level {area.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objectives */}
      {area.objectives && area.objectives.length > 0 && (
        <div className="space-y-2 ml-8">
          {area.objectives.map((objective, idx) => {
            const objectiveId = `${area.id}-${objective.description}`;
            const isComplete = completedObjectives.includes(objectiveId);

            return (
              <div key={idx} className="flex items-start gap-2">
                <button
                  onClick={() => toggleObjective(objectiveId)}
                  className="mt-0.5 flex-shrink-0"
                  aria-label={`Mark objective "${objective.description}" as ${isComplete ? 'incomplete' : 'complete'}`}
                >
                  <div
                    className={`
                      w-4 h-4 rounded border flex items-center justify-center transition-colors
                      ${isComplete
                        ? 'bg-green-500 border-green-500'
                        : 'border-zinc-600 hover:border-zinc-500'
                      }
                    `}
                  >
                    {isComplete && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isComplete ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                    {objective.description}
                  </p>
                  {objective.reward && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Reward: {objective.reward}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      {visibleTips.length > 0 && (
        <div className="mt-3 ml-8">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showTips ? 'rotate-90' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span>{visibleTips.length} {visibleTips.length === 1 ? 'Tip' : 'Tips'}</span>
          </button>

          {showTips && (
            <div className="mt-2 space-y-2">
              {visibleTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 mt-0.5">💡</span>
                  <p className="text-zinc-400 flex-1">{tip.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Crafting Recipes Section (Fresh Mode Only) */}
      {visibleRecipes.length > 0 && (
        <div className="mt-3 ml-8">
          <button
            onClick={() => setShowRecipes(!showRecipes)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showRecipes ? 'rotate-90' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span>{visibleRecipes.length} {visibleRecipes.length === 1 ? 'Recipe' : 'Recipes'}</span>
          </button>

          {showRecipes && (
            <div className="mt-2 space-y-2">
              {visibleRecipes.map((recipe, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-500 mt-0.5">⚗️</span>
                  <p className="text-zinc-400 flex-1">{recipe}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
