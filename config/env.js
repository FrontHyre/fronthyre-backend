const path = require('path');
const dotenv = require('dotenv');

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile =
  nodeEnv === 'production'
    ? '.env.production'
    : nodeEnv === 'test'
      ? '.env.test'
      : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config();

const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'frontyre_dev',
    connectionLimit: Number(process.env.DB_POOL_SIZE) || 10
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || (nodeEnv === 'production' ? 's3' : 'local'),
    localDir: process.env.LOCAL_UPLOAD_DIR || 'uploads',
    s3: {
      bucket: process.env.AWS_S3_BUCKET || '',
      region: process.env.AWS_REGION || 'ap-south-1',
      resumePrefix: process.env.S3_RESUME_PREFIX || 'resumes/'
    }
  },
  api: {
    adminKey: process.env.ADMIN_API_KEY || ''
  },
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

module.exports = env;
