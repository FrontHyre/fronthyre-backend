CREATE TABLE IF NOT EXISTS professional_early_access_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id CHAR(36) NOT NULL,

  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(32) NULL,

  current_role VARCHAR(200) NULL,
  years_of_experience DECIMAL(4,1) NULL,
  experience_level ENUM(
    'entry',
    'junior',
    'mid',
    'senior',
    'lead_staff'
  ) NULL,

  primary_skills_text TEXT NULL,
  primary_skills_json JSON NULL,
  secondary_skills_text TEXT NULL,
  secondary_skills_json JSON NULL,

  pref_location VARCHAR(255) NULL,
  work_preference ENUM('remote', 'hybrid', 'on_site', 'open_to_all') NULL,
  job_search_status ENUM(
    'actively_looking',
    'passively_exploring',
    'not_looking'
  ) NULL,
  notice_period ENUM(
    'immediately_available',
    '15_days',
    '30_days',
    '60_days',
    '90_days'
  ) NULL,

  linkedin_url VARCHAR(512) NULL,
  github_url VARCHAR(512) NULL,
  portfolio_url VARCHAR(512) NULL,
  other_relevant_url VARCHAR(512) NULL,

  resume_storage_key VARCHAR(512) NULL,
  resume_original_filename VARCHAR(255) NULL,
  resume_mime_type VARCHAR(128) NULL,
  resume_size_bytes INT UNSIGNED NULL,

  consent_age_18_or_older TINYINT(1) NOT NULL DEFAULT 0,
  consent_privacy_and_data_processing TINYINT(1) NOT NULL DEFAULT 0,
  consent_marketing_communications TINYINT(1) NOT NULL DEFAULT 0,
  consent_job_matching TINYINT(1) NOT NULL DEFAULT 0,
  consents_recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  source_ip VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_pea_public_id (public_id),
  UNIQUE KEY uk_pea_email (email),
  KEY idx_pea_created_at (created_at),
  KEY idx_pea_experience_level (experience_level),
  KEY idx_pea_job_search_status (job_search_status),
  KEY idx_pea_work_preference (work_preference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
