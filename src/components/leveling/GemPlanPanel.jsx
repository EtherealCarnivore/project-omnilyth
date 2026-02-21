/**
 * GemPlanPanel
 * Shows your planned gems in the leveling mode page
 * Filters by current act and shows only relevant gems
 */
import { useState } from 'react';
import { useLevelingPlan } from '../../contexts/LevelingPlanContext';
import { Link } from 'react-router-dom';

export default function GemPlanPanel({ currentAct = 1 }) {
  const { gems, toggleObtained, stats } = useLevelingPlan();
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter gems relevant to current act
  const relevantGems = gems.filter(gem => {
    // Show if:
    // 1. Not obtained yet
    // 2. Available in current act or earlier
    if (gem.obtained) return false;

    const gemAct = gem.act || 10;
    return gemAct <= currentAct;
  });

  const upcomingGems = gems.filter(gem => {
    if (gem.obtained) return false;
    const gemAct = gem.act || 10;
    return gemAct === currentAct + 1;
  });

  if (gems.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 border border-dashed border-white/10">
        <div className="text-center space-y-3">
          <svg className="w-12 h-12 text-zinc-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          <div>
            <p className="text-sm text-zinc-400 font-medium">No Gem Plan Yet</p>
            <p className="text-xs text-zinc-600 mt-1">
              Create a leveling plan to track your gems
            </p>
          </div>
          <Link
            to="/leveling/planner"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/10 border border-amber-400/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-white/5">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-white/5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between hover:text-amber-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-zinc-200">Your Gem Plan</h3>
              <p className="text-xs text-zinc-500">
                {stats.obtained}/{stats.total} obtained ({stats.progress}%)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/leveling/planner"
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="Edit plan"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </Link>
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Current Act Gems */}
          {relevantGems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Available Now (Act {currentAct})
              </h4>
              <div className="space-y-1.5">
                {relevantGems.map(gem => (
                  <GemChecklistItem key={gem.name} gem={gem} toggleObtained={toggleObtained} />
                ))}
              </div>
            </div>
          )}

          {/* Next Act Preview */}
          {upcomingGems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-amber-400/60 uppercase tracking-wider">
                Coming in Act {currentAct + 1}
              </h4>
              <div className="space-y-1.5 opacity-60">
                {upcomingGems.map(gem => (
                  <GemChecklistItem key={gem.name} gem={gem} toggleObtained={toggleObtained} disabled />
                ))}
              </div>
            </div>
          )}

          {relevantGems.length === 0 && upcomingGems.length === 0 && (
            <div className="text-center py-6">
              <svg className="w-10 h-10 text-emerald-500/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-emerald-400 font-medium">All caught up!</p>
              <p className="text-xs text-zinc-500 mt-1">
                No gems needed for Act {currentAct}
              </p>
            </div>
          )}

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span>Progress</span>
                <span>{stats.obtained}/{stats.total}</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GemChecklistItem({ gem, toggleObtained, disabled }) {
  return (
    <button
      onClick={() => !disabled && toggleObtained(gem.name)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
        disabled
          ? 'cursor-default'
          : gem.obtained
          ? 'bg-emerald-500/5 border border-emerald-400/20'
          : 'bg-zinc-900/40 border border-white/5 hover:border-white/10 hover:bg-zinc-900/60'
      }`}
    >
      {/* Checkbox */}
      {!disabled && (
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            gem.obtained
              ? 'bg-emerald-500 border-emerald-400'
              : 'border-zinc-600'
          }`}
        >
          {gem.obtained && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      )}

      {/* Gem icon */}
      <img
        src={gem.icon}
        alt={gem.name}
        className="w-7 h-7 rounded border border-white/10"
      />

      {/* Gem info */}
      <div className="flex-1 min-w-0 text-left">
        <p className={`text-sm truncate ${gem.obtained ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
          {gem.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {gem.colors && (
            <span className="font-mono">{gem.colors}</span>
          )}
          {gem.source === 'quest' && (
            <>
              <span>•</span>
              <span className="truncate">{gem.questName}</span>
            </>
          )}
          {gem.source === 'siosa' && <span>Siosa</span>}
          {gem.source === 'lilly' && <span>Lilly</span>}
        </div>
      </div>

      {/* Color indicator */}
      {gem.colors && !gem.obtained && (
        <div className="flex gap-0.5">
          {gem.colors.split('').map((color, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                color === 'R' ? 'bg-red-400/60' :
                color === 'G' ? 'bg-green-400/60' :
                'bg-blue-400/60'
              }`}
            />
          ))}
        </div>
      )}
    </button>
  );
}
