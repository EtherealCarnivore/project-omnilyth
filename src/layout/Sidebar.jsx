import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getModuleTree } from '../modules/registry';
import modules from '../modules/registry';
import { usePinned } from '../contexts/PinnedContext';

const COMING_SOON = [
  { category: 'Trading/Economy', items: ['Bulk Exchange', 'Flip Tracker'] },
  { category: 'Builds', items: ['DPS Simulator', 'Passive Planner'] },
  { category: 'Utilities', items: ['Stash Valuation', 'Seed Finder'] },
];

function PinButton({ isPinned, onClick }) {
  return (
    <button
      onClick={onClick}
      title={isPinned ? 'Unpin' : 'Pin to top'}
      className={`p-0.5 rounded transition-all ${
        isPinned
          ? 'text-amber-400 opacity-100'
          : 'text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-zinc-300'
      }`}
    >
      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
        <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1-.707.707l-.71-.71-3.18 3.18a5.5 5.5 0 0 1-1.062 3.044l-.216.27a.5.5 0 0 1-.764.02L6.17 10.106l-3.64 3.647a.5.5 0 1 1-.707-.707l3.64-3.647L3.24 7.176a.5.5 0 0 1 .02-.764l.27-.216a5.5 5.5 0 0 1 3.044-1.062l3.18-3.18-.71-.71a.5.5 0 0 1 .146-.854l.636-.318z" />
      </svg>
    </button>
  );
}

function SidebarLink({ mod, onClose, isPinned, onTogglePin }) {
  if (mod.external) {
    return (
      <div className="group flex items-center">
        <a
          href={mod.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
        >
          {mod.title}
          <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <PinButton isPinned={isPinned} onClick={onTogglePin} />
      </div>
    );
  }

  return (
    <div className="group flex items-center">
      <NavLink
        to={mod.route}
        onClick={onClose}
        className={({ isActive }) => `
          flex-1 block px-3 py-1.5 rounded-lg text-sm transition-all duration-150
          ${isActive
            ? 'text-sky-400 bg-sky-400/10 font-medium'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }
        `}
      >
        {mod.title}
      </NavLink>
      <PinButton isPinned={isPinned} onClick={onTogglePin} />
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const { pinnedIds, togglePin, isPinned } = usePinned();
  const tree = useMemo(() => getModuleTree(), []);

  const pinnedModules = useMemo(
    () => pinnedIds.map(id => modules.find(m => m.id === id)).filter(Boolean),
    [pinnedIds]
  );

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

          {/* Pinned section */}
          {!filtered && pinnedModules.length > 0 && (
            <div className="mb-1">
              <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-amber-500/70 font-semibold flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1-.707.707l-.71-.71-3.18 3.18a5.5 5.5 0 0 1-1.062 3.044l-.216.27a.5.5 0 0 1-.764.02L6.17 10.106l-3.64 3.647a.5.5 0 1 1-.707-.707l3.64-3.647L3.24 7.176a.5.5 0 0 1 .02-.764l.27-.216a5.5 5.5 0 0 1 3.044-1.062l3.18-3.18-.71-.71a.5.5 0 0 1 .146-.854l.636-.318z" />
                </svg>
                Pinned
              </div>
              {pinnedModules.map(mod => (
                <div key={mod.id} className="ml-2">
                  <SidebarLink
                    mod={mod}
                    onClose={onClose}
                    isPinned={true}
                    onTogglePin={() => togglePin(mod.id)}
                  />
                </div>
              ))}
              <div className="mx-3 my-2 border-t border-white/5" />
            </div>
          )}

          {filtered ? (
            /* Search results */
            filtered.map(mod => (
              <div key={mod.id} className="ml-0">
                <SidebarLink
                  mod={mod}
                  onClose={onClose}
                  isPinned={isPinned(mod.id)}
                  onTogglePin={() => togglePin(mod.id)}
                />
              </div>
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
                    {mods.map(mod => (
                      <div key={mod.id} className="ml-2">
                        <SidebarLink
                          mod={mod}
                          onClose={onClose}
                          isPinned={isPinned(mod.id)}
                          onTogglePin={() => togglePin(mod.id)}
                        />
                      </div>
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
        <div className="border-t border-white/5 px-4 py-3">
          {/* Watermark */}
          <div className="text-center">
            <span className="text-[10px] text-zinc-700">EtherealCarnivore</span>
          </div>
        </div>
      </aside>
    </>
  );
}
