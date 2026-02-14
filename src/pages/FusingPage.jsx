import FusingCalculator from '../components/FusingCalculator';
import { usePricesContext } from '../contexts/PricesContext';

export default function FusingPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <FusingCalculator prices={prices} />
    </div>
  );
}
