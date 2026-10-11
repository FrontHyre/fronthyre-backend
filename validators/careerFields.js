const {
  EXPERIENCE_LEVELS,
  WORK_PREFERENCES,
  JOB_SEARCH_STATUSES,
  NOTICE_PERIODS,
  EXPERIENCE_LEVEL_OPTIONS,
  WORK_PREFERENCE_OPTIONS,
  JOB_SEARCH_STATUS_OPTIONS,
  NOTICE_PERIOD_OPTIONS
} = require('../config/enums');
const { pushError } = require('../utils/validationErrors');

function allowedLabels(options) {
  return options.map((o) => o.label).join(', ');
}

function validateOptionalEnum(value, allowed, field, options, errors) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (!allowed.includes(value)) {
    pushError(
      errors,
      field,
      `Please choose a valid ${friendlyName(field)}. Allowed: ${allowedLabels(options)}.`
    );
    return null;
  }
  return value;
}

function friendlyName(field) {
  const names = {
    experience_level: 'experience level',
    work_preference: 'work preference',
    job_search_status: 'job search status',
    notice_period: 'notice period',
    preferred_track: 'track'
  };
  return names[field] || field;
}

function parseCareerDropdownFields(body, errors) {
  const experienceLevel = validateOptionalEnum(
    body.experience_level,
    EXPERIENCE_LEVELS,
    'experience_level',
    EXPERIENCE_LEVEL_OPTIONS,
    errors
  );
  const workPreference = validateOptionalEnum(
    body.work_preference,
    WORK_PREFERENCES,
    'work_preference',
    WORK_PREFERENCE_OPTIONS,
    errors
  );
  const jobSearchStatus = validateOptionalEnum(
    body.job_search_status,
    JOB_SEARCH_STATUSES,
    'job_search_status',
    JOB_SEARCH_STATUS_OPTIONS,
    errors
  );
  const noticePeriod = validateOptionalEnum(
    body.notice_period,
    NOTICE_PERIODS,
    'notice_period',
    NOTICE_PERIOD_OPTIONS,
    errors
  );

  return {
    experience_level: experienceLevel,
    work_preference: workPreference,
    job_search_status: jobSearchStatus,
    notice_period: noticePeriod
  };
}

function parsePrefLocation(body) {
  const raw = body.pref_location ?? body.preferred_location;
  return raw?.trim() || null;
}

module.exports = { parseCareerDropdownFields, parsePrefLocation };
