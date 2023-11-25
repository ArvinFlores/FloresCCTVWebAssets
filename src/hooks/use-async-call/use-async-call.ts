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
  handleData,
  onSuccess
}: IUseAsyncOptions<Data>): IUseAsync<Data> {
  const controller = new AbortController();
  const [status, setStatus] = useState<Status>('idle');
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const fetch = (): void => {
    setStatus('loading');
    fn({
      params,
      signal: controller.signal
    }).then((response) => {
      setHasFetched(true);
      setStatus('idle');
      setData((data) => handleData ? handleData(response, data) : response);
      onSuccess?.();
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

      return () => {
        controller.abort();
      };
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
