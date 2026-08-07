/*
 * usePrices.js — Fetches currency + omen prices from poe.ninja.
 *
 * The hook that keeps the entire app's economy data flowing. Fires off
 * parallel fetch requests for each currency type because poe.ninja's API
 * doesn't have a "give me everything" endpoint. Classic third-party API design.
 *
 * In production we route through a CORS proxy because browsers won't let you
 * fetch from poe.ninja directly. CORS: making simple HTTP requests complicated
 * since 2014. In my HFT stack I make 50,000 API calls per second with raw
 * sockets. Here I need a proxy service just to do ONE fetch. Clown world.
 *
 * Dual-game (2026-05-06): the path prefix (/poe1 or /poe2) comes from
 * GameContext via apiPathPrefix(game). The Cloudflare Worker allowlist
 * permits both games' paths.
 */
import { useState, useEffect, useCallback } from 'react';
import { ninjaUrl } from '../utils/proxyUrl';
import { useGame, apiPathPrefix } from '../contexts/GameContext';

// Every currency we care about. Adding a new one? Just append the slug here.
// If only React state management were this straightforward.
//
// EXTERNAL: each string is a poe.ninja API key — kebab-case slug exactly as
// it appears in their `/economy/exchange/current/details?id=...` endpoint.
// We trust the spelling; mismatches return undefined silently with no error
// so a typo here would just make that currency permanently absent from the
// app. Calculator pages (fusingCalc page, socketCalc page, voriciCalc page)
// index `prices['orb-of-fusing']` etc. directly — keep these slugs in sync
// with the keys those calculators expect.
const CURRENCY_IDS = ['chromatic-orb', 'jewellers-orb', 'tainted-chromatic-orb', 'orb-of-fusing', 'tainted-orb-of-fusing', 'vaal-orb', 'divine-orb'];

// 24h client-side cache. These prices feed crafting calculators (fusing/chromatic
// ratios etc.) that don't need sub-day freshness, so caching spares poe.ninja + the
// Worker proxy a full refetch on every app load. refresh() bypasses it. Keyed by
// game + league because each pair has its own currency set.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
// Bump the version suffix whenever the cached SHAPE or the meaning of a stored
// value changes — otherwise up to 24h of browsers keep serving the old blob and
// a fix looks like it didn't land. v2: omen prices were storing trade volume.
const CACHE_VERSION = 'v2';
const cacheKey = (pathPrefix, league) =>
  `omnilyth_prices_${CACHE_VERSION}_${pathPrefix.replace(/^\//, '')}_${league}`;

function readCachedPrices(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (!data || typeof ts !== 'number' || Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCachedPrices(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* storage disabled / quota exceeded — fine, we just refetch next load */
  }
}

/**
 * Fetches live currency prices from poe.ninja for a given league.
 * Returns { prices, loading, error, refresh }
 *
 * Currency / Omen IDs in this hook are PoE 1-flavored — the calculators that
 * consume them (Chromatic, Tainted, Blanching, Fusing, etc.) are all PoE 1-only
 * tools. In PoE 2 mode the path prefix flips to /poe2 and most of these IDs
 * will return nothing (poe.ninja's PoE 2 namespace has its own currency set);
 * that's the expected behavior — the consuming calculators won't be reachable
 * in PoE 2 mode anyway because they're filtered out of the registry.
 */
export function usePrices(league) {
  const { game } = useGame();
  const pathPrefix = apiPathPrefix(game);

  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrices = useCallback(async (force = false) => {
    if (!league) return;
    const key = cacheKey(pathPrefix, league);

    // Serve from the 24h cache unless the caller explicitly forced a refresh.
    if (!force) {
      const cached = readCachedPrices(key);
      if (cached) {
        setPrices(cached);
        setError(null);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = {};

      // Fetch currency prices in parallel — Promise.all because sequential fetches
      // are for people who enjoy watching loading spinners.
      // In Java I'd use CompletableFuture.allOf() and it would feel exactly the same.
      // OK fine, JS got this one right. I'll allow it.
      const currencyFetches = CURRENCY_IDS.map(async (id) => {
        try {
          const url = ninjaUrl(`${pathPrefix}/api/economy/exchange/current/details?league=${encodeURIComponent(league)}&type=Currency&id=${id}`);
          const res = await fetch(url);
          if (!res.ok) return;
          const data = await res.json();
          const chaosPair = data.pairs?.find(p => p.id === 'chaos');
          if (chaosPair) {
            result[id] = {
              chaosRate: chaosPair.rate,
              name: data.item?.name || id,
            };
          }
        } catch {
          // Individual currency fetch failed, skip it
        }
      });

      // Fetch omen prices from exchange endpoint (more accurate than item overview)
      //
      // FIELD TRAP: an overview line carries THREE numbers and only one is a price.
      //   primaryValue        chaos per unit          ← the price
      //   volumePrimaryValue  units traded            ← volume, off by ~5 orders of magnitude
      //   maxVolumeRate       units per chaos         ← 1 / primaryValue, the inverse
      // Cross-checked against the Currency endpoint: `fusing` reports
      // primaryValue 0.0797, which matches chaosPair.rate exactly, while its
      // volumePrimaryValue is 68884. Reading volume as price is what made the
      // Omen of Connections quote ~22,500c instead of ~217c.
      //
      // Named chaosValue (not chaosRate) to match the item-overview shape that
      // DustCalculator and ScarabCalculator already consume. Same unit either way.
      const omenFetch = (async () => {
        try {
          const url = ninjaUrl(`${pathPrefix}/api/economy/exchange/current/overview?league=${encodeURIComponent(league)}&type=Omen`);
          const res = await fetch(url);
          if (!res.ok) return;
          const data = await res.json();

          // No `|| 0` fallback: a missing price must stay absent so the UI hides
          // the quote, rather than rendering a confident "0c" that reads as free.
          const readOmen = (id, name) => {
            const line = data.lines?.find(l => l.id === id);
            if (!line || typeof line.primaryValue !== 'number') return;
            result[id] = { chaosValue: line.primaryValue, name };
          };

          // 3.29 renamed Omen of Blanching to Omen of Trichromatism and inverted
          // what it does, so this id no longer resolves and the (retired)
          // Blanching calculator correctly shows no price. Kept alongside — not
          // repointed at — trichromatism: that omen guarantees one R+G+B, which
          // is a different craft, so its price would be a wrong answer for the
          // Blanching tool, not merely a stale one.
          readOmen('omen-of-blanching', 'Omen of Blanching');
          readOmen('omen-of-trichromatism', 'Omen of Trichromatism');
          readOmen('omen-of-connections', 'Omen of Connections');
          readOmen('omen-of-the-jeweller', 'Omen of the Jeweller');
        } catch {
          // Omen fetch failed, skip it
        }
      })();

      await Promise.all([...currencyFetches, omenFetch]);

      if (Object.keys(result).length === 0) {
        setError('Could not fetch prices. League may be unavailable.');
        setPrices(null);
      } else {
        setPrices(result);
        writeCachedPrices(key, result);
      }
    } catch (e) {
      setError('Failed to fetch prices.');
      setPrices(null);
    } finally {
      setLoading(false);
    }
  }, [league, pathPrefix]);

  // useEffect + useCallback: the "please trust me React, I know when to fetch" ritual
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // refresh() forces a network refetch, bypassing (and overwriting) the cache.
  const refresh = useCallback(() => fetchPrices(true), [fetchPrices]);

  return { prices, loading, error, refresh };
}
