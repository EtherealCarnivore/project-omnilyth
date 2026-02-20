/**
 * GemDetailModal
 * Detailed gem information modal
 * Shows all availability sources, quest details, and external links
 */

import { useEffect } from 'react';
import { useLevelingMode } from '../../contexts/LevelingModeContext';
import { getGemAvailabilityForClass } from '../../hooks/useGemSearch';
import AvailabilityBadge from './AvailabilityBadge';

export default function GemDetailModal({ gem, isOpen, onClose }) {
  const { selectedClass, mode } = useLevelingMode();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll
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

  if (!isOpen || !gem) return null;

  const classAvailability = getGemAvailabilityForClass(gem.name, selectedClass);

  // Group availability by source type
  const questSources = classAvailability?.filter(a => a.source === 'quest') || [];
  const siosaSource = classAvailability?.find(a => a.source === 'siosa');
  const lillySource = classAvailability?.find(a => a.source === 'lilly');

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-md border border-white/[0.08] rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gem-detail-title"
        >
          {/* Header */}
          <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-white/[0.06] p-4 z-10">
            <div className="flex items-start gap-4">
              <img
                src={gem.icon}
                alt={gem.name}
                className="w-16 h-16 rounded border border-white/[0.08]"
              />

              <div className="flex-1 min-w-0">
                <h2 id="gem-detail-title" className="text-xl font-medium text-zinc-200">
                  {gem.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      gem.type === 'support'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {gem.type === 'support' ? 'Support Gem' : 'Active Skill Gem'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Alt Character Mode Banner */}
            {mode === 'alt' && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div className="text-sm text-green-300">
                    <strong>Alt Character Mode:</strong> All gems are unlocked on your account.
                    Purchase from any vendor starting Act 1.
                  </div>
                </div>
              </div>
            )}

            {/* Availability Section */}
            <div>
              <h3 className="text-lg font-medium text-zinc-300 mb-3">Availability</h3>

              {/* Quest Rewards */}
              {questSources.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Quest Rewards</h4>
                  <div className="space-y-2">
                    {questSources.map((source, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-zinc-800/40 border border-white/[0.04]"
                      >
                        <div className="flex items-start gap-3">
                          <AvailabilityBadge availability={source} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-zinc-300">
                              {source.questName}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">
                              {source.classes.length === 0
                                ? 'Available for all classes'
                                : `Available for: ${source.classes.join(', ')}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Siosa */}
              {siosaSource && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Special Vendor</h4>
                  <div className="p-3 rounded-lg bg-zinc-800/40 border border-white/[0.04]">
                    <div className="flex items-start gap-3">
                      <AvailabilityBadge availability={siosaSource} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-300">
                          Siosa (The Library)
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          Complete "{siosaSource.questName}" to unlock Siosa.
                          Removes class restrictions for gems you've unlocked via quests.
                        </div>
                        <div className="text-xs text-amber-400 mt-1">
                          ⚠️ Cannot access stash in The Library - bring currency in inventory
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lilly Roth */}
              {lillySource && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">All Gems Vendor</h4>
                  <div className="p-3 rounded-lg bg-zinc-800/40 border border-white/[0.04]">
                    <div className="flex items-start gap-3">
                      <AvailabilityBadge availability={lillySource} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-300">
                          Lilly Roth (Lioneye's Watch - Act 6+)
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          Complete "{lillySource.questName}" to unlock all gems regardless of
                          class or quest completion.
                        </div>
                        <div className="text-xs text-amber-400 mt-1">
                          💡 All gems start at level 1 when purchased from Lilly Roth
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Not Available */}
              {(!questSources || questSources.length === 0) && selectedClass !== 'all' && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <div className="text-sm text-red-300">
                      <strong>Not Available as Quest Reward</strong>
                      <div className="text-xs mt-1">
                        This gem is not available as a quest reward for{' '}
                        {selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}.
                        Use Siosa (Act 3) or Lilly Roth (Act 6) to obtain it.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* External Links */}
            <div>
              <h3 className="text-lg font-medium text-zinc-300 mb-3">External Resources</h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.poewiki.net/wiki/${encodeURIComponent(gem.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/60 border border-white/[0.06] hover:border-amber-500/30 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  PoE Wiki
                </a>
                <a
                  href={`https://www.pathofexile.com/trade/search?q=${encodeURIComponent(gem.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/60 border border-white/[0.06] hover:border-amber-500/30 text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Trade Search
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
