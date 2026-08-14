import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { readStore, writeStore, removeStore } from '../lib/storage';
import { getProfile, isAdminEmail, upsertProfile } from '../lib/data';
import type { Profile } from '../types/profile';

interface SessionUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  pendingEmail: string | null;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_SESSION_KEY = 'lakhe.demo.session';
const DEMO_PENDING_KEY = 'lakhe.demo.pending';
const DEMO_OTP = '123456'; // In demo mode any code works, but this is shown to the user.

/* eslint-disable react-refresh/only-export-components */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export { DEMO_OTP };
/* eslint-enable react-refresh/only-export-components */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(
    readStore<string | null>(DEMO_PENDING_KEY, null)
  );

  const loadProfile = useCallback(async (u: SessionUser | null) => {
    if (!u) {
      setProfile(null);
      return;
    }
    let p = await getProfile(u.id);
    if (!p) {
      p = await upsertProfile({
        id: u.id,
        email: u.email,
        is_admin: isAdminEmail(u.email),
      });
    } else if (isAdminEmail(u.email) && !p.is_admin) {
      p = await upsertProfile({ ...p, is_admin: true });
    }
    setProfile(p);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  // -------- Bootstrap session --------
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        const s = data.session;
        const u: SessionUser | null = s?.user
          ? { id: s.user.id, email: s.user.email ?? '' }
          : null;
        if (cancelled) return;
        setUser(u);
        await loadProfile(u);
        setLoading(false);

        supabase.auth.onAuthStateChange(async (_e, session) => {
          const su: SessionUser | null = session?.user
            ? { id: session.user.id, email: session.user.email ?? '' }
            : null;
          setUser(su);
          await loadProfile(su);
        });
      } else {
        // Demo mode: session persisted in localStorage.
        const demoUser = readStore<SessionUser | null>(DEMO_SESSION_KEY, null);
        if (cancelled) return;
        setUser(demoUser);
        await loadProfile(demoUser);
        setLoading(false);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [loadProfile]);

  const requestOtp = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (isSupabaseConfigured) {
      // NOTE: Supabase sends the email using the "Magic Link" template.
      // For the user to actually receive a 6-digit code (not just a link),
      // the template MUST include `{{ .Token }}` — configure it in
      // Supabase Dashboard → Authentication → Email Templates → Magic Link.
      // `emailRedirectTo: undefined` keeps the link-based fallback minimal;
      // the OTP code itself is what we verify below.
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          shouldCreateUser: true,
          emailRedirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/login`
              : undefined,
        },
      });
      if (error) throw error;
    } else {
      // Demo mode: pretend we sent an OTP.
      await new Promise((r) => setTimeout(r, 400));
    }
    setPendingEmail(trimmed);
    writeStore(DEMO_PENDING_KEY, trimmed);
  }, []);

  const verifyOtp = useCallback(
    async (email: string, code: string) => {
      const trimmed = email.trim().toLowerCase();
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.verifyOtp({
          email: trimmed,
          token: code,
          type: 'email',
        });
        if (error) throw error;
        const u = data.user
          ? { id: data.user.id, email: data.user.email ?? '' }
          : null;
        setUser(u);
        await loadProfile(u);
      } else {
        // Demo: accept any 6-digit code.
        if (!/^\d{6}$/.test(code)) throw new Error('Enter the 6-digit OTP');
        const u: SessionUser = { id: `demo-${trimmed}`, email: trimmed };
        writeStore(DEMO_SESSION_KEY, u);
        setUser(u);
        await loadProfile(u);
      }
      setPendingEmail(null);
      removeStore(DEMO_PENDING_KEY);
    },
    [loadProfile]
  );

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    removeStore(DEMO_SESSION_KEY);
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAdmin: !!profile?.is_admin || isAdminEmail(user?.email),
      loading,
      pendingEmail,
      requestOtp,
      verifyOtp,
      signOut,
      refreshProfile,
    }),
    [user, profile, loading, pendingEmail, requestOtp, verifyOtp, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
