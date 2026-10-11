const { runMigrations } = require('../config/database');

runMigrations()
  .then(() => {
    console.log('[db] Migrations complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[db] Migration failed:', err);
    process.exit(1);
  });
