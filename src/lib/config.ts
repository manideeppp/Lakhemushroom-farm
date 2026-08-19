/**
 * Runtime configuration — reads Vite env + window.__RUNTIME_ENV__ (inline in index.html).
 */

import { readRuntimeEnv } from './runtimeEnv';

export const config = {
  supabase: {
    get url() {
      return readRuntimeEnv('VITE_SUPABASE_URL');
    },
    get anonKey() {
      return readRuntimeEnv('VITE_SUPABASE_ANON_KEY');
    },
  },
  business: {
    get upiId() {
      return readRuntimeEnv('VITE_UPI_ID') || 'lakhemushroomfarm@upi';
    },
    get upiPayee() {
      return readRuntimeEnv('VITE_UPI_PAYEE_NAME') || 'Lakhe Mushroom Farm';
    },
    get whatsapp() {
      return readRuntimeEnv('VITE_WHATSAPP_NUMBER') || '919921480466';
    },
    get email() {
      return readRuntimeEnv('VITE_CONTACT_EMAIL') || 'lakhe.tatya@gmail.com';
    },
    get phone() {
      return readRuntimeEnv('VITE_CONTACT_PHONE') || '+91 99214 80466';
    },
    get phones() {
      const raw = import.meta.env.VITE_CONTACT_PHONES as string | undefined;
      const list = (raw || '+91 99214 80466, +91 63621 83728')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return list;
    },
    get address() {
      return (
        readRuntimeEnv('VITE_CONTACT_ADDRESS') ||
        'At. Post Mundhekarwadi, Tal. Shrigonda, Dist. Ahmednagar, Maharashtra 413726'
      );
    },
    get branches() {
      return [
        {
          label: 'Maharashtra (Farm)',
          address:
            'At. Post Mundhekarwadi, Tal. Shrigonda, Dist. Ahmednagar, Maharashtra 413726',
        },
        {
          label: 'Bangalore',
          address:
            '15, Mari Chinnappa Manson, Medarahalli, Opp. JJ Hospital, Chikkabanavara, Bangalore 560090',
        },
      ];
    },
    get mapsUrl() {
      return (
        readRuntimeEnv('VITE_GOOGLE_MAPS_URL') ||
        'https://www.google.com/maps/place/Lakhe%27s+Hi-Tech+Mushroom+Project+-+Farm/@18.5489724,74.6522284,16z/data=!4m6!3m5!1s0x3bc36a7786dfc0af:0x4737b85d5e7bfe8d!8m2!3d18.5489724!4d74.6522284!16s%2Fg%2F11gzqtn4w'
      );
    },
    get mapsEmbedUrl() {
      return (
        readRuntimeEnv('VITE_GOOGLE_MAPS_EMBED') ||
        'https://maps.google.com/maps?q=18.5489724,74.6522284&z=16&hl=en&output=embed'
      );
    },
  },
  admin: {
    get emails() {
      return (
        readRuntimeEnv('VITE_ADMIN_EMAILS') ||
        import.meta.env.VITE_ADMIN_EMAILS ||
        'admin@lakhemushroom.com'
      )
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    },
    get password() {
      return (
        readRuntimeEnv('VITE_ADMIN_PASSWORD') ||
        import.meta.env.VITE_ADMIN_PASSWORD?.trim() ||
        'lakhe-admin-2026'
      );
    },
  },
};

/** supabase-js requires the legacy JWT anon key (eyJ…), not sb_publishable_* keys. */
export function isValidSupabaseAnonKey(key: string): boolean {
  return key.startsWith('eyJ');
}

export function isSupabaseConfigured(): boolean {
  const url = readRuntimeEnv('VITE_SUPABASE_URL');
  const anonKey = readRuntimeEnv('VITE_SUPABASE_ANON_KEY');
  return !!(url && anonKey && isValidSupabaseAnonKey(anonKey));
}
