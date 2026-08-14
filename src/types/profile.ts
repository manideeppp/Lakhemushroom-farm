export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  is_admin: boolean;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  category: 'farm' | 'cultivation' | 'training' | 'team' | 'clients';
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  order: number;
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
