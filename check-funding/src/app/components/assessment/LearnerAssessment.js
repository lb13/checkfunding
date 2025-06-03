import React, { useState } from 'react';
import { User, Calculator } from 'lucide-react';
import { lookupPostcodeAuthority } from '../../utils/postcodeAuthority';


const LearnerAssessment = ({ onAssessmentComplete }) => {
  const [learnerData, setLearnerData] = useState({
    age: '',
    employmentStatus: '',
    benefits: [],
    takeHomePay: '',
    partnerBenefitClaim: false,
    qualificationLevel: '',
    postcode: '',
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

  // Lookup authority on each render (safe, fast)
  const authority = lookupPostcodeAuthority(learnerData.postcode);

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
            <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
            <input
              type="text"
              value={learnerData.postcode}
              onChange={(e) => handleInputChange('postcode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your postcode"
            />
          </div>
          {learnerData.postcode && (
            <div className="mt-2 text-sm text-gray-600">
              Funding Authority: {authority || 'Not found'}
            </div>
          )}

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

export default LearnerAssessment;