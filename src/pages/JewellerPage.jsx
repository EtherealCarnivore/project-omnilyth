import JewellerCalculator from '../components/JewellerCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import PatchStaleNotice from '../components/PatchStaleNotice';
import RetiredCalcShell from '../components/RetiredCalcShell';
import { usePricesContext } from '../contexts/PricesContext';

export default function JewellerPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <PatchStaleNotice severity="dead">
        <p>
          Every leg of this strategy was removed in 3.29. Sockets added by a
          Jeweller's Orb are now{' '}
          <strong className="text-zinc-100">always white</strong>, so
          re-rolling down and back up can't preserve colours — and the
          per-colour crafting bench options used to lock them in{' '}
          <strong className="text-zinc-100">no longer exist</strong>.
        </p>
        <p>
          For socket <em>count</em>, which is the only thing Jeweller's Orbs
          still do, use the{' '}
          <a href="/crafting/socketing" className="text-amber-300">Socket Calculator</a>{' '}
          — its math is unaffected by the rework.
        </p>
      </PatchStaleNotice>
      <PriceDisclaimer />
      <RetiredCalcShell>
        <JewellerCalculator prices={prices} />
      </RetiredCalcShell>
    </div>
  );
}
