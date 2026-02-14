# 📈 Dashboard MFE (Remote)

The **Dashboard** application is the second **remote** Micro-Frontend, demonstrating a task management interface with real-time updates and cross-MFE communication.

## 🎯 Purpose

This MFE demonstrates:
- Interactive task management UI
- State management within a remote
- Cross-MFE event communication
- Independent development and deployment

## 🚀 Running Dashboard

```bash
# Install dependencies
npm install

# Run standalone
npm run dev
# Visit: http://localhost:3002

# Build for production
npm run build
```

## 🎨 Features

- **Task Management**: Create, update task statuses
- **Real-time Stats**: Live counters for task states
- **Event Publishing**: Notifies other MFEs of changes
- **Beautiful UI**: Clean, modern interface with animations

## 📡 Communication

Publishes events:
- `dashboard:ready` - When MFE initializes
- `dashboard:task-added` - When new task is created
- `dashboard:task-updated` - When task status changes

Subscribes to:
- `shell:ready` - Shell initialization
- `analytics:refreshed` - Analytics data updates

## 🏗️ Module Federation

Configured as a **remote** that exposes `./App` component to the Shell.

Runs on **port 3002** independently.

---

Part of the FederatedHub Micro-Frontend Platform
