import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export type ButtonProps = PropsWithChildren<{
  outline?: boolean;
  circular?: boolean;
  variant?: 'danger' | 'primary' | 'see-through';
  ariaLabel?: string;
}> & Pick<
ButtonHTMLAttributes<unknown>,
'disabled' |
'onClick' |
'style' |
'className'
>;
