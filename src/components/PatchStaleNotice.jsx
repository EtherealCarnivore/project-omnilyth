/**
 * PatchStaleNotice.jsx — Loud, unmissable banner for a tool whose math the
 * current patch invalidated.
 *
 * 3.29 (Curse of the Allflame) reworked socket colours: gems fit any socket,
 * matching a colour grants only +10 quality, sockets are white by default,
 * and the per-colour crafting bench options were REMOVED outright. The
 * colouring calculators model a game that no longer exists.
 *
 * We can't ship replacement math yet — GGG published no probabilities for
 * the new non-white roll and nobody has measured them. So the honest move is
 * to tell the player the number is wrong rather than let them spend real
 * currency on it. Amber (not red) because the tool still works, it's just
 * describing 3.28.
 *
 * Remove this from a page once its math is re-derived against 3.29.
 */

export default function PatchStaleNotice({ severity = 'wrong', children }) {
  const isDead = severity === 'dead';

  return (
    <div
      role="note"
      className={`mb-6 rounded-lg border p-4 ${
        isDead
          ? 'border-red-500/40 bg-red-950/30'
          : 'border-amber-500/40 bg-amber-950/30'
      }`}
    >
      <div className="flex gap-3">
        <span
          className={`shrink-0 text-lg leading-none ${isDead ? 'text-red-400' : 'text-amber-400'}`}
          aria-hidden="true"
        >
          ⚠
        </span>
        <div className="space-y-1.5">
          <p className={`font-semibold text-sm ${isDead ? 'text-red-300' : 'text-amber-300'}`}>
            {isDead
              ? 'This tool describes a mechanic 3.29 removed.'
              : 'These numbers are 3.28 math — 3.29 changed the rules.'}
          </p>
          <div className="text-sm text-zinc-300 space-y-1.5 [&_a]:underline [&_a]:decoration-dotted hover:[&_a]:text-white">
            {children}
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">
            Curse of the Allflame (3.29) reworked socket colours. Recalibrating
            once the new drop rates are measured.
          </p>
        </div>
      </div>
    </div>
  );
}
