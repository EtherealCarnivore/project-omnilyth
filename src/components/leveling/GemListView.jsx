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
            <div className="flex items-center gap-3">
              {/* Gem Icon - Smaller */}
              <img
                src={gem.icon}
                alt={gem.name}
                className="w-10 h-10 flex-shrink-0 rounded"
                loading="lazy"
              />

              {/* Gem Name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                  {gem.name}
                </h3>
              </div>

              {/* Metadata - Clean inline format */}
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                {/* Type with icon */}
                <span className="flex items-center gap-1">
                  <span className={gem.type === 'support' ? 'text-blue-400' : 'text-amber-400'}>
                    {gem.type === 'support' ? '🔗' : '⚡'}
                  </span>
                  {gem.type === 'support' ? 'Support' : 'Active'}
                </span>

                {/* Level */}
                {gem.requiredLevel && (
                  <span>Lvl {gem.requiredLevel}</span>
                )}

                {/* Availability - First source only */}
                {availability && availability.length > 0 && (
                  <span className="flex items-center gap-1">
                    {availability[0].source === 'quest' && '📜 Quest'}
                    {availability[0].source === 'siosa' && '⭐ Siosa'}
                    {availability[0].source === 'lilly' && '⭐ Lilly'}
                    {availability[0].source === 'vendor' && '🏪 Vendor'}
                    {availability.length > 1 && ` +${availability.length - 1}`}
                  </span>
                )}

                {/* No availability */}
                {(!availability || availability.length === 0) && (
                  <span className="text-red-400">Not available</span>
                )}
              </div>

              {/* Action Hint */}
              <div className="flex-shrink-0 text-zinc-600 group-hover:text-amber-500 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
