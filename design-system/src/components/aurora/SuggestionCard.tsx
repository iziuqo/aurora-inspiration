import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import { ReasoningTrace } from './ReasoningTrace';
import type { Signal } from './ReasoningTrace';
import { HoldButton } from './HoldButton';
import { Button } from './Button';
import './SuggestionCard.css';

export interface SuggestionCardProps {
  /** Why this, why now. One sentence, serif, always first. */
  because: string;
  /** The thing itself. Specific enough to act on. */
  what: string;
  /** Where, how far, what it costs you. */
  detail?: string;
  /** The evidence shown when the card opens. */
  signals: Signal[];
  onConfirm?: () => void;
  onDecline?: () => void;
  /** Lets the surrounding Gap charge its light while the user holds. */
  onChargeChange?: (charging: boolean) => void;
  defaultOpen?: boolean;
  /** Allow pushing the card left to leave the time open. */
  swipeable?: boolean;
  declineLabel?: string;
}

const DISMISS_AT = -84;

/** A single proposal for a gap in the day. The reason comes before the thing. */
export function SuggestionCard({
  because, what, detail, signals, onConfirm, onDecline, onChargeChange,
  defaultOpen = false, swipeable = true, declineLabel = 'Not today',
}: SuggestionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [gone, setGone] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const swiped = useRef(false);
  const id = `au-card-${useId().replace(/:/g, '')}`;

  // measured height, so the glide is exact
  useEffect(() => {
    const el = drawer.current;
    if (!el) return;
    if (open) {
      el.style.height = `${el.scrollHeight}px`;
      const t = window.setTimeout(() => { if (drawer.current) drawer.current.style.height = 'auto'; }, 620);
      return () => window.clearTimeout(t);
    }
    el.style.height = `${el.scrollHeight}px`;
    requestAnimationFrame(() => { if (drawer.current) drawer.current.style.height = '0px'; });
  }, [open]);

  const onDown = (e: RPointerEvent) => {
    if (!swipeable) return;
    drag.current = { x: e.clientX, moved: false };
  };
  const onMove = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const raw = e.clientX - d.x;
    if (!d.moved && Math.abs(raw) < 7) return;
    if (!d.moved) { d.moved = true; setDragging(true); }
    setDx(Math.max(-150, Math.min(0, raw * 0.86)));
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setDragging(false);
    if (d.moved) { swiped.current = true; window.setTimeout(() => { swiped.current = false; }, 80); }
    if (d.moved && dx < DISMISS_AT) {
      setGone(true);
      window.setTimeout(() => onDecline?.(), 170);
    } else setDx(0);
  };

  const translate = gone ? 'translateX(-118%)' : dx ? `translateX(${dx}px)` : undefined;
  const behindOpacity = gone ? 0 : Math.min(1, Math.abs(dx) / 88);

  return (
    <div className="au-suggestion">
      {swipeable && <div className="au-suggestion__behind" aria-hidden="true" style={{ opacity: behindOpacity, transition: dragging ? 'none' : undefined }}>Leave it open</div>}
      <div
        className="au-card"
        data-open={open || undefined}
        data-dragging={dragging || undefined}
        style={{ transform: translate }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
      >
        <button
          type="button"
          className="au-card__summary"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => { if (!swiped.current) setOpen((o) => !o); }}
        >
          <div className="au-card__because">{because}</div>
          <div className="au-card__what">{what}</div>
          {detail && <div className="au-card__detail">{detail}</div>}
        </button>
        <div className="au-card__drawer" ref={drawer} id={id}>
          <div className="au-card__drawer-inner" inert={!open || undefined}>
            <ReasoningTrace signals={signals} animate={open} key={String(open)} />
            <div className="au-card__actions">
              <HoldButton onConfirm={onConfirm} onChargeChange={onChargeChange} />
              <Button variant="quiet" onClick={onDecline}>{declineLabel}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
