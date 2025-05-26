import React from 'react';
import { TabType, TAB_TYPES } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const getTabLabel = (tab: TabType): string => {
    switch (tab) {
      case 'active': return 'Active Tasks';
      case 'future': return 'Future Tasks';
      case 'done': return 'Done';
      default: return tab;
    }
  };

  return (
    <div className="tabs">
      {TAB_TYPES.map((tab) => (
        <button 
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`} 
          onClick={() => setActiveTab(tab)}
        >
          {getTabLabel(tab)}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 