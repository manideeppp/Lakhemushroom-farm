import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LoadingState } from '../components/feedback/States';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState message="Checking your session…" />;
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: location.pathname + location.search }}
      />
    );
  }
  return <>{children}</>;
}

/**
 * Password-gated admin route.
 * Admin auth is completely independent of the user (email-OTP) auth.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) return <LoadingState message="Checking admin session…" />;
  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ redirectTo: location.pathname + location.search }}
      />
    );
  }
  return <>{children}</>;
}
