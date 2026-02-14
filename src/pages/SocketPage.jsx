import SocketCalculator from '../components/SocketCalculator';
import { usePricesContext } from '../contexts/PricesContext';

export default function SocketPage() {
  const { prices } = usePricesContext();
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <SocketCalculator prices={prices} />
    </div>
  );
}
