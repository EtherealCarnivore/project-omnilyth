/*
 * HomePage.jsx — The dashboard landing page.
 *
 * A grid of module cards with search, pinning, icons, and hover animations.
 * This file contains more inline SVG path data than actual business logic.
 * In Java, my UI is a terminal with colored log lines. It's beautiful.
 * Here I'm hand-placing SVG coordinates like a graphic designer.
 * My matching engine's entire codebase has fewer magic numbers than this
 * file has SVG path coordinates. Frontend devs have my eternal respect.
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import modules from '../modules/registry';
import YouTubeCard from '../components/YouTubeCard';
import PatchNotesWidget from '../components/PatchNotesWidget';
import LevelingModeEntryCard from '../components/LevelingModeEntryCard';
import { usePinned } from '../contexts/PinnedContext';
import { useDesign } from '../contexts/DesignContext';
import { useLevelingMode } from '../contexts/LevelingModeContext';

const CATEGORY_COLORS = {
  'Crafting': 'from-sky-500/20 to-sky-500/5 border-sky-500/20',
  'Atlas/Mapping': 'from-teal-500/20 to-teal-500/5 border-teal-500/20',
  'Build Planning': 'from-violet-500/20 to-violet-500/5 border-violet-500/20',
};

const CATEGORY_HUBS = [
  {
    name: 'Crafting',
    route: '/crafting',
    description: 'Socket coloring, linking, and item crafting calculators',
    colors: 'from-sky-500/20 to-sky-500/5 border-sky-500/20',
    hoverAccent: 'group-hover:text-sky-400',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    name: 'Atlas / Mapping',
    route: '/atlas',
    description: 'Map mod filtering and scarab regex tools',
    colors: 'from-teal-500/20 to-teal-500/5 border-teal-500/20',
    hoverAccent: 'group-hover:text-teal-400',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 2L3 7v13l6-4 6 4 6-4V3l-6 4-6-4z" />
      </svg>
    ),
  },
  {
    name: 'Build Planning',
    route: '/build',
    description: 'Jewel calculators and build optimization tools',
    colors: 'from-violet-500/20 to-violet-500/5 border-violet-500/20',
    hoverAccent: 'group-hover:text-violet-400',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

const SUBCATEGORY_ICONS = {
  Coloring: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
    </svg>
  ),
  Linking: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  Socketing: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Maps: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 2L3 7v13l6-4 6 4 6-4V3l-6 4-6-4z" />
    </svg>
  ),
  'Cluster Jewels': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="8" r="3" /><circle cx="7" cy="16" r="3" /><circle cx="17" cy="16" r="3" />
    </svg>
  ),
  'Timeless Jewels': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

const PIN_ICON = (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1-.707.707l-.71-.71-3.18 3.18a5.5 5.5 0 0 1-1.062 3.044l-.216.27a.5.5 0 0 1-.764.02L6.17 10.106l-3.64 3.647a.5.5 0 1 1-.707-.707l3.64-3.647L3.24 7.176a.5.5 0 0 1 .02-.764l.27-.216a5.5 5.5 0 0 1 3.044-1.062l3.18-3.18-.71-.71a.5.5 0 0 1 .146-.854l.636-.318z" />
  </svg>
);

function PinButton({ pinned, onToggle }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
      title={pinned ? 'Unpin' : 'Pin to top'}
      className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all ${
        pinned
          ? 'text-amber-400 opacity-100 bg-amber-400/10'
          : 'text-zinc-600/50 group-hover:opacity-100 hover:text-zinc-300 hover:bg-white/[0.06]'
      }`}
    >
      {PIN_ICON}
    </button>
  );
}

// Each card is either a <Link> or an <a> depending on whether the module is external.
// In Java I'd use a sealed interface with pattern matching: case Internal i -> ... case External e -> ...
// In JS I use `mod.external ? ... : ...` and trust that the field exists. No compiler, no safety net.
function ModuleCard({ mod, pinned, onTogglePin }) {
  const cardClass = `group relative rounded-2xl border bg-gradient-to-br p-5 transition-all duration-150 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${
    CATEGORY_COLORS[mod.category] || 'from-zinc-800/40 to-zinc-900/40 border-white/5'
  }`;

  const cardContent = (
    <>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5 text-zinc-400 group-hover:text-sky-400 transition-colors">
          {SUBCATEGORY_ICONS[mod.subcategory] || SUBCATEGORY_ICONS.Coloring}
        </div>
        <div className="min-w-0 pr-6">
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
            {mod.title}
            {mod.external && (
              <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            {mod.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              {mod.category}
            </span>
            <span className="text-zinc-500">&middot;</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">
              {mod.subcategory}
            </span>
          </div>
        </div>
      </div>
      <PinButton pinned={pinned} onToggle={onTogglePin} />
    </>
  );

  return mod.external ? (
    <a
      href={mod.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
    >
      {cardContent}
    </a>
  ) : (
    <Link to={mod.route} className={cardClass}>
      {cardContent}
    </Link>
  );
}

function CategoryHubCard({ hub }) {
  const toolCount = modules.filter(m =>
    m.category === hub.name || (hub.name === 'Atlas / Mapping' && m.category === 'Atlas/Mapping')
  ).length;

  return (
    <Link
      to={hub.route}
      className={`group relative rounded-2xl border bg-gradient-to-br p-8 transition-all duration-150 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${hub.colors}`}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 text-zinc-400 ${hub.hoverAccent} transition-colors`}>
          {hub.icon}
        </div>
        <div className="min-w-0">
          <h3 className={`text-lg font-semibold text-zinc-100 ${hub.hoverAccent} transition-colors`}>
            {hub.name}
          </h3>
          <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
            {hub.description}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
            </span>
            <span className={`text-xs ${hub.hoverAccent} text-zinc-500 transition-colors flex items-center gap-1`}>
              Explore
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [showCredits, setShowCredits] = useState(false);
  const { pinnedIds, togglePin, isPinned } = usePinned();
  const { variant } = useDesign();
  const { isActive: isLevelingMode } = useLevelingMode();

  const pinnedModules = useMemo(
    () => pinnedIds.map(id => modules.find(m => m.id === id)).filter(Boolean),
    [pinnedIds]
  );

  const filtered = search
    ? modules.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase())
      )
    : modules;

  return (
    <div className="space-y-8">
      {/* Banner — negative margins to crop the image. CSS crimes in broad daylight. */}
      <a
        href="https://github.com/EtherealCarnivore"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 group"
        style={{ maxHeight: '120px' }}
      >
        <div className="overflow-hidden" style={{ margin: '-25% 0' }}>
          <img
            src={`${import.meta.env.BASE_URL}BANNER.png`}
            alt="Project Omnilyth"
            className="w-full h-auto object-cover group-hover:brightness-110 transition-all duration-300"
          />
        </div>
      </a>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search modules..."
          className="w-full bg-zinc-900/80 border border-white/[0.12] rounded-xl py-3 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/15 transition-all"
        />
      </div>

      {/* Leveling Mode Entry Card - Only show when not in mode and not searching */}
      {!search && !isLevelingMode && <LevelingModeEntryCard />}

      {/* Patch Notes Widget */}
      {!search && <PatchNotesWidget />}

      {/* Pinned Section */}
      {!search && pinnedModules.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="text-amber-500/70">{PIN_ICON}</span>
            <h2 className="text-xs font-semibold text-amber-500/70 uppercase tracking-widest">Pinned</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedModules.map(mod => (
              <ModuleCard
                key={`pinned-${mod.id}`}
                mod={mod}
                pinned={true}
                onTogglePin={() => togglePin(mod.id)}
              />
            ))}
          </div>
          <div className="border-t border-white/5" />
        </div>
      )}

      {/* v2 + no search: category hub cards */}
      {variant === 'v2' && !search ? (
        <>
          <div className="flex items-center gap-2 px-1 -mb-4">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CATEGORY_HUBS.map(hub => (
              <CategoryHubCard key={hub.name} hub={hub} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* All Modules heading */}
          {!search && pinnedModules.length > 0 && (
            <div className="flex items-center gap-2 px-1 -mb-4">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">All Modules</h2>
            </div>
          )}

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(mod => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                pinned={isPinned(mod.id)}
                onTogglePin={() => togglePin(mod.id)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-zinc-500 text-sm py-8">No modules match your search.</p>
          )}
        </>
      )}

      <YouTubeCard />

      {/* Credits spoiler */}
      <div className="text-center pb-4">
        <button
          onClick={() => setShowCredits(prev => !prev)}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {showCredits ? 'Hide credits ▲' : 'Credits ▼'}
        </button>
        {showCredits && (
          <footer className="text-xs text-zinc-500 space-y-1 mt-2 animate-in fade-in">
            <p>
              Originally made by <a href="https://www.pathofexile.com/account/view-profile/Siveran" className="underline hover:text-zinc-300 transition-colors">Siveran</a>.
              Tainted, Blanching, Jeweller's &amp; Fusing by <a href="https://github.com/EtherealCarnivore" className="underline hover:text-zinc-300 transition-colors">Carnivore</a>.
            </p>
            <p>
              Prices from <a href="https://poe.ninja" className="underline hover:text-zinc-300 transition-colors">poe.ninja</a>
              {' '}&bull;{' '}
              <a href="https://github.com/Siveran/siveran.github.io" className="underline hover:text-zinc-300 transition-colors">Source Code</a>
              {' '}&bull;{' '}CC0 2026
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
