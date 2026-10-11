const { parseRequiredBoolean, parseOptionalBoolean } = require('../utils/http');
const { normalizeEarlyAccessBody } = require('../utils/normalizeEarlyAccessBody');
const { parseCareerDropdownFields, parsePrefLocation } = require('./careerFields');
const env = require('../config/env');
const { optionalUrl } = require('../utils/optionalUrl');
const { pushError, throwValidation } = require('../utils/validationErrors');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateEarlyAccessBody(body) {
  const errors = [];
  const normalized = normalizeEarlyAccessBody(body);

  const fullName = normalized.full_name?.trim();
  const email = normalized.email?.trim().toLowerCase();

  if (!fullName) {
    pushError(errors, 'full_name', 'Please enter your full name.');
  }
  if (!email) {
    pushError(errors, 'email', 'Please enter your email address.');
  } else if (!isValidEmail(email)) {
    pushError(errors, 'email', 'Please enter a valid email address.');
  }

  const consentAge = parseRequiredBoolean(
    normalized.consent_age_18_or_older,
    'consent_age_18_or_older',
    errors
  );
  const consentPrivacy = parseRequiredBoolean(
    normalized.consent_privacy_and_data_processing,
    'consent_privacy_and_data_processing',
    errors
  );

  const consentMarketing = parseOptionalBoolean(
    normalized.consent_marketing_communications,
    'consent_marketing_communications',
    errors
  );
  const consentJobMatching = parseOptionalBoolean(
    normalized.consent_job_matching,
    'consent_job_matching',
    errors
  );

  const careerFields = parseCareerDropdownFields(normalized, errors);

  let yearsOfExperience = null;
  if (normalized.years_of_experience !== undefined && normalized.years_of_experience !== '') {
    yearsOfExperience = Number(normalized.years_of_experience);
    if (Number.isNaN(yearsOfExperience) || yearsOfExperience < 0 || yearsOfExperience > 60) {
      pushError(
        errors,
        'years_of_experience',
        'Years of experience must be a number between 0 and 60.'
      );
    }
  }

  const linkedinUrl = optionalUrl(normalized.linkedin_url, 'linkedin_url', errors);
  const githubUrl = optionalUrl(normalized.github_url, 'github_url', errors);
  const portfolioUrl = optionalUrl(normalized.portfolio_url, 'portfolio_url', errors);
  const otherRelevantUrl = optionalUrl(
    normalized.other_relevant_url,
    'other_relevant_url',
    errors
  );

  if (errors.length > 0) {
    if (!env.isProduction) {
      console.log('[early-access] validation failed', {
        receivedKeys: Object.keys(body || {}),
        errors
      });
    }
    throwValidation(errors);
  }

  return {
    full_name: fullName,
    email,
    mobile_number: normalized.mobile_number?.trim() || null,
    current_role: normalized.current_role?.trim() || null,
    years_of_experience: yearsOfExperience,
    experience_level: careerFields.experience_level,
    primary_skills_text: normalized.primary_skills,
    secondary_skills_text: normalized.secondary_skills,
    pref_location: parsePrefLocation(normalized),
    work_preference: careerFields.work_preference,
    job_search_status: careerFields.job_search_status,
    notice_period: careerFields.notice_period,
    linkedin_url: linkedinUrl,
    github_url: githubUrl,
    portfolio_url: portfolioUrl,
    other_relevant_url: otherRelevantUrl,
    consent_age_18_or_older: consentAge,
    consent_privacy_and_data_processing: consentPrivacy,
    consent_marketing_communications: consentMarketing,
    consent_job_matching: consentJobMatching
  };
}

module.exports = { validateEarlyAccessBody };
