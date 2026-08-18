import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Building2, GraduationCap } from 'lucide-react';
import { MushroomIcon } from '../components/icons/MushroomIcon';
import homeStoryFarm from '../assets/home-story-farm.png';
import founderPortrait from '../assets/founder-portrait.png';
import heroMushroomBasket from '../assets/hero-mushroom-basket.png';
import homeGrowTraining from '../assets/home-grow-training.png';
import homeGrowFarmSetup from '../assets/home-grow-farm-setup.png';

export const HOME_HERO_IMAGE = heroMushroomBasket;

export const HOME_GROW_PRODUCTS_IMAGE = heroMushroomBasket;
export const HOME_GROW_TRAINING_IMAGE = homeGrowTraining;
export const HOME_GROW_FARM_SETUP_IMAGE = homeGrowFarmSetup;

export interface HomeGrowOffering {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  to: string;
}

export const HOME_GROW_OFFERINGS: HomeGrowOffering[] = [
  {
    title: 'Fresh Mushroom Products',
    description: 'High-quality, fresh mushrooms grown with care.',
    image: HOME_GROW_PRODUCTS_IMAGE,
    imageAlt: 'Fresh mushrooms in a wicker basket',
    icon: MushroomIcon,
    to: '/products',
  },
  {
    title: 'Mushroom Training',
    description:
      'Practical training and guidance to start and grow successfully.',
    image: HOME_GROW_TRAINING_IMAGE,
    imageAlt: 'Mushroom cultivation training materials',
    icon: GraduationCap,
    to: '/training',
  },
  {
    title: 'Complete Farm Setup',
    description: 'End-to-end solutions for your mushroom farm setup.',
    image: HOME_GROW_FARM_SETUP_IMAGE,
    imageAlt: 'Complete mushroom farm growing facility',
    icon: Building2,
    to: '/consultancy',
  },
];

export const HOME_STORY_IMAGE = homeStoryFarm;

export const HOME_FOUNDER_IMAGE = founderPortrait;

export const HOME_FARM_SHOWCASE = [
  {
    id: 'hs1',
    type: 'image' as const,
    media_url:
      'https://images.unsplash.com/photo-1611574474461-46f3f36fbb90?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fresh oyster clusters',
  },
  {
    id: 'hs2',
    type: 'image' as const,
    media_url:
      'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1200&q=80',
    caption: 'Inside the growing shed',
  },
  {
    id: 'hs3',
    type: 'video' as const,
    media_url:
      'https://videos.pexels.com/video-files/6963395/6963395-uhd_2560_1440_25fps.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    caption: 'Farm walk-through',
  },
  {
    id: 'hs4',
    type: 'image' as const,
    media_url:
      'https://images.unsplash.com/photo-1568900122085-3c05f8bd57e5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Spawn & substrate prep',
  },
  {
    id: 'hs5',
    type: 'video' as const,
    media_url:
      'https://videos.pexels.com/video-files/4508067/4508067-uhd_2560_1440_25fps.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1607301405390-d831c242f59b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Harvest morning',
  },
  {
    id: 'hs6',
    type: 'image' as const,
    media_url:
      'https://images.unsplash.com/photo-1524178232363-1ba1f8b83d0b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Training on the farm',
  },
  {
    id: 'hs7',
    type: 'image' as const,
    media_url:
      'https://images.unsplash.com/photo-1615398265937-71bc7a9c8dfe?auto=format&fit=crop&w=1200&q=80',
    caption: 'Packaging & quality checks',
  },
  {
    id: 'hs8',
    type: 'video' as const,
    media_url:
      'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1601300961833-e6f635e6f4f6?auto=format&fit=crop&w=1200&q=80',
    caption: 'Greenhouse cultivation',
  },
];