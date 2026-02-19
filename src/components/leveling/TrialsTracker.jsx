/**
 * TrialsTracker
 * Quick reference for all Trial of Ascendancy locations
 * Helps users find missing trials without scrolling through acts
 */

import { useState, useEffect } from 'react';
import { trialsData } from '../../data/leveling/trials-data';

export default function TrialsTracker() {
  const [completedTrials, setCompletedTrials] = useState(() => {
    try {
      const saved = localStorage.getItem('omnilyth_completed_trials');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('omnilyth_trials_expanded');
      return saved === 'true';
    } catch {
      return false; // Collapsed by default
    }
  });

  // Save to localStorage whenever completedTrials changes
  useEffect(() => {
    try {
      localStorage.setItem('omnilyth_completed_trials', JSON.stringify([...completedTrials]));
    } catch (error) {
      console.error('Failed to save completed trials:', error);
    }
  }, [completedTrials]);

  // Save expanded state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omnilyth_trials_expanded', isExpanded.toString());
    } catch (error) {
      console.error('Failed to save expanded state:', error);
    }
  }, [isExpanded]);

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  const toggleTrial = (trialId) => {
    setCompletedTrials(prev => {
      const next = new Set(prev);
      if (next.has(trialId)) {
        next.delete(trialId);
      } else {
        next.add(trialId);
      }
      return next;
    });
  };

  // Mark entire lab tier as complete (for alt characters)
  const markLabComplete = (tier) => {
    setCompletedTrials(prev => {
      const next = new Set(prev);
      trialsData[tier].forEach(trial => {
        next.add(`${trial.act}-${trial.zone}`);
      });
      return next;
    });
  };

  // Unmark entire lab tier
  const unmarkLabComplete = (tier) => {
    setCompletedTrials(prev => {
      const next = new Set(prev);
      trialsData[tier].forEach(trial => {
        next.delete(`${trial.act}-${trial.zone}`);
      });
      return next;
    });
  };

  // Calculate completion progress for each lab tier
  const getLabProgress = (tier) => {
    const tierTrials = trialsData[tier];
    const completed = tierTrials.filter(t =>
      completedTrials.has(`${t.act}-${t.zone}`)
    ).length;
    return { completed, total: tierTrials.length, isComplete: completed === tierTrials.length };
  };

  const normalProgress = getLabProgress('normal');
  const cruelProgress = getLabProgress('cruel');
  const mercilessProgress = getLabProgress('merciless');

  return (
    <div className="space-y-3">
      {/* Compact Summary View */}
      <div className="space-y-2">
        {/* Normal Lab Progress */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              normalProgress.isComplete ? 'bg-green-500' : 'bg-amber-500'
            }`} />
            <span className="text-xs text-zinc-400">Normal Lab</span>
          </div>
          <span className={`text-xs font-medium ${
            normalProgress.isComplete ? 'text-green-400' : 'text-zinc-500'
          }`}>
            {normalProgress.completed}/{normalProgress.total}
            {normalProgress.isComplete && ' ✓'}
          </span>
        </div>

        {/* Cruel Lab Progress */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              cruelProgress.isComplete ? 'bg-green-500' : 'bg-amber-500'
            }`} />
            <span className="text-xs text-zinc-400">Cruel Lab</span>
          </div>
          <span className={`text-xs font-medium ${
            cruelProgress.isComplete ? 'text-green-400' : 'text-zinc-500'
          }`}>
            {cruelProgress.completed}/{cruelProgress.total}
            {cruelProgress.isComplete && ' ✓'}
          </span>
        </div>

        {/* Merciless Lab Progress */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              mercilessProgress.isComplete ? 'bg-green-500' : 'bg-amber-500'
            }`} />
            <span className="text-xs text-zinc-400">Merciless Lab</span>
          </div>
          <span className={`text-xs font-medium ${
            mercilessProgress.isComplete ? 'text-green-400' : 'text-zinc-500'
          }`}>
            {mercilessProgress.completed}/{mercilessProgress.total}
            {mercilessProgress.isComplete && ' ✓'}
          </span>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-amber-500/30 rounded-lg transition-colors"
      >
        <span>{isExpanded ? 'Hide Details' : 'View All Trials'}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <svg className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <p className="text-[10px] text-blue-300 leading-relaxed">
                <strong>Alt Characters:</strong> Trial completion is account-wide per league.
                Use "Mark All" to quickly mark tiers your main character already completed.
              </p>
            </div>
          </div>

      {/* Normal Lab Trials */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Normal Lab
          </h4>
          <div className="flex items-center gap-2">
            {normalProgress.isComplete ? (
              <button
                onClick={() => unmarkLabComplete('normal')}
                className="text-[10px] px-2 py-0.5 text-zinc-500 hover:text-zinc-300 border border-white/[0.06] hover:border-zinc-500/30 rounded transition-colors"
              >
                Unmark All
              </button>
            ) : (
              <button
                onClick={() => markLabComplete('normal')}
                className="text-[10px] px-2 py-0.5 text-green-500 hover:text-green-400 border border-green-500/30 hover:border-green-500/50 rounded transition-colors"
              >
                Mark All
              </button>
            )}
            <span className={`text-xs font-medium ${
              normalProgress.isComplete
                ? 'text-green-400'
                : 'text-zinc-500'
            }`}>
              {normalProgress.completed}/{normalProgress.total}
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          {trialsData.normal.map(trial => {
            const trialId = `${trial.act}-${trial.zone}`;
            const isCompleted = completedTrials.has(trialId);

            return (
              <label
                key={trialId}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] cursor-pointer group transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTrial(trialId)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-2 border-zinc-700 checked:bg-amber-500 checked:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-colors cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'text-zinc-600 line-through'
                      : 'text-zinc-300 group-hover:text-zinc-200'
                  }`}>
                    {trial.zone}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">
                    Act {trial.act} • {trial.trapType}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Cruel Lab Trials */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Cruel Lab
          </h4>
          <div className="flex items-center gap-2">
            {cruelProgress.isComplete ? (
              <button
                onClick={() => unmarkLabComplete('cruel')}
                className="text-[10px] px-2 py-0.5 text-zinc-500 hover:text-zinc-300 border border-white/[0.06] hover:border-zinc-500/30 rounded transition-colors"
              >
                Unmark All
              </button>
            ) : (
              <button
                onClick={() => markLabComplete('cruel')}
                className="text-[10px] px-2 py-0.5 text-green-500 hover:text-green-400 border border-green-500/30 hover:border-green-500/50 rounded transition-colors"
              >
                Mark All
              </button>
            )}
            <span className={`text-xs font-medium ${
              cruelProgress.isComplete
                ? 'text-green-400'
                : 'text-zinc-500'
            }`}>
              {cruelProgress.completed}/{cruelProgress.total}
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          {trialsData.cruel.map(trial => {
            const trialId = `${trial.act}-${trial.zone}`;
            const isCompleted = completedTrials.has(trialId);

            return (
              <label
                key={trialId}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] cursor-pointer group transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTrial(trialId)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-2 border-zinc-700 checked:bg-amber-500 checked:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-colors cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'text-zinc-600 line-through'
                      : 'text-zinc-300 group-hover:text-zinc-200'
                  }`}>
                    {trial.zone}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">
                    Act {trial.act} • {trial.trapType}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Merciless Lab Trials */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Merciless Lab
          </h4>
          <div className="flex items-center gap-2">
            {mercilessProgress.isComplete ? (
              <button
                onClick={() => unmarkLabComplete('merciless')}
                className="text-[10px] px-2 py-0.5 text-zinc-500 hover:text-zinc-300 border border-white/[0.06] hover:border-zinc-500/30 rounded transition-colors"
              >
                Unmark All
              </button>
            ) : (
              <button
                onClick={() => markLabComplete('merciless')}
                className="text-[10px] px-2 py-0.5 text-green-500 hover:text-green-400 border border-green-500/30 hover:border-green-500/50 rounded transition-colors"
              >
                Mark All
              </button>
            )}
            <span className={`text-xs font-medium ${
              mercilessProgress.isComplete
                ? 'text-green-400'
                : 'text-zinc-500'
            }`}>
              {mercilessProgress.completed}/{mercilessProgress.total}
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          {trialsData.merciless.map(trial => {
            const trialId = `${trial.act}-${trial.zone}`;
            const isCompleted = completedTrials.has(trialId);

            return (
              <label
                key={trialId}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] cursor-pointer group transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTrial(trialId)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-2 border-zinc-700 checked:bg-amber-500 checked:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-colors cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'text-zinc-600 line-through'
                      : 'text-zinc-300 group-hover:text-zinc-200'
                  }`}>
                    {trial.zone}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">
                    Act {trial.act} • {trial.trapType}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Eternal Lab Note */}
      <div className="p-3 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div className="text-[10px] text-zinc-500 leading-relaxed">
            <strong className="text-zinc-400">Eternal Lab:</strong> Complete any trial in yellow+ maps (Tier 6+) to get an
            <strong className="text-zinc-400"> Offering to the Goddess</strong>. One offering = one lab run.
            <br/>
            <strong className="text-amber-400">Tip:</strong> Most players buy offerings from trade for fast ascendancy (big powerspike).
          </div>
        </div>
      </div>

          {/* Reset Button */}
          {completedTrials.size > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset all trial progress? This cannot be undone.')) {
                  setCompletedTrials(new Set());
                }
              }}
              className="w-full px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 border border-white/[0.06] hover:border-red-500/30 rounded-lg transition-colors"
            >
              Reset All Trials
            </button>
          )}
        </div>
      )}
    </div>
  );
}
