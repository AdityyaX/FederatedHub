# 🏛️ FederatedHub Architecture

Deep dive into the Micro-Frontend architecture, design decisions, and implementation details.

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (User)                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Shell (Host) - Port 3000                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Module Federation Container                       │ │
│  │  - Loads remoteEntry.js from remotes              │ │
│  │  - Provides shared React (singleton)              │ │
│  │  - Error Boundaries for isolation                 │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│  Analytics MFE       │      │  Dashboard MFE       │
│  Port 3001           │      │  Port 3002           │
│  - Exposes: ./App    │      │  - Exposes: ./App    │
│  - remoteEntry.js    │      │  - remoteEntry.js    │
└──────────────────────┘      └──────────────────────┘
           │                              │
           └──────────────┬───────────────┘
                          ▼
            ┌───────────────────────────┐
            │   Shared SDK (Singleton)   │
            │   - Event Bus             │
            │   - Performance Tracker   │
            │   - Shared Types          │
            └───────────────────────────┘
```

---

## 🔑 Core Concepts

### 1. Module Federation

**What is it?**
Webpack 5 Module Federation allows multiple independent builds to form a single application. Apps can dynamically load code from other apps at **runtime**.

**Key Benefits:**
- ✅ Independent deployment
- ✅ No build-time coupling
- ✅ Share dependencies efficiently
- ✅ Team autonomy

**How it works:**

#### Host Configuration (Shell)
```javascript
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    analytics: 'analytics@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
  },
})
```

#### Remote Configuration (Analytics)
```javascript
new ModuleFederationPlugin({
  name: 'analytics',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
  },
  shared: {
    react: { singleton: true },
  },
})
```

---

### 2. The remoteEntry.js File

**What is it?**
A manifest file that describes what a remote exposes and what dependencies it needs.

**Loading Flow:**
```
1. Shell loads:     http://localhost:3001/remoteEntry.js
2. remoteEntry.js:  "I expose './App' and need React 18"
3. Shell checks:    "I have React 18, use mine (singleton)"
4. Shell imports:   import('analytics/App')
5. Webpack loads:   Actual component code
6. Shell renders:   <Analytics />
```

**Why it matters:**
- Enables runtime discovery
- Manages version negotiation
- Coordinates shared dependencies

---

### 3. Singleton Dependencies

**Problem:**
If Shell loads React 18.2.0 and Analytics loads React 18.1.0, you get **TWO** React instances. This breaks:
- React Context
- React Hooks
- React DevTools

**Solution: Singleton**
```javascript
shared: {
  react: {
    singleton: true,        // Only ONE instance
    requiredVersion: '^18.2.0',
  }
}
```

**What happens:**
- Shell loads React first (eager: true)
- Analytics asks: "Need React ^18.2.0"
- Webpack responds: "Use the one from Shell"
- Result: ONE shared React instance ✅

---

### 4. Error Boundaries

**Why critical for MFEs?**

In a monolith:
```
Component crashes → Entire app crashes 💥
```

In Micro-Frontends:
```
Analytics crashes → Error Boundary catches it
                 → Dashboard still works ✅
                 → Shell still works ✅
```

**Implementation:**
```tsx
<ErrorBoundary name="Analytics MFE">
  <Suspense fallback={<Loading />}>
    <AnalyticsApp />
  </Suspense>
</ErrorBoundary>
```

**Benefits:**
- Fault isolation
- Better UX
- Debugging information
- Graceful degradation

---

### 5. Event Bus (Pub-Sub Pattern)

**Why not direct imports?**

❌ **Bad:**
```typescript
// Dashboard importing from Analytics directly
import { data } from 'analytics/store';  // Creates coupling!
```

✅ **Good:**
```typescript
// Analytics publishes
eventBus.publish('analytics:data-updated', data, 'analytics');

