import './record-button.css';

import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'src/components/button';
import type { RecordButtonProps } from './interfaces';

export function RecordButton ({
  active,
  duration,
  ariaLabel,
  disabled,
  onClick
}: RecordButtonProps): JSX.Element {
  if (active) {
    return (
      <button
        aria-label={ariaLabel}
        className="record-button--active"
        disabled={disabled}
        onClick={onClick}
      >
        <FontAwesomeIcon
          className="record-button__icon--active"
          size="2x"
          icon={faVideo}
        />
        <svg
          className="record-button__ring--active"
          height="60"
          width="60"
          style={{ animationDuration: `${duration}s` }}
        >
          <circle
            cx="30"
            cy="30"
            r="27"
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
      ariaLabel={ariaLabel}
      circular={true}
      outline={true}
      variant={disabled ? undefined : 'danger'}
      disabled={disabled}
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faVideo}
        size="2x"
      />
    </Button>
  );
}
