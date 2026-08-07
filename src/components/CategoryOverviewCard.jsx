import { Link } from 'react-router-dom';

export default function CategoryOverviewCard({ subcategory, icon, modules, accentColor }) {
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-6 ${accentColor}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-zinc-300">{icon}</div>
        <h3 className="text-base font-semibold text-zinc-100">{subcategory}</h3>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 ml-auto">
          {modules.length} {modules.length === 1 ? 'tool' : 'tools'}
        </span>
      </div>
      <div className="space-y-2">
        {modules.map(mod => mod.retired ? (
          // Retired: the mechanic no longer exists in-game, so there's nothing
          // to navigate to. Non-interactive row, struck through, no chevron.
          <div
            key={mod.id}
            title={mod.retiredReason || 'Removed from the game'}
            className="flex items-start gap-3 p-3 -mx-1 rounded-xl opacity-50 cursor-not-allowed select-none"
          >
            <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-zinc-400 line-through decoration-zinc-700">
                {mod.title}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                {mod.retiredReason || 'Removed from the game'}
              </div>
            </div>
            <span className="shrink-0 ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-700/20 border border-zinc-600/30 text-zinc-500">
              3.29
            </span>
          </div>
        ) : (
          <Link
            key={mod.id}
            to={mod.route}
            className="group flex items-start gap-3 p-3 -mx-1 rounded-xl hover:bg-white/[0.04] transition-colors"
          >
            <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-sky-400 transition-colors" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-zinc-200 group-hover:text-sky-400 transition-colors">
                {mod.title}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                {mod.description}
              </div>
            </div>
            <svg className="w-4 h-4 shrink-0 mt-0.5 ml-auto text-zinc-500 group-hover:text-zinc-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
