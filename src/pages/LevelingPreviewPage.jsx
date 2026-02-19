/**
 * LevelingPreviewPage
 * Preview/comparison page for testing different layout styles
 * Helps decide between exile-leveling style vs poe-leveling style
 *
 * Accessible at: /leveling-preview
 * Temporary page for design decision-making
 */

import { useState, lazy, Suspense } from 'react';
import { acts123Data } from '../data/leveling/acts123-data.js';
import { acts456Data } from '../data/leveling/acts456-data.js';
import { acts789Data } from '../data/leveling/acts789-data.js';
import { act10Data } from '../data/leveling/act10-data.js';

// Lazy load layout variants
const ExileLevelingLayout = lazy(() => import('../components/leveling/preview/ExileLevelingLayout'));
const PoELevelingLayout = lazy(() => import('../components/leveling/preview/PoELevelingLayout'));

export default function LevelingPreviewPage() {
  const [layoutStyle, setLayoutStyle] = useState('exile'); // 'exile' or 'poe'
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedAct, setSelectedAct] = useState(1);

  // Combine all act data
  const allData = {
    areas: [...acts123Data.areas, ...acts456Data.areas, ...acts789Data.areas, ...act10Data.areas],
    quests: [...acts123Data.quests, ...acts456Data.quests, ...acts789Data.quests, ...act10Data.quests],
    gems: [...acts123Data.gems, ...acts456Data.gems, ...acts789Data.gems, ...act10Data.gems]
  };

  // Filter data for selected act
  const actAreas = allData.areas.filter(a => a.act === selectedAct);
  const actQuests = allData.quests.filter(q => q.act === selectedAct);
  const actGems = allData.gems.filter(g => g.act === selectedAct);

  const previewData = {
    act: selectedAct,
    areas: actAreas, // Show all zones for act
    quests: actQuests,
    gems: actGems
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Leveling Mode Preview</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Compare layout styles to decide on final design
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Act Selector */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(act => (
              <button
                key={act}
                onClick={() => setSelectedAct(act)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedAct === act
                    ? 'bg-zinc-800 text-zinc-100 border border-white/[0.12]'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60'
                }`}
              >
                Act {act}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Layout Toggle */}
            <div className="flex items-center gap-3 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-1">
            <button
              onClick={() => setLayoutStyle('exile')}
              className={`
                px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm
                ${layoutStyle === 'exile'
                  ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              exile-leveling Style
            </button>

            <button
              onClick={() => setLayoutStyle('poe')}
              className={`
                px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm
                ${layoutStyle === 'poe'
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              poe-leveling Style
            </button>
          </div>

          {/* Comparison Toggle (Desktop Only) */}
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-teal-500/30 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="8" height="18" />
              <rect x="13" y="3" width="8" height="18" />
            </svg>
            <span>{comparisonMode ? 'Single View' : 'Side-by-Side'}</span>
          </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
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
                Act {selectedAct} Preview - {comparisonMode ? 'Side-by-Side Comparison' : layoutStyle === 'exile' ? 'exile-leveling Style' : 'poe-leveling Style'}
              </p>
              <p className="text-zinc-500">
                {comparisonMode
                  ? `Comparing both layout styles with Act ${selectedAct} data. Choose which approach feels better for Omnilyth.`
                  : `Showing ${layoutStyle === 'exile' ? 'structured, tabular' : 'narrative, guide-style'} layout for Act ${selectedAct}. Toggle to compare or switch acts.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <Suspense fallback={
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-zinc-800 rounded-lg mx-auto mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-32 mx-auto"></div>
          </div>
        </div>
      }>
        {comparisonMode ? (
          // Side-by-Side Comparison (Desktop)
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-purple-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                exile-leveling Style
              </h2>
              <ExileLevelingLayout data={previewData} />
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                poe-leveling Style
              </h2>
              <PoELevelingLayout data={previewData} />
            </div>
          </div>
        ) : (
          // Single Layout View
          <div>
            {layoutStyle === 'exile' ? (
              <ExileLevelingLayout data={previewData} />
            ) : (
              <PoELevelingLayout data={previewData} />
            )}
          </div>
        )}
      </Suspense>

      {/* Feedback Section */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">Which Style Do You Prefer?</h3>
        <div className="space-y-3 text-sm text-zinc-400">
          <div className="flex items-start gap-3">
            <span className="text-purple-400 font-medium">exile-leveling:</span>
            <span>Structured, table-based, clear sections. Good for quick scanning and checkbox-style progress.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-medium">poe-leveling:</span>
            <span>Narrative, guide-style, step-by-step. Good for storytelling and detailed instructions.</span>
          </div>
        </div>
        <p className="text-xs text-zinc-600 mt-4">
          Note: Final design will be unique to Omnilyth - this is for inspiration only.
        </p>
      </div>

      {/* Data Attribution */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Preview Data Sources</h4>
        <div className="text-xs text-zinc-600 space-y-1">
          <div>• exile-leveling by HeartofPhos (GitHub)</div>
          <div>• Mock data for testing (full data in Phase 2)</div>
        </div>
      </div>
    </div>
  );
}
