import { isSupabaseConfigured, supabase } from './supabase';

export type AdminMediaFolder = 'products' | 'gallery' | 'training';

const SITE_MEDIA_BUCKET = 'site-media';
const MAX_BYTES = 5 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.-]+/g, '_').slice(0, 120);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Upload an admin image; returns a public URL (or data URL in demo mode). */
export async function uploadAdminMedia(
  file: File,
  folder: AdminMediaFolder
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (JPG, PNG, or WebP).');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be smaller than 5 MB.');
  }

  if (!isSupabaseConfigured()) {
    return fileToDataUrl(file);
  }

  const path = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .upload(path, file, {
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });
  if (error) throw error;

  const { data } = supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
