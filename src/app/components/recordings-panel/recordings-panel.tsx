import './recordings-panel.css';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
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
import { classnames } from 'src/util/classnames';
import { isDebugMode } from 'src/util/env';
import { RecordingItem } from './components/recording-item';
import { HealthCheckPanel } from './components/health-check-panel';
import type { RecordingsPanelProps } from './interfaces';
import { createStickyHeaderItems } from './helpers';

export function RecordingsPanel ({
  onClose,
  onItemClick
}: RecordingsPanelProps): JSX.Element {
  const initialPanel = 'recordings';
  const [activePanel, setActivePanel] = useState<'recordings' | 'health'>(initialPanel);
  const {
    data,
    hasFetched,
    status,
    fetch
  } = useAsyncCall<FileStorage.GetAllSuccess>({
    canRetry: true,
    params: ['create_date', 'desc', 10],
    fn: async ({
      params,
      signal
    }) => await florescctvClient.recordings.getAll({
      sortKey: params[0],
      sortOrder: params[1],
      pageSize: params[2]
    }, { signal }),
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
        {
          activePanel === 'recordings' && (
            hasFetched ?
              (
                data?.files && data.files.length > 0 ?
                  (
                    <StickyHeaderList
                      height="calc(100% - 75px)"
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
                            <div className="util-mb-3 util-mt-3 util-ta-c">
                              {status !== 'error' && <Spinner size="small" />}
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
                      <p>The camera has not recorded anything yet</p>
                    </div>
                  )
              ) :
              (
                <div className="util-perfect-center util-ta-c">
                  {status === 'loading' && <Spinner size="small" />}
                  {showError}
                </div>
              )
          )
        }
        <div className="recordings-panel__scrollable">
          {activePanel === 'health' && <HealthCheckPanel />}
        </div>
      </OutsideClick>
    </div>
  );
}
