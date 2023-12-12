import type { FileStorage } from 'florescctvwebservice-types';
import { useRef } from 'react';
import { useAsyncCall } from 'src/hooks/use-async-call';
import { florescctvClient } from 'src/services/florescctv-client';
import { Spinner } from 'src/components/spinner';
import { StickyHeaderList } from 'src/components/sticky-header-list';
import {
  ampmFormat,
  dateFormat,
  daysBetween,
  daysAgoFormat
} from 'src/util/datetime';
import { ErrorMessage } from '../../error-message';
import { RecordingItem } from './components/recording-item';
import { createStickyHeaderItems } from './helpers';
import type { RecordingsListPanelProps } from './interfaces';

export function RecordingsListPanel ({ onItemClick }: RecordingsListPanelProps): JSX.Element {
  const pageTokenRef = useRef<null | string>(null);
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
      pageSize: params[2],
      pageToken: pageTokenRef.current ?? undefined
    }, { signal }),
    handleData: (data, prevData) => {
      if (!prevData) return data;

      return {
        ...data,
        files: [...prevData.files, ...data.files]
      };
    },
    onSuccess: (data) => {
      pageTokenRef.current = data.nextPageToken ?? null;
    }
  });
  const handleOnEndScroll = (): void => {
    if (status === 'loading' || status === 'error') {
      return;
    }
    fetch?.();
  };
  const showError = status === 'error' && (
    <ErrorMessage
      message="There was an error retrieving the recordings"
      onRetry={fetch}
    />
  );

  if (!hasFetched) {
    return (
      <div className="util-perfect-center">
        {status === 'loading' && <Spinner size="small" />}
        {showError}
      </div>
    );
  }

  if (!data || data.files.length === 0) {
    return (
      <div className="util-perfect-center">
        <p>The camera has not recorded anything yet</p>
      </div>
    );
  }

  return (
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
        data.nextPageToken != null && (
          <div className="util-mb-3 util-mt-3 util-ta-c">
            {status !== 'error' && <Spinner size="small" />}
            {showError}
          </div>
        )
      }
      onEndReached={data.nextPageToken != null ? handleOnEndScroll : undefined}
    />
  );
}
