/**
 * seoMeta.js — Single source of truth for per-route SEO metadata.
 *
 * Two consumers:
 *   - Runtime: <RouteHead /> renders React 19 native <title>/<meta>/JSON-LD
 *     based on the current pathname.
 *   - Build time: scripts/prerender-meta.js (commit 4) reads this same
 *     module and emits per-route dist/<route>/index.html shells with the
 *     full <head> baked in.
 *
 * Both must produce identical output so hydration doesn't fight over the
 * head. Keep this file pure data + pure helpers — no React imports, no
 * Node-only imports. Plain ESM.
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

// Fallback for any route not in ROUTE_META.
export const DEFAULT_META = {
  title: 'Omnilyth — Path of Exile Crafting & Atlas Toolkit',
  description: 'Free in-browser PoE toolkit: chromatic, fusing, socket calculators, regex generators for items/maps/scarabs, atlas tree planner, leveling guides.',
  noindex: false,
};

// Display labels for breadcrumb segments. Keyed by pathname OR by segment
// (single-token). Single-token entries cover common path roots.
const BREADCRUMB_LABELS = {
  '/': 'Home',
  '/crafting': 'Crafting',
  '/atlas': 'Atlas',
  '/build': 'Build Planning',
  '/leveling': 'Leveling',
  '/tools/watcher': 'Watcher',
  '/library': 'Regex Library',
  '/privacy': 'About & Privacy',
  '/poe2': 'Path of Exile 2',
  '/poe2/runes-of-aldur': 'Runes of Aldur',
};

// Per-route metadata. Drawn from the SEO bridge §7 drafts (2026-05-07);
// title formula: `<Tool/Page> — <Value Prop> | Omnilyth`, ≤60 chars.
//
// `kind` field controls programmatic JSON-LD:
//   'app'       → WebSite + SearchAction + SoftwareApplication (homepage)
//   'tool'      → SoftwareApplication
//   'howto'     → SoftwareApplication + HowTo
//   'overview'  → CollectionPage
//   'doc'       → WebPage
// All routes get a BreadcrumbList in addition.
export const ROUTE_META = {
  // ─── Home + manually-routed surfaces ───────────────────────────────────
  '/': {
    title: 'Omnilyth — Path of Exile Crafting & Atlas Toolkit',
    description: 'Free in-browser PoE toolkit: chromatic, fusing, socket calculators, regex generators for items/maps/scarabs, atlas tree planner, leveling guides.',
    kind: 'app',
  },
  '/crafting': {
    title: 'PoE Crafting Calculators — Coloring, Linking, Sockets',
    description: "Calculate the cheapest path through Chromatic, Fusing, Jeweller's, Tainted, and Blanching crafting on any Path of Exile item.",
    kind: 'overview',
  },
  '/atlas': {
    title: 'PoE Atlas Tools — Map Mods, Scarabs, Atlas Tree',
    description: 'Filter dangerous map mods, find cheap scarabs, plan and diff your atlas passive tree. Free tools for Path of Exile mappers.',
    kind: 'overview',
  },
  '/build': {
    title: 'PoE Build Planning — Cluster Jewels, Passive Trees',
    description: 'Build-planning calculators for Path of Exile: large cluster notable compatibility, full passive tree planner with import/export.',
    kind: 'overview',
  },
  '/leveling': {
    title: 'PoE Leveling Tools — Guides, Gems, Vendor Regex',
    description: 'League-start leveling tools: a step-by-step playbook, gem availability lookup, vendor regex, and a planner.',
    kind: 'overview',
  },
  '/privacy': {
    title: 'About, Privacy & Open Source — Omnilyth',
    description: 'Omnilyth is a fan-made PoE toolkit. No tracking, no accounts, no ads. Open source under GPL-3.0. Full third-party attribution and legal info.',
    kind: 'doc',
  },

  // ─── Crafting tools ─────────────────────────────────────────────────────
  '/crafting/chromatic': {
    title: 'PoE Chromatic Calculator — Vorici vs Chromatic Orbs',
    description: 'Cheapest path to a target socket-color combo on any item. Compares Vorici bench crafts against raw Chromatic Orb spam, with live league prices.',
    kind: 'tool',
  },
  '/crafting/tainted': {
    title: 'PoE Tainted Chromatic Calculator — Corrupted Items',
    description: 'Tainted Chromatic Orb math for corrupted Path of Exile gear. Probability and expected-cost bands for off-color targets.',
    kind: 'tool',
  },
  '/crafting/blanching': {
    title: 'PoE Omen of Blanching — White Socket Crafting',
    description: 'Calculate Omens of Blanching needed to hit one to six white sockets, with realistic per-attempt distributions.',
    kind: 'tool',
  },
  '/crafting/jeweller': {
    title: "PoE Jeweller's Method — Lock In Socket Colors",
    description: "Plan an off-color craft using the Jeweller's Method: add/remove sockets to anchor desired colors before chromatic spam.",
    kind: 'tool',
  },
  '/crafting/fusing': {
    title: 'PoE Fusing Calculator — Orbs of Fusing for a 6-Link',
    description: 'Expected Fusings to roll a 6-link, with quality and Hillock vendor recipe modeled. Live division/chaos prices included.',
    kind: 'tool',
  },
  '/crafting/socketing': {
    title: "PoE Socket Calculator — Jeweller's Orbs by Item Slot",
    description: "Expected Jeweller's Orbs to hit a target socket count on body armour, weapons, gloves, helmets, and boots.",
    kind: 'tool',
  },
  '/crafting/item-regex': {
    title: 'PoE Item Mod Regex Generator — Stash Search Patterns',
    description: "Build precise stash-tab regex from the live mod pool. Combines suffixes/prefixes into a single pattern under PoE's 250-char limit.",
    kind: 'tool',
  },

  // ─── Atlas tools ────────────────────────────────────────────────────────
  '/atlas/map-mods': {
    title: 'PoE Map Mod Regex — Filter Dangerous Map Modifiers',
    description: "Pick the mods you can't run, get a stash-tab regex that highlights or excludes them. Updated for the current league.",
    kind: 'tool',
  },
  '/atlas/scarab-regex': {
    title: 'PoE Scarab Regex — Find Cheap Stash Scarabs Fast',
    description: "Generate a stash-tab pattern that surfaces underpriced scarabs. Optional split output for PoE's 250-character search limit.",
    kind: 'tool',
  },
  '/atlas/dust': {
    title: 'PoE Dust Calculator — Best Uniques to Disenchant',
    description: 'Rank uniques by Thaumaturgic Dust per chaos for Kingsmarch. Live poe.ninja prices, refreshed automatically.',
    kind: 'tool',
  },
  '/atlas/tree': {
    title: 'PoE Atlas Tree Planner — Plan Your Atlas Passives',
    description: 'Plan an atlas passive tree, import a code from in-game, and compare your plan against your live allocation.',
    kind: 'tool',
  },
  '/atlas/diff': {
    title: 'PoE Atlas Tree Diff — Compare Two Atlas Trees',
    description: 'Paste two atlas tree codes and see exactly which nodes differ. Useful for guide-following and respec planning.',
    kind: 'tool',
  },

  // ─── Build planning ────────────────────────────────────────────────────
  '/build/cluster-jewel': {
    title: 'PoE Cluster Jewel Calculator — Compatible Notables',
    description: 'Find compatible Large Cluster Jewel notables for any base type. League-aware data with annotated notable effects.',
    kind: 'tool',
  },
  '/build/passive-tree': {
    title: 'PoE Passive Tree Planner — Class & Ascendancy Builder',
    description: 'Plan your Path of Exile character passive tree by class and ascendancy. Import/export tree codes; full notable annotations.',
    kind: 'tool',
  },

  // ─── Leveling tools ────────────────────────────────────────────────────
  '/leveling/playbook': {
    title: 'PoE Leveling Playbook — Speedrunner Strategies',
    description: 'Step-by-step Path of Exile leveling playbook for league start: act-by-act decisions, power spikes, and gem-buy checklists.',
    kind: 'howto',
  },
  '/leveling/mode': {
    title: 'PoE Leveling Guide — Quest, Zone & Gem Tracker',
    description: 'Interactive PoE leveling guide that tracks acts, zones, quest rewards, and gem progression as you play.',
    kind: 'howto',
  },
  '/leveling/planner': {
    title: 'PoE Gem Planner — Build Your Leveling Gem List',
    description: 'Plan a leveling gem buy-list before league start. Shows when and where every gem becomes available.',
    kind: 'tool',
  },
  '/leveling/gems': {
    title: 'PoE Gem Browser — Filter by Class, Act, Availability',
    description: 'Browse every Path of Exile skill and support gem with filters for class, act gating, and quest reward availability.',
    kind: 'tool',
  },
  '/leveling/gem-lookup': {
    title: 'PoE Gem Lookup — Where to Get Gems by Act',
    description: 'Look up where to get any specific gem during the campaign — quest rewards, vendor rotations, and act gating.',
    kind: 'tool',
  },
  '/leveling/gem-regex': {
    title: 'PoE Gem Regex — Stash Search for Skill Gems',
    description: 'Generate a stash-tab regex for the gems you actually want. Supports level/quality thresholds and corrupted variants.',
    kind: 'tool',
  },
  '/leveling/vendor-regex': {
    title: 'PoE Vendor Leveling Regex — Movement, Sockets, Stats',
    description: 'Build a vendor-window regex covering movement speed, link/socket targets, life, resists, and class-specific leveling stats.',
    kind: 'tool',
  },

  // ─── Tools ─────────────────────────────────────────────────────────────
  '/tools/watcher': {
    title: 'Omnilyth Watcher — Live PoE Trade Notifications',
    description: 'Free desktop app for Path of Exile that streams real-time trade-search results over WebSocket. Windows installer.',
    kind: 'tool',
  },
  '/library': {
    title: 'Regex Library — Saved Patterns Across Omnilyth',
    description: "View, edit, copy, and delete every regex pattern you've saved from any Omnilyth tool, in one place.",
    kind: 'tool',
  },

  // ─── PoE 2 surfaces ────────────────────────────────────────────────────
  '/poe2': {
    title: 'Path of Exile 2 Tools — Coming with Patch 0.5',
    description: "Omnilyth's PoE 2 mode is shipping alongside patch 0.5 (Runes of Aldur). Atlas Tree Planner, Item Mod Regex, and Currency Divergence lead the first wave.",
    kind: 'doc',
    noindex: true,
  },
  '/poe2/runes-of-aldur': {
    title: 'Runes of Aldur — PoE 2 Patch 0.5 Summary',
    description: 'What we know about Path of Exile 2 patch 0.5 "Return of the Ancients": Runes of Aldur league mechanic, 300+ atlas nodes, two new ascendancies, Runic Ward, Kalguuran skill gems.',
    kind: 'doc',
  },
};

/** Compute breadcrumb labels for a pathname. */
function breadcrumbsFor(pathname) {
  if (pathname === '/') return [{ name: 'Home', url: SITE.url + '/' }];
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ name: 'Home', url: SITE.url + '/' }];
  let acc = '';
  for (const seg of segments) {
    acc += '/' + seg;
    const label = BREADCRUMB_LABELS[acc] || ROUTE_META[acc]?.title?.split(' — ')[0] || seg;
    crumbs.push({ name: label, url: SITE.url + acc });
  }
  return crumbs;
}

