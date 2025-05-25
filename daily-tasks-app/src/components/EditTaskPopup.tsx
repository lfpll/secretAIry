import React, { useState, useEffect } from 'react';
import { Task } from '../types';

type TabType = 'active' | 'future' | 'done';
type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface EditTaskPopupProps {
  task: Task;
  section: TabType;
  onClose: () => void;
  onSubmit: (
    taskId: string, 
    title: string, 
    why: string, 
    urgency: 'low' | 'medium' | 'high' | 'critical',
    regularity?: {
      type: 'weekly' | 'daily';
      days?: WeekDay[];
      everyXDays?: number;
    },
    plannedDate?: Date
  ) => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  task,
  section,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(task.title);
  const [why, setWhy] = useState(task.why);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>(task.urgency);

  // Regularity state (for active tasks)
  const [isRecurring, setIsRecurring] = useState(!!task.regularity);
  const [regularityType, setRegularityType] = useState<'weekly' | 'daily'>(
    task.regularity?.type || 'weekly'
  );
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>(
    task.regularity?.days || []
  );
  const [everyXDays, setEveryXDays] = useState(
    task.regularity?.everyXDays || 1
  );
  
  // Planned date state (for future tasks)
  const [plannedDate, setPlannedDate] = useState<string>(
    task.plannedDate ? task.plannedDate.toISOString().split('T')[0] : ''
  );

  // Prevent body scrolling when popup is open
  useEffect(() => {
    document.body.classList.add('popup-open');
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, []);

  const handleDayToggle = (day: WeekDay) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || why.trim() === '') return;
    
    let regularityData = undefined;
    if (section === 'active' && isRecurring) {
      regularityData = {
        type: regularityType,
        days: regularityType === 'weekly' ? selectedDays : undefined,
        everyXDays: regularityType === 'daily' ? everyXDays : undefined,
      };
    }
    
    let plannedDateData = undefined;
    if (section === 'future' && plannedDate) {
      plannedDateData = new Date(plannedDate);
    }
    
    onSubmit(task.id, title, why, urgency, regularityData, plannedDateData);
    onClose();
  };

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="task-form-popup">
        <div className="popup-title">Edit Task</div>
        <form onSubmit={handleSubmit}>
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                autoFocus
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="task-why">Why are you doing this task?</label>
              <textarea
                id="task-why"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="This helps maintain motivation"
                required
              />
            </div>
            
            {section === 'active' && (
              <>
                <div className="form-group">
                  <label>Task Urgency</label>
                  <div className="urgency-selector">
                    <label className={`urgency-option ${urgency === 'low' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="low"
                        checked={urgency === 'low'}
                        onChange={() => setUrgency('low')}
                      />
                      <span className="urgency-label low">Low</span>
                    </label>
                    
                    <label className={`urgency-option ${urgency === 'medium' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="medium"
                        checked={urgency === 'medium'}
                        onChange={() => setUrgency('medium')}
                      />
                      <span className="urgency-label medium">Medium</span>
                    </label>
                    
                    <label className={`urgency-option ${urgency === 'high' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="high"
                        checked={urgency === 'high'}
                        onChange={() => setUrgency('high')}
                      />
                      <span className="urgency-label high">High</span>
                    </label>
                    
                    <label className={`urgency-option ${urgency === 'critical' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="critical"
                        checked={urgency === 'critical'}
                        onChange={() => setUrgency('critical')}
                      />
                      <span className="urgency-label critical">Urgent</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="recurring-checkbox">
                    <input
                      type="checkbox"
                      id="is-recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <label htmlFor="is-recurring">Recurring Task</label>
                  </div>
                  
                  {isRecurring && (
                    <div className="regularity-options">
                      <div className="regularity-type-selector">
                        <label>
                          <input
                            type="radio"
                            name="regularity-type"
                            value="weekly"
                            checked={regularityType === 'weekly'}
                            onChange={() => setRegularityType('weekly')}
                          />
                          <span>Weekly</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="regularity-type"
                            value="daily"
                            checked={regularityType === 'daily'}
                            onChange={() => setRegularityType('daily')}
                          />
                          <span>Every X Days</span>
                        </label>
                      </div>
                      
                      {regularityType === 'weekly' && (
                        <div className="days-selector">
                          <label>Repeat on:</label>
                          <div className="days-buttons">
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                              <button
                                key={day}
                                type="button"
                                className={`day-button ${selectedDays.includes(day as WeekDay) ? 'selected' : ''}`}
                                onClick={() => handleDayToggle(day as WeekDay)}
                              >
                                {day.charAt(0).toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {regularityType === 'daily' && (
                        <div className="every-x-days">
                          <label>Repeat every:</label>
                          <div className="x-days-input">
                            <input
                              type="number"
                              min="1"
                              max="365"
                              value={everyXDays}
                              onChange={(e) => setEveryXDays(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                            <span>days</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            
            {section === 'future' && (
              <div className="form-group">
                <label htmlFor="planned-date">When do you plan to do this task?</label>
                <input
                  id="planned-date"
                  type="date"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>
          
          <div className="popup-actions">
            <button type="button" className="popup-btn popup-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="popup-btn popup-submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditTaskPopup; 