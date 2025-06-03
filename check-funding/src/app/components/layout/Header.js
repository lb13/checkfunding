import React from 'react';
import { Calendar, Download } from 'lucide-react';

const Header = ({ lastUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Learning & Funding Assessment</h1>
          <p className="text-gray-600">Check learner eligibility and find funded courses in one place</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdate}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Download className="w-4 h-4" />
            <span>Data source: FALA MDB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;