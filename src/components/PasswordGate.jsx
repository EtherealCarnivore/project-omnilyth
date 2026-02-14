import { useState, useCallback } from 'react';

const HASH = '0b2907533ff82ba5a68005797a232d530c48dd53f1f9a184ab56154874751839';
const SESSION_KEY = 'auth_ok';

async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

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
    }
    setChecking(false);
  }, [input]);

  if (authed) return children;

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
