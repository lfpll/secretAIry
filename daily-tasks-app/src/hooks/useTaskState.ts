import { useState, useCallback, useMemo } from 'react';
import { Task, TabType } from '../types';

interface TaskState {
  activeTasks: Task[];
  futureTasks: Task[];
  doneTasks: Task[];
  isLoading: boolean;
  loadingError: string | null;
  activeTab: TabType;
  showPopup: boolean;
  showTaskForm: boolean;
  showEditForm: boolean;
  taskFormSection: TabType;
  editTaskData: { task: Task; section: TabType } | null;
  currentTask: Task | null;
}

interface TaskActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: TabType) => void;
  setTasks: (section: TabType, tasks: Task[]) => void;
  addTask: (section: TabType, task: Task) => void;
  updateTaskInState: (section: TabType, task: Task) => void;
  removeTask: (section: TabType, taskId: string) => void;
  moveTask: (from: TabType, to: TabType, task: Task) => void;
  setPopup: (show: boolean) => void;
  setTaskForm: (show: boolean) => void;
  setEditForm: (show: boolean) => void;
  setTaskFormSection: (section: TabType) => void;
  setEditTaskData: (data: { task: Task; section: TabType } | null) => void;
  setCurrentTask: (task: Task | null) => void;
}

interface UseTaskStateReturn {
  state: TaskState;
  actions: TaskActions;
}

export function useTaskState(): UseTaskStateReturn {
  // Individual useState hooks for better navigation
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [futureTasks, setFutureTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [taskFormSection, setTaskFormSection] = useState<TabType>('active');
  const [editTaskData, setEditTaskData] = useState<{ task: Task; section: TabType } | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Consolidated state object
  const state: TaskState = {
    activeTasks,
    futureTasks,
    doneTasks,
    isLoading,
    loadingError,
    activeTab,
    showPopup,
    showTaskForm,
    showEditForm,
    taskFormSection,
    editTaskData,
    currentTask,
  };

  // Direct function implementations - Easy to navigate to!
  const setLoading = useCallback((loading: boolean): void => {
    setIsLoading(loading);
  }, []);

  const setError = useCallback((error: string | null): void => {
    setLoadingError(error);
  }, []);

  const setActiveTabAction = useCallback((tab: TabType): void => {
    setActiveTab(tab);
  }, []);

  const setTasks = useCallback((section: TabType, tasks: Task[]): void => {
    switch (section) {
      case 'active':
        setActiveTasks(tasks);
        break;
      case 'future':
        setFutureTasks(tasks);
        break;
      case 'done':
        setDoneTasks(tasks);
        break;
    }
  }, []);

  const addTask = useCallback((section: TabType, task: Task): void => {
    switch (section) {
      case 'active':
        setActiveTasks(prev => [...prev, task]);
        break;
      case 'future':
        setFutureTasks(prev => [...prev, task]);
        break;
      case 'done':
        setDoneTasks(prev => [...prev, task]);
        break;
    }
  }, []);

  // State-level update: only updates local state, no API call
  const updateTaskInState = useCallback((section: TabType, updatedTask: Task): void => {
    const updateTaskInList = (tasks: Task[]) => 
      tasks.map(task => task.id === updatedTask.id ? updatedTask : task);

    switch (section) {
      case 'active':
        setActiveTasks(updateTaskInList);
        break;
      case 'future':
        setFutureTasks(updateTaskInList);
        break;
      case 'done':
        setDoneTasks(updateTaskInList);
        break;
    }
  }, []);

  const removeTask = useCallback((section: TabType, taskId: string): void => {
    const filterTask = (tasks: Task[]) => tasks.filter(task => task.id !== taskId);

    switch (section) {
      case 'active':
        setActiveTasks(filterTask);
        break;
      case 'future':
        setFutureTasks(filterTask);
        break;
      case 'done':
        setDoneTasks(filterTask);
        break;
    }
  }, []);

  const moveTask = useCallback((from: TabType, to: TabType, task: Task): void => {
    // Remove from source
    removeTask(from, task.id);
    // Add to destination
    addTask(to, task);
  }, [removeTask, addTask]);

  const setPopupAction = useCallback((show: boolean): void => {
    setShowPopup(show);
  }, []);

  const setTaskFormAction = useCallback((show: boolean): void => {
    setShowTaskForm(show);
  }, []);

  const setEditFormAction = useCallback((show: boolean): void => {
    setShowEditForm(show);
  }, []);

  const setTaskFormSectionAction = useCallback((section: TabType): void => {
    setTaskFormSection(section);
  }, []);

  const setEditTaskDataAction = useCallback((data: { task: Task; section: TabType } | null): void => {
    setEditTaskData(data);
  }, []);

  const setCurrentTaskAction = useCallback((task: Task | null): void => {
    setCurrentTask(task);
  }, []);

  const actions: TaskActions = useMemo(() => ({
    setLoading,
    setError,
    setActiveTab: setActiveTabAction,
    setTasks,
    addTask,
    updateTaskInState,
    removeTask,      
    moveTask,
    setPopup: setPopupAction,
    setTaskForm: setTaskFormAction,
    setEditForm: setEditFormAction,
    setTaskFormSection: setTaskFormSectionAction,
    setEditTaskData: setEditTaskDataAction,
    setCurrentTask: setCurrentTaskAction,
  }), [setLoading, setError, setActiveTabAction, setTasks, addTask, updateTaskInState, removeTask, moveTask, setPopupAction, setTaskFormAction, setEditFormAction, setTaskFormSectionAction, setEditTaskDataAction, setCurrentTaskAction]);

  return { state, actions };
} 