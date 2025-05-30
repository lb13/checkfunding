"use client";

import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, PoundSterling, Users, BookOpen, AlertCircle, CheckCircle, User, Calculator, ArrowRight, Info } from 'lucide-react';

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

const FundingCard = ({ title, funded, rate, icon: Icon, eligible = null, reasoning = null }) => (
  <div className={`p-4 rounded-lg border-2 ${
    eligible === true ? 'border-green-200 bg-green-50' : 
    eligible === false ? 'border-red-200 bg-red-50' :
    funded ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${
          eligible === true ? 'text-green-600' : 
          eligible === false ? 'text-red-600' :
          funded ? 'text-blue-600' : 'text-gray-400'
        }`} />
        <span className="font-medium text-sm">{title}</span>
      </div>
      {eligible === true ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : eligible === false ? (
        <AlertCircle className="w-5 h-5 text-red-600" />
      ) : funded ? (
        <CheckCircle className="w-5 h-5 text-blue-600" />
      ) : (
        <AlertCircle className="w-5 h-5 text-gray-400" />
      )}
    </div>
    <div className="text-right mb-2">
      {funded ? (
        <span className={`text-lg font-bold ${
          eligible === true ? 'text-green-700' : 
          eligible === false ? 'text-red-700' : 'text-blue-700'
        }`}>
          £{rate.toLocaleString()}
        </span>
      ) : (
        <span className="text-sm text-gray-500">Not funded</span>
      )}
    </div>
    {reasoning && (
      <div className="text-xs text-gray-600 border-t pt-2">
        {reasoning}
      </div>
    )}
  </div>
);

