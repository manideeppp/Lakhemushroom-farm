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
