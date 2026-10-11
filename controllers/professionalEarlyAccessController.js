const earlyAccessService = require('../services/professionalEarlyAccessService');
const { validateEarlyAccessBody } = require('../validators/professionalEarlyAccessValidator');
const { saveResume } = require('../services/storageService');
const { getClientIp } = require('../utils/http');

exports.submit = async (req, res) => {
  const payload = validateEarlyAccessBody(req.body);
  const resumeMeta = await saveResume(req.file);

  const record = await earlyAccessService.createSubmission(payload, resumeMeta, {
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

  const result = await earlyAccessService.listSubmissions({
    page,
    limit,
    jobSearchStatus: req.query.job_search_status,
    experienceLevel: req.query.experience_level
  });

  res.json({ success: true, ...result });
};

exports.getOne = async (req, res) => {
  const record = await earlyAccessService.getByPublicId(req.params.publicId);
  if (!record) {
    return res.status(404).json({ success: false, error: 'Submission not found' });
  }
  res.json({ success: true, data: record });
};

exports.getFormOptions = (_req, res) => {
  const enums = require('../config/enums');
  res.json({
    success: true,
    data: {
      experience_level: enums.EXPERIENCE_LEVEL_OPTIONS,
      work_preference: enums.WORK_PREFERENCE_OPTIONS,
      job_search_status: enums.JOB_SEARCH_STATUS_OPTIONS,
      notice_period: enums.NOTICE_PERIOD_OPTIONS
    }
  });
};
