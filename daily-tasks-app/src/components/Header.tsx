import React, { useState, useEffect } from 'react';
import { TaskService } from '../services/TaskService';

const Header: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingOpsCount, setPendingOpsCount] = useState(0);

  useEffect(() => {
    // Check offline status and pending operations periodically
    const checkStatus = () => {
      setIsOffline(TaskService.isOffline());
      
      // Check pending operations count
      try {
        const pending = JSON.parse(localStorage.getItem('focus-app-pending-ops') || '[]');
        setPendingOpsCount(pending.length);
      } catch (error) {
        setPendingOpsCount(0);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <h1>Daily Tasks</h1>
        <p>Remember your why, prioritize by urgency</p>
      </div>
      {isOffline && (
        <div className="offline-indicator">
          🔄 Offline Mode - Using Local Data
          {pendingOpsCount > 0 && (
            <span className="pending-ops">
              ({pendingOpsCount} pending sync{pendingOpsCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}
    </header>
  );
};

export default Header; 