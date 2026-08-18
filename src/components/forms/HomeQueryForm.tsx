import { useState, useEffect } from 'react';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Button } from '../ui/Button';
import { useToast } from '../feedback/ToastProvider';
import { createQuery } from '../../lib/data';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errors';

export function HomeQueryForm() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: profile?.full_name ?? '',
    email: user?.email ?? '',
    phone: profile?.phone ?? '',
    subject: 'Home page enquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: profile?.full_name ?? f.name,
      email: user?.email ?? f.email,
      phone: profile?.phone ?? f.phone,
    }));
  }, [user?.email, profile?.full_name, profile?.phone]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({
        tone: 'warning',
        message: 'Name, email and message are required.',
      });
      return;
    }
    try {
      setSubmitting(true);
      await createQuery({
        user_id: user?.id ?? null,
        ...form,
      });
      toast({
        tone: 'success',
        title: 'Query sent',
        message: 'Thanks — we’ll get back to you soon.',
      });
      setForm((f) => ({ ...f, message: '' }));
    } catch (err) {
      toast({
        tone: 'danger',
        message: getErrorMessage(err, 'Could not send. Try again.'),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <Input
        label="Phone (optional)"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Textarea
        label="Your question"
        required
        rows={4}
        placeholder="Products, training, orders — ask us anything."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <Button type="submit" size="lg" fullWidth loading={submitting}>
        Send query
      </Button>
    </form>
  );
}
