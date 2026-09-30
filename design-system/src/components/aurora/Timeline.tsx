import type { ReactNode } from 'react';
import './Timeline.css';

export interface TimelineProps { children: ReactNode; className?: string }

/** A day, top to bottom. Committed time is grey and held together by hairlines. */
export function Timeline({ children, className }: TimelineProps) {
  return <div className={['au-timeline', className].filter(Boolean).join(' ')} role="list">{children}</div>;
}

export interface TimelineRowProps {
  /** Set with points, not colons: 09.30. */
  time: string;
  title: ReactNode;
  detail?: ReactNode;
  /** `past` fades out, `present` is marked now, `settled` is something Aurora just booked. */
  state?: 'upcoming' | 'past' | 'present' | 'settled';
}

export function TimelineRow({ time, title, detail, state = 'upcoming' }: TimelineRowProps) {
  return (
    <div className="au-row" data-state={state} role="listitem">
      <div className="au-row__time">
        <time>{time}</time>
        {state === 'present' && <span className="au-row__now">now</span>}
      </div>
      <div className="au-row__entry">
        <div className="au-row__title">{title}</div>
        {detail && <div className="au-row__detail">{detail}</div>}
      </div>
    </div>
  );
}

export type GapState = 'idle' | 'charging' | 'working' | 'settled';

export interface GapProps {
  time: string;
  /** How much time is open, in words: "Three hours", "Evening". */
  span?: string;
  state?: GapState;
  children: ReactNode;
}

/** Open time. The rule breaks, light fills the break, and Aurora writes into it. */
export function Gap({ time, span, state = 'idle', children }: GapProps) {
  return (
    <div className="au-row au-gap" data-state={state} role="listitem">
      <div className="au-gap__beam" aria-hidden="true" />
      <div className="au-row__time">
        <time>{time}</time>
        {span && state !== 'settled' && <span className="au-row__span">{span}</span>}
      </div>
      <div className="au-gap__body">{children}</div>
    </div>
  );
}

export interface HeldProps { line?: string; why: ReactNode }

/** What Aurora writes into a gap it chose to leave open. Restraint, made visible. */
export function Held({ line = 'Left open.', why }: HeldProps) {
  return (
    <div className="au-held">
      <div className="au-held__line">{line}</div>
      <div className="au-held__why">{why}</div>
    </div>
  );
}
