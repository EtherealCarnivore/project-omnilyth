import { useState } from 'react';
import { calculateVorici } from '../calculators/voriciCalc.js';
import { calculateJeweller } from '../calculators/jewellerCalc.js';

export default function VoriciCalculator({ prices }) {
  const [inputs, setInputs] = useState({ sockets: '', str: '', dex: '', int: '', red: '', green: '', blue: '' });
  const [results, setResults] = useState(null);
  const [jewellerComparison, setJewellerComparison] = useState(null);
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
      sockets = dr + dg + db;
      if (sockets > 0 && sockets <= 6) set('sockets', String(sockets));
    }

    if (!sockets || sockets <= 0 || sockets > 6) {
      setError('Total sockets must be between 1 and 6.');
      setResults(null);
      setJewellerComparison(null);
      return;
    }
    if (str < 0 || dex < 0 || int < 0) {
      setError('Invalid stat requirements.');
      setResults(null);
      setJewellerComparison(null);
      return;
    }
    if (str === 0 && dex === 0 && int === 0) {
      setError('Please fill in stat requirements.');
      setResults(null);
      setJewellerComparison(null);
      return;
    }
    if (dr < 0 || dg < 0 || db < 0 || dr + dg + db === 0 || dr + dg + db > sockets) {
      setError('Invalid desired socket colors.');
      setResults(null);
      setJewellerComparison(null);
      return;
    }

    setError('');
    const voriciResults = calculateVorici(sockets, str, dex, int, dr, dg, db);
    setResults(voriciResults);

    // Run Jeweller's Method comparison if we have prices and >= 2 sockets
    if (hasPrices && sockets >= 2) {
      const jewellerResults = calculateJeweller(sockets, str, dex, int, dr, dg, db);
      const bestJeweller = jewellerResults.find(s => s.isBest);
      const bestVorici = voriciResults.find(r => r.isBest);

      if (bestJeweller && bestVorici && bestVorici.rawAvgCost !== Infinity) {
        const voriciChaos = bestVorici.rawAvgCost * chromePrice;
        const jewellerChaos = bestJeweller.chromeCost * chromePrice + bestJeweller.jewellerCost * jewellerPrice;

        if (jewellerChaos < voriciChaos) {
          const saved = voriciChaos - jewellerChaos;
          const pctSaved = ((saved / voriciChaos) * 100).toFixed(0);
          setJewellerComparison({
            jewellerChaos,
            voriciChaos,
            saved,
            pctSaved,
            strategy: bestJeweller.label,
            bestVoriciName: bestVorici.description,
          });
        } else {
          setJewellerComparison(null);
        }
      } else {
        setJewellerComparison(null);
      }
    } else {
      setJewellerComparison(null);
    }
  }

  const socketsVal = inputs.sockets === '' ? null : parseInt(inputs.sockets, 10);
  const socketsInvalid = inputs.sockets !== '' && (isNaN(socketsVal) || socketsVal < 1 || socketsVal > 6);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !socketsInvalid) calculate();
  }

  function formatChaos(rawAvgCost) {
    if (!chromePrice || rawAvgCost === Infinity) return '-';
    const chaos = rawAvgCost * chromePrice;
    if (chaos >= 1000) return Math.round(chaos).toLocaleString() + 'c';
    return chaos.toFixed(1) + 'c';
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center justify-center gap-3">
          <img src={`${import.meta.env.BASE_URL}Chromatic_Orb.png`} alt="" className="w-8 h-8" />
          Vorici Chromatic Calculator
        </h2>
        <p className="text-sm text-zinc-400">Compares Vorici bench crafts vs raw Chromatic Orbs to find the cheapest method.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-zinc-400 text-center">Total Sockets</label>
          <input type="number" placeholder="#" value={inputs.sockets} onChange={e => set('sockets', e.target.value)} onKeyDown={handleKeyDown}
            className="calc-input w-full" />
        </div>
        <div />
        <div />

        <InputField label="STR" placeholder="str" value={inputs.str} onChange={v => set('str', v)} onKeyDown={handleKeyDown} variant="red" />
        <InputField label="DEX" placeholder="dex" value={inputs.dex} onChange={v => set('dex', v)} onKeyDown={handleKeyDown} variant="green" />
        <InputField label="INT" placeholder="int" value={inputs.int} onChange={v => set('int', v)} onKeyDown={handleKeyDown} variant="blue" />

        <InputField label="Red" placeholder="R" value={inputs.red} onChange={v => set('red', v)} onKeyDown={handleKeyDown} variant="red" />
        <InputField label="Green" placeholder="G" value={inputs.green} onChange={v => set('green', v)} onKeyDown={handleKeyDown} variant="green" />
        <InputField label="Blue" placeholder="B" value={inputs.blue} onChange={v => set('blue', v)} onKeyDown={handleKeyDown} variant="blue" />
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

      {/* Jeweller's Method comparison banner */}
      {jewellerComparison && (
        <div className="rounded-lg border border-poe-gold/40 bg-poe-jeweller-best-even/60 px-4 py-3 text-sm">
          <p className="text-poe-gold font-semibold mb-1">Jeweller's Method is cheaper!</p>
          <p className="text-poe-jeweller-best-text">
            Best chromatic option (<strong>{jewellerComparison.bestVoriciName}</strong>) costs ~<strong>{jewellerComparison.voriciChaos.toFixed(1)}c</strong>, but <strong>{jewellerComparison.strategy}</strong> only costs ~<strong>{jewellerComparison.jewellerChaos.toFixed(1)}c</strong> &mdash; saving you <strong>{jewellerComparison.saved.toFixed(1)}c</strong> ({jewellerComparison.pctSaved}% cheaper).
          </p>
          <p className="text-zinc-400 text-xs mt-1">Check the Jeweller's tab for full strategy breakdown.</p>
        </div>
      )}

      {results && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-3 py-2 text-left">Craft Type</th>
                <th className="px-3 py-2 text-right">Avg Cost<span className="block text-[10px] normal-case tracking-normal opacity-60">(in chromatics)</span></th>
                {chromePrice && (
                  <th className="px-3 py-2 text-right">Avg Cost<span className="block text-[10px] normal-case tracking-normal opacity-60">(in chaos)</span></th>
                )}
                <th className="px-3 py-2 text-right">Success Chance</th>
                <th className="px-3 py-2 text-right">Avg Attempts<span className="block text-[10px] normal-case tracking-normal opacity-60">(mean)</span></th>
                <th className="px-3 py-2 text-right">Cost/Try<span className="block text-[10px] normal-case tracking-normal opacity-60">(in chromatics)</span></th>
                <th className="px-3 py-2 text-right">Std Dev<span className="block text-[10px] normal-case tracking-normal opacity-60">(of attempts)</span></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className={
                  r.isBest
                    ? 'bg-poe-best-even text-poe-best-text border-l-2 border-r-2 border-green-700'
                    : i % 2 === 0 ? 'bg-poe-row-even' : 'bg-poe-row-odd'
                }>
                  <td className="px-3 py-2 text-left font-medium">{r.description}</td>
                  <td className="px-3 py-2 text-right font-mono text-poe-highlight">{r.avgCost}</td>
                  {chromePrice && (
                    <td className="px-3 py-2 text-right font-mono text-poe-gold">{formatChaos(r.rawAvgCost)}</td>
                  )}
                  <td className="px-3 py-2 text-right font-mono">{r.chance}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.avgAttempts}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.costPerTry}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.stdDev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-xs text-zinc-400 text-center space-y-1 pt-2 border-t border-white/5">
        <p className="font-semibold text-zinc-100/80">Chromatic orbs cannot reroll the same color permutation twice, so the chromatic success chance is always higher than the drop rate.</p>
        <p>Mono-req on-color: 0.9 &times; (R + 10) / (R + 20) &bull; off-color: 0.05 + 4.5 / (R + 20)</p>
        <p>Dual-req on-color: 0.9 &times; R1 / (R1 + R2) &bull; off-color: 10% flat</p>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, onKeyDown, variant }) {
  const variantClasses = {
    red: 'bg-poe-red border-poe-red-border focus:ring-red-500/40',
    green: 'bg-poe-green border-poe-green-border focus:ring-green-500/40',
    blue: 'bg-poe-blue border-poe-blue-border focus:ring-blue-500/40',
  };
  const labelColors = {
    red: 'text-red-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="space-y-1">
      <label className={`block text-xs uppercase tracking-wider text-center ${labelColors[variant] || 'text-zinc-400'}`}>{label}</label>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={`calc-input w-full ${variantClasses[variant] || ''}`}
      />
    </div>
  );
}
