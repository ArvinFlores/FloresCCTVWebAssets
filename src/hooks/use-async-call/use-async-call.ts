import {
  useState,
  useEffect
} from 'react';
import type {
  Status,
  IUseAsync,
  IUseAsyncOptions
} from './interfaces';

const cache = new Map();

export function useAsyncCall<Data> ({
  params,
  fn,
  lazy = false,
  canRetry = false,
  cache: cacheOptions,
  handleData,
  onSuccess,
  onError
}: IUseAsyncOptions<Data>): IUseAsync<Data> {
  const {
    key: cacheKey,
    handler: cacheHandler,
    shouldFetch: cacheShouldFetch
  } = cacheOptions ?? {};
  const controller = new AbortController();
  const [status, setStatus] = useState<Status>('idle');
  const [hasFetched, setHasFetched] = useState<boolean>(cache.has(cacheKey));
  const [data, setData] = useState<Data | null>(cache.get(cacheKey) ?? null);
  const [error, setError] = useState<Error | null>(null);
  const fetch = (): void => {
    const isUsingCache = cacheKey != null;
    const shouldFetch = cacheShouldFetch?.(cache.get(cacheKey)) ?? true;
    const hasCacheKey = !cacheShouldFetch && cache.has(cacheKey);
    if (isUsingCache && (hasCacheKey || !shouldFetch)) return;
    setStatus('loading');
    fn({
      params,
      cache,
      signal: controller.signal
    }).then((response) => {
      setHasFetched(true);
      setStatus('idle');
      setData((data) => handleData ? handleData(response, data) : response);
      onSuccess?.(response, cache);
      if (isUsingCache) {
        const value = typeof cacheHandler === 'function' ?
          cacheHandler(response, cache.get(cacheKey) ?? null) :
          response;

        cache.set(cacheKey, value);
      }
    }).catch((error) => {
      setStatus('error');
      setError(error);
      onError?.(error);
    });
  };

  useEffect(
    () => {
      if (!lazy && !cache.has(cacheKey)) {
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
