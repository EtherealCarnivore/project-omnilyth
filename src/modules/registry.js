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
 */
import { lazy } from 'react';

const modules = [
  {
    id: 'chromatic',
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
    title: 'Item Mod Regex',
    description: 'Generate regex patterns to find items with specific mods',
    category: 'Crafting',
    subcategory: 'Item Search',
    route: '/crafting/item-regex',
    icon: 'item',
    component: lazy(() => import('../pages/ItemRegexPage')),
  },
  {
    id: 'cluster-jewel',
    title: 'Cluster Jewel Calc',
    description: 'Find compatible notables for Large Cluster Jewels',
    category: 'Jewels',
    subcategory: 'Cluster Jewels',
    route: '/build/cluster-jewel',
    icon: 'cluster',
    component: lazy(() => import('../pages/ClusterJewelPage')),
  },
  {
    id: 'timeless-jewel',
    title: 'Timeless Jewel Calc',
    description: 'Interactive skill tree for timeless jewel seed searching',
    category: 'Jewels',
    subcategory: 'Timeless Jewels',
    route: '/build/timeless-jewel',
    icon: 'timeless',
    fullWidth: true,
    component: lazy(() => import('../pages/TimelessJewelPage')),
  },
  {
    id: 'gem-regex',
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
    title: 'Leveling Mode',
    description: 'Complete leveling guide with quest tracking, zone tips, and gem progression',
    category: 'Leveling',
    subcategory: 'Guide',
    route: '/leveling/mode',
    icon: 'guide',
    component: lazy(() => import('../pages/LevelingModePage')),
  },
  {
    id: 'leveling-planner',
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
    id: 'atlas-diff',
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
    id: 'regex-library',
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

// Builds a nested category → subcategory → modules tree for the sidebar.
// In SQL this would be GROUP BY category, subcategory. In Java it would be
// Collectors.groupingBy(). In JS it's a manual loop that checks for undefined twice.
// I've written order aggregation logic that groups millions of trades per second.
// This groups 11 modules and I still had to debug it. Frontend is humbling.
export function getModuleTree() {
  const tree = {};
  for (const mod of modules) {
    if (!tree[mod.category]) tree[mod.category] = {};
    if (!tree[mod.category][mod.subcategory]) tree[mod.category][mod.subcategory] = [];
    tree[mod.category][mod.subcategory].push(mod);
  }
  return tree;
}
