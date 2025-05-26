export type TabType = 'active' | 'future' | 'done';

export const TAB_TYPES: TabType[] = ['active', 'future', 'done'];

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export const URGENCY_LEVELS: Urgency[] = ['low', 'medium', 'high', 'critical'];

export type WeekDay = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export const WEEKDAYS: WeekDay[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

export type RegularityType = 'weekly' | 'daily';

export const REGULARITY_TYPES: RegularityType[] = ['weekly', 'daily'];

export interface TaskRegularity {
  type: RegularityType;
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