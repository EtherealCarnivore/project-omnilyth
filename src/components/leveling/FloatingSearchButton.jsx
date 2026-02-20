/**
 * FloatingSearchButton
 * Mobile-optimized Floating Action Button (FAB) for quick gem search
 * Shows on mobile, hides on desktop (where sidebar is available)
 */

export default function FloatingSearchButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        lg:hidden fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full
        bg-amber-500 hover:bg-amber-600
        text-white
        shadow-lg hover:shadow-xl
        transition-all duration-200
        flex items-center justify-center
        active:scale-95
        ${className}
      `}
      aria-label="Search gems (Ctrl+G)"
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping pointer-events-none"></span>

      {/* Keyboard hint badge (desktop hover) */}
      <span className="hidden lg:block absolute -top-2 -left-12 px-2 py-1 bg-zinc-900 text-zinc-300 text-xs rounded border border-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Ctrl+G
      </span>
    </button>
  );
}

/**
 * Compact version for less prominent placement
 */
export function CompactFloatingSearchButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        lg:hidden fixed bottom-20 right-6 z-40
        w-12 h-12 rounded-full
        bg-zinc-800 hover:bg-zinc-700
        border border-amber-500/30 hover:border-amber-500/50
        text-amber-400
        shadow-md hover:shadow-lg
        transition-all duration-200
        flex items-center justify-center
        active:scale-95
        ${className}
      `}
      aria-label="Search gems"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </button>
  );
}
