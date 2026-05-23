import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_CONFIG } from '../../config/authConfig';
import ChangePasswordForm from './ChangePasswordForm';

/**
 * Route guard for `requiresAuth` (and optionally `adminOnly`) registry entries.
 * - still validating a stored token → neutral "checking" state
 * - not signed in → redirect to /login (remembering where they were headed)
 * - signed in but must reset → forced change-password screen
 * - signed in, not admin, on an admin route → access-denied notice
 */
export default function RequireAuth({ adminOnly = false, children }) {
  const { isAuthed, isAdmin, mustReset, loading } = useAuth();
  const location = useLocation();

  // Auth disabled → gated routes don't exist; send home.
  if (!AUTH_CONFIG.AUTH_ENABLED) return <Navigate to="/" replace />;

  if (loading) {
    return <div className="p-8 text-sm text-zinc-500">Checking access…</div>;
  }
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (mustReset) {
    return <ChangePasswordForm forced />;
  }
  if (adminOnly && !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h1 className="text-xl font-bold text-zinc-100">Admin access required</h1>
        <p className="text-sm text-zinc-400 mt-2">This page is restricted to administrator accounts.</p>
      </div>
    );
  }
  return children;
}
