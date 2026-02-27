/*
 * PassiveSearchBar.jsx — Search input for finding nodes by name/stats.
 *
 * Uses PassiveTreeContext to get/set searchQuery.
 * Shows match count when there are results.
 * Minimum 2 characters to trigger search.
 */

import { useState, useEffect } from 'react';

export default function PassiveSearchBar({ searchQuery, onSearchChange, matchCount }) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  const showMatchCount = localQuery.length >= 2 && matchCount !== undefined;
  const isSearchActive = localQuery.length >= 2;

  return (
    <div className="relative w-full max-w-md">
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input field */}
      <input
        type="text"
        value={localQuery}
        onChange={handleChange}
        placeholder="Search nodes (min 2 chars)..."
        className="w-full pl-10 pr-24 py-2 bg-gray-800 border border-gray-700 rounded-lg
                   text-white placeholder-gray-500 focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:border-transparent transition-all"
      />

      {/* Match count badge */}
      {showMatchCount && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-blue-600 rounded text-xs font-semibold text-white">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
        </div>
      )}

      {/* Clear button */}
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700
                     rounded transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="w-5 h-5 text-gray-400 hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Hint text */}
      {!isSearchActive && localQuery.length > 0 && localQuery.length < 2 && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  );
}
