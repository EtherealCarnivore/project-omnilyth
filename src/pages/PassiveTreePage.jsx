/*
 * PassiveTreePage.jsx — Page wrapper for the passive skill tree planner.
 *
 * Provides the page-scoped PassiveTreeContext (NOT in global App.jsx stack).
 * Handles URL hash loading, keyboard shortcuts, mastery modal, and layout.
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PassiveTreeProvider, usePassiveTree } from '../contexts/PassiveTreeContext';
import PassiveTreeRenderer from '../components/passive/PassiveTreeRenderer';
import PassivePointCounter from '../components/passive/PassivePointCounter';
import PassiveSearchBar from '../components/passive/PassiveSearchBar';
import PassiveSummaryPanel from '../components/passive/PassiveSummaryPanel';
import PassiveBuildManager from '../components/passive/PassiveBuildManager';
import ClassSelector from '../components/passive/ClassSelector';
import AscendancyPicker from '../components/passive/AscendancyPicker';
import MasteryModal from '../components/passive/MasteryModal';

function PassiveTreePageInner() {
  const location = useLocation();
  const {
    dataLoading,
    dataError,
    loadFromHash,
    resetAllocations,
    treeData,
    selectedClass,
    selectClass,
    setOnMasteryClick,
  } = usePassiveTree();

  const [sidebarTab, setSidebarTab] = useState('builds');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [masteryModalNode, setMasteryModalNode] = useState(null);
  const hashLoaded = useRef(false);

  // Register mastery click handler with context
  useEffect(() => {
    setOnMasteryClick(() => (nodeId) => {
      setMasteryModalNode(nodeId);
    });
    return () => setOnMasteryClick(null);
  }, [setOnMasteryClick]);

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
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key.toLowerCase()) {
      case 'r':
        resetAllocations();
        break;
      case 's':
        setSidebarOpen(prev => !prev);
        break;
      case 'escape':
        setMasteryModalNode(null);
        break;
      case '1': case '2': case '3': case '4': case '5': case '6': case '7': {
        // Quick class select: 1=Scion, 2=Marauder, 3=Ranger, 4=Witch, 5=Duelist, 6=Templar, 7=Shadow
        const classIdx = parseInt(e.key) - 1;
        if (classIdx >= 0 && classIdx <= 6) selectClass(classIdx);
        break;
      }
    }
  }, [resetAllocations, selectClass]);

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
          <div className="text-sm text-zinc-400">Loading passive tree data...</div>
          <div className="text-[10px] text-zinc-600">5.3MB — first load may be slow</div>
        </div>
      </div>
    );
  }

  // Error state
  if (dataError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2 max-w-md">
          <div className="text-red-400 text-sm font-medium">Failed to load passive tree data</div>
          <div className="text-zinc-500 text-xs">{dataError.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full -mx-4 sm:-mx-6 -my-6 sm:-my-8">
      {/* Main tree view */}
      <div className="flex-1 relative">
        <PassiveTreeRenderer />

        {/* Top-left: title + class selector + point counter */}
        <div className="absolute top-4 left-4 space-y-2 max-w-sm">
          <div className="bg-zinc-900/90 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 space-y-2">
            <div className="text-sm font-semibold text-zinc-100">Passive Tree Planner</div>
            <ClassSelector />
            <AscendancyPicker />
            <PassivePointCounter />
          </div>
        </div>

        {/* Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-[156px] bg-zinc-800/90 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/90 transition-colors"
        >
          {sidebarOpen ? 'Hide Panel' : 'Show Panel'} <span className="text-zinc-600">(S)</span>
        </button>

        {/* Keyboard shortcuts hint */}
        <div className="absolute bottom-4 left-4 text-[10px] text-zinc-600 space-x-3 hidden sm:block">
          <span>R: Reset</span>
          <span>S: Panel</span>
          <span>1-7: Class</span>
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

          {/* Search */}
          <div className="px-3 py-3 border-b border-white/5">
            <PassiveSearchBar />
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {sidebarTab === 'builds' && <PassiveBuildManager />}
            {sidebarTab === 'summary' && <PassiveSummaryPanel />}
          </div>
        </div>
      )}

      {/* Mastery modal */}
      {masteryModalNode && treeData?.nodes[masteryModalNode] && (
        <MasteryModal
          nodeId={masteryModalNode}
          node={treeData.nodes[masteryModalNode]}
          onClose={() => setMasteryModalNode(null)}
        />
      )}
    </div>
  );
}

export default function PassiveTreePage() {
  return (
    <PassiveTreeProvider>
      <PassiveTreePageInner />
    </PassiveTreeProvider>
  );
}
