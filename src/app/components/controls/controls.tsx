import './controls.css';

import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons/faMicrophone';
import { faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons/faMicrophoneSlash';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faCompress } from '@fortawesome/free-solid-svg-icons/faCompress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RECORDING_LIMIT_SECS } from 'config/app';
import { Button } from 'src/components/button';
import { RecordButton } from './components/record-button';
import type { ControlsProps } from './interfaces';

export function Controls ({
  previewingMedia,
  micActive,
  micEnabled,
  recording,
  recordingEnabled,
  scaled,
  onToggleMic,
  onCancelMediaPreview,
  onDownloadMediaPreview,
  onTakeScreenshot,
  onRecord,
  onDelete,
  onToggleScale
}: ControlsProps): JSX.Element {
  return (
    <ul className="util-list util-list--inline">
      {
        previewingMedia ?
          (
            <>
              {
                onCancelMediaPreview && (
                  <li>
                    <Button onClick={onCancelMediaPreview}>
                      <FontAwesomeIcon
                        className="util-mr-0"
                        icon={faXmark}
                      />
                      <span>Cancel</span>
                    </Button>
                  </li>
                )
              }
              {
                onDelete && (
                  <li>
                    <Button
                      variant="danger"
                      onClick={onDelete}
                    >
                      <FontAwesomeIcon
                        className="util-mr-0"
                        icon={faTrash}
                      />
                      <span>Delete</span>
                    </Button>
                  </li>
                )
              }
              {
                onDownloadMediaPreview && (
                  <li>
                    <Button
                      variant="primary"
                      onClick={onDownloadMediaPreview}
                    >
                      <FontAwesomeIcon
                        className="util-mr-0"
                        icon={faDownload}
                      />
                      <span>Download</span>
                    </Button>
                  </li>
                )
              }
            </>
          ) :
          (
            <>
              <li>
                <Button
                  ariaLabel={micActive ? 'Turn off mic' : 'Turn on mic'}
                  className="controls__btn"
                  outline={!micActive}
                  circular={true}
                  variant={micActive ? 'danger' : undefined}
                  disabled={!micEnabled}
                  onClick={onToggleMic}
                >
                  <FontAwesomeIcon
                    icon={micActive ? faMicrophone : faMicrophoneSlash}
                    size="2x"
                  />
                </Button>
              </li>
              {
                !recording && (
                  <li>
                    <Button
                      ariaLabel="Take screenshot"
                      className="controls__btn"
                      circular={true}
                      onClick={onTakeScreenshot}
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
                  className="controls__btn"
                  active={recording}
                  duration={RECORDING_LIMIT_SECS}
                  disabled={!recordingEnabled}
                  onClick={onRecord}
                />
              </li>
              <li>
                <Button
                  ariaLabel={scaled ? 'Minimize camera view' : 'Maximize camera view'}
                  className="controls__btn"
                  circular={true}
                  onClick={onToggleScale}
                >
                  <FontAwesomeIcon
                    icon={scaled ? faCompress : faExpand}
                    size="2x"
                  />
                </Button>
              </li>
            </>
          )
      }
    </ul>
  );
}
