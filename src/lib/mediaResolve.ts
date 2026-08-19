import type { Product } from '../types/product';
import type { TrainingCourse } from '../types/training';
import { enrichProduct } from '../data/productNutrition';
import { SAMPLE_PRODUCTS } from '../data/products';
import { SAMPLE_TRAINING } from '../data/training';
import { productImages, trainingImages } from '../data/media';

const PRODUCT_IMAGE_BY_SLUG: Record<string, string> = {
  'oyster-mushroom-spawn': productImages.oysterSpawn,
  'fresh-oyster-mushroom': productImages.freshOyster,
  'dry-oyster-mushroom': productImages.dryOyster,
  'mushroom-powder': productImages.mushroomPowder,
  'ready-to-eat-oyster': productImages.readyToEat,
  'fresh-milkey-mushroom': productImages.freshMilkey,
  'dry-reishi-mushroom': productImages.dryReishi,
  'dry-shiitake-mushroom': productImages.dryShiitake,
  'lions-mane-mushroom': productImages.lionsMane,
  'roasted-mushroom-ready-to-eat': productImages.roastedMushroom,
  'cordyceps-mushroom': productImages.cordyceps,
  'button-mushroom': productImages.buttonMushroom,
};

const TRAINING_IMAGE_BY_SLUG: Record<string, string> = {
  'online-training': trainingImages.online,
  'offline-training': trainingImages.offline,
  'a-z-mushroom-farming-online': trainingImages.online,
  'weekend-farm-immersion': trainingImages.offline,
  'advanced-cultivation-bootcamp': trainingImages.offline,
  'complete-farm-setup': trainingImages.farmSetup,
};

export function withProductImages(product: Product): Product {
  const local = PRODUCT_IMAGE_BY_SLUG[product.slug];
  const withImg = local ? { ...product, images: [local] } : product;
  return enrichProduct(withImg);
}

export function withTrainingImage(course: TrainingCourse): TrainingCourse {
  const local = TRAINING_IMAGE_BY_SLUG[course.slug];
  if (!local) return course;
  return { ...course, image: local };
}

export function mergeSampleProducts(remote: Product[]): Product[] {
  const enrichedRemote = remote.map(withProductImages);
  const missingSamples = SAMPLE_PRODUCTS.filter(
    (p) => !enrichedRemote.some((r) => r.slug === p.slug)
  ).map(withProductImages);

  if (enrichedRemote.length === 0) {
    return SAMPLE_PRODUCTS.map(withProductImages);
  }

  return [...enrichedRemote, ...missingSamples];
}

export function mergeSampleTraining(remote: TrainingCourse[]): TrainingCourse[] {
  const enrichedRemote = remote.map(withTrainingImage);
  const missingSamples = SAMPLE_TRAINING.filter(
    (t) => !enrichedRemote.some((r) => r.slug === t.slug)
  ).map(withTrainingImage);

  if (enrichedRemote.length === 0) {
    return SAMPLE_TRAINING.map(withTrainingImage);
  }

  return [...enrichedRemote, ...missingSamples];
}
