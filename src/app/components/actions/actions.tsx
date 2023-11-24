import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons/faVolumeXmark';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons/faVolumeHigh';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { classnames } from 'src/util/classnames';
import { Button } from 'src/components/button';
import type { ActionProps } from './interfaces';

export function Actions ({
  videoMuted,
  showMenu,
  recording,
  canGoBack,
  onVolumeClick,
  onMenuClick,
  onGoBackMenuClick
}: ActionProps): JSX.Element {
  return (
    <div
      className={classnames({
        'util-ml-2': true,
        'util-mr-2': true,
        'util-mt-2': true,
        'util-flex-container': true,
        'util-flex-container--h-sb': true,
        'util-pos-rel': canGoBack,
        'util-z-1000': canGoBack
      })}
    >
      {
        canGoBack ?
          (
            <>
              <div />
              <Button
                ariaLabel="Open recordings panel"
                variant="see-through"
                circular={true}
                onClick={onGoBackMenuClick}
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size="2x"
                />
              </Button>
            </>
          ) :
          (
            <>
              <Button
                ariaLabel={videoMuted ? 'Unmute video feed' : 'Mute video feed'}
                variant="see-through"
                circular={true}
                onClick={onVolumeClick}
              >
                <FontAwesomeIcon
                  icon={videoMuted ? faVolumeXmark : faVolumeHigh}
                  size="2x"
                />
              </Button>
              {
                showMenu || recording ?
                  null :
                  (
                    <Button
                      ariaLabel="Open recordings panel"
                      variant="see-through"
                      circular={true}
                      onClick={onMenuClick}
                    >
                      <FontAwesomeIcon
                        icon={faBars}
                        size="2x"
                      />
                    </Button>
                  )
              }
            </>
          )
      }
    </div>
  );
}
