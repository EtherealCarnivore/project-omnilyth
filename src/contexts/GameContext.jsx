/*
 * GameContext.jsx — The dual-game axis. Mounted as the OUTERMOST provider
 * (above LeagueContext) because the league pool, the price API path, and
 * a few other axes downstream all depend on which game the user is in.
 *
 * Storage: a single localStorage key, 'omnilyth_game_v1', value 'poe1' or
 * 'poe2'. Read synchronously in useState init to avoid a "PoE 1 flicker
 * → PoE 2" hydration flash on returning PoE 2 visitors.
 *
 * Nothing derived lives in the context value — accent colors, API path
 * prefixes, and similar helpers are exported as pure functions instead.
 * Putting them in the value object would force every subscriber to
 * re-render whenever any of those changed, even when the underlying
 * `game` flag didn't.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'omnilyth_game_v1';
const VALID_GAMES = ['poe1', 'poe2'];
const DEFAULT_GAME = 'poe1';

function readPersistedGame() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID_GAMES.includes(v) ? v : DEFAULT_GAME;
  } catch {
    return DEFAULT_GAME;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Synchronous initial read. The lazy initializer runs once and avoids
  // the flash of default-game-content before useEffect could hydrate.
  const [game, setGameState] = useState(readPersistedGame);

  const setGame = useCallback((next) => {
    if (!VALID_GAMES.includes(next)) return;
    setGameState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage quota or disabled — keep the in-memory swap regardless */
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        isPoe1: game === 'poe1',
        isPoe2: game === 'poe2',
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

// ─── Pure helpers (kept out of context value to avoid spurious re-renders) ──

/**
 * URL path prefix for poe.ninja proxy calls. PoE 1 → '/poe1', PoE 2 → '/poe2'.
 * Used by usePrices / proxyUrl helpers when building the upstream request.
 */
export function apiPathPrefix(game) {
  return game === 'poe2' ? '/poe2' : '/poe1';
}

/**
 * Tailwind accent color base (without shade suffix) for the active game.
 * PoE 1 → 'orange', PoE 2 → 'cyan'. Consumed by GameSwitcher and any
 * surface that wants to color itself per game.
 */
export function gameAccent(game) {
  return game === 'poe2' ? 'cyan' : 'orange';
}

/**
 * Human-readable game label for tooltips / aria-labels / screen readers.
 */
export function gameLabel(game) {
  return game === 'poe2' ? 'Path of Exile 2' : 'Path of Exile 1';
}

/**
 * Short-form label for compact UI surfaces (the topbar pill).
 */
export function gameShortLabel(game) {
  return game === 'poe2' ? 'PoE 2' : 'PoE 1';
}
