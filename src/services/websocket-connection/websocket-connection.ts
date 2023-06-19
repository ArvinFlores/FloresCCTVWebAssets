import { EventTargetDelegate } from 'src/util/event-target-delegate';
import type { CreateWebSocketI } from './interfaces';

/**
 * A wrapper around the native WebSocket class that provides automatic reconnect ability
 */
export class WebSocketConnection extends EventTargetDelegate {
  readonly url: string;
  readonly options: CreateWebSocketI;
  readonly protocols: string[];

  private reconnectAttempts: number;
  private forcedClosed: boolean;
  private timedOut: boolean;

  ws: WebSocket | null;

  constructor (
    url: string,
    protocols: string[] = [],
    {
      reconnectInterval = 1000,
      maxReconnectInterval = 30000,
      reconnectDecayFactor = 1.5,
      timeoutInterval = 2000,
      maxReconnectAttempts = null
    }: Partial<CreateWebSocketI> = {}
  ) {
    super();

    this.url = url;
    this.protocols = protocols;
    this.reconnectAttempts = 0;
    this.forcedClosed = false;
    this.timedOut = false;
    this.ws = null;
    this.options = {
      reconnectInterval,
      maxReconnectInterval,
      reconnectDecayFactor,
      timeoutInterval,
      maxReconnectAttempts
    };

    this.bindEvents();
    this.init();
  }

  bindEvents (): void {
    this.addEventListener('open', ev => { this.onopen(ev); });
    this.addEventListener('close', ev => { this.onclose(ev); });
    this.addEventListener('message', ev => { this.onmessage(ev); });
    this.addEventListener('error', ev => { this.onerror(ev); });
  }

  private init (): void {
    this.ws = new WebSocket(this.url, this.protocols);

    if (this.options.maxReconnectAttempts !== null) {
      if (this.reconnectAttempts > this.options.maxReconnectAttempts) {
        const event = new CustomEvent(
          'error',
          {
            detail: {
              code: 1006,
              reason: 'The maximum number of connection attempts has been exceeded'
            }
          }
        );

        this.dispatchEvent(event);

        return;
      }
    }

    let retryTimeout: NodeJS.Timeout;
    const timeout = setTimeout(
      () => {
        this.timedOut = true;
        this.ws?.close();
        this.timedOut = false;
      },
      this.options.timeoutInterval
    );

    this.ws.onopen = (event) => {
      clearTimeout(timeout);
      this.reconnectAttempts = 0;
      this.dispatchEvent(event);
    };

    this.ws.onclose = (event) => {
      clearTimeout(timeout);
      clearTimeout(retryTimeout);
      this.ws = null;
      if (this.forcedClosed) {
        this.dispatchEvent(event);
      } else {
        if (!this.timedOut) {
          this.dispatchEvent(event);
        }
        const {
          reconnectInterval,
          reconnectDecayFactor,
          maxReconnectInterval
        } = this.options;
        const interval = reconnectInterval * Math.pow(
          reconnectDecayFactor,
          this.reconnectAttempts
        );
        retryTimeout = setTimeout(
          () => {
            this.reconnectAttempts++;
            this.init();
          },
          Math.min(maxReconnectInterval, interval)
        );
      }
    };

    this.ws.onmessage = this.dispatchEvent.bind(this);

    this.ws.onerror = this.dispatchEvent.bind(this);
  }

  send (data): void {
    return this.ws?.send(data);
  }

  close (code: number = 1000, reason: string): void {
    this.forcedClosed = true;
    this.ws?.close(code, reason);
  }

  /* eslint-disable no-unused-vars */
  onopen (ev): void {}
  onclose (ev): void {}
  onmessage (ev): void {}
  onerror (ev): void {}
  /* eslint-enable no-unused-vars */
}
