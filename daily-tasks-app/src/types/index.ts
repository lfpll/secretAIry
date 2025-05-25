export type TabType = 'active' | 'future' | 'done';

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TaskRegularity {
  type: 'weekly' | 'daily';
  days?: WeekDay[];
  everyXDays?: number;
  lastCompleted?: Date;
}

export interface Task {
  id: string;
  title: string;
  why: string;
  urgency: Urgency;
  section?: TabType;
  completedAt?: Date;
  regularity?: TaskRegularity;
  plannedDate?: Date;
} 