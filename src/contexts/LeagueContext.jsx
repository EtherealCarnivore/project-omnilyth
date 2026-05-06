/*
 * LeagueContext.jsx — Fetches and caches PoE league data, scoped per game.
 *
 * Three layers of fallback: API → localStorage cache → hardcoded list.
 * This is the kind of defensive programming you learn from years of
 * exchange APIs going down at 3 AM during a flash crash.
 * GGG's API doesn't need an auth token though, which honestly shocked me.
 * No API key? No rate limits? No HMAC signatures? My exchange feeds require
 * more auth to get a heartbeat than GGG needs for their entire league list.
 *
 * Dual-game (2026-05-06): the league pool is per-game. PoE 1 and PoE 2
 * share API endpoints but expose separate league sets — we filter the
 * mixed response by the version-style name pattern (POE2_PATTERN). The
 * cache and active-league selection are also per-game so a user hopping
 * between games doesn't clobber their PoE 1 league pick when they peek
 * at PoE 2.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { poeUrl } from '../utils/proxyUrl';
import { useGame } from './GameContext';

const CACHE_KEY_PREFIX = 'poe_leagues_cache_v3_';
const ACTIVE_LEAGUE_KEY_PREFIX = 'omnilyth_active_league_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h TTL

const API_URL = poeUrl('/api/leagues?type=main&limit=50');

// PoE 2 leagues use version-style names (e.g. "Phrecia 2.0", "Dawn 3.0").
// Permanent leagues ("Standard", "Hardcore") exist in both games and aren't
// detected by this pattern — they're matched by name in the filter helper.
const POE2_PATTERN = /\d+\.\d+/;

// Permanent league names that exist for both games (PoE 2 has its own
// Standard / Hardcore separate from PoE 1's). Same name, different game,
// scoped by the apiPathPrefix(game) helper at price-fetch time.
const PERMANENT_LEAGUE_NAMES = new Set(['Standard', 'Hardcore']);

// Classify league by its name/id — string parsing that makes me miss SQL enums
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

// Hardcoded fallback in case API is down and no cache exists.
// Only permanent leagues here — challenge league names change every ~3 months
// and the API will sort the current one to the top when it's live.
const FALLBACK_POE1 = [
  { value: 'Mirage', label: 'Mirage', kind: 'softcore', isCurrent: true },
  { value: 'Standard', label: 'Standard', kind: 'softcore' },
  { value: 'Hardcore', label: 'Hardcore', kind: 'hardcore' },
];

// PoE 2 fallback. Pre-0.5 challenge leagues won't be enumerated here;
// the API fills them in when reachable. Standard / Hardcore are always
// available even pre-0.5 (PoE 2 maintains its own permanent leagues).
const FALLBACK_POE2 = [
  { value: 'Standard', label: 'Standard', kind: 'softcore' },
  { value: 'Hardcore', label: 'Hardcore', kind: 'hardcore' },
];

function fallbackForGame(game) {
  return game === 'poe2' ? FALLBACK_POE2 : FALLBACK_POE1;
}

function shortenLabel(name) {
  return name
    .replace(/^Hardcore\s+/, 'HC ')
    .replace(/^Solo Self-Found\s+/, 'SSF ')
    .replace(/^HC Solo Self-Found\s+/, 'HC SSF ')
    .replace(/^Hardcore Solo Self-Found\s+/, 'HC SSF ');
}

// GGG's /api/leagues currently returns BOTH games' leagues mixed in one
// response (no canonical `realm` field documented as of 2026-05-06). We
// filter client-side by version-style name pattern + permanent-league
// name set. If GGG ships a `realm` field later, switch this to
// `apiLeagues.filter(l => l.realm === (game === 'poe2' ? 'poe2' : 'pc'))`.
function filterLeaguesForGame(apiLeagues, game) {
  if (game === 'poe2') {
    return apiLeagues.filter(
      l => POE2_PATTERN.test(l.id) || PERMANENT_LEAGUE_NAMES.has(l.id),
    );
  }
  // PoE 1: exclude version-style names (those are PoE 2 challenge leagues).
  // Permanent leagues stay because POE2_PATTERN doesn't match them.
  return apiLeagues.filter(l => !POE2_PATTERN.test(l.id));
}

function transformAndSort(apiLeagues, game) {
  // Filter out Ruthless variants — nobody plays Ruthless and deep down we all know it
  const filtered = filterLeaguesForGame(apiLeagues, game).filter(
    l => !l.id.toLowerCase().includes('ruthless'),
  );

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

function readPersistedActiveLeague(game) {
  try {
    return localStorage.getItem(ACTIVE_LEAGUE_KEY_PREFIX + game);
  } catch {
    return null;
  }
}

const LeagueContext = createContext(null);

export function LeagueProvider({ children }) {
  const { game } = useGame();

  const cacheKey = CACHE_KEY_PREFIX + game;
  const activeLeagueKey = ACTIVE_LEAGUE_KEY_PREFIX + game;

  // Initialize against the current game's fallback. Synchronous read of
  // the persisted active league so a returning user lands on their last
  // pick rather than a "default → flicker → restore" sequence.
  const [leagues, setLeagues] = useState(() => fallbackForGame(game));
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [league, setLeagueState] = useState(() => {
    const persisted = readPersistedActiveLeague(game);
    if (persisted) return persisted;
    return fallbackForGame(game)[0]?.value ?? '';
  });

  const setLeague = useCallback(
    (value) => {
      setLeagueState(value);
      try {
        localStorage.setItem(activeLeagueKey, value);
      } catch {
        /* storage quota or disabled — keep the in-memory swap regardless */
      }
    },
    [activeLeagueKey],
  );

  const fetchLeagues = useCallback(async () => {
    setLeaguesLoading(true);
    try {
      // Check cache first
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { leagues: cachedLeagues, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && cachedLeagues?.length) {
          setLeagues(cachedLeagues);
          setLeagueState(prev => {
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
      const transformed = transformAndSort(data, game);

      if (transformed.length) {
        setLeagues(transformed);
        setLeagueState(prev => {
          const exists = transformed.some(l => l.value === prev);
          return exists ? prev : transformed[0].value;
        });
        localStorage.setItem(cacheKey, JSON.stringify({
          leagues: transformed,
          timestamp: Date.now(),
        }));
      } else {
        // API returned an empty filtered list — fall back to the hardcoded set.
        // Common during pre-launch windows where PoE 2 has no current league.
        setLeagues(fallbackForGame(game));
      }
    } catch (err) {
      console.warn('Failed to fetch leagues, using fallback:', err);
      // Try to use stale cache
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { leagues: cachedLeagues } = JSON.parse(cached);
          if (cachedLeagues?.length) {
            setLeagues(cachedLeagues);
            setLeagueState(prev => {
              const exists = cachedLeagues.some(l => l.value === prev);
              return exists ? prev : cachedLeagues[0].value;
            });
          }
        }
      } catch { /* use existing fallback */ }
    } finally {
      setLeaguesLoading(false);
    }
  }, [game, cacheKey]);

  // Re-fetches whenever `game` changes, by way of fetchLeagues' deps.
  // The classic useEffect-calls-useCallback dance. React devs call this "elegant".
  useEffect(() => { fetchLeagues(); }, [fetchLeagues]);

  // When game changes, swap the in-memory active league to whatever this
  // game has persisted (or its fallback) immediately, so the swap feels
  // synchronous even before fetchLeagues lands the new league list.
  useEffect(() => {
    const persisted = readPersistedActiveLeague(game);
    if (persisted) {
      setLeagueState(persisted);
    } else {
      setLeagueState(fallbackForGame(game)[0]?.value ?? '');
    }
    // intentionally only re-run on game change; setLeagueState is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

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
