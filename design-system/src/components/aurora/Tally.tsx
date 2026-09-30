import { Label } from './Label';
import './Tally.css';

export interface TallyItem { value: string | number; label: string; highlight?: boolean }

export interface TallyProps {
  items: TallyItem[];
  className?: string;
}

/** A few numbers, side by side, for comparison. At most one is highlighted. */
export function Tally({ items, className }: TallyProps) {
  return (
    <ul className={['au-tally', className].filter(Boolean).join(' ')}>
      {items.map((it) => (
        <li key={it.label} className="au-tally__item" data-highlight={it.highlight || undefined}>
          <div className="au-tally__n">{it.value}</div>
          <Label className="au-tally__k" as="div">{it.label}</Label>
        </li>
      ))}
    </ul>
  );
}
