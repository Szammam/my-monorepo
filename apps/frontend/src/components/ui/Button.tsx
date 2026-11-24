import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = ['ui-btn', `ui-btn--${variant}`, loading ? 'ui-btn--loading' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {loading ? 'Proszę czekać…' : children}
    </button>
  );
}
