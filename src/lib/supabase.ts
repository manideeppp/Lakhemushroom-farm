import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config, isSupabaseConfigured } from './config';

/**
 * Supabase browser client (singleton).
 *
 * When env vars are missing we still export a client pointed at a
 * dummy URL so imports don't crash. The data layer checks
 * `isSupabaseConfigured` before ever calling the client.
 */
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? config.supabase.url : 'http://localhost:54321',
  isSupabaseConfigured ? config.supabase.anonKey : 'public-anon-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
      flowType: 'pkce',
    },
  }
);

export { isSupabaseConfigured };
