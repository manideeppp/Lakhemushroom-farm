import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Textarea } from '../../components/forms/Textarea';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import { listAllBookings, updateBookingStatus } from '../../lib/data';
import type { BookingStatus, OfflineBooking } from '../../types/booking';
import { formatDate, formatDateTime } from '../../utils/ids';
import { cn } from '../../utils/cn';

const TABS: { key: 'all' | BookingStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function AdminBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<OfflineBooking[] | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<OfflineBooking | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

  async function load() {
    setBookings(await listAllBookings());
  }
  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!bookings) return null;
    return bookings.filter((b) => {
      if (tab !== 'all' && b.status !== tab) return false;
      if (
        q &&
        !`${b.booking_ref} ${b.name} ${b.email ?? ''} ${b.phone}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [bookings, tab, q]);

  async function updateStatus(next: BookingStatus) {
    if (!editing) return;
    try {
      setSaving(true);
      await updateBookingStatus(editing.id, next, notes);
      toast({ tone: 'success', message: `Booking ${next}.` });
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
          Bookings
        </p>
        <h2 className="font-serif text-h1 text-ink-900 leading-tight">
          Offline training bookings
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
          No bookings match.
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card
              key={b.id}
              padding="md"
              interactive
              onClick={() => {
                setEditing(b);
                setNotes(b.admin_notes ?? '');
              }}
              className="flex items-start gap-3"
            >
              <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                <CalendarClock className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-serif text-body font-semibold text-ink-900">
                    {b.course_title}
                  </span>
                  <Badge
                    variant={
                      b.status === 'confirmed'
                        ? 'approved'
                        : b.status === 'pending'
                          ? 'pending'
                          : 'neutral'
                    }
                  >
                    {b.status}
                  </Badge>
                </div>
                <p className="text-caption text-ink-500 mt-0.5">
                  Ref {b.booking_ref} · Preferred {formatDate(b.preferred_date)}{' '}
                  · Placed {formatDateTime(b.created_at)}
                </p>
                <p className="mt-1 text-small text-ink-700">
                  {b.name} · {b.phone}
                  {b.email ? ` · ${b.email}` : ''}
                </p>
                {b.notes && (
                  <p className="mt-1 text-small text-ink-600 italic">
                    “{b.notes}”
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Booking · ${editing.booking_ref}` : 'Booking'}
        description={editing?.course_title}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Close
            </Button>
            <Button
              variant="danger"
              loading={saving}
              onClick={() => void updateStatus('rejected')}
            >
              Reject
            </Button>
            <Button
              loading={saving}
              onClick={() => void updateStatus('confirmed')}
            >
              Confirm
            </Button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-3 text-small">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-caption text-ink-500">Name</p>
                <p className="text-ink-900 font-medium">{editing.name}</p>
              </div>
              <div>
                <p className="text-caption text-ink-500">Phone</p>
                <p className="text-ink-900">{editing.phone}</p>
              </div>
              {editing.email && (
                <div className="sm:col-span-2">
                  <p className="text-caption text-ink-500">Email</p>
                  <p className="text-ink-900">{editing.email}</p>
                </div>
              )}
              <div>
                <p className="text-caption text-ink-500">Preferred date</p>
                <p className="text-ink-900">
                  {formatDate(editing.preferred_date)}
                </p>
              </div>
              <div>
                <p className="text-caption text-ink-500">Placed</p>
                <p className="text-ink-900">
                  {formatDateTime(editing.created_at)}
                </p>
              </div>
            </div>
            {editing.notes && (
              <div>
                <p className="text-caption text-ink-500">Customer notes</p>
                <p className="text-ink-700">{editing.notes}</p>
              </div>
            )}
            <Textarea
              label="Admin notes (visible to customer)"
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
