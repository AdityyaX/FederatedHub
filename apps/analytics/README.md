# 📊 Analytics MFE (Remote)

The **Analytics** application is the first **remote** Micro-Frontend in our platform. It runs independently and can be loaded by the Shell at runtime via Module Federation.

## 🎯 Purpose

This MFE demonstrates:
- How to configure a **remote** application
- How to **expose** components to the host
- Running as **standalone** for development
- Real-time data updates and communication

## 🧠 Key Concepts

### What is a "Remote" in Module Federation?

A **remote** is an application that:
1. Runs independently on its own port
2. **Exposes** components/modules to be consumed by others
3. Can be developed and deployed separately
4. Is loaded by the host at **runtime** (not build time)

### Module Federation Configuration

```javascript
new ModuleFederationPlugin({
  name: 'analytics',              // Name of this remote
  filename: 'remoteEntry.js',     // ⭐ Manifest file
  
  exposes: {
    './App': './src/App',         // Expose App component
  },
  
  shared: {
    react: { singleton: true },   // Use host's React
    'react-dom': { singleton: true },
  },
})
```

### Critical Concepts:

#### 1️⃣ `exposes` Configuration
This tells webpack: "Here's what I want to share with other apps"

Format: `'./ComponentName': './path/to/component'`

The host will import it like: `import('analytics/App')`

#### 2️⃣ `filename: 'remoteEntry.js'`
This is the **manifest file** that describes what this remote exposes. The host loads this file first.

**Important:** This MUST be named `remoteEntry.js`

#### 3️⃣ `shared` Dependencies
The remote declares what it needs. If the host provides it, the remote uses the host's version. This prevents duplicate React instances!

#### 4️⃣ Standalone Development
The remote can run independently on `localhost:3001`. This allows:
- Independent development without the shell
- Testing in isolation
- Separate deployment pipeline

## 🏗️ How It Works

### Standalone Mode (Development)
```
1. Run: npm run dev
2. Visit: localhost:3001
3. See: Full app with its own HTML template
4. Use: For isolated development and testing
```

### Federated Mode (Production)
```
1. Shell requests: http://localhost:3001/remoteEntry.js
2. Shell reads: What analytics exposes
3. Shell imports: import('analytics/App')
4. Shell renders: <Analytics /> component
5. Analytics uses: Shell's React instance (singleton!)
```

## 🔑 Key Files

### `webpack.config.js`
- Configures this app as a **remote**
- Defines what to **expose** (`./App`)
- Sets up **shared** dependencies

### `src/App.tsx`
- The component that gets exposed
- Uses Event Bus to communicate
- Tracks performance metrics
- Updates data in real-time

### `src/index.tsx`
- Only used in standalone mode
- When loaded via federation, Shell uses App.tsx directly

## 🚀 Running Analytics

```bash
# Install dependencies
npm install

# Run standalone
npm run dev
# Visit: http://localhost:3001

# Build for production
npm run build
```

## 📡 Communication

### Publishing Events
```typescript
eventBus.publish('analytics:ready', { data }, 'analytics');
```

### Subscribing to Events
```typescript
eventBus.subscribe('shell:ready', (payload) => {
  console.log('Shell is ready!', payload);
});
```

## 🎨 Features

- **Real-time metrics** that update every 3 seconds
- **Event-based communication** with other MFEs
- **Performance tracking** for load times
- **Beautiful UI** with animated metric cards
- **Responsive design** for all screen sizes

## 📚 What You're Learning

- ✅ How to configure a **Module Federation remote**
- ✅ What `exposes` means and how to use it
- ✅ The role of `remoteEntry.js`
- ✅ How remotes share the host's dependencies
- ✅ Standalone vs Federated mode
- ✅ Cross-MFE communication with Event Bus

## 🔜 Next Steps

1. ✅ Analytics is running standalone
2. ⏭️ Add Analytics to Shell's `remotes` config
3. ⏭️ Load Analytics in Shell with `React.lazy()`
4. ⏭️ See them work together!

---

**Pro Tip**: Always develop remotes in standalone mode first, then integrate with the shell!
