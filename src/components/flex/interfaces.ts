import type { CSSProperties, PropsWithChildren } from 'react';

export type FlexProps = PropsWithChildren<Pick<
CSSProperties,
'alignItems' |
'justifyContent'
>>;
