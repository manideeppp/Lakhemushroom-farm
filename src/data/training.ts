import type { TrainingCourse } from '../types/training';
import { trainingImages } from './media';

const CURRICULUM = [
  'Importance of information & farm planning',
  'Raw material samples & substrate preparation',
  'Practical cultivation training',
  'Crop management & fruiting room care',
  'Packing & post-harvest handling',
  'Marketing & sales guidance',
];

export const PUBLIC_TRAINING_SLUGS = ['online-training', 'offline-training'] as const;

export function isPublicTrainingSlug(slug: string): boolean {
  return (PUBLIC_TRAINING_SLUGS as readonly string[]).includes(slug);
}

export function sortPublicTraining(courses: TrainingCourse[]): TrainingCourse[] {
  return [...courses].sort(
    (a, b) =>
      PUBLIC_TRAINING_SLUGS.indexOf(a.slug as (typeof PUBLIC_TRAINING_SLUGS)[number]) -
      PUBLIC_TRAINING_SLUGS.indexOf(b.slug as (typeof PUBLIC_TRAINING_SLUGS)[number])
  );
}

/** Demo-mode fallback when Supabase is not configured. */
export const SAMPLE_TRAINING: TrainingCourse[] = [
  {
    id: 't-online',
    slug: 'online-training',
    title: 'Online Mushroom Training',
    format: 'online',
    price: 3000,
    duration: 'Self-paced · video modules',
    image: trainingImages.online,
    short_description:
      'Full mushroom farming programme with recorded videos — learn spawn to sale from Lakhe farm.',
    description:
      'A complete online mushroom cultivation programme from Lakhe Mushroom Farm. After your payment is verified, Tatya Lakhe will share access to recorded video lessons covering every stage — from understanding raw materials and substrates to crop management, packing and marketing. Ideal if you want to learn at your own pace while still receiving direct guidance from our farm team.',
    features: [
      ...CURRICULUM,
      'Recorded video modules provided for each topic',
      'Downloadable notes & checklists',
      'WhatsApp support from the owner',
      'Certificate on completion',
    ],
    outcomes: [
      'Plan and set up a small mushroom unit',
      'Prepare substrates and manage spawn',
      'Harvest, pack and market your produce',
    ],
  },
  {
    id: 't-offline',
    slug: 'offline-training',
    title: 'Offline Mushroom Training',
    format: 'offline',
    price: 10000,
    duration: '2 days · at Lakhe farm',
    image: trainingImages.offline,
    short_description:
      'Two-day hands-on training at our farm — see, practice and learn every step on site.',
    description:
      'An intensive two-day programme at Lakhe Mushroom Farm in Ahmednagar. Work alongside our team through spawn handling, substrate prep, inoculation, crop management, harvesting, packing and marketing. After payment verification, Tatya Lakhe will confirm your batch dates, travel details and what to bring. Small groups for personal attention.',
    features: [
      ...CURRICULUM,
      'Hands-on practice in our growing sheds',
      'Live demonstrations of spawn & substrate work',
      'Farm meals during the programme',
      'Printed workbook & starter guidance',
      'Direct Q&A with Tatya Lakhe',
    ],
    outcomes: [
      'Experience every step on a working farm',
      'Build confidence for your own unit',
      'Network with fellow growers',
    ],
  },
];
