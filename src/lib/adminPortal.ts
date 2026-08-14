import { config } from './config';
import { readStore, removeStore } from './storage';

export const ADMIN_SESSION_KEY = 'lakhe.admin.session';
export const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

interface AdminSession {
  createdAt: number;
}

/** True when the /admin portal password session is active. */
export function isAdminPortalActive(): boolean {
  const s = readStore<AdminSession | null>(ADMIN_SESSION_KEY, null);
  if (!s) return false;
  if (Date.now() - s.createdAt > ADMIN_SESSION_TTL_MS) {
    removeStore(ADMIN_SESSION_KEY);
    return false;
  }
  return true;
}

/** Portal password sent to Supabase admin RPCs (matches VITE_ADMIN_PASSWORD / default). */
export function getAdminPortalSecret(): string | null {
  if (!isAdminPortalActive()) return null;
  return config.admin.password || null;
}
