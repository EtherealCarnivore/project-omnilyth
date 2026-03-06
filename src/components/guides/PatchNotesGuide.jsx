/**
 * Patch Notes Guide - Official PoE patch notes from PoE Wiki
 * Full-screen modal with Escape key support
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePatchNotes } from '../../contexts/PatchNotesContext';

const PatchNotesGuide = () => {
  const {
    patches,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isPatchRead,
    fetchPatches
  } = usePatchNotes();

  const [modalPatch, setModalPatch] = useState(null); // Patch to show in modal
  const [sortOrder, setSortOrder] = useState('newest'); // newest | oldest | major
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force refresh - clear cache and fetch new data
  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Clear cache
    localStorage.removeItem('omnilyth_patch_notes_cache_v5');
    localStorage.removeItem('omnilyth_patch_notes_last_fetch_v5');

    // Fetch fresh data
    await fetchPatches();

    setIsRefreshing(false);
  };

  // Open modal and mark as read
  const openModal = (patch) => {
    console.log('Opening modal for patch:', patch.title);
    setModalPatch(patch);
    markAsRead(patch.id);
  };

  // Close modal
  const closeModal = () => {
    setModalPatch(null);
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalPatch) {
        closeModal();
      }
    };

    if (modalPatch) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [modalPatch]);

  // Filter and sort patches
  const getSortedPatches = () => {
    let filtered = [...patches];

    if (sortOrder === 'major') {
      filtered = filtered.filter(p => p.isMajor);
    }

    if (sortOrder === 'oldest') {
      filtered = filtered.reverse();
    }

    return filtered;
  };

  const sortedPatches = getSortedPatches();

  // Format time ago
  const timeAgo = (isoDate) => {
    const now = new Date();
    const posted = new Date(isoDate);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return posted.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: posted.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Get category badge
  const getCategoryBadge = (category) => {
    const badges = {
      league: { text: 'LEAGUE', color: 'bg-purple-500/20 text-purple-400' },
      balance: { text: 'BALANCE', color: 'bg-blue-500/20 text-blue-400' },
      hotfix: { text: 'HOTFIX', color: 'bg-orange-500/20 text-orange-400' },
      bugfix: { text: 'BUG FIX', color: 'bg-green-500/20 text-green-400' },
      content: { text: 'CONTENT', color: 'bg-amber-500/20 text-amber-400' }
    };

    const badge = badges[category] || badges.content;
    return <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${badge.color}`}>{badge.text}</span>;
  };

  if (loading && patches.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-white/50 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          Loading patch notes...
        </div>
      </div>
    );
  }

  if (error && patches.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
          <div className="text-red-400 font-medium mb-2">⚠️ Failed to Load Patch Notes</div>
          <div className="text-red-400/70 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-white/70 text-sm">
          Official PoE Patch Notes
        </div>
        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-1.5 bg-black/40 border border-amber-500/20 rounded text-white/70 text-xs focus:outline-none focus:border-amber-500/50 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="major">Major Updates Only</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            title="Clear cache and fetch latest patches"
          >
            <svg
              className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded text-xs transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Patch list */}
      <div className="space-y-3">
        {sortedPatches.length === 0 ? (
          <div className="text-center py-12 text-white/50 text-sm">
            No patches found
          </div>
        ) : (
          sortedPatches.map(patch => {
            const isRead = isPatchRead(patch.id);

            return (
              <div
                key={patch.id}
                className={`border rounded-lg overflow-hidden transition-all ${
                  isRead
                    ? 'border-amber-500/10 bg-black/20'
                    : 'border-amber-500/30 bg-black/40'
                }`}
              >
                {/* Card header */}
                <div className="p-3 space-y-2">
                  {/* Title row */}
                  <div className="flex items-start gap-2">
                    {!isRead && (
                      <span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium leading-snug ${
                        isRead ? 'text-white/70' : 'text-white'
                      }`}>
                        {patch.title}
                      </h3>
                    </div>
                    {patch.isMajor && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                        ⚡ MAJOR
                      </span>
                    )}
                  </div>

                  {/* Metadata row */}
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>Posted {timeAgo(patch.posted)}</span>
                    <span>•</span>
                    <span>by {patch.author}</span>
                    <span>•</span>
                    {getCategoryBadge(patch.category)}
                  </div>

                  {/* Highlights */}
                  {patch.highlights.length > 0 && (
                    <ul className="space-y-1 text-sm text-white/60 mt-2">
                      {patch.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500/50 flex-shrink-0">•</span>
                          <span className="flex-1">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => openModal(patch)}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                    >
                      Read Full Notes →
                    </button>

                    <a
                      href={patch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Wiki Page →
                    </a>

                    {patch.version && (
                      <span className="text-xs text-white/30 ml-auto">
                        v{patch.version}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
        <div className="text-amber-400 font-medium mb-2">Patch Notes from PoE Wiki</div>
        <div className="text-white/50 text-sm">
          Official patch notes sourced from poewiki.net. Updates every 10 minutes.
        </div>
      </div>

      {/* Full-screen Modal for Patch Notes */}
      {modalPatch && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-900 border border-amber-500/30 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-amber-500/20">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  {modalPatch.isMajor && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                      ⚡ MAJOR
                    </span>
                  )}
                  {getCategoryBadge(modalPatch.category)}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {modalPatch.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <span>Posted {timeAgo(modalPatch.posted)}</span>
                  <span>•</span>
                  <span>by {modalPatch.author}</span>
                  {modalPatch.version && (
                    <>
                      <span>•</span>
                      <span>v{modalPatch.version}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={closeModal}
                className="flex-shrink-0 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close (Esc)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert max-w-none">
                {modalPatch.content ? (
                  <pre className="whitespace-pre-wrap text-base text-white/80 font-sans leading-relaxed">
                    {modalPatch.content}
                  </pre>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4 text-white/50">
                      <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <p className="text-lg text-white/70 mb-2">Full patch notes available on the official Path of Exile forum</p>
                      <p className="text-sm text-white/40">Click the button below to view the complete patch notes</p>
                    </div>
                    {modalPatch.forumUrl && (
                      <a
                        href={modalPatch.forumUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors font-medium"
                      >
                        View Official Patch Notes
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-amber-500/20 bg-zinc-950/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/50">
                  Press <kbd className="px-2 py-1 bg-white/10 rounded text-white/70 font-mono text-xs">ESC</kbd> to close
                </div>
                <div className="flex items-center gap-3">
                  {modalPatch.forumUrl && (
                    <a
                      href={modalPatch.forumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors text-sm font-medium"
                    >
                      Official Forum →
                    </a>
                  )}
                  <a
                    href={modalPatch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium"
                  >
                    Wiki Page →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PatchNotesGuide;
