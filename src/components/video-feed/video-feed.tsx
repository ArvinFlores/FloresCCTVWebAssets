import { useEffect, useState } from 'react';
import { Video } from 'src/components/video';
import { getRemoteStream } from 'src/services/get-remote-stream';
import type { VideoFeedProps } from './interfaces';

export function VideoFeed ({
  wsUrl,
  srcObject,
  onStreamStart,
  onError,
  ...props
}: VideoFeedProps): JSX.Element {
  const [src, setSrc] = useState<MediaStream | undefined>(srcObject);

  useEffect(
    () => {
      getRemoteStream({
        wsUrl,
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
      srcObject={src}
    />
  );
}
