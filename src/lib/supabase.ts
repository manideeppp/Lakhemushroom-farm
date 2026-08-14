import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config, isSupabaseConfigured } from './config';

function createSupabaseClient(): SupabaseClient {
  const configured = isSupabaseConfigured();
  return createClient(
    configured ? config.supabase.url : 'http://localhost:54321',
    configured ? config.supabase.anonKey : 'public-anon-key',
    {
      auth: {
        persistSession: configured,
        autoRefreshToken: configured,
        detectSessionInUrl: configured,
        flowType: 'pkce',
      },
    }
  );
}

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) client = createSupabaseClient();
  return client;
}

/** Lazy Supabase client — waits until after runtime env is available. */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const value = (getClient() as unknown as Record<PropertyKey, unknown>)[prop];
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(getClient());
    }
    return value;
  },
});

export { isSupabaseConfigured };
