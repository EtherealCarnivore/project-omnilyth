const RELEASE_URL = '/downloads/omnilyth-watcher-0.1.0-setup.exe';
const REPO_URL = null; // private repo

const FEATURES = [
  {
    title: 'Truly real-time',
    desc: 'Connects directly to the PoE trade live WebSocket — same feed the official site uses. No polling delay.',
  },
  {
    title: 'Hard-to-miss alerts',
    desc: 'OS desktop notification + audio ping the moment a new listing appears. Works even when the window is minimised.',
  },
  {
    title: 'Watch multiple searches',
    desc: 'Add as many trade URLs as you want and toggle each independently. All running in parallel.',
  },
  {
    title: 'One-click whisper',
    desc: 'New listings appear in a live feed. Click Whisper to copy the message straight to your clipboard.',
  },
  {
    title: 'Auto session import',
    desc: 'Imports your POESESSID directly from Firefox, Chrome, or Edge — reads the cookie file, never opens a browser.',
  },
  {
    title: 'Tiny footprint',
    desc: 'Built with Tauri (Rust + WebView2). ~5 MB installer, minimal RAM. Not another 200 MB Electron app.',
  },
];

const STEPS = [
  { n: '1', text: 'Download and run the installer below.' },
  { n: '2', text: 'Click "Import from Firefox/Chrome/Edge" — or paste your POESESSID manually (F12 on pathofexile.com → Application → Cookies).' },
  { n: '3', text: 'Paste a trade search URL from pathofexile.com/trade and press play.' },
  { n: '4', text: 'Get a desktop notification the instant something matches.' },
];

export default function WatcherPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Hero */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <BellIcon />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-zinc-100">Omnilyth Watcher</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono">Windows · Free · Open Source</span>
            </div>
            <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
              A small desktop app that connects to the PoE trade live WebSocket and fires a desktop notification the instant a new listing matches your search. Never miss a flip or a rare item again because the tab was buried.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={RELEASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-medium text-sm hover:bg-amber-500/25 transition-colors"
          >
            <DownloadIcon />
            Download latest release
          </a>
        </div>

        <p className="mt-3 text-xs text-zinc-600">
          Requires Windows 10/11 (64-bit) · WebView2 pre-installed on Windows 11
        </p>
      </div>

      {/* How it works */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">How it works</h2>
        <ol className="space-y-3">
          {STEPS.map(({ n, text }) => (
            <li key={n} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                {n}
              </span>
              <span className="text-sm text-zinc-400 leading-relaxed pt-0.5">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Features */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ title, desc }) => (
            <div key={title} className="flex gap-3">
              <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
              <div>
                <p className="text-sm font-medium text-zinc-200">{title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex gap-3">
          <ShieldIcon />
          <div>
            <p className="text-xs font-medium text-zinc-300 mb-1">Privacy & security</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Your POESESSID is stored locally on your machine and is only ever sent to <span className="text-zinc-400 font-mono">pathofexile.com</span> — nowhere else.
              The cookie import reads one value from your browser's cookie file on disk; it never opens a browser or a login form.
              The full source code is on GitHub and can be audited in minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-amber-400">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-zinc-500 shrink-0 mt-0.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
