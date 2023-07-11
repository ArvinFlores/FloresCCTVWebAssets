import '../styles/base.css';
import '../styles/util.css';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons/faVolumeHigh';
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons/faVolumeXmark';
import { RECORDING_LIMIT_SECS } from 'config/app';
import { Navbar } from 'src/components/navbar';
import { Button } from 'src/components/button';
import { Alert } from 'src/components/alert';
import { JSONViewer } from 'src/components/json-viewer';
import { ErrorBoundary } from 'src/components/error-boundary';
import { Video } from 'src/components/video';
import { Spinner } from 'src/components/spinner';
import { useRemoteStream } from 'src/hooks/use-remote-stream';
import { takeScreenshot } from 'src/util/take-screenshot';
import { downloadLocalFile } from 'src/util/download-local-file';
import { Controls } from './components/controls';
import { MediaPreview } from './components/media-preview';
import type { AppError } from './interfaces';

export function App (): JSX.Element {
  const [error, setError] = useState<AppError | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [recordingEnabled, setRecordingEnabled] = useState<boolean>(true);
  const [recording, setRecording] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const videofeedRef = useRef<HTMLVideoElement | null>(null);
  const recordingRef = useRef<NodeJS.Timeout>();
  const {
    stream,
    wsConnStatus,
    startVideoRecording,
    stopVideoRecording,
    hasLocalStream,
    addLocalStream,
    toggleLocalAudio
  } = useRemoteStream({
    wsUrl: `wss://${CAMERA_IP}:9000/stream`,
    onError: (error) => {
      const { code } = error;

      if (code === 'STREAM_BUSY') {
        setError({
          message: 'Sorry, someone else is currently using the camera',
          dismissable: false
        });
      } else if (code === 'CONN_MAX_RETRIES_EXCEEDED') {
        setError({
          message: 'We were unable to connect to the camera, please try refreshing the browser',
          dismissable: false,
          details: { ...error }
        });
      } else {
        setError({
          message: 'Trying to connect to the camera, please wait',
          dismissable: false,
          details: { ...error }
        });
      }
    },
    onVideoRecorded: (blob: Blob): void => {
      setRecording(false);
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
    try {
      const stopRecording = (): void => {
        stopVideoRecording?.();
        recordingRef.current = undefined;
      };
      if (recording) {
        clearTimeout(recordingRef.current);
        stopRecording();
      } else {
        startVideoRecording?.();
        setRecording(true);
        recordingRef.current = setTimeout(
          stopRecording,
          (RECORDING_LIMIT_SECS * 1000) - 500
        );
      }
    } catch (e) {
      setError({
        message: 'We were unable to record video',
        dismissable: true,
        details: { message: e.message }
      });
      setRecordingEnabled(false);
    }
  };
  const handleToggleMic = (): void => {
    if (hasLocalStream?.()) {
      setMicActive(toggleLocalAudio?.() ?? false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          addLocalStream?.(stream);
          setMicActive(true);
        })
        .catch((err) => {
          setError({
            message: 'Your microphone was unable to be turned on',
            dismissable: true,
            details: { message: err.message }
          });
          setMicEnabled(false);
        });
    }
  };
  const handleToggleVideoAudio = (): void => {
    setVideoMuted(muted => !muted);
  };
  const handleCloseAlert = (): void => {
    setError(null);
  };
  const renderFallbackError = (error: Error): JSX.Element => {
    return (
      <Alert type="danger">
        <p>The application encountered an unexpected error: {error.message || 'Unknown Error'}</p>
        <p>Please try refreshing your browser</p>
      </Alert>
    );
  };

  useEffect(
    () => {
      const hasVideoFeed = wsConnStatus === 'connected' && stream != null;
      if (hasVideoFeed && error != null) {
        setError(null);
      }
    },
    [wsConnStatus, stream, error]
  );

  useEffect(
    () => {
      if (wsConnStatus === 'reconnecting' && recording) {
        handleRecordClick();
      }
    },
    [wsConnStatus, recording]
  );

  useEffect(
    () => {
      if (wsConnStatus === 'reconnecting') {
        if (micActive) setMicActive(false);
      }
    },
    [wsConnStatus, micActive]
  );

  return (
    <ErrorBoundary fallback={renderFallbackError}>
      <div
        role="alert"
        className="util-pos-rel util-z-1000"
      >
      {
        error && (
          <Alert
            type="danger"
            expandableLabel={error.details && 'Details'}
            expandableContent={
              error.details && (
                <div className="util-mt-2">
                  <JSONViewer>
                    {error.details}
                  </JSONViewer>
                </div>
              )
            }
            onDismiss={error.dismissable ? handleCloseAlert : undefined}
          >
            {error.message}
          </Alert>
        )
      }
      </div>
      {
        !['closed', 'failed'].includes(wsConnStatus as string) && (
          stream === null ||
          ['connecting', 'reconnecting'].includes(wsConnStatus as string)
        ) && (
          <div className="util-perfect-center util-z-1000">
            <Spinner size="medium" />
          </div>
        )
      }
      {
        stream && (
          <>
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
              className="util-fullscreen util-z-neg"
              autoPlay={true}
              muted={videoMuted}
              playsInline={true}
            />
          </>
        )
      }
      {
        Boolean(stream ?? previewSrc) && (
          <Navbar
            alignContent="center"
            stickToBottom={true}
          >
            <Controls
              previewingMedia={Boolean(previewSrc)}
              micActive={micActive}
              micEnabled={micEnabled}
              recordingEnabled={recordingEnabled}
              recording={recording}
              onToggleMic={handleToggleMic}
              onCancelMediaPreview={handleCancelMediaPreview}
              onDownloadMediaPreview={handleMediaDownload}
              onTakeScreenshot={handleTakeScreenshot}
              onRecord={handleRecordClick}
            />
          </Navbar>
        )
      }
      <MediaPreview previewSrc={previewSrc} />
    </ErrorBoundary>
  );
}
