import React from 'react';
import { AlertCircle, BookOpen, Calculator, Info, PoundSterling, Users, CheckCircle, ArrowRight } from 'lucide-react';
import FundingCard from '../ui/FundingCard';

const CourseResults = ({ filteredResults, eligibilityAssessment, onGoToAssessment }) => {
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

  if (filteredResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">No learning aims match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredResults.map((result) => {
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
                      onClick={onGoToAssessment}
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
      })}
    </div>
  );
};

export default CourseResults;