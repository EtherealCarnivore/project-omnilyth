/**
 * Patch Notes Widget - Dashboard component for latest PoE patch notes
 * Shows latest 3 patches with full-screen modal view
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePatchNotes } from '../contexts/PatchNotesContext';

const PatchNotesWidget = () => {
  const {
    patches,
    loading,
    error,
    unreadCount,
    markAsRead,
    isPatchRead
  } = usePatchNotes();

  const [modalPatch, setModalPatch] = useState(null); // Patch to show in modal

  // Show only latest 3 patches
  const latestPatches = patches.slice(0, 3);

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

  // Format time ago
  const timeAgo = (isoDate) => {
    const now = new Date();
    const posted = new Date(isoDate);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return posted.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
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

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-amber-950/5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-amber-500/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h2 className="text-sm font-semibold text-amber-400">Latest Patch Notes</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-medium rounded animate-pulse">
                {unreadCount} new
              </span>
            )}
          </div>
          <a
            href="https://www.reddit.com/r/pathofexile/search?q=flair_name%3A%22GGG%22&sort=new&restrict_sr=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            View all
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Patches list */}
      <div className="divide-y divide-amber-500/5">
        {/* Loading state */}
        {loading && patches.length === 0 && (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-zinc-400 text-sm">Loading patch notes from Reddit...</p>
          </div>
        )}

        {/* Error state */}
        {error && patches.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-red-400 text-sm mb-2">⚠️ Failed to load patch notes</p>
            <p className="text-zinc-500 text-xs">{error}</p>
          </div>
        )}

        {/* No patches state */}
        {!loading && !error && patches.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-zinc-400 text-sm">No patch notes available</p>
          </div>
        )}

        {/* Patches */}
        {latestPatches.map(patch => {
          const isRead = isPatchRead(patch.id);

          return (
            <div
              key={patch.id}
              className={`p-4 transition-colors ${
                isRead ? 'bg-black/10' : 'bg-black/20'
              } hover:bg-black/30`}
            >
              {/* Compact header */}
              <div className="flex items-start gap-3">
                {/* Unread indicator */}
                {!isRead && (
                  <span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-green-500 animate-pulse"></span>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Title and badges */}
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className={`text-sm font-medium leading-snug ${
                      isRead ? 'text-zinc-400' : 'text-zinc-200'
                    }`}>
                      {patch.title}
                    </h3>
                    {patch.isMajor && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                        ⚡ MAJOR
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <span>{timeAgo(patch.posted)}</span>
                    <span>•</span>
                    {getCategoryBadge(patch.category)}
                    <span>•</span>
                    <span>{patch.comments} comments</span>
                  </div>

                  {/* Highlights */}
                  {patch.highlights.length > 0 && (
                    <ul className="space-y-1 text-xs text-zinc-500">
                      {patch.highlights.slice(0, 2).map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500/50 flex-shrink-0">•</span>
                          <span className="flex-1">{highlight}</span>
                        </li>
                      ))}
                      {patch.highlights.length > 2 && (
                        <li className="text-zinc-600 italic">
                          +{patch.highlights.length - 2} more changes
                        </li>
                      )}
                    </ul>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
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
                      onClick={() => !isRead && markAsRead(patch.id)}
                      className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Discussion →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with keybind hint */}
      <div className="px-4 py-3 bg-black/40 border-t border-amber-500/10">
        <p className="text-xs text-zinc-600 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-zinc-500">G</kbd> to open full guide overlay
        </p>
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
                  <span>•</span>
                  <span>{modalPatch.upvotes} upvotes</span>
                  <span>•</span>
                  <span>{modalPatch.comments} comments</span>
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
                    Reddit Discussion →
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

export default PatchNotesWidget;
