import './recordings-panel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { Button } from 'src/components/button';
import { OutsideClick } from 'src/components/outside-click';
import type { RecordingsPanelProps } from './interfaces';

export function RecordingsPanel ({ onClose }: RecordingsPanelProps): JSX.Element {
  return (
    <div className="recordings-panel util-z-2000">
      <OutsideClick
        className="recordings-panel__content"
        onClick={onClose}
      >
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
      </OutsideClick>
    </div>
  );
}
