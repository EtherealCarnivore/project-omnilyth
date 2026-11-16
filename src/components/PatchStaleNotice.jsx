/**
 * PatchStaleNotice.jsx — Loud, unmissable banner for a tool whose math the
 * current patch invalidated.
 *
 * 3.29 (Curse of the Allflame) reworked socket colours: gems fit any socket,
 * matching a colour grants only +10% quality, Jeweller's and bench sockets
 * are white, and the per-colour crafting bench options were REMOVED outright.
 * That rework is still live in 3.30 (Covens of Umbra), which also added a
 * bench craft that sets every socket white for 1 Orb of Scouring. The
 * colouring calculators model a game that no longer exists.
 *
 * We can't ship replacement math yet — GGG published no probabilities for
 * the new non-white roll (3.30 didn't either) and nobody has measured them.
 * So the honest move is to tell the player the number is wrong rather than
 * let them spend real currency on it. Amber (not red) because the tool still
 * works, it's just describing 3.28.
 *
 * Remove this from a page once its math is re-derived against the current
 * socket rules.
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
              ? 'This tool describes a mechanic removed in 3.29.'
              : 'These numbers are 3.28 math — the 3.29 socket rework is still live in 3.30.'}
          </p>
          <div className="text-sm text-zinc-300 space-y-1.5 [&_a]:underline [&_a]:decoration-dotted hover:[&_a]:text-white">
            {children}
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">
            Socket colours were reworked in 3.29 and still work that way in
            3.30. Recalibrating once the new roll odds are
            measured.
          </p>
        </div>
      </div>
    </div>
  );
}
