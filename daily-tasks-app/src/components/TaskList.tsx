import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Task, TabType } from '../types';
import { formatCompletionDate, formatPlannedDate, formatRegularity } from '../utils/dateUtils';

interface TaskListProps {
  tasks: Task[];
  section: TabType;
  droppableId: string;
  onComplete?: (taskId: string) => void;
  onEdit?: (taskId: string, section: TabType) => void;
  onDelete?: (taskId: string, section: TabType) => void;
  onActivate?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  section,
  droppableId,
  onComplete,
  onEdit,
  onDelete,
  onActivate,
}) => {
  return (
    <Droppable 
      droppableId={droppableId} 
      isDropDisabled={false} 
      isCombineEnabled={false}
      ignoreContainerClipping={false}
      direction="vertical"
      type="DEFAULT"
    >
      {(provided) => (
        <ul
          className="task-list"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {tasks.map((task: Task, index: number) => (
            <Draggable 
              key={task.id} 
              draggableId={task.id} 
              index={index}
              isDragDisabled={false}
            >
              {(provided) => (
                <li
                  className={`task-item ${section === 'active' ? `${task.urgency}-urgency` : section === 'future' ? 'future-task' : ''}`}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  data-section={section}
                >
                  {section === 'active' && (
                    <div className="urgency-indicator">
                      {task.urgency === 'critical' 
                        ? 'URGENT' 
                        : task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
                    </div>
                  )}
                  
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
                  
                  {section !== 'done' && (
                    <div className="task-actions">
                      {section === 'active' && onComplete && (
                        <button
                          className="action-btn complete-btn"
                          title="Complete"
                          onClick={() => onComplete(task.id)}
                        >
                          ✓
                        </button>
                      )}
                      
                      {section === 'future' && onActivate && (
                        <button
                          className="action-btn activate-btn"
                          title="Move to Active"
                          onClick={() => onActivate(task.id)}
                        >
                          →
                        </button>
                      )}
                      
                      {onEdit && (
                        <button
                          className="action-btn edit-btn"
                          title="Edit"
                          onClick={() => onEdit(task.id, section)}
                        >
                          ✎
                        </button>
                      )}
                      
                      {onDelete && (
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => onDelete(task.id, section)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};

export default TaskList; 