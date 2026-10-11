const { randomUUID } = require('crypto');
const { pool } = require('../config/database');
const { parseCommaSeparatedSkills } = require('../utils/skills');

const PUBLIC_COLUMNS = `
  public_id,
  full_name,
  email,
  mobile_number,
  current_role,
  years_of_experience,
  experience_level,
  primary_skills_text,
  secondary_skills_text,
  pref_location,
  work_preference,
  job_search_status,
  notice_period,
  linkedin_url,
  github_url,
  portfolio_url,
  other_relevant_url,
  resume_original_filename,
  consent_marketing_communications,
  consent_job_matching,
  created_at
`;

async function createSubmission(payload, resumeMeta, meta) {
  const publicId = randomUUID();
  const primary = parseCommaSeparatedSkills(payload.primary_skills_text);
  const secondary = parseCommaSeparatedSkills(payload.secondary_skills_text);

  const sql = `
    INSERT INTO professional_early_access_submissions (
      public_id,
      full_name,
      email,
      mobile_number,
      current_role,
      years_of_experience,
      experience_level,
      primary_skills_text,
      primary_skills_json,
      secondary_skills_text,
      secondary_skills_json,
      pref_location,
      work_preference,
      job_search_status,
      notice_period,
      linkedin_url,
      github_url,
      portfolio_url,
      other_relevant_url,
      resume_storage_key,
      resume_original_filename,
      resume_mime_type,
      resume_size_bytes,
      consent_age_18_or_older,
      consent_privacy_and_data_processing,
      consent_marketing_communications,
      consent_job_matching,
      source_ip,
      user_agent
    ) VALUES (
      :public_id,
      :full_name,
      :email,
      :mobile_number,
      :current_role,
      :years_of_experience,
      :experience_level,
      :primary_skills_text,
      :primary_skills_json,
      :secondary_skills_text,
      :secondary_skills_json,
      :pref_location,
      :work_preference,
      :job_search_status,
      :notice_period,
      :linkedin_url,
      :github_url,
      :portfolio_url,
      :other_relevant_url,
      :resume_storage_key,
      :resume_original_filename,
      :resume_mime_type,
      :resume_size_bytes,
      :consent_age_18_or_older,
      :consent_privacy_and_data_processing,
      :consent_marketing_communications,
      :consent_job_matching,
      :source_ip,
      :user_agent
    )
  `;

  try {
    await pool.execute(sql, {
      public_id: publicId,
      full_name: payload.full_name,
      email: payload.email,
      mobile_number: payload.mobile_number,
      current_role: payload.current_role,
      years_of_experience: payload.years_of_experience,
      experience_level: payload.experience_level,
      primary_skills_text: primary.text,
      primary_skills_json: primary.json,
      secondary_skills_text: secondary.text,
      secondary_skills_json: secondary.json,
      pref_location: payload.pref_location,
      work_preference: payload.work_preference,
      job_search_status: payload.job_search_status,
      notice_period: payload.notice_period,
      linkedin_url: payload.linkedin_url,
      github_url: payload.github_url,
      portfolio_url: payload.portfolio_url,
      other_relevant_url: payload.other_relevant_url,
      resume_storage_key: resumeMeta?.storageKey || null,
      resume_original_filename: resumeMeta?.originalFilename || null,
      resume_mime_type: resumeMeta?.mimeType || null,
      resume_size_bytes: resumeMeta?.sizeBytes || null,
      consent_age_18_or_older: payload.consent_age_18_or_older ? 1 : 0,
      consent_privacy_and_data_processing: payload.consent_privacy_and_data_processing ? 1 : 0,
      consent_marketing_communications: payload.consent_marketing_communications ? 1 : 0,
      consent_job_matching: payload.consent_job_matching ? 1 : 0,
      source_ip: meta.sourceIp,
      user_agent: meta.userAgent
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      const duplicate = new Error('Duplicate email');
      duplicate.code = 'DUPLICATE_EMAIL';
      throw duplicate;
    }
    throw err;
  }

  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM professional_early_access_submissions WHERE public_id = ?`,
    [publicId]
  );

  return rows[0];
}

async function listSubmissions({ page = 1, limit = 20, jobSearchStatus, experienceLevel }) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const offset = (safePage - 1) * safeLimit;

  const where = [];
  const params = [];

  if (jobSearchStatus) {
    where.push('job_search_status = ?');
    params.push(jobSearchStatus);
  }
  if (experienceLevel) {
    where.push('experience_level = ?');
    params.push(experienceLevel);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM professional_early_access_submissions ${whereSql}`,
    params
  );

  const [rows] = await pool.query(
    `
    SELECT ${PUBLIC_COLUMNS}
    FROM professional_early_access_submissions
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...params, safeLimit, offset]
  );

  return {
    data: rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: countRows[0].total
    }
  };
}

async function getByPublicId(publicId) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM professional_early_access_submissions WHERE public_id = ?`,
    [publicId]
  );
  return rows[0] || null;
}

module.exports = {
  createSubmission,
  listSubmissions,
  getByPublicId
};
