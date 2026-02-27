/*
 * PassiveSummaryPanel.jsx — Shows stat summary grouped by category.
 *
 * Displays allocated node stats organized into collapsible categories
 * (Life & Defence, Attack, Spell, etc.) with stat counts.
 */

import { useState } from 'react';
import { STAT_CATEGORIES } from '../../data/passive/passiveTreeConstants';

/**
 * Categorize stats into predefined categories
 */
function categorizeStats(stats) {
  const categorized = {};
  const uncategorized = [];

  // Initialize all categories
  Object.keys(STAT_CATEGORIES).forEach(category => {
    categorized[category] = [];
  });

  // Categorize each stat
  stats.forEach(stat => {
    const statLower = stat.toLowerCase();
    let foundCategory = false;

    // Check each category's keywords
    for (const [category, keywords] of Object.entries(STAT_CATEGORIES)) {
      if (keywords.length === 0) continue; // Skip 'General' category for now

      // Check if stat matches any keyword
      const matches = keywords.some(keyword => statLower.includes(keyword));
      if (matches) {
        categorized[category].push(stat);
        foundCategory = true;
        break;
      }
    }

    // If no category matched, add to General
    if (!foundCategory) {
      uncategorized.push(stat);
    }
  });

  // Add uncategorized to General
  if (uncategorized.length > 0) {
    categorized['General'] = uncategorized;
  }

  // Remove empty categories
  Object.keys(categorized).forEach(category => {
    if (categorized[category].length === 0) {
      delete categorized[category];
    }
  });

  return categorized;
}

/**
 * Collapsible category section
 */
function CategorySection({ category, stats, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-700 last:border-b-0">
      {/* Category header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800
                   transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{category}</span>
          <span className="px-2 py-0.5 bg-blue-600 rounded text-xs font-bold text-white">
            {stats.length}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Stat list */}
      {isOpen && (
        <div className="px-3 py-2 bg-gray-900 space-y-1">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-sm text-blue-200">
              {stat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PassiveSummaryPanel({ statSummary }) {
  const [openCategories, setOpenCategories] = useState(new Set());

  if (!statSummary || statSummary.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
        <div className="mb-2">
          <svg
            className="w-12 h-12 mx-auto text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-sm">No nodes allocated yet</p>
        <p className="text-xs mt-1">Allocate nodes to see stat summary</p>
      </div>
    );
  }

  const categorized = categorizeStats(statSummary);
  const totalStats = statSummary.length;

  const toggleCategory = (category) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gray-700 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">Stat Summary</h3>
          <span className="px-2 py-0.5 bg-blue-600 rounded text-xs font-bold text-white">
            {totalStats} total
          </span>
        </div>
      </div>

      {/* Category list */}
      <div>
        {Object.entries(categorized).map(([category, stats]) => (
          <CategorySection
            key={category}
            category={category}
            stats={stats}
            isOpen={openCategories.has(category)}
            onToggle={() => toggleCategory(category)}
          />
        ))}
      </div>
    </div>
  );
}
