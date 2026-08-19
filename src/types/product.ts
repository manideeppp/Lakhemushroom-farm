export interface NutritionRow {
  label: string;
  value: string;
  dailyValue?: string;
}

export type ProductCategory =
  | 'spawn'
  | 'fresh'
  | 'dry'
  | 'powder'
  | 'ready-to-eat';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  short_description: string;
  description: string;
  price: number;
  unit?: string;
  images: string[];
  badges: string[];
  stock: number;
  rating?: number;
  highlights?: string[];
  nutrition_basis?: string;
  nutrition?: NutritionRow[];
  created_at?: string;
}
