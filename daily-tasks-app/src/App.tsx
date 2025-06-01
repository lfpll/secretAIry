import React, { useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import TabNavigation from './components/TabNavigation';
import TaskFormPopup from './components/TaskFormPopup';
import EditTaskPopup from './components/EditTaskPopup';
import { useTaskOperations } from './hooks/useTaskOperations';
import { TabType } from './types';

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
  } = useTaskOperations();

  // Tab configuration
  const tabConfig = {
    active: {
      id: 'active-tasks',
      className: 'tab-content',
      tasks: state.activeTasks,
      buttonText: '+ Add New Task',
      showAddButton: true,
      taskListProps: {
        onComplete: completeTask,
        onEdit: editTask,
        onDelete: deleteTask,
      }
    },
    future: {
      id: 'future-tasks', 
      className: 'tab-content future-section',
      tasks: state.futureTasks,
      buttonText: '+ Add Future Task',
      showAddButton: true,
      taskListProps: {
        onActivate: moveToActive,
        onEdit: editTask,
        onDelete: deleteTask,
      }
    },
    done: {
      id: 'done-tasks',
      className: 'tab-content done-section', 
      tasks: state.doneTasks,
      buttonText: '',
      showAddButton: false,
      taskListProps: {}
    }
  } as const;

  const renderTabContent = (tabType: TabType) => {
    const config = tabConfig[tabType];
    const isVisible = state.activeTab === tabType;
    
    return (
      <div 
        key={tabType}
        id={config.id} 
        className={config.className} 
        style={{ display: isVisible ? 'block' : 'none' }}
      >
        {config.showAddButton && (
          <div className="add-task">
            <button 
              className="add-task-btn" 
              onClick={() => showAddTaskForm(tabType)}
            >
              {config.buttonText}
            </button>
          </div>
        )}
        
        <TaskList
          tasks={config.tasks}
          section={tabType}
          {...config.taskListProps}
        />
      </div>
    );
  };

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  if (state.isLoading) {
    return <div className="loading">Loading tasks...</div>;
  }
  
  if (state.loadingError) {
    return <div className="error">{state.loadingError}</div>;
  }

  return (
    <div className="app-container">
      
      <div className="main-content">
        <TabNavigation 
          activeTab={state.activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <div className="content-area">
          {renderTabContent('active')}
          {renderTabContent('future')}
          {renderTabContent('done')}
        </div>
      </div>
      
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
