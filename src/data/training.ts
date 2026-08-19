import type { TrainingCourse } from '../types/training';
import { trainingImages } from './media';

/** Sample programmes — pay on site; owner shares details directly after order confirmation. */
export const SAMPLE_TRAINING: TrainingCourse[] = [
  {
    id: 't-online',
    slug: 'online-training',
    title: 'Online Training',
    format: 'online',
    price: 1500,
    duration: 'Flexible schedule',
    image: trainingImages.online,
    short_description:
      'Pay programme fee online — full training plan shared directly by the owner.',
    description:
      'Reserve your online training with Lakhe Mushroom Farm. After your payment is verified, Tatya Lakhe will contact you personally with schedule, materials and step-by-step guidance. There is no online course portal on this website — everything is coordinated directly with the owner.',
    features: [
      'One-to-one guidance from the owner',
      'Schedule & materials shared after payment',
      'Covers spawn to sale on your setup',
      'WhatsApp support during training',
    ],
  },
  {
    id: 't-offline',
    slug: 'offline-training',
    title: 'Offline Training',
    format: 'offline',
    price: 3000,
    duration: 'Farm visit · dates confirmed by owner',
    image: trainingImages.offline,
    short_description:
      'Pay to book your seat — dates and on-farm details confirmed by the owner.',
    description:
      'Pay the programme fee online to reserve offline training at Lakhe Mushroom Farm. Once your order is approved, Tatya Lakhe will call you to confirm dates, batch size, what to bring and the full on-farm plan. Hands-on practice happens at the farm — not through this website.',
    features: [
      'Hands-on sessions at Lakhe farm',
      'Dates confirmed directly by owner',
      'Meals & farm walk included',
      'Starter materials guidance',
    ],
  },
  {
    id: 't-farm-setup',
    slug: 'complete-farm-setup',
    title: 'Complete Farm Setup',
    format: 'offline',
    price: 10000,
    duration: 'Custom project timeline',
    image: trainingImages.farmSetup,
    short_description:
      'Pay programme fee — full farm setup plan delivered directly by the owner.',
    description:
      'Pay the farm setup programme fee online. Tatya Lakhe will visit or consult on your site, assess your land and goals, and share a complete setup plan, timeline and costing directly with you. Build, equipment and execution details are coordinated personally — not through an online course on this site.',
    features: [
      'Site assessment & planning',
      'Grow-room & workflow design',
      'Equipment & vendor guidance',
      'Launch support from the owner',
    ],
  },
];
