/**
 * @federated-hub/shared-sdk
 * 
 * Shared SDK for Micro-Frontend communication and utilities
 * 
 * Features:
 * - Event Bus for pub-sub communication
 * - Performance tracking utilities
 * - Shared TypeScript types
 */

// Export event bus
export { eventBus } from './eventBus';

// Export performance tracker
export { performanceTracker, withPerformanceTracking } from './performance';

// Export types
export type {
  MFEConfig,
  EventPayload,
  EventCallback,
  EventBusInterface,
  PerformanceMetric,
} from './types';

// Version
export const SDK_VERSION = '1.0.0';