/** BreadcrumbList JSON-LD for a pathname. */
function breadcrumbJsonLd(pathname) {
  const crumbs = breadcrumbsFor(pathname);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

/** SoftwareApplication JSON-LD for a tool route. */
function softwareApplicationJsonLd(meta, pathname) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: meta.title.split(' — ')[0],
    description: meta.description,
    url: SITE.url + pathname,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/** WebSite + SearchAction JSON-LD (homepage only). */
function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url + '/',
    description: DEFAULT_META.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE.url + '/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** HowTo JSON-LD for the leveling guides. */
function howToJsonLd(meta, pathname) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: meta.title.split(' — ')[0],
    description: meta.description,
    url: SITE.url + pathname,
  };
}

/** Compute the full JSON-LD list for a route based on its `kind`. */
function buildJsonLd(meta, pathname) {
  const blocks = [breadcrumbJsonLd(pathname)];
  if (meta.kind === 'app') {
    blocks.push(webSiteJsonLd());
    blocks.push(softwareApplicationJsonLd(meta, pathname));
  } else if (meta.kind === 'tool') {
    blocks.push(softwareApplicationJsonLd(meta, pathname));
  } else if (meta.kind === 'howto') {
    blocks.push(softwareApplicationJsonLd(meta, pathname));
    blocks.push(howToJsonLd(meta, pathname));
  }
  return blocks;
}

