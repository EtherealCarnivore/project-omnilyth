/**
 * ActNavigation - Navigation bar for switching between acts (Playbook variant)
 * Uses teal accent to match leveling section design language.
 *
 * @component
 */

import { usePlaybook } from '../../../contexts/PlaybookContext';

export default function ActNavigation({ className = '', showProgress = true }) {
  const { currentPlaybook, currentAct, setCurrentAct, getActProgress } = usePlaybook();

  if (!currentPlaybook) return null;

  const acts = currentPlaybook.acts.map(act => act.act);

  return (
    <div className={`bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-2 ${className}`}>
      <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        {acts.map(actNumber => {
          const isActive = actNumber === currentAct;
          const progress = showProgress ? getActProgress(actNumber) : null;
          const isComplete = progress === 100;

          // Label: acts 7 covers 7-8, act 9 covers 9-10, act 10 is "Maps"
          const label = actNumber === 10 ? 'Maps' : `Act ${actNumber}`;

          return (
            <button
              key={actNumber}
              onClick={() => setCurrentAct(actNumber)}
              aria-label={`${label}${progress !== null ? `, ${progress}% complete` : ''}`}
              aria-current={isActive ? 'step' : undefined}
              className={`
                flex-shrink-0 px-4 py-3 rounded-lg transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                ${isActive
                  ? 'bg-teal-500/20 border-2 border-teal-500/50 text-teal-400'
                  : 'bg-zinc-800/40 border border-white/[0.04] text-zinc-400 hover:border-white/[0.08] hover:text-zinc-300'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium">{label}</span>
                {showProgress && progress !== null && (
                  <div className="flex items-center gap-1">
                    {isComplete ? (
                      <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : progress > 0 ? (
                      <span className="text-xs text-zinc-500">{progress}%</span>
                    ) : (
                      <span className="text-xs text-zinc-600">0%</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
