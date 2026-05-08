/**
 * prerender-meta.js — Postbuild script that emits per-route dist/<route>/
 * index.html shells with full <head> baked in (Tier 1 prerender). Also
 * emits dist/sitemap.xml and dist/robots.txt.
 *
 * Tier 1 = head-only prerender. The body is still the SPA shell
 * (<div id="root"></div>); only the <head> differs per route. Crawlers
 * see route-specific title / description / canonical / OG / Twitter /
 * JSON-LD even before any JavaScript runs. Tier 2 (commit 6 of the SEO
 * pass) layers react-snap body prerender on top of this for content-rich
 * routes.
 *
 * Reads src/lib/seoMeta.js (the single source of truth) so runtime
 * <RouteHead /> and this script produce the same metadata. Pure Node;
 * no new dependencies.
 *
 * Wired into npm run build as a postbuild step.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ROUTE_META, SITE, resolveMeta, allRoutes, indexableRoutes } from '../src/lib/seoMeta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const TEMPLATE = readFileSync(join(DIST, 'index.html'), 'utf8');

/** Escape a string for safe inclusion in an HTML attribute. */
function htmlAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Escape a string for safe inclusion in <script>JSON</script> body. */
function jsonForScript(obj) {
  // </script> is the only sequence that can break out of a script body.
  return JSON.stringify(obj).replace(/<\/script/gi, '<\\/script');
}

/** Build the <head> additions for a route's meta. */
function buildHeadAdditions(meta) {
  const lines = [];
  lines.push(`<link rel="canonical" href="${htmlAttr(meta.canonical)}" />`);
  if (meta.noindex) {
    lines.push(`<meta name="robots" content="noindex, nofollow" />`);
  }

  // Open Graph
  lines.push(`<meta property="og:type" content="website" />`);
  lines.push(`<meta property="og:title" content="${htmlAttr(meta.ogTitle || meta.title)}" />`);
  lines.push(`<meta property="og:description" content="${htmlAttr(meta.ogDescription || meta.description)}" />`);
  lines.push(`<meta property="og:url" content="${htmlAttr(meta.canonical)}" />`);
  lines.push(`<meta property="og:image" content="${htmlAttr(meta.ogImage)}" />`);
  lines.push(`<meta property="og:site_name" content="${htmlAttr(SITE.name)}" />`);
  lines.push(`<meta property="og:locale" content="${htmlAttr(SITE.locale)}" />`);

  // Twitter
  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`<meta name="twitter:title" content="${htmlAttr(meta.ogTitle || meta.title)}" />`);
  lines.push(`<meta name="twitter:description" content="${htmlAttr(meta.ogDescription || meta.description)}" />`);
  lines.push(`<meta name="twitter:image" content="${htmlAttr(meta.ogImage)}" />`);

  // JSON-LD structured data
  for (const block of meta.jsonLd) {
    lines.push(`<script type="application/ld+json">${jsonForScript(block)}</script>`);
  }

  return lines.join('\n    ');
}

/** Patch the index.html template for a single route. */
function patchTemplate(meta) {
  let html = TEMPLATE;

  // Replace existing <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${htmlAttr(meta.title)}</title>`);

  // Replace existing <meta name="description" ...>
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${htmlAttr(meta.description)}" />`
  );

  // Insert head additions just before </head>
  const additions = buildHeadAdditions(meta);
  html = html.replace('</head>', `    ${additions}\n  </head>`);

  return html;
}

/** Write a file, creating parent directories as needed. */
function writeFile(filepath, content) {
  mkdirSync(dirname(filepath), { recursive: true });
  writeFileSync(filepath, content, 'utf8');
}

/** Build the sitemap.xml content. */
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = indexableRoutes()
    .map((path) => {
      const loc = SITE.url + path;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Build the robots.txt content. */
function buildRobots() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# /poe2/runes-of-aldur is announcement-derived content; index it.',
    'Allow: /poe2/runes-of-aldur',
    '',
    '# /poe2 itself is a scaffold landing — flip to indexable as PoE 2 tools',
    '# ship from 2026-05-29 onward.',
    'Disallow: /poe2$',
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n');
}

// ─── Run ──────────────────────────────────────────────────────────────────

const routes = allRoutes();
let written = 0;
for (const path of routes) {
  const meta = resolveMeta(path);
  const html = patchTemplate(meta);
  // For '/', overwrite dist/index.html. For '/foo/bar', write dist/foo/bar/index.html.
  const target = path === '/' ? join(DIST, 'index.html') : join(DIST, path.slice(1), 'index.html');
  writeFile(target, html);
  written++;
}

writeFile(join(DIST, 'sitemap.xml'), buildSitemap());
writeFile(join(DIST, 'robots.txt'), buildRobots());

console.log(`prerender-meta: wrote ${written} per-route HTML shells + sitemap.xml + robots.txt`);
