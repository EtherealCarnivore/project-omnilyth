/*
 * FirstVisitGamePicker.jsx — first-run "PoE 1 or PoE 2?" chooser.
 *
 * Shown once, to a visitor with no stored game preference. Picking a card
 * (or dismissing via Escape / click-outside, which resolves to the PoE 1
 * default) persists the choice through GameContext, so it never re-asks.
 *
 * Deep-link shortcut: arriving directly on a /poe2 route IS choosing PoE 2,
 * so we resolve silently and skip the modal entirely.
 *
 * Identity language mirrors GameSwitcher (orange = PoE 1, cyan = PoE 2;
 * color + dot + label, quadruple-redundant with the accent top-border).
 * Shell mirrors the project modal convention (ExitLevelingModal).
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export default function FirstVisitGamePicker() {
  const { hasChosen, setGame } = useGame();
  const { pathname } = useLocation();
  const poe1Ref = useRef(null);
  const poe2Ref = useRef(null);

  const onPoe2Path = pathname === '/poe2' || pathname.startsWith('/poe2/');

  // Deep-link auto-resolve: a visitor who lands on a PoE 2 route has, in
  // effect, already chosen PoE 2. Resolve silently — no modal flash.
  useEffect(() => {
    if (!hasChosen && onPoe2Path) setGame('poe2');
  }, [hasChosen, onPoe2Path, setGame]);

  const open = !hasChosen && !onPoe2Path;

  // Focus the first card on mount; Escape accepts the PoE 1 default; Tab is
  // trapped between the two cards (the only focusable elements in the dialog).
  useEffect(() => {
    if (!open) return;
    poe1Ref.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setGame('poe1');
        return;
      }
      if (e.key !== 'Tab') return;
      const active = document.activeElement;
      if (e.shiftKey && active === poe1Ref.current) {
        e.preventDefault();
        poe2Ref.current?.focus();
      } else if (!e.shiftKey && active === poe2Ref.current) {
        e.preventDefault();
        poe1Ref.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setGame]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={() => setGame('poe1')}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-picker-title"
        className="bg-zinc-900 border border-white/10 rounded-lg shadow-2xl max-w-md w-full overflow-hidden motion-safe:animate-[fadeIn_120ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5">
          <h3 id="game-picker-title" className="text-base font-semibold text-zinc-100">
            Which game are you here for?
          </h3>
        </div>

        {/* Body — cards side-by-side ≥640px, stacked below */}
        <div className="px-5 py-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* PoE 1 — orange */}
            <button
              ref={poe1Ref}
              onClick={() => setGame('poe1')}
              className="group flex-1 min-w-0 text-left bg-zinc-900/60 backdrop-blur-sm
                         border border-white/[0.06] border-t-2 border-t-orange-500/50 rounded-lg p-4
                         hover:bg-orange-500/[0.07] hover:border-orange-500/40
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60
                         focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                         transition-colors duration-150"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-orange-300">Path of Exile 1</span>
                <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-zinc-500 shrink-0">
                  Default
                </span>
              </div>
              <p className="text-xs text-zinc-400">The full toolkit</p>
            </button>

            {/* PoE 2 — cyan */}
            <button
              ref={poe2Ref}
              onClick={() => setGame('poe2')}
              className="group flex-1 min-w-0 text-left bg-zinc-900/60 backdrop-blur-sm
                         border border-white/[0.06] border-t-2 border-t-cyan-500/50 rounded-lg p-4
                         hover:bg-cyan-500/[0.07] hover:border-cyan-500/40
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
                         focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                         transition-colors duration-150"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-cyan-300">Path of Exile 2</span>
              </div>
              <p className="text-xs text-zinc-400">Early-access tools, growing</p>
            </button>
          </div>
        </div>

        {/* Footer — reassurance only; the cards are the action */}
        <div className="px-5 py-3 bg-zinc-950/50 border-t border-white/5">
          <p className="text-xs text-zinc-500 text-center">
            You can switch anytime from the top bar.
          </p>
        </div>
      </div>
    </div>
  );
}
