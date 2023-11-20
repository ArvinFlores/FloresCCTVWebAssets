import './recordings-panel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { Button } from 'src/components/button';
import type { RecordingsPanelProps } from './interfaces';

export function RecordingsPanel ({ onClose }: RecordingsPanelProps): JSX.Element {
  return (
    <div className="recordings-panel util-z-2000">
      <div className="recordings-panel__content">
        <div className="util-flex-container util-flex-container--h-sb">
          <div />
          <Button
            ariaLabel="Close recordings panel"
            className="util-mr-2 util-mt-2"
            variant="see-through"
            circular={true}
            onClick={onClose}
          >
            <FontAwesomeIcon
              icon={faBars}
              size="2x"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
