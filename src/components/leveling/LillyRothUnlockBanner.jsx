/**
 * LillyRothUnlockBanner
 * Info banner for Lilly Roth special vendor unlock in Act 6
 * Shows quest requirement and benefits
 */

export default function LillyRothUnlockBanner({ className = '' }) {
  return (
    <div className={`bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-purple-400 mb-1 flex items-center gap-2">
            <span>🔓</span>
            All Gems Unlocked: Lilly Roth
          </h3>

          <p className="text-sm text-zinc-300 mb-2">
            Complete <strong>"Fallen from Grace"</strong> in Act 6 to unlock Lilly Roth in Lioneye's Watch. She sells <strong>ALL gems</strong> in the game, regardless of class or quest completion status.
          </p>

          <div className="space-y-1 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-400">
                Access to every gem in the game
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-400">
                No class restrictions whatsoever
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-400">
                Available in town (easy stash access)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400">💡</span>
              <span className="text-zinc-400">
                <strong>Note:</strong> All gems start at level 1 when purchased
              </span>
            </div>
          </div>

          {/* Alt Character Info */}
          <div className="mt-3 p-2 rounded bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-300">
              <strong>Alt Character Tip:</strong> Once you complete this quest on any character in a league, all future characters in that league can buy any gem from Act 1 onwards.
            </p>
          </div>

          {/* External Link */}
          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <a
              href="https://www.poewiki.net/wiki/Lilly_Roth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Learn more about Lilly Roth</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="m10 14 11-11" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for sidebars
 */
export function LillyRothUnlockBadge({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 ${className}`}>
      <span className="text-lg">🔓</span>
      <div>
        <div className="text-xs font-medium text-purple-400">Lilly Roth Available</div>
        <div className="text-xs text-zinc-500">Complete Fallen from Grace</div>
      </div>
    </div>
  );
}
