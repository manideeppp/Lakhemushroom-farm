export function generateOrderRef(seed?: number): string {
  const n = seed ?? Math.floor(100 + Math.random() * 900);
  return `LMF-${String(n).padStart(5, '0')}`;
}

export function generateBookingRef(seed?: number): string {
  const n = seed ?? Math.floor(100 + Math.random() * 900);
  return `BKG-${String(n).padStart(5, '0')}`;
}

export function newId(): string {
  return (
    crypto.randomUUID?.() ??
    `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
  );
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
