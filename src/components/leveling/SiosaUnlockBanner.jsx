/**
 * SiosaUnlockBanner
 * Info banner for Siosa special vendor unlock in Act 3
 * Shows quest requirement and benefits
 */

export default function SiosaUnlockBanner({ className = '' }) {
  return (
    <div className={`bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-purple-400 mb-1 flex items-center gap-2">
            <span>🔓</span>
            Special Vendor: Siosa
          </h3>

          <p className="text-sm text-zinc-300 mb-2">
            Complete <strong>"A Fixture of Fate"</strong> in The Library (Act 3) to unlock Siosa, a special vendor who sells all gems you've previously unlocked via quest rewards, regardless of class restrictions.
          </p>

          <div className="space-y-1 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-400">
                Removes class restrictions for gems unlocked via quests
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-400">
                All gems start at level 1 when purchased
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400">⚠️</span>
              <span className="text-zinc-400">
                <strong>Important:</strong> Cannot access stash in The Library - bring currency in your inventory
              </span>
            </div>
          </div>

          {/* External Link */}
          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <a
              href="https://www.poewiki.net/wiki/Siosa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Learn more about Siosa</span>
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
export function SiosaUnlockBadge({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 ${className}`}>
      <span className="text-lg">🔓</span>
      <div>
        <div className="text-xs font-medium text-purple-400">Siosa Available</div>
        <div className="text-xs text-zinc-500">Complete A Fixture of Fate</div>
      </div>
    </div>
  );
}
