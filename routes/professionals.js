const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const requireAdminApiKey = require('../middleware/adminAuth');
const uploadResume = require('../middleware/uploadResume');
const earlyAccessController = require('../controllers/professionalEarlyAccessController');
const buildathonController = require('../controllers/professionalBuildathonController');

const router = express.Router();

router.get(
  '/early-access/form-options',
  asyncHandler(earlyAccessController.getFormOptions)
);

router.post(
  '/early-access',
  uploadResume.single('resume'),
  asyncHandler(earlyAccessController.submit)
);

router.get(
  '/early-access',
  requireAdminApiKey,
  asyncHandler(earlyAccessController.list)
);

router.get(
  '/early-access/:publicId',
  requireAdminApiKey,
  asyncHandler(earlyAccessController.getOne)
);

router.get(
  '/buildathon/form-options',
  asyncHandler(buildathonController.getFormOptions)
);

router.post('/buildathon', asyncHandler(buildathonController.submit));

router.get(
  '/buildathon',
  requireAdminApiKey,
  asyncHandler(buildathonController.list)
);

module.exports = router;
