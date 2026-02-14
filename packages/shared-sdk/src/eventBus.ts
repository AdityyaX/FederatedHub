import { EventCallback, EventPayload, EventBusInterface } from './types';

class EventBus implements EventBusInterface {
  private events: Map<string, Set<EventCallback>>;

  constructor() {
    this.events = new Map();
  }

  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(callback);

    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.events.delete(event);
        }
      }
    };
  }

  publish(event: string, data: any, source: string): void {
    const payload: EventPayload = {
      type: event,
      data,
      timestamp: Date.now(),
      source,
    };

    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in event callback for "${event}":`, error);
        }
      });
    }
  }

  clear(): void {
    this.events.clear();
  }

  getSubscriberCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  getEventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

export const eventBus = new EventBus();
