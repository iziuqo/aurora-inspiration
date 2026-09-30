import { useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import './SegmentedControl.css';

export interface SegmentedOption { value: string; label: string }

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** Names the group for assistive technology. */
  label: string;
  className?: string;
}

/** Switches between two to four views of the same thing. The indicator glides; it never jumps. */
export function SegmentedControl({ options, value, onChange, label, className }: SegmentedControlProps) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={['au-segmented', className].filter(Boolean).join(' ')}
      style={{ '--_count': options.length, '--_index': index } as CSSProperties}
      onKeyDown={onKey}
    >
      <div className="au-segmented__indicator" aria-hidden="true" />
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => { refs.current[i] = el; }}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          tabIndex={o.value === value ? 0 : -1}
          className="au-segmented__option"
          onClick={() => onChange(o.value)}
        >
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
