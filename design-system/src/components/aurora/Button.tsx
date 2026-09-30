import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` commits. `secondary` proposes. `quiet` declines or dismisses. `critical` destroys. */
  variant?: 'primary' | 'secondary' | 'quiet' | 'critical';
  /** `md` is 46px, the touch size. `sm` is 36px for dense desktop surfaces. */
  size?: 'md' | 'sm';
  /** Stretch to the width of the container. */
  block?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', block, children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={['au-button', className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      data-block={block || undefined}
      {...rest}
    >
      <span className="au-button__label">{children}</span>
    </button>
  );
}
