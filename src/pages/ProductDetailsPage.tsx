import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { Button } from '../components/ui/Button';
import { Badge, type BadgeVariant } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { LoadingState } from '../components/feedback/States';
import { formatINR } from '../utils/format';
import { getProductBySlug } from '../lib/data';
import type { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/feedback/ToastProvider';
import { ProductNutritionPanel } from '../components/products/ProductNutritionPanel';
import { useCartAddedFromNavigation } from '../hooks/useCartAddedFromNavigation';

export function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const { addItem, announceRecentAdd } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useCartAddedFromNavigation(announceRecentAdd);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoading(true);
      const p = await getProductBySlug(slug);
      setProduct(p);
      setLoading(false);
    })();
  }, [slug]);

  if (loading)
    return (
      <AppShell>
        <LoadingState message="Loading product…" />
      </AppShell>
    );
  if (!product)
    return (
      <AppShell>
        <PageContainer className="py-14 text-center">
          <p className="text-body text-ink-700">Product not found.</p>
          <Link to="/products" className="mt-3 inline-block">
            <Button variant="outline">Back to products</Button>
          </Link>
        </PageContainer>
      </AppShell>
    );

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="flex flex-col gap-3">
              <ResponsiveImage
                src={product.images[imgIdx] ?? product.images[0]}
                alt={product.name}
                aspect="aspect-square"
                rounded="lg"
                fit="contain"
                containerClassName="bg-cream-50"
              />
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setImgIdx(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border ${
                        i === imgIdx
                          ? 'border-brand'
                          : 'border-ink-200 hover:border-forest-300'
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {product.badges.map((b) => (
                  <Badge key={b} variant={b as BadgeVariant} />
                ))}
              </div>
              <h1 className="font-serif text-display text-ink-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-small text-ink-600">
                <span className="flex items-center gap-0.5 text-warning">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-ink-800 font-medium">
                    {product.rating ?? 4.8}
                  </span>
                </span>
                <span>·</span>
                <span>{product.unit ?? 'per pack'}</span>
                <span>·</span>
                <span
                  className={
                    product.stock > 0 ? 'text-forest-700' : 'text-danger'
                  }
                >
                  {product.stock > 0 ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <p className="text-body text-ink-700 leading-relaxed">
                {product.description}
              </p>

              {product.highlights && (
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-small text-ink-700">
                      <Check className="h-4 w-4 mt-0.5 text-success shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {product.nutrition && product.nutrition.length > 0 && (
                <div className="mt-6">
                  <ProductNutritionPanel
                    basis={product.nutrition_basis}
                    rows={product.nutrition}
                  />
                </div>
              )}

              <div className="mt-4 flex items-end justify-between border-t border-ink-100 pt-4">
                <div>
                  <p className="text-caption text-ink-500">Price</p>
                  <p className="text-h1 font-serif text-ink-900">
                    {formatINR(product.price)}
                  </p>
                </div>
                <div className="flex items-center rounded-md border border-ink-200">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 text-ink-700 hover:bg-forest-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 mx-auto" />
                  </button>
                  <span className="w-10 text-center text-body font-medium">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-10 w-10 text-ink-700 hover:bg-forest-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="lg"
                  fullWidth
                  leftIcon={<ShoppingCart className="h-4 w-4" />}
                  disabled={product.stock <= 0}
                  onClick={() => {
                    addItem(
                      {
                        id: product.id,
                        type: 'product',
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        slug: product.slug,
                        unit: product.unit,
                      },
                      qty
                    );
                    toast({
                      tone: 'success',
                      title: 'Added to cart',
                      message: `${product.name} × ${qty}`,
                    });
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    addItem(
                      {
                        id: product.id,
                        type: 'product',
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        slug: product.slug,
                        unit: product.unit,
                      },
                      qty
                    );
                    navigate('/cart');
                  }}
                >
                  Buy now
                </Button>
              </div>

              <Card padding="md" className="mt-4 bg-cream-100 border-cream-200">
                <p className="text-small text-ink-700">
                  Careful packaging · Track from “Processing” to “Delivered” in
                  your account. Have a question about this product?{' '}
                  <Link to="/contact" className="text-brand underline">
                    Contact us
                  </Link>
                  .
                </p>
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
