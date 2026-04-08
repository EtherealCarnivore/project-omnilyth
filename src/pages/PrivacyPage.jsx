/**
 * PrivacyPage — Privacy, Legal, Open Source Credits & Disclaimer
 * One page that covers everything: what this project is, what it isn't,
 * what data it touches, and who built the things it's built on.
 */

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">About, Privacy & Legal</h1>
        <p className="text-sm text-zinc-500">Last Updated: April 8, 2026</p>
      </div>

      {/* ═══ What Is Omnilyth ═══ */}
      <Section title="What Is Omnilyth?">
        <p>
          Omnilyth is a <strong>fan-made toolkit for Path of Exile</strong> players.
          It provides crafting calculators, regex generators, atlas tools, a timeless
          jewel seed calculator, and leveling utilities — all running entirely in your
          browser.
        </p>
        <Callout color="amber">
          <strong>Omnilyth is not affiliated with, endorsed by, or connected to
          Grinding Gear Games (GGG) in any way.</strong> Path of Exile and all related
          content, names, and imagery are trademarks and copyrights of Grinding Gear
          Games.
        </Callout>
      </Section>

      {/* ═══ Not Open Source ═══ */}
      <Section title="Is Omnilyth Open Source?">
        <p>
          <strong>No.</strong> Omnilyth's original source code is licensed under the{' '}
          <strong>MIT License</strong> and is publicly viewable on GitHub, but the
          project as a whole is not an open-source community project. It is a personal
          project maintained by{' '}
          <ExtLink href="https://github.com/EtherealCarnivore">EtherealCarnivore</ExtLink>.
        </p>
        <p>
          However, Omnilyth <strong>is built on top of open-source work</strong> from
          the PoE community. Every third-party library, algorithm, and data source used
          is credited below with its respective license. If you believe attribution is
          missing for something, please{' '}
          <ExtLink href="https://github.com/EtherealCarnivore/project-omnilyth/issues">
            open an issue
          </ExtLink>.
        </p>
      </Section>

      {/* ═══ Privacy ═══ */}
      <div className="border-t border-white/5 pt-8 space-y-6">
        <h2 className="text-2xl font-bold text-zinc-100">Privacy</h2>

        <Callout color="green">
          <strong>The short version:</strong> We don't collect any information about you.
          No analytics, no tracking, no accounts, no ads. The only data stored is in your
          own browser (localStorage) — and you can verify that yourself at any time.
        </Callout>

        <Section title="No Data Collection" level={3}>
          <p>
            Omnilyth does not collect, transmit, or store any personal information.
            There are no user accounts, no registration, no analytics services, and
            no server-side databases recording your activity. We have no way to
            identify who you are or what you do on this site.
          </p>
        </Section>

        <Section title="Local Browser Storage" level={3}>
          <p>
            To make the tools useful between visits, Omnilyth saves preferences using
            your browser's <strong>localStorage</strong>. This data never leaves your
            device.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Saved regex patterns (Regex Library)</li>
            <li>League selection preference</li>
            <li>Pinned/favorite calculators</li>
            <li>Leveling progress and act tracking</li>
            <li>Patch notes read/unread status</li>
            <li>Layout and display preferences</li>
          </ul>
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg p-4 mt-3">
            <p className="text-zinc-400">
              <strong className="text-zinc-300">Verify it yourself:</strong> Open DevTools
              (F12) &rarr; Application tab &rarr; Local Storage. Everything is plain-text
              key-value pairs. You can inspect, edit, or delete any of it.
            </p>
          </div>
        </Section>

        <Section title="No Cookies, No Ads, No Tracking" level={3}>
          <p>
            Omnilyth does not set tracking cookies, does not serve ads, and does not
            use any analytics services. No third-party cookies, no ad networks, no
            tracking pixels, no affiliate links.
          </p>
        </Section>

        <Section title="External API Requests" level={3}>
          <p>Some tools fetch publicly available data from external services:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>poe.ninja</strong> — Public item price data (no user info sent)</li>
            <li><strong>web.poecdn.com</strong> — Official GGG CDN for gem/item icons</li>
            <li><strong>poewiki.net</strong> — Patch notes via MediaWiki API</li>
            <li><strong>pathofexile.com</strong> — Trade search links (opened in your browser)</li>
          </ul>
          <p className="mt-2">
            These requests are made from your browser or through a serverless proxy to
            avoid CORS restrictions. No personal data is included.
          </p>
        </Section>
      </div>

      {/* ═══ Open Source Credits ═══ */}
      <div className="border-t border-white/5 pt-8 space-y-6">
        <h2 className="text-2xl font-bold text-zinc-100">Open Source Credits & Licenses</h2>
        <p className="text-sm text-zinc-400">
          Omnilyth is built on the work of the PoE community. The following projects,
          tools, and data sources are used with credit to their original authors.
        </p>

        {/* GPL-3.0 */}
        <LicenseSection
          badge="GPL-3.0"
          badgeColor="violet"
          title="GNU General Public License v3.0"
          note={<>
            GPL-3.0 requires that derivative works using this code are also publicly
            available. Omnilyth's source code is on{' '}
            <ExtLink href="https://github.com/EtherealCarnivore/project-omnilyth">GitHub</ExtLink>.
          </>}
        >
          <CreditRow
            name="Timeless Jewel Calculator"
            author="vilsol"
            description="TinyMT32 PRNG algorithm and timeless jewel seed calculation engine, ported from Go to JavaScript. Powers the Timeless Jewel Calculator's seed lookup and reverse search."
            href="https://github.com/vilsol/timeless-jewels"
          />
        </LicenseSection>

        {/* CC BY-NC-SA 3.0 */}
        <LicenseSection
          badge="CC BY-NC-SA 3.0"
          badgeColor="blue"
          title="Creative Commons Attribution-NonCommercial-ShareAlike"
        >
          <CreditRow
            name="Path of Exile Wiki"
            author="poewiki.net"
            description="Gem availability data, quest reward tables, skill gem metadata, and game mechanics reference."
            href="https://www.poewiki.net"
          />
        </LicenseSection>

        {/* CC0 */}
        <LicenseSection badge="CC0" badgeColor="green" title="Public Domain">
          <CreditRow
            name="Chromatic Calculator"
            author="Siveran"
            description="Original chromatic orb probability calculations that formed the foundation for Omnilyth's crafting tools."
            href="https://github.com/Siveran/siveran.github.io"
          />
        </LicenseSection>

        {/* MIT */}
        <LicenseSection badge="MIT" badgeColor="zinc" title="MIT License">
          <CreditRow
            name="React"
            description="UI framework."
            href="https://react.dev"
          />
          <CreditRow
            name="Vite"
            description="Build tool and dev server."
            href="https://vite.dev"
          />
          <CreditRow
            name="Tailwind CSS"
            description="Utility-first CSS framework."
            href="https://tailwindcss.com"
          />
          <CreditRow
            name="Pako"
            description="zlib compression for atlas tree URL sharing."
            href="https://github.com/nodeca/pako"
          />
        </LicenseSection>

        {/* Apache 2.0 */}
        <LicenseSection badge="Apache 2.0" badgeColor="orange" title="Apache License 2.0">
          <CreditRow
            name="Fuse.js"
            description="Fuzzy search library for gem browser quick search."
            href="https://www.fusejs.io"
          />
        </LicenseSection>

        {/* Community / Public API */}
        <section>
          <h3 className="text-lg font-semibold text-zinc-200 mb-3">Community Data & Public APIs</h3>
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
            <CreditRow
              name="exile-leveling"
              author="HeartofPhos"
              description="Structured leveling zone and quest progression data."
              href="https://github.com/HeartofPhos/exile-leveling"
            />
            <CreditRow
              name="poe-leveling.com"
              description="Leveling guide reference and community tips."
              href="https://www.poe-leveling.com"
            />
            <CreditRow
              name="poe.ninja"
              description="Public economy data API for real-time item and currency pricing."
              href="https://poe.ninja"
            />
            <CreditRow
              name="GGG Atlas Tree Export"
              description="Official atlas passive tree data published by Grinding Gear Games."
              href="https://github.com/grindinggear/atlastree-export"
            />
            <CreditRow
              name="GGG Passive Skill Tree"
              description="Official passive skill tree data and node sprites from Grinding Gear Games."
            />
            <CreditRow
              name="Leveling Playbook Strategies"
              description="Speedrunning strategies credited to their respective authors (TytyKiller, BigDaddy Gaming) on each playbook's page."
            />
          </div>
        </section>
      </div>

      {/* ═══ Disclaimer ═══ */}
      <div className="border-t border-white/5 pt-8 space-y-6">
        <h2 className="text-2xl font-bold text-zinc-100">Disclaimer</h2>
        <div className="text-sm text-zinc-300 space-y-3">
          <p>
            Omnilyth is provided <strong>"as is"</strong> without warranty of any kind.
            Calculator results are based on known game mechanics and community-sourced
            data — they may not perfectly reflect in-game outcomes, especially after
            patches.
          </p>
          <p>
            We are not responsible for any in-game decisions made based on calculator
            results, including but not limited to currency spent on crafting, items
            purchased via trade, or build choices.
          </p>
          <p>
            All game data, item names, skill names, icons, and related imagery are the
            property of <strong>Grinding Gear Games</strong>. Their use here falls under
            fair use for the purpose of building community tools.
          </p>
          <p>
            If you are a rights holder and believe something is incorrectly attributed
            or should be removed, please{' '}
            <ExtLink href="https://github.com/EtherealCarnivore/project-omnilyth/issues">
              contact us via GitHub
            </ExtLink>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-zinc-600 text-center pt-4 border-t border-white/5">
        Omnilyth is a fan-made tool. Not affiliated with Grinding Gear Games.
      </p>
    </div>
  );
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Section({ title, level = 2, children }) {
  const Tag = level === 2 ? 'h2' : 'h3';
  const size = level === 2 ? 'text-xl' : 'text-lg';
  return (
    <section>
      <Tag className={`${size} font-semibold text-zinc-200 mb-3`}>{title}</Tag>
      <div className="text-sm leading-relaxed text-zinc-300 space-y-3">{children}</div>
    </section>
  );
}

function Callout({ color, children }) {
  const colors = {
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  };
  return (
    <div className={`border rounded-lg p-4 text-sm ${colors[color]}`}>{children}</div>
  );
}

function ExtLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-amber-400 hover:text-amber-300"
    >
      {children}
    </a>
  );
}

function LicenseSection({ badge, badgeColor, title, note, children }) {
  const badgeColors = {
    violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    green: 'bg-green-500/15 text-green-300 border-green-500/30',
    zinc: 'bg-zinc-700/40 text-zinc-300 border-zinc-500/30',
    orange: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  };
  return (
    <section>
      <h3 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
        <span className={`px-2 py-0.5 text-xs font-mono border rounded ${badgeColors[badgeColor]}`}>
          {badge}
        </span>
        {title}
      </h3>
      <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
        {children}
      </div>
      {note && <p className="text-xs text-zinc-500 mt-2">{note}</p>}
    </section>
  );
}

function CreditRow({ name, author, description, href }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <strong className="text-zinc-200">{name}</strong>
          {author && (
            <>
              <span className="text-zinc-500"> by </span>
              <span className="text-teal-300">{author}</span>
            </>
          )}
          {description && (
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
          )}
        </div>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
          >
            Source &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
