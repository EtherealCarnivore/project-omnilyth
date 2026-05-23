import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminUsersPage — set/reset a user's password. Gated to admin accounts via the
 * registry entry (requiresAuth + adminOnly) AND the RequireAuth route guard.
 * The Worker also re-checks the admin claim on the token, so this is UI only.
 *
 * Setting a password flips the target's must_reset flag, so they're forced to
 * pick a new one on their next sign-in.
 */
export default function AdminUsersPage() {
  const { user, adminSetPassword, logout } = useAuth();
  const [target, setTarget] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (pw.length < 12) return setErr('Password must be at least 12 characters.');
    setBusy(true);
    try {
      await adminSetPassword(target.trim(), pw);
      setMsg(`Password set for "${target.trim()}". They'll be asked to choose a new one on next sign-in.`);
      setTarget('');
      setPw('');
    } catch (e2) {
      setErr(e2.message || 'Could not set password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">User Management</h1>
        <span className="text-xs text-zinc-500">
          {user?.username} · <button onClick={logout} className="text-cyan-400/80 hover:text-cyan-300">log out</button>
        </span>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-6 space-y-4">
        <p className="text-sm text-zinc-400">
          Set or reset a password for an existing account. The user is forced to choose a new
          password the next time they sign in.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Username"
            className="w-full bg-zinc-950/60 border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-400/40"
          />
          <input
            type="text"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Temporary password (min 12 chars)"
            className="w-full bg-zinc-950/60 border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-400/40"
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          {msg && <p className="text-sm text-green-400">{msg}</p>}
          <button
            type="submit"
            disabled={busy || !target || !pw}
            className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {busy ? 'Setting…' : 'Set password'}
          </button>
        </form>
        <p className="text-[11px] text-zinc-600">
          New accounts are created by inserting a row in the D1 store (see workers/schema.sql) —
          this panel only resets passwords for accounts that already exist.
        </p>
      </div>
    </div>
  );
}
