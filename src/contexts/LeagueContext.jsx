import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'poe_leagues_cache_v2';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const API_URL = 'https://www.pathofexile.com/api/leagues?type=main&limit=50';

// PoE2 leagues use version-style names (e.g. "Phrecia 2.0", "Dawn 3.0")
const POE2_PATTERN = /\d+\.\d+/;

// Classify league by its name/id
function classifyLeague(id) {
  const lower = id.toLowerCase();
  const isHc = lower.startsWith('hardcore') || lower.startsWith('hc ');
  const isSsf = lower.includes('solo self-found') || lower.includes('ssf');
  const isEvent = POE2_PATTERN.test(id);
  if (isEvent && isHc && isSsf) return 'hcssf-event';
  if (isEvent && isHc) return 'hc-event';
  if (isEvent && isSsf) return 'ssf-event';
  if (isEvent) return 'event';
  if (isHc && isSsf) return 'hcssf';
  if (isHc) return 'hardcore';
  if (isSsf) return 'ssf';
  return 'softcore';
}

// Hardcoded fallback in case API is down and no cache exists
const FALLBACK_LEAGUES = [
  { value: 'Keepers', label: 'Keepers', kind: 'softcore' },
  { value: 'Hardcore Keepers', label: 'HC Keepers', kind: 'hardcore' },
  { value: 'Phrecia 2.0', label: 'Phrecia 2.0', kind: 'event' },
  { value: 'Hardcore Phrecia 2.0', label: 'HC Phrecia 2.0', kind: 'hc-event' },
  { value: 'Standard', label: 'Standard', kind: 'softcore' },
  { value: 'Hardcore', label: 'Hardcore', kind: 'hardcore' },
];

function shortenLabel(name) {
  return name
    .replace(/^Hardcore\s+/, 'HC ')
    .replace(/^Solo Self-Found\s+/, 'SSF ')
    .replace(/^HC Solo Self-Found\s+/, 'HC SSF ')
    .replace(/^Hardcore Solo Self-Found\s+/, 'HC SSF ');
}

function transformAndSort(apiLeagues) {
  // Filter out Ruthless variants
  const filtered = apiLeagues.filter(l => !l.id.toLowerCase().includes('ruthless'));

  const mapped = filtered.map(l => ({
    value: l.id,
    label: shortenLabel(l.id),
    kind: classifyLeague(l.id),
    isCurrent: l.category?.current === true,
    isPermanent: !l.category || ['Standard', 'Hardcore'].includes(l.category?.id),
  }));

  // Sort: current challenge leagues first, then permanent leagues
  mapped.sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    if (!a.isPermanent && b.isPermanent) return -1;
    if (a.isPermanent && !b.isPermanent) return 1;
    return 0;
  });

  return mapped;
}

const LeagueContext = createContext(null);

export function LeagueProvider({ children }) {
  const [leagues, setLeagues] = useState(FALLBACK_LEAGUES);
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [league, setLeague] = useState(FALLBACK_LEAGUES[0].value);

  const fetchLeagues = useCallback(async () => {
    setLeaguesLoading(true);
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { leagues: cachedLeagues, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && cachedLeagues?.length) {
          setLeagues(cachedLeagues);
          setLeague(prev => {
            const exists = cachedLeagues.some(l => l.value === prev);
            return exists ? prev : cachedLeagues[0].value;
          });
          setLeaguesLoading(false);
          return;
        }
      }

      // Fetch from API
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      const transformed = transformAndSort(data);

      if (transformed.length) {
        setLeagues(transformed);
        setLeague(prev => {
          const exists = transformed.some(l => l.value === prev);
          return exists ? prev : transformed[0].value;
        });
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          leagues: transformed,
          timestamp: Date.now(),
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch leagues, using fallback:', err);
      // Try to use stale cache
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { leagues: cachedLeagues } = JSON.parse(cached);
          if (cachedLeagues?.length) {
            setLeagues(cachedLeagues);
            setLeague(prev => {
              const exists = cachedLeagues.some(l => l.value === prev);
              return exists ? prev : cachedLeagues[0].value;
            });
          }
        }
      } catch { /* use existing fallback */ }
    } finally {
      setLeaguesLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeagues(); }, [fetchLeagues]);

  return (
    <LeagueContext.Provider value={{ league, setLeague, leagues, leaguesLoading }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const ctx = useContext(LeagueContext);
  if (!ctx) throw new Error('useLeague must be used within LeagueProvider');
  return ctx;
}
