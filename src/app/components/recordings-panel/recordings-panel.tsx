import './recordings-panel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import type { FileStorage } from 'florescctvwebservice-types';
import { Button } from 'src/components/button';
import { OutsideClick } from 'src/components/outside-click';
import { StickyHeaderList } from 'src/components/sticky-header-list';
import { Spinner } from 'src/components/spinner';
import { useAsyncCall } from 'src/hooks/use-async-call';
import { florescctvClient } from 'src/services/florescctv-client';
import {
  ampmFormat,
  dateFormat,
  daysBetween,
  daysAgoFormat
} from 'src/util/datetime';
import { RecordingItem } from './components/recording-item';
import type { RecordingsPanelProps } from './interfaces';
import { createStickyHeaderItems } from './helpers';

export function RecordingsPanel ({
  onClose,
  onItemClick
}: RecordingsPanelProps): JSX.Element {
  const {
    data,
    hasFetched,
    status,
    fetch
  } = useAsyncCall<FileStorage.GetAllSuccess>({
    canRetry: true,
    params: ['create_date', 'desc', 10],
    fn: async (sortKey, sortOrder, pageSize) => await florescctvClient.recordings.getAll({
      pageSize,
      sortKey,
      sortOrder
    }),
    handleData: (data, prevData) => {
      if (!prevData) return data;

      return {
        ...data,
        files: [...prevData.files, ...data.files]
      };
    }
  });
  const handleOnEndScroll = (): void => {
    if (status === 'loading' || status === 'error') {
      return;
    }
    fetch?.();
  };
  const showSpinner = status === 'loading' && <Spinner size="small" />;
  const showError = status === 'error' && (
    <>
      <p>There was an error retrieving the recordings</p>
      <Button
        variant="primary"
        onClick={fetch}
      >
        Retry
      </Button>
    </>
  );

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
            className="util-mr-2 util-mt-2 recordings-panel__menu-btn"
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
                  <StickyHeaderList
                    items={createStickyHeaderItems(data.files).map(({ header, children }) => {
                      const itemDate = new Date(header);
                      const currYear = new Date().getFullYear();
                      const itemYear = itemDate.getFullYear();
                      const longFormat = itemYear === currYear ? 'mm dd' : 'mm dd, yyyy';
                      const dayDiff = daysBetween(new Date(), itemDate);

                      return {
                        header: dayDiff > 6 ? dateFormat(itemDate, longFormat) : daysAgoFormat(itemDate, true),
                        children: children.map((item) => {
                          const { id, thumbnail, created_at: createdAt } = item;

                          return (
                            <div
                              key={id}
                              onClick={onItemClick.bind(null, item)}
                            >
                              <RecordingItem
                                thumbnail={thumbnail}
                                label={ampmFormat(new Date(createdAt))}
                              />
                            </div>
                          );
                        })
                      };
                    })}
                    postContent={
                      data.nextPageToken != null ?
                        (
                          <div className="recordings-panel__spinner util-mt-2 util-ta-c">
                            {showSpinner}
                            {showError}
                          </div>
                        ) :
                        null
                    }
                    onEndReached={data.nextPageToken != null ? handleOnEndScroll : undefined}
                  />
                ) :
                (
                  <div className="util-perfect-center">
                    <p>The camera has not recorded anything</p>
                  </div>
                )
            ) :
            (
              <div className="util-perfect-center util-ta-c">
                {showSpinner}
                {showError}
              </div>
            )
        }
      </OutsideClick>
    </div>
  );
}
