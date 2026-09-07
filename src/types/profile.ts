export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  is_admin: boolean;
  created_at?: string;
}

export type GalleryCategory = 'farm' | 'cultivation' | 'journey' | 'others';

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  category: GalleryCategory;
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  order: number;
}

export function normalizeGalleryCategory(category: string): GalleryCategory {
  if (
    category === 'farm' ||
    category === 'cultivation' ||
    category === 'journey' ||
    category === 'others'
  ) {
    return category;
  }
  if (category === 'training' || category === 'team') return 'journey';
  return 'others';
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  role?: string;
  avatar?: string;
  rating: number;
  quote: string;
}
