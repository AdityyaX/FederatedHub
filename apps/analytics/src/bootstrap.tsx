import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { performanceTracker } from '@federated-hub/shared-sdk';

performanceTracker.mark('analytics-load-start');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

performanceTracker.measureFromMark('analytics-standalone-load', 'analytics-load-start', {
  app: 'analytics',
  mode: 'standalone',
  timestamp: new Date().toISOString(),
});

if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    performanceTracker.logMetrics();
  }, 1000);
}
