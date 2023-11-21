import {
  useState,
  useEffect
} from 'react';
import type {
  Status,
  IUseAsync,
  IUseAsyncOptions
} from './interfaces';

export function useAsyncCall<Data> ({
  params,
  fn,
  lazy = false,
  canRetry = false,
  handleData
}: IUseAsyncOptions<Data>): IUseAsync<Data> {
  const [status, setStatus] = useState<Status>('idle');
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const fetch = (): void => {
    setStatus('loading');
    fn(...params).then((response) => {
      setHasFetched(true);
      setStatus('idle');
      setData(handleData ? handleData(response, data) : response);
    }).catch((error) => {
      setStatus('error');
      setError(error);
    });
  };

  useEffect(
    () => {
      if (!lazy) {
        fetch();
      }
    },
    [...params]
  );

  return {
    status,
    data,
    error,
    hasFetched,
    fetch: lazy || canRetry ? fetch : undefined
  };
}
