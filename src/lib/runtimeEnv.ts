/** Build-time / runtime env injected via public/runtime-env.js on Vercel. */
export interface RuntimeEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_ADMIN_PASSWORD?: string;
  VITE_ADMIN_EMAILS?: string;
  VITE_UPI_ID?: string;
  VITE_UPI_PAYEE_NAME?: string;
  VITE_WHATSAPP_NUMBER?: string;
  VITE_CONTACT_EMAIL?: string;
  VITE_CONTACT_PHONE?: string;
  VITE_CONTACT_ADDRESS?: string;
  VITE_GOOGLE_MAPS_URL?: string;
  VITE_GOOGLE_MAPS_EMBED?: string;
}

declare global {
  interface Window {
    __RUNTIME_ENV__?: RuntimeEnv;
  }
}

export function readRuntimeEnv(key: keyof RuntimeEnv): string {
  const runtime =
    typeof window !== 'undefined' ? window.__RUNTIME_ENV__?.[key] : undefined;
  const fromVite = import.meta.env[key];
  const value = runtime ?? fromVite ?? '';
  return typeof value === 'string' ? value.trim() : '';
}
