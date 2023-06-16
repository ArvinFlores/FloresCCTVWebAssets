import './navbar.css';

import { classnames } from 'src/util/classnames';
import type { NavbarProps } from './interfaces';

export function Navbar ({
  children,
  alignContent,
  stickToBottom
}: NavbarProps): JSX.Element {
  return (
    <nav
      className={classnames({
        navbar: true,
        'navbar--sticky-bottom': stickToBottom
      })}
    >
      <div
        className={classnames({
          navbar__content: true,
          'navbar__content--right': alignContent === 'right',
          'navbar__content--center': alignContent === 'center'
        })}
      >
        {children}
      </div>
    </nav>
  );
}
