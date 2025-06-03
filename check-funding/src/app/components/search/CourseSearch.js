import React from 'react';
import { Search } from 'lucide-react';

const CourseSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5" />
        Course Search
      </h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Enter Learning Aim Reference (e.g. 60003456) or search by course title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>
    </div>
  );
};

export default CourseSearch;