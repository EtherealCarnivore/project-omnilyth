import BlanchingCalculator from '../components/BlanchingCalculator';
import { usePricesContext } from '../contexts/PricesContext';

export default function BlanchingPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <BlanchingCalculator prices={prices} />
    </div>
  );
}
