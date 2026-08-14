import { useEffect, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Textarea } from '../../components/forms/Textarea';
import { Select } from '../../components/forms/Select';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import { listTraining, upsertTraining } from '../../lib/data';
import type { TrainingCourse, TrainingFormat } from '../../types/training';
import { newId } from '../../utils/ids';
import { formatINR } from '../../utils/format';

const FORMATS: TrainingFormat[] = ['online', 'offline', 'hybrid'];

const emptyCourse = (): TrainingCourse => ({
  id: newId(),
  slug: '',
  title: '',
  format: 'online',
  price: 0,
  duration: '4 weeks',
  image: '',
  short_description: '',
  description: '',
  features: [],
  outcomes: [],
  modules: [],
});

export function AdminTrainingPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<TrainingCourse[] | null>(null);
  const [editing, setEditing] = useState<TrainingCourse | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setCourses(await listTraining());
  }
  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.title || !editing.slug) {
      toast({ tone: 'warning', message: 'Title and slug are required.' });
      return;
    }
    try {
      setSaving(true);
      await upsertTraining(editing);
      toast({ tone: 'success', message: 'Training saved.' });
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

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
            Training
          </p>
          <h2 className="font-serif text-h1 text-ink-900 leading-tight">
            Training courses
          </h2>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setEditing(emptyCourse())}
        >
          New course
        </Button>
      </div>

      {!courses ? (
        <LoadingState />
      ) : courses.length === 0 ? (
        <Card padding="lg" className="text-center text-small text-ink-600">
          No courses yet.
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} padding="none" className="overflow-hidden">
              {c.image && (
                <img
                  src={c.image}
                  alt=""
                  className="h-32 w-full object-cover"
                />
              )}
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant={c.format === 'offline' ? 'offline' : 'online'}>
                    {c.format}
                  </Badge>
                  <span className="text-price font-semibold text-ink-900">
                    {formatINR(c.price)}
                  </span>
                </div>
                <h3 className="font-serif text-h3 text-ink-900 leading-tight">
                  {c.title}
                </h3>
                <p className="text-caption text-ink-500">
                  {c.modules?.length ?? 0} modules · {c.duration}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    setEditing({
                      ...c,
                      modules: [...(c.modules ?? [])],
                    })
                  }
                  leftIcon={<Pencil className="h-4 w-4" />}
                >
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.title ? `Edit — ${editing.title}` : 'New course'}
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
                label="Title"
                required
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
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
                label="Format"
                value={editing.format}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    format: e.target.value as TrainingFormat,
                  })
                }
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
              <Input
                label="Price (₹)"
                type="number"
                min={0}
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value) })
                }
              />
              <Input
                label="Duration"
                value={editing.duration}
                onChange={(e) =>
                  setEditing({ ...editing, duration: e.target.value })
                }
              />
            </div>
            <Input
              label="Image URL"
              value={editing.image}
              onChange={(e) => setEditing({ ...editing, image: e.target.value })}
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
            <Textarea
              label="Features (one per line)"
              rows={3}
              value={editing.features.join('\n')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  features: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
            <Textarea
              label="Outcomes (one per line)"
              rows={3}
              value={(editing.outcomes ?? []).join('\n')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  outcomes: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />

            {/* Modules */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-label font-medium text-ink-800">Modules</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      modules: [
                        ...(editing.modules ?? []),
                        {
                          id: newId(),
                          course_id: editing.id,
                          title: '',
                          description: '',
                          video_url: '',
                          duration_minutes: 15,
                          order: (editing.modules?.length ?? 0) + 1,
                        },
                      ],
                    })
                  }
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                >
                  Add module
                </Button>
              </div>
              <div className="mt-2 space-y-3">
                {(editing.modules ?? []).map((m, i) => (
                  <Card key={m.id} padding="md" className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
                      <Input
                        label={`Module ${i + 1} title`}
                        value={m.title}
                        onChange={(e) => {
                          const mods = [...(editing.modules ?? [])];
                          mods[i] = { ...m, title: e.target.value };
                          setEditing({ ...editing, modules: mods });
                        }}
                      />
                      <Input
                        label="Duration (min)"
                        type="number"
                        min={0}
                        value={m.duration_minutes ?? 0}
                        onChange={(e) => {
                          const mods = [...(editing.modules ?? [])];
                          mods[i] = {
                            ...m,
                            duration_minutes: Number(e.target.value),
                          };
                          setEditing({ ...editing, modules: mods });
                        }}
                      />
                    </div>
                    <Textarea
                      label="Description"
                      rows={2}
                      value={m.description ?? ''}
                      onChange={(e) => {
                        const mods = [...(editing.modules ?? [])];
                        mods[i] = { ...m, description: e.target.value };
                        setEditing({ ...editing, modules: mods });
                      }}
                    />
                    <Input
                      label="Video URL"
                      value={m.video_url ?? ''}
                      onChange={(e) => {
                        const mods = [...(editing.modules ?? [])];
                        mods[i] = { ...m, video_url: e.target.value };
                        setEditing({ ...editing, modules: mods });
                      }}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            modules: (editing.modules ?? []).filter(
                              (_, x) => x !== i
                            ),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
