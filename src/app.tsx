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
import { Navbar } from 'src/components/navbar';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/spinner';
import { VideoFeed, type VideoFeedRef } from 'src/components/video-feed';
import { Alert } from 'src/components/alert';
import { JSONViewer } from 'src/components/json-viewer';
import type { GetRemoteStreamErrI } from 'src/services/get-remote-stream';
import { takeScreenshot } from 'src/util/take-screenshot';
import { downloadLocalFile } from 'src/util/download-local-file';

export function App (): JSX.Element {
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadError, setLoadError] = useState<GetRemoteStreamErrI | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const videofeedRef = useRef<VideoFeedRef>(null);
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
    setPreviewSrc('');
  };
  const handleMediaDownload = (): void => {
    downloadLocalFile(previewSrc);
    setPreviewSrc('');
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
      />
      {
        previewSrc && (
          <img
            className="app__media-preview app__media-preview--high-priority"
            src={previewSrc}
          />
        )
      }
    </>
  );
}
