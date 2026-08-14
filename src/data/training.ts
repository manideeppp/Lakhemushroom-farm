import type { TrainingCourse } from '../types/training';
import { trainingImages } from './media';

export const SAMPLE_TRAINING: TrainingCourse[] = [
  {
    id: 't-online',
    slug: 'online-training',
    title: 'Online Training',
    format: 'online',
    price: 1500,
    duration: '12 hours · Self-paced',
    image: trainingImages.online,
    short_description:
      'Complete mushroom farming from spawn to sale — learn at your own pace.',
    description:
      'A complete online program covering biology, substrate prep, spawn making, cultivation, harvesting, packaging, marketing and business planning. Learn from years of on-farm practice.',
    features: [
      '10+ recorded video modules',
      'Downloadable PDFs & checklists',
      'Lifetime access',
      'Certificate of completion',
    ],
    outcomes: [
      'Set up a small mushroom unit at home',
      'Prepare your own spawn',
      'Sell fresh, dry & value-added products',
    ],
    modules: [
      {
        id: 'm1',
        course_id: 't-online',
        title: 'Welcome & Introduction to Mushroom Farming',
        description:
          'Overview of the course, mushroom varieties, and the business potential.',
        video_url: '',
        duration_minutes: 25,
        order: 1,
      },
      {
        id: 'm2',
        course_id: 't-online',
        title: 'Biology of Oyster Mushrooms',
        description: 'Life cycle, growth conditions, and common terms.',
        duration_minutes: 40,
        order: 2,
      },
      {
        id: 'm3',
        course_id: 't-online',
        title: 'Substrate Preparation',
        description: 'Straw, sawdust and paper substrates. Pasteurisation methods.',
        duration_minutes: 55,
        order: 3,
      },
      {
        id: 'm4',
        course_id: 't-online',
        title: 'Spawn Production',
        description: 'Sterile technique, grain spawn, and quality checks.',
        duration_minutes: 60,
        order: 4,
      },
      {
        id: 'm5',
        course_id: 't-online',
        title: 'Inoculation & Incubation',
        description: 'Bag prep, spawning ratios, and incubation environment.',
        duration_minutes: 50,
        order: 5,
      },
      {
        id: 'm6',
        course_id: 't-online',
        title: 'Fruiting & Harvesting',
        description: 'Fruiting room setup, humidity, harvesting cycles.',
        duration_minutes: 45,
        order: 6,
      },
      {
        id: 'm7',
        course_id: 't-online',
        title: 'Post-harvest, Drying & Value Addition',
        description: 'Packaging, drying, powders and ready-to-eat products.',
        duration_minutes: 50,
        order: 7,
      },
      {
        id: 'm8',
        course_id: 't-online',
        title: 'Marketing, Pricing & Business Setup',
        description: 'Positioning, retail, wholesale, licenses and subsidies.',
        duration_minutes: 60,
        order: 8,
      },
    ],
  },
  {
    id: 't-offline',
    slug: 'offline-training',
    title: 'Offline Training',
    format: 'offline',
    price: 3000,
    duration: '2 days',
    image: trainingImages.offline,
    short_description:
      'Hands-on training at our farm — see, touch and practice every step.',
    description:
      'Small batch sessions at Lakhe Mushroom Farm. Includes farm meals, printed workbook and starter spawn kit. Pick a date, book your seat, and pay on arrival.',
    features: [
      'Hands-on farm sessions',
      'Meals included',
      'Starter spawn kit',
      'Small batch training',
    ],
    outcomes: [
      'Practice substrate & spawn prep',
      'See real fruiting rooms',
      'Take home a working setup',
    ],
  },
];
