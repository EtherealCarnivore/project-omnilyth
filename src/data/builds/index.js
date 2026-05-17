/**
 * Featured build registry. Each entry is the metadata that drives both
 * the /poe2/builds index card and the /poe2/builds/:slug detail page.
 *
 * Adding a build:
 *   1. Drop a {slug}.build file in public/builds/
 *   2. Add an entry below with a unique slug
 *   3. Add a static seoMeta.js entry for /poe2/builds/{slug} (until the
 *      dynamic resolver lands in Phase 2)
 *
 * `lastVerifiedPatch` is mandatory — it surfaces on the detail page
 * and on the card so visitors can spot stale content at a glance. The
 * league-refresh skill flow re-checks all builds at every patch bump.
 */

const builds = [
  {
    slug: 'shield-wall-mercenary-reference',
    title: 'Shield Wall Mercenary',
    subtitle: 'GGG Official Reference Example',
    games: ['poe2'],
    creator: {
      name: 'Grinding Gear Games',
      handle: null,
      channelUrl: null,
      avatar: null,
      kind: 'official',
    },
    video: null,
    ascendancy: 'Mercenary (Ascendancy II)',
    primarySkill: 'Shield Wall',
    weaponSet: 'One-hand mace + shield (level 22+); Crossbow (1–21)',
    levelBand: 'Acts → mapping',
    lastVerifiedPatch: '0.5 announcement (2026-05-08)',
    summary: [
      'The reference Shield Wall build published by GGG alongside the official .build file format spec on 2026-05-16. Useful as a known-good fixture for the linter and as a worked example for build authors writing their first .build file.',
      'Leveling band: Permafrost Bolts + High Velocity Rounds + Fragmentation Rounds with a Crossbow until level 22. Transition to Shield Wall once the gem is available; Resonating Shield + Fortifying Cry as detonators. Reserves Spirit on Scavenged Plating and Magma Barrier for defence.',
      'Treat this as a starting point, not a finished build — the GGG example does not include passive-tree pathing notes, item bases, or boss-fight rotations.',
    ],
    buildFile: '/builds/shield-wall-mercenary-reference.build',
    tags: ['mercenary', 'shield-wall', 'physical', 'armour', 'reference'],
    sourceUrl: 'https://www.pathofexile.com/developer/docs/game',
  },
];

export default builds;

export function getBuildBySlug(slug) {
  return builds.find((b) => b.slug === slug) || null;
}

export function buildsForGame(game = 'poe1') {
  return builds.filter((b) => b.games.includes(game));
}
