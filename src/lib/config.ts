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
    address:
      env.VITE_CONTACT_ADDRESS?.trim() ||
      "Lakhe's Hi-Tech Mushroom Project, Mundhekarwadi, Maharashtra 413726",
    mapsUrl:
      env.VITE_GOOGLE_MAPS_URL?.trim() ||
      'https://www.google.com/maps/place/Lakhe%27s+Hi-Tech+Mushroom+Project+-+Farm/@18.5489724,74.6522284,16z/data=!4m6!3m5!1s0x3bc36a7786dfc0af:0x4737b85d5e7bfe8d!8m2!3d18.5489724!4d74.6522284!16s%2Fg%2F11gzqtn4w',
    mapsEmbedUrl:
      env.VITE_GOOGLE_MAPS_EMBED?.trim() ||
      'https://maps.google.com/maps?q=18.5489724,74.6522284&z=16&hl=en&output=embed',
  },
  admin: {
    emails: (env.VITE_ADMIN_EMAILS ?? 'admin@lakhemushroomfarm.com')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    // Password used to sign into the /admin portal.
    // Set VITE_ADMIN_PASSWORD in .env.local for production.
    password: env.VITE_ADMIN_PASSWORD?.trim() || 'lakhe-admin-2026',
  },
} as const;

export const isSupabaseConfigured = !!(
  config.supabase.url && config.supabase.anonKey
);
