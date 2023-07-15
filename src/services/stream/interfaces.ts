import type {
  WebSocketConnectionStateChangeEvent,
  WebSocketConnectionErrorCode
} from '../websocket-connection';

type StreamErrorCode = 'WS_ERR' |
'STREAM_BUSY' |
'PC_ADD_ICE_CAND' |
'PC_CREATE_ANSWER' |
'PC_SET_REMOTE_DESC' |
'PC_SET_LOCAL_DESC' |
'PC_CONN_ERR' |
WebSocketConnectionErrorCode;

interface StreamErrorI {
  message: string;
  code: StreamErrorCode;
  details?: string;
}

interface StreamI {
  /**
   * The websocket url of the websocket server to connect to
   */
  wsUrl: string;
  /**
   * Error callback with details about the error
   */
  onError?: (err: StreamErrorI) => void;
  /**
   * Callback when a video clip has been recorded from the stream
   */
  onVideoRecorded?: (blob: Blob) => void;
  /**
   * Callback when the websocket connection status changes
   */
  onWSConnectionChange?: (ev: CustomEvent<WebSocketConnectionStateChangeEvent>) => void;
}

interface StreamValue {
  /**
   * Checks if at least one local stream has been added to the peer connection
   */
  hasLocalStream: () => boolean;
  /**
   * Adds a local stream to the peer connection
   */
  addLocalStream: (stream: MediaStream) => void;
  /**
   * Toggles the local audio, returns true if audio is enabled, false otherwise
   */
  toggleLocalAudio: () => boolean;
}

export interface MultiStreamItem {
  id: number;
  label: string;
  stream: MediaStream;
}

export interface SingleStreamI extends StreamI {
  /**
   * Success callback when the stream has been retrieved or changes
   */
  onStreamChange?: (stream: MediaStream) => void;
}

export interface MultiStreamI extends StreamI {
  /**
   * Success callback when the streams have been retrieved or change
   */
  onStreamChange?: (streams: MultiStreamItem[]) => void;
}

export interface SingleStreamValue extends StreamValue {
  startVideoRecording: () => void;
  stopVideoRecording: () => void;
}

export interface MultiStreamValue extends StreamValue {
  startVideoRecording: (item: MultiStreamItem) => void;
  stopVideoRecording: (item: MultiStreamItem) => void;
}
