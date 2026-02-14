import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getModuleTree } from '../modules/registry';
import modules from '../modules/registry';
import { useLeague, LEAGUES } from '../contexts/LeagueContext';

const COMING_SOON = [
  { category: 'Trading/Economy', items: ['Bulk Exchange', 'Flip Tracker'] },
  { category: 'Builds', items: ['DPS Simulator', 'Passive Planner'] },
  { category: 'Utilities', items: ['Stash Valuation', 'Seed Finder'] },
];

export default function Sidebar({ open, onClose }) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const { league, setLeague } = useLeague();

  const tree = useMemo(() => getModuleTree(), []);

  const filtered = search
    ? modules.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.subcategory.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  function toggleCategory(cat) {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-zinc-950/95 backdrop-blur-xl border-r border-white/5 z-50
        flex flex-col transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand text */}
        <div className="px-5 pt-5 pb-3">
          <NavLink to="/" onClick={onClose} className="block">
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight">Project Omnilyth</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">PoE Toolkit</p>
          </NavLink>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="w-full bg-zinc-900/60 border border-white/[0.06] rounded-lg text-sm py-2 pl-9 pr-3 text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-sky-400/30 transition-colors"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {filtered ? (
            /* Search results */
            filtered.map(mod => mod.external ? (
              <a
                key={mod.id}
                href={mod.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              >
                {mod.title}
                <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <NavLink
                key={mod.id}
                to={mod.route}
                onClick={onClose}
                className={({ isActive }) => `
                  block px-3 py-2 rounded-lg text-sm transition-all duration-150
                  ${isActive
                    ? 'text-sky-400 bg-sky-400/10 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }
                `}
              >
                {mod.title}
              </NavLink>
            ))
          ) : (
            /* Grouped navigation */
            Object.entries(tree).map(([category, subcategories]) => (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold hover:text-zinc-400 transition-colors"
                >
                  {category}
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${collapsed[category] ? '' : 'rotate-90'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {!collapsed[category] && Object.entries(subcategories).map(([sub, mods]) => (
                  <div key={sub} className="mb-1">
                    <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600">
                      {sub}
                    </div>
                    {mods.map(mod => mod.external ? (
                      <a
                        key={mod.id}
                        href={mod.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="flex items-center gap-1.5 px-3 py-1.5 ml-2 rounded-lg text-sm transition-all duration-150 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                      >
                        {mod.title}
                        <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <NavLink
                        key={mod.id}
                        to={mod.route}
                        onClick={onClose}
                        className={({ isActive }) => `
                          block px-3 py-1.5 ml-2 rounded-lg text-sm transition-all duration-150
                          ${isActive
                            ? 'text-sky-400 bg-sky-400/10 font-medium'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                          }
                        `}
                      >
                        {mod.title}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}

          {/* Coming Soon */}
          {!filtered && (
            <div className="pt-4 border-t border-white/5 mt-4">
              {COMING_SOON.map(group => (
                <div key={group.category} className="mb-2">
                  <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-600 font-semibold">
                    {group.category}
                  </div>
                  {group.items.map(item => (
                    <div
                      key={item}
                      className="px-3 py-1.5 ml-2 text-sm text-zinc-600 flex items-center gap-2"
                    >
                      {item}
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 text-purple-400/70 font-medium italic whitespace-nowrap" title="We're huffing copium over here">
                        Soon&trade; <span className="not-italic">- Copium</span>
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom pinned */}
        <div className="border-t border-white/5 px-4 py-3 space-y-3">
          {/* League selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-600">League</label>
            <select
              value={league}
              onChange={e => setLeague(e.target.value)}
              className="w-full bg-zinc-900/60 border border-white/[0.06] rounded-lg text-sm py-1.5 px-2 text-zinc-300 outline-none focus:border-sky-400/30 transition-colors cursor-pointer"
            >
              {LEAGUES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Watermark */}
          <div className="text-center">
            <span className="text-[10px] text-zinc-700">EtherealCarnivore</span>
          </div>
        </div>
      </aside>
    </>
  );
}
