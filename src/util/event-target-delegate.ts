/**
 * A substitute for the native EventTarget class since babel seems to have issues extending native classes
 */
export class EventTargetDelegate implements EventTarget {
  private readonly events: Map<string, EventListenerOrEventListenerObject[]>;

  constructor () {
    this.events = new Map();
  }

  addEventListener (type: string, callback: EventListenerOrEventListenerObject | null): void {
    if (!this.events.has(type)) this.events.set(type, []);

    if (!callback) return;

    if (this.events.get(type)?.find(fn => fn === callback)) return;

    this.events.get(type)?.push(callback);
  }

  removeEventListener (type: string, callback: EventListenerOrEventListenerObject | null): void {
    if (!this.events.get(type)) return;

    this.events.set(
      type,
      this.events.get(type)?.filter(fn => fn !== callback) ?? []
    );

    if (!(this.events.get(type)?.length ?? 0)) this.events.delete(type);
  }

  dispatchEvent (event: Event): boolean {
    this.events.get(event.type)?.forEach(fn => {
      if (typeof fn === 'function') {
        fn(event);
      }
    });

    return event.cancelable;
  }
}
