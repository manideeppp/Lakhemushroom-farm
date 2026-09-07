import type { GalleryItem } from '../types/profile';
import { TESTIMONIALS } from './testimonials';
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import photo3 from '../assets/photo3.jpg';
import photo4 from '../assets/photo4.jpg';
import photo5 from '../assets/photo5.jpg';
import photo6 from '../assets/photo6.jpg';
import photo7 from '../assets/photo7.jpg';
import photo8 from '../assets/photo8.jpg';
import photo9 from '../assets/photo9.jpg';
import photo10 from '../assets/photo10.jpg';
import photo11 from '../assets/photo11.jpg';
import photo12 from '../assets/photo12.jpg';

const GALLERY_PHOTOS = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  photo10,
  photo11,
  photo12,
] as const;

const GALLERY_CATEGORIES: GalleryItem['category'][] = [
  'farm',
  'cultivation',
  'cultivation',
  'journey',
  'farm',
  'cultivation',
  'journey',
  'farm',
  'cultivation',
  'journey',
  'others',
  'farm',
];

export const SAMPLE_GALLERY: GalleryItem[] = GALLERY_PHOTOS.map((src, i) => ({
  id: `photo-${i + 1}`,
  type: 'image' as const,
  category: GALLERY_CATEGORIES[i],
  media_url: src,
  caption: `Lakhe Mushroom Farm — photo ${i + 1}`,
  order: i + 1,
}));

export function mergeSampleGallery(remote: GalleryItem[]): GalleryItem[] {
  if (remote.length === 0) return SAMPLE_GALLERY;
  const extra = remote.filter(
    (r) => r.order > SAMPLE_GALLERY.length && !SAMPLE_GALLERY.some((s) => s.id === r.id)
  );
  return [...SAMPLE_GALLERY, ...extra].sort((a, b) => a.order - b.order);
}

export const SAMPLE_TESTIMONIALS = TESTIMONIALS;
