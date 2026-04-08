/**
 * proxyUrl.js — Central proxy URL resolution.
 *
 * In dev: Vite proxy handles it.
 * In production: Uses VITE_PROXY_URL env var, with fallback detection
 * for Netlify (relative path) vs GitHub Pages (Cloudflare Worker).
 */

const isDev = import.meta.env.DEV;

function getProxyBase() {
  if (import.meta.env.VITE_PROXY_URL) return import.meta.env.VITE_PROXY_URL;

  const hostname = window.location.hostname;

  // Netlify: use same-origin serverless function
  if (hostname.includes('netlify.app') || hostname === 'omnilyth.app' || hostname === 'www.omnilyth.app') {
    return '/.netlify/functions/poe-ninja-proxy';
  }

  // GitHub Pages or anywhere else: use Cloudflare Worker
  return 'https://omnilyth-proxy.k-genov.workers.dev';
}

const PROXY_BASE = getProxyBase();

/** Build a proxied poe.ninja URL: ninjaUrl('/poe1/api/...') */
export function ninjaUrl(path) {
  if (isDev) return `/api/poe-ninja${path}`;
  return `${PROXY_BASE}?path=${encodeURIComponent(path)}`;
}

/** Build a proxied pathofexile.com URL: poeUrl('/api/leagues?type=main&limit=50') */
export function poeUrl(endpoint) {
  return `${PROXY_BASE}?endpoint=${encodeURIComponent(endpoint)}`;
}
