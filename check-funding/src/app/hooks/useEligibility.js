import { useState } from 'react';
import { assessLearnerFunding } from '../utils/simpleEligibility';

// This hook now only manages learner form state and runs the new eligibility logic.
export const useEligibility = () => {
  const [learnerData, setLearnerData] = useState({
    age: '',
    employmentStatus: '',
    benefits: [],
    takeHomePay: '',
    partnerBenefitClaim: false,
    qualificationLevel: '',
    nationality: '',
    visaType: '',
    postcode: '',
  });

  const [qualificationData, setQualificationData] = useState({});
  const [eligibilityAssessment, setEligibilityAssessment] = useState(null);

  // Update individual learner data fields
  const updateLearnerData = (field, value) => {
    setLearnerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle benefit selection changes
  const updateBenefits = (benefit, checked) => {
    setLearnerData(prev => ({
      ...prev,
      benefits: checked 
        ? [...prev.benefits, benefit]
        : prev.benefits.filter(b => b !== benefit)
    }));
  };

  // Reset learner data to initial state
  const resetLearnerData = () => {
    setLearnerData({
      age: '',
      employmentStatus: '',
      benefits: [],
      takeHomePay: '',
      partnerBenefitClaim: false,
      qualificationLevel: '',
      nationality: '',
      visaType: '',
      postcode: '',
    });
    setQualificationData({});
    setEligibilityAssessment(null);
  };

  // Run the new eligibility logic
  const assessEligibility = (customLearnerData = null, customQualificationData = null) => {
    const dataToAssess = customLearnerData || learnerData;
    const qualToAssess = customQualificationData || qualificationData;
    const result = assessLearnerFunding(dataToAssess, qualToAssess);
    setEligibilityAssessment(result);
    return result;
  };

  return {
    learnerData,
    qualificationData,
    eligibilityAssessment,
    updateLearnerData,
    updateBenefits,
    setQualificationData,
    resetLearnerData,
    assessEligibility,
  };
};