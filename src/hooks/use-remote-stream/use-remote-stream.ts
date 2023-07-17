import {
  useState,
  useEffect,
  useRef
} from 'react';
import { getCameraStream } from 'src/services/stream/get-camera-stream';
import { getJanusVideoroomStream } from 'src/services/stream/get-janus-videoroom-stream';
import type { MultiStreamItem, MultiStreamValue } from 'src/services/stream';
import type { UseRemoteStreamI, UseRemoteStreamValue } from './interfaces';
import { without } from './helpers';

export function useRemoteStream ({
  wsUrl,
  onError,
  onVideoRecorded,
  defaultActiveStream
}: UseRemoteStreamI): UseRemoteStreamValue {
  const [activeStream, setActiveStream] = useState<UseRemoteStreamValue['activeStream']>(null);
  const [streams, setStreams] = useState<UseRemoteStreamValue['streams']>([]);
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
      streamRef.current = JANUS_ROOM && JANUS_URL ?
        getJanusVideoroomStream({
          room: Number(JANUS_ROOM),
          wsUrl,
          onStreamChange: (streams) => {
            const setDefault = (): MultiStreamItem | null => {
              return defaultActiveStream ? (streams.find(defaultActiveStream) ?? null) : streams[0];
            };

            if (activeStream) {
              const exists = streams.find((stream) => stream.id === activeStream.id);
              if (!exists) setActiveStream(setDefault());
            } else {
              setActiveStream(setDefault());
            }

            setStreams(streams);
          },
          onVideoRecorded
        }) :
        getCameraStream({
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
    streams: without(activeStream, streams),
    wsConnStatus,
    startVideoRecording,
    stopVideoRecording,
    hasLocalStream,
    addLocalStream,
    toggleLocalAudio
  };
}
