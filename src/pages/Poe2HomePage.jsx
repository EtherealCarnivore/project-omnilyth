/*
 * Poe2HomePage.jsx — Path of Exile 2 landing page.
 *
 * Refreshed 2026-10-23 for patch 0.5.5: Forbidden Rites is the current
 * league (launched 2026-09-04), Runes of Aldur still runs and its content is
 * core, and both end at 1.0 on 2026-12-11. Sources: forum threads 4000864
 * (0.5.5 notes) and 3999366 (1.0 date).
 */
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export default function Poe2HomePage() {
  const { setGame } = useGame();

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-zinc-900/60 to-zinc-900/40 backdrop-blur-sm p-5 sm:p-8 lg:p-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            Path of Exile 2 · 0.5.5
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mt-4 leading-tight">
            Forbidden Rites is live.
          </h1>
          <p className="text-zinc-400 mt-3 text-base leading-relaxed">
            Patch 0.5.5 launched the Forbidden Rites league on 2026-09-04. Runes of
            Aldur still runs alongside it, and its content is now part of the base
            game. Both leagues end when{' '}
            <span className="text-zinc-200 font-medium">1.0 arrives on 2026-12-11</span>{' '}
            with the Duelist.
          </p>
        </div>
      </div>

      {/* Current patch */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1 mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">In the current patch</h2>
          <Link
            to="/poe2/runes-of-aldur"
            className="text-xs text-cyan-400/80 hover:text-cyan-300 motion-safe:transition-colors"
          >
            Patch 0.5 breakdown &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <HighlightCard
            label="League"
            value="Forbidden Rites"
            note="A Ritual in every campaign area plus boss Ritual clusters. Sacred Blooms open the Viridian Wildwood on the Atlas."
          />
          <HighlightCard
            label="Endgame"
            value="Trial of Chaos"
            note="Trial of Chaos is overhauled and 17 new Soul Cores join the pool."
          />
          <HighlightCard
            label="Now core"
            value="Runes of Aldur"
            note="Expedition, runes and Runic Ward stay in the game. Outside the Runes of Aldur league, campaign Expeditions start at Act 4."
          />
          <HighlightCard
            label="Next"
            value="1.0 · Dec 11"
            note="Full release with the Duelist. Both current leagues end that day."
          />
        </div>
      </section>

      {/* Available now */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Available now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AvailableCard
            to="/poe2/crafting/item-regex"
            title="Item Mod Regex"
            desc="Generate stash-search regex over the PoE 2 item mod pool. v1 covers ~10–18 common affixes per item type; refresh against full pool post-launch."
          />
          <AvailableCard
            to="/poe2/atlas/waystone-regex"
            title="Waystone Mod Regex"
            desc="Pick the waystone mods to filter for and get a stash-search pattern. Covers a starter set of the waystone mod pool."
          />
          <AvailableCard
            to="/poe2/build/anointing"
            title="Liquid Emotion Anointing"
            desc="Find the three Liquid Emotions for any passive tree notable, or work backwards from the emotions you have."
          />
          <AvailableCard
            to="/poe2/leveling/vendor-regex"
            title="Vendor Leveling Regex"
            desc="Vendor-window search patterns for leveling gear such as movement speed and resistances."
          />
          <AvailableCard
            to="/poe2/leveling/mode"
            title="Leveling Mode"
            desc="Act-by-act campaign guide across the four acts and three interludes."
          />
          <AvailableCard
            to="/poe2/builds"
            title="Builds"
            desc="Featured builds with downloadable .build files for the in-game planner."
          />
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">On the roadmap</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <ComingSoonCard
            title="Atlas Tree Planner"
            desc="Plan and share allocations across 300+ nodes plus the three Atlas Master sub-trees."
            tag="Flagship"
            tagAccent="amber"
          />
          <ComingSoonCard
            title="Currency Divergence Tracker"
            desc="Week-over-week price shifts from poe.ninja with auto-flagged outliers. Cross-game, so it works for PoE 1 too."
            tag="Planned"
          />
          <ComingSoonCard
            title="Rune Combination Browser"
            desc="Search the rune list by reward type, including the cross-build reference the in-client Runebook can't show."
            tag="Planned"
          />
          <ComingSoonCard
            title="Build File Linter"
            desc="Validate .build files and preview their markup before you share them. Live as a preview today."
            tag="Preview"
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

function AvailableCard({ to, title, desc }) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5 hover:border-cyan-400/40 hover:bg-cyan-500/[0.08] motion-safe:transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-200 motion-safe:transition-colors">{title}</h3>
        <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border bg-cyan-500/15 border-cyan-500/30 text-cyan-300">
          Available
        </span>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
      <span className="inline-flex items-center gap-1 mt-3 text-xs text-cyan-300/80 group-hover:text-cyan-200 motion-safe:transition-colors">
        Open <span aria-hidden="true">→</span>
      </span>
    </Link>
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
