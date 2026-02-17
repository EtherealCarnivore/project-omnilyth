import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLeague } from '../contexts/LeagueContext';
import {
  initClusterData,
  calculateAllPairs,
  buildTradeUrl,
  getEnchantKey,
  includesEnchant,
  isNotableSelectable,
} from '../calculators/clusterJewel';
import ClusterJewelDiagram from './ClusterJewelDiagram';

export default function ClusterJewelCalculator() {
  const { league } = useLeague();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [clusterData, setClusterData] = useState(null);
  const [selectedNotables, setSelectedNotables] = useState([]);
  const [disabledNotables, setDisabledNotables] = useState(new Set());
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Lazy load the 696KB data file
  useEffect(() => {
    let cancelled = false;
    import('../data/clusterJewelData.json').then((mod) => {
      if (cancelled) return;
      const raw = mod.default;
      setData(raw);
      setClusterData(initClusterData(raw));
    });
    return () => { cancelled = true; };
  }, []);

  // Restore state from URL params on data load
  useEffect(() => {
    if (!clusterData) return;
    const s = searchParams.get('s');
    const d = searchParams.get('d');
    if (s) {
      const names = decodeURIComponent(s).split(',').filter((n) => n && clusterData.sortOrderMap[n]);
      setSelectedNotables(names);
    }
    if (d) {
      const names = decodeURIComponent(d).split(',').filter((n) => n);
      setDisabledNotables(new Set(names));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterData]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Sorted notable names for the dropdown
  const notableNames = useMemo(() => {
    if (!clusterData) return [];
    return Object.keys(clusterData.sortOrderMap).sort((a, b) => a.localeCompare(b));
  }, [clusterData]);

  // Filtered dropdown options — only show compatible notables
  const filteredOptions = useMemo(() => {
    if (!notableNames.length || !clusterData) return [];
    const available = notableNames.filter((n) =>
      !selectedNotables.includes(n) &&
      isNotableSelectable(n, selectedNotables, clusterData.sortOrderMap)
    );
    if (!query) return available.slice(0, 50);
    const q = query.toLowerCase();
    return available.filter((n) => n.toLowerCase().includes(q)).slice(0, 50);
  }, [notableNames, selectedNotables, query, clusterData]);

  // Sync URL params when selection changes
  const syncUrl = useCallback(
    (selected, disabled) => {
      const params = {};
      if (selected.length) params.s = selected.join(',');
      if (disabled.size) params.d = [...disabled].join(',');
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  const addNotable = useCallback(
    (name) => {
      setSelectedNotables((prev) => {
        if (prev.includes(name)) return prev;
        const next = [...prev, name];
        syncUrl(next, disabledNotables);
        return next;
      });
      setQuery('');
      setDropdownOpen(false);
    },
    [disabledNotables, syncUrl]
  );

  const removeNotable = useCallback(
    (name) => {
      setSelectedNotables((prev) => {
        const next = prev.filter((n) => n !== name);
        const nextDisabled = new Set(disabledNotables);
        nextDisabled.delete(name);
        setDisabledNotables(nextDisabled);
        syncUrl(next, nextDisabled);
        return next;
      });
      setResults(null);
    },
    [disabledNotables, syncUrl]
  );

  const toggleDisable = useCallback(
    (name) => {
      setDisabledNotables((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        syncUrl(selectedNotables, next);
        return next;
      });
    },
    [selectedNotables, syncUrl]
  );

  const handleCalculate = useCallback(() => {
    if (!clusterData || !data) return;
    const enabled = selectedNotables.filter((n) => !disabledNotables.has(n));
    if (enabled.length < 2) return;
    const res = calculateAllPairs(enabled, clusterData.sortOrderMap, data);
    setResults(res);
    setActiveTab(0);
  }, [clusterData, data, selectedNotables, disabledNotables]);

  // Helper: is this notable a suffix?
  const isSuffix = useCallback(
    (name) => clusterData?.sortOrderMap[name]?.Mod.CorrectGroup.includes('Suffix'),
    [clusterData]
  );

  const enabledCount = selectedNotables.filter((n) => !disabledNotables.has(n)).length;
  const successResults = results ? results.filter((r) => r.success) : [];
  const errorResults = results ? results.filter((r) => !r.success) : [];

  // Loading state
  if (!clusterData) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-4 w-96" />
        <div className="skeleton h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-amber-300">Cluster Jewel Calculator</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Find compatible &quot;middle&quot; notables for Large Cluster Jewels.
        </p>
      </div>

      {/* Info callout */}
      <div className="flex gap-3 rounded-xl bg-amber-500/[0.04] border border-amber-400/15 px-4 py-3">
        <svg className="w-5 h-5 text-amber-400/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div className="text-sm text-zinc-400 leading-relaxed">
          Select two desired notables for positions <span className="text-emerald-400/80">1</span> and <span className="text-emerald-400/80">3</span>.
          The calculator finds which notables can appear in the undesired position <span className="text-red-400/80">2</span>,
          and generates trade links filtered by cluster jewel enchant type.
        </div>
      </div>

      {/* Diagram */}
      <div className="flex justify-center">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <ClusterJewelDiagram />
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/60">
            <LegendDot className="bg-emerald-400/60" label="Desired" />
            <LegendDot className="bg-red-400/60" label="Ignored" />
            <LegendDot className="bg-sky-400/60" label="Socket" />
          </div>
        </div>
      </div>

      {/* ── Selection Section ── */}
      <div className="rounded-xl border border-white/5 bg-zinc-950/30 p-5 space-y-5">
        {/* Notable selector */}
        <div ref={wrapperRef} className="relative max-w-md">
          <label className="block text-xs font-semibold text-amber-300/80 uppercase tracking-wider mb-2">
            Add Notables
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400/50"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setDropdownOpen(true); }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search notables..."
              className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-2 pl-9 pr-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-amber-500/40 transition-colors"
            />
          </div>
          {/* Dropdown — enriched with group + enchant count */}
          {dropdownOpen && filteredOptions.length > 0 && (
            <div className="fade-in absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
              {filteredOptions.map((name) => {
                const notable = clusterData.sortOrderMap[name];
                const suffix = notable.Mod.CorrectGroup.includes('Suffix');
                const enchCount = notable.Enchantments?.length || 0;
                return (
                  <button
                    key={name}
                    onClick={() => addNotable(name)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-amber-500/10 hover:pl-4 transition-all duration-100 flex items-center gap-2"
                  >
                    {/* Prefix/Suffix dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${suffix ? 'bg-purple-400/70' : 'bg-amber-400/70'}`}
                      title={suffix ? 'Suffix' : 'Prefix'}
                    />
                    <span className="text-zinc-100 flex-1 truncate">{name}</span>
                    <span className="text-[11px] text-zinc-500 shrink-0">
                      {enchCount} enchant{enchCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[11px] text-zinc-500 shrink-0 tabular-nums w-10 text-right">
                      ilvl {notable.Mod.Level}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected notables — card-style */}
        {selectedNotables.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Selected ({enabledCount} active)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedNotables.map((name) => {
                const disabled = disabledNotables.has(name);
                const notable = clusterData.sortOrderMap[name];
                const lvl = notable?.Mod.Level;
                const suffix = isSuffix(name);
                return (
                  <div
                    key={name}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-150 ${
                      disabled
                        ? 'bg-zinc-900/30 border-zinc-800/40 opacity-50'
                        : 'bg-amber-500/[0.06] border-amber-400/20'
                    }`}
                  >
                    {/* Prefix/Suffix indicator */}
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        disabled ? 'bg-zinc-600' : suffix ? 'bg-purple-400/70' : 'bg-amber-400/70'
                      }`}
                      title={suffix ? 'Suffix' : 'Prefix'}
                    />
                    {/* Name + ilvl */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium truncate block ${disabled ? 'text-zinc-500 line-through' : 'text-amber-200'}`}>
                        {name}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        ilvl {lvl} &middot; {suffix ? 'Suffix' : 'Prefix'}
                      </span>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => toggleDisable(name)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
                        title={disabled ? 'Enable' : 'Disable'}
                      >
                        {disabled ? (
                          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-4.35-4.35" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => removeNotable(name)}
                        className="p-1.5 rounded-md hover:bg-red-500/15 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-4 h-4 text-zinc-500 hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Calculate button — prominent amber gradient */}
        <button
          onClick={handleCalculate}
          disabled={enabledCount < 2}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
            enabledCount >= 2
              ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/20 border border-amber-400/30 text-amber-200 hover:from-amber-500/35 hover:to-amber-600/30 hover:border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.08)] hover:shadow-[0_0_28px_rgba(245,158,11,0.15)]'
              : 'bg-zinc-900/40 border border-zinc-800/40 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {enabledCount >= 2 ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate
            </span>
          ) : (
            `Select ${2 - enabledCount} more notable${2 - enabledCount !== 1 ? 's' : ''}`
          )}
        </button>
      </div>

      {/* ── Divider ── */}
      {results && <div className="h-px bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" />}

      {/* ── Results Section ── */}
      {results && (
        <div className="rounded-xl border border-white/5 bg-zinc-950/30 p-5 space-y-5 fade-in">
          {/* Error results */}
          {errorResults.length > 0 && successResults.length === 0 && (
            <div className="rounded-xl bg-red-500/[0.06] border border-red-500/20 p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-2">No Valid Combinations</h3>
              <ul className="space-y-1 text-sm text-zinc-400">
                {errorResults.map((r) => (
                  <li key={`${r.notableName1}-${r.notableName3}`}>
                    <span className="text-zinc-300">{r.notableName1} + {r.notableName3}</span>: {r.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success tabs */}
          {successResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
                Results — {successResults.length} valid pair{successResults.length !== 1 ? 's' : ''}
              </h3>

              {/* Tab bar */}
              {successResults.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {successResults.map((r, i) => (
                    <button
                      key={`${r.notableName1}-${r.notableName3}`}
                      onClick={() => setActiveTab(i)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        activeTab === i
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                          : 'text-zinc-400 hover:text-zinc-200 border border-white/5 hover:border-white/10'
                      }`}
                    >
                      {r.notableName1} + {r.notableName3}
                    </button>
                  ))}
                </div>
              )}

              {/* Active tab content */}
              <ResultPanel
                result={successResults[activeTab] || successResults[0]}
                league={league}
                clusterData={clusterData}
              />

              {/* Inline errors for failed pairs */}
              {errorResults.length > 0 && (
                <div className="rounded-lg bg-zinc-950/40 border border-white/5 p-3">
                  <p className="text-xs text-zinc-500 mb-1">Incompatible pairs:</p>
                  <ul className="space-y-0.5 text-xs text-zinc-500">
                    {errorResults.map((r) => (
                      <li key={`err-${r.notableName1}-${r.notableName3}`}>
                        {r.notableName1} + {r.notableName3}: {r.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Legend dot ── */
function LegendDot({ className, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}

/* ── Result panel for a single pair ── */

function ResultPanel({ result, league, clusterData }) {
  const { notableName1, notableName3, notable1, notable3, validEnchants, notablesBetween, betweenNames } = result;
  const [middleOpen, setMiddleOpen] = useState(false);

  return (
    <div className="rounded-xl bg-zinc-950/40 border border-white/5 overflow-hidden">
      {/* Pair header */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-amber-500/[0.04] border-b border-white/5">
        <span className="text-amber-300 font-medium text-sm">{notableName1}</span>
        <span className="text-[11px] text-zinc-500 tabular-nums">ilvl {notable1.Mod.Level}</span>
        <span className="text-zinc-500 text-xs">+</span>
        <span className="text-amber-300 font-medium text-sm">{notableName3}</span>
        <span className="text-[11px] text-zinc-500 tabular-nums">ilvl {notable3.Mod.Level}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Middle notables — collapsible */}
        <div>
          <button
            onClick={() => setMiddleOpen(!middleOpen)}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-300 transition-colors group"
          >
            <svg
              className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${middleOpen ? 'rotate-90' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="uppercase tracking-wider font-semibold">
              Position 2 options
            </span>
            <span className="text-zinc-500 font-normal">({notablesBetween.length} notables)</span>
          </button>
          {middleOpen && (
            <div className="mt-2 ml-5 flex flex-wrap gap-1.5 fade-in">
              {notablesBetween.map((nObj) => (
                <span
                  key={nObj.PassiveSkill.Name}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-zinc-900/60 border border-white/5 text-zinc-300"
                >
                  {nObj.PassiveSkill.Name}
                  <span className="text-zinc-500 tabular-nums">({nObj.Mod.Level})</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Trade links by enchant — mini-cards */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">Trade Links</p>
          <div className="grid grid-cols-1 gap-1.5">
            {validEnchants.map((ench) => {
              const enchKey = getEnchantKey(ench);
              const enchValue = clusterData.enchantMap[enchKey];
              const enchLabel = enchValue ? enchValue.text : enchKey;

              const validMiddle = notablesBetween
                .filter((nObj) => includesEnchant(nObj.Enchantments, ench))
                .map((nObj) => nObj.PassiveSkill.Name);

              if (validMiddle.length === 0) return null;

              const url = buildTradeUrl(league, [notableName1, notableName3], validMiddle, ench, clusterData);

              return (
                <div
                  key={enchKey}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/30 border border-white/[0.03] hover:border-white/[0.06] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 truncate" title={enchLabel}>{enchLabel}</p>
                    <p className="text-[11px] text-zinc-500">{validMiddle.length} middle notable{validMiddle.length !== 1 ? 's' : ''}</p>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-400/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/35 transition-all duration-150"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Trade
                  </a>
                </div>
              );
            })}

            {/* Any enchant link */}
            {validEnchants.length > 1 && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-500/[0.04] border border-amber-400/10">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300">Any Enchant</p>
                  <p className="text-[11px] text-zinc-500">{betweenNames.length} middle notables &middot; all enchant types</p>
                </div>
                <a
                  href={buildTradeUrl(league, [notableName1, notableName3], betweenNames, null, clusterData)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 border border-amber-400/25 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400/40 transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Trade
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
