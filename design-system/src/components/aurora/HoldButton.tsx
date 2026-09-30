import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './HoldButton.css';

export type HoldState = 'idle' | 'charging' | 'done';

export interface HoldButtonProps {
  /** Called once, after the hold completes. */
  onConfirm?: () => void;
  /** Fires as the hold starts and stops, so a parent can charge its own light. */
  onChargeChange?: (charging: boolean) => void;
  /** Milliseconds the user must hold. The default, 840, is long enough to be deliberate and short enough not to feel like a wait. */
  duration?: number;
  label?: string;
  holdingLabel?: string;
  doneLabel?: string;
  block?: boolean;
  className?: string;
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hold to confirm. Commitment made physical: the fill charges while held,
 * glides back with nothing spent if released early, and confirms only when held through.
 */
export function HoldButton({
  onConfirm,
  onChargeChange,
  duration = 840,
  label = 'Hold to confirm',
  holdingLabel = 'Keep holding',
  doneLabel = 'Confirmed',
  block,
  className,
}: HoldButtonProps) {
  const [state, setState] = useState<HoldState>('idle');
  const timer = useRef<number | null>(null);
  const stateRef = useRef<HoldState>('idle');
  stateRef.current = state;

  const ms = reduced() ? Math.min(duration, 380) : duration;

  const start = useCallback(() => {
    if (stateRef.current !== 'idle') return;
    setState('charging');
    onChargeChange?.(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setState('done');
      onChargeChange?.(false);
      window.setTimeout(() => onConfirm?.(), 280);
    }, ms);
  }, [ms, onConfirm, onChargeChange]);

  const cancel = useCallback(() => {
    if (stateRef.current !== 'charging') return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setState('idle');
    onChargeChange?.(false);
  }, [onChargeChange]);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const text = state === 'charging' ? holdingLabel : state === 'done' ? doneLabel : label;

  return (
    <button
      type="button"
      className={['au-hold', className].filter(Boolean).join(' ')}
      data-state={state}
      data-block={block || undefined}
      style={{ '--_hold': `${ms}ms` } as CSSProperties}
      aria-disabled={state === 'done' || undefined}
      aria-description="Press and hold to confirm"
      onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); start(); }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(); } }}
      onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') cancel(); }}
      onClick={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="au-hold__fill" aria-hidden="true" />
      <span className="au-hold__label">{text}</span>
      <span className="au-sr-only" aria-live="polite">{state === 'done' ? doneLabel : ''}</span>
    </button>
  );
}
