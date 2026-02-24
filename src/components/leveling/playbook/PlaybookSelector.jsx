/**
 * PlaybookSelector - Choose a leveling playbook
 *
 * Displays available playbooks with filtering by class, difficulty, and tags
 *
 * @component
 */

import { useState, useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} PlaybookSelectorProps
 * @property {string} [className] - Additional CSS classes
 * @property {Function} [onSelect] - Callback when playbook selected: (playbookId) => void
 */

export default function PlaybookSelector({ className = '', onSelect }) {
  const { playbooks, selectPlaybook, selectedPlaybookId } = usePlaybook();

  const [filters, setFilters] = useState({
    class: 'all',
    difficulty: 'all',
    searchQuery: ''
  });

  // Filter playbooks based on current filters
  const filteredPlaybooks = useMemo(() => {
    return playbooks.filter(playbook => {
      // Class filter
      if (filters.class !== 'all' && playbook.class !== filters.class) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty !== 'all' && playbook.difficulty !== filters.difficulty) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = playbook.name.toLowerCase().includes(query);
        const matchesTags = playbook.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesDescription = playbook.description.toLowerCase().includes(query);

        if (!matchesName && !matchesTags && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }, [playbooks, filters]);

  const handleSelect = (playbookId) => {
    selectPlaybook(playbookId);
    onSelect?.(playbookId);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className={`playbook-selector ${className}`}>
      {/* Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          {/* Class Filter */}
          <select
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            className="px-4 py-2 bg-zinc-900/60 border border-white/[0.06] rounded-lg text-white focus:outline-none focus:border-teal-500/50"
          >
            <option value="all">All Classes</option>
            <option value="Witch">Witch</option>
            <option value="Shadow">Shadow</option>
            <option value="Ranger">Ranger</option>
            <option value="Duelist">Duelist</option>
            <option value="Marauder">Marauder</option>
            <option value="Templar">Templar</option>
            <option value="Scion">Scion</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="px-4 py-2 bg-zinc-900/60 border border-white/[0.06] rounded-lg text-white focus:outline-none focus:border-teal-500/50"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search playbooks..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="w-full px-4 py-2 bg-zinc-900/60 border border-white/[0.06] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500/50"
        />
      </div>

      {/* Playbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaybooks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500">
            No playbooks found matching your filters
          </div>
        ) : (
          filteredPlaybooks.map(playbook => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              isSelected={playbook.id === selectedPlaybookId}
              onSelect={() => handleSelect(playbook.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * PlaybookCard - Individual playbook card
 *
 * @typedef {Object} PlaybookCardProps
 * @property {Object} playbook - Playbook data
 * @property {boolean} isSelected - Is this playbook currently selected
 * @property {Function} onSelect - Callback when card clicked
 */
function PlaybookCard({ playbook, isSelected, onSelect }) {
  const difficultyColors = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400'
  };

  return (
    <button
      onClick={onSelect}
      className={`
        p-6 rounded-lg border-2 text-left transition-all backdrop-blur-sm
        ${isSelected
          ? 'border-teal-500/50 bg-teal-500/10'
          : 'border-white/[0.06] bg-zinc-900/60 hover:border-white/[0.12]'
        }
      `}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-white mb-1">
          {playbook.name}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">{playbook.class}</span>
          <span className="text-zinc-600">•</span>
          <span className={difficultyColors[playbook.difficulty]}>
            {playbook.difficulty}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
        {playbook.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {playbook.tags.slice(0, 4).map(tag => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-zinc-800/60 text-zinc-300 rounded"
          >
            {tag}
          </span>
        ))}
        {playbook.tags.length > 4 && (
          <span className="px-2 py-1 text-xs text-zinc-500">
            +{playbook.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Target: {playbook.estimatedTime}</span>
        <span>Patch {playbook.patchVersion}</span>
      </div>

      {/* Author Credit */}
      {playbook.author && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-zinc-500">
          By <span className="text-zinc-300">{playbook.author}</span>
        </div>
      )}
    </button>
  );
}
