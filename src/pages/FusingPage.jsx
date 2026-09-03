import FusingCalculator from '../components/FusingCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import { usePricesContext } from '../contexts/PricesContext';

export default function FusingPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <PriceDisclaimer />
      <FusingCalculator prices={prices} />
    </div>
  );
}
