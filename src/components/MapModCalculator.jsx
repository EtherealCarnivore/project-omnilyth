import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { regexMapModifiersRegular } from '../data/mapModsRegular';
import { regexMapModifierT17 } from '../data/mapModsT17';
import { generateMapModRegex } from '../calculators/mapModRegex';

const DEFAULT_SETTINGS = {
  badIds: [],
  goodIds: [],
  allGoodMods: false,
  quantity: '',
  optimizeQuant: false,
  packsize: '',
  optimizePacksize: false,
  itemRarity: '',
  mapDropChance: '',
  quality: { regular: '', currency: '', divination: '', rarity: '', packSize: '', scarab: '' },
  optimizeQuality: false,
  anyQuality: false,
  rarity: { normal: false, magic: false, rare: false, include: true },
  corrupted: { enabled: false, include: true },
  unidentified: { enabled: false, include: true },
};

function getScaryColor(scary) {
  if (scary > 1100) return { color: '#c084fc' };
  if (scary < 100) return { color: '#d1d5db' };
  const t = Math.min((scary - 100) / 1000, 1);
  const r = 255;
  let g, b;
  if (t < 0.5) {
    g = Math.round(255 - 75 * (t * 2));
    b = Math.round(255 - 255 * (t * 2));
  } else {
    g = Math.round(180 - 180 * ((t - 0.5) * 2));
    b = 0;
  }
  return { color: `rgb(${r},${g},${b})` };
}

/* ── Accordion section ── */
function Section({ title, defaultOpen = false, children, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-zinc-950/30 hover:bg-zinc-950/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-semibold text-teal-300 uppercase tracking-wider">{title}</span>
        </div>
        {badge}
      </button>
      {open && <div className="px-5 py-4 border-t border-white/5">{children}</div>}
    </div>
  );
}

/* ── Numeric input ── */
function NumericInput({ label, value, onChange, optimize, onOptimizeChange, showOptimize = false }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-zinc-400 w-32 shrink-0">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="calc-input text-sm py-1.5 px-3 w-24"
        placeholder="0"
      />
      {showOptimize && (
        <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={optimize}
            onChange={(e) => onOptimizeChange(e.target.checked)}
            className="accent-teal-400 w-3.5 h-3.5"
          />
          Optimize
        </label>
      )}
    </div>
  );
}

/* ── Mod row in list ── */
function ModItem({ token, selected, onClick }) {
  const style = getScaryColor(token.options.scary);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] leading-snug transition-all duration-100 group ${
        selected
          ? 'bg-teal-500/15 ring-1 ring-teal-400/40'
          : 'hover:bg-white/[0.04]'
      }`}
      title={token.rawText}
    >
      <span className="flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
          style={{ backgroundColor: style.color }}
        />
        <span style={style} className="truncate">{token.rawText}</span>
      </span>
    </button>
  );
}

/* ── Removable chip for selected mods ── */
function ModChip({ token, onRemove, color }) {
  const style = getScaryColor(token.options.scary);
  return (
    <button
      onClick={onRemove}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] leading-tight border transition-colors hover:brightness-125 ${
        color === 'red'
          ? 'bg-red-500/10 border-red-400/30 hover:bg-red-500/20'
          : 'bg-green-500/10 border-green-400/30 hover:bg-green-500/20'
      }`}
      title="Click to remove"
    >
      <span style={style} className="truncate max-w-[180px]">{token.rawText}</span>
      <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

