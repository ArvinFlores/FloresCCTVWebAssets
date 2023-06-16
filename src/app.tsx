import './styles/base.css';
import './styles/util.css';
import './app.css';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeHigh,
  faCamera,
  faXmark,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { RECORDING_LIMIT_SECS } from 'config/app';
import { Navbar } from 'src/components/navbar';
import { Button, RecordButton } from 'src/components/button';
import { Spinner } from 'src/components/spinner';
import { VideoFeed, type VideoFeedRef } from 'src/components/video-feed';
import { Alert } from 'src/components/alert';
import { JSONViewer } from 'src/components/json-viewer';
import type { GetRemoteStreamErrI } from 'src/services/get-remote-stream';
import { takeScreenshot } from 'src/util/take-screenshot';
import { downloadLocalFile } from 'src/util/download-local-file';

export function App (): JSX.Element {
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<GetRemoteStreamErrI | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const videofeedRef = useRef<VideoFeedRef>(null);
  const recordingRef = useRef<NodeJS.Timeout>();
  const streamBusyErr = loadError?.code === 'STREAM_BUSY';
  const handleStreamStart = (): void => {
    setLoadingFeed(false);
  };
  const handleTakeScreenshot = (): void => {
    if (videofeedRef?.current?.video) {
      setPreviewSrc(takeScreenshot(videofeedRef.current.video));
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
      videofeedRef.current?.stream?.stopVideoRecording();
      setRecording(false);
      recordingRef.current = undefined;
    };

    if (recording) {
      clearTimeout(recordingRef.current);
      stopRecording();
    } else {
      videofeedRef.current?.stream?.startVideoRecording();
      setRecording(true);
      recordingRef.current = setTimeout(stopRecording, RECORDING_LIMIT_SECS * 1000);
    }
  };
  const handleOnVideoRecorded = (blob: Blob): void => {
    setPreviewSrc(URL.createObjectURL(blob));
  };

  return (
    <>
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
      <Navbar
        alignContent="center"
        stickToBottom={true}
      >
        <ul className="util-list util-list--inline">
          {
            previewSrc ?
                (
                  <>
                    <li>
                      <Button onClick={handleCancelMediaPreview}>
                        <FontAwesomeIcon
                          className="util-mr-0"
                          icon={faXmark}
                        />
                        <span>Cancel</span>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="primary"
                        onClick={handleMediaDownload}
                      >
                        <FontAwesomeIcon
                          className="util-mr-0"
                          icon={faDownload}
                        />
                        <span>Download</span>
                      </Button>
                    </li>
                  </>
                ) :
                (
                  <>
                    <li>
                      <Button
                        outline={true}
                        circular={true}
                      >
                        <FontAwesomeIcon
                          icon={faVolumeHigh}
                          size="2x"
                        />
                      </Button>
                    </li>
                    {
                      !recording && (
                        <li>
                          <Button
                            circular={true}
                            onClick={handleTakeScreenshot}
                          >
                            <FontAwesomeIcon
                              icon={faCamera}
                              size="2x"
                            />
                          </Button>
                        </li>
                      )
                    }
                    <li>
                      <RecordButton
                        active={recording}
                        duration={RECORDING_LIMIT_SECS}
                        onClick={handleRecordClick}
                      />
                    </li>
                  </>
                )
          }
        </ul>
      </Navbar>
      {
        loadingFeed && (
          <div className="util-perfect-center">
            <Spinner size="medium" />
          </div>
        )
      }
      <VideoFeed
        ref={videofeedRef}
        wsUrl="wss://192.168.1.213:9000/stream"
        className="app__media-preview app__media-preview--low-priority"
        autoPlay={true}
        muted={true}
        onStreamStart={handleStreamStart}
        onError={setLoadError}
        onVideoRecorded={handleOnVideoRecorded}
      />
      {
        previewSrc.startsWith('data:') && (
          <img
            className="app__media-preview app__media-preview--high-priority"
            src={previewSrc}
          />
        )
      }
      {
        previewSrc.startsWith('blob:') && (
          <video
            className="app__media-preview app__media-preview--high-priority"
            src={previewSrc}
            autoPlay={true}
            muted={true}
            loop={true}
          />
        )
      }
    </>
  );
}
