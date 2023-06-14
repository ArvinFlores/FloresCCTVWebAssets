import type { VideoProps } from 'src/components/video';
import type { GetRemoteStreamI } from 'src/services/get-remote-stream';

export interface VideoFeedProps extends Omit<VideoProps, 'onError'>, Pick<
GetRemoteStreamI,
'wsUrl' |
'onError'
> {
  onStreamStart?: () => void;
}
