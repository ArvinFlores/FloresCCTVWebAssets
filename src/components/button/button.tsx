import './button.css';

import { classnames } from 'src/util/classnames';
import type { ButtonProps } from './interfaces';

export function Button ({
  children,
  outline,
  circular,
  variant,
  disabled,
  ariaLabel,
  onClick
}: ButtonProps): JSX.Element {
  return (
    <button
      aria-label={ariaLabel}
      className={classnames({
        btn: true,
        'btn--outline': outline,
        'btn--circular': circular,
        'btn--danger': variant === 'danger',
        'btn--primary': variant === 'primary',
        'btn--disabled': disabled
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
