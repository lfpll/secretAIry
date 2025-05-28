import React from 'react';
import { Task, TabType } from '../types';
import { formatCompletionDate, formatPlannedDate, formatRegularity } from '../utils/dateUtils';

interface TaskListProps {
  tasks: Task[];
  section: TabType;
  onComplete?: (taskId: string) => void;
  onEdit?: (taskId: string, section: TabType) => void;
  onDelete?: (taskId: string, section: TabType) => void;
  onActivate?: (taskId: string) => void;
}

interface TaskItemProps {
  task: Task;
  section: TabType;
  onComplete?: (taskId: string) => void;
  onEdit?: (taskId: string, section: TabType) => void;
  onDelete?: (taskId: string, section: TabType) => void;
  onActivate?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  section,
  onComplete,
  onEdit,
  onDelete,
  onActivate,
}) => {
  return (
    <li
      className={`task-item ${section === 'active' ? `${task.urgency}-urgency` : section === 'future' ? 'future-task' : ''}`}
      data-section={section}
    >
      {section === 'active' && (
        <div className="urgency-indicator">
          {task.urgency === 'critical' 
            ? 'URGENT' 
            : task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
        </div>
      )}
      
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        <div className="task-why">{task.why}</div>
        
        <div className="task-meta">
          {section === 'done' && task.completedAt && (
            <div className="completion-date">
              {formatCompletionDate(task.completedAt)}
            </div>
          )}
          
          {section === 'future' && task.plannedDate && (
            <div className="task-planned-date">
              📅 {formatPlannedDate(task.plannedDate)}
            </div>
          )}
          
          {section === 'active' && task.regularity && (
            <div className="task-recurring-indicator">
              🔄 {formatRegularity(task.regularity)}
            </div>
          )}
        </div>
      </div>
      
      {section !== 'done' && (
        <div className="task-actions">
          {section === 'active' && onComplete && (
            <button
              className="action-btn complete-btn"
              title="Complete"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id);
              }}
            >
              ✓
            </button>
          )}
          
          {section === 'future' && onActivate && (
            <button
              className="action-btn activate-btn"
              title="Move to Active"
              onClick={(e) => {
                e.stopPropagation();
                onActivate(task.id);
              }}
            >
              →
            </button>
          )}
          
          {onEdit && (
            <button
              className="action-btn edit-btn"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task.id, section);
              }}
            >
              ✎
            </button>
          )}
          
          {onDelete && (
            <button
              className="action-btn delete-btn"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id, section);
              }}
            >
              ×
            </button>
          )}
        </div>
      )}
    </li>
  );
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  section,
  onComplete,
  onEdit,
  onDelete,
  onActivate,
}) => {
  return (
    <ul className="task-list">
      {tasks.map((task: Task) => (
        <TaskItem
          key={task.id}
          task={task}
          section={section}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onActivate={onActivate}
        />
      ))}
    </ul>
  );
};

export default TaskList; 