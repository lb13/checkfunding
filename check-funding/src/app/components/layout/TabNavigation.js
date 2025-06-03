import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
      <button
        onClick={() => onTabChange('assessment')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'assessment'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        1. Learner Assessment
      </button>
      <button
        onClick={() => onTabChange('search')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'search'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        2. Course Search
      </button>
    </div>
  );
};

export default TabNavigation;