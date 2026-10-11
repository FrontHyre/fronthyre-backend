/**
 * Maps common FE (camelCase) keys to API snake_case before validation.
 */
function normalizeEarlyAccessBody(body) {
  if (!body || typeof body !== 'object') {
    return {};
  }

  return {
    ...body,
    full_name: body.full_name ?? body.fullName,
    email: body.email,
    mobile_number: body.mobile_number ?? body.mobileNumber,
    current_role: body.current_role ?? body.currentRole,
    years_of_experience: body.years_of_experience ?? body.yearsOfExperience,
    experience_level: body.experience_level ?? body.experienceLevel,
    primary_skills: body.primary_skills ?? body.primarySkills,
    secondary_skills: body.secondary_skills ?? body.secondarySkills,
    pref_location: body.pref_location ?? body.prefLocation ?? body.preferred_location,
    work_preference: body.work_preference ?? body.workPreference,
    job_search_status: body.job_search_status ?? body.jobSearchStatus,
    notice_period: body.notice_period ?? body.noticePeriod,
    linkedin_url: body.linkedin_url ?? body.linkedinUrl ?? body.linkedin,
    github_url: body.github_url ?? body.githubUrl ?? body.github,
    portfolio_url: body.portfolio_url ?? body.portfolioUrl ?? body.portfolio,
    other_relevant_url: body.other_relevant_url ?? body.otherRelevantUrl,
    consent_age_18_or_older:
      body.consent_age_18_or_older ?? body.consentAge18OrOlder,
    consent_privacy_and_data_processing:
      body.consent_privacy_and_data_processing ??
      body.consentPrivacyAndDataProcessing,
    consent_marketing_communications:
      body.consent_marketing_communications ?? body.consentMarketingCommunications,
    consent_job_matching: body.consent_job_matching ?? body.consentJobMatching,
    preferred_track: body.preferred_track ?? body.preferredTrack
  };
}

module.exports = { normalizeEarlyAccessBody };
