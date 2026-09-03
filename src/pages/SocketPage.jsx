import SocketCalculator from '../components/SocketCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';
import { usePricesContext } from '../contexts/PricesContext';

export default function SocketPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <PriceDisclaimer />
      <SocketCalculator prices={prices} />
    </div>
  );
}
