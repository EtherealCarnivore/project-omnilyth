import ScarabCalculator from '../components/ScarabCalculator';
import PriceDisclaimer from '../components/PriceDisclaimer';

export default function ScarabPage() {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <PriceDisclaimer />
      <ScarabCalculator />
    </div>
  );
}