// Dashboard subscribes
eventBus.subscribe('analytics:data-updated', (payload) => {
  console.log(payload.data);
});
```

**Benefits:**
- Loose coupling
- Independent deployment
- Easy to add new MFEs
- Can log/debug all communication

---

## 🏗️ Design Decisions

### Decision 1: Monorepo Structure

**Why?**
- Easier development experience
- Shared tooling and scripts
- Simplified dependency management
- Better for learning

**Alternative:** Separate repos
- Production systems often use separate repos
- Better for large teams
- True independence
- More complex setup

### Decision 2: TypeScript

**Why?**
- Type safety across MFEs
- Better IDE support
- Catch errors at compile time
- Shared type definitions in SDK

### Decision 3: Singleton SDK

**Why?**
```javascript
'@federated-hub/shared-sdk': {
  singleton: true,
  eager: true,
}
```

- Event Bus must be shared instance
- Performance tracker collects all metrics
- One source of truth

### Decision 4: Port Allocation

- **Shell**: 3000 (standard React dev port)
- **Analytics**: 3001 (sequential)
- **Dashboard**: 3002 (sequential)

**Benefits:**
- Predictable URLs
- Easy to remember
- No port conflicts

---

## 🔄 Loading Flow

### Initial Load Sequence

```
1. User visits localhost:3000
2. Shell loads (index.tsx → App.tsx)
3. Shell webpack config has remotes defined
4. React.lazy triggers import('analytics/App')
5. Webpack:
   a. Fetch http://localhost:3001/remoteEntry.js
   b. Parse what Analytics exposes
   c. Check shared dependencies
   d. Dynamically import the actual code
6. Analytics App component loads
7. Same process for Dashboard
8. Shell renders both inside Error Boundaries
```

### Shared Dependency Resolution

```
Shell (eager):
  - Loads React 18.2.0 immediately
  - Loads ReactDOM 18.2.0 immediately
  - Loads SDK immediately

Analytics (non-eager):
  - Needs React? → Use Shell's
  - Needs ReactDOM? → Use Shell's
  - Needs SDK? → Use Shell's
  - No duplication! ✅
```

---

## 📊 Performance Tracking

### What We Track

1. **Shell Load Time**
   ```typescript
   performanceTracker.mark('shell-load-start');
   // ... app loads ...
   performanceTracker.measureFromMark('shell-load-time', 'shell-load-start');
   ```

2. **MFE Load Time**
   ```typescript
   React.lazy(() => {
     performanceTracker.mark('analytics-load-start');
     return import('analytics/App').then(module => {
       performanceTracker.measureFromMark('analytics-load-time', 'analytics-load-start');
       return module;
     });
   });
   ```

3. **Custom Metrics**
   - User interactions
   - API calls
   - Rendering times

### Why It Matters

- Micro-Frontends add overhead (network requests, parsing)
- Need to monitor performance
- Optimize based on data
- Set performance budgets

---

## 🛡️ Fault Tolerance

### Isolation Strategies

1. **Error Boundaries**
   - Catch React errors
   - Prevent cascade failures
   - Show fallback UI

2. **Separate Processes**
   - Each MFE runs on own port
   - One crash doesn't affect others
   - Can restart independently

3. **Graceful Degradation**
   - If Analytics fails to load, Dashboard still works
   - Show error message, not blank screen
   - Retry mechanisms

### Network Failure Handling

**What if remoteEntry.js fails to load?**
```tsx
<ErrorBoundary fallback={<div>Failed to load Analytics</div>}>
  <Suspense fallback={<Loading />}>
    <AnalyticsApp />
  </Suspense>
</ErrorBoundary>
```

Result:
- Error is caught
- Fallback UI shown
- Other MFEs unaffected ✅

---

## 🔐 Security Considerations

### CORS Headers

```javascript
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
}
```

**Production:** Restrict to specific domains!

### Code Trust

- Only load remotes from trusted sources
- Validate remoteEntry.js integrity
- Use Content Security Policy (CSP)

---

## 📈 Scalability

### Adding a New MFE

1. Create new app in `apps/` folder
2. Configure as remote
3. Add to Shell's remotes config
4. Deploy independently

### Removing an MFE

1. Remove from Shell's remotes
2. Remove import in Shell
3. No rebuild of other MFEs needed!

---

## 🎯 Key Takeaways

1. **Module Federation** enables runtime composition
2. **Singleton React** prevents multiple instances
3. **Error Boundaries** provide fault isolation
4. **Event Bus** enables loose coupling
5. **remoteEntry.js** is the coordination mechanism
6. **Performance tracking** is critical
7. **Independent deployment** is the goal

---

## 📚 Further Reading

- [Webpack Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontend Architecture by Martin Fowler](https://martinfowler.com/articles/micro-frontends.html)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)

---

**You now understand the architectural decisions behind FederatedHub!** 🎉
