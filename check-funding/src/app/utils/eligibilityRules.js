// eligibilityRules.js - Centralized funding eligibility logic

/**
 * Constants for funding eligibility thresholds and criteria
 */
export const FUNDING_CONSTANTS = {
  AGE_THRESHOLDS: {
    YOUNG_PERSON_MIN: 16,
    YOUNG_PERSON_MAX: 18,
    ADULT_MIN: 19
  },
  INCOME_THRESHOLDS: {
    UNIVERSAL_CREDIT_SINGLE: 345,
    UNIVERSAL_CREDIT_JOINT: 552
  },
  QUALIFICATION_LEVELS: {
    NONE: 'none',
    LEVEL_1: '1',
    LEVEL_2: '2', 
    LEVEL_3: '3',
    LEVEL_4_PLUS: '4+'
  },
  BENEFIT_TYPES: {
    JSA: 'jsa',
    ESA: 'esa',
    UNIVERSAL_CREDIT: 'universal-credit',
    PIP: 'pip',
    OTHER: 'other'
  },
  EMPLOYMENT_STATUS: {
    EMPLOYED: 'employed',
    UNEMPLOYED: 'unemployed',
    SELF_EMPLOYED: 'self-employed',
    STUDENT: 'student'
  }
};

/**
 * Check if learner is eligible for 16-19 funding
 * @param {Object} learnerData - Learner information
 * @returns {Object} - Eligibility result with boolean and reasoning
 */
export const check16To19Eligibility = (learnerData) => {
  const age = parseInt(learnerData.age);
  const isEligible = age >= FUNDING_CONSTANTS.AGE_THRESHOLDS.YOUNG_PERSON_MIN && 
                    age <= FUNDING_CONSTANTS.AGE_THRESHOLDS.YOUNG_PERSON_MAX;
  
  return {
    eligible: isEligible,
    reasoning: isEligible 
      ? `Eligible due to age (${age} - within 16-18 range)`
      : `Not eligible - must be aged 16-18 (currently ${age})`
  };
};

/**
 * Check if learner is eligible for Adult Education Budget funding
 * @param {Object} learnerData - Learner information
 * @returns {Object} - Eligibility result with boolean and reasoning
 */
export const checkAdultFundingEligibility = (learnerData) => {
  const age = parseInt(learnerData.age);
  const isEligible = age >= FUNDING_CONSTANTS.AGE_THRESHOLDS.ADULT_MIN;
  
  return {
    eligible: isEligible,
    reasoning: isEligible 
      ? `Eligible due to age (${age} - 19 or over)`
      : `Not eligible - must be 19 or over (currently ${age})`
  };
};

/**
 * Check if learner is eligible for Free Courses for Jobs
 * @param {Object} learnerData - Learner information
 * @returns {Object} - Eligibility result with boolean and reasoning
 */
