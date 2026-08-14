import { supabase, isSupabaseConfigured } from './supabase';
import { config } from './config';

async function profileIsAdmin(userId: string): Promise<boolean> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('id', userId)
    .maybeSingle();
  if (error || !profile?.is_admin) return false;
  const email = (profile.email ?? '').toLowerCase();
  return config.admin.emails.includes(email);
}

/**
 * Ensures the Supabase session can read/write admin data (RLS requires is_admin).
 * Call after the portal password check succeeds.
 */
export async function ensureSupabaseAdminAccess(
  portalPassword: string
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && (await profileIsAdmin(user.id))) return;

  const adminEmail = config.admin.emails[0];
  if (!adminEmail) {
    throw new Error(
      'Set VITE_ADMIN_EMAILS (your admin email) in environment variables.'
    );
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: portalPassword,
  });

  if (error) {
    throw new Error(
      `Could not connect to the database as ${adminEmail}. Sign in on the main site with that email first, enable Email+Password in Supabase Auth, set the same password as the admin portal, and run: update profiles set is_admin = true where email = '${adminEmail}'.`
    );
  }

  const {
    data: { user: signedIn },
  } = await supabase.auth.getUser();
  if (!signedIn || !(await profileIsAdmin(signedIn.id))) {
    throw new Error(
      `Signed in as ${adminEmail} but is_admin is false. Run in Supabase SQL: update profiles set is_admin = true where email = '${adminEmail}'.`
    );
  }
}

export async function hasSupabaseAdminAccess(): Promise<boolean> {
  if (!isSupabaseConfigured) return true;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  return profileIsAdmin(user.id);
}
