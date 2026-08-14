// Shared UI-level types used across reusable components.
// Business/data types will live alongside their features later.

export type Size = 'sm' | 'md' | 'lg';

export type Tone =
  | 'brand'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'gold';

export interface WithClassName {
  className?: string;
}
