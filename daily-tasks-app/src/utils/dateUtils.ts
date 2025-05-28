import { WeekDay } from '../types';

/**
 * Format completion date for display
 */
export const formatCompletionDate = (date: Date): string => {
  const now: Date = new Date();
  const diffTime: number = Math.abs(now.getTime() - date.getTime());
  const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const timeString: string = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (diffDays === 0) {
    return `Completed today at ${timeString}`;
  } else if (diffDays === 1) {
    return `Completed yesterday at ${timeString}`;
  } else {
    return `Completed ${diffDays} days ago`;
  }
};

/**
 * Format planned date for display
 */
export const formatPlannedDate = (date: Date): string => {
  const now: Date = new Date();
  const diffTime: number = date.getTime() - now.getTime();
  const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday (overdue)';
  } else if (diffDays < -1) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays <= 7) {
    const dayNames: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Format regularity information for display
 */
export const formatRegularity = (regularityWeekDays?: WeekDay[]): string | null => {
  if (!regularityWeekDays || regularityWeekDays.length === 0) return null;
  
  if (regularityWeekDays.length === 7) {
    return 'Every day';
  } else {
    const shortDays: string = regularityWeekDays
      .map((day: WeekDay) => day.charAt(0).toUpperCase())
      .join(', ');
    return `Weekly on ${shortDays}`;
  }
}; 