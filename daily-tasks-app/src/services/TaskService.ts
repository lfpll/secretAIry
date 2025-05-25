import { Task, TabType } from '../types';

const API_BASE_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Mock data for offline mode
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review quarterly reports',
    why: 'Need to prepare for the board meeting next week',
    urgency: 'high',
    section: 'active',
  },
  {
    id: '2', 
    title: 'Call dentist for appointment',
    why: 'Regular checkup is overdue',
    urgency: 'medium',
    section: 'active',
  },
  {
    id: '3',
    title: 'Plan vacation for summer',
    why: 'Need to book flights and hotels early for better prices',
    urgency: 'low',
    section: 'future',
    plannedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    id: '4',
    title: 'Learn TypeScript',
    why: 'Will help me become a better developer',
    urgency: 'medium',
    section: 'future',
    plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: '5',
    title: 'Complete project documentation',
    why: 'Team needs it for the next sprint',
    urgency: 'high',
    section: 'done',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

// Local storage utilities
const STORAGE_KEY = 'focus-app-tasks';

const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn('Failed to save tasks to localStorage:', error);
  }
};

const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const tasks = JSON.parse(stored);
      return tasks.map(processTaskDates);
    }
  } catch (error) {
    console.warn('Failed to load tasks from localStorage:', error);
  }
  
  // Return mock data if nothing in storage and save it for future use
  console.log('Initializing with mock data for offline mode');
  saveTasksToStorage(MOCK_TASKS);
  return MOCK_TASKS;
};

// Check if we're in offline mode
let isOfflineMode = false;

// Track operations that need to be synced when online
interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'complete' | 'activate';
  data: any;
  timestamp: number;
}

const PENDING_OPERATIONS_KEY = 'focus-app-pending-ops';

const savePendingOperation = (operation: PendingOperation): void => {
  try {
    const existing = JSON.parse(localStorage.getItem(PENDING_OPERATIONS_KEY) || '[]');
    existing.push(operation);
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(existing));
  } catch (error) {
    console.warn('Failed to save pending operation:', error);
  }
};

const getPendingOperations = (): PendingOperation[] => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_OPERATIONS_KEY) || '[]');
  } catch (error) {
    console.warn('Failed to load pending operations:', error);
    return [];
  }
};

const clearPendingOperations = (): void => {
  try {
    localStorage.removeItem(PENDING_OPERATIONS_KEY);
  } catch (error) {
    console.warn('Failed to clear pending operations:', error);
  }
};

/**
 * Utility function to convert date strings to Date objects in task data
 */
const processTaskDates = (task: any): Task => ({
  ...task,
  completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  plannedDate: task.plannedDate ? new Date(task.plannedDate) : undefined,
  regularity: task.regularity ? {
    ...task.regularity,
    lastCompleted: task.regularity.lastCompleted ? new Date(task.regularity.lastCompleted) : undefined
  } : undefined
});

/**
 * Utility function for making API calls with error handling and offline fallback
 */
const apiCall = async <T>(url: string, options?: RequestInit): Promise<T> => {
  // If already in offline mode, throw immediately to use fallback
  if (isOfflineMode) {
    throw new Error('Offline mode - using local data');
  }

  try {
    const response: Response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error: unknown) {
    console.warn(`API call to ${url} failed, switching to offline mode:`, error);
    isOfflineMode = true;
    throw error;
  }
};

/**
 * Service class for handling task-related API calls with offline fallback
 */
export class TaskService {
  /**
   * Get all tasks for a specific section
   */
  static async getTasksBySection(section: TabType): Promise<Task[]> {
    try {
      const data: any[] = await apiCall<any[]>(`/tasks/${section}`);
      return data.map(processTaskDates);
    } catch (error) {
      // Fallback to local storage
      const allTasks = loadTasksFromStorage();
      return allTasks.filter(task => task.section === section);
    }
  }

