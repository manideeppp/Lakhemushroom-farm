/**
 * Lakhe Design Tokens
 * -------------------
 * Single source of truth for design decisions. These tokens mirror
 * the values configured in `tailwind.config.js`. Use them in TypeScript
 * when a value cannot be expressed via a Tailwind class (e.g. computed
 * inline styles, canvas rendering, animation config).
 *
 * NEVER hard-code hex/px values in components — reference tokens here.
 */

export const colors = {
  brand: {
    DEFAULT: '#2f5232',
    soft: '#4a7d4d',
    deep: '#274229',
  },
  forest: {
    50: '#f2f7f2',
    100: '#e0ece0',
    500: '#4a7d4d',
    700: '#2f5232',
    900: '#1e3520',
  },
  cream: {
    50: '#fdfcf7',
    100: '#faf7ed',
    200: '#f4eeda',
  },
  gold: {
    400: '#c7a13a',
    500: '#a8842a',
  },
  ink: {
    500: '#575753',
    700: '#2e2e2b',
    900: '#161615',
  },
  status: {
    success: '#3e7b4a',
    warning: '#c7a13a',
    danger: '#a8382e',
    info: '#4a6b7d',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  base: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const radius = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  '2xl': '24px',
  pill: '999px',
} as const;

export const shadows = {
  subtle:
    '0 1px 2px rgba(31, 41, 32, 0.04), 0 1px 1px rgba(31, 41, 32, 0.03)',
  card: '0 4px 14px rgba(31, 41, 32, 0.06), 0 1px 3px rgba(31, 41, 32, 0.04)',
  raised: '0 10px 30px rgba(31, 41, 32, 0.08)',
} as const;

export const breakpoints = {
  xs: 390,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  base: '250ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  slow: '400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const;

export const containerWidths = {
  content: '1200px',
  wide: '1320px',
  prose: '68ch',
} as const;

export const typography = {
  serif: '"Fraunces", "Playfair Display", Georgia, serif',
  sans: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 30,
  header: 40,
  bottomNav: 40,
  drawer: 50,
  modal: 60,
  toast: 70,
} as const;

export const layout = {
  headerHeight: 60,
  bottomNavHeight: 64,
} as const;

export const tokens = {
  colors,
  spacing,
  radius,
  shadows,
  breakpoints,
  transitions,
  containerWidths,
  typography,
  zIndex,
  layout,
} as const;

export type Tokens = typeof tokens;