export const checkFreeCoursesForJobsEligibility = (learnerData) => {
  const age = parseInt(learnerData.age);
  
  // Must be 19 or over
  if (age < FUNDING_CONSTANTS.AGE_THRESHOLDS.ADULT_MIN) {
    return {
      eligible: false,
      reasoning: `Not eligible - must be 19 or over (currently ${age})`
    };
  }
  
  const takeHomePay = parseInt(learnerData.takeHomePay) || 0;
  const payThreshold = learnerData.partnerBenefitClaim 
    ? FUNDING_CONSTANTS.INCOME_THRESHOLDS.UNIVERSAL_CREDIT_JOINT
    : FUNDING_CONSTANTS.INCOME_THRESHOLDS.UNIVERSAL_CREDIT_SINGLE;
  
  // Check for qualifying unemployment benefits
  const unemployedBenefits = [
    FUNDING_CONSTANTS.BENEFIT_TYPES.JSA,
    FUNDING_CONSTANTS.BENEFIT_TYPES.ESA,
    FUNDING_CONSTANTS.BENEFIT_TYPES.UNIVERSAL_CREDIT
  ];
  
  const hasUnemployedBenefit = learnerData.benefits?.some(benefit => 
    unemployedBenefits.includes(benefit)
  );
  
  if (!hasUnemployedBenefit) {
    return {
      eligible: false,
      reasoning: 'Not eligible - must be receiving JSA, ESA, or Universal Credit'
    };
  }
  
  // Special handling for Universal Credit - income threshold applies
  if (learnerData.benefits?.includes(FUNDING_CONSTANTS.BENEFIT_TYPES.UNIVERSAL_CREDIT)) {
    const meetsIncomeThreshold = takeHomePay < payThreshold;
    const partnerText = learnerData.partnerBenefitClaim ? ' (joint claim)' : ' (single claim)';
    
    return {
      eligible: meetsIncomeThreshold,
      reasoning: meetsIncomeThreshold
        ? `Eligible - receiving Universal Credit with income £${takeHomePay} below £${payThreshold} threshold${partnerText}`
        : `Not eligible - Universal Credit income £${takeHomePay} exceeds £${payThreshold} threshold${partnerText}`
    };
  }
  
  // For JSA/ESA - automatically eligible
  const benefitNames = learnerData.benefits
    .filter(b => [FUNDING_CONSTANTS.BENEFIT_TYPES.JSA, FUNDING_CONSTANTS.BENEFIT_TYPES.ESA].includes(b))
    .map(b => b.toUpperCase())
    .join('/');
    
  return {
    eligible: true,
    reasoning: `Eligible - receiving ${benefitNames} (unemployment benefit)`
  };
};

/**
 * Check if learner is eligible for Advanced Learner Loan
 * @param {Object} learnerData - Learner information
 * @param {Object} qualificationData - Qualification information (optional)
 * @returns {Object} - Eligibility result with boolean and reasoning
 */
export const checkAdvancedLearnerLoanEligibility = (learnerData, qualificationData = null) => {
  const age = parseInt(learnerData.age);
  
  // Must be 19 or over
  if (age < FUNDING_CONSTANTS.AGE_THRESHOLDS.ADULT_MIN) {
    return {
      eligible: false,
      reasoning: `Not eligible - must be 19 or over (currently ${age})`
    };
  }
  
  // Check qualification level - either from learner data or qualification data
  const qualLevel = qualificationData?.qualificationLevel || learnerData.qualificationLevel;
  const isHigherLevel = qualLevel === FUNDING_CONSTANTS.QUALIFICATION_LEVELS.LEVEL_3 || 
                       qualLevel === FUNDING_CONSTANTS.QUALIFICATION_LEVELS.LEVEL_4_PLUS;
  
  if (!isHigherLevel) {
    return {
      eligible: false,
      reasoning: `Not eligible - course must be Level 3 or above (current: Level ${qualLevel})`
    };
  }
  
  return {
    eligible: true,
    reasoning: `Eligible - age ${age} (19+) studying Level ${qualLevel} qualification`
  };
};

/**
 * Check apprenticeship funding eligibility
 * @param {Object} learnerData - Learner information
 * @returns {Object} - Eligibility result with boolean and reasoning
 */
export const checkApprenticeshipEligibility = (learnerData) => {
  const age = parseInt(learnerData.age);
  
  // Apprenticeships available from age 16
  if (age < FUNDING_CONSTANTS.AGE_THRESHOLDS.YOUNG_PERSON_MIN) {
    return {
      eligible: false,
      reasoning: `Not eligible - must be 16 or over (currently ${age})`
    };
  }
  
  // Employment status considerations
  const employmentStatus = learnerData.employmentStatus;
  if (employmentStatus === FUNDING_CONSTANTS.EMPLOYMENT_STATUS.UNEMPLOYED) {
    return {
      eligible: true,
      reasoning: `Eligible - age ${age}, seeking employment through apprenticeship`
    };
  }
  
  return {
    eligible: true,
    reasoning: `Eligible - age ${age}, can undertake apprenticeship training`
  };
};

/**
 * Comprehensive eligibility check for all funding streams
 * @param {Object} learnerData - Complete learner information
 * @param {Object} qualificationData - Qualification information (optional)
 * @returns {Object} - Complete eligibility assessment
 */
