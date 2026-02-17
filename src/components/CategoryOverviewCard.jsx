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
        {modules.map(mod => (
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
