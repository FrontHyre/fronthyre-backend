const { BUILDATHON_TRACKS, BUILDATHON_TRACK_OPTIONS } = require('../config/enums');
const { parseRequiredBoolean, parseOptionalBoolean } = require('../utils/http');
const { parseCareerDropdownFields, parsePrefLocation } = require('./careerFields');
const { optionalUrl } = require('../utils/optionalUrl');
const { pushError, throwValidation } = require('../utils/validationErrors');
const { normalizeEarlyAccessBody } = require('../utils/normalizeEarlyAccessBody');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateBuildathonBody(body) {
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

  const preferredTrack = normalized.preferred_track || null;
  if (preferredTrack && !BUILDATHON_TRACKS.includes(preferredTrack)) {
    pushError(
      errors,
      'preferred_track',
      `Please choose a valid track. Allowed: ${BUILDATHON_TRACK_OPTIONS.map((o) => o.label).join(', ')}.`
    );
  }

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

  if (errors.length > 0) {
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
    preferred_track: preferredTrack,
    pref_location: parsePrefLocation(normalized),
    work_preference: careerFields.work_preference,
    job_search_status: careerFields.job_search_status,
    notice_period: careerFields.notice_period,
    linkedin_url: linkedinUrl,
    github_url: githubUrl,
    portfolio_url: portfolioUrl,
    consent_age_18_or_older: consentAge,
    consent_privacy_and_data_processing: consentPrivacy,
    consent_marketing_communications: consentMarketing
  };
}

module.exports = { validateBuildathonBody };
