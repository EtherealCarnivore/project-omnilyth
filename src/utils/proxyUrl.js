/**
 * proxyUrl.js — Central proxy URL resolution.
 *
 * In dev: Vite dev-server proxy handles ninja calls; everything else hits the
 * deployed Cloudflare Worker (which allows localhost origins).
 * In production: Cloudflare Worker. Override with VITE_PROXY_URL at build time.
 */

const isDev = import.meta.env.DEV;

const PROXY_BASE = import.meta.env.VITE_PROXY_URL || 'https://api.omnilyth.app';

/** Build a proxied poe.ninja URL: ninjaUrl('/poe1/api/...') */
export function ninjaUrl(path) {
  if (isDev) return `/api/poe-ninja${path}`;
  return `${PROXY_BASE}?path=${encodeURIComponent(path)}`;
}

/** Build a proxied pathofexile.com URL: poeUrl('/api/leagues?type=main&limit=50') */
export function poeUrl(endpoint) {
  return `${PROXY_BASE}?endpoint=${encodeURIComponent(endpoint)}`;
}

/** Build a PoB build-code fetch URL: pobUrl('pobbin', 'abc123') */
export function pobUrl(source, id) {
  return `${PROXY_BASE}?pob=${encodeURIComponent(source)}&id=${encodeURIComponent(id)}`;
}

/** POST endpoint for feedback submissions (creates a GitHub issue server-side). */
export function feedbackUrl() {
  return PROXY_BASE;
}

/** GET endpoint for patch notes (server-side wiki discovery + parsing). */
export function patchNotesUrl() {
  return `${PROXY_BASE}?notes=patch`;
}