  /**
   * Get a task by ID
   */
  static async getTaskById(taskId: string): Promise<Task> {
    try {
      const task: any = await apiCall<any>(`/task/${taskId}`);
      return processTaskDates(task);
    } catch (error) {
      // Fallback to local storage
      const allTasks = loadTasksFromStorage();
      const task = allTasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found`);
      }
      return task;
    }
  }

  /**
   * Create a new task
   */
  static async createTask(task: Task): Promise<Task> {
    try {
      const createdTask: any = await apiCall<any>('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      });
      return processTaskDates(createdTask);
    } catch (error) {
      // Fallback to local storage
      const allTasks = loadTasksFromStorage();
      const newTask: Task = {
        ...task,
        id: Date.now().toString(), // Generate a simple ID
      };
      const updatedTasks = [...allTasks, newTask];
      saveTasksToStorage(updatedTasks);
      
      // Track this operation for later sync
      savePendingOperation({
        id: newTask.id,
        type: 'create',
        data: newTask,
        timestamp: Date.now(),
      });
      
      return newTask;
    }
  }

  /**
   * Update an existing task
   */
  static async updateTask(taskId: string, task: Task): Promise<Task> {
    try {
      const updatedTask: any = await apiCall<any>(`/task/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(task),
      });
      return processTaskDates(updatedTask);
    } catch (error) {
      // Fallback to local storage
      const allTasks = loadTasksFromStorage();
      const updatedTasks = allTasks.map(t => t.id === taskId ? { ...task, id: taskId } : t);
      saveTasksToStorage(updatedTasks);
      
      // Track this operation for later sync
      savePendingOperation({
        id: taskId,
        type: 'update',
        data: { ...task, id: taskId },
        timestamp: Date.now(),
      });
      
      return { ...task, id: taskId };
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string): Promise<boolean> {
    try {
      const result: { success: boolean } = await apiCall<{ success: boolean }>(`/task/${taskId}`, {
        method: 'DELETE',
      });
      return result.success;
    } catch (error) {
      // Fallback to local storage
      const allTasks = loadTasksFromStorage();
      const updatedTasks = allTasks.filter(t => t.id !== taskId);
      saveTasksToStorage(updatedTasks);
      
      // Track this operation for later sync
      savePendingOperation({
        id: taskId,
        type: 'delete',
        data: null,
        timestamp: Date.now(),
      });
      
      return true;
    }
  }

  /**
   * Mark a task as complete
   */
  static async completeTask(taskId: string): Promise<Task> {
    try {
      const completedTask: any = await apiCall<any>(`/task/${taskId}/complete`, {
        method: 'POST',
      });
      return processTaskDates(completedTask);
    } catch (error) {
      // Fallback to local storage
      const allTasks = loadTasksFromStorage();
      const task = allTasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found`);
      }
      
      const completedTask: Task = {
        ...task,
        section: 'done',
        completedAt: new Date(),
      };
      
      const updatedTasks = allTasks.map(t => t.id === taskId ? completedTask : t);
      saveTasksToStorage(updatedTasks);
      
      // Track this operation for later sync
      savePendingOperation({
        id: taskId,
        type: 'complete',
        data: completedTask,
        timestamp: Date.now(),
      });
      
      return completedTask;
    }
  }

  /**
   * Move a task to the active section
   */
  static async activateTask(taskId: string): Promise<Task> {
    try {
      const activatedTask: any = await apiCall<any>(`/task/${taskId}/activate`, {
        method: 'POST',
      });
      return processTaskDates(activatedTask);
    } catch (error) {
      // Fallback to local storage
      const allTasks = loadTasksFromStorage();
      const task = allTasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error(`Task with id ${taskId} not found`);
      }
      
      const activatedTask: Task = {
        ...task,
        section: 'active',
      };
      
      const updatedTasks = allTasks.map(t => t.id === taskId ? activatedTask : t);
      saveTasksToStorage(updatedTasks);
      
      // Track this operation for later sync
      savePendingOperation({
        id: taskId,
        type: 'activate',
        data: activatedTask,
        timestamp: Date.now(),
      });
      
      return activatedTask;
    }
  }

  /**
   * Check if app is running in offline mode
   */
  static isOffline(): boolean {
    return isOfflineMode;
  }

  /**
   * Reset offline mode (for testing reconnection)
   */
  static resetOfflineMode(): void {
    isOfflineMode = false;
  }

  /**
   * Clear all local data and reset to mock data (for testing)
   */
  static clearLocalData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Local data cleared, will reinitialize with mock data');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get all tasks from local storage (for debugging)
   */
  static getAllLocalTasks(): Task[] {
    return loadTasksFromStorage();
  }

  /**
   * Check if the server is available
   */
  static async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sync all pending operations to the server
   */
  static async syncPendingOperations(): Promise<void> {
    const pendingOps = getPendingOperations();
    if (pendingOps.length === 0) return;

    console.log(`🔄 Syncing ${pendingOps.length} pending operations...`);

    for (const op of pendingOps) {
      try {
        switch (op.type) {
          case 'create':
            await apiCall('/tasks', {
              method: 'POST',
              body: JSON.stringify(op.data),
            });
            break;
          case 'update':
            await apiCall(`/task/${op.id}`, {
              method: 'PUT',
              body: JSON.stringify(op.data),
            });
            break;
          case 'delete':
            await apiCall(`/task/${op.id}`, {
              method: 'DELETE',
            });
            break;
          case 'complete':
            await apiCall(`/task/${op.id}/complete`, {
              method: 'POST',
            });
            break;
          case 'activate':
            await apiCall(`/task/${op.id}/activate`, {
              method: 'POST',
            });
            break;
        }
      } catch (error) {
        console.warn(`Failed to sync operation ${op.type} for ${op.id}:`, error);
        // Keep the operation for next sync attempt
        return;
      }
    }

    clearPendingOperations();
    console.log('✅ All pending operations synced successfully!');
  }

  static async tryReconnect(): Promise<boolean> {
    if (!isOfflineMode) return true;

    const isConnected = await this.checkConnection();
    if (isConnected) {
      console.log('🌐 Connection restored! Syncing data...');
      isOfflineMode = false;
      
      try {
        await this.syncPendingOperations();
        return true;
      } catch (error) {
        console.warn('Sync failed, staying in offline mode:', error);
        isOfflineMode = true;
        return false;
      }
    }
    
    return false;
  }

  /**
   * Start periodic connection checks
   */
  static startConnectionMonitoring(intervalMs: number = 30000): () => void {
    const interval = setInterval(async () => {
      if (isOfflineMode) {
        await this.tryReconnect();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }
} 