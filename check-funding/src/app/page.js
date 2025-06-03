"use client";

import React, { useState, useMemo } from 'react';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import LearnerAssessment from './components/assessment/LearnerAssessment';
import CourseSearch from './components/search/CourseSearch';
import CourseResults from './components/search/CourseResults';
import GettingStartedGuide from './components/common/GettingStartedGuide';
import { assessLearnerFunding } from './utils/simpleEligibility';

// Sample data structure matching what you'd get from the MDB file
const sampleData = [
  {
    learningAimRef: '60003456',
    learningAimTitle: 'BTEC Level 3 National Diploma in Information Technology',
    awardOrgCode: 'PEARSON',
    qualificationLevel: '3',
    fundingStreams: {
      '16-19': { funded: true, rate: 2840 },
      'adult': { funded: true, rate: 2840 },
      'apprenticeship': { funded: false, rate: 0 },
      'advancedLearnerLoan': { funded: true, rate: 2840 },
      'freeCoursesForJobs': { funded: true, rate: 2840 }
    },
    lastNewStartDate: '2025-07-31',
    certificationEndDate: '2026-12-31',
    guidedLearningHours: 720,
    totalQualificationTime: 1080,
    status: 'Active',
    freeCoursesEligible: true,
    sector: 'Digital'
  },
  {
    learningAimRef: '50117729',
    learningAimTitle: 'Level 2 Certificate in Principles of Customer Service',
    awardOrgCode: 'NCFE',
    qualificationLevel: '2',
    fundingStreams: {
      '16-19': { funded: true, rate: 1240 },
      'adult': { funded: true, rate: 1240 },
      'apprenticeship': { funded: true, rate: 1240 },
      'advancedLearnerLoan': { funded: false, rate: 0 },
      'freeCoursesForJobs': { funded: true, rate: 1240 }
    },
    lastNewStartDate: '2025-08-31',
    certificationEndDate: '2026-08-31',
    guidedLearningHours: 155,
    totalQualificationTime: 190,
    status: 'Active',
    freeCoursesEligible: true,
    sector: 'Business'
  }
];

export default function CompleteFundingTool() {
  const [searchTerm, setSearchTerm] = useState('');
  const [eligibilityAssessment, setEligibilityAssessment] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [lastUpdate, setLastUpdate] = useState('2025-05-28 09:15:00');

  const filteredResults = useMemo(() => {
    if (!searchTerm) return [];
    return sampleData.filter(item =>
      item.learningAimRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.learningAimTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Example: When learner assessment is completed
  const handleAssessmentComplete = (learnerData, qualificationData) => {
    const assessment = assessLearnerFunding(learnerData, qualificationData);
    setEligibilityAssessment(assessment);
    if (!searchTerm) setActiveTab('search');
  };

  const handleGoToAssessment = () => setActiveTab('assessment');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Header lastUpdate={lastUpdate} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'assessment' && (
          <LearnerAssessment onAssessmentComplete={handleAssessmentComplete} />
        )}

        {activeTab === 'search' && (
          <>
            <CourseSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            {searchTerm ? (
              <CourseResults
                filteredResults={filteredResults}
                eligibilityAssessment={eligibilityAssessment}
                onGoToAssessment={handleGoToAssessment}
              />
            ) : (
              <GettingStartedGuide />
            )}
          </>
        )}
      </div>
    </div>
  );
}