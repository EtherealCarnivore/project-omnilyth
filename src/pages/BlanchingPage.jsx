import BlanchingCalculator from '../components/BlanchingCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import PatchStaleNotice from '../components/PatchStaleNotice';
import RetiredCalcShell from '../components/RetiredCalcShell';
import { usePricesContext } from '../contexts/PricesContext';

export default function BlanchingPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <PatchStaleNotice severity="dead">
        <p>
          The Omen of Blanching no longer exists. 3.29 renamed it to the{' '}
          <strong className="text-zinc-100">Omen of Trichromatism</strong> and
          inverted what it does: instead of forcing white sockets, it now
          guarantees at least one red, one green and one blue when you use a
          Chromatic Orb.
        </p>
        <p>
          Sockets are white by default in 3.29, so paying to make them white is
          no longer a craft. Everything below models the old item.
        </p>
      </PatchStaleNotice>
      <PriceDisclaimer />
      <RetiredCalcShell>
        <BlanchingCalculator prices={prices} />
      </RetiredCalcShell>
    </div>
  );
}
