import type { GalleryItem, Testimonial } from '../types/profile';

export const SAMPLE_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    type: 'image',
    category: 'farm',
    media_url:
      'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1600&q=70',
    caption: 'Our main growing shed',
    order: 1,
  },
  {
    id: 'g2',
    type: 'image',
    category: 'cultivation',
    media_url:
      'https://images.unsplash.com/photo-1568900122085-3c05f8bd57e5?auto=format&fit=crop&w=1600&q=70',
    caption: 'Oyster mushrooms at peak fruiting',
    order: 2,
  },
  {
    id: 'g3',
    type: 'image',
    category: 'cultivation',
    media_url:
      'https://images.unsplash.com/photo-1611574474461-46f3f36fbb90?auto=format&fit=crop&w=1600&q=70',
    caption: 'Freshly harvested clusters',
    order: 3,
  },
  {
    id: 'g4',
    type: 'image',
    category: 'training',
    media_url:
      'https://images.unsplash.com/photo-1524178232363-1ba1f8b83d0b?auto=format&fit=crop&w=1600&q=70',
    caption: 'Weekend immersion in session',
    order: 4,
  },
  {
    id: 'g5',
    type: 'image',
    category: 'team',
    media_url:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=70',
    caption: 'Our farm team',
    order: 5,
  },
  {
    id: 'g6',
    type: 'image',
    category: 'clients',
    media_url:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=70',
    caption: 'International cohort visit',
    order: 6,
  },
  {
    id: 'g7',
    type: 'image',
    category: 'farm',
    media_url:
      'https://images.unsplash.com/photo-1615398265937-71bc7a9c8dfe?auto=format&fit=crop&w=1600&q=70',
    caption: 'Substrate preparation area',
    order: 7,
  },
  {
    id: 'g8',
    type: 'image',
    category: 'cultivation',
    media_url:
      'https://images.unsplash.com/photo-1607301405390-d831c242f59b?auto=format&fit=crop&w=1600&q=70',
    caption: 'Spawn bags in incubation',
    order: 8,
  },
  {
    id: 'g9',
    type: 'video',
    category: 'farm',
    media_url:
      'https://videos.pexels.com/video-files/6963395/6963395-uhd_2560_1440_25fps.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80',
    caption: 'Walking through the farm',
    order: 9,
  },
  {
    id: 'g10',
    type: 'video',
    category: 'cultivation',
    media_url:
      'https://videos.pexels.com/video-files/4508067/4508067-uhd_2560_1440_25fps.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1607301405390-d831c242f59b?auto=format&fit=crop&w=1600&q=80',
    caption: 'Harvest & packing',
    order: 10,
  },
  {
    id: 'g11',
    type: 'image',
    category: 'cultivation',
    media_url:
      'https://images.unsplash.com/photo-1611743331025-2bbf67c72934?auto=format&fit=crop&w=1600&q=80',
    caption: 'Oyster mushrooms on the shelf',
    order: 11,
  },
  {
    id: 'g12',
    type: 'video',
    category: 'training',
    media_url:
      'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1601300961833-e6f635e6f4f6?auto=format&fit=crop&w=1600&q=80',
    caption: 'Greenhouse cultivation clip',
    order: 12,
  },
];

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
