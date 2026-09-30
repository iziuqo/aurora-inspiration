import type { ElementType, ReactNode } from 'react';
import './Label.css';

export interface LabelProps {
  children: ReactNode;
  /** `label` is the default metadata colour. `primary` for the one label that matters. */
  tone?: 'label' | 'primary' | 'secondary' | 'faint';
  /** Trim trailing tracking. Use on right-aligned or centred runs so glyphs hit the edge. */
  trim?: boolean;
  as?: ElementType;
  className?: string;
}

/** Uppercase, tracked metadata. Never a sentence, never a button. */
export function Label({ children, tone = 'label', trim = false, as: Tag = 'span', className }: LabelProps) {
  return (
    <Tag className={['au-label', className].filter(Boolean).join(' ')} data-tone={tone} data-trim={trim || undefined}>
      {children}
    </Tag>
  );
}