/* ── Toggle pill ── */
function TogglePill({ left, right, active, onChange }) {
  return (
    <div className="inline-flex rounded-full bg-zinc-950/60 border border-white/5 p-0.5">
      {[left, right].map((label, i) => (
        <button
          key={label}
          onClick={() => onChange(i === 1)}
          className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            active === (i === 1)
              ? 'bg-teal-500/20 text-teal-300 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ── Tier mode selector (Regular / 16.5+ Only / All) ── */
const TIER_OPTIONS = [
  { value: 'regular', label: 'Regular' },
  { value: 't17only', label: '16.5+' },
  { value: 'all', label: 'All' },
];

function TierSelect({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full bg-zinc-950/60 border border-white/5 p-0.5">
      {TIER_OPTIONS.map(({ value: v, label }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            value === v
              ? 'bg-teal-500/20 text-teal-300 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ── Inline toggle (Corrupted / Unidentified) ── */
function InlineToggle({ label, enabled, include, onToggle, onModeChange }) {
  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
        <div
          onClick={onToggle}
          className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
            enabled ? 'bg-teal-600' : 'bg-zinc-950/80 border border-white/5'
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              enabled ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </div>
        {label}
      </label>
      {enabled && (
        <TogglePill left="Include" right="Exclude" active={!include} onChange={(v) => onModeChange(!v)} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════ */
/*               MAIN COMPONENT                */
/* ════════════════════════════════════════════ */

export default function MapModCalculator() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [tierMode, setTierMode] = useState('regular'); // 'regular' | 't17only' | 'all'
  const [badSearch, setBadSearch] = useState('');
  const [goodSearch, setGoodSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  // Build the 16.5+-only dataset: just the T17-exclusive tokens
  const regexT17Only = useMemo(() => {
    const t17Tokens = regexMapModifierT17.tokens.filter((t) => t.options.tier17);
    const t17Ids = new Set(t17Tokens.map((t) => t.id));
    const filteredTable = {};
    for (const [key, val] of Object.entries(regexMapModifierT17.optimizationTable)) {
      if (val.ids.every((id) => t17Ids.has(id))) {
        filteredTable[key] = val;
      }
    }
    return { tokens: t17Tokens, optimizationTable: filteredTable };
  }, []);

  const regex = tierMode === 'regular' ? regexMapModifiersRegular
    : tierMode === 't17only' ? regexT17Only
    : regexMapModifierT17;

  const result = useMemo(() => generateMapModRegex(settings, regex), [settings, regex]);
  const charCount = result.length;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [result]);

  const update = useCallback((fn) => {
    setSettings((prev) => {
      const next = { ...prev };
      fn(next);
      return next;
    });
  }, []);

  const toggleBad = useCallback((id) => {
    update((s) => {
      if (s.badIds.includes(id)) {
        s.badIds = s.badIds.filter((x) => x !== id);
      } else {
        s.badIds = [...s.badIds, id];
        s.goodIds = s.goodIds.filter((x) => x !== id);
      }
    });
  }, [update]);

  const toggleGood = useCallback((id) => {
    update((s) => {
      if (s.goodIds.includes(id)) {
        s.goodIds = s.goodIds.filter((x) => x !== id);
      } else {
        s.goodIds = [...s.goodIds, id];
        s.badIds = s.badIds.filter((x) => x !== id);
      }
    });
  }, [update]);

  const filteredTokensBad = useMemo(() => {
    const q = badSearch.toLowerCase();
    return regex.tokens.filter((t) => !q || t.rawText.toLowerCase().includes(q));
  }, [regex.tokens, badSearch]);

  const filteredTokensGood = useMemo(() => {
    const q = goodSearch.toLowerCase();
    return regex.tokens.filter((t) => !q || t.rawText.toLowerCase().includes(q));
  }, [regex.tokens, goodSearch]);

  const selectedBadTokens = useMemo(() =>
    settings.badIds.map((id) => regex.tokens.find((t) => t.id === id)).filter(Boolean),
    [settings.badIds, regex.tokens]
  );
  const selectedGoodTokens = useMemo(() =>
    settings.goodIds.map((id) => regex.tokens.find((t) => t.id === id)).filter(Boolean),
    [settings.goodIds, regex.tokens]
  );

  const charColor = charCount > 250 ? 'text-red-400' : charCount > 200 ? 'text-yellow-400' : 'text-green-400';
  const barWidth = Math.min((charCount / 250) * 100, 100);
  const barColor = charCount > 250 ? 'bg-red-500' : charCount > 200 ? 'bg-yellow-500' : 'bg-teal-500';

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-teal-300">Map Mod Regex Generator</h2>
        <p className="text-sm text-zinc-400 mt-1">Build regex patterns to highlight or filter map mods in-game.</p>
      </div>

      {/* ── Result Box (sticky-like prominence) ── */}
      <div ref={resultRef} className="rounded-xl bg-zinc-950/50 border border-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold text-teal-300 uppercase tracking-widest">Output</h3>
            <TierSelect value={tierMode} onChange={setTierMode} />
          </div>
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
        {/* Regex display */}
        <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-zinc-100 break-all min-h-[2.5rem] select-all leading-relaxed">
          {result || <span className="text-zinc-400/50 italic font-sans">Select mods or configure filters below...</span>}
        </div>
        {/* Char count bar */}
        <div className="mt-2 h-1 rounded-full bg-zinc-950/80 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        {charCount > 250 && (
          <p className="text-xs text-red-400/90 mt-2">Regex exceeds PoE's 250-character limit. Remove some filters or mods.</p>
        )}
      </div>

      {/* ── Filter Sections (Accordions) ── */}
      <div className="space-y-2">

        {/* Numeric Filters */}
        <Section title="Numeric Filters">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumericInput
              label="Quantity >="
              value={settings.quantity}
              onChange={(v) => update((s) => { s.quantity = v; })}
              optimize={settings.optimizeQuant}
              onOptimizeChange={(v) => update((s) => { s.optimizeQuant = v; })}
              showOptimize
            />
            <NumericInput
              label="Pack Size >="
              value={settings.packsize}
              onChange={(v) => update((s) => { s.packsize = v; })}
              optimize={settings.optimizePacksize}
              onOptimizeChange={(v) => update((s) => { s.optimizePacksize = v; })}
              showOptimize
            />
            <NumericInput
              label="Item Rarity >="
              value={settings.itemRarity}
              onChange={(v) => update((s) => { s.itemRarity = v; })}
            />
            <NumericInput
              label="Map Drop >="
              value={settings.mapDropChance}
              onChange={(v) => update((s) => { s.mapDropChance = v; })}
            />
          </div>
        </Section>

        {/* Quality */}
        <Section
          title="Quality"
          badge={
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={settings.optimizeQuality}
                  onChange={(e) => update((s) => { s.optimizeQuality = e.target.checked; })}
                  className="accent-teal-400 w-3.5 h-3.5"
                />
                Optimize
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={settings.anyQuality}
                  onChange={(e) => update((s) => { s.anyQuality = e.target.checked; })}
                  className="accent-teal-400 w-3.5 h-3.5"
                />
                Match Any
              </label>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['Regular', 'regular'],
              ['Currency', 'currency'],
              ['Divination', 'divination'],
              ['Rarity', 'rarity'],
              ['Pack Size', 'packSize'],
              ['Scarab', 'scarab'],
            ].map(([label, key]) => (
              <NumericInput
                key={key}
                label={`${label} >=`}
                value={settings.quality[key]}
                onChange={(v) =>
                  update((s) => {
                    s.quality = { ...s.quality, [key]: v };
                  })
                }
              />
            ))}
          </div>
        </Section>

        {/* Rarity / Corrupted / Unidentified */}
        <Section title="Rarity & Map State">
          <div className="space-y-4">
            {/* Rarity */}
            <div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {[
                  ['Normal', 'normal'],
                  ['Magic', 'magic'],
                  ['Rare', 'rare'],
                ].map(([label, key]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={settings.rarity[key]}
                      onChange={(e) =>
                        update((s) => {
                          s.rarity = { ...s.rarity, [key]: e.target.checked };
                        })
                      }
                      className="accent-teal-400 w-3.5 h-3.5"
                    />
                    {label}
                  </label>
                ))}
                <div className="ml-2">
                  <TogglePill
                    left="Include"
                    right="Exclude"
                    active={!settings.rarity.include}
                    onChange={(v) => update((s) => { s.rarity = { ...s.rarity, include: !v }; })}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Corrupted & Unidentified */}
            <div className="flex flex-col sm:flex-row gap-4">
              <InlineToggle
                label="Corrupted"
                enabled={settings.corrupted.enabled}
                include={settings.corrupted.include}
                onToggle={() => update((s) => { s.corrupted = { ...s.corrupted, enabled: !s.corrupted.enabled }; })}
                onModeChange={(v) => update((s) => { s.corrupted = { ...s.corrupted, include: v }; })}
              />
              <InlineToggle
                label="Unidentified"
                enabled={settings.unidentified.enabled}
                include={settings.unidentified.include}
                onToggle={() => update((s) => { s.unidentified = { ...s.unidentified, enabled: !s.unidentified.enabled }; })}
                onModeChange={(v) => update((s) => { s.unidentified = { ...s.unidentified, include: v }; })}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* ── Mod Lists ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Exclude (Bad) Mods ── */}
        <div className="rounded-xl border border-white/5 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-red-500/[0.06] border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Exclude</h3>
            </div>
            <span className="text-xs text-zinc-400 tabular-nums">{settings.badIds.length} selected</span>
          </div>
          {/* Selected chips */}
          {selectedBadTokens.length > 0 && (
            <div className="px-3 py-2 border-b border-white/5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-zinc-950/20">
              {selectedBadTokens.map((token) => (
                <ModChip key={token.id} token={token} color="red" onRemove={() => toggleBad(token.id)} />
              ))}
            </div>
          )}
          {/* Search */}
          <div className="px-3 py-2 border-b border-white/5">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={badSearch}
                onChange={(e) => setBadSearch(e.target.value)}
                placeholder="Search mods..."
                className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 pl-8 pr-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-white/5 transition-colors"
              />
            </div>
          </div>
          {/* Mod list */}
          <div className="overflow-y-auto flex-1 min-h-[320px] max-h-[500px] p-1.5 space-y-px">
            {filteredTokensBad.map((token) => (
              <ModItem
                key={token.id}
                token={token}
                selected={settings.badIds.includes(token.id)}
                onClick={() => toggleBad(token.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Include (Good) Mods ── */}
        <div className="rounded-xl border border-white/5 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-green-500/[0.06] border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider">Include</h3>
              <TogglePill
                left="Any"
                right="All"
                active={settings.allGoodMods}
                onChange={(v) => update((s) => { s.allGoodMods = v; })}
              />
            </div>
            <span className="text-xs text-zinc-400 tabular-nums">{settings.goodIds.length} selected</span>
          </div>
          {/* Selected chips */}
          {selectedGoodTokens.length > 0 && (
            <div className="px-3 py-2 border-b border-white/5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-zinc-950/20">
              {selectedGoodTokens.map((token) => (
                <ModChip key={token.id} token={token} color="green" onRemove={() => toggleGood(token.id)} />
              ))}
            </div>
          )}
          {/* Search */}
          <div className="px-3 py-2 border-b border-white/5">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={goodSearch}
                onChange={(e) => setGoodSearch(e.target.value)}
                placeholder="Search mods..."
                className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 pl-8 pr-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-white/5 transition-colors"
              />
            </div>
          </div>
          {/* Mod list */}
          <div className="overflow-y-auto flex-1 min-h-[320px] max-h-[500px] p-1.5 space-y-px">
            {filteredTokensGood.map((token) => (
              <ModItem
                key={token.id}
                token={token}
                selected={settings.goodIds.includes(token.id)}
                onClick={() => toggleGood(token.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
