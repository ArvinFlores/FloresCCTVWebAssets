import './spinner.css';

import { classnames } from 'src/util/classnames';
import type { SpinnerProps } from './interfaces';

export function Spinner ({ size }: SpinnerProps): JSX.Element {
  return (
    <div className={classnames({
      spinner: true,
      'spinner--small': !size || size === 'small',
      'spinner--medium': size === 'medium',
      'spinner--large': size === 'large'
    })}
    />
  );
}
