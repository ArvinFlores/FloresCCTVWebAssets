import type {
  SingleStreamI,
  SingleStreamValue
} from 'src/services/stream';
import type { WebSocketConnectionStatus } from 'src/services/websocket-connection';

export type UseRemoteStreamI = Pick<
SingleStreamI,
'wsUrl' |
'onError' |
'onVideoRecorded'
>;

export type UseRemoteStreamValue = Partial<SingleStreamValue> & {
  wsConnStatus: WebSocketConnectionStatus | null;
  stream: MediaStream | null | undefined;
};
