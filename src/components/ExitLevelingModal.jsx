/*
 * ExitLevelingModal.jsx — Confirmation dialog for exiting Leveling Mode.
 *
 * Replaces window.confirm() with a proper styled modal.
 * Includes a "don't ask again" checkbox that persists to localStorage.
 */

import { useState, useEffect, useRef } from 'react';

const REMEMBER_KEY = 'omnilyth_skip_exit_leveling_confirm';

/**
 * Check if user has opted to skip the confirmation.
 */
export function shouldSkipExitConfirm() {
  try {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Reset the "don't ask again" preference (e.g. from settings).
 */
export function resetExitConfirmPreference() {
  try {
    localStorage.removeItem(REMEMBER_KEY);
  } catch {
    // ignore
  }
}

export default function ExitLevelingModal({ onConfirm, onCancel }) {
  const [remember, setRemember] = useState(false);
  const cancelRef = useRef(null);

  // Focus cancel button on mount, trap Escape key
  useEffect(() => {
    cancelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const handleConfirm = () => {
    if (remember) {
      try {
        localStorage.setItem(REMEMBER_KEY, 'true');
      } catch {
        // ignore
      }
    }
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 border border-white/10 rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-zinc-100">Exit Leveling Mode?</h3>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-zinc-300">
            Your leveling progress will be saved. You can re-enter Leveling Mode at any time from the sidebar.
          </p>

          {/* Remember checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-4 h-4 rounded border border-zinc-600 bg-zinc-800 peer-checked:bg-teal-500/20 peer-checked:border-teal-500/50 transition-colors" />
              {remember && (
                <svg className="absolute inset-0 w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors select-none">
              Don't ask me again
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-zinc-950/50 border-t border-white/5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 transition-colors"
          >
            Stay
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 hover:border-teal-500/50 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
