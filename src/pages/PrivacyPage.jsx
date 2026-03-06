/**
 * PrivacyPage
 * Privacy notice — informational only, no accept/decline needed.
 */

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">Privacy Notice</h1>
        <p className="text-sm text-zinc-500">
          Last Updated: March 6, 2026
        </p>
      </div>

      {/* TL;DR */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-400 mb-2">The Short Version</h2>
        <p className="text-sm text-green-300">
          We don't collect any information about you. No analytics, no tracking, no accounts,
          no ads. The only data stored is in your own browser (localStorage) to remember your
          preferences — and you can verify that yourself at any time.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-zinc-300">
        {/* No Data Collection */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">No Data Collection</h2>
          <p className="text-sm leading-relaxed">
            Omnilyth does not collect, transmit, or store any personal information. There are
            no user accounts, no registration, no analytics services, and no server-side
            databases recording your activity. We have no way to identify who you are or what
            you do on this site.
          </p>
        </section>

        {/* Local Browser Storage */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Local Browser Storage</h2>
          <p className="text-sm leading-relaxed mb-3">
            To make the tools useful between visits, Omnilyth saves your preferences and choices
            using your browser's <strong>localStorage</strong>. This data never leaves your
            device — it is not sent to any server.
          </p>
          <p className="text-sm leading-relaxed mb-3">
            Examples of what may be stored locally:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-4">
            <li>Saved regex patterns (Regex Library)</li>
            <li>League selection preference</li>
            <li>Pinned/favorite calculators</li>
            <li>Leveling progress and act tracking</li>
            <li>Patch notes read/unread status</li>
            <li>Layout preferences</li>
          </ul>
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg p-4 mt-4">
            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-300">You can verify this yourself:</strong> Open your
              browser's Developer Tools (F12), go to the <em>Application</em> tab, and
              click <em>Local Storage</em>. Everything stored by Omnilyth is visible there as
              plain key-value pairs. You can inspect, edit, or delete any of it at any time.
            </p>
          </div>
        </section>

        {/* No Cookies for Tracking */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Cookies</h2>
          <p className="text-sm leading-relaxed">
            Omnilyth may use cookies or localStorage interchangeably for saving state such as
            your preferences. These are <strong>not</strong> tracking cookies — they exist solely
            to remember your choices (e.g., which regex patterns you saved, which league you
            selected). No third-party cookies are set. No advertising or analytics cookies exist
            on this site.
          </p>
        </section>

        {/* No Ads */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">No Advertisements</h2>
          <p className="text-sm leading-relaxed">
            Omnilyth does not serve ads and has no plans to do so. There are no ad networks,
            tracking pixels, affiliate links, or sponsored content.
          </p>
        </section>

        {/* Third-Party API Requests */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">External Requests</h2>
          <p className="text-sm leading-relaxed mb-3">
            Some tools fetch publicly available data from external services to function:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-4">
            <li>
              <strong>poe.ninja</strong> — Public item price data (no user information sent)
            </li>
            <li>
              <strong>web.poecdn.com</strong> — Gem and item icons (standard CDN image requests)
            </li>
          </ul>
          <p className="text-sm leading-relaxed mt-3">
            These requests are made directly from your browser or through our serverless proxy
            to avoid CORS restrictions. No personal data is included in these requests.
          </p>
        </section>

        {/* No Accept/Decline */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Why No Accept / Decline?</h2>
          <p className="text-sm leading-relaxed">
            Since we don't collect any information, there is nothing to consent to. Cookie
            consent banners exist to let you opt in or out of data collection — but we don't
            collect data, so there's no action to take. This page exists purely for transparency.
          </p>
        </section>

        {/* Your Control */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">You're in Control</h2>
          <ul className="text-sm space-y-1 list-disc list-inside ml-4">
            <li>View everything stored: Browser DevTools → Application → Local Storage</li>
            <li>Delete everything: Clear your browser data or remove individual keys</li>
            <li>Use without any storage: Private/incognito mode works fine</li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Questions?</h2>
          <p className="text-sm">
            If you have questions about how Omnilyth handles data, feel free to open an issue
            on{' '}
            <a
              href="https://github.com/EtherealCarnivore/project-omnilyth/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300"
            >
              GitHub
            </a>
            {' '}or use the in-app feedback button.
          </p>
        </section>
      </div>

      {/* Open Source Credits & Licenses */}
      <div className="space-y-6 text-zinc-300">
        <div className="border-t border-white/5 pt-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Open Source Credits & Licenses</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Omnilyth is built on the work of the PoE community. The following projects,
            tools, and data sources are used with credit to their original authors.
          </p>
        </div>

        {/* GPL-3.0 Licensed Code */}
        <section>
          <h3 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-violet-500/15 text-violet-300 border border-violet-500/30 rounded">GPL-3.0</span>
            GNU General Public License v3.0
          </h3>
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <strong className="text-zinc-200">Timeless Jewel Calculator</strong>
                  <span className="text-zinc-500"> by </span>
                  <span className="text-teal-300">vilsol</span>
                  <p className="text-xs text-zinc-500 mt-1">
                    Interactive skill tree tool for timeless jewel seed searching.
                    Embedded via iframe with full attribution on the tool page.
                  </p>
                </div>
                <a
                  href="https://github.com/vilsol/timeless-jewels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
                >
                  Source →
                </a>
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            GPL-3.0 requires that derivative works are also open source.
            Omnilyth's source code is publicly available on{' '}
            <a
              href="https://github.com/EtherealCarnivore/project-omnilyth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300"
            >
              GitHub
            </a>.
          </p>
        </section>

        {/* CC BY-NC-SA 3.0 Licensed Data */}
        <section>
          <h3 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded">CC BY-NC-SA 3.0</span>
            Creative Commons Attribution-NonCommercial-ShareAlike
          </h3>
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <strong className="text-zinc-200">Path of Exile Wiki</strong>
                  <span className="text-zinc-500"> (poewiki.net)</span>
                  <p className="text-xs text-zinc-500 mt-1">
                    Gem availability data, quest reward tables, and game mechanics reference.
                  </p>
                </div>
                <a
                  href="https://www.poewiki.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
                >
                  Visit →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CC0 / Public Domain */}
        <section>
          <h3 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono bg-green-500/15 text-green-300 border border-green-500/30 rounded">CC0</span>
            Public Domain
          </h3>
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <strong className="text-zinc-200">Chromatic Calculator</strong>
                  <span className="text-zinc-500"> by </span>
                  <span className="text-teal-300">Siveran</span>
                  <p className="text-xs text-zinc-500 mt-1">
                    Original chromatic orb probability calculations that formed the
                    foundation for Omnilyth's crafting tools.
                  </p>
                </div>
                <a
                  href="https://github.com/Siveran/siveran.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
                >
                  Source →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Data & Content */}
        <section>
          <h3 className="text-lg font-semibold text-zinc-200 mb-3">Community Data & Content</h3>
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <strong className="text-zinc-200">exile-leveling</strong>
                  <span className="text-zinc-500"> by </span>
                  <span className="text-teal-300">HeartofPhos</span>
                  <p className="text-xs text-zinc-500 mt-1">
                    Structured leveling zone and quest progression data.
                  </p>
                </div>
                <a
                  href="https://github.com/HeartofPhos/exile-leveling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
                >
                  Source →
                </a>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <strong className="text-zinc-200">poe-leveling.com</strong>
                  <p className="text-xs text-zinc-500 mt-1">
                    Leveling guide reference and community tips.
                  </p>
                </div>
                <a
                  href="https://www.poe-leveling.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
                >
                  Visit →
                </a>
              </div>
            </div>
            <div className="p-4">
              <div>
                <strong className="text-zinc-200">Leveling Playbook Strategies</strong>
                <p className="text-xs text-zinc-500 mt-1">
                  Speedrunning strategies and build playbooks credited to their respective
                  authors (TytyKiller, BigDaddy Gaming) on each playbook's page.
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <strong className="text-zinc-200">poe.ninja</strong>
                  <p className="text-xs text-zinc-500 mt-1">
                    Public economy data API used for real-time item pricing.
                  </p>
                </div>
                <a
                  href="https://poe.ninja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
                >
                  Visit →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <p className="text-xs text-zinc-600 text-center pt-4">
        Omnilyth is a fan-made tool. We are not affiliated with Grinding Gear Games.
      </p>
    </div>
  );
}
