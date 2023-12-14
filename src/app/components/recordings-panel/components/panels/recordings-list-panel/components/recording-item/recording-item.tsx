import './recording-item.css';

import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Img } from 'src/components/img';
import type { RecordingItemProps } from './interfaces';

export function RecordingItem ({
  thumbnail,
  label
}: RecordingItemProps): JSX.Element {
  const errorFallback = (
    <div className="recording-item__img recording-item__img-border util-pos-rel">
      <div className="util-perfect-center">
        <FontAwesomeIcon
          icon={faVideo}
          size="5x"
        />
      </div>
    </div>
  );

  return (
    <div className="recording-item util-list--inline">
      {
        thumbnail ?
          (
            <Img
              className="recording-item__img"
              referrerPolicy="no-referrer"
              src={thumbnail}
              errorFallback={errorFallback}
            />
          ) :
          errorFallback
      }
      <p className="recording-item__label util-ml-2">{label}</p>
    </div>
  );
}
