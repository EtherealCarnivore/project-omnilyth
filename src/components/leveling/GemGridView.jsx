/**
 * GemGridView
 * Grid layout for gem browser
 * Compact card view with hover details
 */

import { getBestAvailability } from '../../hooks/useGemSearch';
import AvailabilityBadge from './AvailabilityBadge';

export default function GemGridView({ gems, selectedClass, onSelectGem }) {
  if (gems.length === 0) {
    return (
      <div className="col-span-full bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg p-12 text-center">
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
    <>
      {gems.map((gem) => {
        const bestAvailability = getBestAvailability(gem.name, selectedClass);

        return (
          <button
            key={gem.gemId}
            onClick={() => onSelectGem(gem)}
            className="group relative bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] hover:border-amber-500/30 rounded-lg p-4 transition-all hover:scale-105"
          >
            {/* Gem Icon */}
            <div className="relative aspect-square mb-3">
              <img
                src={gem.icon}
                alt={gem.name}
                className="w-full h-full object-cover rounded border border-white/[0.08] group-hover:border-amber-500/30 transition-colors"
                loading="lazy"
              />

              {/* Availability Badge (top-right corner) */}
              {bestAvailability && (
                <div className="absolute -top-2 -right-2">
                  <AvailabilityBadge availability={bestAvailability} compact />
                </div>
              )}

              {/* Type Badge (bottom-left corner) */}
              <div className="absolute -bottom-2 -left-2">
                <span
                  className={`inline-block text-xs px-2 py-1 rounded font-medium ${
                    gem.type === 'support'
                      ? 'bg-blue-500/90 text-white'
                      : 'bg-amber-500/90 text-white'
                  }`}
                >
                  {gem.type === 'support' ? 'S' : 'A'}
                </span>
              </div>

              {/* Level Badge (bottom-right corner) */}
              {gem.requiredLevel && (
                <div className="absolute -bottom-2 -right-2">
                  <span className="inline-block text-xs px-2 py-1 rounded font-medium bg-zinc-700 text-white border border-white/[0.2]">
                    {gem.requiredLevel}
                  </span>
                </div>
              )}
            </div>

            {/* Gem Name */}
            <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 line-clamp-2 min-h-[2.5rem]">
              {gem.name}
            </h3>

            {/* Hover Overlay (Desktop) */}
            <div className="hidden lg:block absolute inset-0 bg-zinc-900/95 backdrop-blur-sm border border-amber-500/50 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-sm font-medium text-zinc-100 mb-2">{gem.name}</h4>
                  <div className="text-xs text-zinc-400">
                    {gem.type === 'support' ? 'Support Gem' : 'Active Skill Gem'}
                  </div>
                </div>
                {bestAvailability && (
                  <div>
                    <AvailabilityBadge availability={bestAvailability} />
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </>
  );
}
