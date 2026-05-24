/**
 * Poe2ZoneCard — lean zone row for the PoE 2 Leveling Mode.
 *
 * Deliberately NOT the PoE 1 ZoneCard: that one couples to PoE 1 playbook
 * enrichment + assumes `craftingRecipes` (which PoE 2 zones don't have).
 * This mirrors the visual pattern (checkbox, badges, objectives, tips) but is
 * self-contained and prop-driven — no PoE 1 context/data deps.
 */
import { useState } from 'react';

export default function Poe2ZoneCard({ zone, rewardTags = [], isComplete, completedObjectives, onToggleZone, onToggleObjective, mode }) {
  const [showTips, setShowTips] = useState(false);

  const tips = zone.tips || [];
  const visibleTips = mode === 'fresh' ? tips : tips.filter((t) => !t.freshOnly);
  const objectives = zone.objectives || [];
  const bosses = zone.bosses || [];

  // Card-level left accent, colored by the highest-priority reward present
  // (rewardTags is pre-sorted Spirit→Passive). Yields to the green complete state.
  const topReward = rewardTags[0]?.type;
  const accentBorder = isComplete
    ? ''
    : topReward === 'spirit'
    ? 'border-l-2 border-l-violet-500/70'
    : topReward === 'passive'
    ? 'border-l-2 border-l-lime-500/70'
    : '';

  return (
    <div className={`bg-zinc-900/60 backdrop-blur-sm border rounded-lg p-4 transition-all ${accentBorder} ${
      isComplete ? 'border-green-500/30 bg-green-500/5' : 'border-white/[0.06] hover:border-white/[0.08]'
    }`}>
      <div className="flex items-start gap-3">
        {/* Zone completion */}
        <button
          onClick={() => onToggleZone(zone.id)}
          className="mt-0.5 flex-shrink-0"
          aria-label={`Mark ${zone.name} as ${isComplete ? 'incomplete' : 'complete'}`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isComplete ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-zinc-500'
          }`}>
            {isComplete && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`text-base font-medium ${isComplete ? 'text-zinc-400' : 'text-zinc-200'}`}>{zone.name}</h3>
            <div className="flex items-center gap-1.5 text-xs">
              {/* Spirit / Passive reward chips lead the row — highest-stakes signal */}
              {rewardTags.map((tag) => {
                const isSpirit = tag.type === 'spirit';
                const live = isSpirit
                  ? 'bg-violet-600 text-white ring-1 ring-violet-400/60 shadow-[0_0_8px_-1px] shadow-violet-500/50'
                  : 'bg-lime-500/90 text-lime-950';
                const done = isSpirit
                  ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
                  : 'bg-lime-500/15 text-lime-300';
                return (
                  <span
                    key={tag.type}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${isComplete ? done : live}`}
                  >
                    <span aria-hidden="true">{isSpirit ? '✦' : '◆'}</span>
                    <span className="sr-only">Reward: </span>
                    <span>{tag.label || tag.value}</span>
                  </span>
                );
              })}
              {zone.isTown && (
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400/90 border border-amber-500/25">Town</span>
              )}
              {zone.hasWaypoint && (
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">Waypoint</span>
              )}
              {zone.isOptional && (
                <span className="px-2 py-0.5 rounded bg-zinc-700/50 text-zinc-400 border border-zinc-600/50">Optional</span>
              )}
              {typeof zone.level === 'number' && <span className="text-zinc-500">Level {zone.level}</span>}
            </div>
          </div>

          {bosses.length > 0 && (
            <p className="text-xs text-rose-300/80 mt-1">Boss: {bosses.join(', ')}</p>
          )}

          {/* Objectives */}
          {objectives.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {objectives.map((obj, idx) => {
                const objId = `${zone.id}::${idx}`;
                const done = completedObjectives.includes(objId);
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <button
                      onClick={() => onToggleObjective(objId)}
                      className="mt-0.5 flex-shrink-0"
                      aria-label={`Mark objective "${obj.description}" as ${done ? 'incomplete' : 'complete'}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        done ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-zinc-500'
                      }`}>
                        {done && (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                    <p className={`text-sm flex-1 ${done ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>{obj.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tips */}
          {visibleTips.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${showTips ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span>{visibleTips.length} {visibleTips.length === 1 ? 'tip' : 'tips'}</span>
              </button>
              {showTips && (
                <div className="mt-2 space-y-1.5">
                  {visibleTips.map((tip, idx) => (
                    <p key={idx} className="text-sm text-zinc-400 pl-5 break-words">{tip.content}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
