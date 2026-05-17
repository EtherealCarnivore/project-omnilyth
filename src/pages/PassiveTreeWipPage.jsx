import { Link } from 'react-router-dom';

export default function PassiveTreeWipPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-8 text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-amber-400/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400/80 font-semibold">
            Under construction
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Passive Tree Planner</h1>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">
          The passive tree planner is being rebuilt. Rendering, pathing, and class /
          ascendancy selection are all getting a rework so the experience matches the
          rest of Omnilyth before it ships back. No ETA yet — check the changelog for
          progress.
        </p>

        <div className="pt-2 flex justify-center gap-4 text-sm">
          <Link to="/" className="text-sky-400 hover:text-sky-300 transition-colors">
            ← Back to home
          </Link>
          <span className="text-zinc-700">·</span>
          <Link to="/build" className="text-zinc-400 hover:text-zinc-200 transition-colors">
            Other build tools
          </Link>
        </div>
      </div>
    </div>
  );
}
