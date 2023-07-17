import {
  createElement,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import type {
  VideoHTMLAttributes,
  AudioHTMLAttributes
} from 'react';

import { capitalize } from 'src/util/capitalize';
import type { WithSrcObject } from './interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createMediaComponent<ElementType, Props> (type: 'video' | 'audio') {
  function Media (
    { srcObject, ...props }: WithSrcObject<Props>,
    ref: React.Ref<ElementType>
  ): JSX.Element {
    const elRef = useRef<HTMLMediaElement>(null);

    useEffect(
      () => {
        if (!elRef.current || !srcObject) return;
        elRef.current.srcObject = srcObject;
      },
      [srcObject]
    );

    useImperativeHandle(
      ref,
      () => elRef.current as ElementType
    );

    return createElement(type, { ref: elRef, ...props });
  }

  Media.displayName = capitalize(type);

  return forwardRef(Media);
}

export const Video = createMediaComponent<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement>>('video');
export const Audio = createMediaComponent<HTMLAudioElement, AudioHTMLAttributes<HTMLAudioElement>>('audio');
