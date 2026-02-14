import { useState, useMemo, useRef, useEffect } from 'react';
import { basetypes } from '../data/itemBases';

const allBases = basetypes.flatMap((bt) =>
  bt.items.map((item) => ({ baseType: bt.name, item }))
);

export default function ItemBaseSelector({ value, onChange, rarity, onRarityChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query) return allBases.slice(0, 50);
    const q = query.toLowerCase();
    return allBases.filter(
      (b) => b.item.toLowerCase().includes(q) || b.baseType.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (base) => {
    onChange(base);
    setQuery(base.item);
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
  };

  return (
    <div className="space-y-3">
      {/* Rarity toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Rarity:</span>
        <div className="inline-flex rounded-full bg-zinc-950/60 border border-white/5 p-0.5">
          {['Rare', 'Magic'].map((r) => (
            <button
              key={r}
              onClick={() => onRarityChange(r)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                rarity === r
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Search input */}
      <div ref={wrapperRef} className="relative">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search item base type..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-2 pl-9 pr-8 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-indigo-500/40 transition-colors"
          />
          {value && (
            <button
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Selected indicator */}
        {value && (
          <div className="mt-2 flex items-center gap-2 text-xs fade-in">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/20 fade-in">
              {value.baseType}
            </span>
            <span className="text-zinc-300">{value.item}</span>
          </div>
        )}

        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <div className="fade-in absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
            {filtered.map((base) => (
              <button
                key={`${base.baseType}-${base.item}`}
                onClick={() => handleSelect(base)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-500/10 hover:pl-4 transition-all duration-100 flex items-center justify-between ${
                  value?.item === base.item && value?.baseType === base.baseType ? 'bg-indigo-500/15' : ''
                }`}
              >
                <span className="text-zinc-100">{base.item}</span>
                <span className="text-xs text-zinc-400">{base.baseType}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
