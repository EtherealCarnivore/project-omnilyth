/*
 * Poe2DiscoveryRibbon.jsx — One-time inline ribbon shown to first-time
 * visitors (no `omnilyth_game_v1` localStorage entry yet) telling them
 * the toolkit now covers PoE 2 too.
 *
 * Dismissal is persisted via a separate localStorage key so the ribbon
 * doesn't reappear after the user explicitly waves it away.
 */
import { useState } from 'react';
import { useGame } from '../contexts/GameContext';

const DISMISSED_KEY = 'omnilyth_poe2_ribbon_dismissed_v1';
const GAME_KEY = 'omnilyth_game_v1';

function shouldShow() {
  try {
    if (localStorage.getItem(DISMISSED_KEY)) return false;
    // Show only to people who haven't picked a game yet — i.e. first-time
    // visitors, or visitors from before dual-game shipped (their existing
    // localStorage doesn't contain the game key).
    if (localStorage.getItem(GAME_KEY)) return false;
    return true;
  } catch {
    return false;
  }
}

export default function Poe2DiscoveryRibbon() {
  const { setGame } = useGame();
  const [visible, setVisible] = useState(shouldShow);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      /* storage disabled / quota — keep the in-memory dismiss anyway */
    }
  }

  function jumpToPoe2() {
    setGame('poe2');
    dismiss();
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 text-sm text-cyan-200">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300"
          aria-hidden="true"
        >
          New
        </span>
        <span className="truncate">
          <span className="font-semibold text-cyan-100">Path of Exile 2 tools are coming.</span>
          <span className="text-cyan-300/80 ml-1.5 hidden sm:inline">
            Switch from the top bar any time, or
          </span>
          <button
            onClick={jumpToPoe2}
            className="ml-1.5 text-cyan-200 underline underline-offset-2 hover:text-cyan-100"
          >
            see what's planned
          </button>
          <span className="text-cyan-300/80">.</span>
        </span>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 px-3 py-1 rounded-md text-xs font-medium bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 motion-safe:transition-colors"
      >
        Got it
      </button>
    </div>
  );
}
