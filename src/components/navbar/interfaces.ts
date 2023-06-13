import type { PropsWithChildren } from 'react';

export type NavbarProps = PropsWithChildren<{
  alignContent?: 'left' | 'right';
  stickToBottom?: boolean;
}>;
