/*
 * PreLaunchGate.jsx — Soft-deterrent holding-page wrapper for the public
 * deploy. Wraps the entire app (mounted just inside <BrowserRouter>) and
 * renders <PreLaunchPage /> instead of children when:
 *
 *   1. NOT in Vite dev mode (`import.meta.env.DEV`)
 *   AND 2. Hostname is NOT localhost / *.local / RFC 1918 LAN
 *   AND 3. The unlock token isn't present in localStorage
 *
 * Two ways to flip the unlock token on:
 *   - Konami code (↑↑↓↓←→←→BA) on document keydown
 *   - URL param `?peek=mirage` (auto-stripped via replaceState after read)
 *
 * Force-lock (for testing the gate flow) via `?lock=1` in the URL.
 *
 * This is NOT real security. The mechanism ships in client JS. Anyone who
 * reads the bundle can bypass. Goal: deter random tinkerers, not lock out
 * adversaries. See the plan file for context.
 */
import { useState, useCallback } from 'react';
import PreLaunchPage from './PreLaunchPage';
import { useKonamiCode } from '../hooks/useKonamiCode';

const UNLOCK_KEY = 'omnilyth_dev_unlock_v1';
const PEEK_VALUE = 'mirage';

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
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === 'undefined') return true; // SSR safety: default to passthrough.

    const params = new URLSearchParams(window.location.search);

    // ?peek=mirage → unlock, strip param.
    if (params.get('peek') === PEEK_VALUE) {
      writeUnlocked(true);
      stripParam('peek');
      return true;
    }

    // ?lock=1 → force-lock for testing the gate. Strip param so a refresh
    // doesn't keep re-locking.
    if (params.get('lock') === '1') {
      writeUnlocked(false);
      stripParam('lock');
      return false;
    }

    return readUnlocked();
  });

  const handleUnlock = useCallback(() => {
    writeUnlocked(true);
    setUnlocked(true);
  }, []);

  useKonamiCode(handleUnlock);

  const isDev = import.meta.env.DEV;
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const shouldGate = !isDev && !isLocalOrLAN(host) && !unlocked;

  if (shouldGate) return <PreLaunchPage />;
  return children;
}
