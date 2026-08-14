/**
 * Runtime configuration read from Vite env vars.
 * Falls back to sensible defaults so `npm run dev` works
 * out-of-the-box in demo mode without any secrets.
 */

import { readRuntimeEnv } from './runtimeEnv';

export const config = {
  supabase: {
    url: readRuntimeEnv('VITE_SUPABASE_URL'),
    anonKey: readRuntimeEnv('VITE_SUPABASE_ANON_KEY'),
  },
  business: {
    upiId: readRuntimeEnv('VITE_UPI_ID') || 'lakhemushroomfarm@upi',
    upiPayee: readRuntimeEnv('VITE_UPI_PAYEE_NAME') || 'Lakhe Mushroom Farm',
    whatsapp: readRuntimeEnv('VITE_WHATSAPP_NUMBER') || '919921480466',
    email: readRuntimeEnv('VITE_CONTACT_EMAIL') || 'hello@lakhemushroomfarm.com',
    phone: readRuntimeEnv('VITE_CONTACT_PHONE') || '+91 99214 80466',
    address:
      readRuntimeEnv('VITE_CONTACT_ADDRESS') ||
      "Lakhe's Hi-Tech Mushroom Project, Mundhekarwadi, Maharashtra 413726",
    mapsUrl:
      readRuntimeEnv('VITE_GOOGLE_MAPS_URL') ||
      'https://www.google.com/maps/place/Lakhe%27s+Hi-Tech+Mushroom+Project+-+Farm/@18.5489724,74.6522284,16z/data=!4m6!3m5!1s0x3bc36a7786dfc0af:0x4737b85d5e7bfe8d!8m2!3d18.5489724!4d74.6522284!16s%2Fg%2F11gzqtn4w',
    mapsEmbedUrl:
      readRuntimeEnv('VITE_GOOGLE_MAPS_EMBED') ||
      'https://maps.google.com/maps?q=18.5489724,74.6522284&z=16&hl=en&output=embed',
  },
  admin: {
    emails: (
      readRuntimeEnv('VITE_ADMIN_EMAILS') ||
      import.meta.env.VITE_ADMIN_EMAILS ||
      'admin@lakhemushroomfarm.com'
    )
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    password:
      readRuntimeEnv('VITE_ADMIN_PASSWORD') ||
      import.meta.env.VITE_ADMIN_PASSWORD?.trim() ||
      'lakhe-admin-2026',
  },
} as const;

export const isSupabaseConfigured = !!(
  config.supabase.url && config.supabase.anonKey
);
