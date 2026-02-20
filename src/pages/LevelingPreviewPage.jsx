/**
 * LevelingPreviewPage
 * Preview page for gem progression system
 * Showcases gem unlocks by act with class filtering
 *
 * Accessible at: /leveling-preview
 */

import { useState } from 'react';
import { useLevelingMode } from '../contexts/LevelingModeContext';
import { useGlobalSearch } from '../hooks/useKeyboardShortcut';
import ClassSelector from '../components/leveling/ClassSelector';
import GemUnlocksSection, { GemUnlocksCount } from '../components/leveling/GemUnlocksSection';
import SiosaUnlockBanner from '../components/leveling/SiosaUnlockBanner';
import LillyRothUnlockBanner from '../components/leveling/LillyRothUnlockBanner';
import GemDetailModal from '../components/leveling/GemDetailModal';
import QuickSearchModal from '../components/leveling/QuickSearchModal';
import GemProgressionPanel from '../components/leveling/GemProgressionPanel';
import FloatingSearchButton from '../components/leveling/FloatingSearchButton';

export default function LevelingPreviewPage() {
  const { selectedClass, mode, currentAct, setCurrentAct } = useLevelingMode();
  const [selectedAct, setSelectedAct] = useState(currentAct || 1);
  const [viewMode, setViewMode] = useState('full'); // 'full' or 'compact'
  const [selectedGem, setSelectedGem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleGemSelect = (gem) => {
    setSelectedGem(gem);
    setIsDetailModalOpen(true);
  };

  const handleSearchSelect = (gem) => {
    setSelectedGem(gem);
    setIsSearchModalOpen(false);
    setIsDetailModalOpen(true);
  };

  // Global keyboard shortcut: Ctrl+G to open search
  useGlobalSearch(() => {
    setIsSearchModalOpen(true);
  });

  return (
    <div className="lg:flex lg:gap-6">
      {/* Main Content */}
      <div className="lg:flex-1 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Gem Progression Preview</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Test gem unlock system with class filtering and act progression
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Class Selector */}
            <div>
              <ClassSelector />
            </div>

            {/* Act Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(act => (
                <button
                  key={act}
                  onClick={() => {
                    setSelectedAct(act);
                    setCurrentAct(act);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedAct === act
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60 border border-white/[0.06]'
                  }`}
                >
                  Act {act}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-1">
              <button
                onClick={() => setViewMode('full')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                  viewMode === 'full'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Full Details
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                  viewMode === 'compact'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Compact Grid
              </button>
            </div>
          </div>

          {/* Mode Info Banner */}
          {mode === 'alt' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <div className="text-sm">
                  <p className="text-green-300 font-medium mb-1">
                    Alt Character Mode Active
                  </p>
                  <p className="text-green-400/80">
                    All gems are unlocked on your account. You can purchase any gem from vendors starting in Act 1.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Special Vendor Unlocks */}
        {selectedAct === 3 && (
          <SiosaUnlockBanner />
        )}
        {selectedAct === 6 && (
          <LillyRothUnlockBanner />
        )}

        {/* Gem Unlocks */}
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-zinc-200">
                Act {selectedAct} Gem Unlocks
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {selectedClass === 'all'
                  ? 'Showing all gems available in this act'
                  : `Showing gems for ${selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}`
                }
              </p>
            </div>
            <GemUnlocksCount act={selectedAct} selectedClass={selectedClass} />
          </div>

          <GemUnlocksSection
            act={selectedAct}
            selectedClass={selectedClass}
            onSelectGem={handleGemSelect}
            compact={viewMode === 'compact'}
          />
        </div>

        {/* Data Attribution */}
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Data Sources</h4>
          <div className="text-xs text-zinc-500 space-y-1">
            <div>• Quest Rewards: <a href="https://www.poewiki.net/wiki/Quest_Rewards" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">PoE Wiki</a></div>
            <div>• Gem Icons: <a href="https://www.pathofexile.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">web.poecdn.com</a></div>
            <div>• Total Gems: 335 unique gems across Acts 1-4</div>
          </div>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        <div className="sticky top-6">
          <GemProgressionPanel
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onSelectGem={handleGemSelect}
          />
        </div>
      </div>

      {/* Mobile FAB */}
      <FloatingSearchButton onClick={() => setIsSearchModalOpen(true)} />

      {/* Modals */}
      <GemDetailModal
        gem={selectedGem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <QuickSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectGem={handleSearchSelect}
      />
    </div>
  );
}
