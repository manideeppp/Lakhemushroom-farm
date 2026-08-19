import type { GalleryItem, Testimonial } from '../types/profile';
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
  'training',
  'farm',
  'cultivation',
  'training',
  'farm',
  'cultivation',
  'team',
  'clients',
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

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya Sharma',
    location: 'Pune',
    role: 'Home cultivator',
    rating: 5,
    quote:
      'The A–Z online training was incredibly thorough. I set up my first cultivation shelf in three weekends and had my first harvest a month later.',
  },
  {
    id: 't2',
    name: 'Ravi Menon',
    location: 'Kochi',
    role: 'Small farmer',
    rating: 5,
    quote:
      'The team walked us through everything — from substrate to selling. My mushroom unit is now paying for itself every month.',
  },
  {
    id: 't3',
    name: 'Anaïs Petit',
    location: 'Lyon, France',
    role: 'International client',
    rating: 5,
    quote:
      'A rare combination of premium products and genuine expertise. The powder is now part of my daily wellness routine.',
  },
  {
    id: 't4',
    name: 'Mahesh Yadav',
    location: 'Nashik',
    role: 'Weekend workshop attendee',
    rating: 5,
    quote:
      'The offline workshop felt personal and honest. No shortcuts, no upsells — just real practice.',
  },
  {
    id: 't5',
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    role: 'Online student',
    rating: 5,
    quote:
      'Clear modules and honest advice. I started selling dried mushrooms to neighbours within two months.',
  },
  {
    id: 't7',
    name: 'Rajesh Kulkarni',
    location: 'Ahmednagar',
    role: 'Spawn buyer',
    rating: 5,
    quote:
      'Lakhe spawn quality is consistent — our unit harvests improved within the first cycle. Genuine farm support.',
  },
  {
    id: 't8',
    name: 'Deepa Nair',
    location: 'Bangalore',
    role: 'Retail buyer',
    rating: 5,
    quote:
      'Fresh mushrooms arrive clean and well packed. Lakhe is our trusted supplier for premium varieties.',
  },
];
