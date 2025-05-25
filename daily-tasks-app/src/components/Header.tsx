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
      {isOffline && pendingOpsCount > 0 && (
        <div className="sync-indicator">
          🔄 {pendingOpsCount}
        </div>
      )}
    </header>
  );
};

export default Header; 