/**
 * Poe2BuildCard.jsx — list-item card for the /poe2/builds index grid.
 *
 * Shows: title, creator chip, ascendancy + primary-skill badges,
 * last-verified-patch (staleness signal), and (when available) the
 * video thumbnail from YouTube's i.ytimg.com CDN.
 */
import { Link } from 'react-router-dom';

function thumbnailFor(videoUrl) {
  if (!videoUrl) return null;
  // Extract the v= or youtu.be/<id> token. youtu.be short form first
  // because it's the easier match.
  const shortMatch = videoUrl.match(/youtu\.be\/([\w-]{11})/);
  if (shortMatch) return `https://i.ytimg.com/vi/${shortMatch[1]}/hqdefault.jpg`;
  const fullMatch = videoUrl.match(/[?&]v=([\w-]{11})/);
  if (fullMatch) return `https://i.ytimg.com/vi/${fullMatch[1]}/hqdefault.jpg`;
  return null;
}

export default function Poe2BuildCard({ build }) {
  const thumb = thumbnailFor(build.video);
  const isOfficial = build.creator?.kind === 'official';

  return (
    <Link
      to={`/poe2/builds/${build.slug}`}
      className="group block bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] hover:border-cyan-500/40 rounded-lg overflow-hidden transition-colors"
    >
      {/* Thumbnail or fallback gradient block */}
      <div className="aspect-video w-full bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
              {isOfficial ? 'Reference' : 'No video'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors">
            {build.title}
          </h3>
          {build.subtitle && (
            <p className="text-xs text-zinc-500">{build.subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 text-[10px]">
          {build.ascendancy && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/[0.04] text-zinc-300">
              {build.ascendancy}
            </span>
          )}
          {build.primarySkill && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/[0.04] text-zinc-300">
              {build.primarySkill}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 truncate">
            {build.creator?.name || 'Unknown creator'}
          </span>
          <span className="text-[10px] text-zinc-600">
            v: {build.lastVerifiedPatch}
          </span>
        </div>
      </div>
    </Link>
  );
}
