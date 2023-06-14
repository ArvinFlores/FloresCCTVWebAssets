import { useCallback } from 'react';
import type { VideoProps } from './interfaces';

export function Video ({ srcObject, ...props }: VideoProps): JSX.Element {
  const ref = useCallback(
    (node: HTMLVideoElement) => {
      // eslint-disable-next-line
      if (node && srcObject) node.srcObject;
    },
    [srcObject]
  );

  return <video ref={ref} {...props} />;
}
