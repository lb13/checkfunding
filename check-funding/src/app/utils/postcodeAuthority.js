import postcodeMap from '../data/postcode_authorities.json';

export function lookupPostcodeAuthority(postcode) {
  if (!postcode) return null;
  const normalized = postcode.replace(/\s+/g, '').toUpperCase();
  return postcodeMap[normalized] || null;
}