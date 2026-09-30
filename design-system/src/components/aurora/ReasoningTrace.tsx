import type { CSSProperties } from 'react';
import './ReasoningTrace.css';

export interface Signal { key: string; value: string }

export interface ReasoningTraceProps {
  /** Three to five signals. Each is one fact Aurora used, never an opinion. */
  signals: Signal[];
  /** Stagger the signals in, 60ms apart. */
  animate?: boolean;
  className?: string;
}

/** Why this, why now, why you. The evidence behind a suggestion, laid out as a ledger. */
export function ReasoningTrace({ signals, animate, className }: ReasoningTraceProps) {
  return (
    <dl className={['au-trace', className].filter(Boolean).join(' ')} data-animate={animate || undefined}>
      {signals.map((s, i) => (
        <div className="au-trace__signal" key={s.key} style={{ '--_i': i } as CSSProperties}>
          <dt className="au-trace__key">{s.key}</dt>
          <dd className="au-trace__value">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
