/*
 * leaguePick.js — Pure rules for keeping a stored league pick honest.
 *
 * Why this exists: poe.ninja keeps answering a retired league key (Allflame,
 * Mirage, …) with HTTP 200 and frozen prices, so a stale pick never surfaces
 * an error — the user just quietly sees last league's economy. These helpers
 * decide when a pick is stale and what to replace it with. No React, no
 * localStorage: callers pass values in, so the rules run in plain node.
 *
 * Replacements are always chosen from a supplied list of literal API keys —
 * never constructed by string surgery on a league name.
 */

// Permanent leagues are never stale.
const PERMANENT = new Set(['Standard', 'Hardcore']);

export const isHardcoreLeague = id =>
  /^(hardcore|hc)(\s|$)/i.test(id || '');

/** True when `pick` is `base` or a variant of it ("Hardcore X", "SSF R X"). */
export function isVariantOf(pick, base) {
  return !!pick && !!base && (pick === base || pick.endsWith(' ' + base));
}

/**
 * The entry to move a user to when their pick is gone: the first current
 * league of the same hardcore-ness, else the first current one, else the
 * list head (the lists are sorted current-first).
 */
export function replacementPick(pick, leagues) {
  if (!Array.isArray(leagues) || !leagues.length) return null;
  const hc = isHardcoreLeague(pick);
  const current = leagues.filter(l => l.isCurrent);
  const match = current.find(l => isHardcoreLeague(l.value) === hc) ?? current[0] ?? leagues[0];
  return match.value;
}

/** Keep `pick` if `leagues` offers it, else the replacement. */
export function reconcilePick(pick, leagues) {
  if (!Array.isArray(leagues) || !leagues.length) return pick;
  if (pick && leagues.some(l => l.value === pick)) return pick;
  return replacementPick(pick, leagues) ?? pick;
}

/** A cached league list written before the current launch describes the previous league. */
export function cachePredatesLaunch(cacheTimestamp, launchTimestamp, now) {
  const launch = Date.parse(launchTimestamp);
  if (!Number.isFinite(launch) || now < launch) return false;
  return typeof cacheTimestamp !== 'number' || cacheTimestamp < launch;
}

/**
 * Is a stored pick a league that has ended? Used before the first render and
 * when the league API is unreachable, i.e. when no live list is available.
 * Only fires once the configured launch has happened, so a league name set
 * early for the countdown can't evict players still in the old league.
 *
 * Stale when either:
 *   (a) it is a variant of a known retired league base (`retiredBases`), or
 *   (b) a league-list cache written before the launch marked it as the
 *       current challenge league, and the pinned fallback (current league)
 *       does not contain it. This is what lets the next league change work
 *       without new code: last league's cache identifies last league.
 * Never stale: permanent leagues, anything in `fallback`, an empty pick.
 * Private leagues are never in either source, so they are never matched.
 */
export function isRetiredPick({ pick, fallback = [], retiredBases = [], cache, launchTimestamp, now }) {
  if (!pick || PERMANENT.has(pick)) return false;
  if (fallback.some(l => l.value === pick)) return false;
  const launch = Date.parse(launchTimestamp);
  if (!Number.isFinite(launch) || now < launch) return false;

  if (retiredBases.some(base => isVariantOf(pick, base))) return true;

  if (cache && cachePredatesLaunch(cache.timestamp, launchTimestamp, now)) {
    const entry = cache.leagues?.find(l => l.value === pick);
    if (entry && entry.isCurrent && !entry.isPermanent) return true;
  }
  return false;
}

/**
 * Price-cache TTL. Launch fortnight (KB league cadence: "Week 0-2 — prices
 * volatile"): 1h, so a calculator opened on day 2 is not running on day-1
 * ratios. After that: 24h. Floor is the Worker's 300s edge cache, so going
 * below 1h would mostly re-read the same edge copy.
 */
export const PRICE_TTL_DEFAULT_MS = 24 * 60 * 60 * 1000;
export const PRICE_TTL_LAUNCH_MS = 60 * 60 * 1000;
export const LAUNCH_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export function priceCacheTtl(launchTimestamp, now) {
  const launch = Date.parse(launchTimestamp);
  if (!Number.isFinite(launch)) return PRICE_TTL_DEFAULT_MS;
  const age = now - launch;
  return age >= 0 && age < LAUNCH_WINDOW_MS ? PRICE_TTL_LAUNCH_MS : PRICE_TTL_DEFAULT_MS;
}
