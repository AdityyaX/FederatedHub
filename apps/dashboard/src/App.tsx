import React, { useEffect, useState } from 'react';
import { eventBus, performanceTracker } from '@federated-hub/shared-sdk';
import './App.css';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Setup Module Federation', status: 'completed', priority: 'high' },
    { id: 2, title: 'Build Analytics MFE', status: 'completed', priority: 'high' },
    { id: 3, title: 'Build Dashboard MFE', status: 'in-progress', priority: 'high' },
    { id: 4, title: 'Add Error Boundaries', status: 'completed', priority: 'medium' },
    { id: 5, title: 'Performance Monitoring', status: 'in-progress', priority: 'medium' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    performanceTracker.mark('dashboard-mount');

    eventBus.publish('dashboard:ready', {
      timestamp: Date.now(),
      version: '1.0.0',
      taskCount: tasks.length,
    }, 'dashboard');

    const unsubscribe = eventBus.subscribe('shell:ready', (payload) => {
      console.log('📈 Dashboard received shell:ready event', payload);
    });

    const unsubscribeAnalytics = eventBus.subscribe('analytics:refreshed', (payload) => {
      console.log('📈 Dashboard received analytics refresh', payload);
    });

    return () => {
      unsubscribe();
      unsubscribeAnalytics();
    };
  }, []);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      status: 'pending',
      priority: 'medium',
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');

    eventBus.publish('dashboard:task-added', { task: newTask }, 'dashboard');
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const statuses: Task['status'][] = ['pending', 'in-progress', 'completed'];
        const currentIndex = statuses.indexOf(task.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...task, status: nextStatus };
      }
      return task;
    }));

    eventBus.publish('dashboard:task-updated', { taskId: id }, 'dashboard');
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      default: return 'gray';
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📈 Project Dashboard</h2>
        <span className="badge">Remote MFE</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h4>Total Tasks</h4>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h4>Completed</h4>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h4>In Progress</h4>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h4>Pending</h4>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="add-task-section">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="task-input"
        />
        <button onClick={addTask} className="add-btn">
          ➕ Add Task
        </button>
      </div>

      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.status}`}>
            <div className="task-header">
              <h4>{task.title}</h4>
              <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="task-footer">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className={`status-btn ${getStatusColor(task.status)}`}
              >
                {task.status === 'completed' && '✅ Completed'}
                {task.status === 'in-progress' && '🔄 In Progress'}
                {task.status === 'pending' && '⏳ Pending'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-info">
        <p><strong>🔌 Status:</strong> Connected via Module Federation</p>
        <p><strong>📡 Port:</strong> localhost:3002</p>
        <p><strong>💬 Communication:</strong> Event Bus Enabled</p>
      </div>
    </div>
  );
};

export default App;
