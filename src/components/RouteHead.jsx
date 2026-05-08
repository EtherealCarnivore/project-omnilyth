/**
 * RouteHead.jsx — Reads the current pathname via useLocation() and renders
 * React 19 native <title>/<meta> tags. React 19 auto-hoists these to the
 * document <head>, replacing the static defaults shipped in index.html.
 *
 * Mount once inside AppShell. No props.
 *
 * Pairs with src/lib/seoMeta.js (the route → metadata table).
 */
import { useLocation } from 'react-router-dom';
import { resolveMeta, SITE } from '../lib/seoMeta';

export default function RouteHead() {
  const location = useLocation();
  const meta = resolveMeta(location.pathname);

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      {meta.noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.ogTitle || meta.title} />
      <meta property="og:description" content={meta.ogDescription || meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.ogTitle || meta.title} />
      <meta name="twitter:description" content={meta.ogDescription || meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />
    </>
  );
}
