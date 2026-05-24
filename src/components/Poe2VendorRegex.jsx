/**
 * Poe2VendorRegex.jsx — Vendor leveling regex generator for PoE 2.
 *
 * Flat, everything-visible layout with an OR / AND match toggle. Output is
 * always wrapped in quotes:
 *   - OR  (default): one quoted group, fragments alternated with `|` →
 *     "a|b" — highlights items matching ANY selected criterion (like poe2.re).
 *   - AND: each fragment as its own quoted group, space-joined → "a" "b" — PoE 2
 *     treats space-separated quoted groups as AND, so it highlights items matching
 *     ALL criteria, e.g.  "acc." "\d el.+dam"  = a thing with Accuracy AND ele dmg.
 *     Pipe-only tools can't express this, which is our edge.
 *
 * PoE 2 vendor search matches the visible item text (name, Class: line, stat
 * lines), case-insensitive, capped at 50 chars per box; over-limit patterns
 * can't be split across searches, so the user must trim.
 *
 * Fragments are our own, derived from PoE 2 stat / Class-line text and
 * verified in-game where flagged.
 */
import { useEffect, useMemo, useState } from 'react';
import vendorData from '../data/poe2/vendorLevelingStats.json';

const STORAGE_KEY = 'omnilyth_poe2_vendor_regex_v2';
const MODE_KEY = 'omnilyth_poe2_vendor_regex_mode';
const SEARCH_LIMIT = vendorData._meta?.searchCharLimit ?? 50;

function loadMode() {
  try {
    return localStorage.getItem(MODE_KEY) === 'and' ? 'and' : 'or';
  } catch {
    return 'or';
  }
}

// Ordered option list (stable output) + id lookup, across modifiers + classes.
const ORDERED = [];
const OPTION_BY_ID = {};
for (const g of vendorData.groups) for (const o of g.options) { ORDERED.push(o); OPTION_BY_ID[o.id] = o; }
for (const c of vendorData.itemClasses) for (const o of c.options) { ORDERED.push(o); OPTION_BY_ID[o.id] = o; }

function loadSelected() {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set((Array.isArray(arr) ? arr : []).filter((id) => OPTION_BY_ID[id]));
  } catch {
    return new Set();
  }
}

export default function Poe2VendorRegex() {
  const [selected, setSelected] = useState(loadSelected);
  const [mode, setMode] = useState(loadMode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected])); } catch { /* ignore */ }
  }, [selected]);

  useEffect(() => {
    try { localStorage.setItem(MODE_KEY, mode); } catch { /* ignore */ }
  }, [mode]);

  // Output is always quoted. OR: one quoted group, fragments alternated with `|`
  // → "a|b". AND: one quoted group per criterion, space-joined → "a" "b".
  const pattern = useMemo(() => {
    const frags = ORDERED.filter((o) => selected.has(o.id)).map((o) => o.regex);
    if (frags.length === 0) return '';
    return mode === 'and' ? frags.map((r) => `"${r}"`).join(' ') : `"${frags.join('|')}"`;
  }, [selected, mode]);
  const over = pattern.length > SEARCH_LIMIT;

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setSelected(new Set());
  }

  function copy() {
    navigator.clipboard.writeText(pattern).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
        <h1 className="text-2xl font-bold text-zinc-100">Vendor Leveling Regex</h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Tick what you're hunting for, then paste the pattern into a vendor's search box.
          <strong className="text-zinc-300"> OR</strong> (default) joins criteria with{' '}
          <code className="text-cyan-300/90">|</code> and highlights items matching <em>any</em> of
          them — same as poe2.re. Switch to <strong className="text-zinc-300">AND</strong> to highlight
          only items matching <em>all</em> of them (e.g. a crossbow that <em>also</em> has accuracy) —
          something pipe-only tools can't express. Searches cap at{' '}
          <strong className="text-zinc-300">{SEARCH_LIMIT} characters</strong> and can't be split,
          so trim if you go over.
        </p>
      </div>

      {/* Output panel — sticky on top */}
      <div className="sticky top-0 z-10 rounded-xl border border-white/[0.08] bg-zinc-950/90 backdrop-blur-sm p-4 space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Vendor search pattern</h2>
            {/* OR / AND match toggle */}
            <div role="radiogroup" aria-label="Match mode" className="inline-flex rounded-lg border border-white/[0.06] bg-zinc-900/60 p-0.5">
              {['or', 'and'].map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  title={m === 'or' ? 'Match items with ANY selected criterion (joined with |)' : 'Match items with ALL selected criteria (quoted groups)'}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    mode === m ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-mono tabular-nums ${over ? 'text-red-400 font-semibold' : 'text-zinc-600'}`}>
              {pattern.length}/{SEARCH_LIMIT}
            </span>
            {pattern && (
              <button
                type="button"
                onClick={copy}
                className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            {selected.size > 0 && (
              <button
                type="button"
                onClick={reset}
                className="text-xs px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 motion-safe:transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        {pattern ? (
          <code className="block text-sm text-cyan-200 font-mono break-all leading-relaxed">{pattern}</code>
        ) : (
          <p className="text-sm text-zinc-500">
            Select one or more options below to build {mode === 'and' ? 'an AND' : 'an OR'} pattern.
          </p>
        )}
        {over && (
          <p className="text-xs text-red-400">
            Over the {SEARCH_LIMIT}-character limit — searches can't be split across boxes,
            so remove a criterion.
          </p>
        )}
      </div>

      {/* Flat checkbox columns */}
      <div className="[column-fill:balance] columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-5">
        {vendorData.groups.map((g) => (
          <CheckGroup key={g.id} label={g.label} options={g.options} selected={selected} onToggle={toggle} />
        ))}
        {vendorData.itemClasses.map((c) => (
          <CheckGroup key={c.label} label={c.label} options={c.options} selected={selected} onToggle={toggle} sublabel="Item class" />
        ))}
      </div>

      {/* Provenance */}
      <p className="text-xs text-zinc-600 leading-relaxed border-t border-white/5 pt-3">
        Movement, +levels, resistances, sockets, and several item classes are verified in-game.
        Damage types, skill-type +levels, and the remaining item classes are flagged best-effort —
        verify after the {`0.5`} launch (2026-05-29). The 50-char cap may rise to 250 (as PoE 1's did).
      </p>
    </div>
  );
}

function CheckGroup({ label, options, selected, onToggle, sublabel }) {
  return (
    <div className="break-inside-avoid mb-5">
      {sublabel && <div className="text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">{sublabel}</div>}
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">{label}</h3>
      <ul className="space-y-1.5">
        {options.map((o) => {
          const isSel = selected.has(o.id);
          return (
            <li key={o.id}>
              <label className="flex items-start gap-2 cursor-pointer text-sm text-zinc-300 hover:text-zinc-100 transition-colors">
                <input type="checkbox" checked={isSel} onChange={() => onToggle(o.id)} className="mt-0.5 accent-cyan-500" />
                <span className={isSel ? 'text-cyan-200' : ''}>{o.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
