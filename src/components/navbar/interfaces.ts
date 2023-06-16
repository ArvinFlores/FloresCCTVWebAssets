import type { PropsWithChildren } from 'react';

export type NavbarProps = PropsWithChildren<{
  alignContent?: 'left' | 'center' | 'right';
  stickToBottom?: boolean;
}>;
