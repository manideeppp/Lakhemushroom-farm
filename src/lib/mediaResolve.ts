import type { Product } from '../types/product';
import type { TrainingCourse } from '../types/training';
import { productImages, trainingImages } from '../data/media';

/** Map product slug → bundled asset URL (works in dev and on Vercel). */
const PRODUCT_IMAGE_BY_SLUG: Record<string, string> = {
  'oyster-mushroom-spawn': productImages.oysterSpawn,
  'fresh-oyster-mushroom': productImages.freshOyster,
  'dry-oyster-mushroom': productImages.dryOyster,
  'mushroom-powder': productImages.mushroomPowder,
  'ready-to-eat-oyster': productImages.readyToEat,
};

/** Map training slug → bundled asset URL (includes legacy Supabase seed slugs). */
const TRAINING_IMAGE_BY_SLUG: Record<string, string> = {
  'online-training': trainingImages.online,
  'offline-training': trainingImages.offline,
  'a-z-mushroom-farming-online': trainingImages.online,
  'weekend-farm-immersion': trainingImages.offline,
  'advanced-cultivation-bootcamp': trainingImages.offline,
};

/**
 * Prefer bundled catalog images over remote URLs stored in Supabase / localStorage.
 * External URLs (e.g. Unsplash) often fail in production or on slow networks.
 */
export function withProductImages(product: Product): Product {
  const local = PRODUCT_IMAGE_BY_SLUG[product.slug];
  if (!local) return product;
  return { ...product, images: [local] };
}

export function withTrainingImage(course: TrainingCourse): TrainingCourse {
  const local = TRAINING_IMAGE_BY_SLUG[course.slug];
  if (!local) return course;
  return { ...course, image: local };
}

export function mergeSampleProducts(remote: Product[]): Product[] {
  if (remote.length === 0) return remote;
  return remote.map(withProductImages);
}

export function mergeSampleTraining(remote: TrainingCourse[]): TrainingCourse[] {
  if (remote.length === 0) return remote;
  return remote.map(withTrainingImage);
}
