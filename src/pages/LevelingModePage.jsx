/**
 * LevelingModePage
 * Comprehensive leveling guide with quest tracking, zone tips, and gem progression
 * Supports Fresh Start (with vendor recipes) and Alt Character (speed focus) modes
 */

import { useState, useMemo } from 'react';
import { useLevelingProgress } from '../contexts/LevelingProgressContext';
import ModeToggle from '../components/leveling/ModeToggle';
import ActNavigation from '../components/leveling/ActNavigation';
import ZoneCard from '../components/leveling/ZoneCard';

export default function LevelingModePage() {
  const { mode, resetProgress, areas } = useLevelingProgress();
  const [currentAct, setCurrentAct] = useState(1);

  // Filter areas for current act
  const currentActAreas = useMemo(() => {
    return areas.filter(area => area.act === currentAct);
  }, [areas, currentAct]);

  const handleResetProgress = () => {
    if (window.confirm('Reset all leveling progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Leveling Mode</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Complete leveling guide with quest tracking, zone tips, and gem progression
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ModeToggle />

          <button
            onClick={handleResetProgress}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 rounded-lg transition-colors"
          >
            Reset Progress
          </button>
        </div>

        {/* Mode Description */}
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <div className="text-sm">
              <p className="text-zinc-300 font-medium mb-1">
                {mode === 'fresh' ? 'Fresh Start Mode' : 'Alt Character Mode'}
              </p>
              <p className="text-zinc-500">
                {mode === 'fresh'
                  ? 'Shows vendor recipes, all leveling tips, and complete quest details for new league starts.'
                  : 'Focuses on speed leveling with streamlined tips and hidden vendor recipes for experienced players.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Act Navigation */}
      <ActNavigation currentAct={currentAct} onSelectAct={setCurrentAct} />

      {/* Act Header */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
        <h2 className="text-xl font-bold text-zinc-200">
          Act {currentAct}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {currentActAreas.length} zones • {currentActAreas.filter(a => a.hasWaypoint).length} waypoints
        </p>
      </div>

      {/* Zone List */}
      <div className="space-y-3">
        {currentActAreas.length > 0 ? (
          currentActAreas.map(area => (
            <ZoneCard key={area.id} area={area} />
          ))
        ) : (
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-8 text-center">
            <p className="text-zinc-500">
              No data available for Act {currentAct} yet.
            </p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/leveling/vendor-regex"
          className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] hover:border-teal-500/30 rounded-lg p-4 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 3h18v4H3V3z" />
              <path d="M3 7v14h18V7" />
              <path d="M8 10h8M8 14h5" />
            </svg>
            <div>
              <h3 className="font-medium text-zinc-200 group-hover:text-teal-400 transition-colors">
                Vendor Leveling Regex
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Find leveling gear at vendors
              </p>
            </div>
          </div>
        </a>

        <a
          href="/leveling/gem-regex"
          className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] hover:border-teal-500/30 rounded-lg p-4 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 2L2 9l10 13L22 9z" />
              <path d="M2 9h20" />
              <path d="M12 2l5 7-5 13-5-13z" />
            </svg>
            <div>
              <h3 className="font-medium text-zinc-200 group-hover:text-teal-400 transition-colors">
                Gem Regex
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Search for skill gems in stash
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
