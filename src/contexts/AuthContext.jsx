/**
 * AuthContext — minimal login state for Omnilyth's hidden menus.
 *
 * Talks to the Cloudflare Worker auth endpoints (workers/auth.js). The session
 * token (a stateless HMAC token) is kept in encrypted localStorage via
 * secureStorage. On mount we validate any stored token against /auth/me.
 *
 * Low-stakes by design (~5 trusted users gating a couple of menus) — no refresh
 * tokens, no auto-renew. When the token expires, /auth/me 401s and we log out.
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authUrl } from '../utils/proxyUrl';
import { secureStorage } from '../utils/secureStorage';
import { AUTH_CONFIG } from '../config/authConfig';

const TOKEN_KEY = 'auth_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { username, isAdmin } | null
  const [mustReset, setMustReset] = useState(false);
  const [loading, setLoading] = useState(true);

  // Bootstrap: load a stored token and validate it.
  useEffect(() => {
    let cancelled = false;
    // Feature flag off → stay logged-out forever; never touch the auth endpoints.
    if (!AUTH_CONFIG.AUTH_ENABLED) {
      setLoading(false);
      return;
    }
    (async () => {
      const stored = await secureStorage.getItem(TOKEN_KEY);
      if (!stored) { if (!cancelled) setLoading(false); return; }
      try {
        const res = await fetch(authUrl('me'), { method: 'POST', headers: { Authorization: `Bearer ${stored}` } });
        if (!res.ok) throw new Error('invalid');
        const d = await res.json();
        if (!cancelled) {
          setToken(stored);
          setUser({ username: d.username, isAdmin: !!d.isAdmin });
          setMustReset(!!d.mustReset);
        }
      } catch {
        secureStorage.removeItem(TOKEN_KEY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await fetch(authUrl('login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error || 'Login failed');
    await secureStorage.setItem(TOKEN_KEY, d.token);
    setToken(d.token);
    setUser({ username, isAdmin: !!d.isAdmin });
    setMustReset(!!d.mustReset);
    return d;
  }, []);

  const changePassword = useCallback(async (newPassword) => {
    if (!token) throw new Error('Not signed in');
    const res = await fetch(authUrl('change-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ newPassword }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error || 'Could not change password');
    await secureStorage.setItem(TOKEN_KEY, d.token);
    setToken(d.token);
    setMustReset(false);
    return d;
  }, [token]);

  const adminSetPassword = useCallback(async (targetUsername, newPassword) => {
    if (!token) throw new Error('Not signed in');
    const res = await fetch(authUrl('admin/set-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username: targetUsername, newPassword }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error || 'Could not set password');
    return d;
  }, [token]);

  const logout = useCallback(() => {
    secureStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setMustReset(false);
  }, []);

  const value = {
    user,
    isAuthed: !!user,
    isAdmin: !!user?.isAdmin,
    mustReset,
    loading,
    login,
    logout,
    changePassword,
    adminSetPassword,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/**
 * Visibility predicate for a registry entry given the current auth state.
 * `requiresAuth` entries are hidden until signed in; `adminOnly` until admin.
 */
export function canSeeModule(mod, { isAuthed, isAdmin }) {
  if (!mod.requiresAuth) return true;
  if (!isAuthed) return false;
  if (mod.adminOnly && !isAdmin) return false;
  return true;
}
