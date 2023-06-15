import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import type { VideoProps } from './interfaces';

export const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video (
  { srcObject, ...props },
  ref
): JSX.Element {
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(
    () => {
      if (!vidRef.current || !srcObject) return;
      vidRef.current.srcObject = srcObject;
    },
    [srcObject]
  );

  useImperativeHandle(
    ref,
    () => vidRef.current as HTMLVideoElement
  );

  return <video ref={vidRef} {...props} />;
});
