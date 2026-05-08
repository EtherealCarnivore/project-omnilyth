/**
 * Poe2WaystoneRegex.jsx — Waystone Mod Regex generator for PoE 2.
 *
 * Affixes are modelled as the in-game shape: each entry is one waystone
 * affix slot, possibly containing multiple mod lines that roll together
 * (e.g. the "monster speed" suffix rolls Attack + Cast + Movement Speed
 * simultaneously). Players pick whole affixes; the generator emits one
 * unique-substring fragment per affix and packs them under the 50-char
 * search limit.
 *
 * Lives in src/components/, NOT src/calculators/ — pattern generator,
 * not a calculator.
 */
import { useEffect, useMemo, useState } from 'react';
import waystoneData from '../data/poe2/waystoneMods.json';
import { generateRegex } from '../lib/poe2Regex';

const ALL_AFFIXES = waystoneData.affixes;
const STORAGE_KEY = 'omnilyth_poe2_waystone_regex_v1';

// Stable affix identity for selection state.
const affixId = (a) => a.lines.join('||');

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      selected: new Set(parsed.selected || []),
      minValues: new Map(parsed.minValues || []),
      round10: Boolean(parsed.round10),
    };
  } catch {
    return null;
  }
}

function saveState(selected, minValues, round10) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selected: [...selected], minValues: [...minValues], round10 })
    );
  } catch {
    /* storage disabled / quota — ignore */
  }
}

export default function Poe2WaystoneRegex() {
  const [selected, setSelected] = useState(() => loadState()?.selected ?? new Set());
  const [minValues, setMinValues] = useState(() => loadState()?.minValues ?? new Map());
  const [round10, setRound10] = useState(() => loadState()?.round10 ?? false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Persist tool state across page reloads.
  useEffect(() => {
    saveState(selected, minValues, round10);
  }, [selected, minValues, round10]);

  const prefixes = useMemo(() => ALL_AFFIXES.filter((a) => a.affix === 'PREFIX'), []);
  const suffixes = useMemo(() => ALL_AFFIXES.filter((a) => a.affix === 'SUFFIX'), []);

  const chunks = useMemo(() => {
    const picked = ALL_AFFIXES
      .filter((a) => selected.has(affixId(a)))
      .map((a) => ({ ...a, minValue: minValues.get(affixId(a)) }));
    return generateRegex(picked, ALL_AFFIXES, { round10 });
  }, [selected, minValues, round10]);

  function toggleAffix(affix) {
    setSelected((prev) => {
      const next = new Set(prev);
      const id = affixId(affix);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setMinValue(affix, raw) {
    const id = affixId(affix);
    const parsed = raw === '' ? null : Number(raw);
    setMinValues((prev) => {
      const next = new Map(prev);
      if (parsed === null || isNaN(parsed) || parsed <= 0) next.delete(id);
      else next.set(id, parsed);
      return next;
    });
  }

  function clearAll() {
    setSelected(new Set());
    setMinValues(new Map());
  }

  function copyChunk(chunk, idx) {
    navigator.clipboard.writeText(chunk).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  }

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
        <h1 className="text-2xl font-bold text-zinc-100">Waystone Mod Regex</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Pick the waystone affixes you want to find. Each affix can roll
          multiple mod lines simultaneously — selecting the affix matches any
          of its lines. Output is a compact regex packed under PoE 2's
          50-character search limit.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {selected.size > 0 ? (
            <>
              <span className="text-xs text-zinc-500">
                {selected.size} affix{selected.size === 1 ? '' : 'es'} selected
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline-offset-2 hover:underline"
              >
                Clear
              </button>
            </>
          ) : (
            <span className="text-xs text-zinc-600">No affixes selected.</span>
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

      {/* Affix selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AffixColumn
          label="Prefixes"
          affixes={prefixes}
          selected={selected}
          minValues={minValues}
          onToggle={toggleAffix}
          onSetMin={setMinValue}
        />
        <AffixColumn
          label="Suffixes"
          affixes={suffixes}
          selected={selected}
          minValues={minValues}
          onToggle={toggleAffix}
          onSetMin={setMinValue}
        />
      </div>

      {/* Output */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Regex output</h2>
        {chunks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.08] bg-zinc-900/40 p-4 text-sm text-zinc-500">
            Select one or more affixes above to generate a stash-search pattern.
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
        v2 dataset hand-curated against the 0.4 waystone pool. Conservative
        starter set; multi-line combo affixes will fill in over time. 0.5
        ("Runes of Aldur") will likely shift this — refresh after the
        2026-05-21 patch notes.
      </p>
    </div>
  );
}

function AffixColumn({ label, affixes, selected, minValues, onToggle, onSetMin }) {
  if (affixes.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">{label}</h3>
        <p className="text-xs text-zinc-600">No {label.toLowerCase()} in v2 dataset yet.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        {label} <span className="text-zinc-600">·</span> <span className="text-zinc-600">{affixes.length}</span>
      </h3>
      <ul className="space-y-2">
        {affixes.map((affix) => {
          const id = affixId(affix);
          const isSelected = selected.has(id);
          const isCombo = affix.lines.length > 1;
          const minValue = minValues.get(id) ?? '';
          return (
            <li key={id} className="space-y-1">
              <label className={`flex items-start gap-2 cursor-pointer text-sm transition-colors rounded ${isSelected ? 'text-cyan-200' : 'text-zinc-300 hover:text-zinc-100'}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(affix)}
                  className="mt-1 accent-cyan-500"
                />
                <span className="flex-1">
                  {affix.lines.map((line, i) => (
                    <span key={i} className="block leading-snug">
                      {i > 0 && <span className="text-zinc-600 text-[10px] uppercase tracking-wider mr-1.5">·</span>}
                      {line}
                    </span>
                  ))}
                  {isCombo && (
                    <span className="inline-block mt-1 text-[9px] uppercase tracking-wider text-cyan-400/70 font-semibold">
                      Combo · {affix.lines.length} lines
                    </span>
                  )}
                </span>
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
                    onChange={(e) => onSetMin(affix, e.target.value)}
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
