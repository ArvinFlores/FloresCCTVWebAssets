import {
  useState,
  useEffect,
  useRef
} from 'react';
import { getCameraStream } from 'src/services/stream/get-camera-stream';
import type { MultiStreamValue } from 'src/services/stream';
import type { UseRemoteStreamI, UseRemoteStreamValue } from './interfaces';

export function useRemoteStream ({
  wsUrl,
  onError,
  onVideoRecorded
}: UseRemoteStreamI): UseRemoteStreamValue {
  const [activeStream, setActiveStream] = useState<UseRemoteStreamValue['activeStream']>(null);
  const [streams] = useState<UseRemoteStreamValue['streams']>([]);
  const [wsConnStatus, setWSConnStatus] = useState<UseRemoteStreamValue['wsConnStatus']>(null);
  const prevWSConnStatusRef = useRef<UseRemoteStreamValue['wsConnStatus']>(null);
  const streamRef = useRef<MultiStreamValue | null>(null);
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
          setActiveStream({ id: 1, label: 'FloresCCTV', stream });
        },
        onWSConnectionChange: (ev) => {
          const { status } = ev.detail;
          const prevStatus = prevWSConnStatusRef.current;

          if (prevStatus === 'connected' && status !== 'connected') {
            setActiveStream(null);
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
    activeStream,
    setActiveStream,
    streams,
    wsConnStatus,
    startVideoRecording,
    stopVideoRecording,
    hasLocalStream,
    addLocalStream,
    toggleLocalAudio
  };
}
