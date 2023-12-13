import {
  useRef,
  useEffect,
  useState,
  useCallback,
  isValidElement
} from 'react';
import type { ImgProps } from './interfaces';

export function Img ({
  src,
  errorFallback,
  ...props
}: ImgProps): JSX.Element {
  const node = useRef<HTMLImageElement | null>(null);
  const [err, setErr] = useState<boolean>(false);
  const handleOnError = useCallback(
    (): void => {
      if (errorFallback != null) {
        setErr(true);
      }
    },
    [errorFallback]
  );

  useEffect(
    () => {
      const img = node.current;
      img?.addEventListener('error', handleOnError);
      return () => {
        img?.removeEventListener('error', handleOnError);
      };
    },
    [handleOnError]
  );

  if (err && isValidElement(errorFallback)) return errorFallback;

  return (
    <img
      {...props}
      ref={node}
      src={err && typeof errorFallback === 'string' ? errorFallback : src}
    />
  );
}
