import { useCallback } from 'react';
import { Task, TabType, Urgency, TaskRegularity, URGENCY_LEVELS } from '../types';
import { TaskService } from '../services/TaskService';
import { useTaskState } from './useTaskState';

// Priority order type for sorting
type PriorityOrder = Record<Urgency, number>;

// Helper functions moved here for reusability
const sortTasks = (tasks: Task[]): Task[] => {
  const priorityOrder: PriorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
  
  return [...tasks].sort((a: Task, b: Task): number => {
    const priorityDiff: number = priorityOrder[a.urgency] - priorityOrder[b.urgency];
    if (priorityDiff !== 0) return priorityDiff;

    if (a.plannedDate && b.plannedDate) {
      return new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime();
    }
    
    if (a.plannedDate && !b.plannedDate) return -1;
    if (!a.plannedDate && b.plannedDate) return 1;
    
    return 0;
  });
};

const sortFutureTasks = (tasks: Task[]): Task[] => {
  const now: Date = new Date();
  const sevenDaysFromNow: Date = new Date(now);
  sevenDaysFromNow.setDate(now.getDate() + 7);
  
  const priorityOrder: PriorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
  
  return [...tasks].sort((a: Task, b: Task): number => {
    const aDate: Date | null = a.plannedDate ? new Date(a.plannedDate) : null;
    const bDate: Date | null = b.plannedDate ? new Date(b.plannedDate) : null;
    
    const aWithinWeek: boolean = aDate !== null && aDate <= sevenDaysFromNow;
    const bWithinWeek: boolean = bDate !== null && bDate <= sevenDaysFromNow;
    
    if (aWithinWeek && !bWithinWeek) return -1;
    if (!aWithinWeek && bWithinWeek) return 1;
    
    if (aDate && bDate) {
      return aDate.getTime() - bDate.getTime();
    }
    
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;
    
    return priorityOrder[a.urgency] - priorityOrder[b.urgency];
  });
};

const sortDoneTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a: Task, b: Task): number => 
    (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
  );
};

