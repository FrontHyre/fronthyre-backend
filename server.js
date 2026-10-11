const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { pool, runMigrations } = require('./config/database');
const { ensureLocalResumeDir } = require('./services/storageService');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((s) => s.trim())
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result, database: env.db.database });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'FrontHyre API is running',
    environment: env.nodeEnv
  });
});

app.use(errorHandler);

const PORT = env.port;

async function start() {
  ensureLocalResumeDir();
  try {
    await runMigrations();
  } catch (err) {
    console.error('[db] Migration failed:', err.message);
    if (env.isProduction) {
      process.exit(1);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (${env.nodeEnv})`);
  });
}

start();
