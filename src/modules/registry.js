/*
 * registry.js — The module registry. Every tool in the app is registered here.
 *
 * Lazy-loaded via React.lazy() so the initial bundle doesn't include every
 * calculator known to mankind. This is the closest thing to a proper service
 * registry I'll ever get in frontend land. No dependency injection, no IoC
 * container, no Spring Boot autoconfiguration, just an array of objects.
 * My Java services auto-discover each other via Consul. This one is a hardcoded array.
 * But you know what? It works, it's readable, and it's never caused an outage at 2 AM.
 * Can't say the same about Spring Cloud.
 *
 * CONTRACT — every entry has the shape:
 *   id           string  unique key. Used as the localStorage key in
 *                        src/contexts/PinnedContext.jsx — RENAMING strands
 *                        existing user pins. Treat as part of the public API.
 *   games        string[] which games the tool is available in. Values are
 *                        'poe1' and/or 'poe2'. Most existing tools are PoE 1-only;
 *                        regex-library is the sole shared entry on day one.
 *                        Filter via modulesForGame(game) below; missing field
 *                        falls back to ['poe1'] so misses don't disappear.
 *   title        string  human-readable name shown in sidebar + topbar.
 *   description  string  one-line value prop, ~10 words; shown on the home
 *                        page card and category overview pages.
 *   category     string  top-level sidebar group. See getModuleTree() in
 *                        src/layout/Sidebar.jsx — drives the grouping.
 *   subcategory  string  second-level sidebar group inside a category.
 *   route        string  React Router path. Wired automatically by App.jsx
 *                        from this array — never declare a <Route> by hand.
 *                        PoE 1 routes stay unprefixed (preserves existing
 *                        bookmarks); PoE 2 routes get a /poe2/ prefix.
 *   icon         string  icon-key consumed by ModuleIcon component.
 *   component    LazyExoticComponent  React.lazy(() => import('../pages/...')).
 *                                     The import target must default-export a
 *                                     React component or the route fails at
 *                                     render time, NOT at module load time.
 *   external     boolean (optional) tools that link out instead of routing.
 */
import { lazy } from 'react';

