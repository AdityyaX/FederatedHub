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
      <header className="shell-header">
        <div className="header-content">
          <h1>🏗️ FederatedHub</h1>
          <p className="subtitle">Micro-Frontend Platform with Module Federation</p>
        </div>
      </header>

      <main className="shell-main">
        <div className="control-panel">
          <div className="panel-section">
            <h3>🎛️ MFE Controls</h3>
            <div className="toggle-buttons">
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`toggle-btn ${showAnalytics ? 'active' : ''}`}
              >
                {showAnalytics ? '✅' : '⬜'} Analytics
              </button>
              <button 
                onClick={() => setShowDashboard(!showDashboard)}
                className={`toggle-btn ${showDashboard ? 'active' : ''}`}
              >
                {showDashboard ? '✅' : '⬜'} Dashboard
              </button>
              <button onClick={handleShowMetrics} className="metrics-btn">
                📊 Show Metrics
              </button>
            </div>
          </div>

          {eventLog.length > 0 && (
            <div className="panel-section">
              <h3>📡 Event Log</h3>
              <div className="event-log">
                {eventLog.map((event, idx) => (
                  <div key={idx} className="event-item">{event}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mfe-grid">
          {showAnalytics && (
            <div className="mfe-slot">
              <ErrorBoundary name="Analytics MFE">
                <Suspense fallback={<LoadingFallback name="Analytics" />}>
                  <AnalyticsApp />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}

          {showDashboard && (
            <div className="mfe-slot">
              <ErrorBoundary name="Dashboard MFE">
                <Suspense fallback={<LoadingFallback name="Dashboard" />}>
                  <DashboardApp />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
        </div>

        {!showAnalytics && !showDashboard && (
          <div className="empty-state">
            <p>👆 Enable MFEs using the controls above</p>
          </div>
        )}
      </main>

      <footer className="shell-footer">
        <p>Built with ❤️ for learning Micro-Frontend Architecture</p>
      </footer>
    </div>
  );
};

export default App;
