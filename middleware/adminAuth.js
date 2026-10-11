const env = require('../config/env');

function requireAdminApiKey(req, res, next) {
  if (!env.api.adminKey) {
    return res.status(503).json({
      success: false,
      error: 'Admin API is not configured (ADMIN_API_KEY missing)'
    });
  }

  const key = req.headers['x-admin-api-key'];
  if (key !== env.api.adminKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized.',
      errors: [{ field: '_auth', message: 'Invalid or missing admin API key.' }]
    });
  }

  next();
}

module.exports = requireAdminApiKey;
