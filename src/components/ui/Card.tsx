import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  interactive?: boolean;
  children?: ReactNode;
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export function Card({
  as: Tag = 'div',
  padding = 'md',
  elevated = false,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-surface-raised border border-ink-100 rounded-lg',
        elevated ? 'shadow-card' : 'shadow-subtle',
        interactive &&
          'transition duration-200 ease-gentle hover:-translate-y-0.5 hover:shadow-raised cursor-pointer',
        paddingMap[padding],
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
