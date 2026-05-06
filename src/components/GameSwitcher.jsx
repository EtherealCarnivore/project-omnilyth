/*
 * GameSwitcher.jsx — The persistent dual-game indicator + switcher.
 *
 * Mounted on the far-left of the topbar. Two-tab segmented control.
 * PoE 1 = orange, PoE 2 = cyan. Triple-redundant identity signal:
 * color + dot + text label (so colorblind users still distinguish).
 *
 * Switching game does NOT navigate — staying on the current URL is
 * usually correct (PoE 1-only tools render with the cross-game banner;
 * PoE 2-only tools likewise; shared tools just keep working). The one
 * exception is `/` (the PoE 1 home), which the GameAwareIndex component
 * redirects to `/poe2` when in PoE 2 mode.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export default function GameSwitcher() {
  const { game, setGame } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  function handleSwitch(target) {
    if (target === game) return;
    setGame(target);

    // If we're on the index `/` and switching to PoE 2, navigate to /poe2
    // so the user sees PoE 2 content immediately rather than a stale PoE 1
    // home until they refresh.
    if (target === 'poe2' && location.pathname === '/') {
      navigate('/poe2');
    }
    // Going from /poe2 back to PoE 1: navigate to /. (Otherwise /poe2 still
    // renders Poe2HomePage which tells the user they're in PoE 2 mode —
    // misleading.)
    if (target === 'poe1' && location.pathname === '/poe2') {
      navigate('/');
    }
  }

  return (
    <div
      className="flex shrink-0 items-center p-0.5 rounded-lg bg-zinc-900/60 border border-white/[0.06]"
      role="tablist"
      aria-label="Select game"
    >
      <button
        role="tab"
        aria-selected={game === 'poe1'}
        onClick={() => handleSwitch('poe1')}
        title="Path of Exile 1"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold motion-safe:transition-all ${
          game === 'poe1'
            ? 'bg-orange-500/20 text-orange-300 shadow-inner shadow-orange-500/10'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" />
        <span>PoE 1</span>
      </button>
      <button
        role="tab"
        aria-selected={game === 'poe2'}
        onClick={() => handleSwitch('poe2')}
        title="Path of Exile 2"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold motion-safe:transition-all ${
          game === 'poe2'
            ? 'bg-cyan-500/20 text-cyan-300 shadow-inner shadow-cyan-500/10'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
        <span>PoE 2</span>
      </button>
    </div>
  );
}
