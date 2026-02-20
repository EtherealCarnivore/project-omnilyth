/**
 * FilterSidebar
 * Advanced filtering sidebar for gem browser
 * Filters: class, type, act, availability source
 */

import { useLevelingMode } from '../../contexts/LevelingModeContext';

export default function FilterSidebar({
  filters,
  onFilterChange,
  className = ''
}) {
  const { selectedClass } = useLevelingMode();

  const handleTypeToggle = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleActToggle = (act) => {
    const newActs = filters.acts.includes(act)
      ? filters.acts.filter(a => a !== act)
      : [...filters.acts, act];
    onFilterChange({ ...filters, acts: newActs });
  };

  const handleSourceToggle = (source) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    onFilterChange({ ...filters, sources: newSources });
  };

  const handleReset = () => {
    onFilterChange({
      types: ['active', 'support'],
      acts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      sources: ['quest', 'siosa', 'lilly'],
      searchTerm: ''
    });
  };

  const hasActiveFilters =
    filters.types.length < 2 ||
    filters.acts.length < 10 ||
    filters.sources.length < 3;

  return (
    <div className={`bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-200">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Gem Type Filter */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">
            Gem Type
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.types.includes('active')}
                onChange={() => handleTypeToggle('active')}
                className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-800 checked:bg-amber-500 checked:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-colors"
              />
              <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                Active Skills
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.types.includes('support')}
                onChange={() => handleTypeToggle('support')}
                className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-800 checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
              <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                Support Gems
              </span>
            </label>
          </div>
        </div>

        {/* Act Filter */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">
            Available in Acts
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(act => (
              <button
                key={act}
                onClick={() => handleActToggle(act)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  filters.acts.includes(act)
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-zinc-800/40 text-zinc-500 border border-white/[0.04] hover:text-zinc-300 hover:border-white/[0.08]'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Source Filter */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">
            Availability Source
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.sources.includes('quest')}
                onChange={() => handleSourceToggle('quest')}
                className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-800 checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                  Quest Rewards
                </span>
                <span className="text-xs text-green-400">✅</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.sources.includes('siosa')}
                onChange={() => handleSourceToggle('siosa')}
                className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-800 checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                  Siosa (Act 3)
                </span>
                <span className="text-xs text-purple-400">🔓</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.sources.includes('lilly')}
                onChange={() => handleSourceToggle('lilly')}
                className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-800 checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                  Lilly Roth (Act 6)
                </span>
                <span className="text-xs text-purple-400">🔓</span>
              </div>
            </label>
          </div>
        </div>

        {/* Current Class Info */}
        <div className="p-3 rounded-lg bg-zinc-800/40 border border-white/[0.04]">
          <div className="text-xs text-zinc-500 mb-1">Filtering for:</div>
          <div className="text-sm font-medium text-zinc-300">
            {selectedClass === 'all'
              ? 'All Classes'
              : selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            Change class in header dropdown
          </div>
        </div>
      </div>
    </div>
  );
}
