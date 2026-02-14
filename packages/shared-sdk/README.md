# 📦 @federated-hub/shared-sdk

Shared SDK for inter-MFE communication in the FederatedHub platform.

## 🎯 Purpose

This SDK provides:
- **Event Bus** - Pub-Sub pattern for decoupled cross-MFE communication
- **Performance Tracker** - Monitor load times and custom metrics
- **Shared Types** - TypeScript definitions for type safety

## 🧠 Key Concepts

### Why Do We Need This?

In a Micro-Frontend architecture, **MFEs should NEVER directly import from each other**. This creates tight coupling and defeats the purpose of independent deployment.

Instead, they communicate through:
1. **Shared SDK** (this package) - For events and utilities
2. **Module Federation** - For runtime component loading

### Event Bus Pattern

The Event Bus implements **Pub-Sub** (Publish-Subscribe):

```typescript
// MFE #1 publishes an event
eventBus.publish('user:login', { userId: 123 }, 'analytics');

// MFE #2 subscribes to the event
const unsubscribe = eventBus.subscribe('user:login', (payload) => {
  console.log('User logged in:', payload.data.userId);
});
```

### Performance Tracking

Track how long things take:

```typescript
// Mark the start
performanceTracker.mark('mfe-load-start');

// ... load your MFE ...

// Measure the duration
performanceTracker.measureFromMark('mfe-load-time', 'mfe-load-start');

// View all metrics
performanceTracker.logMetrics();
```

## 📖 Usage

```typescript
import { 
  eventBus, 
  performanceTracker,
  EventPayload 
} from '@federated-hub/shared-sdk';

// Subscribe to events
const unsubscribe = eventBus.subscribe('data:updated', (payload) => {
  console.log('Received:', payload.data);
});

// Publish events
eventBus.publish('data:updated', { value: 42 }, 'dashboard');

// Track performance
performanceTracker.mark('render-start');
// ... do work ...
performanceTracker.measureFromMark('render-time', 'render-start');
```

## 🏗️ Architecture Decision

**Why Singleton Pattern?**

The Event Bus and Performance Tracker are singletons to ensure:
- All MFEs share the same instance
- Events published in one MFE reach subscribers in others
- Performance metrics are collected in one place

This is critical for Module Federation architecture.

## 📚 Learn More

- [Pub-Sub Pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
