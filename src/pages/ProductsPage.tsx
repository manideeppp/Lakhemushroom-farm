import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveGrid } from '../components/layout/Layout';
import { ProductCard } from '../components/cards/Cards';
import { Input } from '../components/forms/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/feedback/States';
import { SkeletonCard } from '../components/ui/Skeleton';
import { listProducts } from '../lib/data';
import type { Product, ProductCategory } from '../types/product';
import type { BadgeVariant } from '../components/ui/Badge';
import { cn } from '../utils/cn';

const CATEGORIES: { key: 'all' | ProductCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fresh', label: 'Fresh' },
  { key: 'dry', label: 'Dry' },
  { key: 'powder', label: 'Powder' },
  { key: 'spawn', label: 'Spawn' },
  { key: 'ready-to-eat', label: 'Ready to Eat' },
];

export function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]['key']>('all');
  const navigate = useNavigate();

  useEffect(() => {
    void listProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    if (!products) return null;
    return products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (q && !`${p.name} ${p.short_description}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [products, q, cat]);

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <SectionHeader
            eyebrow="Shop"
            title="Our Products"
            description="Freshly harvested mushrooms, wellness powders and ready-to-eat packs — all made on our farm. Tap any product for full details, specifications and nutritional values."
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Search products…"
              leftIcon={<Search className="h-4 w-4" />}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              containerClassName="flex-1"
            />
            <Button
              variant="outline"
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              onClick={() => setCat('all')}
            >
              Reset
            </Button>
          </div>
          <div className="mt-4 -mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCat(c.key)}
                className={cn(
                  'shrink-0 rounded-pill border px-3 h-9 text-small font-medium transition',
                  cat === c.key
                    ? 'bg-brand text-cream-50 border-brand'
                    : 'bg-surface-raised text-ink-700 border-ink-200 hover:border-forest-300'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Section>

        <Section size="sm">
          {!filtered ? (
            <ResponsiveGrid cols={{ base: 2, md: 3, lg: 4 }} gap="md">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </ResponsiveGrid>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No products match"
              message="Try clearing the search or picking a different category."
              action={
                <Button
                  onClick={() => {
                    setQ('');
                    setCat('all');
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          ) : (
            <ResponsiveGrid cols={{ base: 2, md: 3, lg: 4 }} gap="md">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  unit={p.unit}
                  shortDescription={p.short_description}
                  image={p.images[0]}
                  badges={p.badges.slice(0, 2) as BadgeVariant[]}
                  inStock={p.stock > 0}
                  onClick={() => navigate(`/products/${p.slug}`)}
                />
              ))}
            </ResponsiveGrid>
          )}
        </Section>
      </PageContainer>
    </AppShell>
  );
}
