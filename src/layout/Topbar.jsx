/*
 * Topbar.jsx — The header bar containing league selector, price status, and support dropdown.
 *
 * Contains THREE separate components that each independently implement
 * "close on outside click" via useRef + useEffect + document.addEventListener.
 * Yes, I copy-pasted it three times. No, I don't want to talk about it.
 * In Java I'd extract a base class. Here they told me "composition over inheritance"
 * and then gave me no good way to compose this. Respect to frontend devs who
 * deal with this daily. I write market makers for a living and this dropdown
 * code made me question my career choices more than any flash crash ever did.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import modules from '../modules/registry';
import { usePricesContext } from '../contexts/PricesContext';
import { useLeague } from '../contexts/LeagueContext';
import { usePatchNotes } from '../contexts/PatchNotesContext';
import { useRegexLibrary } from '../hooks/useRegexLibrary';
import FeedbackButton from '../components/FeedbackButton';

const KIND_STYLES = {
  softcore:      { dot: 'bg-emerald-400',  text: 'text-emerald-300' },
  hardcore:      { dot: 'bg-red-400',      text: 'text-red-300' },
  ssf:           { dot: 'bg-amber-400',    text: 'text-amber-300' },
  hcssf:         { dot: 'bg-red-400',      text: 'text-red-300' },
  event:         { dot: 'bg-purple-400',   text: 'text-purple-300' },
  'hc-event':    { dot: 'bg-rose-500',     text: 'text-rose-300' },
  'ssf-event':   { dot: 'bg-purple-400',   text: 'text-purple-300' },
  'hcssf-event': { dot: 'bg-rose-500',     text: 'text-rose-300' },
};

function leagueStyle(kind) {
  return KIND_STYLES[kind] || KIND_STYLES.softcore;
}

function LeagueSelector({ league, setLeague, leagues }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click — the frontend ritual of manually detecting clicks outside a div
  // because HTML was never meant to have dropdowns and we're all just coping
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = leagues.find(l => l.value === league) || leagues[0];
  const style = leagueStyle(current?.kind);

  return (
    <div ref={ref} className="relative z-50">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-zinc-900/60 border border-white/[0.06] rounded-lg text-sm py-1.5 px-3 outline-none hover:border-white/10 focus:border-sky-400/30 transition-colors cursor-pointer"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
        <span className={style.text}>{current?.label}</span>
        <svg className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-1 w-56 py-1 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.15] shadow-xl shadow-black/40 z-50 max-h-72 overflow-y-auto">
          {leagues.map(l => {
            const s = leagueStyle(l.kind);
            const isActive = l.value === league;
            return (
              <button
                key={l.value}
                onClick={() => { setLeague(l.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                  isActive
                    ? 'bg-white/[0.06]'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                <span className={`flex-1 ${s.text}`}>{l.label}</span>
                {isActive && (
                  <svg className="w-3.5 h-3.5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PatchNotesBadge() {
  const { unreadCount, getMajorPatches } = usePatchNotes();
  const hasMajorUnread = getMajorPatches().some(p => unreadCount > 0);

  if (unreadCount === 0) {
    // Subtle icon when no unread
    return (
      <button
        onClick={() => {
          // Simulate pressing G key to open overlay, then switch to tab 6
          const event = new KeyboardEvent('keydown', { key: 'g' });
          window.dispatchEvent(event);
          setTimeout(() => {
            const tabEvent = new KeyboardEvent('keydown', { key: '6' });
            window.dispatchEvent(tabEvent);
          }, 100);
        }}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.08] transition-colors"
        title="Patch Notes (G → 6)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    );
  }

  // Has unread patches
  return (
    <button
      onClick={() => {
        const event = new KeyboardEvent('keydown', { key: 'g' });
        window.dispatchEvent(event);
        setTimeout(() => {
          const tabEvent = new KeyboardEvent('keydown', { key: '6' });
          window.dispatchEvent(tabEvent);
        }, 100);
      }}
      className={`relative p-1.5 rounded-lg transition-colors ${
        hasMajorUnread
          ? 'text-red-400 hover:text-red-300 hover:bg-red-400/[0.06] animate-pulse'
          : 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/[0.06] animate-pulse'
      }`}
      title={`${unreadCount} new patch note${unreadCount !== 1 ? 's' : ''} (G → 6)`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 text-[10px] font-bold rounded-full flex items-center justify-center ${
        hasMajorUnread
          ? 'bg-red-500 text-white'
          : 'bg-amber-500 text-black'
      }`}>
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    </button>
  );
}

function LibraryButton() {
  const navigate = useNavigate();
  const { patterns } = useRegexLibrary();
  const count = patterns.length;

  if (count === 0) {
    // Subtle icon when no patterns saved
    return (
      <button
        onClick={() => navigate('/library')}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.08] transition-colors"
        title="Regex Library (Empty)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </button>
    );
  }

  // Has saved patterns
  return (
    <button
      onClick={() => navigate('/library')}
      className="relative p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/[0.06] transition-colors"
      title={`${count} saved pattern${count !== 1 ? 's' : ''} in library`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 text-[10px] font-bold rounded-full flex items-center justify-center bg-indigo-500 text-white">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  );
}

function PriceStatusPopover({ loading, error, prices }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Ternary chain from hell — a ? b : c ? d : e ? f : g. In Java I'd use an enum with
  // a getLabel() method. JS doesn't have real enums so here we are, nesting ternaries
  // like it's 2005 and we're writing PHP. Shoutout to frontend engineers who read these daily.
  const label = loading ? 'Fetching...' : error ? 'Error' : prices ? 'Live*' : 'No data';
  const dotClass = loading ? 'bg-zinc-500 animate-pulse' : error ? 'bg-red-500' : prices ? 'bg-green-500' : 'bg-zinc-600';
  const textClass = loading ? 'text-zinc-500' : error ? 'text-red-400/80' : prices ? 'text-green-400/80' : 'text-zinc-500';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-xs ${textClass} cursor-pointer hover:opacity-80 transition-opacity`}
      >
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        {label}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-64 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.15] shadow-xl shadow-black/40 z-50 p-3">
          <div className="flex items-start gap-2.5">
            <svg className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-xs font-medium text-sky-300/90 mb-1">Price Info</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Prices are sourced from <span className="text-zinc-300">poe.ninja</span> and updated roughly every hour. They may not reflect actual in-game merchant prices.
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed mt-1.5">
                Always verify costs in-game before committing currency.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SupportDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-amber-500/70 hover:text-amber-400 hover:bg-amber-400/[0.06] transition-colors"
        title="Support the project"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Support
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-52 py-2 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.15] shadow-xl shadow-black/40 z-50">
          <div className="px-3 pb-2 mb-1 border-b border-white/5">
            <p className="text-[11px] text-zinc-500 leading-relaxed">Support links not yet available.</p>
          </div>

          {/* Buy Me a Coffee */}
          <div className="flex items-center gap-2.5 px-3 py-2 opacity-40 cursor-not-allowed">
            <svg className="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm0-3h14" />
            </svg>
            <div>
              <span className="text-sm text-zinc-300 block">Buy Me a Coffee</span>
              <span className="text-[10px] text-zinc-500">Not yet available</span>
            </div>
          </div>

          {/* Patreon */}
          <div className="flex items-center gap-2.5 px-3 py-2 opacity-40 cursor-not-allowed">
            <svg className="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21zM2 21.6h3.5V2.41H2V21.6z" />
            </svg>
            <div>
              <span className="text-sm text-zinc-300 block">Patreon</span>
              <span className="text-[10px] text-zinc-500">Not yet available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { loading, prices, error, refresh } = usePricesContext();
  const { league, setLeague, leagues, leaguesLoading } = useLeague();

  const currentModule = modules.find(m => m.route === location.pathname);
  const title = currentModule?.title || 'Dashboard';

  return (
    <header className="relative z-50 h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-zinc-200 tracking-tight truncate">{title}</h2>
      </div>

      {/* Center: league selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 hidden sm:inline">League</span>
        {leaguesLoading ? (
          <div className="h-7 w-32 rounded-lg bg-zinc-800/60 animate-pulse" />
        ) : (
          <LeagueSelector league={league} setLeague={setLeague} leagues={leagues} />
        )}
      </div>

      {/* Right: status + refresh */}
      <div className="flex items-center gap-3">
        <LibraryButton />
        <FeedbackButton />
        <PatchNotesBadge />
        <PriceStatusPopover loading={loading} error={error} prices={prices} />
        <button
          onClick={refresh}
          disabled={loading}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors disabled:opacity-40"
          title="Refresh prices"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <span className="text-zinc-500 hidden sm:inline">|</span>
        <SupportDropdown />
      </div>
    </header>
  );
}
