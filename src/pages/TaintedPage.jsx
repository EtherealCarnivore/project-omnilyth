import TaintedCalculator from '../components/TaintedCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import PatchStaleNotice from '../components/PatchStaleNotice';
import { usePricesContext } from '../contexts/PricesContext';

export default function TaintedPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <PatchStaleNotice>
        <p>
          This tool assumes a Tainted Chromatic rolls every socket at a flat
          1-in-3 and ignores the item's attribute requirements. Since 3.29,
          Tainted and regular Chromatic Orbs share a{' '}
          <strong className="text-zinc-100">single rule</strong>: both force{' '}
          <em>at least one</em> socket non-white, and higher item quality raises
          the odds of more. White is now a possible result, so the flat-third
          premise is wrong. GGG hasn't published the real odds (3.30 didn't
          either) and nobody has measured them yet.
        </p>
      </PatchStaleNotice>
      <PriceDisclaimer />
      <TaintedCalculator prices={prices} />
    </div>
  );
}
