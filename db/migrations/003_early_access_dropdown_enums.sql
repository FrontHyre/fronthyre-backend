-- Align dropdown ENUMs with Early Access UI (safe if 001 already applied with old values)

UPDATE professional_early_access_submissions
SET experience_level = 'lead_staff'
WHERE experience_level IN ('lead', 'executive');

UPDATE professional_early_access_submissions
SET experience_level = 'entry'
WHERE experience_level = 'intern';

UPDATE professional_early_access_submissions
SET job_search_status = 'passively_exploring'
WHERE job_search_status = 'open_to_opportunities';

UPDATE professional_early_access_submissions
SET notice_period = 'immediately_available'
WHERE notice_period = 'immediate';

UPDATE professional_early_access_submissions
SET notice_period = '90_days'
WHERE notice_period = 'more_than_90_days';

ALTER TABLE professional_early_access_submissions
  MODIFY experience_level ENUM(
    'entry',
    'junior',
    'mid',
    'senior',
    'lead_staff'
  ) NULL,
  MODIFY work_preference ENUM('remote', 'hybrid', 'on_site', 'open_to_all') NULL,
  MODIFY job_search_status ENUM(
    'actively_looking',
    'passively_exploring',
    'not_looking'
  ) NULL,
  MODIFY notice_period ENUM(
    'immediately_available',
    '15_days',
    '30_days',
    '60_days',
    '90_days'
  ) NULL;
