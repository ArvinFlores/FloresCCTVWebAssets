export interface CreateWebSocketI {
  /**
   * The number of milliseconds to delay before attempting to reconnect
   */
  reconnectInterval: number;
  /**
   * The maximum number of milliseconds to delay a reconnection attempt
   */
  maxReconnectInterval: number;
  /**
   * The rate of increase of the reconnect delay for exponential backoff
   */
  reconnectDecayFactor: number;
  /**
   * The maximum time in milliseconds to wait for a connection to succeed before closing and retrying
   */
  timeoutInterval: number;
  /**
   * The maximum number of reconnection attempts to make, unlimited if null
   */
  maxReconnectAttempts: number | null;
}
