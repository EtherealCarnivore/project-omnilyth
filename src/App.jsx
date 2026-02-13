import { useState, useEffect } from 'react';
import VoriciCalculator from './components/VoriciCalculator';
import TaintedCalculator from './components/TaintedCalculator';
import BlanchingCalculator from './components/BlanchingCalculator';
import JewellerCalculator from './components/JewellerCalculator';
import { usePrices } from './hooks/usePrices';
import YouTubeCard from './components/YouTubeCard';

const LEAGUES = [
  { value: 'Phrecia 2.0', label: 'Phrecia 2.0' },
  { value: 'Keepers', label: 'Keepers' },
  { value: 'Hardcore Phrecia 2.0', label: 'HC Phrecia 2.0' },
  { value: 'Hardcore', label: 'Hardcore' },
  { value: 'Hardcore Keepers', label: 'HC Keepers' },
  { value: 'Standard', label: 'Standard' },
];

const TABS = [
  { id: 'vorici', label: 'Chromatic', accent: 'text-poe-text', border: 'border-poe-text' },
  { id: 'tainted', label: 'Tainted', accent: 'text-purple-300', border: 'border-purple-400' },
  { id: 'blanching', label: 'Blanching', accent: 'text-gray-200', border: 'border-gray-400' },
  { id: 'jeweller', label: "Jeweller's", accent: 'text-poe-gold', border: 'border-poe-gold' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('vorici');
  const [league, setLeague] = useState(LEAGUES[0].value);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { prices, loading, error: priceError, refresh } = usePrices(league);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        {/* GitHub Banner */}
        <a
          href="https://github.com/EtherealCarnivore"
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-6 rounded-xl overflow-hidden border border-poe-border/30 hover:border-poe-border/60 transition-all duration-300 group"
        >
          <img
            src="/banner.png"
            alt="EtherealCarnivore on GitHub"
            className="w-full h-auto object-cover group-hover:brightness-110 transition-all duration-300"
          />
        </a>

        {/* Header */}
        <header className="text-center mb-6 relative">
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="absolute right-0 top-0 p-2 rounded-lg text-poe-muted hover:text-poe-text hover:bg-poe-card/60 transition-all duration-200"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-poe-text">
            PoE Chromatic Calculator
          </h1>
          <p className="text-poe-muted text-sm mt-2">
            Vorici &bull; Tainted &bull; Omen of Blanching &bull; Jeweller's Method
          </p>
        </header>

        {/* League Selector + Price Status */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-xs uppercase tracking-wider text-poe-muted">League</label>
            <select
              value={league}
              onChange={e => setLeague(e.target.value)}
              className="calc-input text-sm py-1.5 px-3 pr-8 cursor-pointer"
            >
              {LEAGUES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-poe-muted">
            {loading && <span className="animate-pulse">Fetching prices...</span>}
            {!loading && prices && (
              <span className="text-green-400/80">
                Live prices loaded
              </span>
            )}
            {!loading && priceError && (
              <span className="text-red-400/80">{priceError}</span>
            )}
            <button
              onClick={refresh}
              disabled={loading}
              className="text-poe-muted hover:text-poe-text transition-colors disabled:opacity-40"
              title="Refresh prices"
            >
              &#x21bb;
            </button>
          </div>
        </div>

        {/* Price Ticker */}
        {prices && (
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs text-poe-muted">
            {prices['chromatic-orb'] && (
              <span>Chromatic: <strong className="text-poe-highlight">{prices['chromatic-orb'].chaosRate.toFixed(2)}c</strong></span>
            )}
            {prices['jewellers-orb'] && (
              <span>Jeweller's: <strong className="text-poe-highlight">{prices['jewellers-orb'].chaosRate.toFixed(2)}c</strong></span>
            )}
            {prices['tainted-chromatic-orb'] && (
              <span>Tainted Chrome: <strong className="text-poe-highlight">{prices['tainted-chromatic-orb'].chaosRate.toFixed(2)}c</strong></span>
            )}
            {prices['omen-of-blanching'] && (
              <span>Omen of Blanching: <strong className="text-poe-highlight">{prices['omen-of-blanching'].chaosValue.toFixed(1)}c</strong></span>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <nav className="flex justify-center mb-6">
          <div className="inline-flex rounded-xl bg-poe-card/80 backdrop-blur-sm border border-poe-border/30 p-1 gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? `${tab.accent} bg-poe-dark/80 shadow-lg`
                    : 'text-poe-muted hover:text-poe-text hover:bg-poe-dark/40'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Active tab indicator bar */}
        <div className="flex justify-center mb-6">
          <div className={`h-0.5 w-16 rounded-full transition-colors duration-300 ${TABS.find(t => t.id === activeTab)?.border} border-t-2`} />
        </div>

        {/* Calculator Card */}
        <main className="glass-card rounded-2xl p-6 sm:p-8">
          {activeTab === 'vorici' && <VoriciCalculator prices={prices} />}
          {activeTab === 'tainted' && <TaintedCalculator prices={prices} />}
          {activeTab === 'blanching' && <BlanchingCalculator prices={prices} />}
          {activeTab === 'jeweller' && <JewellerCalculator prices={prices} />}
        </main>

        <YouTubeCard />

        {/* Footer */}
        <footer className="text-center text-xs text-poe-muted mt-4 space-y-1">
          <p>
            Originally made by <a href="https://www.pathofexile.com/account/view-profile/Siveran" className="underline hover:text-poe-text transition-colors">Siveran</a>.
            Tainted, Blanching &amp; Jeweller's by <a href="https://github.com/EtherealCarnivore" className="underline hover:text-poe-text transition-colors">Carnivore</a>.
          </p>
          <p>
            Prices from <a href="https://poe.ninja" className="underline hover:text-poe-text transition-colors">poe.ninja</a>
            {' '}&bull;{' '}
            <a href="https://github.com/Siveran/siveran.github.io" className="underline hover:text-poe-text transition-colors">Source Code</a>
            {' '}&bull;{' '}CC0 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
