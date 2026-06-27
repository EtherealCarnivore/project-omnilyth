/*
 * ProjectOnHoldPage.jsx — Project-wide pause surface.
 *
 * When the project is on hold, the deployed site renders ONLY this page on
 * every route (see the short-circuit in App.jsx). No router, no sidebar, no
 * topbar, no links — nothing to traverse. Purely presentational.
 *
 * Visual language mirrors the rest of the app: zinc-950 ground, a single
 * glass card, ambient blurred glow. Amber accent reads as "paused" without
 * shouting error.
 */
import { useEffect } from 'react';

export default function ProjectOnHoldPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Project Omnilyth — On Hold';
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow — cheap atmosphere, decorative only. */}
      <div
        aria-hidden="true"
        className="absolute -right-32 top-1/3 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 bottom-1/4 w-72 h-72 rounded-full bg-zinc-500/5 blur-3xl pointer-events-none"
      />

      <main className="relative max-w-xl w-full">
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 sm:p-12 text-center space-y-6">
          {/* Status tag */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 motion-safe:animate-pulse" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300/80 font-semibold">
              Project Omnilyth
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 leading-[1.1]">
            Project currently on hold.
          </h1>

          {/* Subline */}
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            We've paused development for now. Check back another time.
          </p>
        </div>

        {/* Footer credit */}
        <p className="text-center text-[10px] text-zinc-600 mt-6 tracking-wide">
          Fan-made PoE toolkit · not affiliated with Grinding Gear Games
        </p>
      </main>
    </div>
  );
}
