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
  preferred_track,
  pref_location,
  work_preference,
  job_search_status,
  notice_period,
  linkedin_url,
  github_url,
  portfolio_url,
  consent_marketing_communications,
  created_at
`;

async function createRegistration(payload, meta) {
  const publicId = randomUUID();
  const primary = parseCommaSeparatedSkills(payload.primary_skills_text);

  const sql = `
    INSERT INTO professional_buildathon_registrations (
      public_id,
      full_name,
      email,
      mobile_number,
      current_role,
      years_of_experience,
      experience_level,
      primary_skills_text,
      primary_skills_json,
      preferred_track,
      pref_location,
      work_preference,
      job_search_status,
      notice_period,
      linkedin_url,
      github_url,
      portfolio_url,
      consent_age_18_or_older,
      consent_privacy_and_data_processing,
      consent_marketing_communications,
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
      :preferred_track,
      :pref_location,
      :work_preference,
      :job_search_status,
      :notice_period,
      :linkedin_url,
      :github_url,
      :portfolio_url,
      :consent_age_18_or_older,
      :consent_privacy_and_data_processing,
      :consent_marketing_communications,
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
      preferred_track: payload.preferred_track,
      pref_location: payload.pref_location,
      work_preference: payload.work_preference,
      job_search_status: payload.job_search_status,
      notice_period: payload.notice_period,
      linkedin_url: payload.linkedin_url,
      github_url: payload.github_url,
      portfolio_url: payload.portfolio_url,
      consent_age_18_or_older: payload.consent_age_18_or_older ? 1 : 0,
      consent_privacy_and_data_processing: payload.consent_privacy_and_data_processing ? 1 : 0,
      consent_marketing_communications: payload.consent_marketing_communications ? 1 : 0,
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
    `SELECT ${PUBLIC_COLUMNS} FROM professional_buildathon_registrations WHERE public_id = ?`,
    [publicId]
  );

  return rows[0];
}

async function listRegistrations({ page = 1, limit = 20, preferredTrack }) {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const offset = (safePage - 1) * safeLimit;

  const where = [];
  const params = [];

  if (preferredTrack) {
    where.push('preferred_track = ?');
    params.push(preferredTrack);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM professional_buildathon_registrations ${whereSql}`,
    params
  );

  const [rows] = await pool.query(
    `
    SELECT ${PUBLIC_COLUMNS}
    FROM professional_buildathon_registrations
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

module.exports = { createRegistration, listRegistrations };
