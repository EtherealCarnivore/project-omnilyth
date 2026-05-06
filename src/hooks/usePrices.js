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

  const fetchPrices = useCallback(async () => {
    if (!league) return;
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
      const omenFetch = (async () => {
        try {
          const url = ninjaUrl(`${pathPrefix}/api/economy/exchange/current/overview?league=${encodeURIComponent(league)}&type=Omen`);
          const res = await fetch(url);
          if (!res.ok) return;
          const data = await res.json();

          const blanching = data.lines?.find(l => l.id === 'omen-of-blanching');
          if (blanching) {
            result['omen-of-blanching'] = {
              chaosValue: blanching.volumePrimaryValue || blanching.primaryValue || 0,
              name: 'Omen of Blanching',
            };
          }
          const connections = data.lines?.find(l => l.id === 'omen-of-connections');
          if (connections) {
            result['omen-of-connections'] = {
              chaosValue: connections.volumePrimaryValue || connections.primaryValue || 0,
              name: 'Omen of Connections',
            };
          }
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

  return { prices, loading, error, refresh: fetchPrices };
}
