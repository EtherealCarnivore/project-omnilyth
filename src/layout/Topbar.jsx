import { useLocation } from 'react-router-dom';
import modules from '../modules/registry';
import { usePricesContext } from '../contexts/PricesContext';

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { loading, prices, error, refresh } = usePricesContext();

  const currentModule = modules.find(m => m.route === location.pathname);
  const title = currentModule?.title || 'Dashboard';

  return (
    <header className="h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-zinc-200 tracking-tight">{title}</h2>
      </div>

      {/* Right: status + refresh */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
              Fetching...
            </span>
          ) : error ? (
            <span className="flex items-center gap-1.5 text-xs text-red-400/80">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Error
            </span>
          ) : prices ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400/80">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              No data
            </span>
          )}
        </div>
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
      </div>
    </header>
  );
}
