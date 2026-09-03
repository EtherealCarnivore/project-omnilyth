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
          1-in-3 and ignores the item's attribute requirements. 3.29's notes now
          describe Tainted and regular Chromatic Orbs with a{' '}
          <strong className="text-zinc-100">single shared rule</strong> — both
          force one socket non-white and roll the rest normally, i.e. weighted
          by requirements. The flat-third premise looks wrong.
        </p>
      </PatchStaleNotice>
      <PriceDisclaimer />
      <TaintedCalculator prices={prices} />
    </div>
  );
}
