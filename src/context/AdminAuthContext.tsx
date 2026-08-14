import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { config } from '../lib/config';
import { readStore, removeStore } from '../lib/storage';
import {
  ADMIN_SESSION_KEY,
  publishAdminPortalSecret,
  writeAdminSession,
} from '../lib/adminPortal';

interface AdminAuthContextValue {
  isAdmin: boolean;
  loading: boolean;
  signIn: (password: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

/* eslint-disable react-refresh/only-export-components */
export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within <AdminAuthProvider>');
  return ctx;
}
/* eslint-enable react-refresh/only-export-components */

function hasValidSession(): boolean {
  const s = readStore<{ createdAt: number } | null>(ADMIN_SESSION_KEY, null);
  if (!s) return false;
  const ttl = 8 * 60 * 60 * 1000;
  if (Date.now() - s.createdAt > ttl) {
    removeStore(ADMIN_SESSION_KEY);
    return false;
  }
  return true;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const active = hasValidSession();
    setIsAdmin(active);
    if (active) {
      const s = readStore<{ portalSecret?: string } | null>(ADMIN_SESSION_KEY, null);
      const secret = s?.portalSecret ?? config.admin.password;
      void publishAdminPortalSecret(secret);
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (password: string) => {
    await new Promise((r) => setTimeout(r, 200));
    const expected = config.admin.password;
    if (!expected) {
      throw new Error(
        'Admin password is not configured. Set VITE_ADMIN_PASSWORD in .env.local.'
      );
    }
    if (password !== expected) {
      throw new Error('Incorrect password.');
    }
    writeAdminSession(password);
    setIsAdmin(true);
    void publishAdminPortalSecret(password);
  }, []);

  const signOut = useCallback(() => {
    removeStore(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ isAdmin, loading, signIn, signOut }),
    [isAdmin, loading, signIn, signOut]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
