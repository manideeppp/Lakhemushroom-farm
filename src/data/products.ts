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
    id: 'p-fresh-milkey',
    slug: 'fresh-milkey-mushroom',
    name: 'Fresh Milkey Mushroom',
    category: 'fresh',
    short_description:
      'Thick, milky-white mushrooms with a firm bite and mild flavour.',
    description:
      'Milky mushrooms are grown in controlled farm conditions for consistent size and quality. Rich in B-vitamins and low in fat — perfect for curries, grills and stir-fries.',
    price: 200,
    unit: '500g pack',
    images: [productImages.freshMilkey],
    badges: ['fresh', 'natural'],
    stock: 35,
    rating: 4.8,
    highlights: [
      'High riboflavin & niacin',
      'Farm-harvested freshness',
      'Low fat, high nutrition',
    ],
  },
  {
    id: 'p-button',
    slug: 'button-mushroom',
    name: 'Button Mushroom',
    category: 'fresh',
    short_description:
      'Classic white button mushrooms — clean, versatile and kitchen-ready.',
    description:
      'Our button mushrooms are grown on Lakhe farm with strict hygiene and quality checks. Ideal for salads, pizzas, soups and everyday cooking.',
    price: 175,
    unit: '500g pack',
    images: [productImages.buttonMushroom],
    badges: ['fresh', 'best-seller'],
    stock: 50,
    rating: 4.8,
    highlights: [
      'Everyday cooking staple',
      'Rich in B-vitamins',
      'Carefully packed',
    ],
  },
  {
    id: 'p-lions-mane',
    slug: 'lions-mane-mushroom',
    name: "Lion's Mane Mushroom",
    category: 'fresh',
    short_description:
      'Premium lion’s mane with a delicate texture and wellness appeal.',
    description:
      'Hand-selected lion’s mane clusters grown on our farm. Known for its unique texture and nutritional profile. Cook lightly to preserve flavour and benefits.',
    price: 380,
    unit: '250g pack',
    images: [productImages.lionsMane],
    badges: ['premium', 'natural'],
    stock: 25,
    rating: 4.9,
    highlights: [
      'Low calorie, nutrient-rich',
      'Unique gourmet texture',
      'Farm-grown quality',
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
    id: 'p-dry-reishi',
    slug: 'dry-reishi-mushroom',
    name: 'Dry Reishi Mushroom',
    category: 'dry',
    short_description:
      'Premium dried reishi — high fibre, iron-rich wellness mushroom.',
    description:
      'Carefully dried reishi mushrooms with a rich, earthy profile. Ideal for teas, decoctions and wellness routines. Packed with fibre and iron.',
    price: 520,
    unit: '100g pouch',
    images: [productImages.dryReishi],
    badges: ['premium', 'natural'],
    stock: 45,
    rating: 4.8,
    highlights: [
      '83g fibre per 100g',
      '64% daily iron (RI)',
      'Long shelf life',
    ],
  },
  {
    id: 'p-dry-shiitake',
    slug: 'dry-shiitake-mushroom',
    name: 'Dry Shiitake Mushroom',
    category: 'dry',
    short_description:
      'Aromatic dried shiitake slices — deep umami for broths and stir-fries.',
    description:
      'Sun-dried shiitake mushrooms with concentrated flavour. Rehydrate before cooking or grind into powders for seasoning.',
    price: 450,
    unit: '100g pouch',
    images: [productImages.dryShiitake],
    badges: ['premium', 'natural'],
    stock: 55,
    rating: 4.8,
    highlights: [
      'High potassium content',
      'Rich B-vitamin profile',
      'Pantry-friendly',
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
    id: 'p-cordyceps',
    slug: 'cordyceps-mushroom',
    name: 'Cordyceps Mushroom',
    category: 'powder',
    short_description:
      'Cordyceps supplement with B12 — energy and wellness support.',
    description:
      'Premium cordyceps mushroom prepared for daily supplementation. High in B12 and low in calories per serving.',
    price: 550,
    unit: '50g pack',
    images: [productImages.cordyceps],
    badges: ['premium', 'natural'],
    stock: 30,
    rating: 4.9,
    highlights: [
      '30% daily B12 per 2g serving',
      'Low calorie supplement',
      'Lab-checked quality',
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
  {
    id: 'p-roasted',
    slug: 'roasted-mushroom-ready-to-eat',
    name: 'Roasted Mushroom (Ready to Eat)',
    category: 'ready-to-eat',
    short_description:
      'Slow-roasted mushrooms — crunchy, flavourful and ready to enjoy.',
    description:
      'Our roasted mushroom packs are prepared in small batches for snacking, salads and quick meals. See nutritional panel for full specifications.',
    price: 320,
    unit: '200g pack',
    images: [productImages.roastedMushroom],
    badges: ['ready-to-eat', 'premium'],
    stock: 28,
    rating: 4.8,
    highlights: [
      'Ready to eat',
      'High protein snack',
      'Full nutrition label available',
    ],
  },
];
