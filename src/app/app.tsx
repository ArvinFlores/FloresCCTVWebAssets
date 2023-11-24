import '../styles/base.css';
import '../styles/util.css';

import { useState, useRef, useEffect } from 'react';
import type { FileStorage } from 'florescctvwebservice-types';
import { RECORDING_LIMIT_SECS } from 'config/app';
import { Navbar } from 'src/components/navbar';
import { Alert } from 'src/components/alert';
import { JSONViewer } from 'src/components/json-viewer';
import { ErrorBoundary } from 'src/components/error-boundary';
import { Video } from 'src/components/media';
import { Spinner } from 'src/components/spinner';
import { Fixed } from 'src/components/fixed';
import { useRemoteStream } from 'src/hooks/use-remote-stream';
import { takeScreenshot } from 'src/util/take-screenshot';
import { downloadLocalFile } from 'src/util/download-local-file';
import { Controls } from './components/controls';
import { MediaPreview } from './components/media-preview';
import { StreamsPreview } from './components/streams-preview';
import { RecordingsPanel } from './components/recordings-panel';
import { Actions } from './components/actions';
import type { AppError } from './interfaces';

export function App (): JSX.Element {
  const [error, setError] = useState<AppError | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [recordingEnabled, setRecordingEnabled] = useState<boolean>(true);
  const [recording, setRecording] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const [showRecordingsPanel, setShowRecordingsPanel] = useState<boolean>(false);
  const recordedItemRef = useRef<FileStorage.File | null>(null);
  const videofeedRef = useRef<HTMLVideoElement | null>(null);
  const recordingRef = useRef<NodeJS.Timeout>();
  const {
    activeStream,
    streams,
    wsConnStatus,
    startVideoRecording,
    stopVideoRecording,
    hasLocalStream,
    addLocalStream,
    toggleLocalAudio,
    setActiveStream
  } = useRemoteStream({
    wsUrl: JANUS_URL || `wss://${CAMERA_IP}:9000/stream`,
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
    recordedItemRef.current = null;
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
      if (activeStream === null) return;
      const stopRecording = (): void => {
        stopVideoRecording?.();
        recordingRef.current = undefined;
      };
      if (recording) {
        clearTimeout(recordingRef.current);
        stopRecording();
      } else {
        startVideoRecording?.(activeStream);
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
        .then((stream) => {
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
    setVideoMuted((muted) => !muted);
  };
  const handleCloseAlert = (): void => {
    setError(null);
  };
  const handleToggleRecordingsPanel = (): void => {
    setShowRecordingsPanel((show) => !show);
  };
  const handleGoBackRecordingsPanel = (): void => {
    recordedItemRef.current = null;
    setShowRecordingsPanel(true);
    setPreviewSrc('');
  };
  const handleOnSelectRecordingItem = (item: FileStorage.File): void => {
    recordedItemRef.current = item;
    setPreviewSrc(item.src);
    setShowRecordingsPanel(false);
  };
  const handleOnDeleteRecordingItem = (): void => {
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
      const hasVideoFeed = wsConnStatus === 'connected' && activeStream != null;
      if (hasVideoFeed && error != null) {
        setError(null);
      }
    },
    [wsConnStatus, activeStream, error]
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
      if (wsConnStatus === 'reconnecting' && micActive) {
        setMicActive(false);
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
          activeStream === null ||
          ['connecting', 'reconnecting'].includes(wsConnStatus as string)
        ) && (
          <div className="util-perfect-center util-z-1000">
            <Spinner size="medium" />
          </div>
        )
      }
      {
        activeStream && (
          <>
            {
              previewSrc && !recordedItemRef.current ?
                null :
                (
                  <Actions
                    videoMuted={videoMuted}
                    showMenu={showRecordingsPanel}
                    recording={recording}
                    canGoBack={recordedItemRef.current != null}
                    onVolumeClick={handleToggleVideoAudio}
                    onMenuClick={handleToggleRecordingsPanel}
                    onGoBackMenuClick={handleGoBackRecordingsPanel}
                  />
                )
            }
            {
              !recordedItemRef.current && (
                <Video
                  ref={videofeedRef}
                  srcObject={activeStream.stream}
                  className="util-fullscreen util-z-neg"
                  autoPlay={true}
                  muted={videoMuted}
                  playsInline={true}
                />
              )
            }
            {
              showRecordingsPanel && (
                <RecordingsPanel
                  onClose={handleToggleRecordingsPanel}
                  onItemClick={handleOnSelectRecordingItem}
                />
              )
            }
          </>
        )
      }
      {
        Boolean(activeStream ?? previewSrc) && (
          <Fixed
            direction="bottom"
            className="util-z-1000"
          >
            {
              streams.length > 0 && (
                <div className="util-ml-2 util-mb-2">
                  <StreamsPreview
                    streams={streams}
                    audioMuted={videoMuted}
                    onVideoPreviewClick={setActiveStream}
                  />
                </div>
              )
            }
            <Navbar alignContent="center">
              <Controls
                previewingMedia={Boolean(previewSrc)}
                micActive={micActive}
                micEnabled={micEnabled}
                recordingEnabled={recordingEnabled}
                recording={recording}
                onCancelMediaPreview={handleCancelMediaPreview}
                onDownloadMediaPreview={recordedItemRef.current ? undefined : handleMediaDownload}
                onDelete={recordedItemRef.current ? handleOnDeleteRecordingItem : undefined}
                onToggleMic={handleToggleMic}
                onTakeScreenshot={handleTakeScreenshot}
                onRecord={handleRecordClick}
              />
            </Navbar>
          </Fixed>
        )
      }
      <MediaPreview
        previewSrc={previewSrc}
        muteVideo={!recordedItemRef.current}
      />
    </ErrorBoundary>
  );
}
