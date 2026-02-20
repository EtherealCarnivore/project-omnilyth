/**
 * LevelingGemsPage
 * Comprehensive gem browser with advanced filtering
 * Full-featured page at /leveling/gems
 */

import { useState, useMemo, useEffect } from 'react';
import { useLevelingMode } from '../contexts/LevelingModeContext';
import { useGlobalSearch } from '../hooks/useKeyboardShortcut';
import { gemAvailabilityData } from '../data/leveling/gemAvailability';
import ClassSelector from '../components/leveling/ClassSelector';
import FilterSidebar from '../components/leveling/FilterSidebar';
import GemGridView from '../components/leveling/GemGridView';
import GemListView from '../components/leveling/GemListView';
import GemDetailModal from '../components/leveling/GemDetailModal';
import FloatingSearchButton from '../components/leveling/FloatingSearchButton';

export default function LevelingGemsPage() {
  const { selectedClass, mode } = useLevelingMode();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'act', 'type'
  const [selectedGem, setSelectedGem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    types: ['active', 'support'],
    acts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    sources: ['quest', 'siosa', 'lilly'],
    searchTerm: ''
  });

  // Sync search term with filters
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  // Filter and sort gems
  const filteredGems = useMemo(() => {
    const normalizedClass = selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1);
    const gems = Object.values(gemAvailabilityData);

    // Apply filters
    let filtered = gems.filter(gem => {
      // Type filter
      if (!filters.types.includes(gem.type)) return false;

      // Class availability filter
      if (selectedClass !== 'all') {
        const hasAvailability = gem.availability.some(avail =>
          avail.classes.length === 0 || avail.classes.includes(normalizedClass)
        );
        if (!hasAvailability) return false;
      }

      // Act filter
      const gemActs = [...new Set(gem.availability.map(a => a.act))];
      const hasMatchingAct = gemActs.some(act => filters.acts.includes(act));
      if (!hasMatchingAct) return false;

      // Source filter
      const gemSources = [...new Set(gem.availability.map(a => a.source))];
      const hasMatchingSource = gemSources.some(source => filters.sources.includes(source));
      if (!hasMatchingSource) return false;

      // Search term filter
      if (filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase();
        return gem.name.toLowerCase().includes(searchLower);
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          if (a.type !== b.type) {
            return a.type === 'active' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        case 'act':
          const aMinAct = Math.min(...a.availability.map(av => av.act));
          const bMinAct = Math.min(...b.availability.map(av => av.act));
          if (aMinAct !== bMinAct) {
            return aMinAct - bMinAct;
          }
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedClass, filters, sortBy]);

  const handleGemSelect = (gem) => {
    setSelectedGem(gem);
    setIsDetailModalOpen(true);
  };

  // Global keyboard shortcut: Ctrl+G to focus search
  useGlobalSearch(() => {
    // Focus the search input
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.focus();
    }
  });

  return (
    <div className="lg:flex lg:gap-6">
      {/* Filter Sidebar (Desktop) */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <div className="sticky top-6">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:flex-1 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Gem Browser</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Browse all {Object.keys(gemAvailabilityData).length} gems with advanced filtering
            </p>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Class Selector */}
            <div className="sm:flex-1">
              <ClassSelector />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label="List view"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg text-sm text-zinc-300 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="act">Sort by Act</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>

          {/* Search Bar */}
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
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gems... (Arc, Determination, etc.)"
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg text-zinc-200 placeholder-zinc-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden w-full px-4 py-2 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] rounded-lg text-sm text-zinc-300 hover:border-amber-500/30 transition-colors flex items-center justify-center gap-2"
            onClick={() => alert('Mobile filter panel - TODO')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
            </svg>
            Filters
          </button>

          {/* Alt Character Mode Banner */}
          {mode === 'alt' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <div className="text-sm">
                  <p className="text-green-300 font-medium mb-1">
                    Alt Character Mode Active
                  </p>
                  <p className="text-green-400/80">
                    All gems are unlocked on your account. You can purchase any gem from vendors starting in Act 1.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-500">
            Showing <span className="text-zinc-300 font-medium">{filteredGems.length}</span> of {Object.keys(gemAvailabilityData).length} gems
          </div>
        </div>

        {/* Gem Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <GemGridView
              gems={filteredGems}
              selectedClass={selectedClass}
              onSelectGem={handleGemSelect}
            />
          </div>
        ) : (
          <GemListView
            gems={filteredGems}
            selectedClass={selectedClass}
            onSelectGem={handleGemSelect}
          />
        )}
      </div>

      {/* Mobile FAB - scroll to top and focus search */}
      <FloatingSearchButton
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput) searchInput.focus();
          }, 300);
        }}
      />

      {/* Detail Modal */}
      <GemDetailModal
        gem={selectedGem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
