import type { Product } from '../types/product';
import { productImages } from './media';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p-oyster-spawn',
    slug: 'oyster-mushroom-spawn',
    name: 'Oyster Mushroom Spawn',
    category: 'spawn',
    short_description:
      'Vigorous, contamination-free spawn grown from mother cultures on our farm.',
    description:
      'Our oyster spawn is produced in sterile conditions using high-quality mother cultures selected for yield and flavour. Each 500g bag is freshly prepared, packed in food-grade material and shipped with care instructions.',
    price: 150,
    unit: '500g bag',
    images: [productImages.oysterSpawn],
    badges: ['fresh', 'best-seller'],
    stock: 120,
    rating: 4.8,
    highlights: [
      'Sterile lab-grade spawn',
      '80–90% biological efficiency',
      'Beginner-friendly',
    ],
  },
  {
    id: 'p-fresh-oyster',
    slug: 'fresh-oyster-mushroom',
    name: 'Fresh Oyster Mushroom',
    category: 'fresh',
    short_description:
      'Hand-harvested fresh oyster mushrooms delivered within 24 hours.',
    description:
      'Grown on pasteurised straw substrate and hand-picked at the peak of freshness. Ideal for stir-fries, curries and grills. Available in 250g and 500g packs.',
    price: 180,
    unit: '500g pack',
    images: [productImages.freshOyster],
    badges: ['fresh', 'natural'],
    stock: 40,
    rating: 4.9,
    highlights: [
      'Harvested-to-door in 24 hrs',
      'No pesticides',
      'Rich in protein & antioxidants',
    ],
  },
  {
    id: 'p-dry-oyster',
    slug: 'dry-oyster-mushroom',
    name: 'Dry Oyster Mushroom',
    category: 'dry',
    short_description:
      'Sun-dried oyster mushrooms with intense umami — long shelf life.',
    description:
      'Slowly dried to preserve aroma and nutrition. Rehydrate in warm water for 20 minutes and use like fresh mushrooms. Perfect pantry staple.',
    price: 400,
    unit: '100g pouch',
    images: [productImages.dryOyster],
    badges: ['natural', 'premium'],
    stock: 80,
    rating: 4.7,
    highlights: [
      '12 month shelf life',
      'No preservatives',
      'Concentrated flavour',
    ],
  },
  {
    id: 'p-mushroom-powder',
    slug: 'mushroom-powder',
    name: 'Mushroom Powder',
    category: 'powder',
    short_description:
      'Nutrient-dense oyster mushroom powder for daily wellness.',
    description:
      'Cold-milled from our dried mushrooms. Add a teaspoon to soups, smoothies or tea for a daily boost of protein, B-vitamins and antioxidants.',
    price: 300,
    unit: '150g jar',
    images: [productImages.mushroomPowder],
    badges: ['premium', 'natural'],
    stock: 60,
    rating: 4.8,
    highlights: [
      'Single-ingredient',
      'Vegan & gluten-free',
      'Immunity support',
    ],
  },
  {
    id: 'p-rte-oyster',
    slug: 'ready-to-eat-oyster',
    name: 'Ready-to-Eat Oyster Mushroom',
    category: 'ready-to-eat',
    short_description:
      'Chef-crafted, mildly spiced oyster mushroom pack. Just heat & serve.',
    description:
      'Cooked in small batches with cold-pressed oils and mild Indian spices. No preservatives. Refrigerate and consume within 5 days of opening.',
    price: 280,
    unit: '250g pack',
    images: [productImages.readyToEat],
    badges: ['ready-to-eat', 'best-seller'],
    stock: 30,
    rating: 4.9,
    highlights: [
      'No preservatives',
      'High protein',
      'Ready in 3 minutes',
    ],
  },
];
