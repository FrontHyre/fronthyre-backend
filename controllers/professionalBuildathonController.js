const buildathonService = require('../services/professionalBuildathonService');
const { validateBuildathonBody } = require('../validators/professionalBuildathonValidator');
const { getClientIp } = require('../utils/http');

exports.submit = async (req, res) => {
  const payload = validateBuildathonBody(req.body);
  const record = await buildathonService.createRegistration(payload, {
    sourceIp: getClientIp(req),
    userAgent: req.headers['user-agent'] || null
  });

  res.status(201).json({
    success: true,
    data: record
  });
};

exports.list = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await buildathonService.listRegistrations({
    page,
    limit,
    preferredTrack: req.query.preferred_track
  });

  res.json({ success: true, ...result });
};

exports.getFormOptions = (_req, res) => {
  const enums = require('../config/enums');
  res.json({
    success: true,
    data: {
      experience_level: enums.EXPERIENCE_LEVEL_OPTIONS,
      work_preference: enums.WORK_PREFERENCE_OPTIONS,
      job_search_status: enums.JOB_SEARCH_STATUS_OPTIONS,
      notice_period: enums.NOTICE_PERIOD_OPTIONS,
      preferred_track: enums.BUILDATHON_TRACK_OPTIONS
    }
  });
};
