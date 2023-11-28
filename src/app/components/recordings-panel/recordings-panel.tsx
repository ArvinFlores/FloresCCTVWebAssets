import './recordings-panel.css';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { Button } from 'src/components/button';
import { OutsideClick } from 'src/components/outside-click';
import { classnames } from 'src/util/classnames';
import { isDebugMode } from 'src/util/env';
import { HealthCheckPanel } from './components/panels/health-check-panel';
import { RecordingsListPanel } from './components/panels/recordings-list-panel';
import type { RecordingsPanelProps } from './interfaces';

export function RecordingsPanel ({
  onClose,
  onRecordingItemClick
}: RecordingsPanelProps): JSX.Element {
  const initialPanel = 'recordings';
  const [activePanel, setActivePanel] = useState<'recordings' | 'health'>(initialPanel);

  return (
    <div className="recordings-panel util-z-2000">
      <OutsideClick
        className="recordings-panel__content"
        onClick={onClose}
      >
        <div
          className={classnames({
            'recordings-panel__header': true,
            'util-flex-container': true,
            'util-flex-container--h-left': activePanel !== initialPanel,
            'util-flex-container--h-right': activePanel === initialPanel,
            'util-mr-2': true,
            'util-mt-2': true
          })}
        >
          {
            activePanel === initialPanel ?
              (
                <>
                  {
                    isDebugMode() && (
                      <Button
                        ariaLabel="Open camera health panel"
                        variant="see-through"
                        circular={true}
                        onClick={() => {
                          setActivePanel('health');
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faWrench}
                          size="2x"
                        />
                      </Button>
                    )
                  }
                  <Button
                    ariaLabel="Close recordings panel"
                    className="recordings-panel__menu-btn"
                    variant="see-through"
                    circular={true}
                    onClick={onClose}
                  >
                    <FontAwesomeIcon
                      icon={faBars}
                      size="2x"
                    />
                  </Button>
                </>
              ) :
              (
                <Button
                  ariaLabel="Go back to main panel"
                  variant="see-through"
                  circular={true}
                  onClick={() => {
                    setActivePanel('recordings');
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    size="2x"
                  />
                </Button>
              )
          }
        </div>
        {activePanel === 'recordings' && <RecordingsListPanel onItemClick={onRecordingItemClick} />}
        <div className="recordings-panel__scrollable">
          {activePanel === 'health' && <HealthCheckPanel />}
        </div>
      </OutsideClick>
    </div>
  );
}