export function useTaskOperations() {
  const { state, actions } = useTaskState();

  const loadTasks = useCallback(async (): Promise<void> => {
    actions.setLoading(true);
    actions.setError(null);
    
    try {
      const [activeResults, futureResults, doneResults]: [Task[], Task[], Task[]] = await Promise.all([
        TaskService.getTasksBySection('active'),
        TaskService.getTasksBySection('future'),
        TaskService.getTasksBySection('done')
      ]);
      
      actions.setTasks('active', sortTasks(activeResults));
      actions.setTasks('future', sortFutureTasks(futureResults));
      actions.setTasks('done', sortDoneTasks(doneResults));
      
    } catch (error: unknown) {
      console.error('Error loading tasks:', error);
      actions.setError('Unable to load tasks. Please check your connection and try again.');
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const refreshSection = useCallback(async (section: TabType): Promise<void> => {
    try {
      const tasks: Task[] = await TaskService.getTasksBySection(section);
      let sortedTasks: Task[];
      
      switch (section) {
        case 'active':
          sortedTasks = sortTasks(tasks);
          break;
        case 'future':
          sortedTasks = sortFutureTasks(tasks);
          break;
        case 'done':
          sortedTasks = sortDoneTasks(tasks);
          break;
        default:
          sortedTasks = tasks;
      }
      
      actions.setTasks(section, sortedTasks);
    } catch (error: unknown) {
      console.error(`Error refreshing ${section} tasks:`, error);
      throw error;
    }
  }, [actions]);

  const completeTask = useCallback(async (taskId: string): Promise<void> => {
    try {
      // Optimistic update - remove from active immediately
      actions.removeTask('active', taskId);
      
      // Call API to complete the task
      const completedTask: Task = await TaskService.completeTask(taskId);
      
      // Add to done tasks
      actions.addTask('done', completedTask);
      
      console.log('✅ Task completed successfully!');
    } catch (error: unknown) {
      console.error('Error completing task:', error);
      // Revert by refreshing all tasks
      await loadTasks();
    }
  }, [actions, loadTasks]);

  const moveToActive = useCallback(async (taskId: string): Promise<void> => {
    try {
      // Optimistic update - remove from future immediately
      actions.removeTask('future', taskId);
      
      // Call API to activate the task
      const activatedTask: Task = await TaskService.activateTask(taskId);
      
      // Add to active tasks
      actions.addTask('active', activatedTask);
      actions.setActiveTab('active');
    } catch (error: unknown) {
      console.error('Error moving task to active:', error);
      await loadTasks();
    }
  }, [actions, loadTasks]);

  const deleteTask = useCallback(async (taskId: string, section: TabType): Promise<void> => {
    try {
      // Optimistic update - remove immediately
      actions.removeTask(section, taskId);
      
      // Call API to delete
      await TaskService.deleteTask(taskId);
    } catch (error: unknown) {
      console.error('Error deleting task:', error);
      await loadTasks();
    }
  }, [actions, loadTasks]);

  const createTask = useCallback(async (
    title: string, 
    why: string, 
    urgency: Urgency,
    regularity?: TaskRegularity,
    plannedDate?: Date
  ): Promise<void> => {
    // Determine regularity fields based on frontend regularity data
    let regularity_type: string;
    let regularity_week_days: string[] | undefined;

    if (regularity && regularity.type === 'weekly') {
      regularity_type = 'weekly';
      regularity_week_days = regularity.days || [];
    } else {
      // Default for non-recurring tasks
      regularity_type = 'daily';
    }

    const newTask: any = {
      id: Date.now().toString(), // Will be replaced by server
      title,
      why,
      urgency,
      section: state.taskFormSection,
      plannedDate,
      regularity_type,
      regularity_in_days: null,
      regularity_week_days
    };
    
    try {
      await TaskService.createTask(newTask);
      await refreshSection(state.taskFormSection);
      actions.setTaskForm(false);
    } catch (error: unknown) {
      console.error('Error creating task:', error);
    }
  }, [state.taskFormSection, refreshSection, actions]);

  // API-level update: calls server then refreshes section
  const updateTask = useCallback(async (
    taskId: string, 
    title: string, 
    why: string, 
    urgency: Urgency,
    regularity?: TaskRegularity,
    plannedDate?: Date
  ): Promise<void> => {
    if (!state.editTaskData) return;
    
    const updatedTaskData: Task = {
      ...state.editTaskData.task,
      title,
      why,
      urgency,
      regularity,
      plannedDate,
      section: state.editTaskData.section
    };
    
    try {
      await TaskService.updateTask(taskId, updatedTaskData);
      await refreshSection(state.editTaskData.section);
      actions.setEditForm(false);
    } catch (error: unknown) {
      console.error('Error updating task:', error);
      await loadTasks();
    }
  }, [state.editTaskData, refreshSection, actions, loadTasks]);

  const editTask = useCallback((taskId: string, section: TabType): void => {
    const taskArrays: Record<TabType, Task[]> = {
      active: state.activeTasks,
      future: state.futureTasks,
      done: state.doneTasks
    };
    
    const task: Task | undefined = taskArrays[section].find((task: Task) => task.id === taskId);
    if (!task) return;
    
    actions.setEditTaskData({ task, section });
    actions.setEditForm(true);
  }, [state.activeTasks, state.futureTasks, state.doneTasks, actions]);

  const showAddTaskForm = useCallback((section: TabType): void => {
    actions.setTaskFormSection(section);
    actions.setTaskForm(true);
  }, [actions]);

  return {
    // State
    state,
    
    // Task Operations - All directly navigable!
    loadTasks,
    refreshSection,
    completeTask,
    moveToActive,
    deleteTask,
    createTask,
    updateTask,
    editTask,
    showAddTaskForm,
    
    // UI actions
    setActiveTab: actions.setActiveTab,
    setTaskForm: actions.setTaskForm,
    setEditForm: actions.setEditForm,
    setPopup: actions.setPopup,
    setCurrentTask: actions.setCurrentTask,
  };
} 