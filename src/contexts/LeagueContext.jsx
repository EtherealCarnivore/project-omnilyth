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
import LEAGUE_CONFIG from '../config/leagueConfig';
import {
  reconcilePick,
  replacementPick,
  isRetiredPick,
  cachePredatesLaunch,
} from '../utils/leaguePick';

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
  { value: 'Covens', label: 'Covens', kind: 'softcore', isCurrent: true },
  { value: 'Hardcore Covens', label: 'HC Covens', kind: 'hardcore', isCurrent: true },
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

// Retired PoE 1 challenge leagues. poe.ninja still answers their keys with
// HTTP 200 and frozen prices, so a stored pick naming one fails silently.
// The list only covers the first render and API outages: once a live league
// list arrives, any pick it doesn't contain is replaced (see fetchLeagues),
// so the next league change needs no edit here — appending is optional.
const RETIRED_POE1_BASES = ['Allflame', 'Mirage'];

// Once per PoE 1 launch (marker = LEAGUE_CONFIG.launchTimestamp), before the
// first render: move a stored pick that names an ended league to the current
// one, keeping hardcore picks hardcore. Valid picks (Standard, Hardcore, any
// current-league variant, anything outside the rules) are left alone.
const POE1_PICK_CHECK_KEY = 'omnilyth_active_league_poe1_checked';
try {
  const launch = LEAGUE_CONFIG.launchTimestamp;
  const now = Date.now();
  if (localStorage.getItem(POE1_PICK_CHECK_KEY) !== launch && now >= Date.parse(launch)) {
    const pickKey = ACTIVE_LEAGUE_KEY_PREFIX + 'poe1';
    const pick = localStorage.getItem(pickKey);
    let cache = null;
    try { cache = JSON.parse(localStorage.getItem(CACHE_KEY_PREFIX + 'poe1')); } catch { /* corrupt cache */ }
    if (isRetiredPick({
      pick,
      fallback: FALLBACK_POE1,
      retiredBases: RETIRED_POE1_BASES,
      cache,
      launchTimestamp: launch,
      now,
    })) {
      localStorage.setItem(pickKey, replacementPick(pick, FALLBACK_POE1));
    }
    localStorage.setItem(POE1_PICK_CHECK_KEY, launch);
  }
} catch { /* storage disabled */ }

// A PoE 1 league-list cache written before the configured launch lists the
// previous league as current — never serve or restore it after launch.
// (PoE 2 launches aren't in leagueConfig, so this is PoE 1 only.)
function cacheIsPreLaunch(game, timestamp) {
  return game === 'poe1'
    && cachePredatesLaunch(timestamp, LEAGUE_CONFIG.launchTimestamp, Date.now());
}

// A live list that carries a current challenge league is trusted enough to
// rewrite the stored pick; a degraded one (e.g. only Standard) is not.
function isHealthyList(list) {
  return list.some(l => l.isCurrent && !l.isPermanent);
}

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

  // When game changes, swap the in-memory active league to whatever this
  // game has persisted (or its fallback) immediately, so the swap feels
  // synchronous even before fetchLeagues lands the new league list.
  // Declared BEFORE the fetch effect on purpose: on a league-cache hit
  // fetchLeagues reconciles the pick synchronously, and this plain set must
  // be queued first or it would overwrite that correction with the stale
  // stored value (which is how a stored Allflame pick used to survive).
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

  // Apply a live (or <24h cached live) list: keep the pick if offered, else
  // move to the current league and persist that, so the stale pick isn't
  // re-read on the next load and briefly fetched again.
  const applyLiveList = useCallback((list) => {
    setLeagues(list);
    setLeagueState(prev => reconcilePick(prev, list));
    if (!isHealthyList(list)) return;
    try {
      const stored = localStorage.getItem(activeLeagueKey);
      if (stored && !list.some(l => l.value === stored)) {
        localStorage.setItem(activeLeagueKey, replacementPick(stored, list));
      }
    } catch { /* storage disabled */ }
  }, [activeLeagueKey]);

  const fetchLeagues = useCallback(async () => {
    setLeaguesLoading(true);
    try {
      // Check cache first
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { leagues: cachedLeagues, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && cachedLeagues?.length
            && !cacheIsPreLaunch(game, timestamp)) {
          applyLiveList(cachedLeagues);
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
        applyLiveList(transformed);
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
      // Try to use stale cache — unless it predates the current launch, in
      // which case it still lists the ended league as current and the pinned
      // fallback (current league) is the better answer. In-memory only: a
      // stale list is not trusted to rewrite the stored pick.
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { leagues: cachedLeagues, timestamp } = JSON.parse(cached);
          if (cachedLeagues?.length && !cacheIsPreLaunch(game, timestamp)) {
            setLeagues(cachedLeagues);
            setLeagueState(prev => reconcilePick(prev, cachedLeagues));
          }
        }
      } catch { /* use existing fallback */ }
    } finally {
      setLeaguesLoading(false);
    }
  }, [game, cacheKey, applyLiveList]);

  // Re-fetches whenever `game` changes, by way of fetchLeagues' deps.
  // The classic useEffect-calls-useCallback dance. React devs call this "elegant".
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
