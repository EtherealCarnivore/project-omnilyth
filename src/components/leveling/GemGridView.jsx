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
            className="group relative bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] hover:border-amber-500/30 rounded-lg p-3 transition-all hover:scale-105"
          >
            {/* Gem Icon - Capped at native CDN size (47px) to avoid upscale blur */}
            <div className="relative aspect-square mb-2 flex items-center justify-center">
              <img
                src={gem.icon}
                alt={gem.name}
                className="w-12 h-12 object-contain rounded"
                loading="lazy"
              />
            </div>

            {/* Gem Name with Type Icon */}
            <div className="flex items-start justify-between gap-1 mb-1">
              <h3 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 line-clamp-2 flex-1">
                {gem.name}
              </h3>
              {/* Type Icon - Simple, no badge */}
              <span className={`text-base flex-shrink-0 ${gem.type === 'support' ? 'text-blue-400' : 'text-amber-400'}`} title={gem.type === 'support' ? 'Support' : 'Active'}>
                {gem.type === 'support' ? '🔗' : '⚡'}
              </span>
            </div>

            {/* Level - Minimal */}
            {gem.requiredLevel && (
              <div className="text-xs text-zinc-500">
                Lvl {gem.requiredLevel}
              </div>
            )}

            {/* Hover Overlay - Show availability only on hover */}
            <div className="hidden lg:block absolute inset-0 bg-zinc-900/95 backdrop-blur-sm border border-amber-500/50 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-sm font-medium text-zinc-100 mb-1">{gem.name}</h4>
                  <div className="text-xs text-zinc-400 flex items-center gap-1 mb-2">
                    <span>{gem.type === 'support' ? '🔗 Support' : '⚡ Active'}</span>
                    {gem.requiredLevel && <span>• Lvl {gem.requiredLevel}</span>}
                  </div>
                </div>
                {bestAvailability && (
                  <div className="text-xs">
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
