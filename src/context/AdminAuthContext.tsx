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
  /** False until portal password is synced to Supabase (when applicable). */
  portalReady: boolean;
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

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [portalReady, setPortalReady] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const s = readStore<{ createdAt: number; portalSecret?: string } | null>(
        ADMIN_SESSION_KEY,
        null
      );
      if (!s) {
        if (!cancelled) {
          setPortalReady(true);
          setLoading(false);
        }
        return;
      }
      setIsAdmin(true);
      const secret = s.portalSecret ?? config.admin.password;
      try {
        await publishAdminPortalSecret(secret);
      } catch (err) {
        console.warn(err);
      }
      if (!cancelled) {
        setPortalReady(true);
        setLoading(false);
      }
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (password: string) => {
    // Simulated latency so brute-force attempts feel painful.
    await new Promise((r) => setTimeout(r, 350));
    const expected = config.admin.password;
    if (!expected) {
      throw new Error(
        'Admin password is not configured. Set VITE_ADMIN_PASSWORD in .env.local.'
      );
    }
    if (password !== expected) {
      throw new Error('Incorrect password.');
    }
    await publishAdminPortalSecret(password);
    writeAdminSession(password);
    setIsAdmin(true);
    setPortalReady(true);
  }, []);

  const signOut = useCallback(() => {
    removeStore(ADMIN_SESSION_KEY);
    setIsAdmin(false);
    setPortalReady(false);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ isAdmin, loading, portalReady, signIn, signOut }),
    [isAdmin, loading, portalReady, signIn, signOut]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
