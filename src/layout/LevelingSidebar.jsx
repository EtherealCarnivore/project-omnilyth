/**
 * LevelingSidebar
 * Focused sidebar for Leveling Mode - only shows leveling-relevant tools
 *
 * Tools included:
 * - Leveling Guide (Acts 1-10)
 * - Vendor Leveling Regex
 * - Gem Regex
 * - Chromatic Calculator
 */

import { NavLink } from 'react-router-dom';
import { useLevelingMode } from '../contexts/LevelingModeContext';
import { useLevelingProgress } from '../contexts/LevelingProgressContext';
import TrialsTracker from '../components/leveling/TrialsTracker';

export default function LevelingSidebar({ open, onClose }) {
  const { exitLevelingMode } = useLevelingMode();
  const { progress, mode, getOverallProgress } = useLevelingProgress();

  // Mock data for now - will be replaced with real progress
  const overallProgress = 35; // percentage

  const handleExitMode = () => {
    // TODO: Add confirmation dialog if significant progress
    if (window.confirm('Exit Leveling Mode? Your progress will be saved.')) {
      exitLevelingMode();
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-zinc-950/95 backdrop-blur-md border-r border-white/[0.06]
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with Exit Button */}
          <div className="p-4 border-b border-white/[0.06]">
            <button
              onClick={handleExitMode}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Exit Leveling Mode</span>
            </button>
          </div>

          {/* Progress Summary */}
          <div className="p-4 border-b border-white/[0.06]">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Overall Progress</span>
                <span className="text-teal-400 font-medium">{overallProgress}%</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="text-xs text-zinc-600">
                Mode: <span className="text-zinc-500">{mode === 'fresh' ? 'Fresh Start' : 'Alt Character'}</span>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Leveling Guide Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2L2 7v13l6-4 6 4 6-4V3l-6 4-6-4z" />
                  </svg>
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Leveling Guide</h3>
                </div>
                <nav className="space-y-1">
                  <NavLink
                    to="/leveling/mode"
                    onClick={onClose}
                    className={({ isActive }) => `
                      block px-3 py-2 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? 'text-teal-400 bg-teal-400/10 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    Acts 1-10
                  </NavLink>
                  <NavLink
                    to="/leveling/preview"
                    onClick={onClose}
                    className={({ isActive }) => `
                      block px-3 py-2 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? 'text-teal-400 bg-teal-400/10 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    Preview Layouts
                  </NavLink>
                </nav>
              </div>

              {/* Leveling Tools Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Leveling Tools</h3>
                </div>
                <nav className="space-y-1">
                  <NavLink
                    to="/leveling/vendor-regex"
                    onClick={onClose}
                    className={({ isActive }) => `
                      block px-3 py-2 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? 'text-teal-400 bg-teal-400/10 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    Vendor Regex
                  </NavLink>
                  <NavLink
                    to="/leveling/gem-regex"
                    onClick={onClose}
                    className={({ isActive }) => `
                      block px-3 py-2 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? 'text-teal-400 bg-teal-400/10 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    Gem Regex
                  </NavLink>
                  <NavLink
                    to="/crafting/chromatic"
                    onClick={onClose}
                    className={({ isActive }) => `
                      block px-3 py-2 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? 'text-teal-400 bg-teal-400/10 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    Chromatic Calculator
                  </NavLink>
                </nav>
              </div>

              {/* Trials of Ascendancy Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Trials of Ascendancy</h3>
                </div>
                <div className="px-2">
                  <TrialsTracker />
                </div>
              </div>

              {/* Quick Tips Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Quick Tips</h3>
                </div>
                <div className="space-y-3 px-3 text-xs">
                  <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
                    <div className="font-medium text-zinc-400 mb-1">Resistance Caps</div>
                    <div className="text-zinc-600">
                      75% cap (default)<br/>
                      -30% after Act 5<br/>
                      -60% total after Act 10
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
                    <div className="font-medium text-zinc-400 mb-1">Movement Speed</div>
                    <div className="text-zinc-600">
                      Priority #1 for leveling<br/>
                      Check vendors regularly<br/>
                      25-30% ideal minimum
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
                    <div className="font-medium text-zinc-400 mb-1">Gem Links</div>
                    <div className="text-zinc-600">
                      3-link: Acts 1-3<br/>
                      4-link: Acts 4-6<br/>
                      5-link: Acts 7-10
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="text-xs text-zinc-600 text-center">
              Leveling Mode Active
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
