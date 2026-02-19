/**
 * LevelingModeBanner
 * Top banner displayed when Leveling Mode is active
 * Shows current act, quick exit button
 */

import { useLevelingMode } from '../contexts/LevelingModeContext';
import { useLevelingProgress } from '../contexts/LevelingProgressContext';

export default function LevelingModeBanner() {
  const { exitLevelingMode } = useLevelingMode();
  const { mode } = useLevelingProgress();

  const handleExit = () => {
    if (window.confirm('Exit Leveling Mode? Your progress will be saved.')) {
      exitLevelingMode();
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-500/10 to-teal-600/5 border-b border-teal-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <div>
              <span className="text-sm font-medium text-teal-400">Leveling Mode Active</span>
              <span className="hidden sm:inline text-sm text-zinc-500 ml-3">
                {mode === 'fresh' ? 'Fresh Start' : 'Alt Character'} • Tools optimized for leveling
              </span>
            </div>
          </div>

          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
          >
            <span className="hidden sm:inline">Exit Mode</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
