import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Textarea } from '../../components/forms/Textarea';
import { Select } from '../../components/forms/Select';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import { deleteProduct, listProducts, upsertProduct } from '../../lib/data';
import type { Product, ProductCategory } from '../../types/product';
import { newId } from '../../utils/ids';
import { formatINR } from '../../utils/format';

const CATEGORIES: ProductCategory[] = [
  'fresh',
  'dry',
  'powder',
  'spawn',
  'ready-to-eat',
];

const emptyProduct = (): Product => ({
  id: newId(),
  slug: '',
  name: '',
  category: 'fresh',
  short_description: '',
  description: '',
  price: 0,
  unit: 'per pack',
  images: [''],
  badges: [],
  stock: 10,
  rating: 4.8,
  highlights: [],
});

export function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setProducts(await listProducts());
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.slug || editing.price <= 0) {
      toast({
        tone: 'warning',
        message: 'Name, slug and a valid price are required.',
      });
      return;
    }
    try {
      setSaving(true);
      await upsertProduct({
        ...editing,
        images: editing.images.filter(Boolean),
      });
      toast({ tone: 'success', message: 'Product saved.' });
      setEditing(null);
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not save.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Product) {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    try {
      await deleteProduct(p.id);
      toast({ tone: 'success', message: 'Product deleted.' });
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not delete.',
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
            Products
          </p>
          <h2 className="font-serif text-h1 text-ink-900 leading-tight">
            Product catalogue
          </h2>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setEditing(emptyProduct())}
        >
          New product
        </Button>
      </div>

      {!products ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <Card padding="lg" className="text-center text-small text-ink-600">
          No products yet. Create your first one.
        </Card>
      ) : (
        <Card padding="none" className="overflow-x-auto">
          <table className="w-full text-small">
            <thead className="bg-cream-100 text-ink-700">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Product</th>
                <th className="px-3 py-2 text-left font-medium">Category</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">Stock</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-forest-50">
                        {p.images[0] && (
                          <img
                            src={p.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <div>
                        <p className="font-medium text-ink-900">{p.name}</p>
                        <p className="text-caption text-ink-500 font-mono">
                          {p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="fresh">{p.category}</Badge>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatINR(p.price)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={
                        p.stock === 0
                          ? 'text-danger font-medium'
                          : 'text-ink-800'
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Edit"
                        onClick={() => setEditing({ ...p })}
                        leftIcon={<Pencil className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Delete"
                        onClick={() => void remove(p)}
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.name ? `Edit — ${editing.name}` : 'New product'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={save}>
              Save
            </Button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Name"
                required
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
              <Input
                label="Slug"
                required
                value={editing.slug}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    slug: e.target.value.replace(/\s+/g, '-').toLowerCase(),
                  })
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Select
                label="Category"
                value={editing.category}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value as ProductCategory,
                  })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <Input
                label="Price (₹)"
                type="number"
                min={0}
                value={editing.price}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    price: Number(e.target.value),
                  })
                }
              />
              <Input
                label="Stock"
                type="number"
                min={0}
                value={editing.stock}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    stock: Number(e.target.value),
                  })
                }
              />
            </div>
            <Input
              label="Unit label (e.g. per 200g)"
              value={editing.unit ?? ''}
              onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
            />
            <Textarea
              label="Short description"
              rows={2}
              value={editing.short_description}
              onChange={(e) =>
                setEditing({ ...editing, short_description: e.target.value })
              }
            />
            <Textarea
              label="Full description"
              rows={4}
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
            <div>
              <p className="mb-1.5 text-label font-medium text-ink-800">
                Images (URLs)
              </p>
              {editing.images.map((img, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Input
                    placeholder="https://…"
                    value={img}
                    onChange={(e) => {
                      const imgs = [...editing.images];
                      imgs[i] = e.target.value;
                      setEditing({ ...editing, images: imgs });
                    }}
                    containerClassName="flex-1"
                  />
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        images: editing.images.filter((_, x) => x !== i),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setEditing({ ...editing, images: [...editing.images, ''] })
                }
              >
                Add image
              </Button>
            </div>
            <Input
              label="Badges (comma separated, e.g. fresh, best-seller)"
              value={editing.badges.join(', ')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  badges: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
            <Textarea
              label="Highlights (one per line)"
              rows={3}
              value={(editing.highlights ?? []).join('\n')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  highlights: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
