import React, { useEffect } from 'react';
import { eventBus } from '@federated-hub/shared-sdk';
import './App.css';

const App: React.FC = () => {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('*', (payload) => {
      console.log('📨 Event received in Shell:', payload);
    });

    eventBus.publish('shell:ready', { timestamp: Date.now() }, 'shell');

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="shell-container">
      <header className="shell-header">
        <div className="header-content">
          <h1>🏗️ FederatedHub</h1>
          <p className="subtitle">Micro-Frontend Platform with Module Federation</p>
        </div>
      </header>

      <main className="shell-main">
        <div className="welcome-card">
          <h2> Shell Application Running</h2>
          <p className="status">
            The host application is successfully loaded and ready to integrate Micro-Frontends.
          </p>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Host:</span>
              <span className="info-value">Shell (localhost:3000)</span>
            </div>
            <div className="info-item">
              <span className="info-label">Webpack:</span>
              <span className="info-value">v5 with Module Federation</span>
            </div>
            <div className="info-item">
              <span className="info-label">React:</span>
              <span className="info-value">v18 (Singleton)</span>
            </div>
            <div className="info-item">
              <span className="info-label">SDK:</span>
              <span className="info-value">Event Bus Ready</span>
            </div>
          </div>

          <div className="next-steps">
            <h3>📋 Next Steps:</h3>
            <ol>
              <li>Create Analytics MFE (Remote #1)</li>
              <li>Configure remote in webpack.config.js</li>
              <li>Load Analytics dynamically with React.lazy</li>
              <li>Add Dashboard MFE (Remote #2)</li>
            </ol>
          </div>
        </div>

        <div className="mfe-container">
          <div className="mfe-placeholder">
            <p>🔌 Micro-Frontends will load here</p>
          </div>
        </div>
      </main>

      <footer className="shell-footer">
        <p>Built with ❤️ for learning Micro-Frontend Architecture</p>
      </footer>
    </div>
  );
};

export default App;
