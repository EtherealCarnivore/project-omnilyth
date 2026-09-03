import ScarabCalculator from '../components/ScarabCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';

export default function ScarabPage() {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8">
      <PriceDisclaimer />
      <ScarabCalculator />
    </div>
  );
}
