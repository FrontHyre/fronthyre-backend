const FIELD_LABELS = {
  full_name: 'Full name',
  email: 'Email',
  mobile_number: 'Mobile number',
  current_role: 'Current role',
  years_of_experience: 'Years of experience',
  experience_level: 'Experience level',
  primary_skills: 'Primary skills',
  secondary_skills: 'Secondary skills',
  pref_location: 'Preferred location',
  work_preference: 'Work preference',
  job_search_status: 'Job search status',
  notice_period: 'Notice period',
  linkedin_url: 'LinkedIn URL',
  github_url: 'GitHub URL',
  portfolio_url: 'Portfolio URL',
  other_relevant_url: 'Other relevant link',
  resume: 'Resume',
  preferred_track: 'Preferred track',
  consent_age_18_or_older: 'Age confirmation',
  consent_privacy_and_data_processing: 'Privacy consent',
  consent_marketing_communications: 'Marketing communications',
  consent_job_matching: 'Job matching consent'
};

function label(field) {
  return FIELD_LABELS[field] || field;
}

function pushError(errors, field, message) {
  errors.push({ field, message });
}

function throwValidation(errors, summary = 'Please correct the errors below.') {
  throw Object.assign(new Error(summary), {
    statusCode: 400,
    errors,
    details: errors.map((e) => e.message)
  });
}

module.exports = {
  FIELD_LABELS,
  label,
  pushError,
  throwValidation
};
