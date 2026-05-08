/**
 * HomeIntro.jsx — SEO-meaningful introduction copy for the homepage.
 *
 * Mounted above the search input on the dashboard. Provides the H1 +
 * lead paragraph + three short sections that crawlers (and Tier 2
 * prerender output) can index. Visual styling is intentionally subtle
 * so the dashboard's existing rhythm (banner → search → category cards)
 * isn't disrupted.
 *
 * Pairs with the Tier 2 prerender wired up in the SEO pass commit 6 —
 * react-snap bakes this component's text into dist/index.html.
 */
import { Link } from 'react-router-dom';

export default function HomeIntro() {
  return (
    <section className="max-w-3xl mx-auto space-y-6 text-zinc-300">
      <header className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
          Path of Exile Crafting & Atlas Toolkit
        </h1>
        <p className="text-sm leading-relaxed">
          Omnilyth is a free, in-browser toolkit for Path of Exile players. It bundles
          the calculators and regex generators you'd otherwise hunt across half a dozen
          community sites — chromatic and fusing math, socket and jeweller's
          expected-cost, map and scarab regex, an atlas tree planner with import/export,
          cluster jewel notable lookup, a leveling playbook with quest tracking, and a
          desktop trade watcher — all without accounts, ads, or analytics. League prices
          are pulled live from poe.ninja and cached locally so the tools stay quick and
          current.
        </p>
      </header>

      <details className="rounded-xl border border-white/[0.06] bg-zinc-900/40 group">
        <summary className="cursor-pointer select-none px-5 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 list-none flex items-center justify-between">
          <span>What's inside</span>
          <span className="text-zinc-600 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <div className="px-5 pb-5 pt-1 text-sm leading-relaxed space-y-4">
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li><strong className="text-zinc-200">Crafting calculators</strong> — Chromatic, Tainted Chromatic, Omen of Blanching, Jeweller's Method, Fusing, Socketing.</li>
            <li><strong className="text-zinc-200">Regex generators</strong> — Item mods, Map mods, Scarabs, Skill gems, Vendor leveling.</li>
            <li><strong className="text-zinc-200">Atlas planning</strong> — Atlas tree planner with code import/export and a diff viewer to compare two trees.</li>
            <li><strong className="text-zinc-200">Build planning</strong> — Cluster jewel notable compatibility and a full passive tree planner.</li>
            <li><strong className="text-zinc-200">Leveling</strong> — Step-by-step playbook, gem availability lookup, gem planner, and a quest/zone tracker that follows you through the campaign.</li>
            <li><strong className="text-zinc-200">Tools</strong> — Omnilyth Watcher, a desktop app that streams real-time trade notifications over WebSocket.</li>
          </ul>

          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">How prices stay current</h2>
            <p className="text-zinc-400">
              Prices come from poe.ninja, fetched through a Cloudflare Worker proxy and
              cached in your browser for 24 hours. You can force a refresh in any tool.
              League data updates every league cycle.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Privacy</h2>
            <p className="text-zinc-400">
              No tracking, no accounts, no ads. Saved patterns, pinned tools, and leveling
              progress live in your browser's localStorage. Read the full policy on the{' '}
              <Link to="/privacy" className="text-amber-400/80 hover:text-amber-300 transition-colors">
                About, Privacy & Legal
              </Link>{' '}
              page.
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}
