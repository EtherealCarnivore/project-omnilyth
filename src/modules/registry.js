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
    subcategory: 'Linking',
    route: '/crafting/fusing',
    icon: 'fusing',
    component: lazy(() => import('../pages/FusingPage')),
  },
  {
    id: 'socketing',
    title: 'Socket Calculator',
    description: "Jeweller's Orbs needed for target socket count",
    category: 'Crafting',
    subcategory: 'Socketing',
    route: '/crafting/socketing',
    icon: 'socketing',
    component: lazy(() => import('../pages/SocketPage')),
  },
  {
    id: 'map-mods',
    title: 'Map Mod Regex',
    description: 'Generate regex patterns to filter map mods',
    category: 'Atlas/Mapping',
    subcategory: 'Maps',
    route: '/atlas/map-mods',
    icon: 'map',
    component: lazy(() => import('../pages/MapModsPage')),
  },
  {
    id: 'scarab-regex',
    title: 'Scarab Regex',
    description: 'Generate regex to search for cheap scarabs in stash',
    category: 'Atlas/Mapping',
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
    subcategory: 'Items',
    route: '/crafting/item-regex',
    icon: 'item',
    component: lazy(() => import('../pages/ItemRegexPage')),
  },
  {
    id: 'cluster-jewel',
    title: 'Cluster Jewel Calc',
    description: 'Find compatible notables for Large Cluster Jewels',
    category: 'Crafting',
    subcategory: 'Cluster Jewels',
    route: '/crafting/cluster-jewel',
    icon: 'cluster',
    component: lazy(() => import('../pages/ClusterJewelPage')),
  },
  {
    id: 'timeless-jewel',
    title: 'Timeless Jewel Calc',
    description: 'Interactive skill tree for timeless jewel seed searching',
    category: 'Crafting',
    subcategory: 'Timeless Jewels',
    route: '/crafting/timeless-jewel',
    icon: 'timeless',
    fullWidth: true,
    component: lazy(() => import('../pages/TimelessJewelPage')),
  },
];

export default modules;

export function getModuleTree() {
  const tree = {};
  for (const mod of modules) {
    if (!tree[mod.category]) tree[mod.category] = {};
    if (!tree[mod.category][mod.subcategory]) tree[mod.category][mod.subcategory] = [];
    tree[mod.category][mod.subcategory].push(mod);
  }
  return tree;
}
