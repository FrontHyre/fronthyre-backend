const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const env = require('../config/env');

function ensureLocalResumeDir() {
  const dir = path.join(process.cwd(), env.storage.localDir, 'resumes');
  fs.mkdirSync(dir, { recursive: true });
}

async function saveResume(file) {
  if (!file) {
    return null;
  }

  if (env.storage.driver === 's3') {
    // S3 upload can be wired when bucket credentials are available in production.
    // For now, persist locally with a stable key prefix for future migration.
    ensureLocalResumeDir();
    const key = `${env.storage.s3.resumePrefix}${randomUUID()}${path.extname(file.originalname || '')}`;
    const dest = path.join(process.cwd(), env.storage.localDir, key);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(file.path, dest);
    return {
      storageKey: key,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size
    };
  }

  ensureLocalResumeDir();
  const relativeKey = path.join('resumes', path.basename(file.path)).replace(/\\/g, '/');
  return {
    storageKey: relativeKey,
    originalFilename: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size
  };
}

module.exports = { saveResume, ensureLocalResumeDir };
