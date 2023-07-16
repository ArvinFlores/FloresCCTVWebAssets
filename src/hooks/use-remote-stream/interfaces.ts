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
>;

export type UseRemoteStreamValue = Partial<MultiStreamValue> & {
  wsConnStatus: WebSocketConnectionStatus | null;
  streams: MultiStreamItem[];
  activeStream: MultiStreamItem | null;
  setActiveStream: (MultiStreamItem) => void;
};
