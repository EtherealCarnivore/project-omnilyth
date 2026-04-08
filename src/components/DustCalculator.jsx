import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLeague } from '../contexts/LeagueContext';
import { dustData } from '../data/dustValues';
import { ninjaUrl } from '../utils/proxyUrl';

const UNIQUE_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'UniqueWeapon', label: 'Weapons' },
  { value: 'UniqueArmour', label: 'Armour' },
  { value: 'UniqueAccessory', label: 'Accessories' },
  { value: 'UniqueFlask', label: 'Flasks' },
  { value: 'UniqueJewel', label: 'Jewels' },
];

const SORT_OPTIONS = [
  { value: 'dustPerChaos', label: 'Dust / Chaos' },
  { value: 'dustPerChaosPerSlot', label: 'Dust / Chaos / Slot' },
  { value: 'dust', label: 'Dust Value' },
  { value: 'price', label: 'Price (Chaos)' },
];

// Build a lookup map from dust data: key = "name|baseType"
const dustMap = new Map();
for (const item of dustData) {
  dustMap.set(`${item.n}|${item.b}`, item);
}

function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

export default function DustCalculator() {
  const { league } = useLeague();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dustPerChaos');
  const [sortDir, setSortDir] = useState('desc');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const types = ['UniqueWeapon', 'UniqueArmour', 'UniqueAccessory', 'UniqueFlask', 'UniqueJewel'];
      const results = await Promise.all(
        types.map(async (type) => {
          const url = ninjaUrl(`/poe1/api/economy/stash/current/item/overview?league=${encodeURIComponent(league)}&type=${type}`);
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch ${type}`);
          const data = await res.json();
          return (data.lines || []).map((item) => ({ ...item, _ninjaType: type }));
        })
      );
      setPrices(results.flat());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [league]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  // Merge poe.ninja prices with dust data
  const mergedItems = useMemo(() => {
    const items = [];
    for (const p of prices) {
      const key = `${p.name}|${p.baseType}`;
      let dust = dustMap.get(key);
      // Fallback: strip "Foulborn " prefix (transfigured uniques)
      if (!dust && p.name.startsWith('Foulborn ')) {
        dust = dustMap.get(`${p.name.slice(9)}|${p.baseType}`);
      }
      if (!dust || !p.chaosValue || p.chaosValue <= 0) continue;

      const dustPerChaos = dust.d / p.chaosValue;
      const dustPerChaosPerSlot = dustPerChaos / dust.s;

      items.push({
        name: p.name,
        baseType: p.baseType,
        icon: p.icon,
        chaosValue: p.chaosValue,
        divineValue: p.divineValue,
        dustValue: dust.d,
        goldCost: dust.g,
        slots: dust.s,
        dustPerChaos,
        dustPerChaosPerSlot,
        ninjaType: p._ninjaType,
        detailsId: p.detailsId,
        links: p.links,
        variant: p.variant,
        listingCount: p.listingCount || p.count,
      });
    }
    return items;
  }, [prices]);

  // Filter and sort
  const displayItems = useMemo(() => {
    let filtered = mergedItems;

    if (typeFilter !== 'all') {
      filtered = filtered.filter((i) => i.ninjaType === typeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((i) => i.name.toLowerCase().includes(q) || i.baseType.toLowerCase().includes(q));
    }
    if (maxPrice && Number(maxPrice) > 0) {
      filtered = filtered.filter((i) => i.chaosValue <= Number(maxPrice));
    }

    filtered.sort((a, b) => {
      const mul = sortDir === 'desc' ? -1 : 1;
      const va = a[sortBy] ?? 0;
      const vb = b[sortBy] ?? 0;
      return (va - vb) * mul;
    });

    return filtered;
  }, [mergedItems, typeFilter, search, sortBy, sortDir, maxPrice]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return null;
    return <span className="ml-1 text-teal-400">{sortDir === 'desc' ? '\u25BC' : '\u25B2'}</span>;
  };

  const tradeUrl = (item) => {
    const body = {
      query: {
        status: { option: 'securable' },
        name: item.name,
        type: item.baseType,
      },
      sort: { price: 'asc' },
    };
    const encoded = encodeURIComponent(JSON.stringify(body));
    return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}?q=${encoded}`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-teal-300">Dust Calculator</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Find the most efficient unique items to disenchant for Thaumaturgic Dust.
          Prices from poe.ninja, dust values at ilvl 84 / q20.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Category */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Category</label>
          <div className="inline-flex rounded-full bg-zinc-950/60 border border-white/5 p-0.5">
            {UNIQUE_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  typeFilter === value
                    ? 'bg-teal-500/20 text-teal-300 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-zinc-400 mb-1">Search</label>
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Item name..."
              className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 pl-8 pr-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-teal-400/30 transition-colors"
            />
          </div>
        </div>

        {/* Max price */}
        <div className="w-32">
          <label className="block text-xs text-zinc-400 mb-1">Max Price (c)</label>
          <input
            type="text"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="No limit"
            className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 px-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-teal-400/30 transition-colors"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 px-3 text-zinc-100 outline-none focus:border-teal-400/30 transition-colors"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchPrices}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-white/5 hover:border-white/10 transition-all duration-200 disabled:opacity-40"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span>{displayItems.length} items</span>
        {mergedItems.length > 0 && <span className="text-zinc-400/40">({mergedItems.length} total matched)</span>}
        {error && <span className="text-red-400">Error: {error}</span>}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-zinc-400">
          <div className="inline-block w-6 h-6 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mb-3" />
          <p className="text-sm">Fetching prices from poe.ninja...</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-white/5">
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-12">#</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Item</th>
                  <th
                    className="text-right px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap"
                    onClick={() => handleSort('chaosValue')}
                  >
                    Price<SortIcon col="chaosValue" />
                  </th>
                  <th
                    className="text-right px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap"
                    onClick={() => handleSort('dustValue')}
                  >
                    Dust<SortIcon col="dustValue" />
                  </th>
                  <th
                    className="text-right px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap"
                    onClick={() => handleSort('dustPerChaos')}
                  >
                    Dust/c<SortIcon col="dustPerChaos" />
                  </th>
                  <th
                    className="text-right px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap"
                    onClick={() => handleSort('dustPerChaosPerSlot')}
                  >
                    Dust/c/slot<SortIcon col="dustPerChaosPerSlot" />
                  </th>
                  <th className="text-right px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Gold</th>
                  <th className="text-center px-3 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Trade</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.slice(0, 200).map((item, i) => (
                  <tr
                    key={`${item.name}-${item.baseType}-${item.variant || ''}-${item.links || ''}`}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-3 py-2 text-zinc-400/50 tabular-nums">{i + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt=""
                            className="w-7 h-7 object-contain shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="text-zinc-100 truncate font-medium">
                            {item.name}
                            {item.links === 6 && <span className="ml-1.5 text-[10px] text-amber-400/80 font-normal">6L</span>}
                            {item.variant && <span className="ml-1.5 text-[10px] text-zinc-400/60 font-normal">{item.variant}</span>}
                          </div>
                          <div className="text-[11px] text-zinc-400/50 truncate">{item.baseType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-zinc-300 tabular-nums whitespace-nowrap">
                      {item.divineValue >= 1
                        ? <>{item.divineValue.toFixed(1)}<span className="text-amber-400/60 text-[10px] ml-0.5">div</span></>
                        : <>{Math.round(item.chaosValue).toLocaleString()}<span className="text-yellow-400/60 text-[10px] ml-0.5">c</span></>
                      }
                    </td>
                    <td className="px-3 py-2 text-right text-zinc-300 tabular-nums">{formatNumber(item.dustValue)}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium">
                      <span className={item.dustPerChaos >= 30000 ? 'text-green-400' : item.dustPerChaos >= 10000 ? 'text-teal-300' : 'text-zinc-300'}>
                        {formatNumber(item.dustPerChaos)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-zinc-400">{formatNumber(item.dustPerChaosPerSlot)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-zinc-400/60 text-[11px]">{formatNumber(item.goldCost)}</td>
                    <td className="px-3 py-2 text-center">
                      <a
                        href={tradeUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-teal-300 transition-colors"
                        title="Search on trade"
                      >
                        <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {displayItems.length > 200 && (
            <div className="text-center py-3 text-xs text-zinc-400/60 border-t border-white/5">
              Showing first 200 of {displayItems.length} items
            </div>
          )}
          {displayItems.length === 0 && !loading && (
            <div className="text-center py-12 text-zinc-400/60 text-sm">
              No items match your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
