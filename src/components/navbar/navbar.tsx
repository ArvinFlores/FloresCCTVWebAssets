import './navbar.css';

import { classnames } from 'src/util/classnames';
import type { NavbarProps } from './interfaces';

export function Navbar ({
  children,
  alignContent
}: NavbarProps): JSX.Element {
  return (
    <nav
      className={classnames({
        navbar: true,
        'navbar--pull-right': alignContent === 'right',
        'navbar--pull-center': alignContent === 'center'
      })}
    >
        {children}
    </nav>
  );
}
