/**
 * ModeToggle Component
 * Toggle between Fresh Start and Alt Character modes
 * Fresh mode shows vendor recipes and all tips
 * Alt mode hides recipes and filters tips for speed leveling
 */

import { useLevelingProgress } from '../../contexts/LevelingProgressContext';

export default function ModeToggle() {
  const { mode, setMode } = useLevelingProgress();

  const handleModeChange = (newMode) => {
    if (newMode === mode) return;

    // Simple confirmation for mode switch
    const confirmMessage = newMode === 'fresh'
      ? 'Switch to Fresh Start mode? This will show vendor recipes and all leveling tips.'
      : 'Switch to Alt Character mode? This will hide vendor recipes and focus on speed.';

    if (window.confirm(confirmMessage)) {
      setMode(newMode);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-1">
      <button
        onClick={() => handleModeChange('fresh')}
        className={`
          px-4 py-2 rounded-md font-medium transition-all duration-200
          ${mode === 'fresh'
            ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 text-yellow-400 border border-yellow-500/30'
            : 'text-zinc-400 hover:text-zinc-200'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>Fresh Start</span>
        </div>
      </button>

      <button
        onClick={() => handleModeChange('alt')}
        className={`
          px-4 py-2 rounded-md font-medium transition-all duration-200
          ${mode === 'alt'
            ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 text-yellow-400 border border-yellow-500/30'
            : 'text-zinc-400 hover:text-zinc-200'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span>Alt Character</span>
        </div>
      </button>
    </div>
  );
}
