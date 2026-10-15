const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const env = require('../config/env');

let s3Client = null;
if (env.storage.driver === 's3') {
  const { S3Client } = require('@aws-sdk/client-s3');
  s3Client = new S3Client({ region: env.storage.s3.region });
}

function ensureLocalResumeDir() {
  const dir = path.join(process.cwd(), env.storage.localDir, 'resumes');
  fs.mkdirSync(dir, { recursive: true });
}

async function saveResume(file) {
  if (!file) return null;

  if (env.storage.driver === 's3') {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const key = `${env.storage.s3.resumePrefix}${randomUUID()}${path.extname(file.originalname || '')}`;

    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: env.storage.s3.bucket,
        Key: key,
        Body: fs.readFileSync(file.path),
        ContentType: file.mimetype,
        Metadata: {
          originalFilename: file.originalname || 'unknown'
        }
      }));

      try { fs.unlinkSync(file.path); } catch (e) {}

      return {
        storageKey: key,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storage: 's3'
      };
    } catch (err) {
      console.error('[storageService] S3 upload failed:', err.message);
      ensureLocalResumeDir();
      const dest = path.join(process.cwd(), env.storage.localDir, key);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(file.path, dest);
      return {
        storageKey: key,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storage: 'local-fallback'
      };
    }
  }

  ensureLocalResumeDir();
  const relativeKey = path.join('resumes', path.basename(file.path)).replace(/\\/g, '/');
  return {
    storageKey: relativeKey,
    originalFilename: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    storage: 'local'
  };
}

module.exports = { saveResume, ensureLocalResumeDir };
