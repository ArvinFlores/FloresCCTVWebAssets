import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export type ButtonProps = PropsWithChildren<{
  outline?: boolean;
  circular?: boolean;
  variant?: 'danger';
}> & Pick<ButtonHTMLAttributes<unknown>, 'disabled'>;
