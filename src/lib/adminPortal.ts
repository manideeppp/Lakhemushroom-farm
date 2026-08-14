import { config } from './config';
import { isSupabaseConfigured, supabase } from './supabase';
import { readStore, removeStore, writeStore } from './storage';

export const ADMIN_SESSION_KEY = 'lakhe.admin.session';
export const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

interface AdminSession {
  createdAt: number;
  portalSecret: string;
}

function readAdminSession(): AdminSession | null {
  const s = readStore<{ createdAt: number; portalSecret?: string } | null>(
    ADMIN_SESSION_KEY,
    null
  );
  if (!s) return null;
  if (Date.now() - s.createdAt > ADMIN_SESSION_TTL_MS) {
    removeStore(ADMIN_SESSION_KEY);
    return null;
  }
  return {
    createdAt: s.createdAt,
    portalSecret: s.portalSecret ?? config.admin.password,
  };
}

/** True when the /admin portal password session is active. */
export function isAdminPortalActive(): boolean {
  return readAdminSession() !== null;
}

/** Portal password sent to Supabase admin RPCs. */
export function getAdminPortalSecret(): string | null {
  const s = readAdminSession();
  if (!s) return null;
  return s.portalSecret || config.admin.password || null;
}

export function writeAdminSession(portalSecret: string): void {
  writeStore(ADMIN_SESSION_KEY, {
    createdAt: Date.now(),
    portalSecret,
  });
}

/**
 * After local password check, sync secret to Supabase so RPCs accept Vercel password.
 */
export async function publishAdminPortalSecret(password: string): Promise<void> {
  if (!isSupabaseConfigured || !password) return;
  const { error } = await supabase.rpc('admin_publish_portal_secret', {
    portal_secret: password,
  });
  if (error) {
    const msg = error.message ?? 'Could not sync admin password';
    if (
      msg.includes('Could not find the function') ||
      msg.includes('schema cache')
    ) {
      throw new Error(
        'Admin database functions missing. Run supabase/setup_all.sql in Supabase SQL Editor.'
      );
    }
    throw new Error(`Admin password sync failed: ${msg}`);
  }
}
