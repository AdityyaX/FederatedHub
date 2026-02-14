# 🏗️ FederatedHub - Micro-Frontend Platform

A **production-grade Micro-Frontend architecture** using **Webpack 5 Module Federation**. Built for learning, experimenting, and mastering MFE concepts.

---

## ✨ What This Is

A complete, working Micro-Frontend platform featuring:
- ✅ **Shell (Host)** application orchestrating multiple MFEs
- ✅ **Analytics MFE** with real-time metrics
- ✅ **Dashboard MFE** with task management
- ✅ **Shared SDK** for communication and utilities
- ✅ **Error Boundaries** for fault isolation
- ✅ **Performance Tracking** built-in
- ✅ **Event Bus** for cross-MFE communication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Run

```bash
# Clone or navigate to the project
cd FederatedHub

# Run automated setup
chmod +x setup.sh
./setup.sh

# Start all applications
npm run dev
```

Then open **http://localhost:3000** in your browser!

### What You'll See

- **Shell** running on port 3000
- **Analytics** MFE with live metrics (port 3001)
- **Dashboard** MFE with task management (port 3002)
- **Toggle controls** to show/hide MFEs
- **Event log** showing real-time communication
- **Performance metrics** in console

---

## 🏛️ Architecture

```
┌──────────────────────────────────────┐
│   Shell (Host) - localhost:3000      │
│   ┌────────────────────────────────┐ │
│   │  Module Federation Container   │ │
│   │  - Loads remotes dynamically   │ │
│   │  - Shares React (singleton)    │ │
│   │  - Error Boundaries            │ │
│   └────────────────────────────────┘ │
└──────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐   ┌─────────────────┐
│  Analytics MFE  │   │  Dashboard MFE  │
│  Port 3001      │   │  Port 3002      │
│  - Live metrics │   │  - Task mgmt    │
│  - Charts       │   │  - Real-time    │
└─────────────────┘   └─────────────────┘
         │                    │
         └────────┬───────────┘
                  ▼
         ┌────────────────┐
         │   Shared SDK   │
         │  - Event Bus   │
         │  - Perf Track  │
         └────────────────┘
```

### Project Structure

```
FederatedHub/
├── apps/
│   ├── shell/              # Host application (3000)
│   ├── analytics/          # Remote MFE #1 (3001)
│   └── dashboard/          # Remote MFE #2 (3002)
├── packages/
│   └── shared-sdk/         # Event Bus + utilities
├── setup.sh                # Automated setup script
├── GETTING_STARTED.md      # Step-by-step guide
├── ARCHITECTURE.md         # Deep dive into design
├── LEARNING_GUIDE.md       # 30-day mastery plan
└── README.md               # This file
```

---

## 📚 Documentation

Choose your path:

### 🎯 **I want to get started immediately**
→ Read **[GETTING_STARTED.md](./GETTING_STARTED.md)**
- Installation guide
- Running the platform
- Testing features
- Common issues

### 🏛️ **I want to understand the architecture**
→ Read **[ARCHITECTURE.md](./ARCHITECTURE.md)**
- System design
- Module Federation explained
- Design decisions
- Loading flow
- Performance strategies

### 📖 **I want to master Micro-Frontends**
→ Follow **[LEARNING_GUIDE.md](./LEARNING_GUIDE.md)**
- 30-day learning plan
- Hands-on exercises
- Quiz checkpoints
- Advanced topics

---

## 🎯 Key Concepts You'll Master

### 1. Module Federation
Load code from other apps at **runtime** (not build time)

### 2. Host vs Remote
- **Host** (Shell) loads other apps
- **Remote** (Analytics, Dashboard) expose components

### 3. Singleton Dependencies
Only ONE React instance shared across all MFEs

### 4. remoteEntry.js
The manifest file that makes it all work

### 5. Error Boundaries
Isolate failures - one MFE crash won't kill others

### 6. Event Bus
Communicate between MFEs without tight coupling

