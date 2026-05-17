/**
 * Poe2BuildDetail.jsx — /poe2/builds/:slug detail page body.
 *
 * Phase 0 hero action is **Download .build** (the actual user value
 * today). "Validate in Linter" is a secondary navigation link that
 * becomes a real deep-link in Phase 3 once the linter validator
 * accepts pre-loaded files.
 *
 * Cross-link strip surfaces other PoE 2 tools that compose with the
 * build (Liquid Emotion Anointing, Item Mod Regex, Waystone Regex).
 */
import { useParams, Link, Navigate } from 'react-router-dom';
import { getBuildBySlug } from '../data/builds';

function YouTubeEmbed({ url }) {
  if (!url) return null;
  const idMatch = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
  if (!idMatch) return null;
  // youtube-nocookie.com keeps the no-tracking posture matched.
  const src = `https://www.youtube-nocookie.com/embed/${idMatch[1]}`;
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/[0.06] bg-black">
      <iframe
        src={src}
        title="Build guide video"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
}

export default function Poe2BuildDetail() {
  const { slug } = useParams();
  const build = getBuildBySlug(slug);

  if (!build) {
    return <Navigate to="/poe2/builds" replace />;
  }

  const isOfficial = build.creator?.kind === 'official';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb-ish back link */}
      <Link
        to="/poe2/builds"
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
      >
        ← All builds
      </Link>

      {/* Hero */}
      <header className="space-y-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100">{build.title}</h1>
          {build.subtitle && (
            <p className="text-sm text-zinc-400">{build.subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {build.ascendancy && (
            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-white/[0.04] text-zinc-300">
              {build.ascendancy}
            </span>
          )}
          {build.primarySkill && (
            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-white/[0.04] text-zinc-300">
              {build.primarySkill}
            </span>
          )}
          {build.levelBand && (
            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-white/[0.04] text-zinc-300">
              {build.levelBand}
            </span>
          )}
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-500">
            Verified against {build.lastVerifiedPatch}
          </span>
        </div>

        {/* Creator chip */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500">by</span>
          {build.creator?.channelUrl ? (
            <a
              href={build.creator.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-200 hover:text-cyan-300 transition-colors font-medium"
            >
              {build.creator.name}
              {build.creator.handle && (
                <span className="text-zinc-500 ml-1">({build.creator.handle})</span>
              )}
            </a>
          ) : (
            <span className="text-zinc-300 font-medium">
              {build.creator?.name || 'Unknown'}
              {isOfficial && <span className="ml-1 text-[10px] uppercase tracking-widest text-zinc-500">Official</span>}
            </span>
          )}
        </div>
      </header>

      {/* Primary action — download .build (the actual Phase 0 user value) */}
      <section className="bg-zinc-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide">
              Download
            </h2>
            <p className="text-xs text-zinc-400">
              Drop the file in <code className="text-zinc-300 text-[0.95em] px-1 py-0.5 rounded bg-black/40 border border-white/[0.04]">Documents/My Games/Path of Exile 2/BuildPlanner/</code> to load it in-game.
            </p>
          </div>
          <a
            href={build.buildFile}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-sm font-semibold transition-colors"
          >
            ↓ {build.slug}.build
          </a>
        </div>
        <div className="text-xs text-zinc-500">
          <Link
            to="/poe2/build/file-lint"
            className="text-zinc-400 hover:text-zinc-200 underline decoration-zinc-700 underline-offset-2 transition-colors"
          >
            Validate this file in the Linter →
          </Link>
        </div>
      </section>

      {/* Video */}
      {build.video && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
            Build guide
          </h2>
          <YouTubeEmbed url={build.video} />
        </section>
      )}

      {/* Summary */}
      {build.summary && build.summary.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
            Summary
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            {build.summary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Cross-link strip */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
          Related tools
        </h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            to="/poe2/build/anointing"
            className="px-3 py-1.5 rounded bg-zinc-900/60 border border-white/[0.06] hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors"
          >
            Liquid Emotion Anointing →
          </Link>
          <Link
            to="/poe2/crafting/item-regex"
            className="px-3 py-1.5 rounded bg-zinc-900/60 border border-white/[0.06] hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors"
          >
            Item Mod Regex →
          </Link>
          <Link
            to="/poe2/atlas/waystone-regex"
            className="px-3 py-1.5 rounded bg-zinc-900/60 border border-white/[0.06] hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors"
          >
            Waystone Mod Regex →
          </Link>
        </div>
      </section>

      {/* Source link (quiet) */}
      {build.sourceUrl && (
        <p className="text-xs text-zinc-500 pt-2">
          Source:{' '}
          <a
            href={build.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-200 underline decoration-zinc-700 underline-offset-2 transition-colors"
          >
            {new URL(build.sourceUrl).hostname}
          </a>{' '}
          ↗
        </p>
      )}
    </div>
  );
}
