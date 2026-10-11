const path = require('path');
const multer = require('multer');
const { randomUUID } = require('crypto');
const env = require('../config/env');

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const { ensureLocalResumeDir } = require('../services/storageService');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureLocalResumeDir();
    const dir = path.join(process.cwd(), env.storage.localDir, 'resumes');
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${randomUUID()}${ext.toLowerCase()}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      const err = new Error(
        'Resume must be a PDF, DOC, or DOCX file. Please upload a supported format.'
      );
      err.statusCode = 400;
      err.errors = [
        {
          field: 'resume',
          message:
            'Resume must be a PDF, DOC, or DOCX file. Please upload a supported format.'
        }
      ];
      return cb(err);
    }
    cb(null, true);
  }
});

module.exports = upload;
