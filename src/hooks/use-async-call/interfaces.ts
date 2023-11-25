export type Status = 'idle' | 'loading' | 'error';

interface AsyncFnArgs {
  params: any[];
  signal: AbortSignal;
}

export interface IUseAsyncOptions<Data> {
  /**
   * The params to provide to fn
   * Note: Referential equality checks are performed on param values, the use of objects might cause unwanted rerenders
   */
  params: any[];
  /**
   * The async function to call
   */
  fn: (args: AsyncFnArgs) => Promise<Data>;
  /**
   * A handler to handle data from an async call, useful if you need to manipulate
   * how data is stored in the hook
   */
  handleData?: (data: Data, prevData: Data | null) => Data;
  /**
   * If true will not fire the async call on mount
   * IUseAsync.fetch will be provided in order to manually make the call
   */
  lazy?: boolean;
  /**
   * If true will allow retrying failed calls on error
   * IUseAsync.fetch will be provided in order to manually make the call
   */
  canRetry?: boolean;
  /**
   * A handler when the call resolves successfully
   */
  onSuccess?: () => void;
  /**
   * A handler when the call fails
   */
  onError?: (err: Error) => void;
}

export interface IUseAsync<Data> {
  /**
   * The status of the async call
   */
  status: Status;
  /**
   * The data from the result of making the async call
   */
  data: Data | null;
  /**
   * Error received from the result of making the async call
   */
  error: Error | null;
  /**
   * Determines if the async call has resolved successfully at least once
   */
  hasFetched: boolean;
  /**
   * Handler for manually making the async call
   * Will use whatever params are currently set for the hook
   */
  fetch?: () => void;
}
