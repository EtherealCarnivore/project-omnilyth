import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLeague } from '../contexts/LeagueContext';
import { scarabs, scarabList } from '../data/scarabData';
import { generateScarabRegexes } from '../calculators/scarabRegex';

const isDev = import.meta.env.DEV;

function ninjaUrl(path) {
  if (isDev) return `/api/poe-ninja${path}`;
  return `https://corsproxy.io/?url=${encodeURIComponent(`https://poe.ninja${path}`)}`;
}

function RegexOutputBox({ regex, index, total }) {
  const [copied, setCopied] = useState(false);
  const charCount = regex.length;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(regex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [regex]);

  const charColor = charCount > 250 ? 'text-red-400' : charCount > 200 ? 'text-yellow-400' : 'text-green-400';
  const barWidth = Math.min((charCount / 250) * 100, 100);
  const barColor = charCount > 250 ? 'bg-red-500' : charCount > 200 ? 'bg-yellow-500' : 'bg-teal-500';

  return (
    <div className="rounded-xl bg-zinc-950/50 border border-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-teal-300 uppercase tracking-widest">
          {total > 1 ? `Output ${index + 1} of ${total}` : 'Output'}
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono tabular-nums ${charColor}`}>
            {charCount}<span className="text-zinc-400/60">/250</span>
          </span>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              copied
                ? 'bg-teal-500/30 text-teal-200 border border-teal-400/40'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-white/5 hover:border-white/10'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-zinc-100 break-all min-h-[2.5rem] select-all leading-relaxed">
        {regex}
      </div>
      <div className="mt-2 h-1 rounded-full bg-zinc-950/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}

export default function ScarabCalculator() {
  const { league } = useLeague();
  const [selected, setSelected] = useState(new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [prices, setPrices] = useState(new Map());
  const [priceLoading, setPriceLoading] = useState(false);

  // Fetch scarab prices from poe.ninja
  useEffect(() => {
    if (!league) return;
    setPriceLoading(true);
    const url = ninjaUrl(`/poe1/api/economy/stash/current/item/overview?league=${encodeURIComponent(league)}&type=Scarab`);
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const map = new Map();
        for (const line of data.lines || []) {
          map.set(line.name, line.chaosValue);
        }
        setPrices(map);
      })
      .catch(() => {})
      .finally(() => setPriceLoading(false));
  }, [league]);

  const regexes = useMemo(() => generateScarabRegexes([...selected]), [selected]);

  const toggleScarab = useCallback((name) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleAutoSelect = useCallback(() => {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    setSelected(prev => {
      const next = new Set(prev);
      for (const s of scarabList) {
        const price = prices.get(s.name);
        if (price != null && price >= min && price <= max) {
          next.add(s.name);
        }
      }
      return next;
    });
  }, [minPrice, maxPrice, prices]);

  const handleReset = useCallback(() => {
    setSelected(new Set());
    setMinPrice('');
    setMaxPrice('');
  }, []);

  // Selected scarabs on top, then sort by price descending within each group
  const sortedScarabs = useMemo(() => {
    const filtered = search.length >= 2
      ? scarabList.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      : scarabList;
    return [...filtered].sort((a, b) => {
      const sa = selected.has(a.name) ? 0 : 1;
      const sb = selected.has(b.name) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      const pa = prices.get(a.name) ?? -1;
      const pb = prices.get(b.name) ?? -1;
      return pb - pa;
    });
  }, [search, prices, selected]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-teal-300">Scarab Regex Generator</h2>
        <p className="text-sm text-zinc-400 mt-1">Select scarabs to generate a stash search regex. Auto-select cheap scarabs by price range.</p>
      </div>

      {/* Output Box(es) */}
      {regexes.length === 0 ? (
        <div className="rounded-xl bg-zinc-950/50 border border-white/5 p-4">
          <h3 className="text-xs font-semibold text-teal-300 uppercase tracking-widest mb-3">Output</h3>
          <div className="bg-black/30 rounded-lg p-3 font-mono text-sm min-h-[2.5rem] leading-relaxed">
            <span className="text-zinc-400/50 italic font-sans">Select scarabs below to generate regex...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {regexes.map((r, i) => (
            <RegexOutputBox key={i} regex={r} index={i} total={regexes.length} />
          ))}
          {regexes.length > 1 && (
            <p className="text-xs text-zinc-400">
              Selection requires {regexes.length} searches. Copy and paste each regex into your stash separately.
            </p>
          )}
        </div>
      )}

      {/* Auto-Select Row */}
      <div className="rounded-xl bg-zinc-950/30 border border-white/5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAutoSelect}
            disabled={priceLoading || prices.size === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-500/15 text-teal-300 border border-teal-400/30 hover:bg-teal-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Auto-select by price
          </button>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-400">Min</label>
            <input
              type="text"
              inputMode="numeric"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="0"
              className="calc-input text-sm py-1.5 px-3 w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-400">Max</label>
            <input
              type="text"
              inputMode="numeric"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="any"
              className="calc-input text-sm py-1.5 px-3 w-20"
            />
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-white/5 hover:border-white/10 transition-colors"
          >
            Reset
          </button>
          {priceLoading && <span className="text-xs text-zinc-400 animate-pulse">Loading prices...</span>}
          {!priceLoading && prices.size > 0 && (
            <span className="text-xs text-zinc-500">{selected.size} selected</span>
          )}
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search scarabs..."
          className="calc-input text-sm py-2 px-4 w-full sm:w-72"
        />
      </div>

      {/* Scarab Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedScarabs.map(scarab => {
          const isSelected = selected.has(scarab.name);
          const price = prices.get(scarab.name);
          return (
            <button
              key={scarab.name}
              onClick={() => toggleScarab(scarab.name)}
              title={scarab.description}
              className={`group relative flex items-start gap-2.5 p-3 rounded-xl text-left transition-all duration-150 ${
                isSelected
                  ? 'bg-teal-500/15 ring-1 ring-teal-400/40'
                  : 'bg-zinc-950/30 hover:bg-white/[0.04] border border-white/5'
              }`}
            >
              <img
                src={scarab.icon}
                alt=""
                className="w-8 h-8 shrink-0 mt-0.5"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] leading-snug text-zinc-200 group-hover:text-zinc-50 transition-colors">
                  {scarab.name}
                </div>
                {price != null && (
                  <div className="text-xs text-amber-400/80 mt-1 tabular-nums">
                    {price.toFixed(1)}c
                  </div>
                )}
                {price == null && !priceLoading && (
                  <div className="text-xs text-zinc-500/50 mt-1">--</div>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
