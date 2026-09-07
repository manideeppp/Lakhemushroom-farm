import type { Product } from '../types/product';

/** Featured product display order on shop & home. */
export const FEATURED_PRODUCT_SLUGS = [
  'fresh-oyster-mushroom',
  'oyster-mushroom-spawn',
  'fresh-milkey-mushroom',
  'ready-to-eat-oyster',
  'fresh-button-mushroom',
  'mushroom-powder',
  'dry-oxygen-mushroom',
  'dry-oyster-mushroom',
] as const;

export function sortProductsByDisplayOrder(products: Product[]): Product[] {
  const rank = (slug: string) => {
    const i = FEATURED_PRODUCT_SLUGS.indexOf(
      slug as (typeof FEATURED_PRODUCT_SLUGS)[number]
    );
    return i === -1 ? 1000 : i;
  };
  return [...products].sort((a, b) => {
    const byRank = rank(a.slug) - rank(b.slug);
    if (byRank !== 0) return byRank;
    return a.name.localeCompare(b.name);
  });
}
