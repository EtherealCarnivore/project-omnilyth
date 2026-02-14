import { useState } from 'react';
import { calculateJeweller } from '../calculators/jewellerCalc.js';

export default function JewellerCalculator({ prices }) {
  const [inputs, setInputs] = useState({ sockets: '', str: '', dex: '', int: '', red: '', green: '', blue: '' });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const chromePrice = prices?.['chromatic-orb']?.chaosRate;
  const jewellerPrice = prices?.['jewellers-orb']?.chaosRate;
  const hasPrices = chromePrice && jewellerPrice;

  function set(field, value) {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  function calculate() {
    const str = inputs.str === '' ? 0 : parseInt(inputs.str, 10);
    const dex = inputs.dex === '' ? 0 : parseInt(inputs.dex, 10);
    const int = inputs.int === '' ? 0 : parseInt(inputs.int, 10);
    const dr = inputs.red === '' ? 0 : parseInt(inputs.red, 10);
    const dg = inputs.green === '' ? 0 : parseInt(inputs.green, 10);
    const db = inputs.blue === '' ? 0 : parseInt(inputs.blue, 10);

    let sockets = inputs.sockets === '' ? null : parseInt(inputs.sockets, 10);
    if (sockets === null) {
      const sum = dr + dg + db;
      if (sum >= 2 && sum <= 6) {
        sockets = sum;
        set('sockets', String(sum));
      }
    }

    if (!sockets || sockets < 2 || sockets > 6) {
      setError('Total sockets must be between 2 and 6.');
      setResults(null);
      return;
    }
    if (dr < 0 || dg < 0 || db < 0) {
      setError('Desired colors must be non-negative.');
      setResults(null);
      return;
    }
    if (dr + dg + db > sockets) {
      setError(`Desired colors (${dr + dg + db}) exceed total sockets (${sockets}).`);
      setResults(null);
      return;
    }

    setError('');
    setResults(calculateJeweller(sockets, str, dex, int, dr, dg, db));
  }

  const socketsVal = inputs.sockets === '' ? null : parseInt(inputs.sockets, 10);
  const socketsInvalid = inputs.sockets !== '' && (isNaN(socketsVal) || socketsVal < 2 || socketsVal > 6);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !socketsInvalid) calculate();
  }

  function formatTotalChaos(s) {
    if (!hasPrices) return null;
    const chaos = s.chromeCost * chromePrice + s.jewellerCost * jewellerPrice;
    if (chaos >= 1000) return Math.round(chaos).toLocaleString() + 'c';
    return chaos.toFixed(1) + 'c';
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-amber-300">Jeweller's Method Calculator</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Uses the Crafting Bench to add/remove sockets one at a time, locking in desired colors cheaply. Compares every base-chrome size to find the optimal strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="sm:col-span-3 max-w-[120px] mx-auto space-y-1">
          <label className="block text-xs uppercase tracking-wider text-zinc-400 text-center">Sockets</label>
          <input type="number" placeholder="#" value={inputs.sockets} onChange={e => set('sockets', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full" />
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-center text-red-400">STR</label>
          <input type="number" placeholder="str" value={inputs.str} onChange={e => set('str', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full bg-poe-red border-poe-red-border focus:ring-red-500/40" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-center text-green-400">DEX</label>
          <input type="number" placeholder="dex" value={inputs.dex} onChange={e => set('dex', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full bg-poe-green border-poe-green-border focus:ring-green-500/40" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-center text-blue-400">INT</label>
          <input type="number" placeholder="int" value={inputs.int} onChange={e => set('int', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full bg-poe-blue border-poe-blue-border focus:ring-blue-500/40" />
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-center text-red-400">Red</label>
          <input type="number" placeholder="R" value={inputs.red} onChange={e => set('red', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full bg-poe-red border-poe-red-border focus:ring-red-500/40" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-center text-green-400">Green</label>
          <input type="number" placeholder="G" value={inputs.green} onChange={e => set('green', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full bg-poe-green border-poe-green-border focus:ring-green-500/40" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-center text-blue-400">Blue</label>
          <input type="number" placeholder="B" value={inputs.blue} onChange={e => set('blue', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full bg-poe-blue border-poe-blue-border focus:ring-blue-500/40" />
        </div>
      </div>

      {socketsInvalid && (
        <p className="text-center text-red-400 text-sm">Total sockets must be between 2 and 6.</p>
      )}

      <div className="flex justify-center">
        <button onClick={calculate} disabled={socketsInvalid} className="calc-button bg-yellow-900/50 hover:bg-yellow-800/50 border-amber-600/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none">
          Calculate
        </button>
      </div>

      {error && !socketsInvalid && <p className="text-center text-red-400 text-sm">{error}</p>}

      {results && results.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-2 text-left text-zinc-400 font-medium">Strategy</th>
                <th className="px-4 py-2 text-right text-zinc-400 font-medium">Avg. Chromatics</th>
                <th className="px-4 py-2 text-right text-zinc-400 font-medium">Avg. Jewellers</th>
                {hasPrices && (
                  <th className="px-4 py-2 text-right text-zinc-400 font-medium">Total Cost<span className="block text-[10px] normal-case tracking-normal opacity-60">(in chaos)</span></th>
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((s, i) => (
                <tr key={i} className={
                  s.isBest
                    ? 'bg-green-900/30 text-green-300'
                    : i % 2 === 0 ? 'bg-poe-row-even' : 'bg-poe-row-odd'
                }>
                  <td className="px-4 py-2 text-left font-medium">
                    {s.label}
                    {s.isBest && <span className="ml-2 text-xs text-green-400">(Best)</span>}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-poe-highlight">
                    {s.chromeCost < 1000000 ? s.chromeCost.toFixed(2) : s.chromeCost.toExponential(2)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{s.jewellerCost.toFixed(2)}</td>
                  {hasPrices && (
                    <td className="px-4 py-2 text-right font-mono text-amber-300">{formatTotalChaos(s)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results && results.length === 0 && (
        <p className="text-center text-red-400">No valid strategy found.</p>
      )}
    </div>
  );
}
