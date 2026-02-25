/*
 * AtlasDiffPage.jsx — Page wrapper for the atlas tree diff tool.
 *
 * Provides the page-scoped AtlasDiffContext. Layout: full-width flex with
 * main SVG canvas + right sidebar containing input panel and summary list.
 */

import { useState, useCallback, useEffect } from 'react';
import { AtlasDiffProvider, useAtlasDiff } from '../contexts/AtlasDiffContext';
import AtlasDiffRenderer from '../components/atlas/AtlasDiffRenderer';
import AtlasDiffInputPanel from '../components/atlas/AtlasDiffInputPanel';
import AtlasDiffSummaryList from '../components/atlas/AtlasDiffSummaryList';

function AtlasDiffPageInner() {
  const {
    dataLoading,
    dataError,
    brightness,
    setBrightness,
    diffResult,
  } = useAtlasDiff();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Keyboard shortcuts
  const onKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key.toLowerCase() === 's') setSidebarOpen(prev => !prev);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <div className="text-sm text-zinc-400">Loading atlas tree data...</div>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2 max-w-md">
          <div className="text-red-400 text-sm font-medium">Failed to load atlas tree data</div>
          <div className="text-zinc-500 text-xs">{dataError.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full -mx-4 sm:-mx-6 -my-6 sm:-my-8">
      {/* Main tree view */}
      <div className="flex-1 relative">
        <AtlasDiffRenderer />

        {/* Top-left: title + diff summary */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-zinc-900/90 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5">
            <div className="text-sm font-semibold text-zinc-100 mb-1">Atlas Tree Diff</div>
            {diffResult ? (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-amber-400">{diffResult.matching.size} match</span>
                <span className="text-green-400">+{diffResult.toAdd.size} add</span>
                <span className="text-red-400">-{diffResult.toRemove.size} remove</span>
              </div>
            ) : (
              <div className="text-xs text-zinc-500">Paste two trees to compare</div>
            )}
          </div>
        </div>

        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-[156px] bg-zinc-800/90 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/90 transition-colors"
        >
          {sidebarOpen ? 'Hide Panel' : 'Show Panel'} <span className="text-zinc-600">(S)</span>
        </button>

        {/* Brightness presets */}
        <div className="absolute bottom-10 left-4 hidden sm:flex items-center gap-1 bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1.5">
          <span className="text-[10px] text-zinc-500 mr-1">Brightness</span>
          {[
            { label: 'Dark', value: 0.8 },
            { label: 'Dim', value: 1.0 },
            { label: 'Normal', value: 1.3 },
            { label: 'Bright', value: 1.6 },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => setBrightness(preset.value)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                brightness === preset.value
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="absolute bottom-4 left-4 text-[10px] text-zinc-600 space-x-3 hidden sm:block">
          <span>S: Toggle Panel</span>
          <span>Scroll: Zoom</span>
          <span>Drag: Pan</span>
        </div>

        {/* Legend */}
        {diffResult && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-[220px] bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-zinc-400">Add</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-[10px] text-zinc-400">Remove</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-[10px] text-zinc-400">Match</span>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      {sidebarOpen && (
        <div className="w-80 border-l border-white/5 bg-zinc-950/95 flex flex-col overflow-hidden">
          {/* Input panel */}
          <div className="px-3 py-3 border-b border-white/5">
            <AtlasDiffInputPanel />
          </div>

          {/* Summary list */}
          <div className="flex-1 overflow-y-auto px-1 py-2">
            <AtlasDiffSummaryList />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AtlasDiffPage() {
  return (
    <AtlasDiffProvider>
      <AtlasDiffPageInner />
    </AtlasDiffProvider>
  );
}
