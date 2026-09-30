import type { ReactNode } from 'react';
import { Label } from './Label';
import './Quote.css';

export interface QuoteProps { children: ReactNode; cite?: string; className?: string }

/** Someone else's words, held between two rules. */
export function Quote({ children, cite, className }: QuoteProps) {
  return (
    <figure className={['au-quote', className].filter(Boolean).join(' ')}>
      <blockquote className="au-quote__text">{children}</blockquote>
      {cite && <figcaption><Label as="cite" className="au-quote__cite">{cite}</Label></figcaption>}
    </figure>
  );
}
