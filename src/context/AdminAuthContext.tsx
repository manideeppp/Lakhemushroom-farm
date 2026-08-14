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
import { readStore, writeStore, removeStore } from '../lib/storage';

interface AdminAuthContextValue {
  isAdmin: boolean;
  loading: boolean;
  signIn: (password: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const ADMIN_SESSION_KEY = 'lakhe.admin.session';
// Session lifetime: 8 hours.
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

interface AdminSession {
  createdAt: number;
}

/* eslint-disable react-refresh/only-export-components */
export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within <AdminAuthProvider>');
  return ctx;
}
/* eslint-enable react-refresh/only-export-components */

function readSession(): AdminSession | null {
  const s = readStore<AdminSession | null>(ADMIN_SESSION_KEY, null);
  if (!s) return null;
  if (Date.now() - s.createdAt > SESSION_TTL_MS) {
    removeStore(ADMIN_SESSION_KEY);
    return null;
  }
  return s;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const s = readSession();
    setIsAdmin(!!s);
    setLoading(false);
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
    const session: AdminSession = { createdAt: Date.now() };
    writeStore(ADMIN_SESSION_KEY, session);
    setIsAdmin(true);
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
