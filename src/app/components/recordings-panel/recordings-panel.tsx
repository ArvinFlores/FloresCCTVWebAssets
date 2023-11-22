import './recordings-panel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { Button } from 'src/components/button';
import { OutsideClick } from 'src/components/outside-click';
import { StickyHeaderList } from 'src/components/sticky-header-list';
import { Spinner } from 'src/components/spinner';
import { useAsyncCall } from 'src/hooks/use-async-call';
import { florescctvClient } from 'src/services/florescctv-client';
import type { RecordingsPanelProps } from './interfaces';

export function RecordingsPanel ({ onClose }: RecordingsPanelProps): JSX.Element {
  const {
    data,
    hasFetched,
    status,
    fetch
  } = useAsyncCall({
    canRetry: true,
    params: ['create_date', 'desc', 10],
    fn: async (sortKey, sortOrder, pageSize) => await florescctvClient.recordings.getAll({
      pageSize,
      sortKey,
      sortOrder
    })
  });

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
        {
          hasFetched ?
            (
              data?.files && data.files.length > 0 ?
                (
                  <StickyHeaderList items={[]} />
                ) :
                (
                  <div className="util-perfect-center">
                    <p>The camera has not recorded anything</p>
                  </div>
                )
            ) :
            (
              <div className="util-perfect-center util-ta-c">
                {status === 'loading' && <Spinner size="small" />}
                {
                  status === 'error' && (
                    <>
                      <p>There was an error retrieving the recordings</p>
                      <Button
                        variant="primary"
                        onClick={fetch}
                      >
                        Retry
                      </Button>
                    </>
                  )
                }
              </div>
            )
        }
      </OutsideClick>
    </div>
  );
}
