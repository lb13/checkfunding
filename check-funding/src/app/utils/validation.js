// validation.js - Input validation and data sanitization utilities

import { FUNDING_CONSTANTS } from './eligibilityRules.js';

/**
 * Validation error class for structured error handling
 */
export class ValidationError extends Error {
  constructor(field, message, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Validate age input
 * @param {string|number} age - Age value to validate
 * @returns {Object} - Validation result
 */
export const validateAge = (age) => {
  const numAge = parseInt(age);
  
  if (!age || age === '') {
    return {
      isValid: false,
      error: 'Age is required',
      sanitized: null
    };
  }
  
  if (isNaN(numAge)) {
    return {
      isValid: false,
      error: 'Age must be a valid number',
      sanitized: null
    };
  }
  
  if (numAge < 14 || numAge > 100) {
    return {
      isValid: false,
      error: 'Age must be between 14 and 100',
      sanitized: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitized: numAge
  };
};

/**
 * Validate employment status
 * @param {string} status - Employment status to validate
 * @returns {Object} - Validation result
 */
export const validateEmploymentStatus = (status) => {
  const validStatuses = Object.values(FUNDING_CONSTANTS.EMPLOYMENT_STATUS);
  
  if (!status || status === '') {
    return {
      isValid: false,
      error: 'Employment status is required',
      sanitized: null
    };
  }
  
  if (!validStatuses.includes(status)) {
    return {
      isValid: false,
      error: 'Invalid employment status',
      sanitized: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitized: status
  };
};

/**
 * Validate monthly income
 * @param {string|number} income - Income value to validate
 * @returns {Object} - Validation result
 */
export const validateMonthlyIncome = (income) => {
  // Income is optional, so empty values are valid
  if (!income || income === '') {
    return {
      isValid: true,
      error: null,
      sanitized: 0
    };
  }
  
  const numIncome = parseInt(income);
  
  if (isNaN(numIncome)) {
    return {
      isValid: false,
      error: 'Income must be a valid number',
      sanitized: null
    };
  }
  
  if (numIncome < 0) {
    return {
      isValid: false,
      error: 'Income cannot be negative',
      sanitized: null
    };
  }
  
  if (numIncome > 50000) {
    return {
      isValid: false,
      error: 'Income seems unusually high - please check',
      sanitized: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitized: numIncome
  };
};

/**
 * Validate qualification level
 * @param {string} level - Qualification level to validate
 * @returns {Object} - Validation result
 */
export const validateQualificationLevel = (level) => {
  const validLevels = Object.values(FUNDING_CONSTANTS.QUALIFICATION_LEVELS);
  
  if (!level || level === '') {
    return {
      isValid: false,
      error: 'Qualification level is required',
      sanitized: null
    };
  }
  
  if (!validLevels.includes(level)) {
    return {
      isValid: false,
      error: 'Invalid qualification level',
      sanitized: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitized: level
  };
};

/**
 * Validate benefits array
 * @param {Array} benefits - Array of benefit codes to validate
 * @returns {Object} - Validation result
 */
export const validateBenefits = (benefits = []) => {
  if (!Array.isArray(benefits)) {
    return {
      isValid: false,
      error: 'Benefits must be an array',
      sanitized: []
    };
  }
  
  const validBenefits = Object.values(FUNDING_CONSTANTS.BENEFIT_TYPES);
  const invalidBenefits = benefits.filter(benefit => !validBenefits.includes(benefit));
  
  if (invalidBenefits.length > 0) {
    return {
      isValid: false,
      error: `Invalid benefit codes: ${invalidBenefits.join(', ')}`,
      sanitized: []
    };
  }
  
  // Remove duplicates
  const uniqueBenefits = [...new Set(benefits)];
  
  return {
    isValid: true,
    error: null,
    sanitized: uniqueBenefits
  };
};

/**
 * Validate Learning Aim Reference (LAR)
 * @param {string} lar - Learning Aim Reference to validate
 * @returns {Object} - Validation result
 */
export const validateLearningAimReference = (lar) => {
  if (!lar || lar === '') {
    return {
      isValid: false,
      error: 'Learning Aim Reference is required',
      sanitized: null
    };
  }
  
  // Remove whitespace and convert to uppercase
  const sanitized = lar.trim().toUpperCase();
  
  // Basic format validation - should be 8 characters, alphanumeric
  if (!/^[A-Z0-9]{8}$/.test(sanitized)) {
    return {
      isValid: false,
      error: 'Learning Aim Reference must be 8 alphanumeric characters',
      sanitized: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitized: sanitized
  };
};

/**
 * Validate course title
 * @param {string} title - Course title to validate
 * @returns {Object} - Validation result
 */
export const validateCourseTitle = (title) => {
  if (!title || title === '') {
    return {
      isValid: false,
      error: 'Course title is required',
      sanitized: null
    };
  }
  
  const sanitized = title.trim();
  
  if (sanitized.length < 5) {
    return {
      isValid: false,
      error: 'Course title must be at least 5 characters',
      sanitized: null
    };
  }
  
  if (sanitized.length > 200) {
    return {
      isValid: false,
      error: 'Course title must be less than 200 characters',
      sanitized: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitized: sanitized
  };
};

/**
 * Validate complete learner data object
 * @param {Object} learnerData - Complete learner data to validate
 * @returns {Object} - Comprehensive validation result
 */
export const validateLearnerData = (learnerData) => {
  const errors = [];
  const sanitizedData = {};
  
  // Validate required fields
  const ageValidation = validateAge(learnerData.age);
  if (!ageValidation.isValid) {
    errors.push({ field: 'age', message: ageValidation.error });
  } else {
    sanitizedData.age = ageValidation.sanitized;
  }
  
  const employmentValidation = validateEmploymentStatus(learnerData.employmentStatus);
  if (!employmentValidation.isValid) {
    errors.push({ field: 'employmentStatus', message: employmentValidation.error });
  } else {
    sanitizedData.employmentStatus = employmentValidation.sanitized;
  }
  
  const qualificationValidation = validateQualificationLevel(learnerData.qualificationLevel);
  if (!qualificationValidation.isValid) {
    errors.push({ field: 'qualificationLevel', message: qualificationValidation.error });
  } else {
    sanitizedData.qualificationLevel = qualificationValidation.sanitized;
  }
  
  // Validate optional fields
  const incomeValidation = validateMonthlyIncome(learnerData.takeHomePay);
  if (!incomeValidation.isValid) {
    errors.push({ field: 'takeHomePay', message: incomeValidation.error });
  } else {
    sanitizedData.takeHomePay = incomeValidation.sanitized;
  }
  
  const benefitsValidation = validateBenefits(learnerData.benefits);
  if (!benefitsValidation.isValid) {
    errors.push({ field: 'benefits', message: benefitsValidation.error });
  } else {
    sanitizedData.benefits = benefitsValidation.sanitized;
  }
  
  // Boolean fields
  sanitizedData.partnerBenefitClaim = Boolean(learnerData.partnerBenefitClaim);
  sanitizedData.location = learnerData.location || 'england';
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : null
  };
};

/**
 * Validate qualification data object
 * @param {Object} qualificationData - Qualification data to validate
 * @returns {Object} - Validation result
 */
export const validateQualificationData = (qualificationData) => {
  const errors = [];
  const sanitizedData = {};
  
  // Learning Aim Reference validation
  if (qualificationData.learningAimRef) {
    const larValidation = validateLearningAimReference(qualificationData.learningAimRef);
    if (!larValidation.isValid) {
      errors.push({ field: 'learningAimRef', message: larValidation.error });
    } else {
      sanitizedData.learningAimRef = larValidation.sanitized;
    }
  }
  
  // Course title validation
  if (qualificationData.learningAimTitle) {
    const titleValidation = validateCourseTitle(qualificationData.learningAimTitle);
    if (!titleValidation.isValid) {
      errors.push({ field: 'learningAimTitle', message: titleValidation.error });
    } else {
      sanitizedData.learningAimTitle = titleValidation.sanitized;
    }
  }
  
  // Qualification level validation
  if (qualificationData.qualificationLevel) {
    const levelValidation = validateQualificationLevel(qualificationData.qualificationLevel);
    if (!levelValidation.isValid) {
      errors.push({ field: 'qualificationLevel', message: levelValidation.error });
    } else {
      sanitizedData.qualificationLevel = levelValidation.sanitized;
    }
  }
  
  // Numeric field validations
  if (qualificationData.guidedLearningHours !== undefined) {
    const glh = parseInt(qualificationData.guidedLearningHours);
    if (isNaN(glh) || glh < 0 || glh > 2000) {
      errors.push({ field: 'guidedLearningHours', message: 'Guided Learning Hours must be between 0 and 2000' });
    } else {
      sanitizedData.guidedLearningHours = glh;
    }
  }
  
  if (qualificationData.totalQualificationTime !== undefined) {
    const tqt = parseInt(qualificationData.totalQualificationTime);
    if (isNaN(tqt) || tqt < 0 || tqt > 5000) {
      errors.push({ field: 'totalQualificationTime', message: 'Total Qualification Time must be between 0 and 5000' });
    } else {
      sanitizedData.totalQualificationTime = tqt;
    }
  }
  
  // Copy other fields as-is after basic sanitization
  if (qualificationData.awardOrgCode) {
    sanitizedData.awardOrgCode = qualificationData.awardOrgCode.trim().toUpperCase();
  }
  
  if (qualificationData.sector) {
    sanitizedData.sector = qualificationData.sector.trim();
  }
  
  if (qualificationData.status) {
    sanitizedData.status = qualificationData.status.trim();
  }
  
  if (qualificationData.lastNewStartDate) {
    sanitizedData.lastNewStartDate = qualificationData.lastNewStartDate;
  }
  
  if (qualificationData.certificationEndDate) {
    sanitizedData.certificationEndDate = qualificationData.certificationEndDate;
  }
  
  // Copy funding streams object
  if (qualificationData.fundingStreams) {
    sanitizedData.fundingStreams = qualificationData.fundingStreams;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : null
  };
};

/**
 * Sanitize search input
 * @param {string} searchTerm - Search term to sanitize
 * @returns {string} - Sanitized search term
 */
export const sanitizeSearchTerm = (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return '';
  }
  
  return searchTerm
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 100); // Limit length
};

/**
 * Check if learner data is complete enough for assessment
 * @param {Object} learnerData - Learner data to check
 * @returns {Object} - Completeness check result
 */
export const checkDataCompleteness = (learnerData) => {
  const requiredFields = ['age', 'employmentStatus', 'qualificationLevel'];
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!learnerData[field] || learnerData[field] === '') {
      missingFields.push(field);
    }
  });
  
  const isComplete = missingFields.length === 0;
  const completionPercentage = Math.round(
    ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
  );
  
  return {
    isComplete,
    missingFields,
    completionPercentage,
    canProceed: completionPercentage >= 100 // Could be adjusted for partial assessments
  };
};

/**
 * Format validation errors for display
 * @param {Array} errors - Array of validation errors
 * @returns {Object} - Formatted error information
 */
export const formatValidationErrors = (errors) => {
  if (!errors || errors.length === 0) {
    return { hasErrors: false, summary: '', details: [] };
  }
  
  const summary = errors.length === 1 
    ? '1 validation error found'
    : `${errors.length} validation errors found`;
    
  const details = errors.map(error => ({
    field: error.field,
    message: error.message,
    displayName: formatFieldName(error.field)
  }));
  
  return {
    hasErrors: true,
    summary,
    details,
    count: errors.length
  };
};

/**
 * Convert field names to user-friendly display names
 * @param {string} fieldName - Internal field name
 * @returns {string} - User-friendly field name
 */
export const formatFieldName = (fieldName) => {
  const fieldMappings = {
    age: 'Age',
    employmentStatus: 'Employment Status',
    takeHomePay: 'Monthly Take-Home Pay',
    qualificationLevel: 'Qualification Level',
    benefits: 'Benefits',
    partnerBenefitClaim: 'Partner Benefit Claim',
    learningAimRef: 'Learning Aim Reference',
    learningAimTitle: 'Course Title',
    guidedLearningHours: 'Guided Learning Hours',
    totalQualificationTime: 'Total Qualification Time'
  };
  
  return fieldMappings[fieldName] || fieldName;
};