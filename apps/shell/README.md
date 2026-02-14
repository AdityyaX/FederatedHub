# 🏠 Shell Application (Host)

The **Shell** is the **host application** in our Micro-Frontend architecture. It acts as a container that dynamically loads and orchestrates remote MFEs at runtime.

## 🎯 Purpose

The Shell application:
- Serves as the main entry point (runs on `localhost:3000`)
- Dynamically loads remote MFEs using Module Federation
- Provides shared dependencies (React, SDK) to all MFEs
- Orchestrates communication between MFEs

## 🧠 Key Concepts

### What is a "Host" in Module Federation?

A **host** is an application that:
1. Loads other applications (remotes) at **runtime**
2. Shares dependencies with them
3. Does NOT need to know the remotes at build time
4. Can add/remove remotes without rebuilding

### Module Federation Configuration

```javascript
new ModuleFederationPlugin({
  name: 'shell',                    // Name of this host
  
  remotes: {
    // Remote MFEs we want to load
    analytics: 'analytics@http://localhost:3001/remoteEntry.js',
  },
  
  shared: {
    react: { singleton: true },     // Only ONE React instance
    'react-dom': { singleton: true },
  },
})
```

### Critical Concepts:

#### 1️⃣ `remotes` Configuration
This tells webpack: "These are external apps I want to load at runtime"

Format: `remoteName: 'remoteName@URL/remoteEntry.js'`

#### 2️⃣ `shared` Dependencies
This ensures React and SDK are singletons - all MFEs use the SAME instance.

**Why singleton?**
- React Context only works with one React instance
- Event Bus must be shared across all MFEs
- Prevents duplicate libraries in the bundle

#### 3️⃣ `remoteEntry.js`
This is the **manifest file** that describes what a remote exposes. The host loads this first, then dynamically imports the actual components.

## 🏗️ Architecture Flow

```
1. User visits localhost:3000
2. Shell loads and initializes
3. Shell fetches remoteEntry.js from remotes
4. Shell dynamically imports remote components
5. Remote components render inside Shell
6. All share the same React + SDK instance
```

## 🚀 Running the Shell

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

The Shell will run on **http://localhost:3000**

## 📁 File Structure

```
apps/shell/
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Module Federation config ⭐
├── tsconfig.json          # TypeScript config
├── public/
│   └── index.html         # HTML template
└── src/
    ├── index.tsx          # Entry point
    ├── App.tsx            # Main component
    └── App.css            # Styles
```

## 🔑 Key Files

### `webpack.config.js`
Contains the **Module Federation Plugin** configuration. This is where you:
- Define the host name
- Add remotes you want to load
- Configure shared dependencies

### `src/App.tsx`
The main shell component that will:
- Render the navigation/layout
- Load remote MFEs dynamically
- Handle errors with Error Boundaries

## 📚 What You're Learning

By building this Shell, you understand:
- ✅ How to configure a Module Federation **host**
- ✅ What `remoteEntry.js` is and why it matters
- ✅ Why React must be a **singleton**
- ✅ How shared dependencies work
- ✅ The runtime loading flow

## 🔜 Next Steps

1. ✅ Shell is running
2. ⏭️ Create Analytics MFE (first remote)
3. ⏭️ Add Analytics to Shell's `remotes` config
4. ⏭️ Load Analytics with `React.lazy()`

---

**Note**: The Shell can run independently, but it becomes powerful when remotes are added!
