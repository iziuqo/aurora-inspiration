import type { ReactNode } from 'react';
import { Label } from './Label';
import './QuietState.css';

export interface QuietStateProps {
  /** Where and when: "London · Tuesday 4 August". */
  context: string;
  /** Said plainly, in Aurora's voice. Not an apology. */
  title: ReactNode;
  /** What Aurora is keeping for later, so the quiet reads as judgement, not emptiness. */
  holding?: { label?: string; line: string };
  className?: string;
}

/** A first-class empty state. Some days there is nothing worth moving, and the product says so. */
export function QuietState({ context, title, holding, className }: QuietStateProps) {
  return (
    <section className={['au-quiet', className].filter(Boolean).join(' ')}>
      <Label>{context}</Label>
      <h2 className="au-quiet__title">{title}</h2>
      {holding && (
        <div className="au-quiet__rest">
          <Label trim>{holding.label ?? 'Aurora is holding'}</Label>
          <div className="au-quiet__line">{holding.line}</div>
        </div>
      )}
    </section>
  );
}
