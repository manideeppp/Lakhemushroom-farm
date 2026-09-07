/**
 * INR currency formatter — used across product cards, cart, order totals.
 */
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(value: number): string {
  return formatter.format(value);
}

/** e.g. unit "per kg" → "per kg"; "500g pack" → "500g pack" */
export function productUnitLabel(unit?: string): string | undefined {
  const trimmed = unit?.trim();
  return trimmed || undefined;
}
