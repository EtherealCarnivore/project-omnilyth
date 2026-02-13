import { useState } from 'react';
import { calculateTainted } from '../calculators/taintedCalc.js';

export default function TaintedCalculator({ prices }) {
  const [inputs, setInputs] = useState({ sockets: '', red: '', green: '', blue: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const taintedPrice = prices?.['tainted-chromatic-orb']?.chaosRate;

  function set(field, value) {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  function calculate() {
    const r = inputs.red === '' ? 0 : parseInt(inputs.red, 10);
    const g = inputs.green === '' ? 0 : parseInt(inputs.green, 10);
    const b = inputs.blue === '' ? 0 : parseInt(inputs.blue, 10);

    let sockets = inputs.sockets === '' ? null : parseInt(inputs.sockets, 10);
    if (sockets === null) {
      const sum = r + g + b;
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
    if (r < 0 || g < 0 || b < 0) {
      setError('Desired colors must be non-negative.');
      setResult(null);
      return;
    }
    if (r + g + b > sockets) {
      setError(`Desired colors (${r + g + b}) exceed total sockets (${sockets}).`);
      setResult(null);
      return;
    }

    setError('');
    setResult(calculateTainted(sockets, r, g, b));
  }

  const socketsVal = inputs.sockets === '' ? null : parseInt(inputs.sockets, 10);
  const socketsInvalid = inputs.sockets !== '' && (isNaN(socketsVal) || socketsVal < 1 || socketsVal > 6);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !socketsInvalid) calculate();
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-purple-300">Tainted Chromatic Calculator</h2>
        <p className="text-sm text-poe-muted">
          Tainted Chromatic Orbs reroll each socket with an equal <strong className="text-poe-text">1/3</strong> chance per color, ignoring stat requirements.
        </p>
        <p className="text-sm font-semibold text-red-400 mt-2">
          Warning: Tainted Chromatic Orbs can only be used on corrupted items!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-md mx-auto">
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-poe-muted text-center">Sockets</label>
          <input type="number" placeholder="#" value={inputs.sockets} onChange={e => set('sockets', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full" />
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
        <p className="text-center text-red-400 text-sm">Total sockets must be between 1 and 6.</p>
      )}

      <div className="flex justify-center">
        <button onClick={calculate} disabled={socketsInvalid} className="calc-button bg-purple-900/60 hover:bg-purple-800/60 border-purple-600/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none">
          Calculate
        </button>
      </div>

      {error && !socketsInvalid && <p className="text-center text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-poe-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-2 text-center">Success Chance</th>
                <th className="px-4 py-2 text-center">Avg. Tainted Chromes<span className="block text-[10px] normal-case tracking-normal opacity-60">(mean)</span></th>
                {taintedPrice && (
                  <th className="px-4 py-2 text-center">Avg. Cost<span className="block text-[10px] normal-case tracking-normal opacity-60">(in chaos)</span></th>
                )}
                <th className="px-4 py-2 text-center">Std. Deviation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-poe-row-even">
                <td className="px-4 py-3 text-center font-mono">{(result.chance * 100).toFixed(4)}%</td>
                <td className="px-4 py-3 text-center font-mono text-poe-highlight">{result.avgAttempts.toFixed(2)}</td>
                {taintedPrice && (
                  <td className="px-4 py-3 text-center font-mono text-poe-gold">{(result.avgAttempts * taintedPrice).toFixed(1)}c</td>
                )}
                <td className="px-4 py-3 text-center font-mono">{result.stdDev.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
