import JewellerCalculator from '../components/JewellerCalculator';
import { usePricesContext } from '../contexts/PricesContext';

export default function JewellerPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <JewellerCalculator prices={prices} />
    </div>
  );
}
