// PriceDisclaimer.jsx — The "not financial advice" banner of PoE tooling.
// Dismissible and persisted to localStorage because showing it every
// page load would be more annoying than a reflect map with no leech.
import { useState } from 'react';

const DISMISSED_KEY = 'omnilyth_price_disclaimer_dismissed';

export default function PriceDisclaimer() {
  // Lazy initializer to avoid reading localStorage on every render. Small wins.
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISSED_KEY) === '1'; }
    catch { return false; }
  });

  if (dismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/15 px-4 py-3 mb-6">
      <svg className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-xs text-amber-300/70 leading-relaxed flex-1">
        Prices are sourced from poe.ninja and may not reflect actual in-game merchant prices. Always verify costs in-game before committing currency.
      </p>
      <button
        onClick={() => {
          setDismissed(true);
          try { localStorage.setItem(DISMISSED_KEY, '1'); } catch {}
        }}
        className="text-amber-500/40 hover:text-amber-400/70 transition-colors shrink-0 p-0.5"
        title="Dismiss"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
