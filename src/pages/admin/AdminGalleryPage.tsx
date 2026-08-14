import { useEffect, useState } from 'react';
import { Pencil, PlayCircle, Plus, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import {
  deleteGalleryItem,
  listGallery,
  upsertGalleryItem,
} from '../../lib/data';
import type { GalleryItem } from '../../types/profile';
import { newId } from '../../utils/ids';

const CATEGORIES: GalleryItem['category'][] = [
  'farm',
  'cultivation',
  'training',
  'team',
  'clients',
];

const empty = (): GalleryItem => ({
  id: newId(),
  type: 'image',
  category: 'farm',
  media_url: '',
  thumbnail_url: '',
  caption: '',
  order: 100,
});

export function AdminGalleryPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await listGallery());
  }
  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.media_url) {
      toast({ tone: 'warning', message: 'Media URL is required.' });
      return;
    }
    try {
      setSaving(true);
      await upsertGalleryItem(editing);
      toast({ tone: 'success', message: 'Saved.' });
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

  async function remove(it: GalleryItem) {
    if (!window.confirm('Delete this item?')) return;
    await deleteGalleryItem(it.id);
    toast({ tone: 'success', message: 'Deleted.' });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
            Gallery
          </p>
          <h2 className="font-serif text-h1 text-ink-900 leading-tight">
            Gallery items
          </h2>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setEditing(empty())}
        >
          Add item
        </Button>
      </div>

      {!items ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center text-small text-ink-600">
          No gallery items yet.
        </Card>
      ) : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <Card key={it.id} padding="none" className="overflow-hidden">
              <div className="relative">
                <img
                  src={it.thumbnail_url || it.media_url}
                  alt=""
                  className="h-40 w-full object-cover"
                />
                {it.type === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink-900/40">
                    <PlayCircle className="h-8 w-8 text-cream-50" />
                  </span>
                )}
                <div className="absolute left-2 top-2">
                  <Badge
                    variant={it.type === 'video' ? 'processing' : 'fresh'}
                  >
                    {it.category}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                {it.caption && (
                  <p className="line-clamp-2 text-small text-ink-800">
                    {it.caption}
                  </p>
                )}
                <div className="mt-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing({ ...it })}
                    leftIcon={<Pencil className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void remove(it)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.media_url ? 'Edit item' : 'New item'}
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
              <Select
                label="Type"
                value={editing.type}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    type: e.target.value as GalleryItem['type'],
                  })
                }
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </Select>
              <Select
                label="Category"
                value={editing.category}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value as GalleryItem['category'],
                  })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              label="Media URL"
              required
              value={editing.media_url}
              onChange={(e) =>
                setEditing({ ...editing, media_url: e.target.value })
              }
            />
            <Input
              label="Thumbnail URL (optional)"
              value={editing.thumbnail_url ?? ''}
              onChange={(e) =>
                setEditing({ ...editing, thumbnail_url: e.target.value })
              }
            />
            <Input
              label="Caption"
              value={editing.caption ?? ''}
              onChange={(e) =>
                setEditing({ ...editing, caption: e.target.value })
              }
            />
            <Input
              label="Order"
              type="number"
              min={0}
              value={editing.order}
              onChange={(e) =>
                setEditing({ ...editing, order: Number(e.target.value) })
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
