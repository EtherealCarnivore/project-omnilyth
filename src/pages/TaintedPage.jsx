import TaintedCalculator from '../components/TaintedCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import { usePricesContext } from '../contexts/PricesContext';

export default function TaintedPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <PriceDisclaimer />
      <TaintedCalculator prices={prices} />
    </div>
  );
}
