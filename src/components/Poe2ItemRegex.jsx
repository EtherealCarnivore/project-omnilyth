/**
 * Poe2ItemRegex.jsx — Item Mod Regex generator for PoE 2.
 *
 * Pick an item type → check the mods you want → get stash-search regex.
 * Output is split into multiple chunks if it would exceed PoE's 250-char
 * search limit (each chunk pasted into a separate stash search).
 *
 * Lives in src/components/, NOT src/calculators/ — this is a pattern
 * generator, not a calculator. No probability math.
 */
import { useEffect, useMemo, useState } from 'react';
import itemModsData from '../data/poe2/itemMods.json';
import { generateRegex } from '../lib/poe2Regex';

const ITEM_TYPES = Object.keys(itemModsData).filter((k) => !k.startsWith('_'));
const STORAGE_KEY = 'omnilyth_poe2_item_regex_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      itemType: parsed.itemType || ITEM_TYPES[0],
      selected: new Set(parsed.selected || []),
      minValues: new Map(parsed.minValues || []),
      round10: Boolean(parsed.round10),
    };
  } catch {
    return null;
  }
}

function saveState(itemType, selected, minValues, round10) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ itemType, selected: [...selected], minValues: [...minValues], round10 })
    );
  } catch {
    /* storage disabled / quota — ignore */
  }
}

export default function Poe2ItemRegex() {
  const [itemType, setItemType] = useState(() => loadState()?.itemType ?? ITEM_TYPES[0]);
  const [selected, setSelected] = useState(() => loadState()?.selected ?? new Set());
  const [minValues, setMinValues] = useState(() => loadState()?.minValues ?? new Map());
  const [round10, setRound10] = useState(() => loadState()?.round10 ?? false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Persist tool state across page reloads.
  useEffect(() => {
    saveState(itemType, selected, minValues, round10);
  }, [itemType, selected, minValues, round10]);

  const mods = itemModsData[itemType] || [];
  const prefixes = useMemo(() => mods.filter((m) => m.affix === 'PREFIX'), [mods]);
  const suffixes = useMemo(() => mods.filter((m) => m.affix === 'SUFFIX'), [mods]);

  const chunks = useMemo(() => {
    const picked = mods
      .filter((m) => selected.has(`${itemType}|${m.text}`))
      .map((m) => ({ ...m, minValue: minValues.get(`${itemType}|${m.text}`) }));
    // Pool = all mods for this item type, so unique-fragment computation
    // disambiguates across just the candidates this item could roll.
    return generateRegex(picked, mods, { round10 });
  }, [mods, selected, itemType, minValues, round10]);

  function toggleMod(mod) {
    const key = `${itemType}|${mod.text}`;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function setMinValue(mod, raw) {
    const key = `${itemType}|${mod.text}`;
    const parsed = raw === '' ? null : Number(raw);
    setMinValues((prev) => {
      const next = new Map(prev);
      if (parsed === null || isNaN(parsed) || parsed <= 0) next.delete(key);
      else next.set(key, parsed);
      return next;
    });
  }

  function clearItemTypeSelection() {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const key of Array.from(next)) {
        if (key.startsWith(`${itemType}|`)) next.delete(key);
      }
      return next;
    });
    setMinValues((prev) => {
      const next = new Map(prev);
      for (const key of Array.from(next.keys())) {
        if (key.startsWith(`${itemType}|`)) next.delete(key);
      }
      return next;
    });
  }

  function copyChunk(chunk, idx) {
    navigator.clipboard.writeText(chunk).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  }

  const totalSelectedHere = mods.filter((m) => selected.has(`${itemType}|${m.text}`)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            Path of Exile 2
          </span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">Item Mod Regex</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Pick an item type and the mods you want to find. Output is a compact
          stash-search pattern — each selected mod becomes the shortest
          unique-substring fragment relative to the rest of that item type's
          pool. Patterns split across multiple chunks if any single one would
          exceed PoE's 50-character search limit.
        </p>
      </div>

      {/* Type selector + selection state + global toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            Item type
          </label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="bg-zinc-900/80 border border-white/[0.12] rounded-lg px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15"
          >
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {totalSelectedHere > 0 && (
            <button
              type="button"
              onClick={clearItemTypeSelection}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline-offset-2 hover:underline"
            >
              Clear ({totalSelectedHere})
            </button>
          )}
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={round10}
            onChange={(e) => setRound10(e.target.checked)}
            className="accent-cyan-500"
          />
          <span>Round min values down to nearest 10</span>
        </label>
      </div>

      {/* Mod selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModColumn
          label="Prefixes"
          mods={prefixes}
          itemType={itemType}
          selected={selected}
          minValues={minValues}
          onToggle={toggleMod}
          onSetMin={setMinValue}
        />
        <ModColumn
          label="Suffixes"
          mods={suffixes}
          itemType={itemType}
          selected={selected}
          minValues={minValues}
          onToggle={toggleMod}
          onSetMin={setMinValue}
        />
      </div>

      {/* Output */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Regex output</h2>
        {chunks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.08] bg-zinc-900/40 p-4 text-sm text-zinc-500">
            Select one or more mods above to generate a stash-search pattern.
          </div>
        ) : (
          <div className="space-y-2">
            {chunks.map((chunk, idx) => (
              <div key={idx} className="rounded-xl border border-white/[0.06] bg-zinc-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    {chunks.length === 1 ? 'Pattern' : `Pattern ${idx + 1} of ${chunks.length}`}
                  </span>
                  <span className={`text-[10px] font-mono tabular-nums ${chunk.length > 50 ? 'text-red-400 font-semibold' : 'text-zinc-600'}`} title={chunk.length > 50 ? 'Pattern exceeds PoE 2 50-character search limit — consider dropping a min-value or trimming selection.' : undefined}>
                    {chunk.length}/50
                  </span>
                </div>
                <code className="block text-xs text-cyan-200 font-mono break-all leading-relaxed">
                  {chunk}
                </code>
                <button
                  type="button"
                  onClick={() => copyChunk(chunk, idx)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  {copiedIdx === idx ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coverage note */}
      <p className="text-xs text-zinc-600 leading-relaxed">
        v1 dataset is hand-curated and covers common affixes per item type
        (~10–18 each). Specialty mods, tier ranges, and full coverage will land
        in a future data refresh against poe2db.tw.
      </p>
    </div>
  );
}

function ModColumn({ label, mods, itemType, selected, minValues, onToggle, onSetMin }) {
  if (mods.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">{label}</h3>
        <p className="text-xs text-zinc-600">No {label.toLowerCase()} in v1 dataset.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        {label} <span className="text-zinc-600">·</span> <span className="text-zinc-600">{mods.length}</span>
      </h3>
      <ul className="space-y-1.5">
        {mods.map((mod) => {
          const key = `${itemType}|${mod.text}`;
          const isSelected = selected.has(key);
          const minValue = minValues.get(key) ?? '';
          return (
            <li key={mod.text} className="space-y-1">
              <label className="flex items-start gap-2 cursor-pointer text-sm text-zinc-300 hover:text-zinc-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(mod)}
                  className="mt-0.5 accent-cyan-500"
                />
                <span className={isSelected ? 'text-cyan-200' : ''}>{mod.text}</span>
              </label>
              {isSelected && (
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">Min value</span>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={minValue}
                    placeholder="any"
                    onChange={(e) => onSetMin(mod, e.target.value)}
                    className="w-16 bg-zinc-950/50 border border-white/[0.08] rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-cyan-400/40"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
