import { useState, useCallback, useEffect } from 'react';

const HASH = '39d8e865e9453850ff62a5477e612ecbbf22597f02b64b7a1c9e03e609714158';
const SESSION_KEY = 'auth_ok';
const RICKROLL_URL = 'https://youtu.be/dQw4w9WgXcQ?list=RDdQw4w9WgXcQ';

const TROLL_MESSAGES = [
  '5... Initializing security protocols...',
  '4... Contacting the authorities...',
  '3... Triangulating your position...',
  '2... Almost got you...',
  '1... Preparing your reward...',
];

async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function RickRollCountdown() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (tick >= TROLL_MESSAGES.length) {
      window.location.href = RICKROLL_URL;
      return;
    }
    const timer = setTimeout(() => setTick((t) => t + 1), 1000);
    return () => clearTimeout(timer);
  }, [tick]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="text-6xl font-bold text-red-400 tabular-nums animate-pulse">
          {5 - tick > 0 ? 5 - tick : '...'}
        </div>
        <p className="text-sm text-zinc-400 animate-pulse">
          {TROLL_MESSAGES[Math.min(tick, TROLL_MESSAGES.length - 1)]}
        </p>
        <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-1000"
            style={{ width: `${(tick / TROLL_MESSAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [trolling, setTrolling] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const hash = await sha256(input);
    if (hash === HASH) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
    } else {
      setError(true);
      setInput('');
      setTrolling(true);
    }
    setChecking(false);
  }, [input]);

  if (import.meta.env.DEV || authed) return children;
  if (trolling) return <RickRollCountdown />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Access Required</h1>
          <p className="text-sm text-zinc-400 mt-1">Enter password to continue</p>
        </div>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          className={`calc-input w-full text-left py-2.5 px-4 ${error ? 'border-red-500/60' : ''}`}
        />
        {error && <p className="text-xs text-red-400 text-center">Wrong password</p>}
        <button
          type="submit"
          disabled={checking || !input}
          className="w-full py-2.5 rounded-lg bg-zinc-900/40 border border-white/[0.08] text-zinc-100 font-medium text-sm hover:border-white/10 transition-colors disabled:opacity-40"
        >
          {checking ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
