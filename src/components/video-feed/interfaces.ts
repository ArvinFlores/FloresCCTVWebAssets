import type { VideoProps } from 'src/components/video';
import type { GetRemoteStreamI, GetRemoteStreamValue } from 'src/services/get-remote-stream';

export interface VideoFeedProps extends Omit<VideoProps, 'onError'>, Pick<
GetRemoteStreamI,
'wsUrl' |
'onError'
> {
  onStreamStart?: () => void;
}

export interface VideoFeedRef {
  video: HTMLVideoElement | null;
  stream: GetRemoteStreamValue | null;
}
