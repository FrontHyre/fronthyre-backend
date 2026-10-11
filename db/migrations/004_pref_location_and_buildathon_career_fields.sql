-- Early Access: rename preferred_location when present
SET @ea_has_old_col := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'professional_early_access_submissions'
    AND COLUMN_NAME = 'preferred_location'
);
SET @ea_sql := IF(
  @ea_has_old_col > 0,
  'ALTER TABLE professional_early_access_submissions CHANGE COLUMN preferred_location pref_location VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE ea_stmt FROM @ea_sql;
EXECUTE ea_stmt;
DEALLOCATE PREPARE ea_stmt;

-- Buildathon: drop team_name when present
SET @pbr_has_team := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'professional_buildathon_registrations'
    AND COLUMN_NAME = 'team_name'
);
SET @pbr_drop_team := IF(
  @pbr_has_team > 0,
  'ALTER TABLE professional_buildathon_registrations DROP COLUMN team_name',
  'SELECT 1'
);
PREPARE pbr_drop_stmt FROM @pbr_drop_team;
EXECUTE pbr_drop_stmt;
DEALLOCATE PREPARE pbr_drop_stmt;

-- Buildathon: rename city -> pref_location when present
SET @pbr_has_city := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'professional_buildathon_registrations'
    AND COLUMN_NAME = 'city'
);
SET @pbr_rename_city := IF(
  @pbr_has_city > 0,
  'ALTER TABLE professional_buildathon_registrations CHANGE COLUMN city pref_location VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE pbr_city_stmt FROM @pbr_rename_city;
EXECUTE pbr_city_stmt;
DEALLOCATE PREPARE pbr_city_stmt;

-- Buildathon: add career dropdown columns when missing
SET @pbr_has_exp := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'professional_buildathon_registrations'
    AND COLUMN_NAME = 'experience_level'
);
SET @pbr_add_career := IF(
  @pbr_has_exp = 0,
  'ALTER TABLE professional_buildathon_registrations
    ADD COLUMN experience_level ENUM(
      ''entry'',''junior'',''mid'',''senior'',''lead_staff''
    ) NULL AFTER years_of_experience,
    ADD COLUMN work_preference ENUM(''remote'',''hybrid'',''on_site'',''open_to_all'') NULL AFTER pref_location,
    ADD COLUMN job_search_status ENUM(
      ''actively_looking'',''passively_exploring'',''not_looking''
    ) NULL AFTER work_preference,
    ADD COLUMN notice_period ENUM(
      ''immediately_available'',''15_days'',''30_days'',''60_days'',''90_days''
    ) NULL AFTER job_search_status',
  'SELECT 1'
);
PREPARE pbr_career_stmt FROM @pbr_add_career;
EXECUTE pbr_career_stmt;
DEALLOCATE PREPARE pbr_career_stmt;
