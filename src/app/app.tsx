import '../styles/base.css';
import '../styles/util.css';
import './app.css';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeHigh,
  faVolumeXmark,
  faCamera,
  faXmark,
  faDownload,
  faMicrophone,
  faMicrophoneSlash
} from '@fortawesome/free-solid-svg-icons';
import { RECORDING_LIMIT_SECS } from 'config/app';
import { Navbar } from 'src/components/navbar';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/spinner';
import { VideoFeed, type VideoFeedRef } from 'src/components/video-feed';
import { Alert } from 'src/components/alert';
import { JSONViewer } from 'src/components/json-viewer';
import type { GetRemoteStreamErrI } from 'src/services/get-remote-stream';
import { takeScreenshot } from 'src/util/take-screenshot';
import { downloadLocalFile } from 'src/util/download-local-file';
import { RecordButton } from './components/record-button';

export function App (): JSX.Element {
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<GetRemoteStreamErrI | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [speakingEnabled, setSpeakingEnabled] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const videofeedRef = useRef<VideoFeedRef>(null);
  const recordingRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<MediaStream | null>(null);
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
  const handleToggleMic = (): void => {
    if (audioRef.current) {
      const audioTrack = audioRef.current.getAudioTracks()[0];
      const enabled = !audioTrack.enabled;

      audioTrack.enabled = enabled;
      setSpeakingEnabled(enabled);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const pc = videofeedRef.current?.stream?.getPeerConnection();
          audioRef.current = stream;
          if (pc) stream.getTracks().forEach(track => pc.addTrack(track, stream));
          setSpeakingEnabled(true);
        })
        .catch(console.error);
    }
  };
  const handleToggleVideoAudio = (): void => {
    setVideoMuted(muted => !muted);
  };

  return (
    <>
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
                        ariaLabel={speakingEnabled ? 'Turn off mic' : 'Turn on mic'}
                        outline={!speakingEnabled}
                        circular={true}
                        variant={speakingEnabled ? 'danger' : undefined}
                        onClick={handleToggleMic}
                      >
                        <FontAwesomeIcon
                          icon={speakingEnabled ? faMicrophone : faMicrophoneSlash}
                          size="2x"
                        />
                      </Button>
                    </li>
                    {
                      !recording && (
                        <li>
                          <Button
                            ariaLabel="Take screenshot"
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
                        ariaLabel={recording ? 'Stop recording' : 'Start recording'}
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
      <VideoFeed
        ref={videofeedRef}
        wsUrl="wss://192.168.1.213:9000/stream"
        className="app__media-preview app__media-preview--low-priority"
        autoPlay={true}
        muted={videoMuted}
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
