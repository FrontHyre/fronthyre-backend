/** API values (snake_case) — send these in POST body; labels match Early Access UI */

const EXPERIENCE_LEVEL_OPTIONS = [
  { value: 'entry', label: 'Entry (0-1 years)' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid', label: 'Mid (3-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead_staff', label: 'Lead / Staff (8+ years)' }
];

const WORK_PREFERENCE_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on_site', label: 'On-site' },
  { value: 'open_to_all', label: 'Open to all' }
];

const JOB_SEARCH_STATUS_OPTIONS = [
  { value: 'actively_looking', label: 'Actively looking' },
  { value: 'passively_exploring', label: 'Passively exploring' },
  { value: 'not_looking', label: 'Not looking right now' }
];

const NOTICE_PERIOD_OPTIONS = [
  { value: 'immediately_available', label: 'Immediately available' },
  { value: '15_days', label: '15 days' },
  { value: '30_days', label: '30 days' },
  { value: '60_days', label: '60 days' },
  { value: '90_days', label: '90 days' }
];

const BUILDATHON_TRACK_OPTIONS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'full_stack', label: 'Full stack' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'ai_ml', label: 'AI / ML' },
  { value: 'open', label: 'Open' }
];

const EXPERIENCE_LEVELS = EXPERIENCE_LEVEL_OPTIONS.map((o) => o.value);
const WORK_PREFERENCES = WORK_PREFERENCE_OPTIONS.map((o) => o.value);
const JOB_SEARCH_STATUSES = JOB_SEARCH_STATUS_OPTIONS.map((o) => o.value);
const NOTICE_PERIODS = NOTICE_PERIOD_OPTIONS.map((o) => o.value);
const BUILDATHON_TRACKS = BUILDATHON_TRACK_OPTIONS.map((o) => o.value);

module.exports = {
  EXPERIENCE_LEVEL_OPTIONS,
  WORK_PREFERENCE_OPTIONS,
  JOB_SEARCH_STATUS_OPTIONS,
  NOTICE_PERIOD_OPTIONS,
  BUILDATHON_TRACK_OPTIONS,
  EXPERIENCE_LEVELS,
  WORK_PREFERENCES,
  JOB_SEARCH_STATUSES,
  NOTICE_PERIODS,
  BUILDATHON_TRACKS
};
