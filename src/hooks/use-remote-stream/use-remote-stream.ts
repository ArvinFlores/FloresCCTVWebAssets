import {
  useState,
  useEffect,
  useRef
} from 'react';
import { getCameraStream } from 'src/services/stream/get-camera-stream';
import type { SingleStreamValue } from 'src/services/stream';
import type { UseRemoteStreamI, UseRemoteStreamValue } from './interfaces';

export function useRemoteStream ({
  wsUrl,
  onError,
  onVideoRecorded
}: UseRemoteStreamI): UseRemoteStreamValue {
  const [stream, setStream] = useState<UseRemoteStreamValue['stream']>(null);
  const [wsConnStatus, setWSConnStatus] = useState<UseRemoteStreamValue['wsConnStatus']>(null);
  const prevWSConnStatusRef = useRef<UseRemoteStreamValue['wsConnStatus']>(null);
  const streamRef = useRef<SingleStreamValue | null>(null);
  const {
    startVideoRecording,
    stopVideoRecording,
    hasLocalStream,
    addLocalStream,
    toggleLocalAudio
  } = streamRef.current ?? {};

  useEffect(
    () => {
      streamRef.current = getCameraStream({
        wsUrl,
        onStreamChange: (stream) => {
          setStream(stream);
        },
        onWSConnectionChange: (ev) => {
          const { status } = ev.detail;
          const prevStatus = prevWSConnStatusRef.current;

          if (prevStatus === 'connected' && status !== 'connected') {
            setStream(null);
          }

          prevWSConnStatusRef.current = status;
          setWSConnStatus(status);
        },
        onError,
        onVideoRecorded
      });
    },
    []
  );

  return {
    stream,
    wsConnStatus,
    startVideoRecording,
    stopVideoRecording,
    hasLocalStream,
    addLocalStream,
    toggleLocalAudio
  };
}
