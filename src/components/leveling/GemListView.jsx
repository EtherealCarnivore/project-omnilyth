/**
 * GemListView
 * List layout for gem browser
 * Detailed row view with full information
 */

import { getGemAvailabilityForClass } from '../../hooks/useGemSearch';
import AvailabilityBadge from './AvailabilityBadge';

export default function GemListView({ gems, selectedClass, onSelectGem }) {
  if (gems.length === 0) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg p-12 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <h3 className="text-lg font-medium text-zinc-300 mb-2">No gems found</h3>
        <p className="text-sm text-zinc-500">
          Try adjusting your filters or search term
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {gems.map((gem) => {
        const availability = getGemAvailabilityForClass(gem.name, selectedClass);
        const availabilityCount = availability?.length || 0;

        return (
          <button
            key={gem.gemId}
            onClick={() => onSelectGem(gem)}
            className="w-full bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] hover:border-amber-500/30 rounded-lg p-4 transition-colors text-left group"
          >
            <div className="flex items-start gap-4">
              {/* Gem Icon */}
              <img
                src={gem.icon}
                alt={gem.name}
                className="w-16 h-16 flex-shrink-0 rounded border border-white/[0.08] group-hover:border-amber-500/30 transition-colors"
                loading="lazy"
              />

              {/* Gem Info */}
              <div className="flex-1 min-w-0">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-medium text-zinc-200 group-hover:text-zinc-100 mb-1">
                      {gem.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded ${
                          gem.type === 'support'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {gem.type === 'support' ? 'Support Gem' : 'Active Skill Gem'}
                      </span>
                      {gem.requiredLevel && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 border border-white/[0.08]">
                          Level {gem.requiredLevel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability Count */}
                  <div className="flex-shrink-0 text-xs text-zinc-500">
                    {availabilityCount} {availabilityCount === 1 ? 'source' : 'sources'}
                  </div>
                </div>

                {/* Availability Badges */}
                {availability && availability.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {availability.slice(0, 3).map((avail, idx) => (
                      <AvailabilityBadge key={idx} availability={avail} />
                    ))}
                    {availability.length > 3 && (
                      <span className="text-xs text-zinc-500">
                        +{availability.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* No Availability Warning */}
                {(!availability || availability.length === 0) && (
                  <div className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    Not available for {selectedClass === 'all' ? 'any class' : selectedClass}
                  </div>
                )}
              </div>

              {/* Action Hint */}
              <div className="flex-shrink-0 text-zinc-600 group-hover:text-amber-500 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
