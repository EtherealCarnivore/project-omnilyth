/**
 * scrape-mods.js — PoE 2 mod data scraper (v2 SCAFFOLD).
 *
 * Status: NOT YET FUNCTIONAL.
 *
 * Investigation on 2026-05-08 found that poe2db.tw does not expose a clean
 * per-item-type affix-mod-pool page. /us/{ItemType} pages list base items
 * and uniques only; affix mods appear to live on individual item base pages
 * (e.g., /us/{Specific_Base_Item}) and would need to be aggregated across
 * bases per item type.
 *
 * Other endpoints tried (all 404 on poe2db.tw):
 *   /us/AffixGroup, /us/Affix, /us/ModType, /us/Modifier_Tier,
 *   /us/BodyArmoursItem, /us/ItemType, /us/modifier, /us/PrefixSuffix
 *
 * For v1, src/data/poe2/itemMods.json and waystoneMods.json are
 * hand-curated. This file documents the v2 path: scrape per item base,
 * aggregate per item type, dedupe across bases, write to the same JSON
 * shape the hand-curated files use.
 *
 * v2 plan:
 *   1. Fetch /us/{ItemType} for each tracked item type → extract base item links.
 *   2. For each base item, fetch /us/{Base_Item} → parse affix mod sections.
 *      (poe2db.tw's per-base pages have an "ItemMods" tab that lists rollable
 *      affixes; structure TBD on actual inspection.)
 *   3. Dedupe mods across bases (same affix can roll on multiple bases).
 *   4. Output to src/data/poe2/itemMods.json — overwrites v1 hand-curated.
 *
 * Constraints when implementing v2:
 *   - 500 ms delay between requests (polite scraping).
 *   - Identifying User-Agent — "Omnilyth/1.0 (omnilyth.app)".
 *   - Hard-fail on selector mismatch — silent zero-mod output is the worst
 *     failure mode (degrades the live tool).
 *   - jsdom for HTML parsing (already in devDependencies).
 *   - Run manually via npm run poe2-data:scrape; never wired into build.
 *
 * Runtime today: refuses to run, prints the v2 plan.
 */

console.error('scrape-mods.js — v2 scaffold only; not yet implemented.');
console.error('See src/data/poe2/itemMods.json and waystoneMods.json for the hand-curated v1 dataset.');
console.error('See the file header for the v2 implementation plan.');
process.exit(1);
