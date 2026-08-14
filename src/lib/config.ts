/**
 * Runtime configuration read from Vite env vars.
 * Falls back to sensible defaults so `npm run dev` works
 * out-of-the-box in demo mode without any secrets.
 */

const env = import.meta.env;

export const config = {
  supabase: {
    url: env.VITE_SUPABASE_URL?.trim() ?? '',
    anonKey: env.VITE_SUPABASE_ANON_KEY?.trim() ?? '',
  },
  business: {
    upiId: env.VITE_UPI_ID?.trim() || 'lakhemushroomfarm@upi',
    upiPayee: env.VITE_UPI_PAYEE_NAME?.trim() || 'Lakhe Mushroom Farm',
    whatsapp: env.VITE_WHATSAPP_NUMBER?.trim() || '919876543210',
    email: env.VITE_CONTACT_EMAIL?.trim() || 'hello@lakhemushroomfarm.com',
    phone: env.VITE_CONTACT_PHONE?.trim() || '+91 98765 43210',
    address: 'Farm Road, Rural District, India',
  },
  admin: {
    emails: (env.VITE_ADMIN_EMAILS ?? 'admin@lakhemushroomfarm.com')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  },
} as const;

export const isSupabaseConfigured = !!(
  config.supabase.url && config.supabase.anonKey
);
