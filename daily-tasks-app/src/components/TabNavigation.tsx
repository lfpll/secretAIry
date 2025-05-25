import React from 'react';

type TabType = 'active' | 'future' | 'done';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button 
        className={`tab ${activeTab === 'active' ? 'active' : ''}`} 
        onClick={() => setActiveTab('active')}
      >
        Active Tasks
      </button>
      <button 
        className={`tab ${activeTab === 'future' ? 'active' : ''}`} 
        onClick={() => setActiveTab('future')}
      >
        Future Tasks
      </button>
      <button 
        className={`tab ${activeTab === 'done' ? 'active' : ''}`} 
        onClick={() => setActiveTab('done')}
      >
        Done
      </button>
    </div>
  );
};

export default TabNavigation; 