const LearnerAssessment = ({ onAssessmentComplete }) => {
  const [learnerData, setLearnerData] = useState({
    age: '',
    employmentStatus: '',
    benefits: [],
    takeHomePay: '',
    partnerBenefitClaim: false,
    qualificationLevel: '',
    location: 'england'
  });

  const handleInputChange = (field, value) => {
    setLearnerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBenefitChange = (benefit, checked) => {
    setLearnerData(prev => ({
      ...prev,
      benefits: checked 
        ? [...prev.benefits, benefit]
        : prev.benefits.filter(b => b !== benefit)
    }));
  };

  const assessEligibility = () => {
    const age = parseInt(learnerData.age);
    const takeHomePay = parseInt(learnerData.takeHomePay) || 0;
    const payThreshold = learnerData.partnerBenefitClaim ? 552 : 345;
    
    const assessment = {
      '16-19': age >= 16 && age < 19,
      adult: age >= 19,
      freeCoursesForJobs: false,
      advancedLearnerLoan: age >= 19 && (learnerData.qualificationLevel === '3' || learnerData.qualificationLevel === '4+')
    };

    // Free Courses for Jobs eligibility
    if (age >= 19) {
      const unemployedBenefits = ['jsa', 'esa', 'universal-credit'];
      const hasUnemployedBenefit = learnerData.benefits.some(b => unemployedBenefits.includes(b));
      
      if (hasUnemployedBenefit) {
        if (learnerData.benefits.includes('universal-credit')) {
          assessment.freeCoursesForJobs = takeHomePay < payThreshold;
        } else {
          assessment.freeCoursesForJobs = true;
        }
      }
    }

    const reasoning = {
      '16-19': age >= 16 && age < 19 ? 'Eligible due to age (16-18)' : 'Not eligible - must be aged 16-18',
      adult: age >= 19 ? 'Eligible due to age (19+)' : 'Not eligible - must be 19 or over',
      freeCoursesForJobs: assessment.freeCoursesForJobs ? 
        'Eligible - meets unemployment criteria' : 
        'Not eligible - must be unemployed or on qualifying benefits with low income',
      advancedLearnerLoan: assessment.advancedLearnerLoan ?
        'Eligible - 19+ studying Level 3 or above' :
        'Not eligible - must be 19+ studying Level 3 or 4'
    };

    onAssessmentComplete({ assessment, reasoning, learnerData });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Learner Eligibility Assessment
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              value={learnerData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
            <select
              value={learnerData.employmentStatus}
              onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select status</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="self-employed">Self-employed</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Take-Home Pay (£)</label>
            <input
              type="number"
              value={learnerData.takeHomePay}
              onChange={(e) => handleInputChange('takeHomePay', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter monthly pay (excluding benefits)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification Level</label>
            <select
              value={learnerData.qualificationLevel}
              onChange={(e) => handleInputChange('qualificationLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select level</option>
              <option value="none">No formal qualifications</option>
              <option value="1">Level 1 (GCSE grades 3-1)</option>
              <option value="2">Level 2 (GCSE grades 9-4)</option>
              <option value="3">Level 3 (A Levels)</option>
              <option value="4+">Level 4+ (Degree/Higher)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits Received</label>
            <div className="space-y-2">
              {[
                { id: 'jsa', label: 'Jobseeker\'s Allowance (JSA)' },
                { id: 'esa', label: 'Employment & Support Allowance (ESA)' },
                { id: 'universal-credit', label: 'Universal Credit' },
                { id: 'pip', label: 'Personal Independence Payment' },
                { id: 'other', label: 'Other state benefits' }
              ].map(benefit => (
                <label key={benefit.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={learnerData.benefits.includes(benefit.id)}
                    onChange={(e) => handleBenefitChange(benefit.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{benefit.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={learnerData.partnerBenefitClaim}
                onChange={(e) => handleInputChange('partnerBenefitClaim', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Joint benefit claim with partner</span>
            </label>
          </div>

          <button
            onClick={assessEligibility}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Assess Eligibility
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAssessmentComplete = (assessment) => {
    setEligibilityAssessment(assessment);
    if (searchTerm) {
      // If there's already a search, stay on current tab to show combined results
    } else {
      // If no search yet, suggest they search for courses
      setActiveTab('search');
    }
  };

  const getPersonalizedFundingInfo = (courseData) => {
    if (!eligibilityAssessment) return null;

    const { assessment, reasoning } = eligibilityAssessment;
    const personalizedCards = [];

    // Check each funding stream against learner eligibility
    if (courseData.fundingStreams['16-19'].funded) {
      personalizedCards.push({
        title: '16-19 Funding',
        funded: courseData.fundingStreams['16-19'].funded,
        rate: courseData.fundingStreams['16-19'].rate,
        icon: Users,
        eligible: assessment['16-19'],
        reasoning: reasoning['16-19']
      });
    }

    if (courseData.fundingStreams.adult.funded) {
      personalizedCards.push({
        title: 'Adult Education Budget',
        funded: courseData.fundingStreams.adult.funded,
        rate: courseData.fundingStreams.adult.rate,
        icon: Users,
        eligible: assessment.adult,
        reasoning: reasoning.adult
      });
    }

    if (courseData.fundingStreams.freeCoursesForJobs.funded) {
      personalizedCards.push({
        title: 'Free Courses for Jobs',
        funded: courseData.fundingStreams.freeCoursesForJobs.funded,
        rate: courseData.fundingStreams.freeCoursesForJobs.rate,
        icon: CheckCircle,
        eligible: assessment.freeCoursesForJobs,
        reasoning: reasoning.freeCoursesForJobs
      });
    }

    if (courseData.fundingStreams.advancedLearnerLoan.funded) {
      personalizedCards.push({
        title: 'Advanced Learner Loan',
        funded: courseData.fundingStreams.advancedLearnerLoan.funded,
        rate: courseData.fundingStreams.advancedLearnerLoan.rate,
        icon: PoundSterling,
        eligible: assessment.advancedLearnerLoan,
        reasoning: reasoning.advancedLearnerLoan
      });
    }

    return personalizedCards;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'assessment'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Learner Assessment
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Course Search
            </button>
          </div>
        </div>

        {/* Learner Assessment */}
        {activeTab === 'assessment' && (
          <LearnerAssessment onAssessmentComplete={handleAssessmentComplete} />
        )}

        {/* Course Search */}
        {activeTab === 'search' && (
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
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
        )}

        {/* Results with Personalized Funding */}
        {searchTerm && (
          <div className="space-y-6">
            {filteredResults.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">No learning aims match your search criteria.</p>
              </div>
            ) : (
              filteredResults.map((result) => {
                const personalizedFunding = getPersonalizedFundingInfo(result);
                
                return (
                  <div key={result.learningAimRef} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Course Header */}
                    <div className="bg-blue-50 px-6 py-4 border-b">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{result.learningAimTitle}</h2>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              LAR: {result.learningAimRef}
                            </span>
                            <span>Level {result.qualificationLevel}</span>
                            <span>{result.awardOrgCode}</span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {result.guidedLearningHours}h GLH
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>Start by: {new Date(result.lastNewStartDate).toLocaleDateString()}</div>
                          <div>Cert end: {new Date(result.certificationEndDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Personalized Funding Information */}
                    <div className="p-6">
                      {eligibilityAssessment ? (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5" />
                            Your Personalized Funding Options
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {personalizedFunding.map((card, index) => (
                              <FundingCard key={index} {...card} />
                            ))}
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <div className="flex items-start gap-2">
                              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-blue-900">Personalized Assessment</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                  Results based on: Age {eligibilityAssessment.learnerData.age}, 
                                  {eligibilityAssessment.learnerData.employmentStatus && ` ${eligibilityAssessment.learnerData.employmentStatus},`}
                                  {eligibilityAssessment.learnerData.benefits.length > 0 && ` receiving ${eligibilityAssessment.learnerData.benefits.length} benefit(s),`}
                                  {eligibilityAssessment.learnerData.takeHomePay && ` £${eligibilityAssessment.learnerData.takeHomePay}/month income`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <PoundSterling className="w-5 h-5" />
                              General Funding Streams
                            </h3>
                            <button
                              onClick={() => setActiveTab('assessment')}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            >
                              Get personalized assessment <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FundingCard
                              title="16-19 Funding"
                              funded={result.fundingStreams['16-19'].funded}
                              rate={result.fundingStreams['16-19'].rate}
                              icon={Users}
                            />
                            <FundingCard
                              title="Adult Education Budget"
                              funded={result.fundingStreams.adult.funded}
                              rate={result.fundingStreams.adult.rate}
                              icon={Users}
                            />
                            <FundingCard
                              title="Free Courses for Jobs"
                              funded={result.fundingStreams.freeCoursesForJobs.funded}
                              rate={result.fundingStreams.freeCoursesForJobs.rate}
                              icon={CheckCircle}
                            />
                            <FundingCard
                              title="Advanced Learner Loan"
                              funded={result.fundingStreams.advancedLearnerLoan.funded}
                              rate={result.fundingStreams.advancedLearnerLoan.rate}
                              icon={PoundSterling}
                            />
                          </div>
                        </>
                      )}

                      {/* Additional Course Info */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Guided Learning Hours:</span>
                            <div className="text-gray-900">{result.guidedLearningHours}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Total Qualification Time:</span>
                            <div className="text-gray-900">{result.totalQualificationTime}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <div className="text-green-600 font-medium">{result.status}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Sector:</span>
                            <div className="text-gray-900">{result.sector}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Getting Started Guide */}
        {!searchTerm && activeTab === 'search' && (
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
        )}
      </div>
    </div>
  );
}