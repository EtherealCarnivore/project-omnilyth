/**
 * ZonePlaybookEnrichment
 *
 * Per-zone enrichment section shown inside ZoneCard when playbook mode is active.
 * Displays route objectives, boss strategies, and decision points with amber accent.
 * Collapsed by default. Returns null if no enrichment data exists.
 */

import { useState } from 'react';

export default function ZonePlaybookEnrichment({ enrichment }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!enrichment) return null;

  const { routeStep, boss, decisions, playbookName } = enrichment;

  return (
    <div className="mt-3 ml-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-amber-400/70 hover:text-amber-300 transition-colors group"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="truncate">Playbook: {playbookName}</span>
      </button>

      {isExpanded && (
        <div className="mt-2 border-l-2 border-amber-500/30 pl-3 space-y-3 animate-in fade-in duration-200">
          {/* Route Objective */}
          {routeStep && (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <svg className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-xs font-medium text-amber-400/80 uppercase tracking-wider">Route</span>
                {routeStep.skipMobs && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-700/50 text-zinc-400 whitespace-nowrap">Skip mobs</span>
                )}
                {!routeStep.skipMobs && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 whitespace-nowrap">Kill packs</span>
                )}
              </div>
              <p className="text-sm text-zinc-300 mt-1 break-words">{routeStep.objective}</p>
            </div>
          )}

          {/* Boss Strategy */}
          {boss && (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <svg className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.95l-7-12a2 2 0 00-3.5 0l-7 12A2 2 0 005.07 19z" />
                </svg>
                <span className="text-xs font-medium text-amber-400/80 uppercase tracking-wider truncate">Boss: {boss.name}</span>
                <span className={`
                  text-xs px-1.5 py-0.5 rounded whitespace-nowrap
                  ${boss.dangerLevel === 'high' ? 'bg-red-500/15 text-red-400' :
                    boss.dangerLevel === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-green-500/15 text-green-400'}
                `}>
                  {boss.dangerLevel}
                </span>
              </div>
              <p className="text-sm text-zinc-300 mt-1 break-words">{boss.strategy}</p>
            </div>
          )}

          {/* Decision Points */}
          {decisions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="text-xs font-medium text-amber-400/80 uppercase tracking-wider">Decisions</span>
              </div>
              {decisions.map(dp => (
                <div key={dp.id} className="bg-zinc-800/50 rounded p-2.5 mb-1.5 last:mb-0">
                  <p className="text-xs text-zinc-400 mb-1 break-words">IF: {dp.condition}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <div className="text-xs">
                      <span className="text-green-400 font-medium">Yes:</span>{' '}
                      <span className="text-zinc-300 break-words">{dp.ifTrue}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-red-400 font-medium">No:</span>{' '}
                      <span className="text-zinc-300 break-words">{dp.ifFalse}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
