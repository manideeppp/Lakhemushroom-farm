import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  children: ReactNode;
}

const gapMap = {
  xs: 'gap-1.5',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
};

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export function Stack({
  gap = 'md',
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  children,
  ...rest
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        gapMap[gap],
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const gridGap = { sm: 'gap-3', md: 'gap-4 sm:gap-5', lg: 'gap-5 sm:gap-6' };

const colClass = (n: number, prefix: string) => {
  const map: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };
  const base = map[n] ?? 'grid-cols-1';
  return prefix ? `${prefix}:${base}` : base;
};

export function ResponsiveGrid({
  cols = { base: 1, sm: 2, lg: 3 },
  gap = 'md',
  className,
  children,
  ...rest
}: ResponsiveGridProps) {
  const classes = [
    'grid',
    gridGap[gap],
    cols.base ? colClass(cols.base, '') : 'grid-cols-1',
    cols.sm && colClass(cols.sm, 'sm'),
    cols.md && colClass(cols.md, 'md'),
    cols.lg && colClass(cols.lg, 'lg'),
    cols.xl && colClass(cols.xl, 'xl'),
  ];
  return (
    <div className={cn(...classes, className)} {...rest}>
      {children}
    </div>
  );
}

export interface HorizontalScrollProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg';
  padded?: boolean;
  children: ReactNode;
}

const hGap = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' };

export function HorizontalScroll({
  gap = 'md',
  padded = false,
  className,
  children,
  ...rest
}: HorizontalScrollProps) {
  return (
    <div
      className={cn(
        'no-scrollbar flex overflow-x-auto snap-x snap-mandatory',
        hGap[gap],
        padded && '-mx-4 px-4 sm:-mx-6 sm:px-6',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
