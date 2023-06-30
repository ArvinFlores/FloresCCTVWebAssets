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
        'navbar--sticky-bottom': stickToBottom,
        'navbar--pull-right': alignContent === 'right',
        'navbar--pull-center': alignContent === 'center',
        'util-z-1000': true
      })}
    >
        {children}
    </nav>
  );
}