### 7. Performance Tracking
Monitor load times and optimize

---

## 💻 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework (singleton) |
| Webpack | 5.89.0 | Module Federation |
| TypeScript | 5.3.3 | Type safety |
| Babel | 7.23.7 | JSX/TS compilation |

---

## 🧪 Testing Features

### Test Error Isolation
1. Open `apps/analytics/src/App.tsx`
2. Add `throw new Error('Test');` in useEffect
3. Analytics crashes, but Dashboard still works! ✅

### Test Event Communication
1. Click "Refresh Data" in Analytics
2. Watch the Event Log update
3. See console logs in DevTools

### Test Independent Deployment
1. Stop Analytics (Ctrl+C in terminal)
2. Shell and Dashboard keep working
3. Restart Analytics - reconnects seamlessly

### Test Standalone Mode
Visit MFEs directly:
- http://localhost:3001 (Analytics)
- http://localhost:3002 (Dashboard)

They work independently!

---

## 📈 Scripts Reference

### Development
```bash
npm run dev              # Run all apps concurrently
npm run dev:shell        # Shell only (3000)
npm run dev:analytics    # Analytics only (3001)
npm run dev:dashboard    # Dashboard only (3002)
```

### Build
```bash
npm run build           # Build all apps
npm run build:shell     # Build Shell
npm run build:analytics # Build Analytics
npm run build:dashboard # Build Dashboard
```

### Utilities
```bash
./setup.sh              # Fresh install
npm run clean           # Clean all dist folders
```

---

## 🎓 Learning Outcomes

After exploring this project, you will:

✅ Understand Webpack Module Federation deeply
✅ Configure hosts and remotes confidently  
✅ Implement error boundaries properly
✅ Design event-based communication
✅ Track and optimize performance
✅ Make architectural decisions
✅ Explain MFE concepts in interviews

---

## 🌟 Features Showcase

### Shell (Host)
- Dynamic MFE loading with React.lazy
- Toggle MFEs on/off
- Real-time event log
- Performance metrics viewer
- Error boundary protection

### Analytics MFE
- Real-time metrics dashboard
- Auto-updating data (every 3s)
- Animated metric cards
- Event publishing
- Standalone mode

### Dashboard MFE
- Task management system
- Interactive status updates
- Statistics overview
- Event-driven updates
- Responsive design

### Shared SDK
- Event Bus (Pub-Sub pattern)
- Performance tracker
- TypeScript definitions
- Singleton pattern

---

## 🔧 Troubleshooting

### Port in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module not found
```bash
cd packages/shared-sdk && npm run build
```

### React version mismatch
Ensure all `package.json` files use `"react": "^18.2.0"`

### remoteEntry.js 404
Make sure all MFEs are running on their ports

---

## 🤝 Contributing Ideas

Want to extend this? Try:
- Add routing with react-router
- Add authentication flow
- Add theming system
- Add state management (Redux/Zustand)
- Add more MFEs (Notifications, Settings)
- Add E2E tests
- Add CI/CD pipeline

---

## 📝 Interview Prep

Use this project to answer:
- "How does Module Federation work?"
- "Why use Micro-Frontends?"
- "How do you share dependencies?"
- "How do you handle errors?"
- "How do MFEs communicate?"

**Pro tip:** Run this locally during interviews and demo it!

---

## 🌐 Production Considerations

This is a learning platform. For production, add:
- Environment-specific configs
- CDN deployment
- Versioning strategy
- Monitoring/logging
- Security headers
- Performance budgets
- E2E testing
- CI/CD pipelines

---

## 📜 License

MIT - Feel free to use for learning and projects!

---

## 🙌 Acknowledgments

Built for developers who want to:
- Master Micro-Frontend architecture
- Understand Module Federation
- Build production-ready MFE platforms
- Ace technical interviews

---

**Ready to become a Micro-Frontend expert? Start with [GETTING_STARTED.md](./GETTING_STARTED.md)!** 🚀
