import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import { Video } from 'src/components/video';
import { getRemoteStream } from 'src/services/get-remote-stream';
import type { VideoFeedProps, VideoFeedRef } from './interfaces';

export const VideoFeed = forwardRef<VideoFeedRef, VideoFeedProps>(function VideoFeed (
  {
    wsUrl,
    srcObject,
    onStreamStart,
    onVideoRecorded,
    onError,
    ...props
  },
  ref
): JSX.Element {
  const [src, setSrc] = useState<MediaStream | undefined>(srcObject);
  const vidRef = useRef<VideoFeedRef['video']>(null);
  const streamRef = useRef<VideoFeedRef['stream']>(null);

  useImperativeHandle(
    ref,
    () => ({
      video: vidRef.current,
      stream: streamRef.current
    })
  );

  useEffect(
    () => {
      streamRef.current = getRemoteStream({
        wsUrl,
        onVideoRecorded,
        onError,
        onStream: (evt) => {
          setSrc(evt.streams[0]);
          onStreamStart?.();
        }
      });
    },
    []
  );

  return (
    <Video
      {...props}
      ref={vidRef}
      srcObject={src}
    />
  );
});
