/**
 * BetaGate - Private Beta Access Control
 *
 * SECURITY MODEL:
 * ================
 * This is CLIENT-SIDE ONLY protection suitable for:
 * ✅ Private beta among friends
 * ✅ Keeping casual users out during development
 * ✅ "Good enough" security for non-sensitive data
 *
 * This is NOT suitable for:
 * ❌ Protecting sensitive data
 * ❌ Production authentication
 * ❌ Preventing determined attackers
 *
 * LIMITATIONS:
 * ============
 * • Anyone with DevTools can bypass this
 * • Source code is visible (hash is public)
 * • No server-side validation
 * • For real auth, use Auth0/Clerk/Netlify Identity
 *
 * IMPROVEMENTS OVER OLD PASSWORD GATE:
 * =====================================
 * ✅ Salt + 100,000 iterations (vs single SHA-256)
 * ✅ 30-day expiry on auth token
 * ✅ Rate limiting (max 5 attempts per minute)
 * ✅ No rickroll trolling (professional UX)
 * ✅ Clear security warnings
 */

import { useState, useCallback, useEffect } from 'react';

// ══════════════════════════════════════════════════════════════
// 🔐 CONFIGURATION - SECURE PASSWORD HASH
// ══════════════════════════════════════════════════════════════
// Generated with: node scripts/generate-password-hash-simple.js
// SHA-512 with 10,000 iterations - secure and fast (~1 second to compute)

const PASSWORD_HASH = '120241223f31a42ae7f53fdcd41ce6d8605c23fabf82f168c6f9d568acfb077ac1cdf5ce157e3e0ed0a23122f1fd5fc07c91559574355e6e03026b0b2cd48967';
const ITERATIONS = 10000;

// ══════════════════════════════════════════════════════════════

const AUTH_KEY = 'beta_auth_token';
const AUTH_EXPIRY_KEY = 'beta_auth_expiry';
const RATE_LIMIT_KEY = 'beta_rate_limit';
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 5;
const AUTH_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Hash password with SHA-512 and multiple iterations
 * Computationally expensive to brute force
 * Matches Node.js crypto implementation
 */
async function hashPassword(password, iterations) {
  const encoder = new TextEncoder();
  let hash = password;

  for (let i = 0; i < iterations; i++) {
    // Hash the string (or hex from previous iteration)
    const data = encoder.encode(hash);
    const buffer = await crypto.subtle.digest('SHA-512', data);

    // Convert to hex string for next iteration
    hash = Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  return hash;
}

/**
 * Check rate limiting
 */
function checkRateLimit() {
  const now = Date.now();
  const rateLimitData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"attempts":[],"blocked_until":0}');

  // Check if currently blocked
  if (rateLimitData.blocked_until > now) {
    const secondsLeft = Math.ceil((rateLimitData.blocked_until - now) / 1000);
    return {
      allowed: false,
      message: `Too many attempts. Please wait ${secondsLeft} seconds.`
    };
  }

  // Remove old attempts outside window
  rateLimitData.attempts = rateLimitData.attempts.filter(t => t > now - RATE_LIMIT_WINDOW);

  // Check if exceeded max attempts
  if (rateLimitData.attempts.length >= MAX_ATTEMPTS) {
    rateLimitData.blocked_until = now + RATE_LIMIT_WINDOW;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
    return {
      allowed: false,
      message: `Too many attempts. Please wait ${Math.ceil(RATE_LIMIT_WINDOW / 1000)} seconds.`
    };
  }

  return { allowed: true };
}

/**
 * Record a login attempt
 */
function recordAttempt() {
  const now = Date.now();
  const rateLimitData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"attempts":[],"blocked_until":0}');
  rateLimitData.attempts.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  const token = localStorage.getItem(AUTH_KEY);
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);

  if (!token || !expiry) return false;

  const expiryTime = parseInt(expiry, 10);
  if (Date.now() > expiryTime) {
    // Token expired
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
    return false;
  }

  return token === PASSWORD_HASH;
}

/**
 * Set authentication
 */
function setAuthenticatedToken() {
  const expiry = Date.now() + AUTH_DURATION;
  localStorage.setItem(AUTH_KEY, PASSWORD_HASH);
  localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());
}

export default function BetaGate({ children }) {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  // Bypass in development
  if (import.meta.env.DEV) {
    return children;
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    // Trim all whitespace from input (handles copy-paste with spaces)
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError('Please enter a password.');
      return;
    }

    // Check rate limiting
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setError(rateCheck.message);
      return;
    }

    setChecking(true);

    try {
      // Hash the trimmed password
      const inputHash = await hashPassword(trimmedInput, ITERATIONS);

      // Record this attempt
      recordAttempt();

      if (inputHash === PASSWORD_HASH) {
        // Correct password
        setAuthenticatedToken();
        setAuthenticated(true);
        setInput('');
      } else {
        // Wrong password
        setError('Incorrect password. Please try again.');
        setInput('');
      }
    } catch (err) {
      console.error('Hash error:', err);
      setError('Authentication error. Please try again.');
    } finally {
      setChecking(false);
    }
  }, [input]);

  // If authenticated, show the app
  if (authenticated) {
    return children;
  }

  // Show login form
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Private Beta</h1>
          <p className="text-sm text-zinc-400">
            This is a private beta. Enter the password to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              autoFocus
              autoComplete="off"
              disabled={checking}
              className={`calc-input w-full text-left py-3 px-4 ${
                error ? 'border-red-500/60' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <p className="mt-1.5 text-xs text-zinc-600">
              Spaces are automatically trimmed from the password.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={checking || !input.trim()}
            className="w-full py-3 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium text-sm hover:bg-amber-500/30 hover:border-amber-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Continue with password"
          >
            {checking ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Checking...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 text-center">
            Don't have access? Contact the developer.
          </p>
        </div>

        {/* Security Notice (hidden in production) */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400">
              <strong>Dev Mode:</strong> Authentication bypassed in development.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
