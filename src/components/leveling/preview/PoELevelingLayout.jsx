/**
 * PoELevelingLayout
 * Layout inspired by poe-leveling.com
 * Style: Narrative, guide-style, step-by-step
 *
 * Characteristics:
 * - Story-like progression
 * - Integrated tips and objectives
 * - More contextual information
 * - Flowing, less rigid structure
 */

import { useState } from 'react';

export default function PoELevelingLayout({ data }) {
  const [expandedZones, setExpandedZones] = useState(new Set([data.areas[0]?.id]));
  const [completedZones, setCompletedZones] = useState(new Set());

  const toggleZone = (areaId) => {
    setExpandedZones(prev => {
      const next = new Set(prev);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      return next;
    });
  };

  const markZoneComplete = (areaId) => {
    setCompletedZones(prev => {
      const next = new Set(prev);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      return next;
    });
  };

  const isExpanded = (areaId) => expandedZones.has(areaId);
  const isCompleted = (areaId) => completedZones.has(areaId);

  return (
    <div className="space-y-4">
      {/* Act Header (Narrative Style) */}
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-2">Act {data.act} Guide</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Welcome to Act {data.act}! Follow this guide to efficiently progress through the story.
          Click on zones to expand and see detailed instructions.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-zinc-400">{data.areas.length} Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-zinc-400">{completedZones.size} Completed</span>
          </div>
        </div>
      </div>

      {/* Zone Cards (Story-like Progression) */}
      <div className="space-y-3">
        {data.areas.map((area, areaIndex) => (
          <div
            key={area.id}
            className={`bg-zinc-900/60 backdrop-blur-sm border rounded-lg overflow-hidden transition-all ${
              isCompleted(area.id)
                ? 'border-green-500/30 opacity-75'
                : isExpanded(area.id)
                  ? 'border-blue-500/30'
                  : 'border-white/[0.06] hover:border-blue-500/20'
            }`}
          >
            {/* Zone Header (Clickable) */}
            <button
              onClick={() => toggleZone(area.id)}
              className="w-full text-left px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Step Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCompleted(area.id)
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {areaIndex + 1}
                </div>

                {/* Zone Name */}
                <div>
                  <h3 className={`font-medium ${
                    isCompleted(area.id) ? 'text-zinc-500 line-through' : 'text-zinc-200'
                  }`}>
                    {area.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-600">Level {area.level}</span>
                    {area.hasWaypoint && (
                      <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        Waypoint
                      </span>
                    )}
                    {area.hasTrial && (
                      <span className="text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Trial: {area.trialType}
                      </span>
                    )}
                    {area.isOptional && (
                      <span className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded">
                        Optional
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expand/Collapse Icon */}
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform ${
                  isExpanded(area.id) ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Zone Details (Expandable) */}
            {isExpanded(area.id) && (
              <div className="border-t border-white/[0.06] px-4 py-4 space-y-4">
                {/* Objectives (Narrative Style) */}
                {area.objectives && area.objectives.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-2">What to do here:</h4>
                    <ul className="space-y-2">
                      {area.objectives.map((objective, objIndex) => (
                        <li key={objIndex} className="flex items-start gap-2 text-sm text-zinc-400">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                          </svg>
                          {objective.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips (Integrated) */}
                {area.tips && area.tips.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-blue-400 uppercase tracking-wide mb-2">Pro Tips</h4>
                    <ul className="space-y-2">
                      {area.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-zinc-400">
                          <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                          </svg>
                          {tip.content}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mark Complete Button */}
                <button
                  onClick={() => markZoneComplete(area.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCompleted(area.id)
                      ? 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700'
                      : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }`}
                >
                  {isCompleted(area.id) ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quest Summary (Integrated) */}
      {data.quests && data.quests.length > 0 && (
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Key Quests in Act {data.act}
          </h3>
          <div className="space-y-2">
            {data.quests.map(quest => (
              <div key={quest.id} className="flex items-start justify-between gap-4 text-sm">
                <div className="flex-1">
                  <div className="text-zinc-300 font-medium">{quest.name}</div>
                  {quest.rewards.passive && (
                    <div className="text-xs text-blue-400 mt-0.5">
                      Reward: {quest.rewards.skillPoints} Passive Point{quest.rewards.skillPoints !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          <strong>poe-leveling Style:</strong> Narrative, step-by-step guide with integrated tips. Good for storytelling.
        </p>
      </div>
    </div>
  );
}
