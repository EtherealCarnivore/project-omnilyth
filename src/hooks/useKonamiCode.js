/*
 * useKonamiCode.js — Listens for the classic ↑↑↓↓←→←→BA sequence on
 * document keydown. Fires onMatch when the full sequence is entered in
 * order. Mismatches reset the position; a fresh first-key press counts
 * (so two ArrowUps in a row don't have to be perfectly clean to count).
 *
 * Use case: the holding-page bypass in PreLaunchGate.jsx. Keyboard-only;
 * mobile users use the ?peek= URL param instead.
 */
import { useEffect } from 'react';

const SEQ = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function useKonamiCode(onMatch) {
  useEffect(() => {
    let pos = 0;

    function onKey(e) {
      // Single-letter keys compare lowercase; named keys (ArrowUp etc.)
      // compare verbatim.
      const expected = SEQ[pos];
      const got = expected.length === 1 ? (e.key || '').toLowerCase() : e.key;

      if (got === expected) {
        pos++;
        if (pos === SEQ.length) {
          pos = 0;
          onMatch();
        }
        return;
      }

      // Mismatch: reset, but if the current keypress matches SEQ[0], start
      // a fresh attempt from position 1. Without this the user has to wait
      // for a "clean slate" before retrying — annoying UX.
      pos = got === SEQ[0] ? 1 : 0;
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onMatch]);
}
