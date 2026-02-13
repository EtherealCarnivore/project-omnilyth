import { useState, useEffect, useCallback } from 'react';

const CURRENCY_IDS = ['chromatic-orb', 'jewellers-orb', 'tainted-chromatic-orb'];

// In dev, Vite proxies /api/poe-ninja/* -> https://poe.ninja/*
// In production, we route through a CORS proxy since poe.ninja doesn't allow browser requests
const isDev = import.meta.env.DEV;

function ninjaUrl(path) {
  if (isDev) return `/api/poe-ninja${path}`;
  return `https://corsproxy.io/?url=${encodeURIComponent(`https://poe.ninja${path}`)}`;
}

/**
 * Fetches live currency prices from poe.ninja for a given league.
 * Returns { prices, loading, error, refresh }
 */
export function usePrices(league) {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrices = useCallback(async () => {
    if (!league) return;
    setLoading(true);
    setError(null);

    try {
      const result = {};

      // Fetch currency prices in parallel
      const currencyFetches = CURRENCY_IDS.map(async (id) => {
        try {
          const url = ninjaUrl(`/poe1/api/economy/exchange/current/details?league=${encodeURIComponent(league)}&type=Currency&id=${id}`);
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

      // Fetch omen prices
      const omenFetch = (async () => {
        try {
          const url = ninjaUrl(`/api/data/itemoverview?league=${encodeURIComponent(league)}&type=Omen`);
          const res = await fetch(url);
          if (!res.ok) return;
          const data = await res.json();
          const blanching = data.lines?.find(l =>
            l.name?.toLowerCase().includes('blanching')
          );
          if (blanching) {
            result['omen-of-blanching'] = {
              chaosValue: blanching.chaosValue,
              name: blanching.name || 'Omen of Blanching',
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
  }, [league]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { prices, loading, error, refresh: fetchPrices };
}