export const assessAllFundingEligibility = (learnerData, qualificationData = null) => {
  const results = {
    '16-19': check16To19Eligibility(learnerData),
    adult: checkAdultFundingEligibility(learnerData),
    freeCoursesForJobs: checkFreeCoursesForJobsEligibility(learnerData),
    advancedLearnerLoan: checkAdvancedLearnerLoanEligibility(learnerData, qualificationData),
    apprenticeship: checkApprenticeshipEligibility(learnerData)
  };
  
  // Create summary
  const eligibleStreams = Object.entries(results)
    .filter(([_, result]) => result.eligible)
    .map(([stream, _]) => stream);
    
  const summary = {
    totalEligible: eligibleStreams.length,
    eligibleStreams,
    hasAnyFunding: eligibleStreams.length > 0,
    primaryRecommendation: getPrimaryFundingRecommendation(results, learnerData)
  };
  
  return {
    results,
    summary,
    learnerProfile: createLearnerProfile(learnerData)
  };
};

/**
 * Get the primary funding recommendation based on eligibility
 * @param {Object} results - Eligibility results
 * @param {Object} learnerData - Learner information
 * @returns {Object} - Primary recommendation
 */
export const getPrimaryFundingRecommendation = (results, learnerData) => {
  const age = parseInt(learnerData.age);
  
  // Priority order based on typical funding pathways
  if (results['16-19'].eligible) {
    return {
      stream: '16-19',
      title: '16-19 Education Funding',
      reasoning: 'Primary pathway for young learners - fully funded'
    };
  }
  
  if (results.freeCoursesForJobs.eligible) {
    return {
      stream: 'freeCoursesForJobs',
      title: 'Free Courses for Jobs',
      reasoning: 'Best option for unemployed adults - fully funded with no repayment'
    };
  }
  
  if (results.adult.eligible) {
    return {
      stream: 'adult',
      title: 'Adult Education Budget',
      reasoning: 'Standard adult funding pathway'
    };
  }
  
  if (results.advancedLearnerLoan.eligible) {
    return {
      stream: 'advancedLearnerLoan',
      title: 'Advanced Learner Loan',
      reasoning: 'Loan-based funding for higher level qualifications'
    };
  }
  
  if (results.apprenticeship.eligible) {
    return {
      stream: 'apprenticeship',
      title: 'Apprenticeship Funding',
      reasoning: 'Work-based learning with employer involvement'
    };
  }
  
  return {
    stream: null,
    title: 'No suitable funding found',
    reasoning: 'Consider reviewing eligibility criteria or exploring alternative options'
  };
};

/**
 * Create a learner profile summary
 * @param {Object} learnerData - Learner information
 * @returns {Object} - Learner profile
 */
export const createLearnerProfile = (learnerData) => {
  const age = parseInt(learnerData.age);
  let ageGroup = 'Unknown';
  
  if (age >= 16 && age <= 18) {
    ageGroup = 'Young Person (16-18)';
  } else if (age >= 19 && age <= 24) {
    ageGroup = 'Young Adult (19-24)';
  } else if (age >= 25) {
    ageGroup = 'Adult (25+)';
  }
  
  const hasUnemploymentBenefits = learnerData.benefits?.some(b => 
    [FUNDING_CONSTANTS.BENEFIT_TYPES.JSA, FUNDING_CONSTANTS.BENEFIT_TYPES.ESA, 
     FUNDING_CONSTANTS.BENEFIT_TYPES.UNIVERSAL_CREDIT].includes(b)
  );
  
  return {
    ageGroup,
    age: age,
    employmentStatus: learnerData.employmentStatus || 'Not specified',
    hasUnemploymentBenefits,
    benefitCount: learnerData.benefits?.length || 0,
    hasIncome: (parseInt(learnerData.takeHomePay) || 0) > 0,
    monthlyIncome: parseInt(learnerData.takeHomePay) || 0,
    highestQualification: learnerData.qualificationLevel || 'Not specified',
    isJointBenefitClaim: learnerData.partnerBenefitClaim || false
  };
};