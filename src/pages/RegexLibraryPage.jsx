import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRegexLibrary } from '../hooks/useRegexLibrary';

export default function RegexLibraryPage() {
  const { patterns, remove, clear, storageInfo } = useRegexLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTool, setFilterTool] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Get unique tool labels for filter
  const uniqueTools = ['all', ...new Set(patterns.map(p => p.toolLabel))];

  // Filter patterns
  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTool = filterTool === 'all' || pattern.toolLabel === filterTool;
    return matchesSearch && matchesTool;
  });

  // Copy to clipboard
  const handleCopy = (pattern) => {
    navigator.clipboard.writeText(pattern.pattern).then(() => {
      setCopiedId(pattern.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Delete single pattern
  const handleDelete = (patternId) => {
    remove(patternId);
    setDeleteConfirmId(null);
  };

  // Clear all patterns
  const handleClearAll = () => {
    clear();
    setShowClearConfirm(false);
  };

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">
          Regex Library
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          View and manage your saved regex patterns from all tools.
          Patterns are stored locally in your browser.
        </p>
      </div>

      {/* Storage Info */}
      <div className="glass-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-300">Storage Status</h2>
            <p className="text-xs text-zinc-500">
              {patterns.length} pattern{patterns.length !== 1 ? 's' : ''} saved
              {storageInfo.nearLimit && (
                <span className="text-yellow-400 ml-2">
                  ({storageInfo.percentUsed}% full)
                </span>
              )}
            </p>
          </div>
          {patterns.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg
                       hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Storage Progress Bar */}
        <div className="h-2 rounded-full bg-zinc-900/50 overflow-hidden">
          <div
            className={`h-full transition-all ${
              storageInfo.percentUsed >= 90 ? 'bg-red-500' :
              storageInfo.percentUsed >= 80 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(storageInfo.percentUsed, 100)}%` }}
          />
        </div>

        {storageInfo.nearLimit && (
          <div className="flex items-start gap-2 text-yellow-500 bg-yellow-500/10 rounded-lg p-3 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 flex-shrink-0 mt-0.5"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              Storage nearly full. ~{storageInfo.estimatedSlotsRemaining} patterns remaining.
              Consider deleting old patterns.
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      {patterns.length > 0 && (
        <div className="glass-card space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300">Filters</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Search */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or pattern..."
                className="w-full calc-input"
              />
            </div>

            {/* Tool Filter */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Filter by Tool</label>
              <select
                value={filterTool}
                onChange={(e) => setFilterTool(e.target.value)}
                className="w-full calc-input"
              >
                {uniqueTools.map(tool => (
                  <option key={tool} value={tool}>
                    {tool === 'all' ? 'All Tools' : tool}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {searchQuery || filterTool !== 'all' ? (
            <p className="text-xs text-zinc-500">
              Showing {filteredPatterns.length} of {patterns.length} pattern{patterns.length !== 1 ? 's' : ''}
            </p>
          ) : null}
        </div>
      )}

      {/* Pattern List */}
      {filteredPatterns.length === 0 ? (
        <div className="glass-card text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-16 h-16 mx-auto text-zinc-700 mb-4"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">
            {patterns.length === 0 ? 'No patterns saved yet' : 'No matching patterns'}
          </h3>
          <p className="text-sm text-zinc-500">
            {patterns.length === 0
              ? 'Save regex patterns from any tool to view them here'
              : 'Try adjusting your search or filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPatterns.map(pattern => (
            <div
              key={pattern.id}
              className="glass-card hover:bg-zinc-900/60 transition-colors"
            >
              {/* Pattern Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-zinc-100 truncate">
                    {pattern.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                      {pattern.toolLabel}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatDate(pattern.created)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(pattern)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      copiedId === pattern.id
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/80'
                    }`}
                    title="Copy pattern"
                  >
                    {copiedId === pattern.id ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 inline mr-1"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 inline mr-1"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(pattern.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg
                             hover:bg-red-500/20 transition-colors"
                    title="Delete pattern"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 inline mr-1"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              {/* Pattern Display */}
              <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-zinc-100 break-all">
                {pattern.pattern}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="glass-card rounded-xl p-6 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-red-400"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-100 mb-1">Delete Pattern?</h3>
                <p className="text-sm text-zinc-400">
                  Are you sure you want to delete this pattern? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 glass-card px-4 py-2 rounded-lg hover:bg-zinc-700/30 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                style={{ minHeight: '44px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2
                         rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                style={{ minHeight: '44px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="glass-card rounded-xl p-6 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-red-400"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-100 mb-1">Clear All Patterns?</h3>
                <p className="text-sm text-zinc-400">
                  Are you sure you want to delete all {patterns.length} saved pattern{patterns.length !== 1 ? 's' : ''}?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 glass-card px-4 py-2 rounded-lg hover:bg-zinc-700/30 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                style={{ minHeight: '44px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2
                         rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                style={{ minHeight: '44px' }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
