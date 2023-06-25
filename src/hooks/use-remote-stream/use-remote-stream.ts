import {
  useState,
  useEffect,
  useRef
} from 'react';
import { getRemoteStream, type GetRemoteStreamValue } from 'src/services/get-remote-stream';
import type { UseRemoteStreamI, UseRemoteStreamValue } from './interfaces';

export function useRemoteStream ({
  wsUrl,
  onError,
  onVideoRecorded
}: UseRemoteStreamI): UseRemoteStreamValue {
  const [stream, setStream] = useState<UseRemoteStreamValue['stream']>(null);
  const [wsConnStatus, setWSConnStatus] = useState<UseRemoteStreamValue['wsConnStatus']>(null);
  const streamRef = useRef<GetRemoteStreamValue | null>(null);
  const {
    startVideoRecording,
    stopVideoRecording,
    getPeerConnection
  } = streamRef.current ?? {};

  useEffect(
    () => {
      streamRef.current = getRemoteStream({
        wsUrl,
        onStream: (ev) => {
          setStream(ev.streams[0]);
        },
        onWSConnectionChange: (ev) => {
          setWSConnStatus(ev.detail.status);
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
    getPeerConnection
  };
}
