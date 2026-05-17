/**
 * Poe2Anointing.jsx — Liquid Emotion Anointing Calculator (PoE 2).
 *
 * Look up: 3 Liquid Emotions → passive-tree notable on equipped amulet.
 * Forward + reverse search behind a mode toggle.
 *
 * v1 scaffold — data ingest waits for the 2026-05-21 patch notes drop.
 * See .claude/knowledge/poe2/cached/liquid-emotion-anointing.md for the
 * full math contract + canonical-values pointer.
 *
 * Lives in src/components/, NOT a calculator — lookup tool, no math.
 */
import { useState } from 'react';

const MODES = [
  { id: 'forward', label: 'Forward', hint: '3 emotions → notable' },
  { id: 'reverse', label: 'Reverse', hint: 'notable → 3 emotions' },
];

export default function Poe2Anointing() {
  const [mode, setMode] = useState('forward');

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-zinc-100">Liquid Emotion Anointing</h1>
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400/80 font-semibold">
            Pre-launch scaffold
          </span>
        </div>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Combine three Liquid Emotions on your amulet to enchant it with a passive-tree notable.
          Search forward from emotions to notable, or reverse from a notable to its recipe.
        </p>
      </header>

      {/* Patch-notes-pending banner */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-3 text-xs text-amber-300/80">
        <strong className="font-semibold text-amber-300">Recipe data is not yet ingested.</strong>{' '}
        Full PoE 2 0.5 patch notes drop ~2026-05-21; canonical combinations.json will be scraped
        from poe2db.tw on 2026-05-22 (one day post-drop). League launch 2026-05-29.
      </div>

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

      {/* Placeholder result region — calculator-engineer wires real inputs/results here */}
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-8 text-center">
        <p className="text-sm text-zinc-400">
          {mode === 'forward'
            ? 'Emotion picker + result list lands here once combinations.json is ingested.'
            : 'Notable search + recipe view lands here once combinations.json is ingested.'}
        </p>
      </div>
    </div>
  );
}
