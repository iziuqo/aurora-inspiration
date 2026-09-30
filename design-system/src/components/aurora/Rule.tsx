import './Rule.css';

export interface RuleProps {
  /** `hairline` holds content together. `strong` separates groups. `light` marks open time only. */
  variant?: 'hairline' | 'strong' | 'light';
  /** Draw the rule in from the left on mount. */
  animate?: boolean;
  className?: string;
}

/** A 1px line. Aurora's structure is made of these instead of shadows. */
export function Rule({ variant = 'hairline', animate = false, className }: RuleProps) {
  return <hr className={['au-rule', className].filter(Boolean).join(' ')} data-variant={variant} data-animate={animate || undefined} aria-hidden="true" />;
}