/**
 * Resolve the meta object for a pathname. Falls back to DEFAULT_META plus
 * an automatic noindex flag for any unknown route — that catches the 404
 * surface (NotFoundPage at <Route path="*"> in App.jsx) without us having
 * to enumerate every possible junk URL.
 *
 * Always returns an object with title, description, canonical, ogImage,
 * noindex, and jsonLd[].
 */
export function resolveMeta(pathname) {
  const route = ROUTE_META[pathname];
  const isKnown = Boolean(route);
  const merged = {
    ...DEFAULT_META,
    ...route,
    noindex: isKnown ? Boolean(route.noindex) : true,
    title: isKnown ? route.title || DEFAULT_META.title : 'Page Not Found — Omnilyth',
    description: isKnown ? route.description || DEFAULT_META.description : 'That route is not a tool. Try the homepage or one of the category overviews.',
  };
  return {
    ...merged,
    canonical: SITE.url + pathname,
    ogImage: SITE.url + (merged.ogImage || SITE.defaultOgImage),
    jsonLd: isKnown ? buildJsonLd(merged, pathname) : [],
  };
}

/** All route keys in the meta table — for sitemap emit + iteration. */
export function allRoutes() {
  return Object.keys(ROUTE_META);
}

/** Indexable route keys (excludes noindex). */
export function indexableRoutes() {
  return allRoutes().filter((p) => !ROUTE_META[p].noindex);
}
