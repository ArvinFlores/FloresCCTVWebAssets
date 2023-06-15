export type ErrorCodes = 'WS_ERR' |
'STREAM_BUSY' |
'PC_ADD_ICE_CAND' |
'PC_CREATE_ANSWER' |
'PC_SET_REMOTE_DESC' |
'PC_SET_LOCAL_DESC' |
'PC_CONN_ERR';

export interface GetRemoteStreamErrI {
  message: string;
  code: ErrorCodes;
  details?: object;
}

export interface GetRemoteStreamI {
  /**
   * The websocket url of the websocket server running on the rPi device
   */
  wsUrl: string;
  /**
   * Success callback when the stream has been retrieved
   */
  onStream?: (ev: RTCTrackEvent) => void;
  /**
   * Error callback with details about the error
   */
  onError?: (err: GetRemoteStreamErrI) => void;
}
