/**
 * ActPlaybookOverview
 *
 * Collapsible card showing act-level playbook data that doesn't map to individual zones:
 * gem progression, gear priorities, key quests, and time target.
 * Returns null when playbook mode is disabled or no playbook selected.
 */

import { useState, useMemo } from 'react';
import { usePlaybook } from '../../contexts/PlaybookContext';

export default function ActPlaybookOverview({ currentAct }) {
  const { playbookModeEnabled, currentPlaybook } = usePlaybook();
  const [isExpanded, setIsExpanded] = useState(false);

  const actData = useMemo(() => {
    if (!playbookModeEnabled || !currentPlaybook) return null;
    return currentPlaybook.acts.find(a => a.act === currentAct);
  }, [playbookModeEnabled, currentPlaybook, currentAct]);

  if (!actData) return null;

  const hasGems = actData.gems?.length > 0;
  const hasGear = actData.gear?.length > 0;
  const hasQuests = actData.quests?.length > 0;

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-amber-500/20 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-300 truncate">
              {currentPlaybook.name} — Act {currentAct}
            </p>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {actData.timeTarget && (
                <span className="text-xs text-zinc-500">Target: {actData.timeTarget}</span>
              )}
              {actData.levelRange && (
                <span className="text-xs text-zinc-500">
                  Lvl {actData.levelRange.enter}-{actData.levelRange.exit}
                </span>
              )}
            </div>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-in fade-in duration-200">
          {/* Gem Progression */}
          {hasGems && (
            <div>
              <h4 className="text-xs font-medium text-amber-400/80 uppercase tracking-wider mb-2">Gem Progression</h4>
              <div className="space-y-1.5">
                {actData.gems.map((gem, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap
                      ${gem.action === 'switch' ? 'bg-blue-500/15 text-blue-400' :
                        gem.action === 'add' ? 'bg-green-500/15 text-green-400' :
                        gem.action === 'prepare' ? 'bg-zinc-700/50 text-zinc-400' :
                        'bg-amber-500/15 text-amber-400'}
                    `}>
                      {gem.level ? `Lvl ${gem.level}` : 'When ready'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-zinc-300 break-words">
                        {gem.action === 'switch' ? 'Switch to ' : gem.action === 'add' ? 'Add ' : gem.action === 'prepare' ? 'Prepare ' : ''}
                        {gem.gems.join(', ')}
                      </span>
                      {gem.links?.[0] && gem.links[0] !== gem.gems[0] && (
                        <span className="text-zinc-500 text-xs ml-1.5 break-words">
                          ({gem.links.join(' + ')})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gear Priorities */}
          {hasGear && (
            <div>
              <h4 className="text-xs font-medium text-amber-400/80 uppercase tracking-wider mb-2">Gear Priorities</h4>
              <div className="space-y-1.5">
                {actData.gear.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 capitalize whitespace-nowrap
                      ${item.priority === 'critical' ? 'bg-red-500/15 text-red-400' :
                        item.priority === 'high' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-zinc-700/50 text-zinc-400'}
                    `}>
                      {item.slot}
                    </span>
                    <span className="text-zinc-300 break-words flex-1">{item.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Quests */}
          {hasQuests && (
            <div>
              <h4 className="text-xs font-medium text-amber-400/80 uppercase tracking-wider mb-2">Key Quests</h4>
              <div className="space-y-1.5">
                {actData.quests.map((quest, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className={`
                      w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5
                      ${quest.required ? 'bg-amber-400' : 'bg-zinc-600'}
                    `} />
                    <div className="min-w-0 flex-1">
                      <span className="text-zinc-300 break-words">{quest.name}</span>
                      <span className="text-zinc-500 text-xs ml-1.5 break-words">
                        {quest.reward} — {quest.timing}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
