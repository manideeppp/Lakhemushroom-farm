import type { NutritionRow, Product } from '../types/product';

interface ProductNutritionMeta {
  basis?: string;
  specifications?: NutritionRow[];
  rows: NutritionRow[];
}

const NUTRITION_BY_SLUG: Record<string, ProductNutritionMeta> = {
  'oyster-mushroom-spawn': {
    specifications: [
      {
        label: 'Note',
        value: 'Relevant to mycelium nutrition — not for human consumption',
      },
      { label: 'Nature', value: 'Living mycelium on grain, sawdust, or wood plugs' },
      { label: 'Color', value: 'White to off-white (healthy and pure)' },
      { label: 'Odor', value: 'Earthy, mushroom-like (no foul or sour smell)' },
      { label: 'Texture', value: 'Firm, dense, colonized medium' },
      {
        label: 'Form types',
        value: 'Grain spawn, sawdust spawn, plug spawn, liquid culture',
      },
      {
        label: 'Shelf life',
        value: '1–3 months refrigerated (shorter at room temperature)',
      },
      {
        label: 'Usage',
        value: 'Inoculate straw, logs, compost and other substrates',
      },
      { label: 'Carbohydrates', value: 'Energy source for mycelium spread' },
      { label: 'Protein (Nitrogen)', value: 'Enzyme and cell wall synthesis' },
      { label: 'Moisture', value: 'Supports metabolic activity' },
      { label: 'pH level', value: 'Optimal range 6.0 to 7.5' },
    ],
    rows: [],
  },
  'fresh-oyster-mushroom': {
    basis: 'Per 100g (approx.)',
    rows: [
      { label: 'Energy', value: '113 kJ (27 kcal)' },
      { label: 'Protein', value: '2.5g' },
      { label: 'Carbohydrates', value: '4.1g' },
      { label: 'Fat', value: '0.1g' },
      { label: 'Potassium', value: '448mg', dailyValue: '10%' },
      { label: 'Riboflavin (B2)', value: '0.5mg', dailyValue: '42%' },
      { label: 'Niacin (B3)', value: '3.8mg', dailyValue: '25%' },
    ],
  },
  'fresh-milkey-mushroom': {
    basis: 'Nutritional value per 100g (3.5 oz)',
    rows: [
      { label: 'Energy', value: '113 kJ (27 kcal)' },
      { label: 'Carbohydrates', value: '4.1 g' },
      { label: 'Fat', value: '0.1 g' },
      { label: 'Protein', value: '2.5 g' },
      { label: 'Thiamine (vit. B1)', value: '0.1 mg', dailyValue: '9%' },
      { label: 'Riboflavin (vit. B2)', value: '0.5 mg', dailyValue: '42%' },
      { label: 'Niacin (vit. B3)', value: '3.8 mg', dailyValue: '25%' },
      { label: 'Pantothenic acid (B5)', value: '1.5 mg', dailyValue: '30%' },
      { label: 'Vitamin C', value: '0 mg', dailyValue: '0%' },
      { label: 'Calcium', value: '18 mg', dailyValue: '2%' },
      { label: 'Phosphorus', value: '120 mg', dailyValue: '17%' },
      { label: 'Potassium', value: '448 mg', dailyValue: '10%' },
      { label: 'Sodium', value: '6 mg', dailyValue: '0%' },
      { label: 'Zinc', value: '1.1 mg', dailyValue: '12%' },
    ],
  },
  'button-mushroom': {
    basis: 'Nutritional value per 100g (3.5 oz)',
    rows: [
      { label: 'Energy', value: '113 kJ (27 kcal)' },
      { label: 'Carbohydrates', value: '4.1 g' },
      { label: 'Fat', value: '0.1 g' },
      { label: 'Protein', value: '2.5 g' },
      { label: 'Thiamine (vit. B1)', value: '0.1 mg', dailyValue: '9%' },
      { label: 'Riboflavin (vit. B2)', value: '0.5 mg', dailyValue: '42%' },
      { label: 'Niacin (vit. B3)', value: '3.8 mg', dailyValue: '25%' },
      { label: 'Pantothenic acid (B5)', value: '1.5 mg', dailyValue: '30%' },
      { label: 'Vitamin C', value: '0 mg', dailyValue: '0%' },
      { label: 'Calcium', value: '18 mg', dailyValue: '2%' },
      { label: 'Phosphorus', value: '120 mg', dailyValue: '17%' },
      { label: 'Potassium', value: '448 mg', dailyValue: '10%' },
      { label: 'Sodium', value: '6 mg', dailyValue: '0%' },
      { label: 'Zinc', value: '1.1 mg', dailyValue: '12%' },
    ],
  },
  'lions-mane-mushroom': {
    basis: 'Nutrition facts (per serving)',
    rows: [
      { label: 'Calories', value: '35' },
      { label: 'Total Fat', value: '0g', dailyValue: '0%' },
      { label: 'Saturated / Trans Fat', value: '0g', dailyValue: '0%' },
      { label: 'Cholesterol', value: '0mg', dailyValue: '0%' },
      { label: 'Sodium', value: '10mg', dailyValue: '0%' },
      { label: 'Total Carbohydrate', value: '7g', dailyValue: '3%' },
      { label: 'Dietary Fiber', value: '2g', dailyValue: '7%' },
      { label: 'Total Sugars', value: '2g' },
      { label: 'Protein', value: '2g', dailyValue: '4%' },
      { label: 'Potassium', value: '304mg', dailyValue: '6%' },
      { label: 'Calcium', value: '2mg', dailyValue: '0%' },
      { label: 'Iron', value: '0.41mg', dailyValue: '2%' },
    ],
  },
  'roasted-mushroom-ready-to-eat': {
    basis: 'Nutritional information per 100g (approx.)',
    rows: [
      { label: 'Energy', value: '295.46 kcal' },
      { label: 'Protein', value: '9.78 g' },
      { label: 'Total Fat', value: '21.74 g' },
      { label: 'Saturated Fat', value: '2.39 g' },
      { label: 'Trans Fat', value: '0.011 g' },
      { label: 'Cholesterol', value: '<0.5 mg' },
      { label: 'Total Carbohydrates', value: '15.17 g' },
      { label: 'Total Sugar', value: '3.14 g' },
      { label: 'Added Sugar', value: '3.14 g' },
      { label: 'Sodium', value: '1073.67 mg' },
      { label: 'Moisture', value: '46.96 g' },
    ],
  },
  'dry-reishi-mushroom': {
    basis: 'Nutritional declaration per 100g',
    rows: [
      { label: 'Energy', value: '891 kJ / 220 kcal', dailyValue: '11% RI*' },
      { label: 'Fat', value: '0.9g', dailyValue: '1.3%' },
      { label: 'of which saturates', value: '0.2g', dailyValue: '1.0%' },
      { label: 'Carbohydrate', value: '3.4g', dailyValue: '1.3%' },
      { label: 'of which sugars', value: '1.8g', dailyValue: '2.0%' },
      { label: 'Fibre', value: '83g' },
      { label: 'Protein', value: '8.0g', dailyValue: '16%' },
      { label: 'Salt', value: '0g', dailyValue: '0%' },
      { label: 'Iron', value: '9.0mg', dailyValue: '64% NRV' },
    ],
  },
  'cordyceps-mushroom': {
    basis: 'Per 100g / per 2g serving',
    rows: [
      { label: 'Energy', value: '2089 kJ / 500 kcal (100g) · 42 kJ / 10 kcal (2g)', dailyValue: '<1%' },
      { label: 'Fat', value: '0g', dailyValue: '0%' },
      { label: 'of which saturates', value: '0g', dailyValue: '0%' },
      { label: 'Carbohydrate', value: '100g (100g) · 2g (2g)', dailyValue: '1%' },
      { label: 'of which sugars', value: '0g', dailyValue: '0%' },
      { label: 'Fibre', value: '50g (100g) · 1.0g (2g)' },
      { label: 'Protein', value: '50g (100g) · 1.0g (2g)', dailyValue: '2%' },
      { label: 'Salt', value: '0g', dailyValue: '0%' },
      { label: 'Vitamin B12', value: '0.75µg (2g)', dailyValue: '30%' },
      {
        label: 'Ingredients',
        value: 'Organic Cordyceps extract (Cordyceps militaris) with Vitamin B12',
      },
    ],
  },
  'dry-shiitake-mushroom': {
    basis: 'Nutritional facts',
    rows: [
      { label: 'Total Fat', value: '0.6g', dailyValue: '0%' },
      { label: 'Sodium', value: '10mg', dailyValue: '0%' },
      { label: 'Potassium', value: '290mg', dailyValue: '8%' },
      { label: 'Total Carbohydrate', value: '6.5g', dailyValue: '2%' },
      { label: 'Dietary Fiber', value: '2.5g', dailyValue: '10%' },
      { label: 'Sugars', value: '2.5g' },
      { label: 'Protein', value: '2g', dailyValue: '2%' },
      { label: 'Vitamin A', value: '0 mcg', dailyValue: '0%' },
      { label: 'Vitamin C', value: '0.3 mg', dailyValue: '0%' },
      { label: 'Calcium', value: '3 mg', dailyValue: '0%' },
      { label: 'Iron', value: '0.6 mg', dailyValue: '3%' },
      { label: 'Vitamin D', value: '18 IU', dailyValue: '4%' },
      { label: 'Vitamin B-6', value: '0.159 mg', dailyValue: '15%' },
      { label: 'Magnesium', value: '20 mg', dailyValue: '5%' },
      { label: 'Niacin', value: '4 mg', dailyValue: '10%' },
      { label: 'Pantothenic Acid', value: '1.5 mg', dailyValue: '15%' },
      { label: 'Riboflavin', value: '0.2 mg', dailyValue: '13%' },
      { label: 'Phosphorus', value: '112 mg', dailyValue: '11%' },
      { label: 'Selenium', value: '5.7 mcg', dailyValue: '8%' },
      { label: 'Copper', value: '0.1 mg', dailyValue: '7%' },
      { label: 'Zinc', value: '1 mg', dailyValue: '7%' },
    ],
  },
  'dry-oyster-mushroom': {
    specifications: [
      { label: 'Scientific name', value: 'Pleurotus ostreatus' },
      { label: 'Form', value: 'Naturally dried' },
      { label: 'Color', value: 'Light beige to medium brown' },
      { label: 'Moisture content', value: '< 10%' },
      { label: 'Shelf life', value: 'Stored in cool, dry place' },
      { label: 'Odor', value: 'Earthy, mild umami aroma' },
      { label: 'Storage', value: 'Airtight container recommended' },
      { label: 'Uses', value: 'Soups, gravies, stir-fry, tea' },
    ],
    basis: 'Nutritional chart per 100g',
    rows: [
      { label: 'Calories', value: '284 kcal', dailyValue: 'Energy source' },
      { label: 'Protein', value: '25–30 g', dailyValue: 'Muscle repair & immunity' },
      { label: 'Carbohydrates', value: '35–40 g', dailyValue: 'Energy production' },
      { label: 'Dietary Fiber', value: '10–15 g', dailyValue: 'Digestive health' },
      { label: 'Fat', value: '2–4 g', dailyValue: 'Heart & brain support' },
      { label: 'Vitamin B1', value: '0.4 mg', dailyValue: 'Nerve function' },
      { label: 'Riboflavin (B2)', value: '1.2 mg', dailyValue: 'Metabolism support' },
      { label: 'Niacin (B3)', value: '12.3 mg', dailyValue: 'Cholesterol & brain health' },
      { label: 'Vitamin D', value: '28 IU', dailyValue: 'Bone strength, immunity' },
      { label: 'Iron', value: '8–10 mg', dailyValue: 'Blood health' },
      { label: 'Potassium', value: '1,500 mg', dailyValue: 'Skin, healing, immunity' },
    ],
  },
  'mushroom-powder': {
    basis: 'Amount per serving',
    rows: [
      { label: 'Calories', value: '357' },
      { label: 'Total Fat', value: '2.68g', dailyValue: '4%' },
      { label: 'Saturated Fat', value: '0g', dailyValue: '0%' },
      { label: 'Trans Fat', value: '0g' },
      { label: 'Sodium', value: '0mg', dailyValue: '0%' },
      { label: 'Total Carbohydrate', value: '62.1g', dailyValue: '21%' },
      { label: 'Dietary Fiber', value: '0g', dailyValue: '0%' },
      { label: 'Sugars', value: '2.52g' },
      { label: 'Protein', value: '21.18g', dailyValue: '42%' },
    ],
  },
  'ready-to-eat-oyster': {
    basis: 'Per 100g (approx.)',
    rows: [
      { label: 'Protein', value: 'High' },
      { label: 'Preservatives', value: 'None' },
      { label: 'Preparation', value: 'Heat and serve — ready in 3 minutes' },
    ],
  },
};

export function enrichProduct(product: Product): Product {
  const meta = NUTRITION_BY_SLUG[product.slug];
  if (!meta) return product;
  return {
    ...product,
    nutrition_basis: meta.basis,
    nutrition: meta.rows.length > 0 ? meta.rows : undefined,
    specifications: meta.specifications,
  };
}
