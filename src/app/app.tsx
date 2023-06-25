import '../styles/base.css';
import '../styles/util.css';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeHigh,
  faVolumeXmark
} from '@fortawesome/free-solid-svg-icons';
import { RECORDING_LIMIT_SECS } from 'config/app';
import { Navbar } from 'src/components/navbar';
import { Button } from 'src/components/button';
import { Alert } from 'src/components/alert';
import { JSONViewer } from 'src/components/json-viewer';
import { ErrorBoundary } from 'src/components/error-boundary';
import { Video } from 'src/components/video';
import type { GetRemoteStreamErrI } from 'src/services/get-remote-stream';
import { useRemoteStream } from 'src/hooks/use-remote-stream';
import { takeScreenshot } from 'src/util/take-screenshot';
import { downloadLocalFile } from 'src/util/download-local-file';
import { Controls } from './components/controls';
import { MediaPreview } from './components/media-preview';

export function App (): JSX.Element {
  const [loadError, setLoadError] = useState<GetRemoteStreamErrI | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [micEnabled, setmicEnabled] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const videofeedRef = useRef<HTMLVideoElement | null>(null);
  const recordingRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<MediaStream | null>(null);
  const streamBusyErr = loadError?.code === 'STREAM_BUSY';
  const {
    stream,
    startVideoRecording,
    stopVideoRecording,
    getPeerConnection
  } = useRemoteStream({
    wsUrl: 'wss://192.168.1.213:9000/stream',
    onError: setLoadError,
    onVideoRecorded: (blob: Blob): void => {
      setPreviewSrc(URL.createObjectURL(blob));
    }
  });
  const handleTakeScreenshot = (): void => {
    if (videofeedRef?.current) {
      setPreviewSrc(takeScreenshot(videofeedRef.current));
    }
  };
  const handleCancelMediaPreview = (): void => {
    if (previewSrc.startsWith('blob:')) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc('');
  };
  const handleMediaDownload = (): void => {
    downloadLocalFile(previewSrc);
    if (previewSrc.startsWith('blob:')) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc('');
  };
  const handleRecordClick = (): void => {
    const stopRecording = (): void => {
      stopVideoRecording?.();
      setRecording(false);
      recordingRef.current = undefined;
    };

    if (recording) {
      clearTimeout(recordingRef.current);
      stopRecording();
    } else {
      startVideoRecording?.();
      setRecording(true);
      recordingRef.current = setTimeout(stopRecording, RECORDING_LIMIT_SECS * 1000);
    }
  };
  const handleToggleMic = (): void => {
    if (audioRef.current) {
      const audioTrack = audioRef.current.getAudioTracks()[0];
      const enabled = !audioTrack.enabled;

      audioTrack.enabled = enabled;
      setmicEnabled(enabled);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const pc = getPeerConnection?.();
          audioRef.current = stream;
          if (pc) stream.getTracks().forEach(track => pc.addTrack(track, stream));
          setmicEnabled(true);
        })
        .catch(console.error);
    }
  };
  const handleToggleVideoAudio = (): void => {
    setVideoMuted(muted => !muted);
  };
  const renderFallbackError = (error: Error): JSX.Element => {
    return (
      <Alert type="danger">
        <p>The application encountered an unexpected error: {error.message || 'Unknown Error'}</p>
        <p>Please try refreshing your browser</p>
      </Alert>
    );
  };

  return (
    <ErrorBoundary fallback={renderFallbackError}>
      <div role="alert">
      {
        loadError && (
          <Alert
            type="danger"
            expandableLabel={streamBusyErr ? undefined : 'Details'}
            expandableContent={
              streamBusyErr ?
                undefined :
                  (
                    <div className="util-mt-2">
                      <JSONViewer>
                        {loadError}
                      </JSONViewer>
                    </div>
                  )
            }
          >
            {
              streamBusyErr ?
                loadError.message :
                'There was a problem connecting to the camera, please try refreshing the browser'
            }
          </Alert>
        )
      }
      </div>
      <Navbar
        alignContent="center"
        stickToBottom={true}
      >
        <Controls
          previewingMedia={Boolean(previewSrc)}
          micEnabled={micEnabled}
          recording={recording}
          onToggleMic={handleToggleMic}
          onCancelMediaPreview={handleCancelMediaPreview}
          onDownloadMediaPreview={handleMediaDownload}
          onTakeScreenshot={handleTakeScreenshot}
          onRecord={handleRecordClick}
        />
      </Navbar>
      <Button
        ariaLabel={videoMuted ? 'Unmute video feed' : 'Mute video feed'}
        className="util-ml-2 util-mt-2"
        variant="see-through"
        circular={true}
        onClick={handleToggleVideoAudio}
      >
        <FontAwesomeIcon
          icon={videoMuted ? faVolumeXmark : faVolumeHigh}
          size="2x"
        />
      </Button>
      <Video
        ref={videofeedRef}
        srcObject={stream}
        className="util-fullscreen util-fullscreen--low-priority"
        autoPlay={true}
        muted={videoMuted}
      />
      <MediaPreview previewSrc={previewSrc} />
    </ErrorBoundary>
  );
}
