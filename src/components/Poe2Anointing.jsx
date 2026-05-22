/**
 * Poe2Anointing.jsx — Liquid Emotion Anointing lookup (PoE 2).
 *
 * Forward: pick 3 emotions (ordered) → see the notable anointed onto the amulet.
 * Reverse: search a notable → see the 3-emotion recipe.
 *
 * Lives in src/components/, not a calculator — it's an ordered-tuple lookup,
 * no math. Data is datamined pre-launch; a provenance note flags that.
 */
import { useMemo, useState } from 'react';
import {
  EMOTIONS,
  TIER_ORDER,
  TIER_LABELS,
  ANOINT_META,
  ALL_RECIPES,
  emotionName,
  findNotableForCombo,
  searchNotables,
} from '../lib/poe2Anointing';

const MODES = [
  { id: 'forward', label: 'Forward', hint: '3 emotions → notable' },
  { id: 'reverse', label: 'Reverse', hint: 'notable → 3 emotions' },
];

function EmotionSelect({ slot, value, onChange }) {
  return (
    <label className="flex-1 min-w-0">
      <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Slot {slot}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900/80 border border-white/[0.10] rounded-lg text-sm py-2 px-2.5 text-zinc-200 outline-none focus:border-cyan-400/40 transition-colors"
      >
        <option value="">—</option>
        {TIER_ORDER.map((tier) => (
          <optgroup key={tier} label={TIER_LABELS[tier]}>
            {EMOTIONS.filter((em) => em.tier === tier).map((em) => (
              <option key={em.id} value={em.id}>{em.displayName}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function NotableCard({ recipe, showRecipe }) {
  return (
    <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg p-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <strong className="text-cyan-300 text-base">{recipe.notable}</strong>
        {showRecipe && (
          <span className="text-xs text-zinc-400">
            {recipe.e.map((id, i) => (
              <span key={i}>
                {i > 0 && <span className="text-zinc-600"> → </span>}
                <span className="text-zinc-300">{emotionName(id)}</span>
              </span>
            ))}
          </span>
        )}
      </div>
      {recipe.effect && (
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{recipe.effect}</p>
      )}
    </div>
  );
}

function ForwardSearch() {
  const [combo, setCombo] = useState(['', '', '']);
  const setSlot = (i, v) => setCombo((prev) => prev.map((c, idx) => (idx === i ? v : c)));

  const filled = combo.every(Boolean);
  const result = useMemo(() => (filled ? findNotableForCombo(combo) : null), [combo, filled]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        {[0, 1, 2].map((i) => (
          <EmotionSelect key={i} slot={i + 1} value={combo[i]} onChange={(v) => setSlot(i, v)} />
        ))}
      </div>

      {!filled && (
        <p className="text-sm text-zinc-500">Pick an emotion for all three slots to see the notable.</p>
      )}
      {filled && result && <NotableCard recipe={result} />}
      {filled && !result && (
        <div className="bg-zinc-900/40 border border-white/[0.04] rounded-lg p-4 text-sm text-zinc-500">
          That ordered combination doesn't anoint a notable. Try a different order or emotions —
          slot order matters here.
        </div>
      )}
    </div>
  );
}

function ReverseSearch() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchNotables(query), [query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a notable, e.g. High Alert…"
          className="w-full bg-zinc-900/80 border border-white/[0.10] rounded-lg text-sm py-2.5 px-3 text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-cyan-400/40 transition-colors"
        />
      </div>

      {!query.trim() && (
        <p className="text-sm text-zinc-500">Type a notable name to see which 3 emotions anoint it.</p>
      )}
      {query.trim() && results.length === 0 && (
        <p className="text-sm text-zinc-500">No notable matches "{query.trim()}".</p>
      )}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => (
            <NotableCard key={`${r.id}-${r.e.join('-')}`} recipe={r} showRecipe />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Poe2Anointing() {
  const [mode, setMode] = useState('forward');

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-100">Liquid Emotion Anointing</h1>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Anoint three Liquid Emotions onto your amulet to enchant it with a passive-tree notable.
          The order matters. Search forward from emotions to the notable, or reverse from a notable
          to its recipe.
        </p>
      </header>

      {/* Mode toggle */}
      <div role="radiogroup" aria-label="Search direction" className="inline-flex rounded-lg border border-white/[0.06] bg-zinc-900/60 p-1">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={active}
              onClick={() => setMode(m.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <span>{m.label}</span>
              <span className="ml-2 text-[10px] text-zinc-500">{m.hint}</span>
            </button>
          );
        })}
      </div>

      {mode === 'forward' ? <ForwardSearch /> : <ReverseSearch />}

      {/* Provenance — datamined pre-launch */}
      <p className="text-[11px] text-zinc-600 border-t border-white/5 pt-3">
        {ALL_RECIPES.length} anoint recipes · data-mined from poe2db.tw on {ANOINT_META.scrapedAt},
        before the {`0.5`} launch — verify against the live game once Runes of Aldur is out.
      </p>
    </div>
  );
}
