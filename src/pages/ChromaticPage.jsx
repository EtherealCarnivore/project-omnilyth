import VoriciCalculator from '../components/VoriciCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import PatchStaleNotice from '../components/PatchStaleNotice';
import TrichromatismPanel from '../components/TrichromatismPanel';
import RetiredCalcShell from '../components/RetiredCalcShell';
import { usePricesContext } from '../contexts/PricesContext';

export default function ChromaticPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <PatchStaleNotice>
        <p>
          Sockets are now white by default and a Chromatic Orb forces only{' '}
          <strong className="text-zinc-100">one</strong> socket non-white, so
          the odds below are far too optimistic. The Vorici bench rows are worse
          than stale — GGG <strong className="text-zinc-100">removed</strong> the
          per-colour bench crafts entirely; they cost nothing because they no
          longer exist.
        </p>
        <p>
          What replaced them: bench crafts that guarantee a{' '}
          <em>count</em> of non-white sockets (2 / 3 / 4 for 5 / 20 / 75
          Chromatics). Colour is now the gamble, count is the purchase.
        </p>
      </PatchStaleNotice>
      {/* The one 3.29 socket-colour answer that needs no unmeasured constant.
          Sits above the legacy calculator so the trustworthy number is what
          you see first. */}
      <TrichromatismPanel />
      <PriceDisclaimer />
      {/* Inert: every Vorici row is a bench craft 3.29 deleted. Kept visible
          so the page shows what's being rebuilt, but nothing is clickable. */}
      <RetiredCalcShell>
        <VoriciCalculator prices={prices} />
      </RetiredCalcShell>
    </div>
  );
}
