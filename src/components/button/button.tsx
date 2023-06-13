import './button.css';

import { classnames } from 'src/util/classnames';
import type { ButtonProps } from './interfaces';

export function Button ({
  children,
  outline,
  circular,
  variant,
  disabled
}: ButtonProps): JSX.Element {
  return (
    <button
      className={classnames({
        btn: true,
        'btn--outline': outline,
        'btn--circular': circular,
        'btn--danger': variant === 'danger',
        'btn--disabled': disabled
      })}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
