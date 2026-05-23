import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_CONFIG } from '../config/authConfig';
import ChangePasswordForm from '../components/auth/ChangePasswordForm';

export default function LoginPage() {
  const { isAuthed, mustReset, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Auth disabled → no login surface at all; never render/submit the form.
  if (!AUTH_CONFIG.AUTH_ENABLED) return <Navigate to="/" replace />;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="p-8 text-sm text-zinc-500">Loading…</div>;
  // Already signed in + nothing pending → leave the login page.
  if (isAuthed && !mustReset) return <Navigate to={from} replace />;
  // Signed in but holding a temp password → force the change, then continue.
  if (isAuthed && mustReset) {
    return <ChangePasswordForm forced onDone={() => navigate(from, { replace: true })} />;
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const d = await login(username.trim(), password);
      if (!d.mustReset) navigate(from, { replace: true });
      // if mustReset, the re-render hits the isAuthed && mustReset branch above
    } catch (e2) {
      setErr(e2.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-bold text-zinc-100">Sign in</h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-zinc-950/60 border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-400/40"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-950/60 border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-cyan-400/40"
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={busy || !username || !password}
            className="w-full px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
