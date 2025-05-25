import React, { useEffect } from 'react';
import { Task } from '../types';

interface UrgentPopupProps {
  task: Task;
  onClose: () => void;
  onComplete: () => void;
  onRemove: () => void;
}

const UrgentPopup: React.FC<UrgentPopupProps> = ({
  task,
  onClose,
  onComplete,
  onRemove,
}) => {
  // Prevent body scrolling when popup is open
  useEffect(() => {
    document.body.classList.add('popup-open');
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, []);

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="urgent-popup">
        <div className="popup-title">⚠️ HEY!</div>
        <div className="popup-message">
          You really should <strong>"{task.title}"</strong> or remove/delegate it.
          <br /><br />
          <em>{task.why}</em>
        </div>
        <div className="popup-actions">
          <button className="popup-btn popup-do-it" onClick={onComplete}>
            Do It Now
          </button>
          <button className="popup-btn popup-delegate" onClick={onClose}>
            Delegate
          </button>
          <button className="popup-btn popup-remove" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </>
  );
};

export default UrgentPopup; 