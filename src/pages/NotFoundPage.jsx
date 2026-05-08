/**
 * NotFoundPage — real 404 surface, replacing the soft-404 catch-all that
 * used to render <HomePage /> for any unrecognised path. Crawlers read the
 * actual content here instead of getting a homepage clone with a wrong URL.
 *
 * RouteHead automatically emits a `noindex` meta for any pathname not in
 * the seoMeta table (see src/lib/seoMeta.js → resolveMeta).
 */
import { Link, useLocation } from 'react-router-dom';

export default function NotFoundPage() {
  const location = useLocation();
  return (
    <div className="max-w-2xl mx-auto pt-12 pb-20 text-center space-y-6">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-semibold">
        404 · Path not found
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
        That route isn't a tool.
      </h1>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Either the URL has a typo, or the tool you're looking for has been moved or
        retired. Try the homepage, or one of the category overviews below.
      </p>
      <p className="text-xs text-zinc-600 font-mono break-all">
        {location.pathname}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Home
        </Link>
        <Link to="/crafting" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Crafting</Link>
        <span className="text-zinc-700">·</span>
        <Link to="/atlas" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Atlas</Link>
        <span className="text-zinc-700">·</span>
        <Link to="/build" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Build</Link>
        <span className="text-zinc-700">·</span>
        <Link to="/leveling" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Leveling</Link>
        <span className="text-zinc-700">·</span>
        <Link to="/library" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Regex Library</Link>
      </div>
    </div>
  );
}
