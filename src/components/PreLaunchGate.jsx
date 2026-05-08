/*
 * PreLaunchGate.jsx — Soft-deterrent holding-page wrapper for the public
 * deploy. Mounted INSIDE <BrowserRouter> (so useLocation() is available
 * for path-aware bypass). Renders <PreLaunchPage /> instead of children
 * when ALL of:
 *
 *   1. NOT in Vite dev mode (`import.meta.env.DEV`)
 *   AND 2. Hostname is NOT localhost / *.local / RFC 1918 LAN
 *   AND 3. The unlock token isn't present in localStorage
 *   AND 4. The current pathname is NOT in the public-route allowlist
 *
 * (4) lets the SEO surface — homepage, category overviews, privacy,
 * /poe2/runes-of-aldur, every registry tool route — pass through to
 * crawlers and direct-link visitors without the unlock token. Routes
 * outside the allowlist (today, just `/poe2` and any unknown path)
 * still see the gate.
 *
 * Two ways to flip the unlock token on:
 *   - Konami code (↑↑↓↓←→←→BA) on document keydown
 *   - URL param `?peek=mirage` (auto-stripped via replaceState after read)
 *
 * Force-lock (for testing the gate flow) via `?lock=1` in the URL.
 *
 * This is NOT real security. The mechanism ships in client JS. Anyone who
 * reads the bundle can bypass. Goal: deter random tinkerers, not lock out
 * adversaries.
 */
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PreLaunchPage from './PreLaunchPage';
import { useKonamiCode } from '../hooks/useKonamiCode';
import modules from '../modules/registry';

const UNLOCK_KEY = 'omnilyth_dev_unlock_v1';
const PEEK_VALUE = 'mirage';

// Public-route allowlist. Tool routes come from the registry — adding a
// tool there auto-allowlists it; no maintenance here.
const TOOL_ROUTES = new Set(
  modules.filter((mod) => !mod.external).map((mod) => mod.route)
);

const PUBLIC_NON_TOOL_PATHS = new Set([
  '/',                       // GameAwareIndex → HomePage in PoE 1 mode
  '/crafting',               // CraftingOverviewPage
  '/atlas',                  // AtlasOverviewPage
  '/build',                  // BuildPlanningOverviewPage
  '/leveling',               // LevelingOverviewPage
  '/privacy',                // PrivacyPage
  '/poe2',                   // Poe2HomePage (noindex, but reachable for nav)
  '/poe2/runes-of-aldur',    // RunesOfAldurPage (indexable; SEO bait)
]);

function isPublicRoute(pathname) {
  return PUBLIC_NON_TOOL_PATHS.has(pathname) || TOOL_ROUTES.has(pathname);
}

// LAN / loopback / *.local hostnames bypass the gate unconditionally.
// Mirrors the worker's DEV_ORIGIN_RE in workers/poe-ninja-proxy.js so the
// two stay aligned: anywhere we already trust for proxy origin, we also
// trust to skip the gate.
function isLocalOrLAN(host) {
  if (!host) return false;
  if (host === 'localhost' || host === '127.0.0.1') return true;
  if (host.endsWith('.local')) return true;
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
}

function readUnlocked() {
  try { return localStorage.getItem(UNLOCK_KEY) === '1'; }
  catch { return false; }
}

function writeUnlocked(value) {
  try {
    if (value) localStorage.setItem(UNLOCK_KEY, '1');
    else localStorage.removeItem(UNLOCK_KEY);
  } catch { /* storage disabled / quota — keep in-memory state regardless */ }
}

// Strip a query param via replaceState so the URL doesn't accidentally
// get shared. Returns the new search string for inspection in tests.
function stripParam(name) {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  params.delete(name);
  const qs = params.toString();
  const newPath = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
  window.history.replaceState({}, '', newPath);
  return qs;
}

export default function PreLaunchGate({ children }) {
  // Synchronous initial decision. Lazy useState init runs once, before any
  // render — so the first paint is already correct (gate vs app), no flash.
  //
  // The state is a single object because `?lock=1` needs to set BOTH
  // `unlocked: false` AND `forceGate: true` from the same URL parse —
  // otherwise dev/LAN bypasses keep the gate hidden even after the token is
  // cleared, and there'd be no way to preview the gate locally.
  const [{ unlocked, forceGate }, setState] = useState(() => {
    if (typeof window === 'undefined') return { unlocked: true, forceGate: false }; // SSR safety: default to passthrough.

    const params = new URLSearchParams(window.location.search);

    // ?peek=mirage → unlock, strip param.
    if (params.get('peek') === PEEK_VALUE) {
      writeUnlocked(true);
      stripParam('peek');
      return { unlocked: true, forceGate: false };
    }

    // ?lock=1 → force-lock + force-show-gate for this session (overrides
    // dev / LAN bypass so the page is actually previewable locally). Strip
    // the param so a reload returns to the natural state for this host.
    if (params.get('lock') === '1') {
      writeUnlocked(false);
      stripParam('lock');
      return { unlocked: false, forceGate: true };
    }

    return { unlocked: readUnlocked(), forceGate: false };
  });

  const handleUnlock = useCallback(() => {
    writeUnlocked(true);
    setState((prev) => ({ ...prev, unlocked: true }));
  }, []);

  useKonamiCode(handleUnlock);

  const location = useLocation();
  const isDev = import.meta.env.DEV;
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const pathIsPublic = isPublicRoute(location.pathname);
  // forceGate (?lock=1) explicitly overrides the public-route bypass —
  // testing the gate UX requires it to actually fire on a public path.
  // Without forceGate, the gate respects the public-route allowlist + the
  // standard dev/LAN bypass.
  const shouldGate = !unlocked && (forceGate || (!pathIsPublic && !isDev && !isLocalOrLAN(host)));

  if (shouldGate) return <PreLaunchPage onUnlock={handleUnlock} />;
  return children;
}
