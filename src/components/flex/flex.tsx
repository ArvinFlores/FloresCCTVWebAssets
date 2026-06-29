import './flex.css';

import type { FlexProps } from './interfaces';

export function Flex ({
  children,
  alignItems,
  justifyContent
}: FlexProps): JSX.Element {
  return (
    <div
      className="flex"
      style={{ alignItems, justifyContent }}
    >
      {children}
    </div>
  );
}
