// --- Funding route definitions ---
const FUNDING_ROUTES = [
  {
    id: '16-19',
    label: '16-19 Education Funding',
    check: (learner, qual) => {
      const age = parseInt(learner.age);
      if (age < 16 || age > 18) return { eligible: false, reason: 'Must be aged 16-18' };
      if (!isUKResident(learner)) return { eligible: false, reason: 'Not a UK resident' };
      if (hasLevel3OrAbove(learner)) return { eligible: false, reason: 'Already has Level 3+' };
      if (!qual.compatible16to19) return { eligible: false, reason: 'Qualification not eligible for 16-19 funding' };
      return { eligible: true, reason: 'Eligible for 16-19 funding' };
    }
  },
  {
    id: 'asf',
    label: 'Adult Skills Fund',
    check: (learner, qual) => {
      const age = parseInt(learner.age);
      if (age < 19) return { eligible: false, reason: 'Must be aged 19 or over' };
      if (!isUKResident(learner)) return { eligible: false, reason: 'Not a UK resident' };
      if (!qual.compatibleASF) return { eligible: false, reason: 'Qualification not eligible for ASF' };
      if (isDevolvedArea(learner.postcode)) {
        return { eligible: false, reason: 'Check devolved authority funding' };
      }
      return { eligible: true, reason: 'Eligible for Adult Skills Fund' };
    }
  },
  {
    id: 'apprenticeship',
    label: 'Apprenticeship Funding',
    check: (learner, qual) => {
      const age = parseInt(learner.age);
      if (age < 16) return { eligible: false, reason: 'Must be aged 16 or over' };
      if (!isUKResident(learner)) return { eligible: false, reason: 'Not a UK resident' };
      if (!qual.compatibleApprenticeship) return { eligible: false, reason: 'Qualification not eligible for apprenticeship' };
      return { eligible: true, reason: 'Eligible for apprenticeship funding' };
    }
  }
  // Add more funding routes here as needed
];

// --- Helper functions ---
function isUKResident(learner) {
  return learner.nationality === 'UK' || learner.visaType === 'settled';
}

function hasLevel3OrAbove(learner) {
  return ['3', '4', '5', '6', '7', '8', '4+'].includes(learner.qualificationLevel);
}

function isDevolvedArea(postcode) {
  if (!postcode) return false;
  const devolvedPrefixes = ['L', 'M', 'S', 'W', 'NE', 'NW', 'SE', 'SW']; // Example only
  return devolvedPrefixes.some(prefix => postcode.toUpperCase().startsWith(prefix));
}

// --- Main assessment function ---
export function assessLearnerFunding(learnerData, qualificationData) {
  const results = FUNDING_ROUTES.map(route => {
    const { eligible, reason } = route.check(learnerData, qualificationData);
    return {
      id: route.id,
      label: route.label,
      eligible,
      reason
    };
  });

  return {
    eligibleRoutes: results.filter(r => r.eligible),
    ineligibleRoutes: results.filter(r => !r.eligible),
    allResults: results
  };
}