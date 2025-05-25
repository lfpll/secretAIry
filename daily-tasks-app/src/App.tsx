import React, { useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import './App.css';
import TaskList from './components/TaskList';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import UrgentPopup from './components/UrgentPopup';
import TaskFormPopup from './components/TaskFormPopup';
import EditTaskPopup from './components/EditTaskPopup';
import { useTaskOperations } from './hooks/useTaskOperations';
import { TaskService } from './services/TaskService';
import { Task, TabType } from './types';

function App(): React.JSX.Element {
  const {
    state,
    loadTasks,
    completeTask,
    moveToActive,
    deleteTask,
    createTask,
    updateTask,
    editTask,
    showAddTaskForm,
    setActiveTab,
    setTaskForm,
    setEditForm,
    setPopup,
  } = useTaskOperations();

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Start connection monitoring
  useEffect(() => {
    const stopMonitoring = TaskService.startConnectionMonitoring(30000); // Check every 30 seconds
    return stopMonitoring;
  }, []);

  const handleDragEnd = async (result: DropResult): Promise<void> => {
    const { source, destination } = result;
    if (!destination || source.droppableId === destination.droppableId) {
      return; // Same list reordering is handled automatically by sorting
    }

    const sourceSection: TabType = source.droppableId.replace('Tasks', '') as TabType;
    const destSection: TabType = destination.droppableId.replace('Tasks', '') as TabType;
    
    const taskArrays: Record<TabType, Task[]> = {
      active: state.activeTasks,
      future: state.futureTasks,
      done: state.doneTasks
    };
    
    const task: Task = taskArrays[sourceSection][source.index];
    if (!task) return;

    try {
      if (destSection === 'done') {
        await completeTask(task.id);
      } else if (destSection === 'active') {
        await moveToActive(task.id);
      } else {
        // Move to future
        const updatedTask: Task = { ...task, section: 'future' as const };
        await TaskService.updateTask(task.id, updatedTask);
        await loadTasks(); // Refresh to get proper sorting
      }
    } catch (error: unknown) {
      console.error('Error during drag and drop:', error);
      await loadTasks(); // Refresh to restore consistent state
    }
  };

  if (state.isLoading) {
    return <div className="loading">Loading tasks...</div>;
  }
  
  if (state.loadingError) {
    return <div className="error">{state.loadingError}</div>;
  }

  return (
    <div className="app-container">
      <Header />
      
      <div className="main-content">
        <TabNavigation 
          activeTab={state.activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <div className="content-area">
          <DragDropContext onDragEnd={handleDragEnd}>
            {state.activeTab === 'active' && (
              <div id="active-tasks" className="tab-content">
                <div className="add-task">
                  <button 
                    className="add-task-btn" 
                    onClick={() => showAddTaskForm('active')}
                  >
                    + Add New Task
                  </button>
                </div>
                
                <TaskList
                  tasks={state.activeTasks}
                  section="active"
                  onComplete={completeTask}
                  onEdit={editTask}
                  onDelete={deleteTask}
                  droppableId="activeTasks"
                />
              </div>
            )}
            
            {state.activeTab === 'future' && (
              <div id="future-tasks" className="tab-content future-section">
                <div className="add-task">
                  <button 
                    className="add-task-btn" 
                    onClick={() => showAddTaskForm('future')}
                  >
                    + Add Future Task
                  </button>
                </div>
                
                <TaskList
                  tasks={state.futureTasks}
                  section="future"
                  onActivate={moveToActive}
                  onEdit={editTask}
                  onDelete={deleteTask}
                  droppableId="futureTasks"
                />
              </div>
            )}
            
            {state.activeTab === 'done' && (
              <div id="done-tasks" className="tab-content done-section">
                <TaskList
                  tasks={state.doneTasks}
                  section="done"
                  droppableId="doneTasks"
                />
              </div>
            )}
          </DragDropContext>
        </div>
      </div>
      
      {state.showPopup && state.currentTask && (
        <UrgentPopup 
          task={state.currentTask}
          onClose={() => setPopup(false)}
          onComplete={() => {
            completeTask(state.currentTask!.id);
            setPopup(false);
          }}
          onRemove={() => {
            deleteTask(state.currentTask!.id, 'active');
            setPopup(false);
          }}
        />
      )}

      {state.showTaskForm && (
        <TaskFormPopup
          section={state.taskFormSection}
          onClose={() => setTaskForm(false)}
          onSubmit={createTask}
        />
      )}

      {state.showEditForm && state.editTaskData && (
        <EditTaskPopup
          task={state.editTaskData.task}
          section={state.editTaskData.section}
          onClose={() => setEditForm(false)}
          onSubmit={updateTask}
        />
      )}
    </div>
  );
}

export default App;
