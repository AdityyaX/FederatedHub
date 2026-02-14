/**
 * Event Bus for cross-MFE communication
 * 
 * This implements the Pub-Sub pattern for decoupled communication
 * between micro-frontends without direct dependencies.
 */

import { EventCallback, EventPayload, EventBusInterface } from './types';

class EventBus implements EventBusInterface {
  private events: Map<string, Set<EventCallback>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   * @param event - Event name to listen for
   * @param callback - Function to call when event is published
   * @returns Unsubscribe function
   */
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(callback);

    // Return unsubscribe function
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

  /**
   * Publish an event to all subscribers
   * @param event - Event name
   * @param data - Data to send with event
   * @param source - Name of the MFE publishing the event
   */
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

  /**
   * Clear all event subscriptions
   */
  clear(): void {
    this.events.clear();
  }

  /**
   * Get count of subscribers for an event
   */
  getSubscriberCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * Get all registered event names
   */
  getEventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

// Singleton instance
export const eventBus = new EventBus();
