/**
 * ExileLevelingLayout
 * Layout inspired by exile-leveling (GitHub)
 * Style: Structured, table-based, clear sections
 *
 * Characteristics:
 * - Clean tabular design
 * - Checkbox-based objectives
 * - Separate sections for quests/zones
 * - Minimal narrative, more data-driven
 */

import { useState } from 'react';

export default function ExileLevelingLayout({ data }) {
  const [completedObjectives, setCompletedObjectives] = useState(new Set());

  const toggleObjective = (areaId, objectiveIndex) => {
    const key = `${areaId}-${objectiveIndex}`;
    setCompletedObjectives(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isCompleted = (areaId, objectiveIndex) => {
    return completedObjectives.has(`${areaId}-${objectiveIndex}`);
  };

  return (
    <div className="space-y-4">
      {/* Act Header */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Act {data.act}</h2>
            <p className="text-sm text-zinc-500 mt-0.5">{data.areas.length} zones</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round((Array.from(completedObjectives).length / (data.areas.length * 2)) * 100)}%
            </div>
            <div className="text-xs text-zinc-500">Complete</div>
          </div>
        </div>
      </div>

      {/* Zone List (Table-like) */}
      <div className="space-y-2">
        {data.areas.map((area, areaIndex) => (
          <div
            key={area.id}
            className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg overflow-hidden hover:border-purple-500/30 transition-colors"
          >
            {/* Zone Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 flex-1">
                {area.hasWaypoint && (
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
                <span className="font-medium text-zinc-200">{area.name}</span>
                {area.isOptional && (
                  <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded">Optional</span>
                )}
              </div>
              <div className="text-sm text-zinc-500">Lv. {area.level}</div>
            </div>

            {/* Objectives (Checkbox List) */}
            {area.objectives && area.objectives.length > 0 && (
              <div className="px-4 py-3 space-y-2">
                {area.objectives.map((objective, objIndex) => (
                  <label
                    key={objIndex}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isCompleted(area.id, objIndex)}
                      onChange={() => toggleObjective(area.id, objIndex)}
                      className="mt-0.5 w-4 h-4 rounded border-2 border-zinc-700 checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-colors"
                    />
                    <span className={`text-sm flex-1 transition-colors ${
                      isCompleted(area.id, objIndex)
                        ? 'text-zinc-600 line-through'
                        : 'text-zinc-400 group-hover:text-zinc-300'
                    }`}>
                      {objective.description}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Tips (Collapsible) */}
            {area.tips && area.tips.length > 0 && (
              <details className="border-t border-white/[0.06]">
                <summary className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  {area.tips.length} tip{area.tips.length !== 1 ? 's' : ''}
                </summary>
                <div className="px-4 pb-3 space-y-2">
                  {area.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span className="text-zinc-500">{tip.content}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* Quest List (Separate Section) */}
      {data.quests && data.quests.length > 0 && (
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Act {data.act} Quests</h3>
          <div className="space-y-2">
            {data.quests.map(quest => (
              <div key={quest.id} className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">{quest.name}</span>
                {quest.rewards.passive && (
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                    +{quest.rewards.skillPoints} SP
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style Info */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
        <p className="text-xs text-purple-300">
          <strong>exile-leveling Style:</strong> Structured, checkbox-driven, clear sections. Good for quick scanning.
        </p>
      </div>
    </div>
  );
}
