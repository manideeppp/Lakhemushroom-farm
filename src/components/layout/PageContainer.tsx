import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: 'content' | 'wide' | 'full';
  children: ReactNode;
  as?: 'div' | 'main' | 'section';
}

const widthMap = {
  content: 'max-w-content',
  wide: 'max-w-wide',
  full: 'max-w-none',
};

/**
 * PageContainer — horizontal padding + max-width for page contents.
 * Vertical space is left to inner Sections so pages compose predictably.
 */
export function PageContainer({
  width = 'content',
  as: Tag = 'div',
  className,
  children,
  ...rest
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        widthMap[width],
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
