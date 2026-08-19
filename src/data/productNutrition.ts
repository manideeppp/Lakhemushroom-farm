import type { NutritionRow, Product } from '../types/product';

/** Nutrition & specs from Lakhe product specification sheets (not stored in Supabase). */
const NUTRITION_BY_SLUG: Record<
  string,
  { basis?: string; rows: NutritionRow[] }
> = {
  'lions-mane-mushroom': {
    basis: 'Per serving',
    rows: [
      { label: 'Calories', value: '35' },
      { label: 'Total Fat', value: '0g', dailyValue: '0%' },
      { label: 'Saturated / Trans Fat', value: '0g', dailyValue: '0%' },
      { label: 'Total Carbohydrates', value: '7g', dailyValue: '3%' },
      { label: 'Dietary Fiber', value: '2g', dailyValue: '7%' },
      { label: 'Sugars', value: '2g' },
      { label: 'Protein', value: '2g', dailyValue: '4%' },
      { label: 'Cholesterol', value: '0mg', dailyValue: '0%' },
      { label: 'Sodium', value: '10mg', dailyValue: '0%' },
      { label: 'Potassium', value: '304mg', dailyValue: '6%' },
      { label: 'Calcium', value: '2mg', dailyValue: '0%' },
      { label: 'Iron', value: '0.41mg', dailyValue: '2%' },
    ],
  },
  'fresh-milkey-mushroom': {
    basis: 'Per 100g',
    rows: [
      { label: 'Energy', value: '113 kJ (27 kcal)' },
      { label: 'Carbohydrates', value: '4.1g' },
      { label: 'Fat', value: '0.1g' },
      { label: 'Protein', value: '2.5g' },
      { label: 'Thiamine (B1)', value: '', dailyValue: '9%' },
      { label: 'Riboflavin (B2)', value: '', dailyValue: '42%' },
      { label: 'Niacin (B3)', value: '', dailyValue: '28%' },
      { label: 'Pantothenic acid (B5)', value: '', dailyValue: '30%' },
      { label: 'Vitamin C', value: '', dailyValue: '0%' },
      { label: 'Calcium', value: '', dailyValue: '2%' },
      { label: 'Phosphorus', value: '', dailyValue: '17%' },
      { label: 'Potassium', value: '', dailyValue: '10%' },
      { label: 'Sodium', value: '', dailyValue: '0%' },
      { label: 'Zinc', value: '', dailyValue: '12%' },
    ],
  },
  'button-mushroom': {
    basis: 'Per 100g',
    rows: [
      { label: 'Energy', value: '113 kJ (27 kcal)' },
      { label: 'Carbohydrates', value: '4.1g' },
      { label: 'Fat', value: '0.1g' },
      { label: 'Protein', value: '2.5g' },
      { label: 'Thiamine (B1)', value: '', dailyValue: '9%' },
      { label: 'Riboflavin (B2)', value: '', dailyValue: '42%' },
      { label: 'Niacin (B3)', value: '', dailyValue: '28%' },
      { label: 'Pantothenic acid (B5)', value: '', dailyValue: '30%' },
      { label: 'Vitamin C', value: '', dailyValue: '0%' },
      { label: 'Calcium', value: '', dailyValue: '2%' },
      { label: 'Phosphorus', value: '', dailyValue: '17%' },
      { label: 'Potassium', value: '', dailyValue: '10%' },
      { label: 'Sodium', value: '', dailyValue: '0%' },
      { label: 'Zinc', value: '', dailyValue: '12%' },
    ],
  },
  'roasted-mushroom-ready-to-eat': {
    basis: 'Per 100g (approx.)',
    rows: [
      { label: 'Energy', value: '295.46 kcal' },
      { label: 'Protein', value: '9.78g' },
      { label: 'Total Fat', value: '21.74g' },
      { label: 'Saturated Fat', value: '2.39g' },
      { label: 'Trans Fat', value: '0.011g' },
      { label: 'Cholesterol', value: '<0.5mg' },
      { label: 'Total Carbohydrates', value: '15.17g' },
      { label: 'Total / Added Sugar', value: '3.14g' },
      { label: 'Sodium', value: '1073.67mg' },
      { label: 'Moisture', value: '46.96g' },
    ],
  },
  'dry-reishi-mushroom': {
    basis: 'Per 100g',
    rows: [
      { label: 'Energy', value: '891 kJ / 220 kcal', dailyValue: '11% RI*' },
      { label: 'Fat', value: '0.9g', dailyValue: '1.3%' },
      { label: 'Saturated Fat', value: '0.2g', dailyValue: '1.0%' },
      { label: 'Carbohydrate', value: '3.4g', dailyValue: '1.3%' },
      { label: 'Sugars', value: '1.6g', dailyValue: '2.0%' },
      { label: 'Fibre', value: '83g' },
      { label: 'Protein', value: '8.0g', dailyValue: '16%' },
      { label: 'Salt', value: '0g', dailyValue: '0%' },
      { label: 'Iron', value: '9.0mg', dailyValue: '64%' },
    ],
  },
  'cordyceps-mushroom': {
    basis: 'Per 2g serving',
    rows: [
      { label: 'Energy', value: '4.2 kJ / 1.0 kcal', dailyValue: '<1%' },
      { label: 'Fat', value: '0g', dailyValue: '0%' },
      { label: 'Carbohydrate', value: '2g', dailyValue: '1%' },
      { label: 'Fibre', value: '1.0g' },
      { label: 'Protein', value: '1.0g', dailyValue: '2%' },
      { label: 'Salt', value: '0g', dailyValue: '0%' },
      { label: 'Vitamin B12', value: '0.75µg', dailyValue: '30%' },
    ],
  },
  'dry-shiitake-mushroom': {
    basis: 'Per serving',
    rows: [
      { label: 'Total Fat', value: '0.6g', dailyValue: '0%' },
      { label: 'Sodium', value: '10mg', dailyValue: '0%' },
      { label: 'Potassium', value: '2380mg', dailyValue: '68%' },
      { label: 'Total Carbohydrate', value: '45g', dailyValue: '15%' },
      { label: 'Dietary Fiber', value: '2.5g', dailyValue: '10%' },
      { label: 'Sugars', value: '2.5g' },
      { label: 'Protein', value: '2g', dailyValue: '4%' },
      { label: 'Niacin', value: '', dailyValue: '20%' },
      { label: 'Pantothenic Acid', value: '', dailyValue: '15%' },
      { label: 'Riboflavin', value: '', dailyValue: '12%' },
      { label: 'Thiamine', value: '', dailyValue: '12%' },
      { label: 'Phosphorus', value: '', dailyValue: '11%' },
    ],
  },
  'dry-oyster-mushroom': {
    basis: 'Per 100g (approx.)',
    rows: [
      { label: 'Energy', value: '290 kcal' },
      { label: 'Protein', value: '15–20g' },
      { label: 'Dietary Fiber', value: '15–20g' },
      { label: 'Moisture', value: '<12%' },
      { label: 'Colour', value: 'Light beige to tan' },
    ],
  },
  'mushroom-powder': {
    basis: 'Per serving (approx.)',
    rows: [
      { label: 'Calories', value: '357' },
      { label: 'Carbohydrates', value: '62.1g', dailyValue: '21%' },
      { label: 'Protein', value: '21.18g', dailyValue: '42%' },
      { label: 'Total Fat', value: '2.68g', dailyValue: '4%' },
    ],
  },
};

export function enrichProduct(product: Product): Product {
  const meta = NUTRITION_BY_SLUG[product.slug];
  if (!meta) return product;
  return {
    ...product,
    nutrition_basis: meta.basis,
    nutrition: meta.rows,
  };
}
