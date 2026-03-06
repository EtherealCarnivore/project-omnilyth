/**
 * LevelingModePage
 * Comprehensive leveling guide with quest tracking, zone tips, and gem progression.
 * Three-column layout: left sidebar (via AppShell) | center route content | right gem panel.
 *
 * The center and right columns scroll independently, so gems are always visible
 * alongside the route content — optimized for dual-monitor "glance" UX.
 *
 * On screens < 1280px, falls back to a single-column layout with a collapsible
 * gem section at the top.
 */

import { useState, useMemo } from 'react';
import { useLevelingProgress } from '../contexts/LevelingProgressContext';
import ModeToggle from '../components/leveling/ModeToggle';
import ActNavigation from '../components/leveling/ActNavigation';
import ZoneCard from '../components/leveling/ZoneCard';
import GemPlanPanel from '../components/leveling/GemPlanPanel';
import CompactGemPanel from '../components/leveling/CompactGemPanel';
import PlaybookTogglePanel from '../components/leveling/PlaybookTogglePanel';
import ActPlaybookOverview from '../components/leveling/ActPlaybookOverview';

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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed header area — mode toggle, playbook, act navigation */}
      <div className="flex-shrink-0 space-y-3 pb-4">
        {/* Title + Mode Toggle row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-zinc-100">Leveling Mode</h1>
            <ModeToggle />
          </div>
          <button
            onClick={handleResetProgress}
            className="px-3 py-1.5 text-xs text-zinc-500 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 rounded-lg transition-colors"
          >
            Reset Progress
          </button>
        </div>

        {/* Playbook Toggle */}
        <PlaybookTogglePanel />

        {/* Act Navigation */}
        <ActNavigation currentAct={currentAct} onSelectAct={setCurrentAct} />
      </div>

      {/* Two-column content area: route (scrolls) | gems (scrolls independently) */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Left: scrollable route content */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-1 space-y-4 pb-6">
          {/* Mobile/tablet: collapsible gem panel (hidden on xl+) */}
          <div className="xl:hidden">
            <GemPlanPanel currentAct={currentAct} />
          </div>

          {/* Act Header */}
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
            <h2 className="text-xl font-bold text-zinc-200">
              Act {currentAct}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {currentActAreas.length} zones • {currentActAreas.filter(a => a.hasWaypoint).length} waypoints
            </p>
          </div>

          {/* Act Playbook Overview */}
          <ActPlaybookOverview currentAct={currentAct} />

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
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-5 h-5 text-teal-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M3 3h18v4H3V3z" />
                  <path d="M3 7v14h18V7" />
                  <path d="M8 10h8M8 14h5" />
                </svg>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-zinc-200 group-hover:text-teal-400 transition-colors truncate">
                    Vendor Leveling Regex
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">
                    Find leveling gear at vendors
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/leveling/gem-regex"
              className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] hover:border-teal-500/30 rounded-lg p-4 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-5 h-5 text-teal-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M12 2L2 9l10 13L22 9z" />
                  <path d="M2 9h20" />
                  <path d="M12 2l5 7-5 13-5-13z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-zinc-200 group-hover:text-teal-400 transition-colors truncate">
                    Gem Regex
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">
                    Search for skill gems in stash
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Right: always-visible gem panel (xl+ screens only) */}
        <aside className="hidden xl:flex w-[300px] flex-shrink-0 bg-zinc-900/40 border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="flex-1 min-h-0">
            <CompactGemPanel currentAct={currentAct} />
          </div>
        </aside>
      </div>
    </div>
  );
}
