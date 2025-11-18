/**
 * TaskCard Component
 * Displays a single task with completion toggle
 */

import React from 'react';
import type { Task } from '../../../entities/task/model/types';
import { Card, CardBody } from '../../../shared/ui/Card/Card';
import { Button } from '../../../shared/ui/Button/Button';
import { formatRelativeTime } from '../../../shared/lib/helpers/date';
import './TaskCard.css';

export interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onUncomplete: (taskId: string) => void;
  isLoading?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onUncomplete,
  isLoading = false,
}) => {
  const handleToggle = () => {
    if (task.status === 'COMPLETED') {
      onUncomplete(task.id);
    } else {
      onComplete(task.id);
    }
  };

  const isCompleted = task.status === 'COMPLETED';

  return (
    <Card className={`task-card ${isCompleted ? 'task-card--completed' : ''}`} elevation="low">
      <CardBody>
        <div className="task-card__content">
          <div className="task-card__left">
            <div className="task-card__info">
              <h3 className="task-card__title">{task.title}</h3>
              <p className="task-card__description">{task.description}</p>
              <span className="task-card__time">
                {task.completedAt
                  ? `Completed ${formatRelativeTime(new Date(task.completedAt))}`
                  : `Created ${formatRelativeTime(new Date(task.createdAt))}`}
              </span>
            </div>
          </div>
          <div className="task-card__right">
            <Button
              variant="secondary"
              size="medium"
              onClick={handleToggle}
              loading={isLoading}
              disabled={isLoading}
            >
              {isCompleted ? 'Undo' : 'Done'}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
