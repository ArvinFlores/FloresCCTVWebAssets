import './styles/base.css';
import './styles/util.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from 'src/components/navbar';
import { Button } from 'src/components/button';
import { Spinner } from 'src/components/spinner';

export function App (): JSX.Element {
  return (
    <>
      <Navbar stickToBottom={true}>
        <Button
          outline={true}
          circular={true}
        >
          <FontAwesomeIcon
            icon={faVolumeHigh}
            size="2x"
          />
        </Button>
      </Navbar>
      <div className="util-perfect-center">
        <Spinner size="medium" />
      </div>
    </>
  );
}
