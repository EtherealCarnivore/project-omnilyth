/**
 * LinkGroupCard
 * Displays a single link group (gear slot) with ordered gems and link count selector.
 * Gems beyond activeLinks are dimmed to show which supports to drop on fewer links.
 */
import { useLevelingPlan } from '../../contexts/LevelingPlanContext';

export default function LinkGroupCard({ group }) {
  const { updateLinkCount, removeLinkGroup } = useLevelingPlan();

  const maxLinks = group.gems.length;
  const minLinks = Math.min(2, maxLinks);

  return (
    <div className="glass-card rounded-xl p-4 relative group/card">
      {/* Remove button */}
      <button
        onClick={() => removeLinkGroup(group.id)}
        className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover/card:opacity-100 hover:bg-red-500/10 transition-all"
        title="Remove link group"
      >
        <svg className="w-4 h-4 text-zinc-500 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-amber-300 truncate">
            {group.mainSkill}
          </h3>
          {group.slot && (
            <span className="text-[10px] text-zinc-500 font-mono shrink-0">
              {group.slot}
            </span>
          )}
        </div>
        {group.label && group.label !== group.mainSkill && group.label !== group.slot && (
          <p className="text-[11px] text-zinc-500 truncate">{group.label}</p>
        )}
      </div>

      {/* Link count selector */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-[11px] text-zinc-500 mr-1">Links:</span>
        {Array.from({ length: maxLinks - minLinks + 1 }, (_, i) => i + minLinks).map(count => (
          <button
            key={count}
            onClick={() => updateLinkCount(group.id, count)}
            className={`w-7 h-6 rounded text-[11px] font-medium transition-all ${
              group.activeLinks === count
                ? 'bg-amber-500/20 border border-amber-400/30 text-amber-300'
                : 'bg-zinc-900/40 border border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-400'
            }`}
          >
            {count}L
          </button>
        ))}
      </div>

      {/* Gem list */}
      <div className="space-y-1">
        {group.gems.map((gem, index) => {
          const isActive = index < group.activeLinks;
          return (
            <div
              key={`${gem.name}-${index}`}
              className={`flex items-center gap-2 px-2 py-1.5 rounded transition-all ${
                isActive ? '' : 'opacity-30'
              }`}
            >
              {/* Position indicator */}
              <span className={`text-[10px] font-mono w-4 text-center shrink-0 ${
                isActive ? 'text-zinc-500' : 'text-zinc-700'
              }`}>
                {index + 1}
              </span>

              {/* Gem icon */}
              {gem.gemData?.icon && (
                <img
                  src={gem.gemData.icon}
                  alt={gem.name}
                  className="w-6 h-6 rounded border border-white/10 shrink-0"
                />
              )}

              {/* Gem name */}
              <span className={`text-sm truncate ${
                !isActive
                  ? 'text-zinc-600 line-through'
                  : gem.isSupport
                    ? 'text-zinc-400'
                    : 'text-amber-300'
              }`}>
                {gem.name}
              </span>

              {/* Earliest availability */}
              {gem.gemData?.availability?.[0]?.act && (
                <span className={`ml-auto text-[10px] shrink-0 ${
                  isActive ? 'text-zinc-600' : 'text-zinc-700'
                }`}>
                  A{gem.gemData.availability[0].act}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
