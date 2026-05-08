/**
 * YouTubeCard.jsx — Featured creator card, two variants.
 *
 * variant="dashboard" (default): big card with banner image, avatar,
 * handle, and red Subscribe pill. Wrapped in the user's signature runic
 * framing (`ᛃ IV ᛃ` / `❤️`). Mounted on HomePage above the category
 * hubs as a tasteful credit, hidden during search.
 *
 * variant="sidebar": compact pill — 32px avatar + name + handle + small
 * external-link icon. No banner, no Subscribe pill, no runic framing.
 * Sits at the bottom of the sidebar above the legal/byline footer,
 * persistent across every page.
 *
 * Game-aware via useGame() + src/config/featuredCreators.js. When the
 * active game's creator is null (PoE 2 default today), the component
 * renders nothing — no placeholder copy.
 */
import { useGame } from '../contexts/GameContext';
import { FEATURED_CREATORS } from '../config/featuredCreators';

function avatarFallback(creator) {
  return (e) => {
    const parent = e.target.parentElement;
    e.target.style.display = 'none';
    const fb = document.createElement('div');
    fb.className = 'w-full h-full flex items-center justify-center font-bold text-red-400 bg-zinc-800/60';
    fb.textContent = creator.name[0];
    parent.appendChild(fb);
  };
}

export default function YouTubeCard({ variant = 'dashboard' }) {
  const { game } = useGame();
  const creator = FEATURED_CREATORS[game];
  if (!creator) return null;

  if (variant === 'sidebar') return <SidebarPill creator={creator} />;
  return <DashboardTile creator={creator} />;
}

function SidebarPill({ creator }) {
  return (
    <div className="border-t border-white/5 px-3 py-3 space-y-1">
      <div className="px-2 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
        Featured Creator
      </div>
      <a
        href={creator.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${creator.name} on YouTube — opens in a new tab`}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] motion-safe:transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800/60 shrink-0">
          <img
            src={creator.avatar}
            alt=""
            className="w-full h-full object-cover"
            onError={avatarFallback(creator)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-zinc-200 font-medium text-sm truncate">{creator.name}</p>
          <p className="text-zinc-500 text-[10px] truncate">{creator.handle}</p>
        </div>
        <svg
          className="w-3 h-3 text-zinc-600 group-hover:text-red-400 motion-safe:transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

function DashboardTile({ creator }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-red-500/70" aria-hidden="true">▶</span>
        <h2 className="text-xs font-semibold text-red-500/70 uppercase tracking-widest">
          Featured Creator
        </h2>
      </div>
      <div className="max-w-md mx-auto">
        <p className="text-2xl text-center mb-3" aria-hidden="true">ᛃ IV ᛃ</p>
        <a
          href={creator.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${creator.name} on YouTube — opens in a new tab`}
          className="block rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-900/40 hover:border-red-500/40 motion-safe:transition-all motion-safe:duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          {/* Banner */}
          <div className="h-20 sm:h-24 overflow-hidden bg-gradient-to-r from-red-900/40 via-zinc-900/40 to-red-900/40">
            <img
              src={creator.banner}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Profile section */}
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800/60 shrink-0">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-full h-full object-cover"
                onError={avatarFallback(creator)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-zinc-100 font-semibold text-sm truncate">{creator.name}</p>
              <p className="text-zinc-400 text-xs">{creator.handle}</p>
            </div>

            <span className="shrink-0 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold group-hover:bg-red-500 motion-safe:transition-colors">
              Subscribe
            </span>
          </div>
        </a>
        <p className="text-2xl text-center mt-3" aria-hidden="true">❤️</p>
      </div>
    </div>
  );
}
