/*
 * AtlasTreePage.jsx — Page wrapper for the atlas tree planner.
 *
 * Provides the page-scoped AtlasTreeContext (NOT in global App.jsx stack).
 * Handles URL hash loading, keyboard shortcuts, and layout.
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AtlasTreeProvider, useAtlasTree } from '../contexts/AtlasTreeContext';
import AtlasTreeRenderer from '../components/atlas/AtlasTreeRenderer';
import AtlasPointCounter from '../components/atlas/AtlasPointCounter';
import AtlasSearchBar from '../components/atlas/AtlasSearchBar';
import AtlasSummaryPanel from '../components/atlas/AtlasSummaryPanel';
import AtlasBuildManager from '../components/atlas/AtlasBuildManager';

function AtlasTreePageInner() {
  const location = useLocation();
  const {
    dataLoading,
    dataError,
    loadFromHash,
    resetAllocations,
    treeData,
  } = useAtlasTree();

  const [sidebarTab, setSidebarTab] = useState('builds');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hashLoaded = useRef(false);

  // Load from URL hash on mount
  useEffect(() => {
    if (treeData && !hashLoaded.current) {
      hashLoaded.current = true;
      const hash = location.hash.replace('#', '');
      if (hash) {
        loadFromHash(hash);
      }
    }
  }, [treeData, location.hash, loadFromHash]);

  // Keyboard shortcuts
  const onKeyDown = useCallback((e) => {
    // Don't capture when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key.toLowerCase()) {
      case 'r':
        resetAllocations();
        break;
      case 'escape':
        // Could deselect or close panels
        break;
      case 's':
        setSidebarOpen(prev => !prev);
        break;
    }
  }, [resetAllocations]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  // Loading state
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

  // Error state
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
        <AtlasTreeRenderer />

        {/* Top-left: title + point counter */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-zinc-900/90 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5">
            <div className="text-sm font-semibold text-zinc-100 mb-1">Atlas Tree Planner</div>
            <AtlasPointCounter />
          </div>
        </div>

        {/* Toggle sidebar button (mobile + desktop) */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-[156px] bg-zinc-800/90 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/90 transition-colors"
        >
          {sidebarOpen ? 'Hide Panel' : 'Show Panel'} <span className="text-zinc-600">(S)</span>
        </button>

        {/* Keyboard shortcuts hint */}
        <div className="absolute bottom-4 left-4 text-[10px] text-zinc-600 space-x-3 hidden sm:block">
          <span>R: Reset</span>
          <span>S: Toggle Panel</span>
          <span>Scroll: Zoom</span>
          <span>Drag: Pan</span>
        </div>
      </div>

      {/* Right sidebar panel */}
      {sidebarOpen && (
        <div className="w-72 border-l border-white/5 bg-zinc-950/95 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {[
              { id: 'builds', label: 'Builds' },
              { id: 'summary', label: 'Summary' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSidebarTab(tab.id)}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  sidebarTab === tab.id
                    ? 'text-sky-400 border-b-2 border-sky-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search (always visible) */}
          <div className="px-3 py-3 border-b border-white/5">
            <AtlasSearchBar />
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {sidebarTab === 'builds' && <AtlasBuildManager />}
            {sidebarTab === 'summary' && <AtlasSummaryPanel />}
          </div>

          {/* Phase 2 placeholder */}
          <div className="px-3 py-3 border-t border-white/5">
            <button
              disabled
              className="w-full px-3 py-2 rounded-lg text-xs bg-zinc-800/30 border border-white/5 text-zinc-600 cursor-not-allowed"
              title="Coming in Phase 2 — waiting on PoE API multi-slot access"
            >
              Import from PoE — Coming Soon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AtlasTreePage() {
  return (
    <AtlasTreeProvider>
      <AtlasTreePageInner />
    </AtlasTreeProvider>
  );
}
