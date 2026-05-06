/*
 * Poe2HomePage.jsx — Path of Exile 2 landing page.
 *
 * Stub for the dual-game launch (2026-05-06). Shipping before the May 7
 * 0.5 announcement so /poe2/ is a real surface for curious players.
 * Real PoE 2 tools land in waves starting with 0.5 launch on 2026-05-29.
 */
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export default function Poe2HomePage() {
  const { setGame } = useGame();

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-zinc-900/60 to-zinc-900/40 backdrop-blur-sm p-8 sm:p-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            Path of Exile 2
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mt-4 leading-tight">
            PoE 2 tools are on the way.
          </h1>
          <p className="text-zinc-400 mt-3 text-base leading-relaxed">
            Omnilyth's PoE 2 mode is shipping alongside patch 0.5 ("Return of the Ancients") on
            <span className="text-zinc-200 font-medium"> 2026-05-29</span>. The first wave —
            Item Mod Regex, Gem Browser, and Leveling Playbook — lands within a week of launch.
          </p>
        </div>
      </div>

      {/* What's coming */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">First wave (0.5 launch)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComingSoonCard
            title="Item Mod Regex"
            desc="Generate stash-search regex over the PoE 2 item mod pool."
            tag="Week 1"
          />
          <ComingSoonCard
            title="Gem Browser"
            desc="Filter the PoE 2 gem catalog by class, type (uncut/skill/spirit/support/meta), and level."
            tag="Week 2"
          />
          <ComingSoonCard
            title="Leveling Playbook"
            desc="Per-act guide with quest rewards, gem swaps, and boss notes for PoE 2's 6-act campaign."
            tag="Week 2-3"
          />
        </div>
      </section>

      {/* Phase 4 */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Following waves</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComingSoonCard
            title="Atlas Tree Planner"
            desc="0.5 expands the atlas tree from ~8 to 40+ nodes — first time it's worth planning."
            tag="June+"
          />
          <ComingSoonCard
            title="Waystone Mod Regex"
            desc="PoE 2's equivalent of Map Mod Regex, scoped to the waystone mod pool."
            tag="June+"
          />
          <ComingSoonCard
            title="Currency Divergence Tracker"
            desc="Week-over-week price shifts from poe.ninja with auto-flagged outliers."
            tag="June+"
          />
        </div>
      </section>

      {/* Switch back to PoE 1 */}
      <section className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-6">
        <h3 className="text-sm font-semibold text-zinc-200">Looking for the PoE 1 tools?</h3>
        <p className="text-sm text-zinc-400 mt-1.5">
          The full PoE 1 toolkit — chromatic, fusing, atlas tree, leveling guide, regex generators,
          and everything else — is one click away.
        </p>
        <button
          onClick={() => setGame('poe1')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-200 text-sm font-medium motion-safe:transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" />
          Switch to PoE 1
        </button>
      </section>

      {/* Feedback / suggestions */}
      <p className="text-center text-xs text-zinc-500">
        Have a PoE 2 tool you want? <Link to="/privacy" className="text-cyan-400/80 hover:text-cyan-300">Send a suggestion</Link>.
      </p>
    </div>
  );
}

function ComingSoonCard({ title, desc, tag }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-zinc-900/60 p-5 hover:border-cyan-400/20 motion-safe:transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300/80">
          {tag}
        </span>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}
