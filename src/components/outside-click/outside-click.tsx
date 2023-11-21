import {
  useRef,
  useEffect
} from 'react';
import type { OutsideClickProps } from './interfaces';

export function OutsideClick ({
  children,
  className,
  onClick
}: OutsideClickProps): JSX.Element {
  const node = useRef<HTMLDivElement | null>(null);
  const handleOnClick = (e): void => {
    if (node.current && !node.current.contains(e.target)) {
      onClick();
    }
  };

  useEffect(
    () => {
      document.addEventListener('click', handleOnClick, true);

      return () => {
        document.removeEventListener('click', handleOnClick, true);
      };
    },
    []
  );

  return (
    <div
      ref={node}
      className={className}
    >
      {children}
    </div>
  );
}
