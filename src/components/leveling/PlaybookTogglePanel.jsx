/**
 * PlaybookTogglePanel
 *
 * Toggle switch for enabling/disabling playbook enrichment in Leveling Mode.
 * When enabled with no playbook selected, shows playbook selector cards.
 * When enabled with a playbook selected, shows the selected playbook badge.
 */

import { usePlaybook } from '../../contexts/PlaybookContext';

export default function PlaybookTogglePanel() {
  const {
    playbookModeEnabled,
    togglePlaybookMode,
    playbooks,
    currentPlaybook,
    selectPlaybook,
    clearPlaybook
  } = usePlaybook();

  return (
    <div
      className={`
        bg-zinc-900/60 backdrop-blur-sm border rounded-lg p-4 transition-colors
        ${playbookModeEnabled ? 'border-amber-500/20' : 'border-white/[0.06]'}
      `}
    >
      {/* Toggle Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Book Icon */}
          <svg
            className={`w-5 h-5 flex-shrink-0 transition-colors ${playbookModeEnabled ? 'text-amber-400' : 'text-zinc-500'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className={`text-sm font-medium ${playbookModeEnabled ? 'text-amber-300' : 'text-zinc-400'}`}>
            Playbook Mode
          </span>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={togglePlaybookMode}
          className={`
            relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0
            ${playbookModeEnabled ? 'bg-amber-500' : 'bg-zinc-700'}
          `}
          aria-label={`${playbookModeEnabled ? 'Disable' : 'Enable'} playbook mode`}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out
              ${playbookModeEnabled ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Playbook Selection (when enabled) */}
      {playbookModeEnabled && !currentPlaybook && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 mb-3">Select a playbook to enrich zone cards with build-specific tips:</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {playbooks.map(pb => (
              <button
                key={pb.id}
                onClick={() => selectPlaybook(pb.id)}
                className="flex-shrink-0 bg-zinc-800/80 border border-white/[0.06] hover:border-amber-500/30 rounded-lg p-3 text-left transition-colors min-w-[180px] sm:min-w-[200px]"
              >
                <p className="text-sm font-medium text-zinc-200 truncate">{pb.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-amber-400/80 truncate">{pb.class}</span>
                  <span className="text-xs text-zinc-600">|</span>
                  <span className="text-xs text-zinc-500 capitalize">{pb.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Playbook Badge (when enabled + selected) */}
      {playbookModeEnabled && currentPlaybook && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
              {currentPlaybook.name}
            </span>
            <span className="text-xs text-zinc-500">{currentPlaybook.class}</span>
          </div>
          <button
            onClick={clearPlaybook}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}
