import { useEffect, useRef, useState } from 'react';
import './AskBar.css';

export interface AskBarProps {
  /** What Aurora is doing, or an invitation to talk. Changes roll through rather than cut. */
  status: string;
  /** Breathe the light while Aurora is working. */
  busy?: boolean;
  onClick?: () => void;
  className?: string;
}

/** The quiet way back to conversation. Always present, never loud. */
export function AskBar({ status, busy, onClick, className }: AskBarProps) {
  const [shown, setShown] = useState(status);
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (status === shown) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(status); return; }
    setPhase('out');
    const t = window.setTimeout(() => {
      setShown(status);
      setPhase('in');
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('idle')));
    }, 340);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <button type="button" className={['au-ask', className].filter(Boolean).join(' ')} data-busy={busy || undefined} onClick={onClick}>
      <i className="au-ask__pulse" aria-hidden="true" />
      <span className="au-ask__label" data-phase={phase} aria-live="polite">{shown}</span>
    </button>
  );
}
