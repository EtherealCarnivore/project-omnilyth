import BlanchingCalculator from '../components/BlanchingCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import { usePricesContext } from '../contexts/PricesContext';

export default function BlanchingPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <PriceDisclaimer />
      <BlanchingCalculator prices={prices} />
    </div>
  );
}
