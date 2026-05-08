/*
 * PreLaunchPage.jsx — The "between leagues" holding page shown to public
 * visitors at omnilyth.app while we cook up PoE 2 0.5 tooling.
 *
 * Single full-viewport surface, no nav, no sidebar, no topbar. The user's
 * unlock paths (Konami code + ?peek=mirage) live in PreLaunchGate; this
 * component is purely presentational.
 *
 * Voice match: the wry, self-deprecating Java-HFT-dev tone in registry.js
 * and usePrices.js. Confident, not corporate, not overly cute.
 */
import { useEffect, useState } from 'react';

const LAUNCH_TARGET = new Date('2026-05-29T13:00:00-07:00'); // GGG announced 1 PM PDT

function diffParts(future, now) {
  const ms = Math.max(0, future.getTime() - now.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, done: ms === 0 };
}

function pad(n) { return String(n).padStart(2, '0'); }

function Countdown({ onUnlock }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds, done } = diffParts(LAUNCH_TARGET, now);

  if (done) {
    return (
      <button
        type="button"
        onClick={onUnlock}
        className="text-cyan-300 font-semibold hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded px-2 py-0.5 transition-colors"
      >
        Enter →
      </button>
    );
  }

  return (
    <span className="font-mono tabular-nums text-zinc-300">
      {days}d {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}

export default function PreLaunchPage({ onUnlock }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient cyan glow — far-right, blurred. Cheap atmosphere. */}
      <div
        aria-hidden="true"
        className="absolute -right-32 top-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 bottom-1/4 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none"
      />

      <main className="relative max-w-2xl w-full">
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 sm:p-12 space-y-8">
          {/* Tag */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 motion-safe:animate-pulse" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/80 font-semibold">
              Path of Exile 2 · Runes of Aldur · 0.5
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-[1.05]">
              Runes of Aldur is incoming.
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Mirage cleared out. Wraeclast 2 is preheating.
            </p>
          </div>

          {/* Body */}
          <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <p>
              300+ atlas nodes, two new ascendancies, 100+ runes to track. We're cooking.
            </p>
            <p className="text-zinc-400">
              GGG launches 0.5 on{' '}
              <span className="text-zinc-200 font-medium">May 29</span>. Doors open then.
            </p>
          </div>

          {/* Countdown card */}
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4 flex items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              First feast in
            </div>
            <Countdown onUnlock={onUnlock} />
          </div>

          {/* Soft pitch */}
          <p className="text-sm text-zinc-500 leading-relaxed">
            If you're a friend, a contributor, or you happen to know what to press —
            welcome.
          </p>

          {/* Hint */}
          <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600">
              EtherealCarnivore
            </span>
            <span
              className="font-mono text-xs text-zinc-600 tracking-wider select-all"
              title="A nudge for those who recognize it"
              aria-label="Konami code: up up down down left right left right B A"
            >
              ↑ ↑ ↓ ↓ ← → ← → B A
            </span>
          </div>
        </div>

        {/* Footer credit */}
        <p className="text-center text-[10px] text-zinc-600 mt-6 tracking-wide">
          Fan-made PoE toolkit · not affiliated with Grinding Gear Games
        </p>
      </main>
    </div>
  );
}
