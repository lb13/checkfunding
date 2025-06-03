import { useState, useMemo } from 'react';

// Funding stream eligibility rules and thresholds
const ELIGIBILITY_RULES = {
  payThresholds: {
    single: 345,
    joint: 552
  },
  unemployedBenefits: ['jsa', 'esa', 'universal-credit'],
  ageRanges: {
    youth: { min: 16, max: 18 },
    adult: { min: 19, max: Infinity }
  },
  qualificationLevels: {
    advancedLearnerLoan: ['3', '4+']
  }
};

export const useEligibility = () => {
  const [learnerData, setLearnerData] = useState({
    age: '',
    employmentStatus: '',
    benefits: [],
    takeHomePay: '',
    partnerBenefitClaim: false,
    qualificationLevel: '',
    location: 'england'
  });

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
      location: 'england'
    });
    setEligibilityAssessment(null);
  };

  // Core eligibility assessment logic
  const assessEligibility = (customLearnerData = null) => {
    const dataToAssess = customLearnerData || learnerData;
    const age = parseInt(dataToAssess.age);
    const takeHomePay = parseInt(dataToAssess.takeHomePay) || 0;
    const payThreshold = dataToAssess.partnerBenefitClaim 
      ? ELIGIBILITY_RULES.payThresholds.joint 
      : ELIGIBILITY_RULES.payThresholds.single;
    
    // Basic age-based eligibility
    const assessment = {
      '16-19': age >= ELIGIBILITY_RULES.ageRanges.youth.min && age <= ELIGIBILITY_RULES.ageRanges.youth.max,
      adult: age >= ELIGIBILITY_RULES.ageRanges.adult.min,
      freeCoursesForJobs: false,
      advancedLearnerLoan: age >= ELIGIBILITY_RULES.ageRanges.adult.min && 
        ELIGIBILITY_RULES.qualificationLevels.advancedLearnerLoan.includes(dataToAssess.qualificationLevel)
    };

    // Free Courses for Jobs eligibility logic
    if (age >= ELIGIBILITY_RULES.ageRanges.adult.min) {
      const hasUnemployedBenefit = dataToAssess.benefits.some(b => 
        ELIGIBILITY_RULES.unemployedBenefits.includes(b)
      );
      
      if (hasUnemployedBenefit) {
        if (dataToAssess.benefits.includes('universal-credit')) {
          assessment.freeCoursesForJobs = takeHomePay < payThreshold;
        } else {
          assessment.freeCoursesForJobs = true;
        }
      }
    }

    // Generate reasoning for each funding stream
    const reasoning = {
      '16-19': assessment['16-19'] 
        ? `Eligible due to age (${age} years old, within 16-18 range)` 
        : `Not eligible - must be aged 16-18 (currently ${age})`,
      
      adult: assessment.adult 
        ? `Eligible due to age (${age} years old, 19 or over)` 
        : `Not eligible - must be 19 or over (currently ${age})`,
      
      freeCoursesForJobs: assessment.freeCoursesForJobs 
        ? getFreeCoursesReasoning(dataToAssess, takeHomePay, payThreshold)
        : getFreeCoursesRejectionReason(age, dataToAssess, takeHomePay, payThreshold),
      
      advancedLearnerLoan: assessment.advancedLearnerLoan
        ? `Eligible - ${age} years old studying Level ${dataToAssess.qualificationLevel}`
        : getAdvancedLearnerLoanRejectionReason(age, dataToAssess.qualificationLevel)
    };

    const result = { 
      assessment, 
      reasoning, 
      learnerData: dataToAssess,
      assessmentDate: new Date().toISOString()
    };

    if (!customLearnerData) {
      setEligibilityAssessment(result);
    }

    return result;
  };

  // Helper function for Free Courses eligibility reasoning
  const getFreeCoursesReasoning = (data, takeHomePay, threshold) => {
    const benefitsList = data.benefits.filter(b => 
      ELIGIBILITY_RULES.unemployedBenefits.includes(b)
    ).join(', ');
    
    if (data.benefits.includes('universal-credit')) {
      return `Eligible - receiving Universal Credit with take-home pay £${takeHomePay} (below £${threshold} threshold)`;
    }
    return `Eligible - receiving qualifying benefits (${benefitsList})`;
  };

  const getFreeCoursesRejectionReason = (age, data, takeHomePay, threshold) => {
    if (age < ELIGIBILITY_RULES.ageRanges.adult.min) {
      return `Not eligible - must be 19 or over (currently ${age})`;
    }
    
    const hasUnemployedBenefit = data.benefits.some(b => 
      ELIGIBILITY_RULES.unemployedBenefits.includes(b)
    );
    
    if (!hasUnemployedBenefit) {
      return 'Not eligible - must be receiving JSA, ESA, or Universal Credit';
    }
    
    if (data.benefits.includes('universal-credit') && takeHomePay >= threshold) {
      return `Not eligible - Universal Credit recipients must earn under £${threshold}/month (currently £${takeHomePay})`;
    }
    
    return 'Not eligible - must meet unemployment and income criteria';
  };

  const getAdvancedLearnerLoanRejectionReason = (age, qualLevel) => {
    if (age < ELIGIBILITY_RULES.ageRanges.adult.min) {
      return `Not eligible - must be 19 or over (currently ${age})`;
    }
    if (!ELIGIBILITY_RULES.qualificationLevels.advancedLearnerLoan.includes(qualLevel)) {
      return qualLevel 
        ? `Not eligible - must be studying Level 3 or 4+ (currently Level ${qualLevel})`
        : 'Not eligible - must be studying Level 3 or 4+';
    }
    return 'Not eligible - must be 19+ studying Level 3 or 4';
  };

  // Get personalized funding information for a specific course
  const getPersonalizedFundingInfo = (courseData, customAssessment = null) => {
    const assessmentToUse = customAssessment || eligibilityAssessment;
    if (!assessmentToUse) return null;

    const { assessment, reasoning } = assessmentToUse;
    const personalizedCards = [];

    // Define funding stream mappings
    const fundingStreamMappings = [
      {
        key: '16-19',
        title: '16-19 Funding',
        eligibilityKey: '16-19',
        icon: 'Users'
      },
      {
        key: 'adult',
        title: 'Adult Education Budget',
        eligibilityKey: 'adult',
        icon: 'Users'
      },
      {
        key: 'freeCoursesForJobs',
        title: 'Free Courses for Jobs',
        eligibilityKey: 'freeCoursesForJobs',
        icon: 'CheckCircle'
      },
      {
        key: 'advancedLearnerLoan',
        title: 'Advanced Learner Loan',
        eligibilityKey: 'advancedLearnerLoan',
        icon: 'PoundSterling'
      }
    ];

    // Build personalized cards for funded streams
    fundingStreamMappings.forEach(stream => {
      const courseStream = courseData.fundingStreams[stream.key];
      if (courseStream && courseStream.funded) {
        personalizedCards.push({
          title: stream.title,
          funded: courseStream.funded,
          rate: courseStream.rate,
          icon: stream.icon,
          eligible: assessment[stream.eligibilityKey],
          reasoning: reasoning[stream.eligibilityKey]
        });
      }
    });

    return personalizedCards;
  };

  // Calculate eligibility summary stats
  const eligibilitySummary = useMemo(() => {
    if (!eligibilityAssessment) return null;

    const { assessment } = eligibilityAssessment;
    const eligibleStreams = Object.values(assessment).filter(Boolean).length;
    const totalStreams = Object.keys(assessment).length;

    return {
      eligibleStreams,
      totalStreams,
      eligibilityRate: Math.round((eligibleStreams / totalStreams) * 100),
      strongestEligibility: Object.entries(assessment)
        .filter(([_, eligible]) => eligible)
        .map(([stream, _]) => stream)
    };
  }, [eligibilityAssessment]);

  // Validate learner data completeness
  const validateLearnerData = (dataToValidate = null) => {
    const data = dataToValidate || learnerData;
    const errors = [];
    const warnings = [];

    if (!data.age || parseInt(data.age) < 16 || parseInt(data.age) > 100) {
      errors.push('Please enter a valid age between 16 and 100');
    }

    if (!data.employmentStatus) {
      warnings.push('Employment status not specified');
    }

    if (!data.qualificationLevel) {
      warnings.push('Qualification level not specified - may affect Advanced Learner Loan eligibility');
    }

    const age = parseInt(data.age);
    if (age >= 19 && data.benefits.length === 0 && !data.takeHomePay) {
      warnings.push('No benefits or income information - may affect Free Courses for Jobs eligibility');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness: calculateDataCompleteness(data)
    };
  };

  const calculateDataCompleteness = (data) => {
    const fields = ['age', 'employmentStatus', 'qualificationLevel', 'takeHomePay'];
    const completedFields = fields.filter(field => data[field] && data[field] !== '').length;
    const benefitsCompleted = data.benefits.length > 0 ? 1 : 0;
    
    return Math.round(((completedFields + benefitsCompleted) / (fields.length + 1)) * 100);
  };

  return {
    // State
    learnerData,
    eligibilityAssessment,
    eligibilitySummary,
    
    // Actions
    updateLearnerData,
    updateBenefits,
    resetLearnerData,
    assessEligibility,
    
    // Utilities
    getPersonalizedFundingInfo,
    validateLearnerData,
    
    // Constants
    ELIGIBILITY_RULES
  };
};