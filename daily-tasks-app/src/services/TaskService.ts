import { Task, TabType, TaskBase } from '../types';

const API_BASE_URL: string = process.env.REACT_APP_API_URL || window.location.origin;

const processTaskDates = (task: any): Task => ({
  ...task,
  completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  plannedDate: task.plannedDate ? new Date(task.plannedDate) : undefined,
  is_deleted: task.is_deleted || false,
});

const apiCall = async <T>(url: string, options?: RequestInit): Promise<T> => {
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
};

export class TaskService {
  static async getTasksBySection(section: TabType): Promise<Task[]> {
    const data: any[] = await apiCall<any[]>(`/tasks/${section}`);
    return data.map(processTaskDates);
  }

  static async getTaskById(taskId: string): Promise<Task> {
    const task: any = await apiCall<any>(`/task/${taskId}`);
    return processTaskDates(task);
  }

  static async createTask(task: TaskBase): Promise<Task> {
    const createdTask: any = await apiCall<any>('/task', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return processTaskDates(createdTask);
  }

  static async updateTask(taskId: string, task: Task): Promise<Task> {
    const updatedTask: any = await apiCall<any>(`/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
    return processTaskDates(updatedTask);
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const result: { success: boolean } = await apiCall<{ success: boolean }>(`/task/${taskId}`, {
      method: 'DELETE',
    });
    return result.success;
  }

  static async completeTask(taskId: string): Promise<Task> {
    const completedTask: any = await apiCall<any>(`/task/${taskId}/complete`, {
      method: 'POST',
    });
    return processTaskDates(completedTask);
  }

  static async activateTask(taskId: string): Promise<Task> {
    const activatedTask: any = await apiCall<any>(`/task/${taskId}/activate`, {
      method: 'POST',
    });
    return processTaskDates(activatedTask);
  }

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
} 