const modules = [
  {
    id: 'chromatic',
    games: ['poe1'],
    title: 'Chromatic Calculator',
    description: 'Vorici bench crafts vs raw Chromatic Orbs',
    category: 'Crafting',
    subcategory: 'Coloring',
    route: '/crafting/chromatic',
    icon: 'chromatic',
    component: lazy(() => import('../pages/ChromaticPage')),
  },
  {
    id: 'tainted',
    games: ['poe1'],
    title: 'Tainted Chromatic',
    description: 'Tainted Chromatic Orb coloring for corrupted items',
    category: 'Crafting',
    subcategory: 'Coloring',
    route: '/crafting/tainted',
    icon: 'tainted',
    component: lazy(() => import('../pages/TaintedPage')),
  },
  {
    id: 'blanching',
    games: ['poe1'],
    title: 'Omen of Blanching',
    description: 'White socket crafting with Omen of Blanching',
    category: 'Crafting',
    subcategory: 'Coloring',
    route: '/crafting/blanching',
    icon: 'blanching',
    component: lazy(() => import('../pages/BlanchingPage')),
  },
  {
    id: 'jeweller',
    games: ['poe1'],
    title: "Jeweller's Method",
    description: 'Add/remove sockets to lock in desired colors',
    category: 'Crafting',
    subcategory: 'Coloring',
    route: '/crafting/jeweller',
    icon: 'jeweller',
    component: lazy(() => import('../pages/JewellerPage')),
  },
  {
    id: 'fusing',
    games: ['poe1'],
    title: 'Fusing Calculator',
    description: 'Orbs of Fusing needed to fully link items',
    category: 'Crafting',
    subcategory: 'Links & Sockets',
    route: '/crafting/fusing',
    icon: 'fusing',
    component: lazy(() => import('../pages/FusingPage')),
  },
  {
    id: 'socketing',
    games: ['poe1'],
    title: 'Socket Calculator',
    description: "Jeweller's Orbs needed for target socket count",
    category: 'Crafting',
    subcategory: 'Links & Sockets',
    route: '/crafting/socketing',
    icon: 'socketing',
    component: lazy(() => import('../pages/SocketPage')),
  },
  {
    id: 'map-mods',
    games: ['poe1'],
    title: 'Map Mod Regex',
    description: 'Generate regex patterns to filter map mods',
    category: 'Atlas',
    subcategory: 'Maps',
    route: '/atlas/map-mods',
    icon: 'map',
    component: lazy(() => import('../pages/MapModsPage')),
  },
  {
    id: 'scarab-regex',
    games: ['poe1'],
    title: 'Scarab Regex',
    description: 'Generate regex to search for cheap scarabs in stash',
    category: 'Atlas',
    subcategory: 'Scarabs',
    route: '/atlas/scarab-regex',
    icon: 'scarab',
    component: lazy(() => import('../pages/ScarabPage')),
  },
  {
    id: 'item-regex',
    games: ['poe1'],
    title: 'Item Mod Regex',
    description: 'Generate regex patterns to find items with specific mods',
    category: 'Crafting',
    subcategory: 'Item Search',
    route: '/crafting/item-regex',
    icon: 'item',
    component: lazy(() => import('../pages/ItemRegexPage')),
  },
  {
    id: 'dust-calculator',
    games: ['poe1'],
    title: 'Dust Calculator',
    description: 'Find the best uniques to disenchant for Thaumaturgic Dust',
    category: 'Atlas',
    subcategory: 'Kingsmarch',
    route: '/atlas/dust',
    icon: 'dust',
    component: lazy(() => import('../pages/DustPage')),
  },
  {
    id: 'cluster-jewel',
    games: ['poe1'],
    title: 'Cluster Jewel Calc',
    description: 'Find compatible notables for Large Cluster Jewels',
    category: 'Jewels',
    subcategory: 'Cluster Jewels',
    route: '/build/cluster-jewel',
    icon: 'cluster',
    component: lazy(() => import('../pages/ClusterJewelPage')),
  },
  // ─── Timeless Jewel Calc — TEMPORARILY UNWIRED for GPL compliance ───────
  // The calculator/page/worker source files remain on disk under
  // src/{calculators,components,pages,workers,data}/timeless* for a future
  // decision. Their chunks are NOT shipped to dist/ while this entry is
  // commented out — Vite's tree-shaker drops anything not reachable from a
  // live import in this registry. To re-enable: uncomment, then either flip
  // the source repo public (GPL-3.0 source-availability), replace the
  // ported algorithm with a permissively-licensed equivalent, or relicense
  // Omnilyth as GPL-3.0. See the privacy page's GPL-3.0 section + commit
  // message for context.
  // {
  //   id: 'timeless-jewel',
  //   games: ['poe1'],
  //   title: 'Timeless Jewel Calc',
  //   description: 'Calculate timeless jewel seed effects on passive tree nodes',
  //   category: 'Jewels',
  //   subcategory: 'Timeless Jewels',
  //   route: '/build/timeless-jewel',
  //   icon: 'timeless',
  //   fullWidth: true,
  //   component: lazy(() => import('../pages/TimelessJewelPage')),
  // },
  {
    id: 'gem-regex',
    games: ['poe1'],
    title: 'Gem Regex',
    description: 'Generate regex to search for skill gems in stash',
    category: 'Leveling',
    subcategory: 'Gems',
    route: '/leveling/gem-regex',
    icon: 'gem',
    component: lazy(() => import('../pages/GemPage')),
  },
  {
    id: 'vendor-leveling',
    games: ['poe1'],
    title: 'Vendor Leveling Regex',
    description: 'Find vendor items with movement speed, sockets, links, and leveling stats',
    category: 'Leveling',
    subcategory: 'Vendors',
    route: '/leveling/vendor-regex',
    icon: 'vendor',
    component: lazy(() => import('../pages/VendorLevelingPage')),
  },
  {
    id: 'leveling-mode',
    games: ['poe1'],
    title: 'Leveling Mode',
    description: 'Complete leveling guide with quest tracking, zone tips, and gem progression',
    category: 'Leveling',
    subcategory: 'Guide',
    route: '/leveling/mode',
    icon: 'guide',
    fullWidth: true,
    component: lazy(() => import('../pages/LevelingModePage')),
  },
  {
    id: 'leveling-planner',
    games: ['poe1'],
    title: 'Gem Planner',
    description: 'Plan your leveling gems before league start - track what to get and when',
    category: 'Leveling',
    subcategory: 'Gems',
    route: '/leveling/planner',
    icon: 'build',
    component: lazy(() => import('../pages/LevelingPlannerPage')),
  },
  {
    id: 'gem-lookup',
    games: ['poe1'],
    title: 'Gem Lookup',
    description: 'Look up where to get specific gems during the campaign',
    category: 'Leveling',
    subcategory: 'Campaign',
    route: '/leveling/gem-lookup',
    icon: 'preview',
    component: lazy(() => import('../pages/LevelingPreviewPage')),
  },
  {
    id: 'leveling-gems',
    games: ['poe1'],
    title: 'Gem Browser',
    description: 'Browse all gems with advanced filtering by class, act, and availability',
    category: 'Leveling',
    subcategory: 'Gems',
    route: '/leveling/gems',
    icon: 'gem',
    component: lazy(() => import('../pages/LevelingGemsPage')),
  },
  {
    id: 'playbook',
    games: ['poe1'],
    title: 'Leveling Playbook',
    description: 'Step-by-step speedrunner strategies with checklists, decisions, and power spikes',
    category: 'Leveling',
    subcategory: 'Guide',
    route: '/leveling/playbook',
    icon: 'playbook',
    component: lazy(() => import('../pages/PlaybookPage')),
  },
  {
    id: 'atlas-tree',
    games: ['poe1'],
    title: 'Atlas Tree Planner',
    description: 'Plan your atlas passive tree and compare with in-game allocation',
    category: 'Atlas',
    subcategory: 'Atlas Tree',
    route: '/atlas/tree',
    icon: 'atlas-tree',
    fullWidth: true,
    component: lazy(() => import('../pages/AtlasTreePage')),
  },
  {
    id: 'passive-tree',
    games: ['poe1'],
    title: 'Passive Tree Planner',
    description: 'Plan your character passive skill tree with class and ascendancy selection',
    category: 'Build Planning',
    subcategory: 'Passive Tree',
    route: '/build/passive-tree',
    icon: 'passive-tree',
    fullWidth: true,
    component: lazy(() => import('../pages/PassiveTreePage')),
  },
  {
    id: 'atlas-diff',
    games: ['poe1'],
    title: 'Atlas Tree Diff',
    description: 'Compare two atlas trees and see exactly which nodes differ',
    category: 'Atlas',
    subcategory: 'Atlas Tree',
    route: '/atlas/diff',
    icon: 'atlas-tree',
    fullWidth: true,
    component: lazy(() => import('../pages/AtlasDiffPage')),
  },
  {
    id: 'watcher',
    games: ['poe1'],
    title: 'Omnilyth Watcher',
    description: 'Desktop app for real-time PoE trade notifications via live WebSocket',
    category: 'Tools',
    subcategory: 'Desktop',
    route: '/tools/watcher',
    icon: 'watcher',
    component: lazy(() => import('../pages/WatcherPage')),
  },
  {
    id: 'regex-library',
    games: ['poe1', 'poe2'],
    title: 'Regex Library',
    description: 'View and manage your saved regex patterns from all tools',
    category: 'Regex Library',
    subcategory: 'Saved Patterns',
    route: '/library',
    icon: 'library',
    component: lazy(() => import('../pages/RegexLibraryPage')),
  },
];

