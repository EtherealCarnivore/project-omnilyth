/**
 * PrivacyPage
 * Privacy policy and data handling information
 */

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">Privacy Policy</h1>
        <p className="text-sm text-zinc-500">
          Effective Date: February 21, 2026 • Last Updated: February 21, 2026
        </p>
      </div>

      {/* TL;DR Banner */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-400 mb-2">📋 TL;DR - The Short Version</h2>
        <ul className="space-y-1 text-sm text-green-300">
          <li>✅ <strong>No tracking</strong> - We don't use analytics, cookies, or tracking pixels</li>
          <li>✅ <strong>No ads</strong> - Completely free, no monetization</li>
          <li>✅ <strong>No data storage</strong> - Everything stays in your browser (localStorage)</li>
          <li>✅ <strong>No database</strong> - We literally can't store your data on servers</li>
          <li>✅ <strong>Open source</strong> - All code is public and auditable</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-zinc-300">
        {/* Our Commitment */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Our Commitment</h2>
          <p className="text-sm leading-relaxed">
            Omnilyth is a free, community-driven toolkit for Path of Exile players. <strong>We do not track users, sell data, or serve advertisements.</strong> This privacy policy explains what data we access, how we use it, and your rights.
          </p>
        </section>

        {/* What We Collect */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">What We Collect</h2>

          <h3 className="text-lg font-medium text-zinc-300 mb-2">No Personal Information Required</h3>
          <p className="text-sm mb-3">
            You can use Omnilyth without creating an account or providing personal information. We do not collect names, emails, phone numbers, addresses, or payment info.
          </p>

          <h3 className="text-lg font-medium text-zinc-300 mb-2">Browser Storage (LocalStorage)</h3>
          <p className="text-sm mb-3">
            We store data in your browser to enhance your experience:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-4">
            <li>League selection - Remember your preferred league</li>
            <li>Pinned modules - Save your favorite calculators</li>
            <li>Design variant - Remember v1/v2 layout choice</li>
            <li>Leveling progress - Track completed acts/quests</li>
            <li>Regex library - Save custom regex patterns</li>
            <li>Patch notes status - Track which notes you've read</li>
          </ul>
          <p className="text-sm mt-3 text-amber-400">
            ⚠️ This data <strong>never leaves your device</strong>. It's stored locally and deleted when you clear browser data.
          </p>
        </section>

        {/* What We Access (OAuth) */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">What We Access (With Your Permission)</h2>
          <p className="text-sm mb-3 text-zinc-400">
            <em>Note: OAuth integration is currently in development. When implemented:</em>
          </p>

          <p className="text-sm mb-3">
            If you choose <strong>"Login with Path of Exile"</strong>, we will request access to:
          </p>

          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg p-4 space-y-3 text-sm">
            <div>
              <strong className="text-zinc-200">Account Profile</strong>
              <p className="text-zinc-400">Your PoE account name → Display "Logged in as: YourName"</p>
            </div>
            <div>
              <strong className="text-zinc-200">Character List</strong>
              <p className="text-zinc-400">Character names, levels, classes → Import to build planner</p>
            </div>
            <div>
              <strong className="text-zinc-200">Stash Tabs</strong>
              <p className="text-zinc-400">Gem items in stash → Highlight gems you already own</p>
            </div>
          </div>

          <p className="text-sm mt-3 text-red-400">
            ❌ We <strong>cannot</strong> access: passwords, payment info, trade history, MTX, or private messages
          </p>
        </section>

        {/* How We Use Data */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">How We Use Data</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">✅ What We DO</h3>
              <ul className="text-sm space-y-1">
                <li>Store data in your browser</li>
                <li>Fetch prices from poe.ninja</li>
                <li>Proxy API requests securely</li>
                <li>Submit feedback (with permission)</li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-2">❌ What We DON'T Do</h3>
              <ul className="text-sm space-y-1">
                <li>No server-side storage</li>
                <li>No behavioral tracking</li>
                <li>No third-party data sharing</li>
                <li>No monetization or ads</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Data Security</h2>
          <ul className="text-sm space-y-2">
            <li>🔒 <strong>HTTPS Everywhere</strong> - All connections encrypted</li>
            <li>🔒 <strong>Secure Token Storage</strong> - Memory-only access tokens, httpOnly cookies for refresh</li>
            <li>🔒 <strong>No Data Persistence</strong> - SessionStorage cleared on tab close</li>
            <li>🔒 <strong>Open Source Code</strong> - Community can audit security</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Your Rights</h2>
          <p className="text-sm mb-3">You can always:</p>
          <ul className="text-sm space-y-1 list-disc list-inside ml-4">
            <li>View your data (browser DevTools → Application → LocalStorage)</li>
            <li>Delete your data (clear browser storage)</li>
            <li>Revoke OAuth access (pathofexile.com/my-account/applications)</li>
            <li>Export your data (copy localStorage, it's just JSON)</li>
            <li>Use without account (no registration required)</li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Third-Party Services</h2>
          <p className="text-sm mb-3">We fetch data from:</p>
          <ul className="text-sm space-y-2">
            <li>
              <strong className="text-zinc-200">poe.ninja API</strong> - Public price data, no user tracking
              <br />
              <a href="https://poe.ninja" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                poe.ninja Privacy Policy →
              </a>
            </li>
            <li>
              <strong className="text-zinc-200">Path of Exile API</strong> - Your PoE account (with consent)
              <br />
              <a href="https://www.pathofexile.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                GGG Privacy Policy →
              </a>
            </li>
            <li>
              <strong className="text-zinc-200">GitHub</strong> - Feedback issue creation
              <br />
              <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                GitHub Privacy Statement →
              </a>
            </li>
          </ul>
          <p className="text-sm mt-3 text-red-400">
            ❌ We don't use: Google Analytics, Facebook Pixel, tracking pixels, heatmaps, ad networks
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-3">Contact Us</h2>
          <p className="text-sm mb-2">Questions about privacy?</p>
          <ul className="text-sm space-y-1">
            <li>
              <strong className="text-zinc-200">GitHub Issues:</strong>{' '}
              <a href="https://github.com/EtherealCarnivore/project-omnilyth/issues" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                Open an issue →
              </a>
            </li>
            <li>
              <strong className="text-zinc-200">Reddit:</strong> r/pathofexile (mention @Omnilyth)
            </li>
            <li>
              <strong className="text-zinc-200">In-App Feedback:</strong> Use feedback button (bottom-right)
            </li>
          </ul>
          <p className="text-sm mt-2 text-zinc-400">We respond to privacy inquiries within 7 days.</p>
        </section>

        {/* Transparency Commitment */}
        <section className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-400 mb-2">Our Transparency Commitment</h2>
          <p className="text-sm text-blue-300">
            We believe in radical transparency. All code is open source, no hidden tracking, no dark patterns, no data collection beyond what's necessary. If we ever add analytics, it will be <strong>opt-in only</strong> with clear explanation.
          </p>
          <p className="text-sm text-blue-300 mt-2">
            <strong>Our promise:</strong> Omnilyth will always prioritize user privacy over monetization.
          </p>
        </section>

        {/* Summary */}
        <section className="bg-zinc-900/60 border border-white/[0.06] rounded-lg p-4">
          <p className="text-sm text-zinc-300">
            <strong>Summary:</strong> We don't collect your data, we don't track you, we don't serve ads. Everything stays in your browser. When OAuth is added, you'll explicitly authorize what we access, and you can revoke it anytime.
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            Questions? Ask us! We're here to help, not to collect data.
          </p>
        </section>

        {/* Footer Note */}
        <p className="text-xs text-zinc-600 text-center mt-8">
          This privacy policy is written in plain English, not legalese. If anything is unclear, please ask.
          <br />
          Omnilyth is a fan-made tool. We are not affiliated with Grinding Gear Games.
        </p>
      </div>
    </div>
  );
}
