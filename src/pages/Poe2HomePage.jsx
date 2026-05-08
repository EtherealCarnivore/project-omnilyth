/*
 * Poe2HomePage.jsx — Path of Exile 2 landing page.
 *
 * Refreshed 2026-05-08 after the 0.5 "Return of the Ancients" announcement.
 * League is Runes of Aldur; launch is 2026-05-29 13:00 PDT. The first wave
 * follows the re-ranked feature radar (atlas tree planner is the flagship;
 * gem browser dropped from the roadmap).
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
            Path of Exile 2 · 0.5
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mt-4 leading-tight">
            Runes of Aldur lands May 29.
          </h1>
          <p className="text-zinc-400 mt-3 text-base leading-relaxed">
            Patch 0.5 ("Return of the Ancients") goes live{' '}
            <span className="text-zinc-200 font-medium">2026-05-29 13:00 PDT</span>.
            Atlas tree explodes to 300+ allocatable nodes, Runic Ward becomes a third
            defensive resource, two new ascendancies join the roster, and Runes of Aldur
            brings 100+ new currencies into circulation.
          </p>
        </div>
      </div>

      {/* What's changing in 0.5 */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">What's changing in 0.5</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <HighlightCard
            label="Atlas overhaul"
            value="300+ nodes"
            note="Fully allocatable. Three new Atlas Masters (Jado / Hilda / Doryani) on reassignable sub-trees."
          />
          <HighlightCard
            label="New ascendancies"
            value="Spirit Walker · Martial Artist"
            note="Huntress and Monk get their first ascendancies. All current classes get full sets by 1.0."
          />
          <HighlightCard
            label="League mechanic"
            value="Runes of Aldur"
            note="Ezomyte Remnant rune-crafting + Runic Ward (third defensive resource) + Kalguuran skill gems."
          />
          <HighlightCard
            label="Crafting"
            value="100+ new runes"
            note="Verisium, Alloys, Liquid Emotions, Potent Emotions. Mageblood is reportedly making the jump."
          />
        </div>
      </section>

      {/* First wave — launch week */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">First wave · launch week</h2>
          <span className="text-[10px] uppercase tracking-wider text-zinc-600">Targeting 2026-05-29</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <ComingSoonCard
            title="Atlas Tree Planner"
            desc="Plan and share allocations across 300+ nodes plus the three new Atlas Master sub-trees."
            tag="Flagship"
            tagAccent="amber"
          />
          <ComingSoonCard
            title="Item Mod Regex"
            desc="Generate stash-search regex over the PoE 2 item mod pool — including 0.5's new uniques and Liquid/Potent Emotions affixes."
            tag="Day 1"
          />
          <ComingSoonCard
            title="Currency Divergence Tracker"
            desc="Week-over-week price shifts from poe.ninja with auto-flagged outliers. Cross-game — works for PoE 1 too."
            tag="Day 1"
          />
          <ComingSoonCard
            title="Rune Combination Browser"
            desc="Search the Runes of Aldur rune list by reward type. Pulls from the cross-build reference your in-client Runebook can't see."
            tag="Day 1"
          />
        </div>
      </section>

      {/* Following waves */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Following waves</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComingSoonCard
            title="Leveling Playbook"
            desc="Per-act interactive guide with quest rewards, gem swaps, and boss notes. v1 default: one of the new Spirit Walker / Martial Artist ascendancies."
            tag="Post-launch"
          />
          <ComingSoonCard
            title="Waystone Mod Regex"
            desc="PoE 2's equivalent of Map Mod Regex, scoped to the waystone mod pool. Refresh after the 2026-05-21 patch notes confirm what's actually changing."
            tag="Pending patch notes"
          />
          <ComingSoonCard
            title="Build Importer"
            desc="GGG ships an in-client .build file importer in 0.5. Once the format spec goes public, Omnilyth tools can publish exports."
            tag="Pending format spec"
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
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-200 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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

function HighlightCard({ label, value, note }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{label}</div>
      <div className="text-sm font-semibold text-cyan-200 mt-1.5 leading-tight">{value}</div>
      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{note}</p>
    </div>
  );
}

function ComingSoonCard({ title, desc, tag, tagAccent }) {
  const tagClass = tagAccent === 'amber'
    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
    : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300/80';
  return (
    <div className="rounded-xl border border-white/[0.06] bg-zinc-900/60 p-5 hover:border-cyan-400/20 motion-safe:transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <span className={`shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${tagClass}`}>
          {tag}
        </span>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}
