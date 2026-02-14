/**
 * Core types for Micro-Frontend communication
 */

export interface MFEConfig {
  name: string;
  version: string;
  url: string;
}

export interface EventPayload {
  type: string;
  data: any;
  timestamp: number;
  source: string;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  metadata?: Record<string, any>;
}

export type EventCallback = (payload: EventPayload) => void;

export interface EventBusInterface {
  subscribe(event: string, callback: EventCallback): () => void;
  publish(event: string, data: any, source: string): void;
  clear(): void;
}
