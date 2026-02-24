/*
 * AtlasSearchBar.jsx — Search nodes by name or stat text.
 * Highlights matching nodes on the tree. Shows match count.
 */

import { useAtlasTree } from '../../contexts/AtlasTreeContext';

export default function AtlasSearchBar() {
  const { searchQuery, setSearchQuery, searchResults } = useAtlasTree();

  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search nodes..."
        className="w-full bg-zinc-900/80 border border-white/10 rounded-lg text-sm py-2 pl-9 pr-8 text-zinc-300 placeholder:text-zinc-500 outline-none focus:border-sky-400/30 transition-colors"
      />
      {searchQuery && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="text-[10px] text-zinc-500">
            {searchResults.size} {searchResults.size === 1 ? 'match' : 'matches'}
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-zinc-500 hover:text-zinc-300 p-0.5"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
