import { useState } from 'react';
import { Link } from 'react-router-dom';
import modules from '../modules/registry';
import YouTubeCard from '../components/YouTubeCard';

const CATEGORY_COLORS = {
  'Crafting': 'from-sky-500/20 to-sky-500/5 border-sky-500/20',
  'Atlas/Mapping': 'from-teal-500/20 to-teal-500/5 border-teal-500/20',
};

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
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [showCredits, setShowCredits] = useState(false);

  const filtered = search
    ? modules.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase())
      )
    : modules;

  return (
    <div className="space-y-8">
      {/* Banner */}
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
          className="w-full bg-zinc-900/60 border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/15 transition-all"
        />
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(mod => (
          <Link
            key={mod.id}
            to={mod.route}
            className={`group relative rounded-2xl border bg-gradient-to-br p-5 transition-all duration-150 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${
              CATEGORY_COLORS[mod.category] || 'from-zinc-800/40 to-zinc-900/40 border-white/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-zinc-400 group-hover:text-sky-400 transition-colors">
                {SUBCATEGORY_ICONS[mod.subcategory] || SUBCATEGORY_ICONS.Coloring}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-sky-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {mod.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
                    {mod.category}
                  </span>
                  <span className="text-zinc-700">&middot;</span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                    {mod.subcategory}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500 text-sm py-8">No modules match your search.</p>
      )}

      <YouTubeCard />

      {/* Credits spoiler */}
      <div className="text-center pb-4">
        <button
          onClick={() => setShowCredits(prev => !prev)}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
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
