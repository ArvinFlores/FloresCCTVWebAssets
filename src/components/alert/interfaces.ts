import type { PropsWithChildren } from 'react';

export type AlertProps = PropsWithChildren<{
  type: 'info' | 'danger';
  expandableLabel?: string;
  expandableContent?: React.ReactNode;
  onDismiss?: () => void;
}>;