export default modules;

// Filter to a single game's tools. A missing `games` field defaults to ['poe1']
// so any registry entry that misses the migration silently falls back to PoE 1
// rather than disappearing from both games' sidebars. Default arg is also 'poe1'
// so call sites that haven't migrated yet keep their pre-dual-game behavior.
export function modulesForGame(game = 'poe1') {
  return modules.filter(mod => (mod.games || ['poe1']).includes(game));
}

// Builds a nested category → subcategory → modules tree for the sidebar.
// In SQL this would be GROUP BY category, subcategory. In Java it would be
// Collectors.groupingBy(). In JS it's a manual loop that checks for undefined twice.
// I've written order aggregation logic that groups millions of trades per second.
// This groups 11 modules and I still had to debug it. Frontend is humbling.
//
// Game-aware (2026-05-06): pass the active game to filter the tree. With no
// arg, defaults to 'poe1' so call sites that haven't migrated yet still work.
export function getModuleTree(game = 'poe1') {
  const tree = {};
  for (const mod of modulesForGame(game)) {
    if (!tree[mod.category]) tree[mod.category] = {};
    if (!tree[mod.category][mod.subcategory]) tree[mod.category][mod.subcategory] = [];
    tree[mod.category][mod.subcategory].push(mod);
  }
  return tree;
}
