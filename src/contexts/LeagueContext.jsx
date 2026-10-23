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
 * Dual-game: the league pool is per-game, each from its own GGG endpoint.
 *   PoE 1 — /api/leagues            (realm "pc", has category.current)
 *   PoE 2 — /api/trade2/data/leagues (realm "poe2", newest challenge league
 *           first, no category field)
 * The Worker's POE_ALLOWED '/api/trade' prefix already covers trade2.
 * The cache and active-league selection are per-game so a user hopping
 * between games doesn't clobber their PoE 1 league pick when they peek
 * at PoE 2.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { poeUrl } from '../utils/proxyUrl';
import { useGame } from './GameContext';

// v4: v3 caches held a PoE 2 list of only Standard/Hardcore (old name-pattern bug).
const CACHE_KEY_PREFIX = 'poe_leagues_cache_v4_';
const ACTIVE_LEAGUE_KEY_PREFIX = 'omnilyth_active_league_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h TTL

// Before the v4 fix PoE 2 only ever offered Standard/Hardcore, so a stored
// PoE 2 pick is not a real choice. Drop it once so users land on the current
// challenge league.
const POE2_PICK_RESET_KEY = 'omnilyth_active_league_poe2_reset_v1';
try {
  if (!localStorage.getItem(POE2_PICK_RESET_KEY)) {
    localStorage.removeItem(ACTIVE_LEAGUE_KEY_PREFIX + 'poe2');
    localStorage.setItem(POE2_PICK_RESET_KEY, '1');
  }
} catch { /* storage disabled */ }

const API_URL = {
  poe1: poeUrl('/api/leagues?type=main&limit=50'),
  poe2: poeUrl('/api/trade2/data/leagues'),
};
const REALM = { poe1: 'pc', poe2: 'poe2' };

// Permanent league names that exist for both games (PoE 2 has its own
// Standard / Hardcore separate from PoE 1's). Same name, different game,
// scoped by the apiPathPrefix(game) helper at price-fetch time.
const PERMANENT_LEAGUE_NAMES = new Set(['Standard', 'Hardcore']);

// Classify league by its name/id — string parsing that makes me miss SQL enums
function classifyLeague(id) {
  const lower = id.toLowerCase();
  const isHc = lower.startsWith('hardcore') || lower.startsWith('hc ');
  const isSsf = lower.includes('solo self-found') || lower.includes('ssf');
  if (isHc && isSsf) return 'hcssf';
  if (isHc) return 'hardcore';
  if (isSsf) return 'ssf';
  return 'softcore';
}

// Hardcoded fallback in case API is down and no cache exists.
// The challenge league is pinned here too so an API outage still shows the
// league players are actually in — refresh it each league (~every 3 months).
// Values are the literal poe.ninja/GGG keys: PoE 1 spells out "Hardcore ",
// PoE 2 abbreviates to "HC " — don't normalise that away in shared code.
// No SSF/Ruthless entries: poe.ninja publishes no economy data for them.
const FALLBACK_POE1 = [
  { value: 'Allflame', label: 'Allflame', kind: 'softcore', isCurrent: true },
  { value: 'Hardcore Allflame', label: 'HC Allflame', kind: 'hardcore' },
  { value: 'Standard', label: 'Standard', kind: 'softcore' },
  { value: 'Hardcore', label: 'Hardcore', kind: 'hardcore' },
];

// PoE 2 fallback, used only when the API and cache both fail. Pin the
// current challenge league here each league (Forbidden Rites since 0.5.5,
// 2026-09-04; both it and Runes of Aldur end at 1.0 on 2026-12-11).
const FALLBACK_POE2 = [
  { value: 'Forbidden Rites', label: 'Forbidden Rites', kind: 'softcore', isCurrent: true },
  { value: 'HC Forbidden Rites', label: 'HC Forbidden Rites', kind: 'hardcore', isCurrent: true },
  { value: 'Runes of Aldur', label: 'Runes of Aldur', kind: 'softcore' },
  { value: 'HC Runes of Aldur', label: 'HC Runes of Aldur', kind: 'hardcore' },
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

// PoE 1 returns a bare array; PoE 2 (trade2) wraps it in { result: [...] }.
function unwrapLeagues(data) {
  return Array.isArray(data) ? data : Array.isArray(data?.result) ? data.result : [];
}

// PoE 2's trade2 list has no category.current, but GGG orders it newest
// challenge league first. The current league is that first non-permanent
// entry plus its HC twin.
function currentPoe2Base(leagues) {
  const first = leagues.find(l => !PERMANENT_LEAGUE_NAMES.has(l.id));
  return first ? first.id.replace(/^(HC|Hardcore)\s+/i, '') : null;
}

function transformAndSort(apiLeagues, game) {
  // Filter out Ruthless variants — nobody plays Ruthless and deep down we all know it.
  // GGG abbreviates some to a bare "R" token ("SSF R Allflame").
  const isRuthless = id => id.toLowerCase().includes('ruthless') || /(^|\s)R(\s|$)/.test(id);
  const filtered = apiLeagues.filter(
    l => (!l.realm || l.realm === REALM[game]) && !isRuthless(l.id),
  );

  const poe2Current = game === 'poe2' ? currentPoe2Base(filtered) : null;

  const mapped = filtered.map(l => {
    const isPermanent = game === 'poe2'
      ? PERMANENT_LEAGUE_NAMES.has(l.id)
      : !l.category || ['Standard', 'Hardcore'].includes(l.category?.id);
    const isCurrent = game === 'poe2'
      ? !isPermanent && l.id.replace(/^(HC|Hardcore)\s+/i, '') === poe2Current
      : l.category?.current === true;
    return {
      value: l.id,
      label: shortenLabel(l.id),
      kind: classifyLeague(l.id),
      isCurrent,
      isPermanent,
    };
  });

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
      const res = await fetch(API_URL[game] ?? API_URL.poe1);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      const transformed = transformAndSort(unwrapLeagues(data), game);

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
