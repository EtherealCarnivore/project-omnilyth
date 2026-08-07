/*
 * TrichromatismPanel.jsx — The one socket-colour answer 3.29 lets us give exactly.
 *
 * Everything else on the Chromatic page is blocked on an unmeasured constant:
 * GGG published no probability for the new non-white socket roll, so "odds of
 * hitting N of colour X" can't be computed honestly yet.
 *
 * The Omen of Trichromatism sidesteps that entirely. It FORCES one red, one
 * green and one blue when you use a Chromatic Orb, so P = 1.0 — no roll, no
 * unknown. The cost is therefore flat and exact: one omen plus one chromatic.
 * It doesn't scale with socket count and it doesn't care about the item's
 * attribute requirements, because nothing is being gambled on.
 *
 * The only precondition is 3+ sockets (you can't place three colours in two).
 *
 * Deliberately input-free. Adding sliders here would imply the answer varies.
 * It doesn't — that IS the product insight.
 */
import { usePricesContext } from '../contexts/PricesContext';

const CHAOS = ({ children }) => (
  <>
    {children}
    <span className="text-yellow-400/60 text-[0.7em] ml-0.5 align-baseline">c</span>
  </>
);

function fmt(n) {
  return n >= 100 ? Math.round(n).toLocaleString() : n.toFixed(1);
}

export default function TrichromatismPanel() {
  const { prices } = usePricesContext();

  const omen = prices?.['omen-of-trichromatism']?.chaosValue ?? null;
  const chrome = prices?.['chromatic-orb']?.chaosRate ?? null;
  const total = omen != null && chrome != null ? omen + chrome : null;

  return (
    <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-sm font-semibold text-emerald-300">
          At least one Red + Green + Blue
        </h3>
        <span className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-semibold">
          3.29 · exact
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-3">
        <Ingredient label="Omen of Trichromatism" value={omen} />
        <span className="text-zinc-600" aria-hidden="true">+</span>
        <Ingredient label="Chromatic Orb" value={chrome} />
        <span className="text-zinc-600" aria-hidden="true">=</span>
        <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/40 px-3 py-1.5">
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/70">Guaranteed</p>
          <p className="text-lg font-bold text-emerald-300 leading-tight tabular-nums">
            {total != null ? <CHAOS>{fmt(total)}</CHAOS> : '—'}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-300">
        The omen <strong className="text-zinc-100">forces</strong> one of each
        colour, so this is a 100% outcome — not an average. Cost is flat: it
        doesn't rise with socket count and doesn't depend on the item's
        attribute requirements.
      </p>
      <p className="text-xs text-zinc-500 mt-1.5">
        Needs 3+ sockets. Any sockets beyond the first three roll normally — and
        <em> those</em> odds are the part 3.29 hasn't published yet, which is why
        the calculator below is still showing 3.28 math.
      </p>
    </div>
  );
}

function Ingredient({ label, value }) {
  return (
    <div className="rounded-lg bg-zinc-900/50 border border-white/5 px-3 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-200 tabular-nums">
        {value != null ? <CHAOS>{fmt(value)}</CHAOS> : '—'}
      </p>
    </div>
  );
}
