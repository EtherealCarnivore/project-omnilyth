import VoriciCalculator from '../components/VoriciCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import { usePricesContext } from '../contexts/PricesContext';

export default function ChromaticPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <PriceDisclaimer />
      <VoriciCalculator prices={prices} />
    </div>
  );
}
