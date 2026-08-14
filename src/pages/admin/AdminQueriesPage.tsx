import { useEffect, useMemo, useState } from 'react';
import { MailQuestion, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Textarea } from '../../components/forms/Textarea';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import { listQueries, updateQueryStatus } from '../../lib/data';
import type { CustomerQuery, QueryStatus } from '../../types/booking';
import { formatDateTime } from '../../utils/ids';
import { cn } from '../../utils/cn';

const TABS: { key: 'all' | QueryStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'closed', label: 'Closed' },
];

export function AdminQueriesPage() {
  const { toast } = useToast();
  const [queries, setQueries] = useState<CustomerQuery[] | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<CustomerQuery | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setQueries(await listQueries());
  }
  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!queries) return null;
    return queries.filter((qy) => {
      if (tab !== 'all' && qy.status !== tab) return false;
      if (
        q &&
        !`${qy.name} ${qy.email} ${qy.subject ?? ''} ${qy.message}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [queries, tab, q]);

  async function update(status: QueryStatus) {
    if (!editing) return;
    try {
      setSaving(true);
      await updateQueryStatus(editing.id, status, notes);
      toast({ tone: 'success', message: 'Query updated.' });
      setEditing(null);
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not update.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
          Queries
        </p>
        <h2 className="font-serif text-h1 text-ink-900 leading-tight">
          Customer queries
        </h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search…"
          leftIcon={<Search className="h-4 w-4" />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          containerClassName="flex-1"
        />
      </div>

      <div className="-mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'shrink-0 rounded-pill border px-3 h-9 text-small font-medium transition',
              tab === t.key
                ? 'bg-brand text-cream-50 border-brand'
                : 'bg-surface-raised text-ink-700 border-ink-200 hover:border-forest-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!filtered ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <Card padding="lg" className="text-center text-small text-ink-600">
          No queries match.
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((qy) => (
            <Card
              key={qy.id}
              padding="md"
              interactive
              onClick={() => {
                setEditing(qy);
                setNotes(qy.admin_notes ?? '');
              }}
              className="flex items-start gap-3"
            >
              <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                <MailQuestion className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-serif text-body font-semibold text-ink-900">
                    {qy.name}
                  </span>
                  <Badge
                    variant={
                      qy.status === 'closed'
                        ? 'approved'
                        : qy.status === 'in_progress'
                          ? 'processing'
                          : 'pending'
                    }
                  >
                    {qy.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-caption text-ink-500 mt-0.5">
                  {qy.email}
                  {qy.phone ? ` · ${qy.phone}` : ''} ·{' '}
                  {formatDateTime(qy.created_at)}
                </p>
                <p className="mt-1 text-small text-ink-800 font-medium">
                  {qy.subject || '(no subject)'}
                </p>
                <p className="mt-0.5 text-small text-ink-700 line-clamp-2">
                  {qy.message}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.subject || 'Query'}
        description={editing ? `${editing.name} · ${editing.email}` : undefined}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Close
            </Button>
            <Button
              variant="outline"
              loading={saving}
              onClick={() => void update('in_progress')}
            >
              Mark in progress
            </Button>
            <Button loading={saving} onClick={() => void update('closed')}>
              Mark closed
            </Button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-3 text-small">
            <div className="rounded-md bg-cream-100 border border-cream-200 p-3 text-ink-800 whitespace-pre-wrap">
              {editing.message}
            </div>
            {editing.phone && (
              <p className="text-ink-700">Phone: {editing.phone}</p>
            )}
            <Textarea
              label="Internal admin notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
