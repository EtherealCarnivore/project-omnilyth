/**
 * Poe2BuildsIndex.jsx — /poe2/builds card grid.
 *
 * Phase 0: only the GGG Shield Wall reference build ships. Empty-state
 * messaging is honest about real creator content arriving with 0.5
 * launch (2026-05-29).
 */
import { buildsForGame } from '../data/builds';
import Poe2BuildCard from './Poe2BuildCard';

export default function Poe2BuildsIndex() {
  const builds = buildsForGame('poe2');

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-100">Builds</h1>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Curated Path of Exile 2 builds with downloadable
          {' '}<code className="text-zinc-300 text-[0.85em] px-1 py-0.5 rounded bg-zinc-900/80 border border-white/[0.04]">.build</code>{' '}
          files validated against the official format spec. Drop the file into
          {' '}<code className="text-zinc-300 text-[0.85em] px-1 py-0.5 rounded bg-zinc-900/80 border border-white/[0.04]">Documents/My Games/Path of Exile 2/BuildPlanner/</code>{' '}
          to use it in-game.
        </p>
      </header>

      {/* Pre-launch banner — frames why the grid is sparse today */}
      <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] p-3 text-xs text-cyan-200/80">
        <strong className="font-semibold text-cyan-200">Creator builds drop with PoE 2 0.5 on May 29.</strong>{' '}
        Today's grid shows the official GGG reference example only; featured creator content fills in as 0.5 ships and builds get authored against the live game.
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {builds.map((b) => (
          <Poe2BuildCard key={b.slug} build={b} />
        ))}
      </div>
    </div>
  );
}
