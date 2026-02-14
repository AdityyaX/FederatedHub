# 🏗️ FederatedHub - Micro-Frontend Platform

A production-grade Micro-Frontend architecture using **Webpack 5 Module Federation**.

## 🎯 What You'll Learn

- Webpack 5 Module Federation in depth
- Host/Remote architecture patterns
- Runtime integration of independent apps
- Error isolation and resilience
- Performance monitoring and optimization
- SDK-based communication patterns

## 🏛️ Architecture

```
FederatedHub/
├── apps/
│   ├── shell/         # Host application (container)
│   ├── analytics/     # Remote MFE #1
│   └── dashboard/     # Remote MFE #2
├── packages/
│   └── shared-sdk/    # Shared communication layer
```

## 📦 Tech Stack

- **React 18** - UI library
- **Webpack 5** - Module Federation
- **TypeScript** - Type safety
- **Shared SDK** - Inter-MFE communication

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Run all apps in dev mode
npm run dev

# Build for production
npm run build
```

## 📚 Learning Path

This project is built step-by-step to teach you:
1. ✅ Project structure and monorepo setup
2. 🔄 Shared SDK for communication
3. 🏠 Shell (Host) application
4. 📊 First Remote (Analytics)
5. 🔗 Connect Remote to Shell
6. 📈 Second Remote (Dashboard)
7. 🛡️ Error boundaries and isolation
8. ⚡ Performance monitoring

## 🎓 Key Concepts You'll Master

- **Module Federation Config**
- **remoteEntry.js** loading
- **Shared Dependencies** (singleton React)
- **Dynamic Imports** and lazy loading
- **Error Boundaries** for fault isolation
- **Event Bus** for cross-MFE communication
- **Performance Tracking** and monitoring

---

**Status**: 🏗️ Building step-by-step
