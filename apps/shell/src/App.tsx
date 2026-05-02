import React, { Suspense, useEffect, useState } from 'react';
import { eventBus, performanceTracker } from '@federated-hub/shared-sdk';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const AnalyticsApp = React.lazy(() => {
  performanceTracker.mark('analytics-load-start');
  return import('analytics/App').then(module => {
    performanceTracker.measureFromMark('analytics-load-time', 'analytics-load-start', {
      mfe: 'analytics',
    });
    return module;
  });
});

const DashboardApp = React.lazy(() => {
  performanceTracker.mark('dashboard-load-start');
  return import('dashboard/App').then(module => {
    performanceTracker.measureFromMark('dashboard-load-time', 'dashboard-load-start', {
      mfe: 'dashboard',
    });
    return module;
  });
});

const LoadingFallback: React.FC<{ name: string }> = ({ name }) => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading {name}...</p>
  </div>
);

const App: React.FC = () => {
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showDashboard, setShowDashboard] = useState(true);
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('*', (payload) => {
      console.log('📨 Event received in Shell:', payload);
      setEventLog(prev => [
        `[${new Date().toLocaleTimeString()}] ${payload.source} → ${payload.type}`,
        ...prev.slice(0, 4),
      ]);
    });

    eventBus.publish('shell:ready', { timestamp: Date.now() }, 'shell');

    return () => unsubscribe();
  }, []);

  const handleShowMetrics = () => {
    performanceTracker.logMetrics();
  };

  return (
    <div className="shell-container">
      {/* ─── Hero Header ─── */}
      <header className="shell-header">
        <div className="header-content">
          <h1>FederatedHub</h1>
          <p className="subtitle">
            Production-grade Micro-Frontend platform powered by Webpack 5 Module Federation.
            Each panel below is an <strong>independently deployed application</strong> loaded at runtime.
          </p>
          <div className="tech-pills">
            <span className="pill">Webpack 5 Module Federation</span>
            <span className="pill">React 18 Singleton</span>
            <span className="pill">Event Bus (Pub/Sub)</span>
            <span className="pill">Error Boundaries</span>
            <span className="pill">Performance Tracking</span>
            <span className="pill">TypeScript</span>
          </div>
        </div>
      </header>

      <main className="shell-main">
        {/* ─── Live Controls ─── */}
        <div className="control-bar">
          <div className="control-bar-left">
            <span className="control-label">Live MFE Toggle:</span>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`control-chip ${showAnalytics ? 'active' : ''}`}
            >
              <span className={`chip-dot ${showAnalytics ? 'on' : 'off'}`}></span>
              Analytics
            </button>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className={`control-chip ${showDashboard ? 'active' : ''}`}
            >
              <span className={`chip-dot ${showDashboard ? 'on' : 'off'}`}></span>
              Dashboard
            </button>
          </div>
          <button onClick={handleShowMetrics} className="metrics-btn">
            📊 Performance Metrics
          </button>
        </div>

        {/* ─── Live MFE Grid ─── */}
        <div className="mfe-grid">
          {showAnalytics && (
            <div className="mfe-slot">
              <div className="mfe-slot-label">
                <span className="slot-dot live"></span>
                Remote MFE · Port 3001
              </div>
              <ErrorBoundary name="Analytics MFE">
                <Suspense fallback={<LoadingFallback name="Analytics" />}>
                  <AnalyticsApp />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}

          {showDashboard && (
            <div className="mfe-slot">
              <div className="mfe-slot-label">
                <span className="slot-dot live"></span>
                Remote MFE · Port 3002
              </div>
              <ErrorBoundary name="Dashboard MFE">
                <Suspense fallback={<LoadingFallback name="Dashboard" />}>
                  <DashboardApp />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}

          {!showAnalytics && !showDashboard && (
            <div className="empty-state">
              <p>Toggle MFEs above to load them at runtime</p>
            </div>
          )}
        </div>

        {/* ─── Event Bus Monitor ─── */}
        {eventLog.length > 0 && (
          <div className="event-bus-panel">
            <div className="event-bus-header">
              <span className="live-dot"></span>
              <h3>Cross-MFE Event Bus</h3>
              <span className="tech-badge">Pub/Sub · Zero Coupling</span>
            </div>
            <p className="event-bus-desc">
              These events flow between independently deployed applications in real-time — no direct imports, no shared state.
            </p>
            <div className="event-log">
              {eventLog.map((event, idx) => (
                <div key={idx} className="event-item">
                  <span className="event-caret">›</span> {event}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Architecture Comparison ─── */}
        <div className="comparison-section">
          <h2 className="section-title">Why Micro-Frontends?</h2>
          <p className="section-subtitle">How this architecture compares to a traditional monolith</p>
          <div className="architecture-comparison">
            <div className="comparison-card monolith">
              <div className="comparison-header">
                <span className="comparison-icon">🏢</span>
                <h3>Traditional Monolith</h3>
              </div>
              <ul className="comparison-list">
                <li>❌ <strong>Slow Releases</strong> — Entire app rebuilds for every change</li>
                <li>❌ <strong>Single Point of Failure</strong> — One bug can crash everything</li>
                <li>❌ <strong>Team Bottlenecks</strong> — Everyone merges into one codebase</li>
                <li>❌ <strong>Tech Lock-in</strong> — One framework for the entire product</li>
              </ul>
            </div>

            <div className="comparison-vs">VS</div>

            <div className="comparison-card mfe">
              <div className="comparison-header">
                <span className="comparison-icon">🧩</span>
                <h3>Micro-Frontend (This Platform)</h3>
              </div>
              <ul className="comparison-list">
                <li>✅ <strong>Instant Deploys</strong> — Each team ships independently</li>
                <li>✅ <strong>Fault Isolation</strong> — Crashes are contained per MFE</li>
                <li>✅ <strong>Autonomous Teams</strong> — Zero merge conflicts across squads</li>
                <li>✅ <strong>Tech Freedom</strong> — Best tool for each specific problem</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── How It Works ─── */}
        <div className="how-it-works">
          <h2 className="section-title">How It Works Under the Hood</h2>
          <div className="how-grid">
            <div className="how-card">
              <div className="how-number">01</div>
              <h4>Runtime Module Loading</h4>
              <p>The Shell app fetches <code>remoteEntry.js</code> manifests from each MFE at runtime. No build-time bundling — true independent deployment.</p>
            </div>
            <div className="how-card">
              <div className="how-number">02</div>
              <h4>Shared Dependency Singletons</h4>
              <p>React, ReactDOM are loaded once and shared across all MFEs. Zero duplication, minimal bundle sizes.</p>
            </div>
            <div className="how-card">
              <div className="how-number">03</div>
              <h4>Event-Driven Communication</h4>
              <p>A custom Event Bus SDK allows MFEs to talk to each other without importing anything directly. Fully decoupled.</p>
            </div>
            <div className="how-card">
              <div className="how-number">04</div>
              <h4>Error Boundary Isolation</h4>
              <p>Each MFE slot is wrapped in React Error Boundaries. If Analytics crashes, Dashboard keeps running perfectly.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="shell-footer">
        <p>
          Built by <strong>Aditya Pachauri</strong> · React 18 · Webpack 5 Module Federation · TypeScript
        </p>
      </footer>
    </div>
  );
};

export default App;
