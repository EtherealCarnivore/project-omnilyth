/**
 * seoMeta.js — Single source of truth for per-route SEO metadata.
 *
 * Two consumers:
 *   - Runtime: <RouteHead /> renders React 19 native <title>/<meta> tags
 *     based on the current pathname.
 *   - Build time: scripts/prerender-meta.js (commit 4) reads this same
 *     module and emits per-route dist/<route>/index.html shells with the
 *     full <head> baked in.
 *
 * Both must produce identical output so hydration doesn't fight over the
 * head. Keep this file pure data — no React imports, no Node imports.
 *
 * Title formula: `<Tool/Page> — <Value Prop> | Omnilyth`, ≤60 chars.
 * Description: 140–160 chars, include most-likely search query verbatim.
 */

export const SITE = {
  name: 'Omnilyth',
  url: 'https://omnilyth.app',
  defaultOgImage: '/banner.png',
  locale: 'en_US',
};

// Fallback for any route not in ROUTE_META. New tools that haven't been
// added to the table get the default — which is fine but unrouted.
export const DEFAULT_META = {
  title: 'Omnilyth — Path of Exile Crafting & Atlas Toolkit',
  description: 'Free in-browser PoE toolkit: chromatic, fusing, socket calculators, regex generators for items/maps/scarabs, atlas tree planner, leveling guides.',
  noindex: false,
};

// Per-route metadata. Filled in commit 3 of the SEO pass; commit 2 ships
// the homepage and a couple of representative entries to prove the
// mechanism works end to end.
export const ROUTE_META = {
  '/': {
    title: 'Omnilyth — Path of Exile Crafting & Atlas Toolkit',
    description: 'Free in-browser PoE toolkit: chromatic, fusing, socket calculators, regex generators for items/maps/scarabs, atlas tree planner, leveling guides.',
  },
  '/privacy': {
    title: 'About, Privacy & Open Source — Omnilyth',
    description: 'Omnilyth is a fan-made PoE toolkit. No tracking, no accounts, no ads. Open source under GPL-3.0. Full third-party attribution and legal info.',
  },
  '/poe2': {
    title: 'Path of Exile 2 Tools — Coming with Patch 0.5',
    description: "Omnilyth's PoE 2 mode is shipping alongside patch 0.5 (Runes of Aldur). Atlas Tree Planner, Item Mod Regex, and Currency Divergence lead the first wave.",
    noindex: true,
  },
  '/poe2/runes-of-aldur': {
    title: 'Runes of Aldur — PoE 2 Patch 0.5 Summary',
    description: 'What we know about Path of Exile 2 patch 0.5 "Return of the Ancients": Runes of Aldur league mechanic, 300+ atlas nodes, two new ascendancies, Runic Ward, Kalguuran skill gems.',
  },
};

/**
 * Resolve the meta object for a pathname. Falls back to DEFAULT_META.
 * Always returns an object with title, description, canonical, noindex.
 */
export function resolveMeta(pathname) {
  const route = ROUTE_META[pathname];
  const merged = { ...DEFAULT_META, ...route };
  return {
    ...merged,
    canonical: SITE.url + pathname,
    ogImage: SITE.url + (merged.ogImage || SITE.defaultOgImage),
  };
}

/**
 * All route keys in the meta table — for sitemap emit + iteration.
 */
export function allRoutes() {
  return Object.keys(ROUTE_META);
}
