/**
 * TasksPage
 * Main tasks dashboard page with view routing
 * Follows Single Responsibility Principle: manages view state from navigation
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AddTaskWidget } from '../../../widgets/add-task-widget/ui/AddTaskWidget';
import { TaskListWidget } from '../../../widgets/task-list-widget/ui/TaskListWidget';
import './TasksPage.css';

type ViewType = 'dashboard' | 'all-tasks';

export const TasksPage: React.FC = () => {
  const location = useLocation();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  // Sync view state with navbar navigation
  useEffect(() => {
    if (location.state?.tab) {
      setActiveView(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className="tasks-page">
      <div className="tasks-page__container">
        {/* Dashboard View: Split layout with form and recent tasks */}
        {activeView === 'dashboard' && (
          <div className="tasks-page__grid">
            <div className="tasks-page__sidebar">
              <AddTaskWidget />
            </div>
            <div className="tasks-page__separator" />
            <div className="tasks-page__main">
              <TaskListWidget showFilters={false} maxTasks={5} />
            </div>
          </div>
        )}

        {/* All Tasks View: Full-width with filters and pagination */}
        {activeView === 'all-tasks' && (
          <div className="tasks-page__full">
            <TaskListWidget showFilters={true} />
          </div>
        )}
      </div>
    </div>
  );
};
