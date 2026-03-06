/**
 * CompactGemPanel
 * Always-visible right sidebar gem panel for the leveling mode three-column layout.
 * Shows gems filtered by current act with compact checklist items.
 * Supports auto-import from active playbooks.
 *
 * Design: Optimized for dual-monitor "glance" UX — unobtained gems are prominent,
 * obtained gems are collapsible, progress is always visible at the bottom.
 */
import { useState } from 'react';
import { useLevelingPlan } from '../../contexts/LevelingPlanContext';
import { usePlaybook } from '../../contexts/PlaybookContext';
import { buildGemPlanFromPlaybook } from '../../utils/playbookGemParser';
import { gemAvailabilityData } from '../../data/leveling/gemAvailability';
import { Link } from 'react-router-dom';

export default function CompactGemPanel({ currentAct = 1 }) {
  const { gems, toggleObtained, stats, importFromPlaybook } = useLevelingPlan();
  const { currentPlaybook } = usePlaybook();
  const [hideObtained, setHideObtained] = useState(false);
  const [showReloadConfirm, setShowReloadConfirm] = useState(false);

  const handleImportFromPlaybook = () => {
    if (!currentPlaybook) return;
    const { gems: parsedGems, linkGroups } = buildGemPlanFromPlaybook(currentPlaybook, gemAvailabilityData);
    importFromPlaybook(parsedGems, linkGroups, currentPlaybook.class);
    setShowReloadConfirm(false);
  };

  // Split gems into current-act relevant groups
  const unobtainedGems = gems.filter(gem => {
    if (gem.obtained) return false;
    const gemAct = gem.act || 10;
    return gemAct <= currentAct;
  });

  const upcomingGems = gems.filter(gem => {
    if (gem.obtained) return false;
    const gemAct = gem.act || 10;
    return gemAct === currentAct + 1;
  });

  const obtainedGems = gems.filter(gem => gem.obtained);

  // Empty state — no plan yet
  if (gems.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/5">
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Gem Plan
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <svg className="w-10 h-10 text-zinc-700 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <p className="text-xs text-zinc-500">No gem plan yet</p>
            {currentPlaybook && (
              <button
                onClick={handleImportFromPlaybook}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 hover:bg-emerald-500/20 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Load from Playbook
              </button>
            )}
            <Link
              to="/leveling/planner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-400/20 text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              Create Plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Gems: Act {currentAct}
          </h2>
          <div className="flex items-center gap-1.5">
            {currentPlaybook && (
              <button
                onClick={() => {
                  if (showReloadConfirm) {
                    handleImportFromPlaybook();
                  } else {
                    setShowReloadConfirm(true);
                  }
                }}
                onBlur={() => setShowReloadConfirm(false)}
                className={`p-1 rounded transition-colors ${
                  showReloadConfirm ? 'bg-red-500/20 hover:bg-red-500/30' : 'hover:bg-white/5'
                }`}
                title={showReloadConfirm ? 'Click again to confirm reload' : 'Reload from playbook'}
              >
                <svg className={`w-3.5 h-3.5 ${showReloadConfirm ? 'text-red-400' : 'text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </button>
            )}
            <Link
              to="/leveling/planner"
              className="p-1 rounded hover:bg-white/5 transition-colors"
              title="Edit plan"
            >
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Gem List — scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Unobtained — need to get */}
        {unobtainedGems.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-emerald-400 mb-2 px-1">
              Need to Obtain ({unobtainedGems.length})
            </h3>
            <div className="space-y-1">
              {unobtainedGems.map(gem => (
                <CompactGemItem key={gem.name} gem={gem} onToggle={toggleObtained} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming — next act */}
        {upcomingGems.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-amber-400/60 mb-2 px-1">
              Coming in Act {currentAct + 1} ({upcomingGems.length})
            </h3>
            <div className="space-y-1 opacity-50">
              {upcomingGems.map(gem => (
                <CompactGemItem key={gem.name} gem={gem} onToggle={toggleObtained} disabled />
              ))}
            </div>
          </div>
        )}

        {/* Obtained — collapsible */}
        {obtainedGems.length > 0 && (
          <div>
            <button
              onClick={() => setHideObtained(!hideObtained)}
              className="flex items-center justify-between w-full text-xs font-medium text-zinc-500 hover:text-zinc-400 mb-2 px-1"
            >
              <span>Already Have ({obtainedGems.length})</span>
              <svg
                className={`w-3 h-3 transition-transform ${hideObtained ? '-rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {!hideObtained && (
              <div className="space-y-1 opacity-50">
                {obtainedGems.map(gem => (
                  <CompactGemItem key={gem.name} gem={gem} onToggle={toggleObtained} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* All caught up */}
        {unobtainedGems.length === 0 && upcomingGems.length === 0 && obtainedGems.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-8 h-8 text-emerald-500/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-emerald-400">All caught up!</p>
          </div>
        )}
      </div>

      {/* Footer — progress */}
      {stats.total > 0 && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span>Progress</span>
            <span className="font-mono">{stats.obtained}/{stats.total}</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Escape hatch */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-white/5">
        <Link
          to="/leveling/gems"
          className="block text-center text-xs text-amber-500 hover:text-amber-400 transition-colors"
        >
          View All Gems
        </Link>
      </div>
    </div>
  );
}

/**
 * Ultra-compact gem checklist item for the sidebar panel.
 * Optimized for glance-ability: icon + name + color dots + checkbox.
 */
function CompactGemItem({ gem, onToggle, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onToggle(gem.name)}
      disabled={disabled}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left ${
        disabled
          ? 'cursor-default'
          : gem.obtained
          ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
          : 'bg-zinc-800/30 hover:bg-zinc-800/60'
      }`}
    >
      {/* Checkbox */}
      {!disabled && (
        <div
          className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            gem.obtained
              ? 'bg-emerald-500 border-emerald-400'
              : 'border-zinc-600'
          }`}
        >
          {gem.obtained && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      )}

      {/* Gem icon */}
      {gem.icon ? (
        <img
          src={gem.icon}
          alt=""
          className="w-6 h-6 rounded border border-white/10 shrink-0"
        />
      ) : (
        <div className="w-6 h-6 rounded border border-white/10 bg-zinc-800 flex items-center justify-center shrink-0">
          <span className="text-[10px] text-zinc-600">?</span>
        </div>
      )}

      {/* Name */}
      <span className={`flex-1 text-xs truncate leading-tight ${
        gem.obtained ? 'text-zinc-600 line-through' : 'text-zinc-200'
      }`}>
        {gem.name}
      </span>

      {/* Color dots */}
      {gem.colors && !gem.obtained && (
        <div className="flex gap-0.5 shrink-0">
          {gem.colors.split('').map((color, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                color === 'R' ? 'bg-red-400/70' :
                color === 'G' ? 'bg-green-400/70' :
                'bg-blue-400/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Source hint */}
      {!gem.obtained && !disabled && gem.source && gem.source !== 'unknown' && (
        <span className="text-[10px] text-zinc-600 shrink-0">
          {gem.source === 'quest' ? `A${gem.act}` :
           gem.source === 'siosa' ? 'S' :
           gem.source === 'lilly' ? 'L' : ''}
        </span>
      )}
    </button>
  );
}
