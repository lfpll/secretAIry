export type TabType = 'active' | 'future' | 'done';

export const TAB_TYPES: TabType[] = ['active', 'future', 'done'];

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export const URGENCY_LEVELS: Urgency[] = ['low', 'medium', 'high', 'critical'];

export type WeekDay = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export const WEEKDAYS: WeekDay[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];


export class TaskBase {
  title: string;
  why: string;
  urgency: Urgency;
  section?: TabType;
  plannedDate?: Date;
  regularity?: WeekDay[];
  is_deleted: boolean;
  completedAt?: Date;
  
  constructor(data: Partial<TaskBase> & { title: string; why: string }) {
    // Set required fields
    this.title = data.title;
    this.why = data.why;
    
    // Set defaults for other fields
    this.urgency = data.urgency || 'low';
    this.section = data.section || 'active';
    this.plannedDate = data.plannedDate;
    this.regularity = data.regularity;
    this.is_deleted = data.is_deleted || false;
    this.completedAt = data.completedAt;
  }
}

export class Task extends TaskBase {
  id: string;
  
  constructor(data: Partial<Task> & { title: string; why: string }) {
    super(data);
    this.id = data.id || ''; // Will be replaced by server
  }
} 