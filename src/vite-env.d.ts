/// <reference types="vite/client" />
declare module '*.css';

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_UPI_ID?: string;
  readonly VITE_UPI_PAYEE_NAME?: string;
  readonly VITE_ADMIN_EMAILS?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_CONTACT_ADDRESS?: string;
  readonly VITE_GOOGLE_MAPS_URL?: string;
  readonly VITE_GOOGLE_MAPS_EMBED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
