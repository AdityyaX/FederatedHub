import React, { useEffect, useState } from 'react';
import { eventBus, performanceTracker } from '@federated-hub/shared-sdk';
import './App.css';

interface AnalyticsData {
  pageViews: number;
  activeUsers: number;
  avgSessionTime: string;
  bounceRate: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 12453,
    activeUsers: 342,
    avgSessionTime: '4m 32s',
    bounceRate: '42.3%',
  });

  useEffect(() => {
    performanceTracker.mark('analytics-mount');

    eventBus.publish('analytics:ready', { 
      timestamp: Date.now(),
      version: '1.0.0',
    }, 'analytics');

    const unsubscribe = eventBus.subscribe('shell:ready', (payload) => {
      console.log('📊 Analytics received shell:ready event', payload);
    });

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        pageViews: prev.pageViews + Math.floor(Math.random() * 10),
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 20) - 10),
      }));
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    performanceTracker.mark('analytics-refresh-start');
    
    setData({
      pageViews: Math.floor(Math.random() * 20000),
      activeUsers: Math.floor(Math.random() * 500),
      avgSessionTime: `${Math.floor(Math.random() * 10)}m ${Math.floor(Math.random() * 60)}s`,
      bounceRate: `${(Math.random() * 100).toFixed(1)}%`,
    });

    performanceTracker.measureFromMark('analytics-refresh', 'analytics-refresh-start');
    
    eventBus.publish('analytics:refreshed', { 
      timestamp: Date.now(),
      data,
    }, 'analytics');
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <span className="badge">Remote MFE</span>
      </div>

      <div className="analytics-grid">
        <div className="metric-card purple">
          <div className="metric-icon">👁️</div>
          <div className="metric-content">
            <h3>Page Views</h3>
            <p className="metric-value">{data.pageViews.toLocaleString()}</p>
            <span className="metric-change positive">↑ 12.5%</span>
          </div>
        </div>

        <div className="metric-card blue">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Active Users</h3>
            <p className="metric-value">{data.activeUsers.toLocaleString()}</p>
            <span className="metric-change positive">↑ 8.2%</span>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>Avg Session</h3>
            <p className="metric-value">{data.avgSessionTime}</p>
            <span className="metric-change negative">↓ 3.1%</span>
          </div>
        </div>

        <div className="metric-card orange">
          <div className="metric-icon">📉</div>
          <div className="metric-content">
            <h3>Bounce Rate</h3>
            <p className="metric-value">{data.bounceRate}</p>
            <span className="metric-change positive">↓ 5.4%</span>
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Refresh Data
        </button>
        <button 
          onClick={() => performanceTracker.logMetrics()} 
          className="perf-btn"
        >
          📊 View Performance
        </button>
      </div>

      <div className="analytics-info">
        <p>
          <strong>🔌 Status:</strong> Connected via Module Federation
        </p>
        <p>
          <strong>📡 Port:</strong> localhost:3001
        </p>
        <p>
          <strong>🔄 Updates:</strong> Real-time (every 3s)
        </p>
      </div>
    </div>
  );
};

export default App;
