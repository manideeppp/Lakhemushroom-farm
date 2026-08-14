import type { TrainingCourse } from '../types/training';

export const SAMPLE_TRAINING: TrainingCourse[] = [
  {
    id: 't-az-online',
    slug: 'a-z-mushroom-farming-online',
    title: 'A–Z Mushroom Farming Online Training',
    format: 'online',
    price: 1500,
    duration: '12 hours · Self-paced',
    image:
      'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1600&q=70',
    short_description:
      'Everything you need to start growing mushrooms — from spawn to sale.',
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
        course_id: 't-az-online',
        title: 'Welcome & Introduction to Mushroom Farming',
        description:
          'Overview of the course, mushroom varieties, and the business potential.',
        video_url: '',
        duration_minutes: 25,
        order: 1,
      },
      {
        id: 'm2',
        course_id: 't-az-online',
        title: 'Biology of Oyster Mushrooms',
        description: 'Life cycle, growth conditions, and common terms.',
        duration_minutes: 40,
        order: 2,
      },
      {
        id: 'm3',
        course_id: 't-az-online',
        title: 'Substrate Preparation',
        description: 'Straw, sawdust and paper substrates. Pasteurisation methods.',
        duration_minutes: 55,
        order: 3,
      },
      {
        id: 'm4',
        course_id: 't-az-online',
        title: 'Spawn Production',
        description: 'Sterile technique, grain spawn, and quality checks.',
        duration_minutes: 60,
        order: 4,
      },
      {
        id: 'm5',
        course_id: 't-az-online',
        title: 'Inoculation & Incubation',
        description: 'Bag prep, spawning ratios, and incubation environment.',
        duration_minutes: 50,
        order: 5,
      },
      {
        id: 'm6',
        course_id: 't-az-online',
        title: 'Fruiting & Harvesting',
        description: 'Fruiting room setup, humidity, harvesting cycles.',
        duration_minutes: 45,
        order: 6,
      },
      {
        id: 'm7',
        course_id: 't-az-online',
        title: 'Post-harvest, Drying & Value Addition',
        description: 'Packaging, drying, powders and ready-to-eat products.',
        duration_minutes: 50,
        order: 7,
      },
      {
        id: 'm8',
        course_id: 't-az-online',
        title: 'Marketing, Pricing & Business Setup',
        description: 'Positioning, retail, wholesale, licenses and subsidies.',
        duration_minutes: 60,
        order: 8,
      },
    ],
  },
  {
    id: 't-weekend-offline',
    slug: 'weekend-farm-immersion',
    title: 'Weekend Farm Immersion',
    format: 'offline',
    price: 3000,
    duration: '2 days',
    image:
      'https://images.unsplash.com/photo-1615398265937-71bc7a9c8dfe?auto=format&fit=crop&w=1600&q=70',
    short_description:
      'A hands-on two-day session at our farm — see, touch and try every step.',
    description:
      'Small batch of 10. Includes farm meals, printed workbook and starter spawn kit. Pick a date, book your seat, and pay on arrival.',
    features: [
      'Hands-on farm sessions',
      'Meals included',
      'Starter spawn kit',
      'Small batch of 10',
    ],
    outcomes: [
      'Practice substrate & spawn prep',
      'See real fruiting rooms',
      'Take home a working setup',
    ],
  },
  {
    id: 't-advanced-offline',
    slug: 'advanced-cultivation-bootcamp',
    title: 'Advanced Cultivation Bootcamp',
    format: 'offline',
    price: 4500,
    duration: '4 weeks',
    image:
      'https://images.unsplash.com/photo-1601300961833-e6f635e6f4f6?auto=format&fit=crop&w=1600&q=70',
    short_description:
      'Deep-dive on-farm program for people planning a commercial unit.',
    description:
      'Four weeks of hands-on training at our farm, including weekly live Q&A, business toolkit, and a final on-farm evaluation. Ideal for those planning a commercial unit.',
    features: [
      'Live weekly Q&A',
      'On-farm assessment day',
      'Business toolkit',
      'Priority support',
    ],
    outcomes: [
      'Plan a commercial unit',
      'Optimise yield and margins',
      'Access to founder mentoring',
    ],
  },
];
