/**
 * GemUnlocksSection
 * Displays gem unlocks available in a specific act
 * Used in act cards and leveling preview
 */

import { useMemo } from 'react';
import { getGemsForAct, getBestAvailability } from '../../hooks/useGemSearch';
import AvailabilityBadge from './AvailabilityBadge';

export default function GemUnlocksSection({ act, selectedClass, onSelectGem, compact = false }) {
  const gems = useMemo(() => {
    const actGems = getGemsForAct(act, selectedClass);

    // Sort by type (active first), then by name
    return actGems.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'active' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [act, selectedClass]);

  if (gems.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500 text-sm">
        No gems available for {selectedClass === 'all' ? 'any class' : selectedClass} in Act {act}
      </div>
    );
  }

  // Compact mode - show as grid with icons only
  if (compact) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 p-4">
        {gems.map((gem) => {
          const bestAvailability = getBestAvailability(gem.name, selectedClass);

          return (
            <button
              key={gem.gemId}
              onClick={() => onSelectGem && onSelectGem(gem)}
              className="group relative"
              title={gem.name}
            >
              <div className="aspect-square rounded border border-white/[0.08] group-hover:border-amber-500/30 transition-colors overflow-hidden">
                <img
                  src={gem.icon}
                  alt={gem.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {bestAvailability && (
                <div className="absolute -top-1 -right-1">
                  <AvailabilityBadge availability={bestAvailability} compact />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Full mode - show as list with details
  return (
    <div className="space-y-2 p-4">
      {gems.map((gem) => {
        const bestAvailability = getBestAvailability(gem.name, selectedClass);

        return (
          <button
            key={gem.gemId}
            onClick={() => onSelectGem && onSelectGem(gem)}
            className="w-full p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60 border border-white/[0.04] hover:border-white/[0.08] transition-colors text-left group"
          >
            <div className="flex items-start gap-3">
              {/* Gem Icon */}
              <img
                src={gem.icon}
                alt={gem.name}
                className="w-12 h-12 rounded border border-white/[0.08] group-hover:border-amber-500/30 transition-colors flex-shrink-0"
                loading="lazy"
              />

              {/* Gem Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                      {gem.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded ${
                          gem.type === 'support'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {gem.type === 'support' ? 'Support' : 'Active'}
                      </span>
                      {gem.requiredLevel && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 border border-white/[0.08]">
                          Lv {gem.requiredLevel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability Badge */}
                  {bestAvailability && (
                    <div className="flex-shrink-0">
                      <AvailabilityBadge availability={bestAvailability} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Gem count summary for act headers
 */
export function GemUnlocksCount({ act, selectedClass }) {
  const count = useMemo(() => {
    return getGemsForAct(act, selectedClass).length;
  }, [act, selectedClass]);

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      {count} {count === 1 ? 'gem' : 'gems'}
    </span>
  );
}
