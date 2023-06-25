import { EventTargetDelegate } from 'src/util/event-target-delegate';
import type {
  CreateWebSocketI,
  ConnectionStateChangeEvent,
  ConnectionErrorEvent
} from './interfaces';

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
  private hasConnectedOnce: boolean;

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
    this.hasConnectedOnce = false;
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
    this.addEventListener(
      'connection-state-change',
      (ev: CustomEvent<ConnectionStateChangeEvent>) => { this.onconnectionstatechange(ev); }
    );
  }

  private init (): void {
    if (this.options.maxReconnectAttempts !== null) {
      if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
        const event = new CustomEvent<ConnectionErrorEvent>(
          'error',
          {
            detail: {
              code: 'CONN_MAX_RETRIES_EXCEEDED',
              message: 'The maximum number of connection attempts has been exceeded'
            }
          }
        );

        this.dispatchEvent(event);
        this.dispatchEvent(new CustomEvent<ConnectionStateChangeEvent>(
          'connection-state-change',
          { detail: { status: 'failed' } }
        ));

        return;
      }
    }

    this.ws = new WebSocket(this.url, this.protocols);

    if (this.hasConnectedOnce) {
      this.dispatchEvent(new CustomEvent<ConnectionStateChangeEvent>(
        'connection-state-change',
        { detail: { status: 'reconnecting' } }
      ));
    } else {
      this.dispatchEvent(new CustomEvent<ConnectionStateChangeEvent>(
        'connection-state-change',
        { detail: { status: 'connecting' } }
      ));
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
      this.dispatchEvent(new CustomEvent<ConnectionStateChangeEvent>(
        'connection-state-change',
        { detail: { status: 'connected' } }
      ));
      clearTimeout(timeout);
      this.reconnectAttempts = 0;
      this.hasConnectedOnce = true;
      this.dispatchEvent(event);
    };

    this.ws.onclose = (event) => {
      clearTimeout(timeout);
      clearTimeout(retryTimeout);
      this.ws = null;
      if (this.forcedClosed) {
        this.dispatchEvent(event);
        this.dispatchEvent(new CustomEvent<ConnectionStateChangeEvent>(
          'connection-state-change',
          { detail: { status: 'closed' } }
        ));
      } else {
        if (!this.timedOut) {
          this.dispatchEvent(event);
        }
        if (this.reconnectAttempts > 0) {
          this.dispatchEvent(new CustomEvent<ConnectionErrorEvent>(
            'error',
            {
              detail: {
                code: 'CONN_RETRY_FAILED',
                message: 'The websocket failed to establish a connection'
              }
            }
          ));
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

  close (code: number = 1000, reason?: string): void {
    this.forcedClosed = true;
    this.ws?.close(code, reason);
  }

  /* eslint-disable no-unused-vars */
  onopen (ev): void {}
  onclose (ev): void {}
  onmessage (ev): void {}
  onerror (ev): void {}
  onconnectionstatechange (ev: CustomEvent<ConnectionStateChangeEvent>): void {}
  /* eslint-enable no-unused-vars */
}
