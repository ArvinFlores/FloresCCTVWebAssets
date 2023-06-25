import type {
  GetRemoteStreamI,
  GetRemoteStreamValue
} from 'src/services/get-remote-stream';
import type { ConnectionStatus } from 'src/services/websocket-connection';

export type WSConnStatus = 'connecting' |
'connected' |
'reconnecting' |
'closed' |
'failed';

export type UseRemoteStreamI = Pick<
GetRemoteStreamI,
'wsUrl' |
'onError' |
'onVideoRecorded'
>;

export type UseRemoteStreamValue = Partial<Pick<
GetRemoteStreamValue,
'getPeerConnection' |
'startVideoRecording' |
'stopVideoRecording'
>> & {
  wsConnStatus: ConnectionStatus | null;
  stream: MediaStream | null | undefined;
};
