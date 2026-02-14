import { useState } from 'react';
import { calculateBlanching } from '../calculators/blanchingCalc.js';

export default function BlanchingCalculator({ prices }) {
  const [inputs, setInputs] = useState({ sockets: '', str: '', dex: '', int: '', red: '', green: '', blue: '', white: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const chromePrice = prices?.['chromatic-orb']?.chaosRate;
  const omenPrice = prices?.['omen-of-blanching']?.chaosValue;
  // Each attempt costs 1 Chromatic + 1 Omen
  const attemptCostChaos = (chromePrice || 0) + (omenPrice || 0);
  const hasPrices = chromePrice && omenPrice;

  function set(field, value) {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  function calculate() {
    const str = inputs.str === '' ? 0 : parseInt(inputs.str, 10);
    const dex = inputs.dex === '' ? 0 : parseInt(inputs.dex, 10);
    const int = inputs.int === '' ? 0 : parseInt(inputs.int, 10);
    const r = inputs.red === '' ? 0 : parseInt(inputs.red, 10);
    const g = inputs.green === '' ? 0 : parseInt(inputs.green, 10);
    const b = inputs.blue === '' ? 0 : parseInt(inputs.blue, 10);
    const w = inputs.white === '' ? 0 : parseInt(inputs.white, 10);

    let sockets = inputs.sockets === '' ? null : parseInt(inputs.sockets, 10);
    if (sockets === null) {
      const sum = r + g + b + w;
      if (sum > 0 && sum <= 6) {
        sockets = sum;
        set('sockets', String(sum));
      }
    }

    if (!sockets || sockets < 1 || sockets > 6) {
      setError('Total sockets must be between 1 and 6.');
      setResult(null);
      return;
    }
    if (r < 0 || g < 0 || b < 0 || w < 0) {
      setError('Desired colors must be non-negative.');
      setResult(null);
      return;
    }
    if (w < 1) {
      setError('White sockets (W) must be at least 1 for Omen of Blanching.');
      setResult(null);
      return;
    }
    if (r + g + b + w > sockets) {
      setError(`Desired colors (${r + g + b + w}) exceed total sockets (${sockets}).`);
      setResult(null);
      return;
    }

    setError('');
    setResult(calculateBlanching(sockets, str, dex, int, r, g, b, w));
  }

  const socketsVal = inputs.sockets === '' ? null : parseInt(inputs.sockets, 10);
  const socketsInvalid = inputs.sockets !== '' && (isNaN(socketsVal) || socketsVal < 1 || socketsVal > 6);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !socketsInvalid) calculate();
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center justify-center gap-3">
          <img src={`${import.meta.env.BASE_URL}Omen_of_Blanching.png`} alt="" className="w-8 h-8" />
          Omen of Blanching Calculator
        </h2>
        <p className="text-sm text-zinc-400">
          Uses a normal Chromatic Orb (stat requirements affect colors), then turns <strong className="text-zinc-100">1&ndash;3</strong> random sockets white (<strong className="text-zinc-100">50% / 25% / 25%</strong>).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
        <div className="sm:col-span-4 max-w-[120px] mx-auto space-y-1">
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
        <div />

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
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-center text-gray-300">White</label>
          <input type="number" placeholder="W" value={inputs.white} onChange={e => set('white', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full bg-poe-white-socket border-gray-500 focus:ring-gray-400/40" />
        </div>
      </div>

      {socketsInvalid && (
        <p className="text-center text-red-400 text-sm">Total sockets must be between 1 and 6.</p>
      )}

      <div className="flex justify-center">
        <button onClick={calculate} disabled={socketsInvalid} className="calc-button bg-zinc-800/60 hover:bg-zinc-800/60 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none">
          Calculate
        </button>
      </div>

      {error && !socketsInvalid && <p className="text-center text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="overflow-x-auto">
          {result.chance === 0 ? (
            <p className="text-center text-red-400">Impossible with these parameters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-2 text-center">Success Chance</th>
                  <th className="px-4 py-2 text-center">Avg. Attempts<span className="block text-[10px] normal-case tracking-normal opacity-60">(mean)</span></th>
                  {hasPrices && (
                    <th className="px-4 py-2 text-center">Avg. Cost<span className="block text-[10px] normal-case tracking-normal opacity-60">(in chaos)</span></th>
                  )}
                  <th className="px-4 py-2 text-center">Std. Deviation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-poe-row-even">
                  <td className="px-4 py-3 text-center font-mono">{(result.chance * 100).toFixed(4)}%</td>
                  <td className="px-4 py-3 text-center font-mono text-poe-highlight">{result.avgAttempts.toFixed(2)}</td>
                  {hasPrices && (
                    <td className="px-4 py-3 text-center font-mono text-poe-gold">{(result.avgAttempts * attemptCostChaos).toFixed(1)}c</td>
                  )}
                  <td className="px-4 py-3 text-center font-mono">{result.stdDev.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {hasPrices && result && result.chance > 0 && (
        <p className="text-xs text-zinc-400 text-center">
          Cost per attempt: {chromePrice.toFixed(2)}c (Chromatic) + {omenPrice.toFixed(1)}c (Omen) = <strong className="text-zinc-100">{attemptCostChaos.toFixed(1)}c</strong>
        </p>
      )}
    </div>
  );
}
