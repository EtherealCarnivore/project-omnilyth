import VoriciCalculator from '../components/VoriciCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import PatchStaleNotice from '../components/PatchStaleNotice';
import TrichromatismPanel from '../components/TrichromatismPanel';
import RetiredCalcShell from '../components/RetiredCalcShell';
import { usePricesContext } from '../contexts/PricesContext';

export default function ChromaticPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <PatchStaleNotice>
        <p>
          Since 3.29, Jeweller's Orbs and bench socket crafts make white
          sockets, and a Chromatic Orb forces{' '}
          <strong className="text-zinc-100">at least one</strong> socket
          non-white (higher item quality raises the odds of more). The Chromatic
          odds in the legacy calculator further down don't model white sockets
          at all. The Vorici bench rows are worse
          than stale — GGG <strong className="text-zinc-100">removed</strong> the
          per-colour bench crafts entirely; they cost nothing because they no
          longer exist.
        </p>
        <p>
          What replaced them: bench crafts that guarantee a{' '}
          <em>count</em> of non-white sockets (2 / 3 / 4 for 5 / 20 / 75
          Chromatics in 3.29; not yet re-checked for 3.30). Colour is now the
          gamble, count is the purchase.
        </p>
        <p>
          New in 3.30 (per the patch notes; not yet confirmed in game): a bench
          craft sets{' '}
          <strong className="text-zinc-100">every socket white</strong> for an
          Orb of Scouring. Any gem fits a white socket; you only give up the
          +10% quality bonus for a matching colour.
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
