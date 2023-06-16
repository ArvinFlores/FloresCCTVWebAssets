import './record-button.css';

import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../button';
import type { RecordButtonProps } from './interfaces';

export function RecordButton ({
  active,
  duration,
  onClick
}: RecordButtonProps): JSX.Element {
  if (active) {
    return (
      <button
        className="record-button--active"
        onClick={onClick}
      >
        <FontAwesomeIcon
          className="record-button__icon--active"
          size="2x"
          icon={faVideo}
        />
        <svg
          className="record-button__ring--active"
          height="65"
          width="65"
          style={{ animationDuration: `${duration}s` }}
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="red"
            strokeWidth="6"
            fill="transparent"
          />
        </svg>
      </button>
    );
  }

  return (
    <Button
      circular={true}
      outline={true}
      variant="danger"
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faVideo}
        size="2x"
      />
    </Button>
  );
}
