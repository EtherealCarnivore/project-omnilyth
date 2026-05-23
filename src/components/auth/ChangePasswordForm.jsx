import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ChangePasswordForm({ forced = false, onDone }) {
  const { changePassword } = useAuth();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (pw.length < 12) return setErr('Password must be at least 12 characters.');
    if (pw !== pw2) return setErr('Passwords do not match.');
    setBusy(true);
    try {
      await changePassword(pw);
      onDone?.();
    } catch (e2) {
      setErr(e2.message || 'Could not change password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-zinc-100">Set a new password</h1>
          {forced && (
            <p className="text-sm text-amber-400/80">
              You signed in with a temporary password — choose a new one to continue.
            </p>
          )}
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="New password"
            className="w-full bg-zinc-950/60 border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-400/40"
          />
          <input
            type="password"
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="Confirm new password"
            className="w-full bg-zinc-950/60 border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-400/40"
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Set password'}
          </button>
        </form>
      </div>
    </div>
  );
}
