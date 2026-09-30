import type { CSSProperties } from 'react';
import './ExecutionSteps.css';

export interface ExecutionStepsProps {
  /** What Aurora is doing, in past tense, shortest first: "Slot held", "Car at 11.10". */
  steps: string[];
  /** Milliseconds between steps. */
  interval?: number;
  /** Render all steps at once, without the strike-in. */
  static?: boolean;
  className?: string;
}

/** The work, struck as points of light down the beam. Sits inside a Gap, so the dots land on its beam. */
export function ExecutionSteps({ steps, interval = 460, static: isStatic, className }: ExecutionStepsProps) {
  return (
    <ol className={['au-steps', className].filter(Boolean).join(' ')} data-static={isStatic || undefined} aria-live="polite">
      {steps.map((s, k) => (
        <li key={s} className="au-steps__step" style={{ '--_d': `${k * interval + 300}ms` } as CSSProperties}>
          <i className="au-steps__dot" aria-hidden="true" />
          {s}
        </li>
      ))}
    </ol>
  );
}
