import './fixed.css';

import { classnames } from 'src/util/classnames';
import type { FixedProps } from './interfaces';

export function Fixed ({
  direction = 'top',
  className = '',
  children
}: FixedProps): JSX.Element {
  return (
    <div
      className={classnames({
        fixed: true,
        'fixed--top': direction === 'top',
        'fixed--bottom': direction === 'bottom',
        [className]: true
      })}
    >
      {children}
    </div>
  );
}
