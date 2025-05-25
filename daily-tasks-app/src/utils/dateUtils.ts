import { TaskRegularity } from '../types';

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
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);
  
  const plannedDate: Date = new Date(date);
  plannedDate.setHours(0, 0, 0, 0);
  
  const diffTime: number = plannedDate.getTime() - today.getTime();
  const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays > 1 && diffDays < 7) {
    return `In ${diffDays} days`;
  } else {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: plannedDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
    };
    return plannedDate.toLocaleDateString(undefined, options);
  }
};

/**
 * Format regularity information for display
 */
export const formatRegularity = (regularity?: TaskRegularity): string | null => {
  if (!regularity) return null;
  
  if (regularity.type === 'weekly' && regularity.days && regularity.days.length > 0) {
    if (regularity.days.length === 7) {
      return 'Every day';
    } else {
      const shortDays: string = regularity.days
        .map((day: string) => day.charAt(0).toUpperCase())
        .join(', ');
      return `Weekly on ${shortDays}`;
    }
  } else if (regularity.type === 'daily' && regularity.everyXDays) {
    if (regularity.everyXDays === 1) {
      return 'Every day';
    } else {
      return `Every ${regularity.everyXDays} days`;
    }
  }
  
  return null;
}; 