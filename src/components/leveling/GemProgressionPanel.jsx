/**
 * GemProgressionPanel
 * Sidebar panel for gem progression tracking
 * Features:
 * - Quick search button (opens QuickSearchModal)
 * - Next unlock preview (upcoming gems in next act)
 * - Collapsible sections
 * - View all gems link
 */

import { useState, useMemo } from 'react';
import { useLevelingMode } from '../../contexts/LevelingModeContext';
import { getGemsForAct, getBestAvailability } from '../../hooks/useGemSearch';
import AvailabilityBadge from './AvailabilityBadge';

export default function GemProgressionPanel({ onOpenSearch, onSelectGem, className = '' }) {
  const { selectedClass, currentAct, mode } = useLevelingMode();
  const [isExpanded, setIsExpanded] = useState(true);

  // Get gems available in next act
  const nextActGems = useMemo(() => {
    if (currentAct >= 10) return [];

    const gems = getGemsForAct(currentAct + 1, selectedClass);

    // Sort by gem type (active first) and then by name
    return gems
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'active' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 6); // Show max 6 gems
  }, [currentAct, selectedClass]);

  // Get current act gems
  const currentActGems = useMemo(() => {
    const gems = getGemsForAct(currentAct, selectedClass);

    return gems
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'active' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 6);
  }, [currentAct, selectedClass]);

  return (
    <div className={`bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-200">Gem Progression</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content (collapsible) */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Alt Character Mode Info */}
          {mode === 'alt' && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <p className="text-xs text-green-300">
                  <strong>Alt Mode:</strong> All gems unlocked - purchase from any vendor starting Act 1
                </p>
              </div>
            </div>
          )}

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-full px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-lg text-sm font-medium text-amber-400 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Search Gems (Ctrl+G)
          </button>

          {/* Current Act Gems */}
          {currentActGems.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-zinc-400 mb-2">
                Act {currentAct} Unlocks ({currentActGems.length})
              </h4>
              <div className="space-y-2">
                {currentActGems.map((gem) => {
                  const bestAvailability = getBestAvailability(gem.name, selectedClass);

                  return (
                    <button
                      key={gem.gemId}
                      onClick={() => onSelectGem && onSelectGem(gem)}
                      className="w-full p-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60 border border-white/[0.04] hover:border-white/[0.08] transition-colors text-left group"
                    >
                      <div className="flex items-start gap-2">
                        <img
                          src={gem.icon}
                          alt={gem.name}
                          className="w-8 h-8 rounded border border-white/[0.08] group-hover:border-amber-500/30 transition-colors"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-zinc-300 truncate">
                            {gem.name}
                          </div>
                          {bestAvailability && (
                            <div className="mt-1">
                              <AvailabilityBadge availability={bestAvailability} compact />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next Act Preview */}
          {currentAct < 10 && nextActGems.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-zinc-400 mb-2">
                Act {currentAct + 1} Preview ({nextActGems.length})
              </h4>
              <div className="space-y-2">
                {nextActGems.map((gem) => {
                  const bestAvailability = getBestAvailability(gem.name, selectedClass);

                  return (
                    <button
                      key={gem.gemId}
                      onClick={() => onSelectGem && onSelectGem(gem)}
                      className="w-full p-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60 border border-white/[0.04] hover:border-white/[0.08] transition-colors text-left group"
                    >
                      <div className="flex items-start gap-2">
                        <img
                          src={gem.icon}
                          alt={gem.name}
                          className="w-8 h-8 rounded border border-white/[0.08] group-hover:border-amber-500/30 transition-colors"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-zinc-300 truncate">
                            {gem.name}
                          </div>
                          {bestAvailability && (
                            <div className="mt-1">
                              <AvailabilityBadge availability={bestAvailability} compact />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {currentActGems.length === 0 && nextActGems.length === 0 && (
            <div className="py-8 text-center text-zinc-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <p className="text-sm">
                {currentAct >= 10
                  ? 'Campaign complete! All gems available.'
                  : 'No gems available for this class.'}
              </p>
            </div>
          )}

          {/* View All Gems Link */}
          <a
            href="/leveling/gems"
            className="block w-full px-4 py-2 text-center text-xs text-zinc-400 hover:text-amber-400 border border-white/[0.06] hover:border-amber-500/30 rounded-lg transition-colors"
          >
            View All Gems →
          </a>
        </div>
      )}
    </div>
  );
}
