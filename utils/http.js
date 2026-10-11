const { pushError } = require('./validationErrors');

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  return req.socket?.remoteAddress || null;
}

function parseBooleanField(value, fieldName) {
  if (value === true || value === 'true' || value === '1' || value === 1) {
    return true;
  }
  if (value === 'on' || value === 'yes') {
    return true;
  }
  if (value === false || value === 'false' || value === '0' || value === 0) {
    return false;
  }
  throw new Error(fieldName);
}

function parseRequiredBoolean(raw, field, errors) {
  if (raw === undefined || raw === null || raw === '') {
    pushError(errors, field, requiredConsentMessage(field));
    return null;
  }
  try {
    const value = parseBooleanField(raw, field);
    if (!value) {
      pushError(errors, field, requiredConsentMessage(field, true));
    }
    return value;
  } catch {
    pushError(errors, field, invalidConsentMessage(field));
    return null;
  }
}

function parseOptionalBoolean(raw, field, errors) {
  if (raw === undefined || raw === null || raw === '') {
    return false;
  }
  try {
    return parseBooleanField(raw, field);
  } catch {
    pushError(errors, field, invalidConsentMessage(field));
    return false;
  }
}

function requiredConsentMessage(field, mustBeChecked) {
  if (field === 'consent_age_18_or_older') {
    return mustBeChecked
      ? 'You must confirm that you are 18 years of age or older.'
      : 'Please confirm that you are 18 years of age or older.';
  }
  if (field === 'consent_privacy_and_data_processing') {
    return mustBeChecked
      ? 'You must accept the Privacy Notice and data processing consent to register.'
      : 'Please accept the Privacy Notice and data processing consent.';
  }
  return mustBeChecked ? 'This consent must be accepted.' : 'This consent is required.';
}

function invalidConsentMessage(field) {
  if (field === 'consent_marketing_communications') {
    return 'Marketing consent must be yes or no.';
  }
  if (field === 'consent_job_matching') {
    return 'Job matching consent must be yes or no.';
  }
  return 'Please update this consent field and try again.';
}

module.exports = {
  getClientIp,
  parseBooleanField,
  parseRequiredBoolean,
  parseOptionalBoolean
};
