/*
 * CrossGameBanner.jsx — Sticky amber banner shown when a user is in
 * the wrong game for the current tool.
 *
 * The user's intent (clicking a link, opening a bookmark) wins over
 * the active game state — we render the tool, not a 404. The banner
 * just makes the mismatch visible and offers one-click switch.
 *
 * Amber, not orange/cyan: this is a meta-signal (you're in the wrong
 * game), not a game-coded signal. Amber is the project's "active /
 * attention" accent so it reads as "noteworthy but not error."
 */
import { useGame } from '../contexts/GameContext';
import { useLocation } from 'react-router-dom';
import modules from '../modules/registry';

export default function CrossGameBanner() {
  const { game, setGame } = useGame();
  const location = useLocation();

  // Find the registry entry that matches the current path. If none, the
  // route isn't a registered tool (it's an overview page, the home, etc.)
  // — no banner needed.
  const currentMod = modules.find(m => m.route === location.pathname);
  if (!currentMod) return null;

  const toolGames = currentMod.games || ['poe1'];
  const inActiveGame = toolGames.includes(game);
  if (inActiveGame) return null;

  // The tool is registered but not for this game. Pick a target game
  // it IS in (prefer poe1 if both are options, since that's the older
  // half of the toolkit and most users coming from a stale link want PoE 1).
  const targetGame = toolGames.includes('poe1') ? 'poe1' : 'poe2';
  const targetLabel = targetGame === 'poe2' ? 'PoE 2' : 'PoE 1';
  const currentLabel = game === 'poe2' ? 'PoE 2' : 'PoE 1';

  return (
    <div
      role="status"
      className="sticky top-0 z-30 -mt-4 sm:-mt-8 -mx-4 sm:-mx-6 mb-4 px-4 sm:px-6 py-2.5 bg-amber-500/10 backdrop-blur-sm border-b border-amber-500/20 text-sm"
    >
      <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 min-w-0 text-amber-200">
          <svg
            className="shrink-0 w-4 h-4 text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
            />
          </svg>
          <span className="truncate">
            <span className="font-semibold text-amber-100">
              This tool is {targetLabel}-only.
            </span>
            <span className="text-amber-200/80 ml-1.5 hidden sm:inline">
              You're currently in {currentLabel} mode.
            </span>
          </span>
        </div>
        <button
          onClick={() => setGame(targetGame)}
          className="shrink-0 px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 motion-safe:transition-colors"
        >
          Switch to {targetLabel}
        </button>
      </div>
    </div>
  );
}
