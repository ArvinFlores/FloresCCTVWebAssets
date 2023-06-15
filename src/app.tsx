import './styles/base.css';
import './styles/util.css';
import './app.css';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from 'src/components/navbar';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/spinner';
import { VideoFeed } from 'src/components/video-feed';
import { Alert } from 'src/components/alert';
import { JSONViewer } from 'src/components/json-viewer';
import type { GetRemoteStreamErrI } from 'src/services/get-remote-stream';

export function App (): JSX.Element {
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadError, setLoadError] = useState<GetRemoteStreamErrI | null>(null);
  const streamBusyErr = loadError?.code === 'STREAM_BUSY';
  const handleStreamStart = (): void => {
    setLoadingFeed(false);
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
                        {loadError.details}
                      </JSONViewer>
                    </div>
                  )
            }
          >
            {streamBusyErr ? loadError.message : 'There was a problem getting the camera feed'}
          </Alert>
        )
      }
      <Navbar stickToBottom={true}>
        <Button
          outline={true}
          circular={true}
        >
          <FontAwesomeIcon
            icon={faVolumeHigh}
            size="2x"
          />
        </Button>
      </Navbar>
      {
        loadingFeed && (
          <div className="util-perfect-center">
            <Spinner size="medium" />
          </div>
        )
      }
      <VideoFeed
        wsUrl="wss://192.168.1.213:9000/stream"
        className="app__video-feed"
        autoPlay={true}
        muted={true}
        onStreamStart={handleStreamStart}
        onError={setLoadError}
      />
    </>
  );
}
