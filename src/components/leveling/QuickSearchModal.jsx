/**
 * QuickSearchModal
 * Fast gem search overlay with fuzzy matching
 * Keyboard shortcut: Ctrl+G
 * Shows top 10 results with availability indicators
 */

import { useState, useEffect, useRef } from 'react';
import { useGemSearch, getBestAvailability } from '../../hooks/useGemSearch';
import { useLevelingMode } from '../../contexts/LevelingModeContext';
import AvailabilityBadge from './AvailabilityBadge';

export default function QuickSearchModal({ isOpen, onClose, onSelectGem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const { selectedClass } = useLevelingMode();

  const { results, hasResults } = useGemSearch(searchTerm, selectedClass, {
    limit: 10,
    sortBy: 'act' // Sort by earliest availability
  });

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGemClick = (gem) => {
    if (onSelectGem) {
      onSelectGem(gem);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div
          className="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-md border border-white/[0.08] rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <h2 id="search-modal-title" className="text-lg font-medium text-zinc-200">
              Find Gem
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors"
              aria-label="Close search"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search gems... (Arc, Determination, etc.)"
                className="w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-white/[0.08] rounded-lg text-zinc-200 placeholder-zinc-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-colors"
                autoComplete="off"
                aria-label="Search for gems"
              />
            </div>

            {/* Selected class indicator */}
            <div className="mt-2 text-xs text-zinc-500">
              Showing results for:{' '}
              <span className="text-zinc-400 font-medium">
                {selectedClass === 'all' ? 'All Classes' : selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {!searchTerm || searchTerm.length < 2 ? (
              <div className="p-8 text-center text-zinc-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-zinc-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <p>Type at least 2 characters to search</p>
              </div>
            ) : !hasResults ? (
              <div className="p-8 text-center text-zinc-500">
                <p>No gems found for "{searchTerm}"</p>
                <p className="text-sm mt-2">Try a different search term or check your class filter</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {results.map((gem) => {
                  const bestAvailability = getBestAvailability(gem.name, selectedClass);

                  return (
                    <button
                      key={gem.gemId}
                      onClick={() => handleGemClick(gem)}
                      className="w-full p-4 hover:bg-white/[0.02] transition-colors text-left group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Gem Icon */}
                        <img
                          src={gem.icon}
                          alt={gem.name}
                          className="w-12 h-12 rounded border border-white/[0.08] group-hover:border-amber-500/30 transition-colors"
                          loading="lazy"
                        />

                        {/* Gem Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                                {gem.name}
                              </h3>
                              {gem.requiredLevel && (
                                <span className="text-xs text-zinc-500 mt-0.5 block">
                                  Requires Level {gem.requiredLevel}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                                gem.type === 'support'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {gem.type === 'support' ? 'Support' : 'Active'}
                            </span>
                          </div>

                          {/* Availability */}
                          {bestAvailability && (
                            <div className="mt-2">
                              <AvailabilityBadge availability={bestAvailability} />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Tip */}
          {hasResults && (
            <div className="p-3 border-t border-white/[0.06] text-xs text-zinc-500 text-center">
              💡 Tip: Click any gem for detailed availability information
            </div>
          )}
        </div>
      </div>
    </>
  );
}
