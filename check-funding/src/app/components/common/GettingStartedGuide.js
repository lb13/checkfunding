import React from 'react';

const GettingStartedGuide = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">For Prospective Learners:</h4>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Complete the learner assessment to check your eligibility</li>
            <li>Search for courses by title or Learning Aim Reference</li>
            <li>See personalized funding options based on your situation</li>
            <li>Contact providers for enrollment information</li>
          </ol>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 mb-2">For Enrollment Agents:</h4>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Use learner assessment to quickly check eligibility</li>
            <li>Look up funding rates for specific courses</li>
            <li>Verify funding streams and application deadlines</li>
            <li>Access current funding rules and thresholds</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedGuide;