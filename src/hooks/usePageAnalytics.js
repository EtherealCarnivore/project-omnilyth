/*
 * usePageAnalytics.js — cookieless page analytics.
 *
 * Sends one 'view' beacon when a route is entered and one 'leave' beacon with
 * the time the page was actually visible (tab hidden time is excluded) when
 * the route changes or the tab is hidden. Payload: route path, dwell ms,
 * game, viewport class. No cookies, no storage, no user or session id; the
 * Worker (workers/poe-ninja-proxy.js handleBeacon) adds only the country.
 *
 * Off in dev unless VITE_ANALYTICS_DEV=1. Off when the browser sends Global
 * Privacy Control or Do Not Track, or when the visitor opted out on the
 * privacy page (localStorage OPT_OUT_KEY, checked on every send).
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { beaconUrl } from '../utils/proxyUrl';

export const OPT_OUT_KEY = 'omnilyth_analytics_optout_v1';

export const browserBlocksAnalytics =
  typeof navigator !== 'undefined' &&
  (!!navigator.globalPrivacyControl || navigator.doNotTrack === '1');

const ENABLED =
  typeof navigator !== 'undefined' &&
  (!import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_DEV === '1') &&
  !browserBlocksAnalytics;

export function isOptedOut() {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

export function setOptedOut(value) {
  try {
    if (value) localStorage.setItem(OPT_OUT_KEY, '1');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // Storage blocked: nothing persists, and nothing else to do.
  }
}

// Dwell segments shorter than this are bounces between tabs, not reading.
const MIN_LEAVE_MS = 1000;

function viewportClass() {
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function send(payload) {
  if (isOptedOut()) return;
  try {
    const body = new Blob([JSON.stringify(payload)], { type: 'text/plain' });
    if (navigator.sendBeacon) navigator.sendBeacon(beaconUrl(), body);
    else fetch(beaconUrl(), { method: 'POST', body, keepalive: true, mode: 'cors' }).catch(() => {});
  } catch {
    // Analytics must never break the page.
  }
}

export default function usePageAnalytics(game) {
  const { pathname } = useLocation();
  const state = useRef({ path: null, visibleSince: null, accumulated: 0 });
  const gameRef = useRef(game);
  gameRef.current = game;

  const flush = () => {
    const s = state.current;
    if (!s.path) return;
    const ms = s.accumulated + (s.visibleSince ? Date.now() - s.visibleSince : 0);
    s.accumulated = 0;
    s.visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    if (ms >= MIN_LEAVE_MS) send({ p: s.path, ms, g: gameRef.current, v: viewportClass(), e: 'leave' });
  };

  // Route change: close out the previous page, open the new one.
  useEffect(() => {
    if (!ENABLED) return;
    flush();
    const s = state.current;
    s.path = pathname;
    s.accumulated = 0;
    s.visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    send({ p: pathname, ms: 0, g: gameRef.current, v: viewportClass(), e: 'view' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Tab hide/show: report visible time on hide (the page may never come back),
  // restart the clock on show.
  useEffect(() => {
    if (!ENABLED) return undefined;
    const onVisibility = () => {
      const s = state.current;
      if (document.visibilityState === 'hidden') {
        flush();
        s.visibleSince = null;
      } else if (!s.visibleSince) {
        s.visibleSince = Date.now();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
