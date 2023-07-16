import type {
  MultiStreamI,
  MultiStreamValue,
  MultiStreamItem
} from 'src/services/stream';
import type { WebSocketConnectionStatus } from 'src/services/websocket-connection';

export type UseRemoteStreamI = Pick<
MultiStreamI,
'wsUrl' |
'onError' |
'onVideoRecorded'
> & {
  /**
   * Callback to set the active stream, even when the list of streams changes
   * If this callback is undefined, the hook will set the first item in the stream list as active
   */
  defaultActiveStream?: (item: MultiStreamItem, idx: number) => boolean;
};

export type UseRemoteStreamValue = Partial<MultiStreamValue> & {
  wsConnStatus: WebSocketConnectionStatus | null;
  streams: MultiStreamItem[];
  activeStream: MultiStreamItem | null;
  setActiveStream: (item: MultiStreamItem) => void;
};
