import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import { Button } from 'src/components/button';
import type { ControlsToggleButtonProps } from './interfaces';

export function ControlsToggleButton ({
  isOpen,
  onClick
}: ControlsToggleButtonProps): JSX.Element {
  return (
    <Button
      ariaLabel={isOpen ? 'Close controls menu' : 'Open controls menu'}
      variant="see-through"
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={isOpen ? faAngleRight : faAngleLeft}
        size="2x"
      />
    </Button>
  );
}
